/**
 * Feed Pipeline — One function that runs all ranking stages in order.
 *
 * Pipeline:
 *   1. Cold start check → boost onboarding topics
 *   2. Base rank → multi-signal scoring (recency, engagement, affinity, quality)
 *   3. Trending boost → velocity-based viral content surfacing
 *   4. Fatigue penalty → reduce over-seen topics
 *   5. Diversity pass → enforce variety rules + discovery slots
 *   6. Filter seen → remove "Not Interested" / hidden content
 *
 * Drop-in replacement for rankFeed() — just call `runPipeline(items)`.
 */

import { getAffinityScore, getNegativeSignals, getSuppressedContent } from './eventTracker';
import { getColdStartBoost } from './coldStart';
import { applyTrendingBoost } from './trendingBoost';
import { applyFatiguePenalty, diversifyFeed } from './sessionDiversity';

// ===== A/B test weights (private) =====

const AB_TEST_KEY = 'bharatapp_ab_variant';
const AB_METRICS_KEY = 'bharatapp_ab_metrics';

function getVariant() {
    let variant = localStorage.getItem(AB_TEST_KEY);
    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(AB_TEST_KEY, variant);
    }
    return variant;
}

function getWeights() {
    const variant = getVariant();
    if (variant === 'B') {
        return { recency: 0.22, engagement: 0.18, authorAffinity: 0.15, categoryAffinity: 0.30, contentQuality: 0.08 };
    }
    return { recency: 0.25, engagement: 0.20, authorAffinity: 0.20, categoryAffinity: 0.15, contentQuality: 0.10 };
}

// ===== Scoring functions =====

const RECENCY_HALF_LIFE = 6; // hours

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

function authorAffinityScore(authorId) {
    return Math.tanh((getAffinityScore(authorId, 'author') || 0) / 10);
}

function categoryAffinityScore(category) {
    if (!category) return 0.5;
    return Math.tanh((getAffinityScore(category, 'category') || 0) / 10);
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

// ===== A/B Metrics =====

function getMetrics() {
    try { return JSON.parse(localStorage.getItem(AB_METRICS_KEY) || '{"A":{"i":0,"c":0},"B":{"i":0,"c":0}}'); }
    catch { return { A: { i: 0, c: 0 }, B: { i: 0, c: 0 } }; }
}

export function recordImpression(count = 1) {
    const v = getVariant();
    const m = getMetrics();
    m[v].i += count;
    localStorage.setItem(AB_METRICS_KEY, JSON.stringify(m));
}

export function recordClickThrough() {
    const v = getVariant();
    const m = getMetrics();
    m[v].c += 1;
    localStorage.setItem(AB_METRICS_KEY, JSON.stringify(m));
}

export function getABTestResults() {
    const m = getMetrics();
    const v = getVariant();
    const ctrA = m.A.i > 0 ? ((m.A.c / m.A.i) * 100).toFixed(2) : '0.00';
    const ctrB = m.B.i > 0 ? ((m.B.c / m.B.i) * 100).toFixed(2) : '0.00';
    return {
        variant: v,
        A: { impressions: m.A.i, clicks: m.A.c, ctr: `${ctrA}%` },
        B: { impressions: m.B.i, clicks: m.B.c, ctr: `${ctrB}%` },
        winner: parseFloat(ctrA) > parseFloat(ctrB) ? 'A' : parseFloat(ctrB) > parseFloat(ctrA) ? 'B' : 'Tie',
    };
}

// ===== Pipeline =====

/**
 * Run the full feed ranking pipeline.
 *
 * @param {Array} items — raw feed items
 * @param {object} options — { trendingWeight: 0.15 }
 * @returns {Array} fully ranked, diversified feed
 */
export function runPipeline(items, options = {}) {
    const { trendingWeight = 0.15 } = options;
    const W = getWeights();

    // Stage 0: Filter out negative signals and suppressed content
    const negativeIds = new Set(getNegativeSignals());
    const suppressed = getSuppressedContent();
    let feed = items.filter(item => {
        if (negativeIds.has(item.id)) return false;
        if (item.author && suppressed.authors.includes(item.author)) return false;
        if (item.category && suppressed.categories.includes(item.category)) return false;
        return true;
    });

    // Stage 1: Base scoring
    feed = feed.map(item => {
        const r = recencyScore(item.createdAt || item.created_at || new Date().toISOString());
        const e = engagementScore(item);
        const a = authorAffinityScore(item.author || item.authorId || '');
        const c = categoryAffinityScore(item.category);
        const q = qualityScore(item);

        let score = W.recency * r + W.engagement * e + W.authorAffinity * a
            + W.categoryAffinity * c + W.contentQuality * q;

        // Cold start boost — bump onboarding topics for new users
        score *= getColdStartBoost(item);

        // Weather/live content pin
        if (item.type === 'weather') score += 0.3;

        return { ...item, _score: score, _debug: { r, e, a, c, q } };
    });

    // Stage 2: Trending boost
    feed = applyTrendingBoost(feed, trendingWeight);

    // Stage 3: Sort by score
    feed.sort((a, b) => b._score - a._score);

    // Stage 4: Fatigue penalty
    feed = applyFatiguePenalty(feed);

    // Stage 5: Re-sort after fatigue
    feed.sort((a, b) => b._score - a._score);

    // Stage 6: Diversity pass (reorders for variety + discovery slots)
    feed = diversifyFeed(feed);

    // Record impressions
    recordImpression(feed.length);

    if (import.meta.env.DEV) {
        console.log(`🧠 Pipeline: ${items.length} in → ${feed.length} out (variant ${getVariant()})`);
    }

    return feed;
}
