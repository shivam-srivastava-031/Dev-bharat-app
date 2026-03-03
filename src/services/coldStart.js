/**
 * Cold Start — Detects new users and provides initial personalization.
 *
 * Problem: New users have zero event history, so the ranker produces random results.
 * Fix: 2-step onboarding (topics → language) seeds the affinity vector instantly,
 *      giving the first feed a personalized feel from post #1.
 */

const ONBOARDING_KEY = 'bharatapp_onboarded';
const TOPICS_KEY = 'bharatapp_onboard_topics';
const LANGUAGE_KEY = 'bharatapp_language';

// ===== Available topics (Indian-centric) =====
export const TOPICS = [
    { id: 'cricket', emoji: '🏏', label: 'Cricket', color: 'from-blue-500 to-indigo-600' },
    { id: 'food', emoji: '🍛', label: 'Food & Recipes', color: 'from-orange-400 to-red-500' },
    { id: 'tech', emoji: '💻', label: 'Tech & Startups', color: 'from-cyan-400 to-blue-500' },
    { id: 'bollywood', emoji: '🎬', label: 'Bollywood', color: 'from-pink-500 to-rose-500' },
    { id: 'bhakti', emoji: '🙏', label: 'Bhakti & Spirituality', color: 'from-amber-400 to-orange-500' },
    { id: 'travel', emoji: '🧳', label: 'Travel India', color: 'from-emerald-400 to-green-600' },
    { id: 'news', emoji: '📰', label: 'News & Politics', color: 'from-gray-400 to-slate-600' },
    { id: 'music', emoji: '🎵', label: 'Music & Dance', color: 'from-violet-400 to-purple-600' },
    { id: 'fitness', emoji: '🏋️', label: 'Fitness & Yoga', color: 'from-lime-400 to-green-500' },
    { id: 'memes', emoji: '😂', label: 'Memes & Comedy', color: 'from-yellow-400 to-amber-500' },
    { id: 'education', emoji: '📚', label: 'Education & Exams', color: 'from-sky-400 to-blue-600' },
    { id: 'fashion', emoji: '👗', label: 'Fashion & Style', color: 'from-fuchsia-400 to-pink-600' },
];

// ===== Available languages =====
export const LANGUAGES = [
    { id: 'en', label: 'English', native: 'English' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { id: 'te', label: 'Telugu', native: 'తెలుగు' },
    { id: 'bn', label: 'Bengali', native: 'বাংলা' },
    { id: 'mr', label: 'Marathi', native: 'मराठी' },
    { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

// ===== State checks =====

export function isOnboarded() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function completeOnboarding(topics, language) {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    localStorage.setItem(LANGUAGE_KEY, language || 'en');
}

export function getSelectedTopics() {
    try {
        return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
    } catch {
        return [];
    }
}

export function getSelectedLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
}

/**
 * Seed the affinity vector with onboarding selections.
 * Each selected topic gets weight +8 — enough to immediately influence ranking.
 *
 * @param {Function} trackEvent — from eventTracker.js
 * @param {string[]} topics — selected topic IDs
 */
export function seedAffinityFromOnboarding(trackEvent, topics) {
    topics.forEach(topicId => {
        trackEvent('onboard_interest', topicId, topicId, {
            category: topicId,
            weight: 8,
        });
    });
}

/**
 * Check if user is in cold start state (no meaningful event history).
 */
export function isColdStart() {
    if (!isOnboarded()) return true;
    try {
        const events = JSON.parse(localStorage.getItem('bharatapp_events') || '[]');
        // Fewer than 5 real interactions (excluding onboard events) = cold start
        const realEvents = events.filter(e => e.type !== 'onboard_interest' && e.type !== 'view');
        return realEvents.length < 5;
    } catch {
        return true;
    }
}

/**
 * Get cold-start boost — bump up content matching onboarding topics.
 * Returns a score multiplier (1.0 = no boost, up to 1.5 for matches).
 */
export function getColdStartBoost(item) {
    if (!isColdStart()) return 1.0;
    const topics = getSelectedTopics();
    if (topics.length === 0) return 1.0;

    const itemCategory = item.category || item.type;
    if (topics.includes(itemCategory)) return 1.4;

    // Partial match for related content
    const relatedMap = {
        cricket: ['sports', 'ipl'],
        bollywood: ['entertainment', 'movies'],
        tech: ['startups', 'coding'],
        food: ['recipes', 'cooking'],
        bhakti: ['spirituality', 'temple'],
        travel: ['tourism', 'adventure'],
        news: ['politics', 'current'],
        music: ['dance', 'singing'],
        fitness: ['yoga', 'health'],
        memes: ['comedy', 'funny'],
        education: ['exams', 'study'],
        fashion: ['style', 'beauty'],
    };

    for (const topic of topics) {
        const related = relatedMap[topic] || [];
        if (related.some(r => itemCategory?.includes(r))) return 1.2;
    }

    return 1.0;
}
