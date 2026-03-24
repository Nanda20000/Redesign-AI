/**
 * Content Summariser
 * Takes raw extracted website text and summarises it for each section.
 * Uses the AI-processed content from ai-content-processor.ts if available,
 * otherwise applies rule-based summarisation.
 *
 * Key principle: never copy-paste from the source website.
 * Always rewrite/summarise to fit the component's maxWords limit.
 */

export interface SectionTextContent {
  // Hero
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroCta?: string;

  // Navbar
  navLinks?: string[];
  brandName?: string;

  // Features
  featuresHeading?: string;
  featuresDescription?: string;
  featureBadge?: string;
  featureItems?: Array<{ title: string; description: string }>;

  // About
  aboutTitle?: string;
  aboutDescription?: string;
  achievementsTitle?: string;
  achievementsDescription?: string;
  companiesTitle?: string;
  achievements?: Array<{ label: string; value: string }>;
  companies?: string[];

  // Testimonials
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonialItems?: Array<{ text: string; name: string; role: string }>;

  // Contact
  contactTitle?: string;
  contactDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;

  // Footer
  footerBrand?: string;
  footerDescription?: string;
  footerCopyright?: string;
  footerLinks?: string[];
}

/**
 * Trim text to a maximum number of words.
 * Adds ellipsis if trimmed.
 */
function trimToWords(text: string, maxWords: number): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Capitalise first letter of a string.
 */
function capitalise(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Pick the most relevant paragraph for a section by keyword matching.
 */
function findRelevantParagraph(
  paragraphs: string[],
  keywords: string[],
  fallbackIndex = 0
): string {
  for (const p of paragraphs) {
    const lower = p.toLowerCase();
    if (keywords.some(kw => lower.includes(kw))) {
      return p;
    }
  }
  return paragraphs[fallbackIndex] || '';
}

/**
 * Main summariser function.
 * Takes raw extracted content and returns structured, summarised text
 * ready to inject into each component section.
 */
export function summariseContent(raw: {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
  contactInfo?: { email?: string; phone?: string; address?: string };
  processed?: {
    features?: {
      heading: string;
      description: string;
      items: Array<{ title: string; description: string }>;
    };
    about?: {
      title: string;
      description: string;
      companies?: string[];
      achievements?: Array<{ label: string; value: string }>;
      breakout?: { title: string; description: string };
    };
    footer?: {
      brandName: string;
      description: string;
      contactInfo?: { email?: string; phone?: string; address?: string };
      copyright: string;
    };
  };
}): SectionTextContent {
  const { headings, paragraphs, navigationLinks, footerText, contactInfo, processed } = raw;

  // ── HERO ────────────────────────────────────────────────────────────
  const heroRawTitle = headings[0] || 'Welcome';
  const heroTitle = trimToWords(capitalise(heroRawTitle), 8);
  const heroSubtitle = trimToWords(headings[1] || headings[2] || '', 6);
  const heroDesc = findRelevantParagraph(
    paragraphs,
    ['welcome', 'leading', 'best', 'trusted', 'gateway', 'premier', 'pioneer'],
    0
  );
  const heroDescription = trimToWords(heroDesc, 20);

  // ── NAVBAR ──────────────────────────────────────────────────────────
  const navLinks = navigationLinks
    .filter(l => l.length > 0 && l.length < 30)
    .slice(0, 6)
    .map(l => capitalise(l));
  const brandName = heroRawTitle.split(' ').slice(0, 3).join(' ');

  // ── FEATURES ────────────────────────────────────────────────────────
  let featuresHeading = 'Our Features';
  let featuresDescription = 'Discover what we offer';
  let featureBadge = 'Features';
  let featureItems: Array<{ title: string; description: string }> = [];

  if (processed?.features) {
    featuresHeading = trimToWords(processed.features.heading, 6);
    featuresDescription = trimToWords(processed.features.description, 15);
    featureItems = processed.features.items.map(item => ({
      title: trimToWords(item.title, 5),
      description: trimToWords(item.description, 15),
    }));
  } else {
    // Rule-based: use headings 2-5 as feature titles
    const featureHeadingsRaw = headings.slice(1, 5);
    featureItems = featureHeadingsRaw.map((h, i) => ({
      title: trimToWords(h, 5),
      description: trimToWords(paragraphs[i + 1] || 'Learn more about this feature.', 15),
    }));
    featuresHeading = trimToWords(
      headings.find(h => /course|feature|service|program|offer/i.test(h)) || 'Our Features',
      6
    );
    featureBadge = featureItems.length > 0 ? 'Courses' : 'Features';
  }

  // ── ABOUT ───────────────────────────────────────────────────────────
  let aboutTitle = 'About Us';
  let aboutDescription = 'We are dedicated to excellence.';
  let achievementsTitle = 'Our Achievements';
  let achievementsDescription = 'We take pride in our accomplishments.';
  let companies: string[] = [];
  let achievements: Array<{ label: string; value: string }> = [];
  const companiesTitle = 'Trusted by organisations worldwide';

  if (processed?.about) {
    aboutTitle = trimToWords(processed.about.title, 6);
    aboutDescription = trimToWords(processed.about.description, 40);
    companies = processed.about.companies || [];
    achievements = processed.about.achievements || [];
    if (processed.about.breakout) {
      achievementsTitle = trimToWords(processed.about.breakout.title, 5);
      achievementsDescription = trimToWords(processed.about.breakout.description, 20);
    }
  } else {
    const aboutPara = findRelevantParagraph(
      paragraphs,
      ['about', 'mission', 'vision', 'founded', 'established', 'institute', 'academy'],
      1
    );
    aboutTitle = trimToWords(
      headings.find(h => /about/i.test(h)) || 'About Us',
      6
    );
    aboutDescription = trimToWords(aboutPara, 40);
  }

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  const testimonialsTitle = trimToWords(
    headings.find(h => /testimonial|client|review|say|feedback/i.test(h)) ||
    'What Our Clients Say',
    6
  );
  const testimonialsDescription = trimToWords(
    paragraphs.find(p => /testimonial|client|review|feedback/i.test(p)) ||
    'Real feedback from our valued customers.',
    15
  );

  // Build testimonial items from paragraphs that sound like reviews
  const testimonialItems = paragraphs
    .filter(p => p.length > 30 && p.length < 200)
    .slice(0, 3)
    .map((p, i) => ({
      text: trimToWords(p, 20),
      name: headings[i + 3] || `Customer ${i + 1}`,
      role: navLinks[i] || 'Verified Customer',
    }));

  // ── CONTACT ─────────────────────────────────────────────────────────
  const contactTitle = trimToWords(
    headings.find(h => /contact|touch|reach/i.test(h)) || 'Get In Touch',
    5
  );
  const contactDescription = trimToWords(
    paragraphs.find(p => /contact|reach|question|help/i.test(p)) ||
    "Have a question? We'd love to hear from you.",
    20
  );

  // ── FOOTER ──────────────────────────────────────────────────────────
  let footerBrand = brandName;
  let footerDescription = trimToWords(aboutDescription, 20);
  let footerCopyright = `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;

  if (processed?.footer) {
    footerBrand = processed.footer.brandName || brandName;
    footerDescription = trimToWords(processed.footer.description, 20);
    footerCopyright = processed.footer.copyright || footerCopyright;
  } else if (footerText) {
    const copyrightMatch = footerText.match(/©.*$/);
    if (copyrightMatch) footerCopyright = copyrightMatch[0];
  }

  return {
    // Hero
    heroTitle,
    heroSubtitle,
    heroDescription,
    heroCta: 'Get Started',

    // Navbar
    navLinks,
    brandName,

    // Features
    featuresHeading,
    featuresDescription,
    featureBadge,
    featureItems,

    // About
    aboutTitle,
    aboutDescription,
    achievementsTitle,
    achievementsDescription,
    companiesTitle,
    companies,
    achievements,

    // Testimonials
    testimonialsTitle,
    testimonialsDescription,
    testimonialItems,

    // Contact
    contactTitle,
    contactDescription,
    contactEmail: contactInfo?.email || processed?.footer?.contactInfo?.email || '',
    contactPhone: contactInfo?.phone || processed?.footer?.contactInfo?.phone || '',
    contactAddress: contactInfo?.address || processed?.footer?.contactInfo?.address || '',

    // Footer
    footerBrand,
    footerDescription,
    footerCopyright,
    footerLinks: navLinks,
  };
}
