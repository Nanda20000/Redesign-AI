// Environment configuration and validation

if (typeof process !== 'undefined' && process.env) {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.log("DeepSeek API key not found. Please configure .env.local");
  }
  
  console.log("DeepSeek API key loaded:", !!process.env.DEEPSEEK_API_KEY);
}

export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
