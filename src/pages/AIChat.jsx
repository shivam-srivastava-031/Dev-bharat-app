import { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/ChatBubble';
import ModelSwitcher from '../components/ModelSwitcher';
import { sendClaudeMessage } from '../services/claudeService';
import { sendSarvamMessage } from '../services/sarvamService';
import { sendBhashiniMessage } from '../services/bhashiniService';

const welcomeMessages = {
    claude: 'Namaste! 🙏 Main BharatAI hoon, powered by Claude. Aapki kya madad kar sakta hoon aaj? Hindi, English ya Hinglish — kisi bhi bhasha mein baat karo! 😊',
    sarvam: 'Namaste! 🇮🇳 Main BharatAI hoon, powered by Sarvam — Bharat ka apna AI! Hindi, Tamil, Telugu aur 10+ Indian languages mein baat kar sakta hoon! 🙏',
    bhashini: 'Namaste! 🗣️ Main BharatAI hoon, powered by Bhashini — Government of India ka language AI. 22 official bhasha mein translation aur NLP support! 🇮🇳',
};

const suggestedQueries = [
    { text: '🏏 IPL updates batao', color: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/15' },
    { text: '🍛 Biryani recipe do', color: 'from-orange-500/10 to-red-500/10', border: 'border-orange-500/15' },
    { text: '💻 Coding tips in Hindi', color: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/15' },
    { text: '🎬 Best Bollywood 2025', color: 'from-pink-500/10 to-rose-500/10', border: 'border-pink-500/15' },
    { text: '🧘 Yoga for beginners', color: 'from-teal-500/10 to-cyan-500/10', border: 'border-teal-500/15' },
    { text: '🌏 Translate to Hindi', color: 'from-purple-500/10 to-violet-500/10', border: 'border-purple-500/15' },
];

export default function AIChat() {
    const [currentModel, setCurrentModel] = useState('claude');
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: welcomeMessages.claude, type: 'ai' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleModelChange = (modelId) => {
        setCurrentModel(modelId);
        setMessages([
            { id: Date.now(), role: 'assistant', content: welcomeMessages[modelId], type: 'ai' },
        ]);
        setError(null);
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: text.trim(),
            type: 'sent',
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const chatHistory = [...messages, userMsg]
                .filter((m) => m.role === 'user' || m.role === 'assistant')
                .map((m) => ({ role: m.role, content: m.content }));

            let response;
            switch (currentModel) {
                case 'sarvam':
                    response = await sendSarvamMessage(chatHistory);
                    break;
                case 'bhashini':
                    response = await sendBhashiniMessage(chatHistory);
                    break;
                case 'claude':
                default:
                    response = await sendClaudeMessage(chatHistory);
                    break;
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: response,
                    type: 'ai',
                },
            ]);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-120px)]">
            {/* AI Chat Header */}
            <div className="glass-light border-b border-white/5 px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center shadow-glow-saffron-sm">
                                <span className="text-lg">🤖</span>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-india-green-400 rounded-full border-2 border-dark-700 shadow-glow-green" />
                        </div>
                        <div>
                            <h2 className="text-sm font-extrabold text-dark-50">BharatAI</h2>
                            <p className="text-[10px] text-india-green-400 font-semibold">● Online — Ready to help</p>
                        </div>
                    </div>
                    <span className="text-[10px] text-dark-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 font-medium">
                        Demo Mode
                    </span>
                </div>
                <ModelSwitcher currentModel={currentModel} onModelChange={handleModelChange} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg.content} type={msg.type} />
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="chat-bubble-ai mr-auto max-w-[60%] px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center shadow-glow-saffron-sm">
                                <span className="text-[9px]">🤖</span>
                            </div>
                            <span className="text-[10px] font-bold text-saffron-400">BharatAI</span>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 animate-slide-up">
                        <p className="font-bold">⚠️ Error</p>
                        <p className="text-xs mt-1 text-red-300">{error}</p>
                    </div>
                )}

                {/* Suggested Queries */}
                {messages.length <= 1 && !isLoading && (
                    <div className="pt-4">
                        <p className="text-xs text-dark-400 mb-3 font-semibold">Try asking:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {suggestedQueries.map((query) => (
                                <button
                                    key={query.text}
                                    onClick={() => sendMessage(query.text)}
                                    className={`bg-gradient-to-br ${query.color} border ${query.border} rounded-xl px-3 py-3 text-xs text-dark-100 hover:bg-white/5 transition-all text-left font-medium active:scale-[0.98]`}
                                >
                                    {query.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="glass-light border-t border-white/5 px-3 py-2.5 flex items-center gap-2">
                <button
                    type="button"
                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors active:scale-95"
                    aria-label="Voice input"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="BharatAI se poochho..."
                    className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/30 border border-white/5 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 rounded-xl gradient-saffron flex items-center justify-center shadow-glow-saffron-sm flex-shrink-0 hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
