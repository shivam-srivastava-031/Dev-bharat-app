const models = [
    { id: 'claude', name: 'Claude AI', provider: 'Anthropic', emoji: '🧠' },
    { id: 'sarvam', name: 'Sarvam 2B', provider: 'Sarvam AI', emoji: '🇮🇳' },
    { id: 'bhashini', name: 'Bhashini', provider: 'MeitY', emoji: '🗣️' },
];

export default function ModelSwitcher({ currentModel, onModelChange }) {
    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            {models.map((model) => (
                <button
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${currentModel === model.id
                            ? 'bg-white shadow-sm text-saffron-600 scale-105'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    title={`${model.name} by ${model.provider}`}
                >
                    <span>{model.emoji}</span>
                    <span className="hidden sm:inline">{model.name}</span>
                    <span className="sm:hidden">{model.id === 'claude' ? 'Claude' : model.id === 'sarvam' ? 'Sarvam' : 'Bhash.'}</span>
                </button>
            ))}
        </div>
    );
}
