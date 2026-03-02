const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `You are BharatAI, a friendly and helpful AI assistant for Indian users on BharatApp. 
You understand and speak in Hinglish (mix of Hindi and English) naturally.
You are knowledgeable about Indian culture, festivals, cuisine, cricket, Bollywood, technology, and daily life in India.
Keep responses concise, warm, and helpful. Use emojis occasionally.
If someone greets you, greet them back in a friendly Hinglish style.
You can understand Hindi written in Devanagari or Roman script.`;

export async function sendClaudeMessage(messages) {
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your_anthropic_key_here') {
        // Return a simulated response for demo mode
        return getDemoResponse(messages);
    }

    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Claude API error');
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}

function getDemoResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    const demoResponses = [
        'Namaste! 🙏 Main BharatAI hoon, aapki madad ke liye ready! Kya jaanna chahte ho?',
        'Bahut accha sawaal hai! 🤔 India mein technology ka scope bahut bright hai. Startups boom ho raha hai, especially Bangalore, Hyderabad aur Pune mein. 🚀',
        'Haan bilkul! Cricket toh hamari jaan hai! 🏏 India ka cricket team duniya ka best team hai. Kohli, Rohit, aur naye players bhi kamaal kar rahe hain! 🇮🇳',
        'Aaj ka weather kaisa bhi ho, chai toh banti hai! ☕ Aur kuch help chahiye toh batao, main hamesha ready hoon! 😊',
        'Bollywood ki baat karein toh, recent movies bahut diverse ho gayi hain. Content-driven cinema ka zamana aa gaya hai! 🎬✨',
        'Yoga aur Ayurveda — ye India ki world ko sabse badi gift hai! 🧘 Daily 15 min yoga karo, life transform ho jayegi. 🕉️',
    ];

    if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('namaste')) {
        return Promise.resolve('Namaste! 🙏 Kaise ho? Main BharatAI hoon — aapka apna AI assistant! Batao, kya help chahiye aaj? 😊');
    }
    if (lastMessage.includes('cricket')) {
        return Promise.resolve(demoResponses[2]);
    }
    if (lastMessage.includes('bollywood') || lastMessage.includes('movie')) {
        return Promise.resolve(demoResponses[4]);
    }

    return Promise.resolve(demoResponses[Math.floor(Math.random() * demoResponses.length)]);
}
