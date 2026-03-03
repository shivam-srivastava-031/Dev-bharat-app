import { useRef, useEffect, useState } from 'react';

const models = [
    { id: 'claude', name: 'Claude AI', provider: 'Anthropic', emoji: '🧠' },
    { id: 'sarvam', name: 'Sarvam 2B', provider: 'Sarvam AI', emoji: '🇮🇳' },
    { id: 'bhashini', name: 'Bhashini', provider: 'MeitY', emoji: '🗣️' },
];

export default function ModelSwitcher({ currentModel, onModelChange }) {
    const containerRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    useEffect(() => {
        if (containerRef.current) {
            const activeIndex = models.findIndex(m => m.id === currentModel);
            const buttons = containerRef.current.querySelectorAll('button');
            if (buttons[activeIndex]) {
                const btn = buttons[activeIndex];
                setIndicatorStyle({
                    width: btn.offsetWidth,
                    transform: `translateX(${btn.offsetLeft - 4}px)`,
                });
            }
        }
    }, [currentModel]);

    return (
        <div ref={containerRef} className="relative flex items-center gap-0.5 bg-white/5 rounded-2xl p-1 border border-white/5">
            {/* Sliding indicator */}
            <div
                className="absolute top-1 h-[calc(100%-8px)] rounded-xl gradient-saffron shadow-glow-saffron-sm transition-all duration-300 ease-out"
                style={indicatorStyle}
            />
            {models.map((model) => (
                <button
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className={`relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${currentModel === model.id
                            ? 'text-white'
                            : 'text-dark-300 hover:text-dark-100'
                        }`}
                    title={`${model.name} by ${model.provider}`}
                >
                    <span className="text-sm">{model.emoji}</span>
                    <span className="hidden sm:inline">{model.name}</span>
                    <span className="sm:hidden">{model.id === 'claude' ? 'Claude' : model.id === 'sarvam' ? 'Sarvam' : 'Bhash.'}</span>
                </button>
            ))}
        </div>
    );
}
