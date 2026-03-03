/**
 * Search Service — BM25 + personalized re-ranking.
 *
 * BM25 (Best Matching 25) is the ranking function used by Elasticsearch.
 * This is a client-side implementation for ranking search results by relevance.
 *
 * Formula: BM25(q, d) = Σ IDF(qi) · (f(qi,d) · (k1+1)) / (f(qi,d) + k1 · (1 - b + b · |d|/avgdl))
 *
 * Personalization layer re-ranks BM25 results using user affinity signals.
 */

import { getAffinityScore, getPositiveSignals } from './eventTracker';

// BM25 tuning parameters
const k1 = 1.2; // term frequency saturation
const b = 0.75; // document length normalization

/**
 * Tokenize text into lowercase terms
 */
function tokenize(text) {
    if (!text) return [];
    return text
        .toLowerCase()
        .replace(/[^\w\s#@]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 1);
}

/**
 * Compute term frequency in a document
 */
function termFrequency(term, tokens) {
    return tokens.filter(t => t === term).length;
}

/**
 * Compute IDF (Inverse Document Frequency)
 * IDF = ln((N - n + 0.5) / (n + 0.5) + 1)
 */
function idf(term, documents) {
    const N = documents.length;
    const n = documents.filter(doc => doc._tokens.includes(term)).length;
    return Math.log((N - n + 0.5) / (n + 0.5) + 1);
}

/**
 * Compute BM25 score for a query against a document
 */
function bm25Score(queryTokens, docTokens, avgDocLength, allDocs) {
    const docLength = docTokens.length;
    let score = 0;

    for (const qt of queryTokens) {
        const tf = termFrequency(qt, docTokens);
        const idfVal = idf(qt, allDocs);
        const numerator = tf * (k1 + 1);
        const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength));
        score += idfVal * (numerator / denominator);
    }

    return score;
}

/**
 * Full-text search using BM25 ranking.
 *
 * @param {string} query - user search query
 * @param {Array} documents - array of { id, title, content, author, category, ... }
 * @param {object} options - { fields: ['title', 'content'], personalize: true, limit: 20 }
 * @returns {Array} ranked results with _bm25Score and _finalScore
 */
export function search(query, documents, options = {}) {
    const {
        fields = ['title', 'content', 'author', 'description'],
        personalize = true,
        limit = 20,
        boostFields = { title: 2.0, author: 1.5, content: 1.0, description: 0.8 },
    } = options;

    if (!query || !query.trim()) return documents.slice(0, limit);

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return documents.slice(0, limit);

    // Pre-tokenize all documents
    const processedDocs = documents.map(doc => {
        const allTokens = [];
        const fieldTokens = {};

        fields.forEach(field => {
            const tokens = tokenize(doc[field]);
            fieldTokens[field] = tokens;
            allTokens.push(...tokens);
        });

        return { ...doc, _tokens: allTokens, _fieldTokens: fieldTokens };
    });

    // Average document length
    const avgDocLength = processedDocs.reduce((sum, d) => sum + d._tokens.length, 0) / Math.max(processedDocs.length, 1);

    // Score each document
    const scored = processedDocs.map(doc => {
        // Compute field-boosted BM25
        let bm25 = 0;
        fields.forEach(field => {
            const fieldScore = bm25Score(queryTokens, doc._fieldTokens[field] || [], avgDocLength, processedDocs);
            bm25 += fieldScore * (boostFields[field] || 1.0);
        });

        // Exact match bonus
        const fullText = fields.map(f => (doc[f] || '').toLowerCase()).join(' ');
        const queryLower = query.toLowerCase();
        if (fullText.includes(queryLower)) {
            bm25 *= 1.5; // exact match boost
        }

        return { ...doc, _bm25Score: bm25 };
    });

    // Filter out zero-score results
    let results = scored.filter(d => d._bm25Score > 0);

    // Personalization re-ranking
    if (personalize) {
        const positiveIds = new Set(getPositiveSignals());

        results = results.map(doc => {
            let personalBoost = 0;

            // Author affinity boost
            const authorAff = getAffinityScore(doc.author || '', 'author');
            personalBoost += Math.tanh(authorAff / 10) * 0.3;

            // Category affinity boost
            const catAff = getAffinityScore(doc.category || '', 'category');
            personalBoost += Math.tanh(catAff / 10) * 0.2;

            // Previously engaged content boost
            if (positiveIds.has(doc.id)) {
                personalBoost += 0.1;
            }

            const finalScore = doc._bm25Score * (1 + personalBoost);
            return { ...doc, _personalBoost: personalBoost, _finalScore: finalScore };
        });

        results.sort((a, b) => b._finalScore - a._finalScore);
    } else {
        results.sort((a, b) => b._bm25Score - a._bm25Score);
        results = results.map(d => ({ ...d, _finalScore: d._bm25Score }));
    }

    // Clean up internal tokens before returning
    return results.slice(0, limit).map(({ _tokens, _fieldTokens, ...rest }) => rest);
}

/**
 * Auto-suggest / typeahead — returns matching terms from the corpus.
 */
export function suggest(query, documents, limit = 5) {
    if (!query || query.length < 2) return [];

    const queryLower = query.toLowerCase();
    const suggestions = new Set();

    documents.forEach(doc => {
        ['title', 'content', 'author'].forEach(field => {
            const text = doc[field] || '';
            const words = text.split(/\s+/);
            words.forEach(word => {
                if (word.toLowerCase().startsWith(queryLower) && word.length > 2) {
                    suggestions.add(word);
                }
            });
        });
    });

    return [...suggestions].slice(0, limit);
}

/**
 * Highlighted search — wraps matching terms in markers for display.
 */
export function highlightMatches(text, query) {
    if (!text || !query) return text;
    const queryTokens = tokenize(query);
    let highlighted = text;

    queryTokens.forEach(token => {
        const regex = new RegExp(`(${token})`, 'gi');
        highlighted = highlighted.replace(regex, '**$1**');
    });

    return highlighted;
}
