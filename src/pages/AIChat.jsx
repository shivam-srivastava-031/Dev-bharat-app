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
    '🏏 IPL updates batao',
    '🍛 Biryani recipe do',
    '💻 Coding tips in Hindi',
    '🎬 Best Bollywood 2025',
    '🧘 Yoga for beginners',
    '🌏 Translate to Hindi',
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
        <div className="flex flex-col h-[calc(100dvh-120px)] animate-fade-in">
            {/* AI Chat Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-2.5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full gradient-saffron flex items-center justify-center shadow-md">
                            <span className="text-sm">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-800">BharatAI</h2>
                            <p className="text-[10px] text-india-green-500 font-medium">● Online — Ready to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            Demo Mode
                        </span>
                    </div>
                </div>
                <ModelSwitcher currentModel={currentModel} onModelChange={handleModelChange} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg.content} type={msg.type} />
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="chat-bubble-ai mr-auto max-w-[60%] px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-4 h-4 rounded-full gradient-saffron flex items-center justify-center">
                                <span className="text-[8px]">🤖</span>
                            </div>
                            <span className="text-[10px] font-semibold text-india-green-600">BharatAI</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-1">
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                            <div className="typing-dot" />
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 animate-slide-up">
                        <p className="font-medium">⚠️ Error</p>
                        <p className="text-xs mt-1">{error}</p>
                    </div>
                )}

                {/* Suggested Queries (show only when few messages) */}
                {messages.length <= 1 && !isLoading && (
                    <div className="pt-2">
                        <p className="text-xs text-gray-400 mb-2 font-medium">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQueries.map((query) => (
                                <button
                                    key={query}
                                    onClick={() => sendMessage(query)}
                                    className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 hover:border-saffron-300 hover:text-saffron-600 hover:bg-saffron-50 transition-all shadow-sm"
                                >
                                    {query}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2">
                <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors"
                    aria-label="Voice input"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="BharatAI se poochho..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 rounded-full gradient-saffron flex items-center justify-center shadow-md flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
