export default function ChatBubble({ message, type = 'received' }) {
    const bubbleClass =
        type === 'sent'
            ? 'chat-bubble-sent ml-auto'
            : type === 'ai'
                ? 'chat-bubble-ai mr-auto'
                : 'chat-bubble-received mr-auto';

    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className={`max-w-[80%] px-4 py-2.5 shadow-sm animate-slide-up ${bubbleClass}`}>
            {type === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center shadow-glow-saffron-sm">
                        <span className="text-[9px]">🤖</span>
                    </div>
                    <span className="text-[10px] font-bold text-saffron-400">BharatAI</span>
                </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            <div className={`flex items-center gap-1 mt-1 ${type === 'sent' ? 'justify-end' : ''}`}>
                <span className={`text-[9px] ${type === 'sent' ? 'text-white/50' : 'text-dark-400'}`}>
                    {timeStr}
                </span>
                {type === 'sent' && (
                    <span className="text-[9px] text-white/50">✓✓</span>
                )}
            </div>
        </div>
    );
}
