/**
 * Session Diversity — Enforces variety rules to keep the feed interesting.
 *
 * Rules:
 *   1. Max 3 same-topic in first 10 posts
 *   2. No consecutive same-author
 *   3. 1-in-5 slots reserved for "discovery" content (outside top-3 interests)
 *   4. Fatigue multiplier — reduces score of topics you've already seen a lot this session
 */

import { getTopAffinities } from './eventTracker';

// ===== Session tracking =====

let sessionSeen = {};  // category → count seen this session
let sessionStart = Date.now();

/**
 * Reset session tracking (call on app launch or after 30min idle).
 */
export function resetSession() {
    sessionSeen = {};
    sessionStart = Date.now();
}

// Auto-reset if session is stale (30 min idle)
function checkSessionFreshness() {
    if (Date.now() - sessionStart > 30 * 60 * 1000) {
        resetSession();
    }
}

/**
 * Record that a topic/category was shown in this session.
 */
export function recordSeen(category) {
    if (!category) return;
    sessionSeen[category] = (sessionSeen[category] || 0) + 1;
}

// ===== Fatigue multiplier =====

/**
 * Compute fatigue multiplier (0.5–1.0).
 * The more you've seen a topic this session, the lower its score gets.
 *
 * Seen 0–2 times: 1.0 (no fatigue)
 * Seen 3–5 times: 0.85
 * Seen 6–9 times: 0.7
 * Seen 10+ times: 0.5
 */
export function getFatigueMultiplier(category) {
    checkSessionFreshness();
    const seen = sessionSeen[category] || 0;
    if (seen <= 2) return 1.0;
    if (seen <= 5) return 0.85;
    if (seen <= 9) return 0.7;
    return 0.5;
}

/**
 * Apply fatigue penalty to scored items.
 */
export function applyFatiguePenalty(scoredItems) {
    return scoredItems.map(item => {
        const cat = item.category || item.type;
        const fatigue = getFatigueMultiplier(cat);
        return {
            ...item,
            _score: item._score * fatigue,
            _fatigue: fatigue,
        };
    });
}

// ===== Discovery slots =====

/**
 * Get the user's top-3 interests (what they engage with most).
 */
function getTopInterests() {
    return getTopAffinities('category', 3).map(a => a.key);
}

/**
 * Check if an item is "discovery" content (outside the user's top-3 interests).
 */
function isDiscoveryContent(item, topInterests) {
    const cat = item.category || item.type;
    if (!cat) return true;
    return !topInterests.includes(cat);
}

// ===== Main diversity pass =====

/**
 * Apply all diversity rules to a sorted feed.
 *
 * @param {Array} sorted — items sorted by score (descending)
 * @returns {Array} diversified feed
 */
export function diversifyFeed(sorted) {
    checkSessionFreshness();
    const topInterests = getTopInterests();
    const result = [];
    const remaining = [...sorted];
    const topicCountInTop10 = {};

    while (remaining.length > 0) {
        let placed = false;

        for (let i = 0; i < remaining.length; i++) {
            const item = remaining[i];
            const lastItem = result[result.length - 1];
            const itemCategory = item.category || item.type;
            const position = result.length;

            // Rule 1: No consecutive same-author
            const sameAuthor = lastItem && item.author && lastItem.author === item.author;
            if (sameAuthor) continue;

            // Rule 2: No consecutive same-type (except generic posts)
            const sameType = lastItem && item.type && lastItem.type === item.type && item.type !== 'post';
            if (sameType) continue;

            // Rule 3: Max 3 same-topic in first 10
            if (position < 10 && itemCategory && (topicCountInTop10[itemCategory] || 0) >= 3) {
                continue;
            }

            // Rule 4: 1-in-5 discovery slot (positions 4, 9, 14, 19, ...)
            if ((position + 1) % 5 === 0) {
                // Try to find discovery content
                const discoveryIdx = remaining.findIndex(r => isDiscoveryContent(r, topInterests));
                if (discoveryIdx >= 0 && discoveryIdx !== i) {
                    // Use discovery item instead
                    const discoveryItem = remaining[discoveryIdx];
                    result.push({ ...discoveryItem, _discovery: true });
                    remaining.splice(discoveryIdx, 1);
                    recordSeen(discoveryItem.category || discoveryItem.type);
                    if (position < 10) {
                        const dCat = discoveryItem.category || discoveryItem.type;
                        if (dCat) topicCountInTop10[dCat] = (topicCountInTop10[dCat] || 0) + 1;
                    }
                    placed = true;
                    break;
                }
            }

            // Place this item
            result.push(item);
            remaining.splice(i, 1);
            recordSeen(itemCategory);

            if (position < 10 && itemCategory) {
                topicCountInTop10[itemCategory] = (topicCountInTop10[itemCategory] || 0) + 1;
            }
            placed = true;
            break;
        }

        // If nothing fits, force-place the next best
        if (!placed) {
            const item = remaining.shift();
            if (item) {
                result.push(item);
                const cat = item.category || item.type;
                recordSeen(cat);
                if (result.length <= 10 && cat) {
                    topicCountInTop10[cat] = (topicCountInTop10[cat] || 0) + 1;
                }
            }
        }
    }

    return result;
}
