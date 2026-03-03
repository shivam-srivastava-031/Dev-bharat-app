/**
 * Trending Boost — Computes velocity-based trending scores.
 *
 * Unlike personal affinity, trending is GLOBAL — if something is going viral
 * across all users right now, everyone should see it.
 *
 * Velocity = engagement in last 1h ÷ average hourly engagement
 * Live events get automatic multipliers (IPL = 1.5×, Diwali = auto-detect).
 */

// ===== Live event multipliers =====

const LIVE_MULTIPLIERS = {
    cricket_live: 1.5,   // IPL, World Cup matches
    breaking_news: 1.4,  // Breaking headlines
    festival: 1.3,       // Diwali, Holi, Eid, Christmas
    election: 1.3,       // Election results
    default: 1.0,
};

// Indian festivals that auto-boost related content
const FESTIVAL_DATES = {
    // Format: MM-DD → festival name
    '10-20': 'diwali', '10-21': 'diwali', '10-22': 'diwali',
    '03-25': 'holi', '03-26': 'holi',
    '08-15': 'independence_day',
    '01-26': 'republic_day',
    '11-01': 'diwali', // approximate — varies yearly
};

/**
 * Detect if today is near an Indian festival.
 */
function detectFestival() {
    const now = new Date();
    const key = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return FESTIVAL_DATES[key] || null;
}

/**
 * Get a live event multiplier for an item.
 */
function getLiveMultiplier(item) {
    // Cricket live match
    if (item.type === 'cricket' && item.data?.status === 'Live') {
        return LIVE_MULTIPLIERS.cricket_live;
    }
    // Breaking news
    if (item.type === 'news' && (item.data?.breaking || item.data?.urgent)) {
        return LIVE_MULTIPLIERS.breaking_news;
    }
    // Festival boost — auto-detect from calendar
    const festival = detectFestival();
    if (festival) {
        const festivalTopics = {
            diwali: ['festival', 'bhakti', 'food', 'fashion', 'shopping'],
            holi: ['festival', 'bhakti', 'music', 'fun'],
            independence_day: ['news', 'patriotic'],
            republic_day: ['news', 'patriotic'],
        };
        const related = festivalTopics[festival] || [];
        const itemCat = item.category || item.type;
        if (related.some(r => itemCat?.includes(r))) {
            return LIVE_MULTIPLIERS.festival;
        }
    }
    return LIVE_MULTIPLIERS.default;
}

/**
 * Compute trending velocity score (0–1) for a single item.
 *
 * @param {object} item — feed item with engagement metrics
 * @param {Array} allItems — all items in the feed (for percentile calc)
 * @returns {number} 0–1 trending score
 */
export function computeTrendingScore(item, allItems) {
    // Recency gate: only items < 3 hours old can trend
    const ageMs = Date.now() - new Date(item.createdAt || new Date()).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 3) return 0;

    // Fast recency decay (1-hour half-life — trending is fleeting)
    const recencyDecay = Math.pow(0.5, ageHours / 1);

    // Engagement velocity: how does this item compare to the cohort?
    const itemEng = (item.likes || 0) + (item.comments || 0) * 2 + (item.shares || 0) * 3;
    const allEng = allItems.map(i => (i.likes || 0) + (i.comments || 0) * 2 + (i.shares || 0) * 3);
    const sorted = [...allEng].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 1;
    const p90 = sorted[Math.floor(sorted.length * 0.9)] || median;

    // Velocity = how far above median (capped at p90)
    const velocity = Math.min((itemEng - median) / Math.max(p90 - median, 1), 1);
    if (velocity <= 0) return 0;

    // Live event multiplier
    const liveMult = getLiveMultiplier(item);

    // Final trending score: velocity × recency × live, capped at 1.0
    const raw = velocity * recencyDecay * liveMult;

    // Max boost: 1.8× (prevent any single trending item from dominating)
    return Math.min(raw, 1.0);
}

/**
 * Apply trending boost to a list of scored items.
 * Adds `_trending` field and adjusts `_score`.
 *
 * @param {Array} scoredItems — items with `_score` already computed
 * @param {number} weight — how much trending affects final score (default 0.15)
 * @returns {Array} items with trending boost applied
 */
export function applyTrendingBoost(scoredItems, weight = 0.15) {
    return scoredItems.map(item => {
        const tScore = computeTrendingScore(item, scoredItems);
        return {
            ...item,
            _score: item._score + (weight * tScore),
            _trending: tScore,
            _trendingBoost: weight * tScore,
        };
    });
}
