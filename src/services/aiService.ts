// src/services/aiService.ts
/**
 * DigoAI Service - Powered by GitHub Models (FREE)
 * 
 * How to get your GitHub Token:
 * 1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
 * 2. Generate a new token with 'repo' and 'read:org' scopes
 * 3. Copy the token and add to .env: VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
 * 
 * Available Models:
 * - openai/gpt-4o (Best)
 * - openai/gpt-4o-mini (Faster)
 * - microsoft/phi-3-mini-128k-instruct (Lightweight)
 * - meta-llama/llama-3-70b-instruct (Open Source)
 */

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const MODEL = import.meta.env.VITE_AI_MODEL || 'openai/gpt-4o';

// Check token on load
console.log('🔑 GitHub Token exists:', !!GITHUB_TOKEN);
console.log('🤖 Using model:', MODEL);

// ============================================
// MAIN AI SERVICE - GitHub Models
// ============================================

export const getAIResponse = async (
    userMessage: string,
    context: string = 'You are DigoAI, a helpful virtual assistant for Digo Tsion and Bibugn Wereda, Ethiopia. You provide information about Mount Choke, cultural events, tourism, and investment opportunities. Keep responses concise and informative.'
): Promise<string> => {
    // Check token FIRST
    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token_here') {
        console.warn('⚠️ No GitHub token - using fallback');
        return getFallbackResponse(userMessage);
    }

    try {
        console.log('🤖 Sending to GitHub AI...');
        console.log('📝 User message:', userMessage);

        const response = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: context },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: false,
            }),
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ GitHub API Error:', response.status, errorData);

            if (response.status === 401) {
                return '⚠️ GitHub token is invalid or expired. Please check your VITE_GITHUB_TOKEN in .env file.';
            }
            if (response.status === 429) {
                return '⚠️ Rate limit exceeded. Please try again in a few moments.';
            }
            if (response.status === 403) {
                return '⚠️ Access forbidden. Please check your GitHub token permissions (needs repo and read:org scopes).';
            }

            return getFallbackResponse(userMessage);
        }

        const data = await response.json();
        console.log('✅ AI Response received');

        const aiResponse = data.choices?.[0]?.message?.content;
        if (aiResponse) {
            return aiResponse;
        } else {
            console.warn('⚠️ No response from AI, using fallback');
            return getFallbackResponse(userMessage);
        }
    } catch (error) {
        console.error('❌ GitHub AI Error:', error);
        return getFallbackResponse(userMessage);
    }
};


// ============================================
// STREAMING RESPONSE
// ============================================

export const getAIResponseStream = async (
    userMessage: string,
    onChunk: (chunk: string) => void,
    context: string = 'You are DigoAI, a helpful virtual assistant for Digo Tsion and Bibugn Wereda, Ethiopia.'
): Promise<void> => {
    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token_here') {
        onChunk(getFallbackResponse(userMessage));
        return;
    }

    try {
        const response = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: context },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: true,
            }),
        });

        if (!response.ok) {
            onChunk(getFallbackResponse(userMessage));
            return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            onChunk(getFallbackResponse(userMessage));
            return;
        }

        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ GitHub Stream Error:', error);
        onChunk(getFallbackResponse(userMessage));
    }
};

// ============================================
// TEST CONNECTION
// ============================================

export const testGitHubConnection = async (): Promise<{ success: boolean; message: string }> => {
    if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_personal_access_token_here') {
        return { success: false, message: '❌ GitHub token not configured. Add VITE_GITHUB_TOKEN to .env' };
    }

    try {
        const response = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 5,
            }),
        });

        if (response.ok) {
            return { success: true, message: '✅ GitHub AI connected successfully!' };
        } else {
            let msg = `❌ GitHub API error: ${response.status}`;
            if (response.status === 401) msg = '❌ Invalid token. Please regenerate your GitHub token.';
            if (response.status === 403) msg = '❌ Token needs "repo" and "read:org" scopes.';
            if (response.status === 429) msg = '❌ Rate limit exceeded. Try again later.';
            return { success: false, message: msg };
        }
    } catch (error: any) {
        return { success: false, message: `❌ Connection error: ${error.message}` };
    }
};

// ============================================
// FALLBACK LOCAL RESPONSES
// ============================================

export const getFallbackResponse = (userMessage: string): string => {
    const query = userMessage.toLowerCase();

    if (query.includes('market') || query.includes('gebeya') || query.includes('tuesday')) {
        return "The Digo Tsion Tuesday Market (Maksengo Gebeya) is an ancient, highly vibrant weekly trade event. Farmers descend from Mount Choke to trade organic Gojjam barley, high-altitude wheat, hand-woven garments, and our premium organic white honey. It is an amazing cultural spectacle!";
    }

    if (query.includes('choke') || query.includes('mountain') || query.includes('trek')) {
        return "Mount Choke rising over 4,100 meters is an eco-treasure. It stands as a critical UNESCO biosphere-candidate and water tower of the region regulating water flows to the Nile Basin. Key attractions include highland peatlands, giant lobelias, sacred rivers, and stone masonry architecture of our highland communities.";
    }

    if (query.includes('invest') || query.includes('lodge') || query.includes('capital')) {
        return "Bibugn and East Gojjam grant massive backing for investors: a 5-year territorial tax holiday, duty-free imports on solar/hotel machinery, and rapid arable land leasing (up to 99 years) directly allocated by the Digo Tsion municipal board.";
    }

    if (query.includes('church') || query.includes('saint mary') || query.includes('mariam')) {
        return "Digo Tsion Saint Mary church is the central spiritual and historical core of Bibugn. Surrounded by a dense, pristine sacred forest protecting endemic birds and plants, it hosts mesmerizing Orthodox Christian liturgies on annual Mariam feast days (Hidar 21 / Hamle 21).";
    }

    if (query.includes('horse') || query.includes('rider') || query.includes('equestrian') || query.includes('guks')) {
        return "Gojjam is legendary for horseback-riding culture. Local equestrian associations feature majestic stallions decorated in colourful textiles, which are paraded during Epiphany (Timkat) with spear-tossing combat games (Yeferas Guks).";
    }

    return "I am currently running in local offline concierge mode. To learn more about that topic, please consult our municipal officers or email our investment registrar Abebe Alemu directly!";
};