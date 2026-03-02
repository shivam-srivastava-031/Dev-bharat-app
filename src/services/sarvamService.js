const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';

export async function sendSarvamMessage(messages) {
    if (!SARVAM_API_KEY || SARVAM_API_KEY === 'your_sarvam_key_here') {
        return getDemoResponse(messages);
    }

    try {
        const response = await fetch(SARVAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SARVAM_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'sarvam-2b-v0.5',
                messages: [
                    {
                        role: 'system',
                        content: 'You are BharatAI powered by Sarvam. You speak fluently in Hindi, English, and Hinglish. You understand Indian culture and help Indian users warmly.',
                    },
                    ...messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                ],
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Sarvam API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Sarvam API Error:', error);
        throw error;
    }
}

function getDemoResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    const responses = [
        '🇮🇳 Sarvam AI yahan hai aapki seva mein! Main Bharat ka apna AI model hoon. Hindi, Tamil, Telugu, Bengali — sabhi bhasha samajhta hoon!',
        'Bahut shukriya sawaal ke liye! Main Indian languages mein trained hoon, toh Hindi mein baat karna mujhe bahut accha lagta hai! 😊',
        'India ki technology mein bahut tarakki ho rahi hai. Make in India, Digital India — sab mil ke desh ko aage le ja rahe hain! 🚀',
        'Kya baat hai! Aapne bilkul sahi jagah sawaal pucha. Batayein, aur kya jaanna hai? 🙏',
    ];

    if (lastMessage.includes('hello') || lastMessage.includes('namaste') || lastMessage.includes('hi')) {
        return Promise.resolve('🙏 Namaste! Main Sarvam AI hoon — Bharat ka apna language model! Aapki kya madad kar sakta hoon aaj?');
    }

    return Promise.resolve(responses[Math.floor(Math.random() * responses.length)]);
}
