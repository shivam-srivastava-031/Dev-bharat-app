// Supabase Edge Function: rank-feed
// Deploy: supabase functions deploy rank-feed
//
// This runs the recommendation engine SERVER-SIDE so weights stay private.
// The client sends raw feed items + user affinity vectors,
// the server returns ranked items without exposing the algorithm.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// ===== PRIVATE weights — never sent to client =====
const AB_VARIANTS = {
    A: { recency: 0.25, engagement: 0.20, authorAffinity: 0.20, categoryAffinity: 0.15, contentQuality: 0.10 },
    B: { recency: 0.22, engagement: 0.18, authorAffinity: 0.15, categoryAffinity: 0.30, contentQuality: 0.08 },
};
const TRENDING_WEIGHT = 0.15;
const RECENCY_HALF_LIFE_HOURS = 6;

// ===== Scoring functions =====

function recencyScore(createdAt) {
    const ageMs = Date.now() - new Date(createdAt).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    return Math.pow(0.5, ageHours / RECENCY_HALF_LIFE_HOURS);
}

function engagementScore(item) {
    const likes = item.likes || 0;
    const comments = item.comments || 0;
    const shares = item.shares || 0;
    const views = Math.max(item.views || 1, 1);
    const engRate = (likes + comments * 2 + shares * 3) / views;
    return engRate / (engRate + 0.05);
}

function authorAffinityScore(authorId, affinityVectors) {
    const raw = affinityVectors?.author?.[authorId] || 0;
    return Math.tanh(raw / 10);
}

function categoryAffinityScore(category, affinityVectors) {
    if (!category) return 0.5;
    const raw = affinityVectors?.category?.[category] || 0;
    return Math.tanh(raw / 10);
}

function contentQualityScore(item) {
    let score = 0.5;
    if (item.image) score += 0.2;
    if (item.verified) score += 0.15;
    if (item.content && item.content.length > 50) score += 0.1;
    if (item.type === 'news') score += 0.1;
    if (item.type === 'cricket' && item.data?.status === 'Live') score += 0.3;
    return Math.min(score, 1);
}

function globalTrendingScore(item, allItems) {
    const ageMs = Date.now() - new Date(item.createdAt || new Date()).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 3) return 0;

    const recencyMultiplier = Math.pow(0.5, ageHours / 1);
    const totalEng = (item.likes || 0) + (item.comments || 0) * 2 + (item.shares || 0) * 3;
    const allEngagements = allItems.map(i => (i.likes || 0) + (i.comments || 0) * 2 + (i.shares || 0) * 3);
    const sorted = [...allEngagements].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 1;
    const p90 = sorted[Math.floor(sorted.length * 0.9)] || median;

    const velocity = Math.min((totalEng - median) / Math.max(p90 - median, 1), 1);
    if (velocity <= 0) return 0;

    let liveBoost = 1;
    if (item.type === 'cricket' && item.data?.status === 'Live') liveBoost = 2.0;
    if (item.type === 'news' && item.data?.breaking) liveBoost = 1.5;

    return Math.min(velocity * recencyMultiplier * liveBoost, 1);
}

// ===== Diversity pass =====

function diversifyFeed(sorted) {
    const result = [];
    const remaining = [...sorted];
    const topicCountInTop10 = {};

    while (remaining.length > 0) {
        let placed = false;
        for (let i = 0; i < remaining.length; i++) {
            const item = remaining[i];
            const lastItem = result[result.length - 1];
            const itemCategory = item.category || item.type;

            const sameAuthor = lastItem && item.author && lastItem.author === item.author;
            const sameType = lastItem && item.type && lastItem.type === item.type && item.type !== 'post';
            const sessionViolation = result.length < 10 && itemCategory
                && (topicCountInTop10[itemCategory] || 0) >= 3;

            if (!sameAuthor && !sameType && !sessionViolation) {
                result.push(item);
                remaining.splice(i, 1);
                if (result.length <= 10 && itemCategory) {
                    topicCountInTop10[itemCategory] = (topicCountInTop10[itemCategory] || 0) + 1;
                }
                placed = true;
                break;
            }
        }
        if (!placed) {
            const item = remaining.shift();
            result.push(item);
            const cat = item?.category || item?.type;
            if (result.length <= 10 && cat) {
                topicCountInTop10[cat] = (topicCountInTop10[cat] || 0) + 1;
            }
        }
    }
    return result;
}

// ===== Main handler =====

serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        const { items, affinityVectors, negativeIds, suppressedAuthors, suppressedCategories, variant } = await req.json();

        const WEIGHTS = AB_VARIANTS[variant] || AB_VARIANTS.A;
        const negSet = new Set(negativeIds || []);
        const suppAuthors = new Set(suppressedAuthors || []);
        const suppCategories = new Set(suppressedCategories || []);

        // Filter
        let filtered = (items || []).filter(item => {
            if (negSet.has(item.id)) return false;
            if (item.author && suppAuthors.has(item.author)) return false;
            if (item.category && suppCategories.has(item.category)) return false;
            return true;
        });

        // Score
        const scored = filtered.map(item => {
            const rScore = recencyScore(item.createdAt || new Date().toISOString());
            const eScore = engagementScore(item);
            const aScore = authorAffinityScore(item.author || '', affinityVectors || {});
            const cScore = categoryAffinityScore(item.category, affinityVectors || {});
            const qScore = contentQualityScore(item);
            const tScore = globalTrendingScore(item, filtered);

            const totalScore =
                WEIGHTS.recency * rScore +
                WEIGHTS.engagement * eScore +
                WEIGHTS.authorAffinity * aScore +
                WEIGHTS.categoryAffinity * cScore +
                WEIGHTS.contentQuality * qScore +
                TRENDING_WEIGHT * tScore;

            return { ...item, _score: totalScore, _trending: tScore };
        });

        scored.sort((a, b) => b._score - a._score);
        const ranked = diversifyFeed(scored);

        return new Response(JSON.stringify({ ranked, count: ranked.length }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
});
