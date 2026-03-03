import { useState } from 'react';
import { trackEvent } from '../services/eventTracker';

const ONBOARDING_KEY = 'bharatapp_onboarded';

const topics = [
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
];

/**
 * Check if the user has completed onboarding.
 */
export function isOnboarded() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

/**
 * Mark onboarding as complete.
 */
export function completeOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
}

export default function Onboarding({ onComplete }) {
    const [selected, setSelected] = useState(new Set());

    const toggle = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleFinish = () => {
        // Seed the affinity vectors with initial preferences (weight: +8 per topic)
        selected.forEach(topicId => {
            trackEvent('onboard_interest', topicId, topicId, {
                category: topicId,
                weight: 8,
            });
        });
        completeOnboarding();
        onComplete();
    };

    return (
        <div className="min-h-screen gradient-mesh-dark flex flex-col px-6 py-10 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-10 -left-20 w-60 h-60 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 -right-20 w-60 h-60 bg-india-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

            {/* Header */}
            <div className="text-center mb-8 animate-fade-in relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-saffron flex items-center justify-center shadow-glow-saffron">
                    <img src="/logo.png" alt="BharatApp" className="w-10 h-10 rounded-lg object-cover" />
                </div>
                <h1 className="text-2xl font-extrabold text-dark-50">What do you like? 🇮🇳</h1>
                <p className="text-sm text-dark-400 mt-2">Pick 3+ topics to personalize your feed</p>
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8 relative z-10 animate-slide-up">
                {topics.map((topic) => {
                    const isActive = selected.has(topic.id);
                    return (
                        <button
                            key={topic.id}
                            onClick={() => toggle(topic.id)}
                            className={`relative flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden ${isActive
                                    ? 'border-2 border-saffron-400 shadow-glow-saffron-sm'
                                    : 'border border-white/5 hover:border-white/10'
                                }`}
                            style={{
                                background: isActive
                                    ? 'rgba(255, 153, 51, 0.12)'
                                    : 'rgba(255, 255, 255, 0.03)',
                            }}
                        >
                            {/* Gradient accent on active */}
                            {isActive && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10`} />
                            )}

                            <span className="text-2xl relative z-10">{topic.emoji}</span>
                            <span className={`text-sm font-semibold relative z-10 ${isActive ? 'text-saffron-300' : 'text-dark-200'}`}>
                                {topic.label}
                            </span>

                            {/* Check mark */}
                            {isActive && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-saffron flex items-center justify-center z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Continue Button */}
            <div className="mt-auto relative z-10">
                <button
                    onClick={handleFinish}
                    disabled={selected.size < 3}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.99] ${selected.size >= 3
                            ? 'gradient-saffron shadow-glow-saffron hover:opacity-90'
                            : 'bg-white/5 text-dark-400 cursor-not-allowed'
                        }`}
                >
                    {selected.size < 3
                        ? `Pick ${3 - selected.size} more topic${3 - selected.size > 1 ? 's' : ''}`
                        : `Continue with ${selected.size} topics →`
                    }
                </button>
                <button
                    onClick={() => { completeOnboarding(); onComplete(); }}
                    className="w-full py-3 text-dark-500 text-xs font-medium mt-2 hover:text-dark-300 transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
