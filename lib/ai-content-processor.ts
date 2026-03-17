/**
 * AI Content Processor
 * Uses DeepSeek API to intelligently summarize and categorize website content
 * for injection into specific component sections
 */

import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ProcessedSectionContent {
  features?: {
    items: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    heading: string;
    description: string;
  };
  about?: {
    title: string;
    description: string;
    companies?: string[];
    achievements?: Array<{
      label: string;
      value: string;
    }>;
    breakout?: {
      title: string;
      description: string;
    };
  };
  footer?: {
    brandName: string;
    description: string;
    contactInfo?: {
      address?: string;
      email?: string;
      phone?: string;
    };
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
    copyright: string;
  };
  testimonials?: {
    items?: Array<{
      text: string;
      author?: string;
    }>;
  };
}

interface AIParsedContent {
  features: {
    heading: string;
    description: string;
    items: Array<{ title: string; description: string }>;
  };
  about: {
    title: string;
    description: string;
    companies: string[];
    achievements: Array<{ label: string; value: string }>;
    breakout: { title: string; description: string };
  };
  footer: {
    brandName: string;
    description: string;
    contactInfo: { address?: string; email?: string; phone?: string };
    copyright: string;
  };
}

/**
 * Call DeepSeek API for content processing
 */
async function callDeepSeekAPI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  try {
    // Try primary DeepSeek endpoint
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.warn('Primary DeepSeek failed, trying OpenRouter fallback...');
    
    // Fallback to OpenRouter
    const openRouterKey = process.env.OPENROUTER_API_KEY || apiKey;
    
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
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

    return response.data.choices[0].message.content;
  }
}

/**
 * Build AI prompt for content categorization and summarization
 */
function buildContentPrompt(content: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
}): string {
  return `You are an expert content analyzer. Your task is to extract and summarize website content for specific sections.

## Input Content:
Headings: ${content.headings.join(' | ')}
Paragraphs: ${content.paragraphs.join(' | ')}
Navigation: ${content.navigationLinks.join(', ')}
Footer: ${content.footerText || 'N/A'}

## Your Task:
Analyze the content and extract information for these sections:

1. **FEATURES**: Find 2-4 key features/services/products mentioned. Extract a heading and brief description for each.
2. **ABOUT**: Extract company/organization description, any company names (clients/partners), achievements (numbers, awards), and a key message.
3. **FOOTER**: Extract brand name, description, contact info (email, phone, address), and copyright text.

## Response Format:
Return ONLY valid JSON in this exact structure (no markdown, no extra text):

{
  "features": {
    "heading": "Main features heading",
    "description": "Brief description of features",
    "items": [
      {"title": "Feature 1", "description": "Description of feature 1"},
      {"title": "Feature 2", "description": "Description of feature 2"}
    ]
  },
  "about": {
    "title": "About Us heading",
    "description": "2-3 sentence about description",
    "companies": ["Company1", "Company2"],
    "achievements": [
      {"label": "Years Experience", "value": "20+"},
      {"label": "Projects", "value": "500+"}
    ],
    "breakout": {"title": "Key message", "description": "Short description"}
  },
  "footer": {
    "brandName": "Brand name",
    "description": "Brief brand description",
    "contactInfo": {
      "email": "email@example.com",
      "phone": "123-456-7890",
      "address": "123 Street, City"
    },
    "copyright": "© 2024 Brand. All rights reserved."
  }
}

## Rules:
- Use actual content from the input, don't make things up
- If information is missing, use sensible defaults
- Keep descriptions concise (50-100 words max)
- Extract real company names if mentioned
- Extract real contact info if available
- Return ONLY the JSON, no explanations`;
}

/**
 * Parse AI response to extract structured content
 */
function parseAIResponse(response: string): AIParsedContent {
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to find JSON object
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanResponse);
    return parsed as AIParsedContent;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
}

/**
 * Generate default content if AI processing fails
 */
function getDefaultProcessedContent(): AIParsedContent {
  return {
    features: {
      heading: 'Our Features',
      description: 'Discover what makes us special',
      items: [
        { title: 'Quality Service', description: 'We provide top-notch service with attention to detail' },
        { title: 'Expert Team', description: 'Our team of experts is here to help you succeed' },
        { title: 'Innovation', description: 'Cutting-edge solutions for modern challenges' },
      ],
    },
    about: {
      title: 'About Us',
      description: 'We are dedicated to providing excellence in everything we do. Our commitment to quality and customer satisfaction has made us a trusted name in the industry.',
      companies: [],
      achievements: [
        { label: 'Years Experience', value: '10+' },
        { label: 'Happy Clients', value: '500+' },
        { label: 'Projects', value: '1000+' },
      ],
      breakout: {
        title: 'Our Mission',
        description: 'To deliver exceptional value and service to our customers',
      },
    },
    footer: {
      brandName: 'Brand',
      description: 'Providing quality services since 2024',
      contactInfo: {},
      copyright: '© 2024 Brand. All rights reserved.',
    },
  };
}

/**
 * Process extracted content with AI to generate section-specific content
 */
export async function processContentWithAI(content: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
}): Promise<ProcessedSectionContent> {
  console.log('[AI Content Processor] Starting content processing...');

  try {
    // Build prompt
    const prompt = buildContentPrompt(content);

    // Call AI
    console.log('[AI Content Processor] Calling DeepSeek API...');
    const aiResponse = await callDeepSeekAPI(prompt);

    // Parse response
    console.log('[AI Content Processor] Parsing AI response...');
    const parsed = parseAIResponse(aiResponse);

    console.log('[AI Content Processor] Content processing complete');

    return {
      features: parsed.features,
      about: parsed.about,
      footer: parsed.footer,
    };
  } catch (error: any) {
    console.error('[AI Content Processor] Error:', error.message);
    console.log('[AI Content Processor] Using default content as fallback');
    
    // Return default content on error
    return getDefaultProcessedContent();
  }
}

/**
 * Quick content summarization (lightweight, no AI)
 * Use this when AI processing is not available or too slow
 */
export function summarizeContentQuick(content: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
}): ProcessedSectionContent {
  const mainHeading = content.headings[0] || 'Welcome';
  const brandName = mainHeading.split(' ')[0];

  // Extract features from headings and short paragraphs
  const featureCandidates = content.headings.slice(1, 4).map((heading, i) => ({
    title: heading,
    description: content.paragraphs[i]?.slice(0, 100) || 'Learn more about this feature',
  }));

  // Find about-related content
  const aboutParagraph = content.paragraphs.find(
    (p) => p.toLowerCase().includes('about') || p.toLowerCase().includes('mission')
  ) || content.paragraphs[0] || '';

  // Extract contact info
  const contactInfo: ProcessedSectionContent['footer']['contactInfo'] = {};
  for (const paragraph of content.paragraphs) {
    if (!contactInfo.email) {
      const emailMatch = paragraph.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) contactInfo.email = emailMatch[0];
    }
    if (!contactInfo.phone) {
      const phoneMatch = paragraph.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
      if (phoneMatch) contactInfo.phone = phoneMatch[0];
    }
  }

  return {
    features: {
      heading: 'Our Features',
      description: 'Explore what we offer',
      items: featureCandidates,
    },
    about: {
      title: 'About Us',
      description: aboutParagraph.slice(0, 200),
      companies: [],
      achievements: [],
      breakout: {
        title: brandName,
        description: aboutParagraph.slice(0, 100),
      },
    },
    footer: {
      brandName: brandName,
      description: content.footerText?.slice(0, 100) || aboutParagraph.slice(0, 100),
      contactInfo,
      copyright: content.footerText?.match(/©|copyright/i)
        ? content.footerText
        : `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`,
    },
  };
}
