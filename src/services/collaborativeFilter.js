/**
 * Collaborative Filter — "People like you also liked..."
 *
 * Implements user-based and item-based collaborative filtering using
 * cosine similarity on interaction vectors.
 *
 * Since this runs client-side, we simulate a multi-user environment using
 * synthetic user profiles + the current user's real interaction data.
 *
 * In production, this would be replaced by a matrix factorization service
 * (e.g., ALS on Spark, or a Supabase Edge Function).
 */

import { getInteractionHistory, getPositiveSignals, getNegativeSignals } from './eventTracker';

// ===== Synthetic user profiles for demo collaborative filtering =====
// In production, these would come from Supabase aggregated data.
const syntheticUsers = {
    user_cricket_fan: {
        likes: ['cricket-0', 'cricket-1', 'cricket-2', 'news-0'],
        categories: { cricket: 5, sports: 4, news: 2, tech: 1 },
        label: 'Cricket & Sports Lover',
    },
    user_tech_geek: {
        likes: ['post-tech-1', 'post-tech-2', 'news-4'],
        categories: { tech: 5, startup: 4, coding: 3, news: 2 },
        label: 'Tech & Startup Enthusiast',
    },
    user_foodie: {
        likes: ['post-food-1', 'post-food-2', 'post-food-3'],
        categories: { food: 5, travel: 4, culture: 3, bollywood: 1 },
        label: 'Foodie & Traveller',
    },
    user_bollywood: {
        likes: ['news-3', 'video-1', 'video-3'],
        categories: { bollywood: 5, music: 4, entertainment: 4, fashion: 2 },
        label: 'Bollywood & Entertainment Fan',
    },
    user_traveller: {
        likes: ['post-d1', 'post-d3', 'post-d5', 'post-d6'],
        categories: { travel: 5, photography: 4, culture: 3, nature: 3 },
        label: 'Travel & Photography Buff',
    },
    user_news_reader: {
        likes: ['news-0', 'news-1', 'news-2', 'news-3', 'news-4', 'news-5'],
        categories: { news: 5, politics: 4, economy: 3, cricket: 2 },
        label: 'News & Current Affairs',
    },
};

/**
 * Build category vector for the current user from their event history.
 */
function buildUserCategoryVector() {
    const history = getInteractionHistory(null, 500);
    const vector = {};

    history.forEach(event => {
        const cat = event.category || event.contentType;
        if (!cat) return;
        const weight = event.weight || 0;
        vector[cat] = (vector[cat] || 0) + weight;
    });

    return vector;
}

/**
 * Cosine similarity between two category vectors.
 */
function cosineSimilarity(vecA, vecB) {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    allKeys.forEach(key => {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dotProduct += a * b;
        magA += a * a;
        magB += b * b;
    });

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Jaccard similarity between two sets of liked item IDs.
 */
function jaccardSimilarity(setA, setB) {
    const intersection = setA.filter(id => setB.includes(id)).length;
    const union = new Set([...setA, ...setB]).size;
    if (union === 0) return 0;
    return intersection / union;
}

/**
 * Find the most similar synthetic user profiles to the current user.
 * Returns sorted list of { userId, similarity, label }.
 */
export function findSimilarUsers(topK = 3) {
    const userVector = buildUserCategoryVector();
    const userLikes = getPositiveSignals();

    const similarities = Object.entries(syntheticUsers).map(([userId, profile]) => {
        // Blend category similarity and item similarity
        const catSim = cosineSimilarity(userVector, profile.categories);
        const itemSim = jaccardSimilarity(userLikes, profile.likes);
        const blendedSim = 0.6 * catSim + 0.4 * itemSim;

        return { userId, similarity: blendedSim, label: profile.label };
    });

    return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
}

/**
 * Get collaborative recommendations — items liked by similar users that the current user hasn't seen.
 *
 * @param {Array} allItems - All available content items
 * @param {number} limit - Max recommendations to return
 * @returns {Array} Recommended items with _cfScore
 */
export function getCollaborativeRecommendations(allItems, limit = 10) {
    const positiveIds = new Set(getPositiveSignals());
    const negativeIds = new Set(getNegativeSignals());
    const similarUsers = findSimilarUsers(3);

    // Collect item IDs liked by similar users, weighted by similarity
    const candidateScores = {};

    similarUsers.forEach(({ userId, similarity }) => {
        const profile = syntheticUsers[userId];
        if (!profile) return;

        profile.likes.forEach(itemId => {
            if (!positiveIds.has(itemId) && !negativeIds.has(itemId)) {
                candidateScores[itemId] = (candidateScores[itemId] || 0) + similarity;
            }
        });
    });

    // Also recommend items from top affinity categories of similar users
    const topCategories = new Set();
    similarUsers.forEach(({ userId }) => {
        const profile = syntheticUsers[userId];
        Object.entries(profile.categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .forEach(([cat]) => topCategories.add(cat));
    });

    // Score all items matching those categories
    allItems.forEach(item => {
        if (positiveIds.has(item.id) || negativeIds.has(item.id)) return;

        const itemCat = item.category || item.contentType || item.type;
        if (topCategories.has(itemCat)) {
            candidateScores[item.id] = (candidateScores[item.id] || 0) + 0.3;
        }
    });

    // Match candidate scores back to actual items
    const recommendations = allItems
        .filter(item => candidateScores[item.id])
        .map(item => ({
            ...item,
            _cfScore: candidateScores[item.id],
            _reason: 'People like you also liked this',
        }))
        .sort((a, b) => b._cfScore - a._cfScore)
        .slice(0, limit);

    return recommendations;
}

/**
 * Item-based collaborative filtering — "Similar to items you liked"
 * Finds items with similar engagement patterns.
 */
export function getSimilarItems(targetItem, allItems, limit = 5) {
    const targetVector = {
        likes: targetItem.likes || 0,
        comments: targetItem.comments || 0,
        shares: targetItem.shares || 0,
    };

    // Normalize
    const maxLikes = Math.max(...allItems.map(i => i.likes || 0), 1);
    const maxComments = Math.max(...allItems.map(i => i.comments || 0), 1);

    const scored = allItems
        .filter(item => item.id !== targetItem.id)
        .map(item => {
            // Engagement pattern similarity
            const itemVector = {
                likes: (item.likes || 0) / maxLikes,
                comments: (item.comments || 0) / maxComments,
            };
            const targetNorm = {
                likes: (targetItem.likes || 0) / maxLikes,
                comments: (targetItem.comments || 0) / maxComments,
            };
            const sim = cosineSimilarity(targetNorm, itemVector);

            // Category match bonus
            const catMatch = item.category === targetItem.category ? 0.3 : 0;
            // Author match bonus
            const authorMatch = item.author === targetItem.author ? 0.2 : 0;

            return { ...item, _similarity: sim + catMatch + authorMatch };
        })
        .sort((a, b) => b._similarity - a._similarity)
        .slice(0, limit);

    return scored;
}

/**
 * Get user's inferred interest profile based on their interactions.
 */
export function getUserInterestProfile() {
    const vector = buildUserCategoryVector();
    const total = Object.values(vector).reduce((sum, v) => sum + Math.abs(v), 0) || 1;

    const interests = Object.entries(vector)
        .map(([category, score]) => ({
            category,
            score,
            percentage: Math.round((Math.abs(score) / total) * 100),
        }))
        .sort((a, b) => b.score - a.score);

    const similarUsers = findSimilarUsers(2);

    return {
        interests,
        similarTo: similarUsers.map(u => u.label),
        totalInteractions: getInteractionHistory().length,
    };
}
