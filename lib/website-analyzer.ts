/**
 * Website Analyzer
 * Analyzes website content to detect business type, tone, and content richness
 * for intelligent component selection
 */

export interface WebsiteAnalysis {
  businessType: BusinessType;
  tone: Tone;
  contentRichness: ContentRichness;
  confidence: number;
  signals: {
    businessTypeSignals: string[];
    toneSignals: string[];
    richnessSignals: string[];
  };
}

export type BusinessType = 
  | 'education'
  | 'saas'
  | 'ecommerce'
  | 'portfolio'
  | 'corporate'
  | 'startup'
  | 'agency'
  | 'nonprofit'
  | 'restaurant'
  | 'healthcare'
  | 'general';

export type Tone = 
  | 'modern'
  | 'corporate'
  | 'minimal'
  | 'creative'
  | 'professional'
  | 'friendly'
  | 'luxury'
  | 'playful';

export type ContentRichness = 'low' | 'medium' | 'high';

/**
 * Helper function to deduplicate arrays (avoids Set iteration issues)
 */
function deduplicate<T>(arr: T[]): T[] {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

/**
 * Business type detection keywords and patterns
 */
const BUSINESS_TYPE_PATTERNS: Record<BusinessType, { keywords: string[]; weight: number }> = {
  education: {
    keywords: [
      'course', 'learn', 'student', 'teacher', 'school', 'university', 'education',
      'academy', 'training', 'class', 'lesson', 'curriculum', 'degree', 'certificate',
      'enroll', 'study', 'exam', 'grade', 'lecture', 'campus', 'educational',
      'learning platform', 'online course', 'e-learning', 'tutorial'
    ],
    weight: 1.5
  },
  saas: {
    keywords: [
      'software', 'platform', 'saas', 'cloud', 'api', 'integration', 'dashboard',
      'automation', 'workflow', 'subscription', 'pricing plan', 'feature', 'tool',
      'productivity', 'analytics', 'metrics', 'kpi', 'scalable', 'enterprise',
      'b2b', 'crm', 'crm software', 'project management', 'collaboration',
      'free trial', 'get started', 'demo', 'request demo'
    ],
    weight: 1.5
  },
  ecommerce: {
    keywords: [
      'shop', 'buy', 'cart', 'checkout', 'product', 'price', 'sale', 'discount',
      'order', 'shipping', 'delivery', 'store', 'marketplace', 'payment',
      'add to cart', 'wishlist', 'review', 'rating', 'brand', 'collection',
      'new arrival', 'best seller', 'deals', 'coupon', 'free shipping'
    ],
    weight: 1.5
  },
  portfolio: {
    keywords: [
      'portfolio', 'work', 'project', 'case study', 'gallery', 'showcase',
      'designer', 'developer', 'artist', 'photographer', 'creative', 'freelance',
      'hire me', 'available for work', 'my work', 'selected works', 'behance',
      'dribbble', 'github', 'personal website', 'about me'
    ],
    weight: 1.5
  },
  corporate: {
    keywords: [
      'corporation', 'inc', 'incorporated', 'ltd', 'limited', 'company', 'business',
      'enterprise', 'solutions', 'services', 'industry', 'manufacturing',
      'headquarters', 'investor', 'stakeholder', 'annual report', 'governance',
      'compliance', 'policy', 'mission statement', 'vision', 'values', 'leadership team'
    ],
    weight: 1.3
  },
  startup: {
    keywords: [
      'startup', 'innovative', 'disrupt', 'revolutionary', 'cutting-edge',
      'next-generation', 'founded', 'seed', 'series', 'venture', 'funding',
      'team', 'join us', 'we are hiring', 'careers', 'culture', 'mission',
      'vision', 'problem', 'solution', 'pain point', 'market'
    ],
    weight: 1.4
  },
  agency: {
    keywords: [
      'agency', 'studio', 'creative', 'marketing', 'advertising', 'branding',
      'digital agency', 'design agency', 'full-service', 'client', 'campaign',
      'strategy', 'creative direction', 'brand identity', 'web design',
      'our clients', 'case study', 'award-winning'
    ],
    weight: 1.4
  },
  nonprofit: {
    keywords: [
      'nonprofit', 'non-profit', 'charity', 'foundation', 'donate', 'donation',
      'volunteer', 'cause', 'mission', 'support', 'help', 'community',
      'social impact', 'sustainability', 'give back', '501(c)(3)', 'ngo'
    ],
    weight: 1.5
  },
  restaurant: {
    keywords: [
      'restaurant', 'menu', 'food', 'dining', 'chef', 'cuisine', 'reservation',
      'order online', 'delivery', 'takeout', 'hours', 'location', 'table',
      'fresh', 'organic', 'local', 'recipe', 'catering', 'wine', 'bar'
    ],
    weight: 1.5
  },
  healthcare: {
    keywords: [
      'health', 'medical', 'doctor', 'hospital', 'clinic', 'patient', 'care',
      'treatment', 'therapy', 'wellness', 'healthcare', 'physician', 'nurse',
      'appointment', 'symptom', 'diagnosis', 'medicine', 'pharmacy', 'dental'
    ],
    weight: 1.5
  },
  general: {
    keywords: [],
    weight: 1.0
  }
};

/**
 * Tone detection patterns
 */
const TONE_PATTERNS: Record<Tone, { keywords: string[]; indicators: string[] }> = {
  modern: {
    keywords: ['modern', 'contemporary', 'sleek', 'trendy', 'fresh', 'bold'],
    indicators: ['gradient', 'animation', 'interactive', 'dynamic', 'responsive']
  },
  corporate: {
    keywords: ['professional', 'corporate', 'business', 'formal', 'established', 'trusted'],
    indicators: ['statistics', 'numbers', 'awards', 'certifications', 'partners']
  },
  minimal: {
    keywords: ['minimal', 'simple', 'clean', 'elegant', 'refined', 'essential'],
    indicators: ['white space', 'typography', 'subtle', 'understated', 'focus']
  },
  creative: {
    keywords: ['creative', 'artistic', 'unique', 'innovative', 'imaginative', 'original'],
    indicators: ['colorful', 'unconventional', 'expressive', 'visual', 'artistic']
  },
  professional: {
    keywords: ['professional', 'expert', 'experienced', 'qualified', 'certified', 'skilled'],
    indicators: ['testimonials', 'case studies', 'portfolio', 'credentials', 'results']
  },
  friendly: {
    keywords: ['friendly', 'warm', 'welcoming', 'approachable', 'helpful', 'caring'],
    indicators: ['conversational', 'personal', 'community', 'support', 'help']
  },
  luxury: {
    keywords: ['luxury', 'premium', 'exclusive', 'elite', 'high-end', 'sophisticated'],
    indicators: ['quality', 'craftsmanship', 'heritage', 'prestige', 'elegant']
  },
  playful: {
    keywords: ['fun', 'playful', 'energetic', 'vibrant', 'exciting', 'engaging'],
    indicators: ['colorful', 'animated', 'interactive', 'gamification', 'emoji']
  }
};

/**
 * Analyze content to detect business type
 */
function detectBusinessType(content: string): { type: BusinessType; confidence: number; signals: string[] } {
  const contentLower = content.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [type, config] of Object.entries(BUSINESS_TYPE_PATTERNS)) {
    let score = 0;
    const signals: string[] = [];

    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length * config.weight;
        signals.push(`Found "${keyword}" (${matches.length}x)`);
      }
    }

    scores[type] = score;
  }

  // Find the highest scoring type
  let bestType: BusinessType = 'general';
  let bestScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type as BusinessType;
    }
  }

  // Calculate confidence (normalize to 0-1)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.min(bestScore / totalScore, 0.95) : 0.5;

  // Collect signals for the best type
  const bestSignals: string[] = [];
  const bestConfig = BUSINESS_TYPE_PATTERNS[bestType];
  for (const keyword of bestConfig.keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = contentLower.match(regex);
    if (matches && matches.length > 0) {
      bestSignals.push(`"${keyword}" (${matches.length}x)`);
    }
  }

  return {
    type: bestType,
    confidence,
    signals: bestSignals.slice(0, 5) // Top 5 signals
  };
}

/**
 * Analyze content to detect tone
 */
function detectTone(content: string): { tone: Tone; confidence: number; signals: string[] } {
  const contentLower = content.toLowerCase();
  const scores: Record<string, { score: number; signals: string[] }> = {};

  for (const [tone, config] of Object.entries(TONE_PATTERNS)) {
    let score = 0;
    const signals: string[] = [];

    // Check keywords
    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length * 2;
        signals.push(`Keyword: "${keyword}"`);
      }
    }

    // Check indicators
    for (const indicator of config.indicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length;
        signals.push(`Indicator: "${indicator}"`);
      }
    }

    scores[tone] = { score, signals };
  }

  // Find the highest scoring tone
  let bestTone: Tone = 'professional';
  let bestScore = 0;
  let bestSignals: string[] = [];

  for (const [tone, data] of Object.entries(scores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestTone = tone as Tone;
      bestSignals = data.signals;
    }
  }

  // Calculate confidence
  const totalScore = Object.values(scores).reduce((a, b) => a + b.score, 0);
  const confidence = totalScore > 0 ? Math.min(bestScore / totalScore, 0.9) : 0.6;

  return {
    tone: bestTone,
    confidence,
    signals: bestSignals.slice(0, 5)
  };
}

/**
 * Analyze content richness
 */
function detectContentRichness(content: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
}): { richness: ContentRichness; score: number; signals: string[] } {
  const totalWords = [
    ...content.headings,
    ...content.paragraphs,
    ...content.navigationLinks
  ].reduce((total, text) => total + text.split(/\s+/).length, 0);

  const headingCount = content.headings.length;
  const paragraphCount = content.paragraphs.length;
  const navCount = content.navigationLinks.length;

  // Calculate richness score
  let score = 0;
  const signals: string[] = [];

  // Word count scoring
  if (totalWords > 500) {
    score += 3;
    signals.push(`High word count (${totalWords} words)`);
  } else if (totalWords > 200) {
    score += 2;
    signals.push(`Medium word count (${totalWords} words)`);
  } else {
    score += 1;
    signals.push(`Low word count (${totalWords} words)`);
  }

  // Heading diversity
  if (headingCount > 5) {
    score += 2;
    signals.push(`Many headings (${headingCount} headings)`);
  } else if (headingCount > 2) {
    score += 1;
    signals.push(`Some headings (${headingCount} headings)`);
  } else {
    signals.push(`Few headings (${headingCount} headings)`);
  }

  // Paragraph depth
  if (paragraphCount > 10) {
    score += 2;
    signals.push(`Deep content (${paragraphCount} paragraphs)`);
  } else if (paragraphCount > 4) {
    score += 1;
    signals.push(`Moderate content (${paragraphCount} paragraphs)`);
  } else {
    signals.push(`Light content (${paragraphCount} paragraphs)`);
  }

  // Navigation complexity
  if (navCount > 7) {
    score += 1;
    signals.push(`Complex navigation (${navCount} items)`);
  } else if (navCount > 3) {
    signals.push(`Standard navigation (${navCount} items)`);
  } else {
    signals.push(`Simple navigation (${navCount} items)`);
  }

  // Determine richness level
  let richness: ContentRichness = 'medium';
  if (score >= 7) {
    richness = 'high';
  } else if (score >= 4) {
    richness = 'medium';
  } else {
    richness = 'low';
  }

  return { richness, score, signals };
}

/**
 * Main analysis function - combines all detection methods
 */
export function analyzeWebsite(content: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
}): WebsiteAnalysis {
  // Combine all content for analysis
  const fullContent = [
    ...content.headings,
    ...content.paragraphs,
    ...content.navigationLinks,
    content.footerText || ''
  ].join(' ');

  // Run all detectors
  const businessTypeResult = detectBusinessType(fullContent);
  const toneResult = detectTone(fullContent);
  const richnessResult = detectContentRichness(content);

  // Calculate overall confidence
  const overallConfidence = (
    businessTypeResult.confidence * 0.4 +
    toneResult.confidence * 0.3 +
    Math.min(richnessResult.score / 10, 1) * 0.3
  );

  return {
    businessType: businessTypeResult.type,
    tone: toneResult.tone,
    contentRichness: richnessResult.richness,
    confidence: Math.round(overallConfidence * 100) / 100,
    signals: {
      businessTypeSignals: businessTypeResult.signals,
      toneSignals: toneResult.signals,
      richnessSignals: richnessResult.signals
    }
  };
}

/**
 * Get component style recommendations based on analysis
 */
export function getComponentRecommendations(analysis: WebsiteAnalysis): ComponentRecommendations {
  const { businessType, tone, contentRichness } = analysis;

  const recommendations: ComponentRecommendations = {
    navbar: getNavbarRecommendation(businessType, tone, contentRichness),
    hero: getHeroRecommendation(businessType, tone, contentRichness),
    features: getFeaturesRecommendation(businessType, tone, contentRichness),
    testimonials: getTestimonialsRecommendation(businessType, tone),
    footer: getFooterRecommendation(businessType, tone, contentRichness),
    about: getAboutRecommendation(businessType, tone),
    contact: getContactRecommendation(businessType, tone),
    pricing: getPricingRecommendation(businessType, tone)
  };

  return recommendations;
}

export interface ComponentRecommendations {
  navbar: { preferred: string[]; avoid: string[]; reason: string };
  hero: { preferred: string[]; avoid: string[]; reason: string };
  features: { preferred: string[]; avoid: string[]; reason: string };
  testimonials: { preferred: string[]; avoid: string[]; reason: string };
  footer: { preferred: string[]; avoid: string[]; reason: string };
  about: { preferred: string[]; avoid: string[]; reason: string };
  contact: { preferred: string[]; avoid: string[]; reason: string };
  pricing: { preferred: string[]; avoid: string[]; reason: string };
}

function getNavbarRecommendation(businessType: BusinessType, tone: Tone, richness: ContentRichness): ComponentRecommendations['navbar'] {
  // Navbar should generally be minimal/modern - avoid heavy UI
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Business type preferences
  if (businessType === 'corporate' || businessType === 'education') {
    preferred.push('navbar-minimal', 'navbar-elegant');
    reasons.push('Professional appearance preferred');
  } else if (businessType === 'saas' || businessType === 'startup') {
    preferred.push('navbar-modern', 'navbar-minimal');
    reasons.push('Modern tech aesthetic');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('navbar-stylish', 'navbar-elegant');
    reasons.push('Creative expression balanced with usability');
  } else if (businessType === 'ecommerce') {
    preferred.push('navbar-modern', 'navbar-stylish');
    reasons.push('Clear navigation for shopping');
  } else {
    preferred.push('navbar-minimal', 'navbar-modern');
  }

  // Tone adjustments
  if (tone === 'minimal' || tone === 'corporate') {
    preferred.unshift('navbar-minimal');
    avoid.push('navbar-gradient');
    reasons.push('Clean, professional style matches tone');
  } else if (tone === 'modern') {
    preferred.unshift('navbar-modern');
  } else if (tone === 'creative' || tone === 'playful') {
    preferred.unshift('navbar-stylish', 'navbar-gradient');
  }

  // Richness adjustments - avoid heavy nav for simple sites
  if (richness === 'low') {
    avoid.push('navbar-gradient', 'navbar-stylish');
    preferred.push('navbar-minimal');
    reasons.push('Simple site needs simple navigation');
  }

  return {
    preferred: deduplicate(preferred).slice(0, 3),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}

function getHeroRecommendation(businessType: BusinessType, tone: Tone, richness: ContentRichness): ComponentRecommendations['hero'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Hero MUST be included - provide good options
  if (businessType === 'saas' || businessType === 'startup') {
    preferred.push('hero-modern', 'hero-stylish');
    reasons.push('Engaging hero for product showcase');
  } else if (businessType === 'corporate') {
    preferred.push('hero-elegant', 'hero-minimal');
    reasons.push('Professional first impression');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('hero-stylish', 'hero-modern');
    reasons.push('Visual impact for creative work');
  } else if (businessType === 'education') {
    preferred.push('hero-simple', 'hero-minimal');
    reasons.push('Clear, readable messaging');
  } else if (businessType === 'ecommerce') {
    preferred.push('hero-modern', 'hero-stylish');
    reasons.push('Product-focused hero');
  } else {
    preferred.push('hero-simple', 'hero-modern');
  }

  // Tone adjustments
  if (tone === 'minimal') {
    preferred.unshift('hero-minimal');
    avoid.push('hero-stylish');
  } else if (tone === 'creative') {
    preferred.unshift('hero-stylish');
  } else if (tone === 'luxury') {
    preferred.unshift('hero-elegant');
  }

  return {
    preferred: deduplicate(preferred).slice(0, 3),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ') || 'Hero section is essential for all websites'
  };
}

function getFeaturesRecommendation(businessType: BusinessType, tone: Tone, richness: ContentRichness): ComponentRecommendations['features'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  if (businessType === 'saas' || businessType === 'startup') {
    preferred.push('features-grid', 'features-slideshow');
    reasons.push('Feature-heavy presentation for product benefits');
  } else if (businessType === 'ecommerce') {
    preferred.push('features-grid', 'features-gallery-type');
    reasons.push('Visual product showcase');
  } else if (businessType === 'corporate') {
    preferred.push('features-grid', 'features-Image');
    reasons.push('Structured information display');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('features-gallery-type', 'features-coursel');
    reasons.push('Visual portfolio presentation');
  } else if (businessType === 'education') {
    preferred.push('features-grid', 'features-Image');
    reasons.push('Clear, organized content display');
  } else {
    preferred.push('features-grid');
  }

  // Avoid heavy components for simple sites
  if (richness === 'low') {
    avoid.push('features-slideshow', 'features-coursel');
    preferred.unshift('features-grid', 'features-Image');
    reasons.push('Simpler layout for limited content');
  }

  // Tone adjustments
  if (tone === 'minimal') {
    preferred.unshift('features-grid');
    avoid.push('features-coursel', 'features-slideshow');
  } else if (tone === 'modern') {
    preferred.unshift('features-slideshow');
  }

  return {
    preferred: deduplicate(preferred).slice(0, 3),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}

function getTestimonialsRecommendation(businessType: BusinessType, tone: Tone): ComponentRecommendations['testimonials'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Testimonials needed for trust-based businesses
  const trustHeavyTypes: BusinessType[] = ['saas', 'ecommerce', 'corporate', 'healthcare', 'agency'];
  
  if (trustHeavyTypes.includes(businessType)) {
    reasons.push('Trust signals important for this business type');
  } else {
    reasons.push('Social proof enhances credibility');
  }

  if (businessType === 'saas' || businessType === 'startup') {
    preferred.push('testimonial-modern', 'testimonial-cards');
  } else if (businessType === 'corporate') {
    preferred.push('testimonial-modern', 'testimonial-section4');
  } else if (businessType === 'ecommerce') {
    preferred.push('testimonial-cards', 'testimonial-modern');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('testimonial-cards', 'testimonial-gradient');
  } else if (businessType === 'education') {
    preferred.push('testimonial-cards', 'testimonial-modern');
  } else {
    preferred.push('testimonial-cards', 'testimonial-modern');
  }

  // Tone adjustments
  if (tone === 'minimal' || tone === 'corporate') {
    preferred.unshift('testimonial-modern');
    avoid.push('testimonial-gradient');
  } else if (tone === 'creative') {
    preferred.unshift('testimonial-gradient');
  }

  return {
    preferred: deduplicate(preferred).slice(0, 3),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}

function getFooterRecommendation(businessType: BusinessType, tone: Tone, richness: ContentRichness): ComponentRecommendations['footer'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Footer always included
  reasons.push('Footer provides essential site closure and navigation');

  if (businessType === 'corporate') {
    preferred.push('footer-corporate', 'footer-minimal');
    reasons.push('Professional footer with comprehensive links');
  } else if (businessType === 'saas' || businessType === 'startup') {
    preferred.push('footer-modern', 'footer-startup');
    reasons.push('Modern footer with social and links');
  } else if (businessType === 'ecommerce') {
    preferred.push('footer-modern', 'footer-simple');
    reasons.push('Customer service links and policies');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('footer-elegant', 'footer-simple');
    reasons.push('Clean footer with contact info');
  } else if (businessType === 'education') {
    preferred.push('footer-minimal', 'footer-simple');
    reasons.push('Clear institutional information');
  } else {
    preferred.push('footer-simple', 'footer-minimal');
  }

  // Tone adjustments
  if (tone === 'minimal') {
    preferred.unshift('footer-minimal', 'footer-simple');
    avoid.push('footer-gradient', 'footer-startup');
  } else if (tone === 'modern') {
    preferred.unshift('footer-modern');
  } else if (tone === 'luxury') {
    preferred.unshift('footer-elegant');
  }

  // Avoid heavy footers for simple sites
  if (richness === 'low') {
    avoid.push('footer-corporate', 'footer-startup');
    preferred.unshift('footer-simple', 'footer-minimal');
  }

  return {
    preferred: deduplicate(preferred).slice(0, 3),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}

function getAboutRecommendation(businessType: BusinessType, tone: Tone): ComponentRecommendations['about'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  if (businessType === 'corporate') {
    preferred.push('about-two-column');
    reasons.push('Structured about section for company info');
  } else if (businessType === 'portfolio' || businessType === 'agency') {
    preferred.push('about-two-column');
    reasons.push('Visual about for creative presentation');
  } else {
    preferred.push('about-two-column');
  }

  return {
    preferred: deduplicate(preferred),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ') || 'About section provides company background'
  };
}

function getContactRecommendation(businessType: BusinessType, tone: Tone): ComponentRecommendations['contact'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Contact important for lead generation
  if (businessType === 'saas' || businessType === 'corporate' || businessType === 'agency') {
    reasons.push('Contact form for lead generation');
  } else {
    reasons.push('Contact information for user communication');
  }

  preferred.push('contact-form');

  return {
    preferred: deduplicate(preferred),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}

function getPricingRecommendation(businessType: BusinessType, tone: Tone): ComponentRecommendations['pricing'] {
  const preferred: string[] = [];
  const avoid: string[] = [];
  const reasons: string[] = [];

  // Pricing only for certain business types
  if (businessType === 'saas' || businessType === 'ecommerce' || businessType === 'startup') {
    reasons.push('Pricing display for product/service tiers');
    
    if (businessType === 'saas') {
      preferred.push('pricing-modern', 'pricing-cards');
    } else if (businessType === 'ecommerce') {
      preferred.push('pricing-cards', 'pricing-simple');
    } else {
      preferred.push('pricing-modern', 'pricing-simple');
    }

    if (tone === 'minimal') {
      preferred.unshift('pricing-simple');
      avoid.push('pricing-gradient');
    }
  } else {
    reasons.push('Pricing may not be needed for this business type');
  }

  return {
    preferred: deduplicate(preferred),
    avoid: deduplicate(avoid),
    reason: reasons.join('. ')
  };
}
