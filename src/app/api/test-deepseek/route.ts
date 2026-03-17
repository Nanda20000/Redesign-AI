import { NextResponse } from 'next/server';
import { generateAIResponse } from '../../../../lib/ai';

export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'DEEPSEEK_API_KEY not configured',
      configured: false 
    }, { status: 500 });
  }

  if (apiKey === 'your_api_key_here') {
    return NextResponse.json({ 
      error: 'API key is placeholder value',
      configured: false 
    }, { status: 500 });
  }

  try {
    console.log('Testing DeepSeek API connection...');
    
    const response = await generateAIResponse('Respond with just "OK" if you receive this.');

    return NextResponse.json({
      success: true,
      message: 'DeepSeek API is working!',
      response: response,
      configured: true,
    });
  } catch (error: any) {
    console.error('DeepSeek API test failed:', error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      configured: true,
      hint: 'The fallback classification will be used. To enable AI, check: 1) API key validity, 2) Network/firewall, 3) Try OpenRouter at https://openrouter.ai/keys',
    }, { status: 500 });
  }
}
