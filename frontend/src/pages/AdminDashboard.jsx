import { useState, useEffect, useCallback } from 'react';
import { getABTestResults, recordClickThrough } from '../services/feedPipeline';
import { getEventStats, getTopAffinities, getInteractionHistory } from '../services/eventTracker';
import { getCacheStats } from '../services/offlineCache';

export default function AdminDashboard() {
    const [tab, setTab] = useState('algorithm');
    const [stats, setStats] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

    useEffect(() => {
        const abResults = getABTestResults();
        const eventStats = getEventStats();
        const topCategories = getTopAffinities('category', 8);
        const topAuthors = getTopAffinities('author', 5);
        const recentEvents = getInteractionHistory(null, 20);
        getCacheStats().then(cacheStats => {
            setStats({ abResults, eventStats, topCategories, topAuthors, recentEvents, cacheStats });
        });
    }, [refreshKey]);

    if (!stats) return (
        <div className="p-6 text-center">
            <div className="w-6 h-6 border-2 border-saffron-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
    );

    const { abResults, eventStats, topCategories, topAuthors, recentEvents, cacheStats } = stats;

    const tabs = [
        { id: 'algorithm', label: '🧠 Algorithm', icon: '🧠' },
        { id: 'engagement', label: '📊 Engagement', icon: '📊' },
        { id: 'cache', label: '💾 Cache', icon: '💾' },
        { id: 'events', label: '📋 Events', icon: '📋' },
    ];

    return (
        <div className="pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-dark-50">📊 Admin Dashboard</h2>
                <button
                    onClick={refresh}
                    className="px-3 py-1.5 rounded-xl bg-saffron-500/10 text-saffron-400 text-[10px] font-bold hover:bg-saffron-500/20 transition-all active:scale-95"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${tab === t.id
                                ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                                : 'bg-white/5 text-dark-300 hover:bg-white/10'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Algorithm Tab */}
            {tab === 'algorithm' && (
                <div className="space-y-3">
                    {/* A/B Test Results */}
                    <Card title="🧪 A/B Test Results">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] text-dark-400">Your variant:</span>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${abResults.variant === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                Variant {abResults.variant}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <VariantCard
                                label="A"
                                subtitle="CategoryAffinity: 0.15"
                                impressions={abResults.A.impressions}
                                clicks={abResults.A.clicks}
                                ctr={abResults.A.ctr}
                                color="blue"
                                isWinner={abResults.winner === 'A'}
                            />
                            <VariantCard
                                label="B"
                                subtitle="CategoryAffinity: 0.30"
                                impressions={abResults.B.impressions}
                                clicks={abResults.B.clicks}
                                ctr={abResults.B.ctr}
                                color="purple"
                                isWinner={abResults.winner === 'B'}
                            />
                        </div>
                        {abResults.winner !== 'Tie' && (
                            <div className="mt-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
                                <span className="text-[10px] font-bold text-green-400">
                                    🏆 Variant {abResults.winner} is winning with {abResults.winner === 'A' ? abResults.A.ctr : abResults.B.ctr} CTR
                                </span>
                            </div>
                        )}
                    </Card>

                    {/* Top Affinities */}
                    <Card title="❤️ Top Category Affinities">
                        {topCategories.length === 0 ? (
                            <p className="text-[10px] text-dark-500">No data yet — interact with the feed!</p>
                        ) : (
                            <div className="space-y-1.5">
                                {topCategories.map((a, i) => (
                                    <AffinityBar key={a.key} rank={i + 1} label={a.key} score={a.score} maxScore={topCategories[0]?.score || 1} />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Top Authors */}
                    <Card title="👤 Top Author Affinities">
                        {topAuthors.length === 0 ? (
                            <p className="text-[10px] text-dark-500">No data yet</p>
                        ) : (
                            <div className="space-y-1.5">
                                {topAuthors.map((a, i) => (
                                    <AffinityBar key={a.key} rank={i + 1} label={a.key} score={a.score} maxScore={topAuthors[0]?.score || 1} />
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Engagement Tab */}
            {tab === 'engagement' && (
                <div className="space-y-3">
                    <Card title="📈 Event Stats">
                        <div className="grid grid-cols-2 gap-2">
                            <StatBox label="Total Events" value={eventStats.totalEvents} icon="📊" />
                            <StatBox label="Unique Content" value={eventStats.uniqueContent} icon="🎯" />
                            <StatBox label="Positive Signals" value={eventStats.positiveCount} icon="👍" color="green" />
                            <StatBox label="Negative Signals" value={eventStats.negativeCount} icon="👎" color="red" />
                        </div>
                    </Card>

                    <Card title="🔥 Signal Breakdown">
                        <div className="space-y-1.5">
                            {Object.entries(eventStats.byType || {}).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/[0.02]">
                                    <span className="text-[10px] text-dark-200 font-medium capitalize">{type.replace(/_/g, ' ')}</span>
                                    <span className="text-[10px] text-saffron-400 font-bold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* Cache Tab */}
            {tab === 'cache' && (
                <div className="space-y-3">
                    <Card title="💾 IndexedDB Cache Stats">
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(cacheStats).map(([store, count]) => (
                                <StatBox key={store} label={store} value={count} icon={count > 0 ? '✅' : '⬜'} />
                            ))}
                        </div>
                    </Card>
                    <Card title="ℹ️ Cache Info">
                        <div className="space-y-1">
                            <InfoRow label="Feed expiry" value="24 hours" />
                            <InfoRow label="Video expiry" value="24 hours" />
                            <InfoRow label="Weather expiry" value="1 hour" />
                            <InfoRow label="Strategy" value="Stale-While-Revalidate" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Events Tab */}
            {tab === 'events' && (
                <div className="space-y-3">
                    <Card title="📋 Recent Events (Last 20)">
                        {recentEvents.length === 0 ? (
                            <p className="text-[10px] text-dark-500">No events recorded yet</p>
                        ) : (
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {recentEvents.map((event, i) => (
                                    <div key={event.id || i} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[9px]">
                                                    {event.type === 'like' ? '❤️' : event.type === 'save' ? '🔖' :
                                                        event.type === 'skip' ? '⏭️' : event.type === 'not_interested' ? '🚫' :
                                                            event.type === 'view' ? '👁️' : event.type === 'click' ? '👆' : '📌'}
                                                </span>
                                                <span className="text-[10px] text-dark-200 font-medium truncate">{event.type}</span>
                                            </div>
                                            <p className="text-[9px] text-dark-500 truncate">{event.contentId || event.category}</p>
                                        </div>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${event.weight > 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                                            }`}>
                                            {event.weight > 0 ? '+' : ''}{event.weight}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}

// ===== Reusable components =====

function Card({ title, children }) {
    return (
        <div className="rounded-2xl border border-white/5 p-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h3 className="text-xs font-bold text-dark-100 mb-2">{title}</h3>
            {children}
        </div>
    );
}

function VariantCard({ label, subtitle, impressions, clicks, ctr, color, isWinner }) {
    return (
        <div className={`rounded-xl p-2.5 border ${isWinner ? `border-${color}-500/30 bg-${color}-500/5` : 'border-white/5 bg-white/[0.02]'}`}>
            <div className="flex items-center gap-1 mb-1.5">
                <span className={`text-xs font-extrabold text-${color}-400`}>{label}</span>
                {isWinner && <span className="text-[9px]">🏆</span>}
            </div>
            <p className="text-[9px] text-dark-500 mb-2">{subtitle}</p>
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span className="text-[9px] text-dark-400">Impressions</span>
                    <span className="text-[9px] text-dark-200 font-bold">{impressions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[9px] text-dark-400">Clicks</span>
                    <span className="text-[9px] text-dark-200 font-bold">{clicks}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[9px] text-dark-400">CTR</span>
                    <span className={`text-[9px] font-extrabold text-${color}-400`}>{ctr}</span>
                </div>
            </div>
        </div>
    );
}

function AffinityBar({ rank, label, score, maxScore }) {
    const width = Math.max((score / maxScore) * 100, 5);
    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-dark-500 w-3">{rank}</span>
            <span className="text-[10px] text-dark-200 font-medium w-20 truncate capitalize">{label}</span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full gradient-saffron transition-all duration-500" style={{ width: `${width}%` }} />
            </div>
            <span className="text-[9px] text-saffron-400 font-bold w-8 text-right">{score.toFixed(1)}</span>
        </div>
    );
}

function StatBox({ label, value, icon, color = 'saffron' }) {
    return (
        <div className="rounded-xl p-2.5 bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-1 mb-1">
                <span className="text-sm">{icon}</span>
                <span className="text-[9px] text-dark-400">{label}</span>
            </div>
            <span className={`text-lg font-extrabold text-${color}-400`}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between px-2 py-1 rounded-lg bg-white/[0.02]">
            <span className="text-[10px] text-dark-400">{label}</span>
            <span className="text-[10px] text-dark-200 font-medium">{value}</span>
        </div>
    );
}
