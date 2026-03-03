import { useState } from 'react';
import { TOPICS, LANGUAGES, completeOnboarding, seedAffinityFromOnboarding } from '../services/coldStart';
import { trackEvent } from '../services/eventTracker';

export default function OnboardingScreen({ onComplete }) {
    const [step, setStep] = useState(1); // 1 = topics, 2 = language
    const [selectedTopics, setSelectedTopics] = useState(new Set());
    const [selectedLang, setSelectedLang] = useState('en');

    const toggleTopic = (id) => {
        setSelectedTopics(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleFinish = () => {
        const topics = [...selectedTopics];
        seedAffinityFromOnboarding(trackEvent, topics);
        completeOnboarding(topics, selectedLang);
        onComplete();
    };

    return (
        <div className="min-h-screen gradient-mesh-dark flex flex-col px-5 py-8 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-10 -left-20 w-60 h-60 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 -right-20 w-60 h-60 bg-india-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

            {/* Header */}
            <div className="text-center mb-6 animate-fade-in relative z-10">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl gradient-saffron flex items-center justify-center shadow-glow-saffron">
                    <img src="/logo.png" alt="BharatApp" className="w-9 h-9 rounded-lg object-cover" />
                </div>
                <h1 className="text-xl font-extrabold text-dark-50">
                    {step === 1 ? 'What do you like? 🇮🇳' : 'Choose your language'}
                </h1>
                <p className="text-xs text-dark-400 mt-1.5">
                    {step === 1 ? 'Pick 3+ topics to personalize your feed' : 'Content will be prioritized in your language'}
                </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6 relative z-10">
                <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 1 ? 'gradient-saffron' : 'bg-white/10'}`} />
                <div className={`w-8 h-1.5 rounded-full transition-all ${step >= 2 ? 'gradient-saffron' : 'bg-white/10'}`} />
            </div>

            {/* Step 1: Topics */}
            {step === 1 && (
                <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10 animate-slide-up flex-1 overflow-y-auto">
                    {TOPICS.map((topic) => {
                        const isActive = selectedTopics.has(topic.id);
                        return (
                            <button
                                key={topic.id}
                                onClick={() => toggleTopic(topic.id)}
                                className={`relative flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl transition-all duration-200 active:scale-95 overflow-hidden ${isActive
                                        ? 'border-2 border-saffron-400 shadow-glow-saffron-sm'
                                        : 'border border-white/5 hover:border-white/10'
                                    }`}
                                style={{
                                    background: isActive ? 'rgba(255, 153, 51, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                                }}
                            >
                                {isActive && (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10`} />
                                )}
                                <span className="text-xl relative z-10">{topic.emoji}</span>
                                <span className={`text-xs font-semibold relative z-10 ${isActive ? 'text-saffron-300' : 'text-dark-200'}`}>
                                    {topic.label}
                                </span>
                                {isActive && (
                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-saffron flex items-center justify-center z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Step 2: Language */}
            {step === 2 && (
                <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10 animate-slide-up flex-1">
                    {LANGUAGES.map((lang) => {
                        const isActive = selectedLang === lang.id;
                        return (
                            <button
                                key={lang.id}
                                onClick={() => setSelectedLang(lang.id)}
                                className={`flex flex-col items-center gap-1.5 px-4 py-5 rounded-2xl transition-all duration-200 active:scale-95 ${isActive
                                        ? 'border-2 border-saffron-400 bg-saffron-500/10 shadow-glow-saffron-sm'
                                        : 'border border-white/5 bg-white/[0.03] hover:border-white/10'
                                    }`}
                            >
                                <span className={`text-lg font-bold ${isActive ? 'text-saffron-300' : 'text-dark-100'}`}>
                                    {lang.native}
                                </span>
                                <span className={`text-[10px] font-medium ${isActive ? 'text-saffron-400' : 'text-dark-400'}`}>
                                    {lang.label}
                                </span>
                                {isActive && (
                                    <div className="w-4 h-4 rounded-full gradient-saffron flex items-center justify-center mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Action buttons */}
            <div className="mt-auto relative z-10">
                {step === 1 ? (
                    <>
                        <button
                            onClick={() => setStep(2)}
                            disabled={selectedTopics.size < 3}
                            className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.99] ${selectedTopics.size >= 3
                                    ? 'gradient-saffron shadow-glow-saffron hover:opacity-90'
                                    : 'bg-white/5 text-dark-400 cursor-not-allowed'
                                }`}
                        >
                            {selectedTopics.size < 3
                                ? `Pick ${3 - selectedTopics.size} more`
                                : `Next → Language (${selectedTopics.size} topics)`
                            }
                        </button>
                        <button
                            onClick={() => { completeOnboarding([], 'en'); onComplete(); }}
                            className="w-full py-2.5 text-dark-500 text-[10px] font-medium mt-1.5 hover:text-dark-300 transition-colors"
                        >
                            Skip for now
                        </button>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-3.5 rounded-2xl border border-white/10 text-dark-200 font-bold text-sm hover:bg-white/5 transition-all"
                        >
                            ← Back
                        </button>
                        <button
                            onClick={handleFinish}
                            className="flex-[2] py-3.5 rounded-2xl gradient-saffron text-white font-bold text-sm shadow-glow-saffron hover:opacity-90 transition-all active:scale-[0.99]"
                        >
                            Start Exploring 🚀
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
