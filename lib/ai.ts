import axios from 'axios';

// Validate DeepSeek API key on module load
if (!process.env.DEEPSEEK_API_KEY) {
  console.log('DeepSeek API key not found. Please configure .env.local');
}
console.log('DeepSeek API key loaded:', !!process.env.DEEPSEEK_API_KEY);

// DeepSeek API endpoints (try primary, fallback to OpenRouter)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const VALID_SECTION_TYPES = ['navbar', 'hero', 'banner', 'features', 'testimonials', 'contact', 'footer', 'gallery', 'cta', 'blog'];

export async function generateAIResponse(prompt: string): Promise<string> {
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not configured in environment variables');
      }

      if (apiKey === 'your_api_key_here') {
        throw new Error('Please replace "your_api_key_here" with your actual DeepSeek API key');
      }

      console.log(`DeepSeek API attempt ${attempt}/${maxRetries}...`);
      
      // Try primary DeepSeek endpoint first
      try {
        const response = await axios.post(
          DEEPSEEK_API_URL,
          {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          }
        );

        console.log(`DeepSeek API attempt ${attempt} succeeded`);
        return response.data.choices[0].message.content;
      } catch (primaryError: any) {
        console.warn(`Primary DeepSeek endpoint failed: ${primaryError.message}`);
        
        // Fallback to OpenRouter if DeepSeek direct fails
        console.log('Trying OpenRouter fallback...');
        
        const openRouterKey = process.env.OPENROUTER_API_KEY || apiKey;
        
        const response = await axios.post(
          OPENROUTER_API_URL,
          {
            model: 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3000',
            },
            timeout: 30000,
          }
        );

        console.log('OpenRouter fallback succeeded');
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`DeepSeek API attempt ${attempt} failed:`, lastError.message);
      
      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error('Failed to get response from DeepSeek API');
}

export async function classifySectionType(
  sectionText: string,
  className?: string,
  id?: string
): Promise<string> {
  const prompt = `You are a professional UI analyzer. Classify this website section into one of these categories: ${VALID_SECTION_TYPES.join(', ')}.

Section content:
${sectionText.slice(0, 500)}

${className ? `CSS classes: ${className}` : ''}
${id ? `ID: ${id}` : ''}

Return ONLY the category name (e.g., "hero", "features", "contact"). If unsure, return "features" as default.`;

  try {
    const response = await generateAIResponse(prompt);
    const classifiedType = response.trim().toLowerCase();

    // Validate the response is a valid section type
    if (VALID_SECTION_TYPES.includes(classifiedType)) {
      return classifiedType;
    }

    return 'features'; // Default fallback
  } catch (error) {
    console.error('Error classifying section:', error);
    return 'features'; // Fallback on error
  }
}
