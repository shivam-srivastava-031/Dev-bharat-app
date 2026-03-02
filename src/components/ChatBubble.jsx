export default function ChatBubble({ message, type = 'received' }) {
    const bubbleClass =
        type === 'sent'
            ? 'chat-bubble-sent ml-auto'
            : type === 'ai'
                ? 'chat-bubble-ai mr-auto'
                : 'chat-bubble-received mr-auto';

    return (
        <div className={`max-w-[80%] px-4 py-2.5 shadow-sm animate-slide-up ${bubbleClass}`}>
            {type === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full gradient-saffron flex items-center justify-center">
                        <span className="text-[8px]">🤖</span>
                    </div>
                    <span className="text-[10px] font-semibold text-india-green-600">BharatAI</span>
                </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
    );
}
