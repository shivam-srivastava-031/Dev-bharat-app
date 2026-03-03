// CricAPI Service — Free: 100 req/day
// https://cricapi.com

const API_KEY = import.meta.env.VITE_CRICAPI_KEY;
const BASE_URL = 'https://api.cricapi.com/v1';
const isDemoMode = () => !API_KEY || API_KEY === 'your_cricapi_key';

const demoMatches = [
    { id: '1', name: 'MI vs CSK — IPL 2026', status: 'Live', venue: 'Wankhede Stadium, Mumbai', date: '2026-03-03', matchType: 'T20', teams: ['Mumbai Indians', 'Chennai Super Kings'], score: [{ r: 178, w: 4, o: 18.2, inning: 'MI Innings' }, { r: 145, w: 6, o: 15.0, inning: 'CSK Innings' }] },
    { id: '2', name: 'IND vs AUS — 3rd Test', status: 'Day 2', venue: 'Eden Gardens, Kolkata', date: '2026-03-02', matchType: 'Test', teams: ['India', 'Australia'], score: [{ r: 312, w: 8, o: 87.0, inning: 'IND 1st' }] },
    { id: '3', name: 'RCB vs KKR — IPL 2026', status: 'Upcoming', venue: 'M Chinnaswamy, Bangalore', date: '2026-03-04', matchType: 'T20', teams: ['Royal Challengers', 'Kolkata Knight Riders'], score: [] },
    { id: '4', name: 'DC vs PBKS — IPL 2026', status: 'Completed', venue: 'Arun Jaitley Stadium, Delhi', date: '2026-03-01', matchType: 'T20', teams: ['Delhi Capitals', 'Punjab Kings'], score: [{ r: 195, w: 5, o: 20.0, inning: 'DC' }, { r: 192, w: 8, o: 20.0, inning: 'PBKS' }] },
];

/**
 * Get current/recent matches
 */
export async function getCurrentMatches() {
    if (isDemoMode()) return demoMatches;

    try {
        const res = await fetch(`${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`);
        if (!res.ok) throw new Error(`CricAPI: ${res.status}`);
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.warn('CricAPI error, using demo:', error.message);
        return demoMatches;
    }
}

/**
 * Get match details
 */
export async function getMatchInfo(matchId) {
    if (isDemoMode()) return demoMatches.find(m => m.id === matchId) || demoMatches[0];

    try {
        const res = await fetch(`${BASE_URL}/match_info?apikey=${API_KEY}&id=${matchId}`);
        if (!res.ok) throw new Error(`CricAPI: ${res.status}`);
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        console.warn('CricAPI error:', error.message);
        return demoMatches[0];
    }
}

/**
 * Get live cricket score
 */
export async function getLiveScore(matchId) {
    if (isDemoMode()) return demoMatches.find(m => m.id === matchId) || demoMatches[0];

    try {
        const res = await fetch(`${BASE_URL}/match_scorecard?apikey=${API_KEY}&id=${matchId}`);
        if (!res.ok) throw new Error(`CricAPI: ${res.status}`);
        const data = await res.json();
        return data.data || null;
    } catch (error) {
        console.warn('CricAPI error:', error.message);
        return demoMatches[0];
    }
}

/**
 * Format score string
 */
export function formatScore(scoreArr) {
    if (!scoreArr || scoreArr.length === 0) return 'Yet to bat';
    return scoreArr.map(s => `${s.inning}: ${s.r}/${s.w} (${s.o} ov)`).join(' | ');
}
