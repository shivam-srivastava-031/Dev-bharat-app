// Supabase Edge Function: rank-feed (Production-grade with JWT auth)
// Deploy: supabase functions deploy rank-feed
//
// Auth: Validates Supabase JWT on every request.
// Only authenticated users can get personalized rankings.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ===== PRIVATE weights — never sent to client =====
const AB_VARIANTS = {
    A: { recency: 0.25, engagement: 0.20, authorAffinity: 0.20, categoryAffinity: 0.15, contentQuality: 0.10 },
    B: { recency: 0.22, engagement: 0.18, authorAffinity: 0.15, categoryAffinity: 0.30, contentQuality: 0.08 },
};
const TRENDING_WEIGHT = 0.15;
const RECENCY_HALF_LIFE = 6;

// ===== Auth =====

async function authenticateRequest(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.replace('Bearer ', '');

    // Validate JWT with Supabase
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_ANON_KEY') || '',
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
}

// ===== Scoring functions =====

function recencyScore(createdAt) {
    const ageHours = (Date.now() - new Date(createdAt).getTime()) / 3600000;
    return Math.pow(0.5, ageHours / RECENCY_HALF_LIFE);
}

function engagementScore(item) {
    const likes = item.likes || 0;
    const comments = item.comments || 0;
    const shares = item.shares || 0;
    const views = Math.max(item.views || 1, 1);
    const rate = (likes + comments * 2 + shares * 3) / views;
    return rate / (rate + 0.05);
}

function authorAffinityScore(authorId, vectors) {
    const raw = vectors?.author?.[authorId] || 0;
    return Math.tanh(raw / 10);
}

function categoryAffinityScore(category, vectors) {
    if (!category) return 0.5;
    const raw = vectors?.category?.[category] || 0;
    return Math.tanh(raw / 10);
}

function qualityScore(item) {
    let s = 0.5;
    if (item.image) s += 0.2;
    if (item.verified) s += 0.15;
    if (item.content?.length > 50) s += 0.1;
    if (item.type === 'news') s += 0.1;
    if (item.type === 'cricket' && item.data?.status === 'Live') s += 0.3;
    return Math.min(s, 1);
}

function trendingScore(item, allItems) {
    const ageHours = (Date.now() - new Date(item.createdAt || new Date()).getTime()) / 3600000;
    if (ageHours > 3) return 0;
    const decay = Math.pow(0.5, ageHours);
    const eng = (item.likes || 0) + (item.comments || 0) * 2 + (item.shares || 0) * 3;
    const allEng = allItems.map(i => (i.likes || 0) + (i.comments || 0) * 2 + (i.shares || 0) * 3);
    const sorted = [...allEng].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 1;
    const p90 = sorted[Math.floor(sorted.length * 0.9)] || median;
    const velocity = Math.min((eng - median) / Math.max(p90 - median, 1), 1);
    if (velocity <= 0) return 0;
    let live = 1;
    if (item.type === 'cricket' && item.data?.status === 'Live') live = 1.5;
    if (item.type === 'news' && item.data?.breaking) live = 1.4;
    return Math.min(velocity * decay * live, 1);
}

// ===== Diversity pass =====

function diversifyFeed(sorted) {
    const result = [];
    const remaining = [...sorted];
    const topicCount = {};

    while (remaining.length > 0) {
        let placed = false;
        for (let i = 0; i < remaining.length; i++) {
            const item = remaining[i];
            const last = result[result.length - 1];
            const cat = item.category || item.type;
            const sameAuthor = last && item.author && last.author === item.author;
            const sameType = last && item.type && last.type === item.type && item.type !== 'post';
            const sessionViolation = result.length < 10 && cat && (topicCount[cat] || 0) >= 3;

            if (!sameAuthor && !sameType && !sessionViolation) {
                result.push(item);
                remaining.splice(i, 1);
                if (result.length <= 10 && cat) topicCount[cat] = (topicCount[cat] || 0) + 1;
                placed = true;
                break;
            }
        }
        if (!placed) {
            const item = remaining.shift();
            result.push(item);
            const c = item?.category || item?.type;
            if (result.length <= 10 && c) topicCount[c] = (topicCount[c] || 0) + 1;
        }
    }
    return result;
}

// ===== Main handler =====

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }

    try {
        // 🔒 Auth check
        const user = await authenticateRequest(req);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
            });
        }

        const { items, affinityVectors, negativeIds, suppressedAuthors, suppressedCategories, variant } = await req.json();

        const WEIGHTS = AB_VARIANTS[variant] || AB_VARIANTS.A;
        const negSet = new Set(negativeIds || []);
        const suppA = new Set(suppressedAuthors || []);
        const suppC = new Set(suppressedCategories || []);

        // Filter
        let filtered = (items || []).filter(item => {
            if (negSet.has(item.id)) return false;
            if (item.author && suppA.has(item.author)) return false;
            if (item.category && suppC.has(item.category)) return false;
            return true;
        });

        // Score
        const scored = filtered.map(item => {
            const r = recencyScore(item.createdAt || new Date().toISOString());
            const e = engagementScore(item);
            const a = authorAffinityScore(item.author || '', affinityVectors || {});
            const c = categoryAffinityScore(item.category, affinityVectors || {});
            const q = qualityScore(item);
            const t = trendingScore(item, filtered);

            const score = WEIGHTS.recency * r + WEIGHTS.engagement * e +
                WEIGHTS.authorAffinity * a + WEIGHTS.categoryAffinity * c +
                WEIGHTS.contentQuality * q + TRENDING_WEIGHT * t;

            return { ...item, _score: score, _trending: t };
        });

        scored.sort((a, b) => b._score - a._score);
        const ranked = diversifyFeed(scored);

        // Log for analytics
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') || '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        );
        await supabase.from('ranking_logs').insert({
            user_id: user.id,
            variant: variant || 'A',
            input_count: items?.length || 0,
            output_count: ranked.length,
            top_trending: ranked.filter(r => r._trending > 0.3).length,
            timestamp: new Date().toISOString(),
        }).catch(() => { }); // don't fail on log error

        return new Response(JSON.stringify({ ranked, count: ranked.length, userId: user.id }), {
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
    }
});
