/**
 * Content Injection System
 * Maps extracted webpage content to component props
 *
 * NOTE: Image distribution is now handled by AI prop injector.
 * Dynamic components receive images directly from AI-generated props.
 */

import type { ProcessedSectionContent } from './ai-content-processor';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ExtractedContent {
  headings: string[];
  paragraphs: string[];
  navigationLinks: string[];
  footerText?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  processed?: ProcessedSectionContent; // AI-processed content
  images: Array<{
    src: string;
    alt: string;
    title: string;
    width?: number;
    height?: number;
  }>;
  items?: string[];
}

export interface MappedContent {
  hero?: {
    title: string;
    description: string;
    image?: string;
    primaryAction?: {
      label: string;
      onClick: () => void;
    };
    secondaryAction?: {
      label: string;
      onClick: () => void;
    };
  };
  about?: {
    title: string;
    description: string;
    companies?: string[];
    achievements?: Array<{
      label: string;
      value: string;
    }>;
    images?: string[];
  };
  'faq-process'?: {
    title: string;
    subtitle?: string;
    type?: 'faq' | 'process';
    faqItems?: Array<{
      question?: string;
      answer?: string;
    }>;
    processSteps?: Array<{
      stepNumber?: string;
      title?: string;
      description?: string;
    }>;
  };
  footer?: {
    brandName: string;
    description: string;
    links: Array<{ name: string; url: string }>;
    socialLinks?: Array<{ platform: string; url: string }>;
    copyright: string;
  };
  contact?: {
    title?: string;
    emailLabel?: string;
    email?: string;
    phoneLabel?: string;
    phone?: string;
    addressLabel?: string;
    address?: string;
    socialTitle?: string;
    formNameLabel?: string;
    formNamePlaceholder?: string;
    formEmailLabel?: string;
    formEmailPlaceholder?: string;
    formMessageLabel?: string;
    formMessagePlaceholder?: string;
    formSubmitLabel?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    items?: string[];
    bottomLabel?: string;
    ctaText?: string;
    backgroundImage?: string;
  };
  navbar?: {
    logoText?: string;
    links?: Array<{ label: string; href: string }>;
    loginLabel?: string;
    loginHref?: string;
    signupLabel?: string;
    signupHref?: string;
  };
  testimonials?: {
    heading?: string;
    subtext?: string;
    items?: Array<{
      quote?: string;
      authorName?: string;
      authorRole?: string;
      authorImage?: string;
      bgColor?: string;
    }>;
  };
  gallery?: {
    title?: string;
    images?: Array<{ url: string; alt: string }>;
  };
  feature?: {
    title?: string;
    subtitle?: string;
    image?: string;
    items?: Array<{
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    }>;
  };
  benefits?: {
    badge?: {
      text?: string;
      icon?: React.ReactNode;
    };
    title?: string;
    description?: string;
    items?: Array<{
      id?: string;
      title?: string;
      description?: string;
      icon?: React.ReactNode;
      toggleIcon?: React.ReactNode;
      expandedToggleIcon?: React.ReactNode;
    }>;
    images?: string[];
    experience?: {
      value?: string;
      label?: string;
    };
  };
  banner?: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    topBarColor?: string;
    dotsColor?: string;
    dotMultiplier?: string;
  };
  features?: {
    label?: string;
    heading?: string;
    description?: string;
    items?: Array<{
      icon?: React.ReactNode;
      title?: string;
      description?: string;
    }>;
    primaryCtaText?: string;
    secondaryCtaText?: string;
  };
  blog?: {
    subtitle?: string;
    title?: string;
    items?: Array<{
      id?: number;
      image?: string;
      date?: string;
      category?: string;
      title?: string;
      description?: string;
    }>;
  };
  'mission-vision'?: {
    badge?: string;
    title?: string;
    description?: string;
    items?: Array<{
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    }>;
    imageUrl?: string;
    imageAlt?: string;
  };
}

/**
 * Extract content from the page structure
 */
export function extractContentFromStructure(structure: {
  headings: string[];
  sections: Array<{
    textPreview: string;
    class?: string;
    id?: string;
  }>;
  navigation?: string[];
  hasFooter?: boolean;
  images?: Array<{
    src: string;
    alt: string;
    title: string;
    width?: number;
    height?: number;
  }>;
}): ExtractedContent {
  const headings = structure.headings || [];
  const paragraphs = structure.sections.map((s) => s.textPreview).filter((t) => t && t.length > 20);
  const navigationLinks = structure.navigation || [];
  const images = structure.images || [];

  // Try to extract footer text from sections
  let footerText: string | undefined;
  const contactInfo: ExtractedContent['contactInfo'] = {};

  // Look for contact info patterns in paragraphs
  for (const paragraph of paragraphs) {
    // Email pattern
    const emailMatch = paragraph.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch && !contactInfo.email) {
      contactInfo.email = emailMatch[0];
    }

    // Phone pattern
    const phoneMatch = paragraph.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    if (phoneMatch && !contactInfo.phone) {
      contactInfo.phone = phoneMatch[0];
    }

    // Address pattern (simplified)
    if (paragraph.match(/\d+\s+\w+\s+(street|st|avenue|ave|road|rd|boulevard|blvd)/i) && !contactInfo.address) {
      contactInfo.address = paragraph.slice(0, 100);
    }
  }

  // Use last section as potential footer
  if (structure.hasFooter && paragraphs.length > 0) {
    footerText = paragraphs[paragraphs.length - 1];
  }

  return {
    headings,
    paragraphs,
    navigationLinks,
    footerText,
    contactInfo: Object.keys(contactInfo).length > 0 ? contactInfo : undefined,
    images,
  };
}

/**
 * Map extracted content to component props based on section types
 * Uses AI-processed content if available, otherwise uses basic extraction
 */
export function mapContentToSections(
  content: ExtractedContent,
  sections: string[],
  layout?: Array<{ section: string; component: string }>
): MappedContent {
  const mapped: MappedContent = {};

  const images = content.images ?? [];
  const headings = content.headings ?? [];
  const paragraphs = content.paragraphs ?? [];
  const navigationLinks = content.navigationLinks ?? [];
  const processed = content.processed;
  const mainHeading = headings[0] ?? '';
  const subHeading = headings[1] ?? paragraphs[0]?.slice(0, 100) ?? '';

  // NOTE: Image distribution is now handled by AI prop injector.
  // Dynamic components receive images directly from AI-generated props.
  // This function only provides fallback content for non-dynamic components.

  // Log received images
  console.log("[ContentMapper] Images received:", images.length || 0);
  if (images.length) {
    console.log("[ContentMapper] First image:", images[0]?.src?.slice(0, 50));
  }

  // Map hero content - NO automatic image assignment (AI handles it)
  if (sections.includes('hero')) {
    mapped.hero = {
      title: processed?.about?.title ?? headings[0] ?? '',
      description: processed?.about?.description ?? paragraphs[0]?.slice(0, 150) ?? '',
      primaryAction: { label: 'Get Started', onClick: () => {} },
      secondaryAction: { label: 'Learn More', onClick: () => {} },
      // image field removed - AI prop injector handles image selection
    };
  }

  // Map about content - NO automatic image assignment (AI handles it)
  if (sections.includes('about')) {
    mapped.about = {
      title: processed?.about?.title ?? 'About Us',
      description: processed?.about?.description ?? paragraphs[1]?.slice(0, 200) ?? '',
      companies: processed?.about?.companies ?? [],
      achievements: processed?.about?.achievements ?? [],
      // images field removed - AI prop injector handles image selection
    };
  }

  // Map faq-process content
  if (sections.includes('faq-process')) {
    mapped['faq-process'] = {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions',
      type: 'faq',
      faqItems: [],
      processSteps: [],
    };
  }

  // Map footer content - Use AI-processed if available
  if (sections.includes('footer')) {
    const brandName = processed?.footer?.brandName ?? mainHeading.split(' ')[0] ?? 'Brand';
    mapped.footer = {
      brandName: brandName,
      description: processed?.footer?.description ?? paragraphs[paragraphs.length - 1]?.slice(0, 100) ?? '',
      links: navigationLinks.slice(0, 5).map(link => ({
        name: link,
        url: `#${link.toLowerCase().replace(/\s+/g, '-')}`,
      })),
      copyright: processed?.footer?.copyright ?? `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`,
    };
  }

  // Map contact content - Use contact info from processed content or extracted data
  if (sections.includes('contact')) {
    mapped.contact = {
      title: 'Get in Touch',
      emailLabel: 'Email:',
      email: processed?.footer?.contactInfo?.email ?? content.contactInfo?.email ?? '',
      phoneLabel: 'Phone:',
      phone: processed?.footer?.contactInfo?.phone ?? content.contactInfo?.phone ?? '',
      addressLabel: 'Address:',
      address: processed?.footer?.contactInfo?.address ?? content.contactInfo?.address ?? '',
      socialTitle: 'Follow Us',
      formNameLabel: 'Your Name',
      formNamePlaceholder: 'John Doe',
      formEmailLabel: 'Your Email',
      formEmailPlaceholder: 'john@example.com',
      formMessageLabel: 'Message',
      formMessagePlaceholder: 'Tell us how we can help...',
      formSubmitLabel: 'Send Message',
    };
  }

  // Map cta content - Use for call-to-action sections
  if (sections.includes('cta')) {
    mapped.cta = {
      title: 'Ready to Get Started?',
      description: 'Take the next step towards your goals',
      items: [],
      bottomLabel: 'Limited spots available',
      ctaText: 'Book Now',
      backgroundImage: '',
    };
  }

  // Map navbar content - Use navigation links from extracted content
  if (sections.includes('navbar')) {
    mapped.navbar = {
      logoText: '',
      links: [],
      loginLabel: 'Log In',
      loginHref: '#',
      signupLabel: 'Sign Up',
      signupHref: '#',
    };
  }

  // Map testimonials content - Use for customer testimonials/reviews sections
  if (sections.includes('testimonials')) {
    mapped.testimonials = {
      heading: 'What Our Customers Say',
      subtext: 'Real stories from real people',
      items: [],
    };
  }

  // Map gallery content - Use for photo gallery sections
  if (sections.includes('gallery')) {
    mapped.gallery = {
      title: 'Gallery',
      images: [],
    };
  }

  // Map banner content - Use for hero/profile banner sections
  if (sections.includes('banner')) {
    mapped.banner = {
      title: headings[0] ?? '',
      subtitle: headings[1] ?? '',
      description: paragraphs[0]?.slice(0, 150) ?? '',
    };
  }

  // Map blog content - Use for articles/insights sections
  if (sections.includes('blog')) {
    mapped.blog = {
      subtitle: 'Latest Updates',
      title: 'From Our Blog',
      items: headings.slice(1, 5).map((heading, idx) => ({
        id: idx,
        image: images[idx]?.src ?? '',
        date: '',
        category: '',
        title: heading,
        description: paragraphs[idx]?.slice(0, 150) ?? '',
      })),
    };
  }

  // Map benefits content - Use for value proposition sections
  if (sections.includes('benefits')) {
    mapped.benefits = {
      badge: { text: 'Benefits' },
      title: processed?.about?.title ?? 'Why Choose Us',
      description: processed?.about?.description ?? paragraphs[0]?.slice(0, 200) ?? '',
      items: headings.slice(1, 6).map((heading, idx) => ({
        id: `benefit-${idx}`,
        title: heading,
        description: paragraphs[idx]?.slice(0, 100) ?? '',
      })),
      experience: { value: '10+', label: 'Years Experience' },
    };
  }

  // Map mission-vision content - Use for organizational purpose sections
  if (sections.includes('mission-vision')) {
    mapped['mission-vision'] = {
      badge: 'Our Purpose',
      title: processed?.about?.title ?? 'Mission & Vision',
      description: processed?.about?.description ?? paragraphs[0]?.slice(0, 200) ?? '',
      items: headings.slice(0, 4).map((heading, idx) => ({
        title: heading,
        description: paragraphs[idx]?.slice(0, 120) ?? '',
      })),
      imageUrl: images[0]?.src ?? '',
      imageAlt: images[0]?.alt ?? 'Mission and Vision',
    };
  }

  return mapped;
}

/**
 * Get content props for a specific component
 */
export function getComponentContentProps(
  componentName: string,
  sectionType: string,
  mappedContent: MappedContent
): Record<string, any> {
  const sectionContent = mappedContent[sectionType as keyof MappedContent];

  if (!sectionContent) {
    return {};
  }

  // Map section content to component-specific props
  switch (componentName) {
    // Banner components
    case 'banner-header-dynamic': {
      const sectionContent = mappedContent.banner as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        badgeText: sectionContent?.badgeText ?? '',
        badgeUrl: sectionContent?.badgeUrl ?? '',
        backgroundImageUrl: sectionContent?.backgroundImageUrl ?? '',
        leftAccentColor: sectionContent?.leftAccentColor ?? '',
      };
    }

    // Hero components
    case 'hero-action-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        badgeText: sectionContent?.badge ?? '',
        heading: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        primaryCtaText: sectionContent?.primaryCta?.text ?? '',
        secondaryCtaText: sectionContent?.secondaryCta?.text ?? '',
        secondaryCtaIcon: sectionContent?.secondaryCta?.icon ?? null,
        trustAvatars: sectionContent?.trust?.avatars ?? [],
        trustText: sectionContent?.trust?.text ?? '',
        mainImage: sectionContent?.image ?? '',
        floatingCard1Title: sectionContent?.stats?.[0]?.title ?? '',
        floatingCard1Subtitle: sectionContent?.stats?.[0]?.subtitle ?? '',
        floatingCard2Title: sectionContent?.stats?.[1]?.title ?? '',
        floatingCard2Subtitle: sectionContent?.stats?.[1]?.subtitle ?? '',
        floatingCard2Avatars: sectionContent?.stats?.[1]?.avatars ?? [],
      };
    }

    case 'hero-new-base-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        tagline: sectionContent?.tagline ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaLink: sectionContent?.ctaLink ?? '',
        ctaIcon: sectionContent?.ctaIcon ?? null,
        imageUrl: sectionContent?.imageUrl ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        statValue: sectionContent?.statValue ?? '',
        statLabel: sectionContent?.statLabel ?? '',
        highlightTitle: sectionContent?.highlightTitle ?? '',
        highlightDescription: sectionContent?.highlightDescription ?? '',
        partners: sectionContent?.partners ?? [],
      };
    }

    case 'hero-beam-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        primaryCtaText: sectionContent?.primaryCtaText ?? '',
        primaryCtaLink: sectionContent?.primaryCtaLink ?? '',
        statValue: sectionContent?.statValue ?? '',
        statBadge: sectionContent?.statBadge ?? '',
        chartPath: sectionContent?.chartPath ?? '',
        cardOneTitle: sectionContent?.cardOneTitle ?? '',
        cardTwoTitle: sectionContent?.cardTwoTitle ?? '',
        assetItems: sectionContent?.assetItems ?? [],
        cardThreeTitle: sectionContent?.cardThreeTitle ?? '',
        avatarImages: sectionContent?.avatarImages ?? [],
        cardThreeCtaText: sectionContent?.cardThreeCtaText ?? '',
        cardThreeCtaLink: sectionContent?.cardThreeCtaLink ?? '',
      };
    }

    // About components
    case 'about-brand-dynamic': {
      const sectionContent = mappedContent.about as any;
      return {
        badge: sectionContent?.badge ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        image: sectionContent?.image ?? '',
        imageAlt: sectionContent?.title ?? 'About our brand',
        ctaText: sectionContent?.ctaText ?? '',
        ctaLink: sectionContent?.ctaLink ?? '',
        items: sectionContent?.items?.map((item: any) => ({
          title: item.title,
          description: item.description,
          icon: item.icon, // Injector handles icon mapping
        })) ?? [],
      };
    }

    // Footer components
    case 'footer-ether-dynamic': {
      const sectionContent = mappedContent.footer as any;
      return {
        backgroundImage: sectionContent?.backgroundImage ?? '',
        brandName: sectionContent?.brandName ?? '',
        brandDescription: sectionContent?.brandDescription ?? '',
        searchPlaceholder: sectionContent?.searchPlaceholder ?? '',
        menuTitle: sectionContent?.menuTitle ?? '',
        menuLinks: sectionContent?.menuLinks ?? [],
        infoTitle: sectionContent?.infoTitle ?? '',
        infoLinks: sectionContent?.infoLinks ?? [],
        socialTitle: sectionContent?.socialTitle ?? '',
        socialLinks: sectionContent?.socialLinks ?? [],
        goOnTopText: sectionContent?.goOnTopText ?? '',
        copyrightText: sectionContent?.copyrightText ?? '',
      };
    }

    // Contact components
    case 'contact-form-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        title: sectionContent?.title ?? '',
        emailLabel: sectionContent?.emailLabel ?? '',
        email: sectionContent?.email ?? '',
        phoneLabel: sectionContent?.phoneLabel ?? '',
        phone: sectionContent?.phone ?? '',
        addressLabel: sectionContent?.addressLabel ?? '',
        address: sectionContent?.address ?? '',
        socialTitle: sectionContent?.socialTitle ?? '',
        formNameLabel: sectionContent?.formNameLabel ?? '',
        formNamePlaceholder: sectionContent?.formNamePlaceholder ?? '',
        formEmailLabel: sectionContent?.formEmailLabel ?? '',
        formEmailPlaceholder: sectionContent?.formEmailPlaceholder ?? '',
        formMessageLabel: sectionContent?.formMessageLabel ?? '',
        formMessagePlaceholder: sectionContent?.formMessagePlaceholder ?? '',
        formSubmitLabel: sectionContent?.formSubmitLabel ?? '',
      };
    }

    // CTA components
    case 'cta-banner-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        items: sectionContent?.items ?? [],
        bottomLabel: sectionContent?.bottomLabel ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        backgroundImage: sectionContent?.backgroundImage ?? '',
      };
    }

    // Navbar components
    case 'nav-bar-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        navLinks: sectionContent?.links ?? [],
        loginLabel: sectionContent?.loginLabel ?? '',
        loginHref: sectionContent?.loginHref ?? '',
        signupLabel: sectionContent?.signupLabel ?? '',
        signupHref: sectionContent?.signupHref ?? '',
      };
    }

    case 'nav-float-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        items: sectionContent?.items ?? [],
        activeLabel: sectionContent?.activeLabel ?? '',
      };
    }

    case 'nav-header-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        navItems: sectionContent?.navItems ?? [],
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
        ctaIcon: sectionContent?.ctaIcon ?? null,
      };
    }

    case 'nav-link-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        navItems: sectionContent?.navItems ?? [],
        activeItem: sectionContent?.activeItem ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
        ctaIcon: sectionContent?.ctaIcon ?? '',
      };
    }

    case 'nav-menu-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        logoImage: sectionContent?.logoImage ?? '',
        logoHref: sectionContent?.logoHref ?? '',
        navItems: sectionContent?.navItems ?? [],
        activeItem: sectionContent?.activeItem ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
      };
    }

    // Testimonials components
    case 'testi-client-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        heading: sectionContent?.heading ?? '',
        subtext: sectionContent?.subtext ?? '',
        testimonials: sectionContent?.items?.map((item: any) => ({
          quote: item?.quote ?? '',
          authorName: item?.authorName ?? '',
          authorRole: item?.authorRole ?? '',
          authorImage: item?.authorImage ?? '',
          bgColor: item?.bgColor ?? '',
        })) ?? [],
      };
    }

    // Blog components
    case 'blog-journal-dynamic': {
      const sectionContent = mappedContent.blog as any;
      return {
        subtitle: sectionContent?.subtitle ?? '',
        title: sectionContent?.title ?? '',
        items: sectionContent?.items?.map((item: any, idx: number) => ({
          id: item?.id ?? idx,
          image: item?.image ?? '',
          date: item?.date ?? '',
          category: item?.category ?? '',
          title: item?.title ?? '',
          description: item?.description ?? '',
        })) ?? [],
      };
    }

    // Gallery components
    case 'gallery-album-dynamic': {
      const sectionContent = mappedContent.gallery as any;
      return {
        title: sectionContent?.title ?? '',
        images: sectionContent?.images ?? [],
      };
    }

    // Feature components
    case 'feature-aspect-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        centerImage: sectionContent?.image ?? '',
        feature1Title: sectionContent?.items?.[0]?.title ?? '',
        feature1Description: sectionContent?.items?.[0]?.description ?? '',
        feature1Icon: sectionContent?.items?.[0]?.icon ?? null,
        feature2Title: sectionContent?.items?.[1]?.title ?? '',
        feature2Description: sectionContent?.items?.[1]?.description ?? '',
        feature2Icon: sectionContent?.items?.[1]?.icon ?? null,
        feature3Title: sectionContent?.items?.[2]?.title ?? '',
        feature3Description: sectionContent?.items?.[2]?.description ?? '',
        feature3Icon: sectionContent?.items?.[2]?.icon ?? null,
        feature4Title: sectionContent?.items?.[3]?.title ?? '',
        feature4Description: sectionContent?.items?.[3]?.description ?? '',
        feature4Icon: sectionContent?.items?.[3]?.icon ?? null,
      };
    }

    // Benefits components
    case 'benefits-advantage-dynamic': {
      const sectionContent = mappedContent.benefits as any;
      return {
        badgeText: sectionContent?.badge?.text ?? '',
        badgeIcon: sectionContent?.badge?.icon ?? null,
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        items: sectionContent?.items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          toggleIcon: item.toggleIcon,
          expandedToggleIcon: item.expandedToggleIcon,
        })) ?? [],
        images: sectionContent?.images ?? [],
        experienceValue: sectionContent?.experience?.value ?? '',
        experienceLabel: sectionContent?.experience?.label ?? '',
      };
    }

    case 'pricing-matrix-dynamic': {
      const sectionContent = mappedContent.pricing as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        featuresHeader: sectionContent?.featuresHeader ?? '',
        cards: sectionContent?.cards ?? [],
      };
    }

    // Company-story components
    case 'company-story-dynamic': {
      const sectionContent = mappedContent['company-story'] as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        intro: sectionContent?.intro ?? '',
        milestones: sectionContent?.milestones?.map((item: any, idx: number) => ({
          year: item?.year ?? '',
          title: item?.title ?? '',
          description: item?.description ?? '',
          image: item?.image ?? '',
        })) ?? [],
      };
    }

    // FAQ components
    case 'faq-great-dynamic': {
      const sectionContent = mappedContent['faq-process'] as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        badgeDotClass: sectionContent?.badgeDotClass ?? '',
        title: sectionContent?.title ?? '',
        titleHighlight: sectionContent?.titleHighlight ?? '',
        description: sectionContent?.description ?? '',
        faqItems: sectionContent?.items?.map((item: any) => ({
          question: item.title ?? item.question ?? '',
          answer: item.description ?? item.answer ?? '',
        })) ?? [],
      };
    }

    // Service-offerings components
    case 'service-grid-dynamic': {
      const sectionContent = mappedContent['service-offerings'] as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        columnHeaders: sectionContent?.columnHeaders ?? [],
        featuresList: sectionContent?.featuresList ?? [],
      };
    }

    default:
      return {};
  }
}

/**
 * Default fallback content when no extracted content is available
 */
export function getDefaultMappedContent(): MappedContent {
  return {
    hero: {
      title: 'Welcome to Our Website',
      description: 'Discover amazing features and services tailored for you',
      primaryAction: {
        label: 'Get Started',
        onClick: () => console.log('Get Started clicked'),
      },
      secondaryAction: {
        label: 'Learn More',
        onClick: () => console.log('Learn More clicked'),
      },
    },
    about: {
      title: 'About Us',
      description: 'We are dedicated to providing the best service possible',
    },
    'faq-process': {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions',
    },
    footer: {
      brandName: 'Brand',
      description: 'Providing quality services since 2024',
      links: [
        { name: 'Home', url: '#' },
        { name: 'About', url: '#about' },
        { name: 'Contact', url: '#contact' },
      ],
      copyright: '© 2024 Brand. All rights reserved.',
    },
  };
}
