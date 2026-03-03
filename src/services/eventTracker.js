/**
 * Event Tracker — Collects user signals to train the recommendation algorithm.
 *
 * Signals collected:
 *   - likes, saves, shares (explicit positive)
 *   - skips, hides, not_interested (explicit negative)
 *   - watch_percent (implicit — how much of a video/post was consumed)
 *   - dwell_time (implicit — seconds spent on a post)
 *   - click_through (implicit — did the user tap to expand)
 *   - comment, reply (explicit high-value)
 *
 * Data is persisted to both localStorage (instant) AND Supabase (durable).
 * On page load, events are hydrated from Supabase if available.
 */

import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'bharatapp_events';
const AFFINITY_KEY = 'bharatapp_affinities';
const MAX_EVENTS = 5000;
const SYNC_DEBOUNCE_MS = 3000; // batch Supabase writes every 3s
let syncTimer = null;
let pendingSync = [];

// ===== Local persistence =====

function getEvents() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveEvents(events) {
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

// ===== Affinity vector persistence =====

function getAffinityVectors() {
    try {
        return JSON.parse(localStorage.getItem(AFFINITY_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveAffinityVectors(vectors) {
    localStorage.setItem(AFFINITY_KEY, JSON.stringify(vectors));
}

/**
 * Rebuild and persist affinity vectors from event history.
 * Called after each event to keep vectors current.
 */
function rebuildAffinityVectors() {
    const events = getEvents();
    const vectors = { category: {}, author: {}, contentType: {} };

    events.forEach(e => {
        const w = e.weight || 0;
        // Category affinity
        if (e.category) vectors.category[e.category] = (vectors.category[e.category] || 0) + w;
        // Author affinity
        if (e.author) vectors.author[e.author] = (vectors.author[e.author] || 0) + w;
        // Content type affinity
        if (e.contentType) vectors.contentType[e.contentType] = (vectors.contentType[e.contentType] || 0) + w;
    });

    saveAffinityVectors(vectors);
    return vectors;
}

// ===== Supabase sync =====

async function syncToSupabase(events) {
    if (!supabase) return; // demo mode — skip
    try {
        const rows = events.map(e => ({
            event_id: e.id,
            user_id: e.userId,
            event_type: e.type,
            content_id: e.contentId,
            content_type: e.contentType,
            weight: e.weight || 0,
            metadata: JSON.stringify(e),
            created_at: new Date(e.timestamp).toISOString(),
        }));
        await supabase.from('events').upsert(rows, { onConflict: 'event_id' });

        // Also persist the affinity vectors
        const vectors = getAffinityVectors();
        await supabase.from('user_affinities').upsert({
            user_id: events[0]?.userId || 'anonymous',
            category_vector: vectors.category,
            author_vector: vectors.author,
            content_type_vector: vectors.contentType,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (import.meta.env.DEV) console.log(`☁️ Synced ${events.length} events to Supabase`);
    } catch (err) {
        console.warn('Supabase sync error:', err.message);
    }
}

function scheduleSyncToSupabase(event) {
    pendingSync.push(event);
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
        const batch = [...pendingSync];
        pendingSync = [];
        syncToSupabase(batch);
    }, SYNC_DEBOUNCE_MS);
}

/**
 * Hydrate events from Supabase on app startup.
 * Merges with local events (de-duplicated by event ID).
 */
export async function hydrateFromSupabase(userId) {
    if (!supabase) return;
    try {
        // Hydrate events
        const { data: remoteEvents } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(MAX_EVENTS);

        if (remoteEvents?.length) {
            const localEvents = getEvents();
            const localIds = new Set(localEvents.map(e => e.id));
            const merged = [...localEvents];

            remoteEvents.forEach(re => {
                if (!localIds.has(re.event_id)) {
                    const parsed = JSON.parse(re.metadata || '{}');
                    merged.push({ ...parsed, id: re.event_id });
                }
            });

            saveEvents(merged);
            rebuildAffinityVectors();
            console.log(`☁️ Hydrated ${remoteEvents.length} events from Supabase`);
        }

        // Hydrate affinity vectors
        const { data: remoteAff } = await supabase
            .from('user_affinities')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (remoteAff) {
            saveAffinityVectors({
                category: remoteAff.category_vector || {},
                author: remoteAff.author_vector || {},
                contentType: remoteAff.content_type_vector || {},
            });
        }
    } catch (err) {
        console.warn('Supabase hydrate error:', err.message);
    }
}

// ===== Core track function =====

/**
 * Track an event — persists locally AND to Supabase.
 */
export function trackEvent(eventType, contentId, contentType = 'post', metadata = {}) {
    const event = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        type: eventType,
        contentId,
        contentType,
        timestamp: Date.now(),
        userId: metadata.userId || 'anonymous',
        ...metadata,
    };

    const events = getEvents();
    events.push(event);
    saveEvents(events);
    rebuildAffinityVectors(); // keep affinity vectors current after every event

    // Async sync to Supabase (debounced)
    scheduleSyncToSupabase(event);

    if (import.meta.env.DEV) {
        console.log(`📊 [Track] ${eventType} → ${contentType}:${contentId}`, metadata);
    }

    return event;
}

// ===== Convenience trackers =====

export function trackLike(contentId, contentType = 'post') {
    return trackEvent('like', contentId, contentType, { weight: 3 });
}

export function trackSave(contentId, contentType = 'post') {
    return trackEvent('save', contentId, contentType, { weight: 5 });
}

export function trackShare(contentId, contentType = 'post') {
    return trackEvent('share', contentId, contentType, { weight: 4 });
}

export function trackSkip(contentId, contentType = 'post') {
    return trackEvent('skip', contentId, contentType, { weight: -2 });
}

export function trackHide(contentId, contentType = 'post') {
    return trackEvent('hide', contentId, contentType, { weight: -5 });
}

/**
 * "Not Interested" — the most powerful explicit negative signal.
 * Weight: -10 (5× stronger than skip, 2× stronger than hide).
 * Also suppresses similar content from the same author/category.
 */
export function trackNotInterested(contentId, contentType = 'post', metadata = {}) {
    return trackEvent('not_interested', contentId, contentType, {
        weight: -10,
        suppress_author: metadata.author || null,
        suppress_category: metadata.category || null,
        ...metadata,
    });
}

export function trackView(contentId, contentType = 'post', dwellTimeMs = 0) {
    return trackEvent('view', contentId, contentType, {
        weight: Math.min(dwellTimeMs / 5000, 2),
        dwell_time: dwellTimeMs,
    });
}

export function trackWatchPercent(contentId, percent) {
    const weight = percent > 80 ? 4 : percent > 50 ? 2 : percent > 20 ? 0.5 : -1;
    return trackEvent('watch', contentId, 'video', { watch_percent: percent, weight });
}

export function trackClick(contentId, contentType = 'post') {
    return trackEvent('click', contentId, contentType, { weight: 1 });
}

export function trackComment(contentId, contentType = 'post') {
    return trackEvent('comment', contentId, contentType, { weight: 5 });
}

// ===== Analytics queries =====

export function getInteractionHistory(contentType = null, limit = 100) {
    let events = getEvents();
    if (contentType) events = events.filter(e => e.contentType === contentType);
    return events.slice(-limit);
}

export function getPositiveSignals() {
    const events = getEvents();
    const positiveTypes = ['like', 'save', 'share', 'comment'];
    return [...new Set(events.filter(e => positiveTypes.includes(e.type)).map(e => e.contentId))];
}

export function getNegativeSignals() {
    const events = getEvents();
    const negativeTypes = ['skip', 'hide', 'not_interested'];
    return [...new Set(events.filter(e => negativeTypes.includes(e.type)).map(e => e.contentId))];
}

/**
 * Get suppressed authors/categories from "Not Interested" signals.
 */
export function getSuppressedContent() {
    const events = getEvents().filter(e => e.type === 'not_interested');
    return {
        authors: [...new Set(events.map(e => e.suppress_author).filter(Boolean))],
        categories: [...new Set(events.map(e => e.suppress_category).filter(Boolean))],
    };
}

/**
 * Get engagement score — now reads from persisted affinity vectors first.
 */
export function getAffinityScore(key, field = 'category') {
    const vectors = getAffinityVectors();
    if (vectors[field] && vectors[field][key] !== undefined) {
        const raw = vectors[field][key];
        return raw;
    }
    // Fallback: compute from events
    const events = getEvents();
    const relevant = events.filter(e => e[field] === key);
    if (relevant.length === 0) return 0;
    return relevant.reduce((sum, e) => sum + (e.weight || 0), 0) / relevant.length;
}

export function getTopAffinities(field = 'category', limit = 5) {
    const vectors = getAffinityVectors();
    if (vectors[field] && Object.keys(vectors[field]).length > 0) {
        return Object.entries(vectors[field])
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([key, score]) => ({ key, score }));
    }
    // Fallback
    const events = getEvents();
    const scores = {};
    events.forEach(e => {
        const key = e[field];
        if (!key) return;
        scores[key] = (scores[key] || 0) + (e.weight || 0);
    });
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([key, score]) => ({ key, score }));
}

export function getEventStats() {
    const events = getEvents();
    const stats = {};
    events.forEach(e => { stats[e.type] = (stats[e.type] || 0) + 1; });
    stats.total = events.length;
    return stats;
}

export function clearEvents() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AFFINITY_KEY);
}
