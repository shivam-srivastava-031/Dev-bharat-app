/**
 * Ranking API — Client proxy for the server-side recommendation engine.
 *
 * Calls the Supabase Edge Function `rank-feed` for server-side ranking.
 * Falls back to client-side ranking if the edge function is unavailable.
 *
 * Why server-side?
 *   - Weights stay private (not in client JS bundle)
 *   - A/B test assignments can be managed centrally
 *   - Algorithm updates don't require app redeployment
 */

import { supabase } from '../lib/supabase';
import { rankFeed as clientRankFeed, recordImpression } from './recommendationEngine';
import { getNegativeSignals, getSuppressedContent } from './eventTracker';

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL
    ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rank-feed`
    : null;

const AB_TEST_KEY = 'bharatapp_ab_variant';

function getVariant() {
    let variant = localStorage.getItem(AB_TEST_KEY);
    if (!variant) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(AB_TEST_KEY, variant);
    }
    return variant;
}

function getAffinityVectors() {
    try {
        return JSON.parse(localStorage.getItem('bharatapp_affinities') || '{}');
    } catch {
        return {};
    }
}

/**
 * Rank feed items — tries server-side first, falls back to client-side.
 *
 * @param {Array} items - raw feed items
 * @param {object} options - { diversify, boostLive }
 * @returns {Array} ranked items
 */
export async function rankFeedServerSide(items, options = {}) {
    // If Supabase isn't configured, use client-side ranking
    if (!EDGE_FUNCTION_URL || !import.meta.env.VITE_SUPABASE_URL) {
        if (import.meta.env.DEV) console.log('🧠 Using client-side ranking (no Supabase URL)');
        return clientRankFeed(items, options);
    }

    try {
        const suppressed = getSuppressedContent();
        const payload = {
            items,
            affinityVectors: getAffinityVectors(),
            negativeIds: getNegativeSignals(),
            suppressedAuthors: suppressed.authors,
            suppressedCategories: suppressed.categories,
            variant: getVariant(),
        };

        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000), // 5s timeout
        });

        if (!response.ok) throw new Error(`Edge function returned ${response.status}`);

        const { ranked } = await response.json();
        recordImpression(ranked.length);

        if (import.meta.env.DEV) console.log(`☁️ Server-ranked ${ranked.length} items`);
        return ranked;
    } catch (err) {
        // Fallback to client-side on any error
        console.warn('Server ranking failed, using client-side:', err.message);
        return clientRankFeed(items, options);
    }
}
