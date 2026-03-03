/**
 * Recommendation Engine — Instagram-style feed ranker with A/B testing.
 *
 * Ranks feed items using a weighted multi-signal formula:
 *   FeedScore = w1·Recency + w2·Engagement + w3·AuthorAffinity
 *            + w4·CategoryAffinity + w5·ContentQuality + w6·Diversity
 *
 * A/B Testing:
 *   Users are randomly assigned to variant A or B (persisted).
 *   Variant B doubles CategoryAffinity weight (0.30 vs 0.15).
 *   CTR is measured per variant to determine the winner.
 */

import { getAffinityScore, getPositiveSignals, getNegativeSignals, getTopAffinities, getSuppressedContent, trackEvent } from './eventTracker';

// ===== A/B Test Framework =====

const AB_TEST_KEY = 'bharatapp_ab_variant';
const AB_METRICS_KEY = 'bharatapp_ab_metrics';

/**
 * Get or assign the user's A/B variant. Persisted in localStorage.
 */
function getVariant() {
    let variant = localStorage.getItem(AB_TEST_KEY);
    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(AB_TEST_KEY, variant);
        console.log(`🧪 A/B test: Assigned to variant ${variant}`);
    }
    return variant;
}

/**
 * Get weight config for the current variant.
 */
function getWeights() {
    const variant = getVariant();

    if (variant === 'B') {
        // Variant B: doubled CategoryAffinity weight, reduced others proportionally
        return {
            recency: 0.22,
            engagement: 0.18,
            authorAffinity: 0.15,
            categoryAffinity: 0.30,  // 🧪 2× category weight
            contentQuality: 0.08,
            diversity: 0.07,
            _variant: 'B',
        };
    }

    // Variant A: original control weights
    return {
        recency: 0.25,
        engagement: 0.20,
        authorAffinity: 0.20,
        categoryAffinity: 0.15,
        contentQuality: 0.10,
        diversity: 0.10,
        _variant: 'A',
    };
}

// ===== A/B Metrics =====

function getMetrics() {
    try {
        return JSON.parse(localStorage.getItem(AB_METRICS_KEY) || '{"A":{"impressions":0,"clicks":0},"B":{"impressions":0,"clicks":0}}');
    } catch {
        return { A: { impressions: 0, clicks: 0 }, B: { impressions: 0, clicks: 0 } };
    }
}

function saveMetrics(metrics) {
    localStorage.setItem(AB_METRICS_KEY, JSON.stringify(metrics));
}

/**
 * Record an impression (feed item shown to user).
 */
export function recordImpression(count = 1) {
    const variant = getVariant();
    const metrics = getMetrics();
    metrics[variant].impressions += count;
    saveMetrics(metrics);
}

/**
 * Record a click-through (user tapped/interacted with a feed item).
 */
export function recordClickThrough() {
    const variant = getVariant();
    const metrics = getMetrics();
    metrics[variant].clicks += 1;
    saveMetrics(metrics);

    // Also track as event for Supabase sync
    trackEvent('ab_click', 'feed', 'experiment', { variant, weight: 0 });
}

/**
 * Get A/B test results — CTR for each variant.
 */
export function getABTestResults() {
    const metrics = getMetrics();
    const variant = getVariant();

    const ctrA = metrics.A.impressions > 0
        ? ((metrics.A.clicks / metrics.A.impressions) * 100).toFixed(2)
        : '0.00';
    const ctrB = metrics.B.impressions > 0
        ? ((metrics.B.clicks / metrics.B.impressions) * 100).toFixed(2)
        : '0.00';

    return {
        currentVariant: variant,
        A: { ...metrics.A, ctr: `${ctrA}%`, weights: 'CategoryAffinity: 0.15 (control)' },
        B: { ...metrics.B, ctr: `${ctrB}%`, weights: 'CategoryAffinity: 0.30 (experiment)' },
        winner: parseFloat(ctrA) > parseFloat(ctrB) ? 'A' : parseFloat(ctrB) > parseFloat(ctrA) ? 'B' : 'Tie',
    };
}

// ===== Scoring functions =====

const RECENCY_HALF_LIFE_HOURS = 6;

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

function authorAffinityScore(authorId) {
    const raw = getAffinityScore(authorId, 'author');
    return Math.tanh(raw / 10);
}

function categoryAffinityScore(category) {
    if (!category) return 0.5;
    const raw = getAffinityScore(category, 'category');
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

// ===== Global Trending Score =====

/**
 * Compute a global trending score (0–1) independent of personal profile.
 *
 * Trending = high engagement + very recent. If a World Cup win or election
 * result is going viral, EVERYONE sees it, not just cricket/politics fans.
 *
 * Formula: trending = engagement_velocity × recency_boost
 *   - engagement_velocity: likes+shares in a short window, normalized
 *   - recency_boost: only items < 3 hours old can be trending
 */
function globalTrendingScore(item, allItems) {
    // Recency gate: only items < 3 hours old can trend
    const ageMs = Date.now() - new Date(item.createdAt || item.created_at || new Date()).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 3) return 0;

    const recencyMultiplier = Math.pow(0.5, ageHours / 1); // fast decay (1hr half-life)

    // Engagement velocity: how does this item compare to the median?
    const totalEng = (item.likes || 0) + (item.comments || 0) * 2 + (item.shares || 0) * 3;
    const allEngagements = allItems.map(i => (i.likes || 0) + (i.comments || 0) * 2 + (i.shares || 0) * 3);
    const sorted = [...allEngagements].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 1;
    const p90 = sorted[Math.floor(sorted.length * 0.9)] || median;

    // Velocity = how far above median, capped at p90
    const velocity = Math.min((totalEng - median) / Math.max(p90 - median, 1), 1);
    if (velocity <= 0) return 0;

    // Live events get extra trending boost
    let liveBoost = 1;
    if (item.type === 'cricket' && item.data?.status === 'Live') liveBoost = 2.0;
    if (item.type === 'news' && item.data?.breaking) liveBoost = 1.5;

    return Math.min(velocity * recencyMultiplier * liveBoost, 1);
}

// Trending weight constant (outside A/B test — affects everyone equally)
const TRENDING_WEIGHT = 0.15;

// ===== Feed ranking =====

/**
 * Rank feed items using the current A/B variant's weights.
 */
export function rankFeed(items, options = {}) {
    const { diversify = true, boostLive = true } = options;
    const WEIGHTS = getWeights();
    const negativeIds = new Set(getNegativeSignals());
    const suppressed = getSuppressedContent();

    // Filter out hidden/skipped/not-interested items AND suppressed authors/categories
    let filtered = items.filter(item => {
        if (negativeIds.has(item.id)) return false;
        if (item.author && suppressed.authors.includes(item.author)) return false;
        if (item.category && suppressed.categories.includes(item.category)) return false;
        return true;
    });

    const scored = filtered.map(item => {
        const rScore = recencyScore(item.createdAt || item.created_at || new Date());
        const eScore = engagementScore(item);
        const aScore = authorAffinityScore(item.author || item.authorId || '');
        const cScore = categoryAffinityScore(item.category);
        const qScore = contentQualityScore(item);
        const tScore = globalTrendingScore(item, filtered);

        let totalScore =
            WEIGHTS.recency * rScore +
            WEIGHTS.engagement * eScore +
            WEIGHTS.authorAffinity * aScore +
            WEIGHTS.categoryAffinity * cScore +
            WEIGHTS.contentQuality * qScore +
            TRENDING_WEIGHT * tScore; // 🔥 Global trending — overrides personal profile

        if (boostLive && item.type === 'cricket' && item.data?.status === 'Live') {
            totalScore *= 1.5;
        }
        if (boostLive && item.type === 'weather') {
            totalScore += 0.3;
        }

        return {
            ...item,
            _score: totalScore,
            _trending: tScore,
            _variant: WEIGHTS._variant,
            _debug: { rScore, eScore, aScore, cScore, qScore, tScore, variant: WEIGHTS._variant },
        };
    });

    scored.sort((a, b) => b._score - a._score);

    // Record impressions for A/B metrics
    recordImpression(scored.length);

    if (diversify) return diversifyFeed(scored);
    return scored;
}

/**
 * Diversity pass with session diversity rule:
 *   1. No 2 consecutive posts from same author
 *   2. No 2 consecutive non-post items of same type
 *   3. Same category/topic max 3× in the first 10 posts
 */
function diversifyFeed(sorted) {
    const result = [];
    const remaining = [...sorted];
    const topicCountInTop10 = {}; // category → count in first 10 positions

    while (remaining.length > 0) {
        let placed = false;
        for (let i = 0; i < remaining.length; i++) {
            const item = remaining[i];
            const lastItem = result[result.length - 1];
            const itemCategory = item.category || item.type;

            // Rule 1: No consecutive same-author
            const sameAuthor = lastItem && item.author && lastItem.author === item.author;
            // Rule 2: No consecutive same-type (except generic posts)
            const sameType = lastItem && item.type && lastItem.type === item.type && item.type !== 'post';
            // Rule 3: Session diversity — max 3 of same topic in first 10
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
        // If nothing fits without violation, force-place the next best
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

/**
 * Rank videos (Reels) — watch% matters more.
 */
export function rankVideos(videos) {
    const negativeIds = new Set(getNegativeSignals());
    return videos
        .filter(v => !negativeIds.has(v.id))
        .map(video => {
            const rScore = recencyScore(video.publishedAt || new Date());
            const eScore = engagementScore({ likes: parseInt(video.likes) || 0, views: parseInt(video.views) || 1 });
            const cScore = categoryAffinityScore(video.category);
            return { ...video, _score: 0.30 * rScore + 0.40 * eScore + 0.30 * cScore };
        })
        .sort((a, b) => b._score - a._score);
}

/**
 * Personalized "For You" suggestions.
 */
export function getForYouSuggestions(allItems, limit = 10) {
    const positiveIds = new Set(getPositiveSignals());
    const negativeIds = new Set(getNegativeSignals());
    const unseen = allItems.filter(item => !positiveIds.has(item.id) && !negativeIds.has(item.id));
    return rankFeed(unseen).slice(0, limit);
}
