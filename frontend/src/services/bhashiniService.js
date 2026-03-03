const BHASHINI_API_KEY = import.meta.env.VITE_BHASHINI_API_KEY;
const BHASHINI_USER_ID = import.meta.env.VITE_BHASHINI_USER_ID;
const BHASHINI_API_URL = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/compute';

export async function sendBhashiniMessage(messages) {
    if (!BHASHINI_API_KEY || BHASHINI_API_KEY === 'your_bhashini_key_here') {
        return getDemoResponse(messages);
    }

    try {
        // Bhashini is primarily a translation/ASR/TTS pipeline
        // We'll use it for translation + simple NLU
        const lastMessage = messages[messages.length - 1]?.content || '';

        const response = await fetch(BHASHINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ulcaApiKey': BHASHINI_API_KEY,
                'userID': BHASHINI_USER_ID,
            },
            body: JSON.stringify({
                pipelineTasks: [
                    {
                        taskType: 'translation',
                        config: {
                            language: {
                                sourceLanguage: 'hi',
                                targetLanguage: 'en',
                            },
                        },
                    },
                ],
                inputData: {
                    input: [{ source: lastMessage }],
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Bhashini API error');
        }

        const data = await response.json();
        const translation = data.pipelineResponse?.[0]?.output?.[0]?.target || lastMessage;
        return `🗣️ Bhashini Translation: ${translation}\n\n(Bhashini se powered — India ki official language AI)`;
    } catch (error) {
        console.error('Bhashini API Error:', error);
        throw error;
    }
}

function getDemoResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    const responses = [
        '🗣️ Bhashini AI — Government of India ki official language technology! Main 22 Indian languages mein translation, speech-to-text, aur text-to-speech kar sakta hoon.\n\nDemo mode mein hoon. Real API ke liye bhashini.gov.in pe register karein!',
        '🇮🇳 Bhashini se namaste! Main MeitY (Ministry of Electronics & IT) ka product hoon. Hindi se Tamil, Bengali se Gujarati — sabhi translations kar sakta hoon!\n\nAbhi demo mode active hai.',
        '🗣️ Aapka text samajh gaya! Bhashini AI Indian languages ka bridge hai. Real mode mein main translate, transcribe, aur speak kar sakta hoon — 22 bhasha mein!\n\nAPI key lagayein for full experience.',
        '🗣️ Shukriya! Bhashini Digital India initiative ka hissa hai. Main NLP tasks like translation, ASR (Automatic Speech Recognition), aur TTS (Text-to-Speech) support karta hoon.\n\nDemo response — connect your Bhashini API key for real translations!',
    ];

    if (lastMessage.includes('translate') || lastMessage.includes('anuvad')) {
        return Promise.resolve('🗣️ Translation ke liye ready! Bhashini 22 Indian languages support karta hai. Example:\n\n"Namaste" → "Hello" (Hindi → English)\n"வணக்கம்" → "Hello" (Tamil → English)\n\nReal translation ke liye Bhashini API key add karein!');
    }

    return Promise.resolve(responses[Math.floor(Math.random() * responses.length)]);
}
