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
  blog?: {
    title: string;
    subtitle?: string;
    items?: any[];
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
  'company-story'?: {
    title: string;
    subtitle?: string;
    intro?: string;
    milestones?: Array<{
      year?: string;
      title?: string;
      description?: string;
      image?: string;
    }>;
  };
  companyStory?: {
    topHeading?: string;
    topDescription?: string;
    mainImage?: string;
    bottomHeading?: string;
    bottomDescription?: string;
    ratingValue?: string;
    ratingLabel?: string;
    ratingIcon?: React.ReactNode;
    stats?: Array<{ value?: string; label?: string }>;
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

  // Map blog content
  if (sections.includes('blog')) {
    mapped.blog = {
      title: headings[0] ?? 'Latest Articles',
      subtitle: paragraphs[0]?.slice(0, 100) ?? '',
      items: [],
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

  // Map company-story content
  if (sections.includes('company-story')) {
    mapped['company-story'] = {
      title: processed?.about?.title ?? 'Our Story',
      subtitle: processed?.about?.description ?? 'Building the future together',
      intro: paragraphs[0]?.slice(0, 200) ?? '',
      milestones: [],
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

    case 'hero-active-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        heading: sectionContent?.title ?? '',
        expertAvatars: sectionContent?.images?.slice(0, 3) ?? [],
        expertCount: sectionContent?.stats?.[0]?.value ?? '',
        expertLabel: sectionContent?.stats?.[0]?.label ?? '',
        expertDescription: sectionContent?.description ?? '',
        videoThumbnail: sectionContent?.images?.[3] ?? '',
        portraitImage: sectionContent?.images?.[4] ?? '',
        portraitCtaText: sectionContent?.ctaText ?? '',
        featureTitle: sectionContent?.features?.[0]?.title ?? '',
        featureDescription: sectionContent?.features?.[0]?.description ?? '',
        statsCount: sectionContent?.stats?.[1]?.value ?? '',
        statsLabel: sectionContent?.stats?.[1]?.label ?? '',
        statsDescription: sectionContent?.stats?.[1]?.description ?? '',
      };
    }

    case 'hero-adapt-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        trustpilotRating: sectionContent?.trustpilotRating ?? '',
        trustpilotReviews: sectionContent?.trustpilotReviews ?? '',
        trustpilotSubLabel: sectionContent?.trustpilotSubLabel ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        feature1Text: sectionContent?.features?.[0]?.text ?? '',
        feature2Text: sectionContent?.features?.[1]?.text ?? '',
        feature3Text: sectionContent?.features?.[2]?.text ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaLink: sectionContent?.ctaLink ?? '',
        images: {
          main: sectionContent?.images?.[0] ?? '',
          badge: sectionContent?.badgeImage ?? '',
          bottomLeft: sectionContent?.images?.[1] ?? '',
          bottomRight: sectionContent?.images?.[2] ?? '',
        },
      };
    }

    case 'hero-alpha-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        badge: sectionContent?.badge ?? '',
        titleStart: sectionContent?.titleStart ?? sectionContent?.title ?? '',
        titleAccent: sectionContent?.titleAccent ?? '',
        titleEnd: sectionContent?.titleEnd ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        image: sectionContent?.image ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
      };
    }

    case 'hero-anchor-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        label: sectionContent?.label ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        primaryCtaText: sectionContent?.primaryCtaText ?? '',
        primaryCtaUrl: sectionContent?.primaryCtaUrl ?? '',
        secondaryCtaText: sectionContent?.secondaryCtaText ?? '',
        secondaryCtaUrl: sectionContent?.secondaryCtaUrl ?? '',
        image: sectionContent?.image ?? '',
      };
    }

    case 'hero-apex-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        heading: sectionContent?.heading ?? '',
        subheading: sectionContent?.subheading ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        backgroundImage: sectionContent?.backgroundImage ?? '',
        ratingValue: sectionContent?.ratingValue ?? '',
        testimonialQuote: sectionContent?.testimonialQuote ?? '',
        testimonialAuthor: sectionContent?.testimonialAuthor ?? '',
        featureTitle: sectionContent?.featureTitle ?? '',
        featureDescription: sectionContent?.featureDescription ?? '',
        stat1Value: sectionContent?.stat1Value ?? '',
        stat1Label: sectionContent?.stat1Label ?? '',
        sinceLabel: sectionContent?.sinceLabel ?? '',
        sinceValue: sectionContent?.sinceValue ?? '',
      };
    }

    // Blog components
    case 'blog-article-dynamic': {
      const sectionContent = mappedContent.blog as any;
      return {
        tagline: sectionContent?.tagline ?? '',
        heading: sectionContent?.heading ?? '',
        posts: sectionContent?.items?.map((item: any, index: number) => ({
          id: item.id,
          title: item.title ?? '',
          description: item.description ?? '',
          image: item.image ?? '',
          date: item.date ?? '',
          category: item.category ?? '',
          style: index % 2 === 0 ? 'image' : 'content',
        })) ?? [],
      };
    }

    case 'blog-feed-dynamic': {
      const sectionContent = mappedContent.blog as any;
      return {
        title: sectionContent?.title ?? '',
        posts: sectionContent?.items?.map((item: any) => ({
          id: item.id,
          image: item.image,
          category: item.label,
          title: item.title,
          ctaText: item.ctaText,
          ctaIcon: <ArrowRight className="w-4 h-4" />,
        })) ?? [],
        prevIcon: <ChevronLeft className="w-6 h-6" />,
        nextIcon: <ChevronRight className="w-6 h-6" />,
      };
    }

    case 'blog-grid-dynamic': {
      const sectionContent = mappedContent.blog as any;
      return {
        sectionTitle: sectionContent?.title ?? '',
        articleCount: sectionContent?.count ?? '',
        sortLabel: sectionContent?.sortText ?? 'Sort by',
        items: sectionContent?.posts?.map((post: any) => ({
          image: post?.image ?? '',
          category: post?.category ?? '',
          readTime: post?.readTime ?? '',
          title: post?.title ?? '',
          excerpt: post?.description ?? '',
          authorName: post?.author?.name ?? '',
          authorAvatar: post?.author?.avatar ?? '',
          date: post?.date ?? '',
        })) ?? [],
        paginationItems: sectionContent?.pagination?.pages?.map((p: any) => ({
          label: p?.label ?? '',
          isActive: p?.active ?? false,
        })) ?? []
      };
    }

    // About components
    case 'about-bio-dynamic': {
      const sectionContent = mappedContent.about as any;
      return {
        label: sectionContent?.label ?? '',
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        storyTitle: sectionContent?.storyTitle ?? '',
        storyDescription: sectionContent?.storyDescription ?? '',
        storyImage: sectionContent?.storyImage ?? '',
        missionTitle: sectionContent?.missionTitle ?? '',
        missionDescription: sectionContent?.missionDescription ?? '',
        visionTitle: sectionContent?.visionTitle ?? '',
        visionDescription: sectionContent?.visionDescription ?? '',
      };
    }

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

    case 'about-brief-dynamic': {
      const sectionContent = mappedContent.about as any;
      return {
        title: sectionContent?.title ?? '',
        description1: sectionContent?.description1 ?? '',
        description2: sectionContent?.description2 ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        image: sectionContent?.image ?? '',
      };
    }

    case 'story-archive-dynamic': {
      const sectionContent = mappedContent.companyStory as any;
      return {
        topHeading: sectionContent?.topHeading ?? '',
        topDescription: sectionContent?.topDescription ?? '',
        mainImage: sectionContent?.mainImage ?? '',
        bottomHeading: sectionContent?.bottomHeading ?? '',
        bottomDescription: sectionContent?.bottomDescription ?? '',
        ratingValue: sectionContent?.ratingValue ?? '',
        ratingLabel: sectionContent?.ratingLabel ?? '',
        ratingIcon: sectionContent?.ratingIcon ?? null,
        stats: sectionContent?.stats ?? [],
      };
    }

    // Footer components
    case 'footer-simple':
      return {
        brandName:   (mappedContent.footer as any)?.brandName    ?? '',
        description: (mappedContent.footer as any)?.description  ?? '',
        contactInfo: {
          email:   '',
          phone:   '',
          address: '',
        },
        copyright: (mappedContent.footer as any)?.copyright ?? '',
        links: (mappedContent.footer as any)?.links ?? [],
      };

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
        logoText: sectionContent?.logoText ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
        navLinks: sectionContent?.navLinks ?? [],
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

    case 'feature-detail-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        heading: sectionContent?.heading ?? '',
        items: sectionContent?.items?.map((item: any) => ({
          title: item.title ?? '',
          description: item.description ?? '',
          image: item.image ?? '',
          linkText: item.linkText ?? '',
          linkUrl: item.linkUrl ?? '',
          isHighlighted: item.isHighlighted ?? false,
        })) ?? [],
        loadMoreText: sectionContent?.loadMoreText ?? '',
        loadMoreUrl: sectionContent?.loadMoreUrl ?? '',
      };
    }

    case 'feature-facet-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        heading: sectionContent?.heading ?? '',
        imageSrc: sectionContent?.imageSrc ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        items: sectionContent?.items?.map((item: any) => ({
          title: item.title ?? '',
          description: item.description ?? '',
          icon: item.icon,
          linkIcon: item.linkIcon
        })) ?? [],
      };
    }

    case 'feature-focus-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.description ?? '',
        imageSrc: sectionContent?.image ?? '',
        imageAlt: sectionContent?.title ?? 'Feature focus',
        features: sectionContent?.items?.map((item: any) => ({
          title: item.title,
          description: item.description,
          icon: item.icon
        })) ?? [],
      };
    }

    case 'feature-item-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.description ?? '',
        primaryCtaText: sectionContent?.primaryButtonText ?? '',
        primaryCtaLink: sectionContent?.primaryButtonUrl ?? '',
        secondaryCtaText: sectionContent?.secondaryButtonText ?? '',
        secondaryCtaLink: sectionContent?.secondaryButtonUrl ?? '',
        items: sectionContent?.items?.map((item: any, index: number) => ({
          badge: item.badge ?? '',
          title: item.title ?? '',
          description: item.description ?? '',
          linkText: item.linkText ?? '',
          linkUrl: item.linkUrl ?? '',
          variant: index % 3 === 0 ? 'dark' : index % 3 === 1 ? 'blue' : 'orange'
        })) ?? []
      };
    }

    case 'feature-list-dynamic': {
      const sectionContent = mappedContent.feature as any;
      return {
        label: sectionContent?.label ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        features: sectionContent?.items ?? [],
        backgroundImage: sectionContent?.image ?? '',
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

    case 'benefits-asset-dynamic': {
      const sectionContent = mappedContent.benefits as any;
      return {
        label: sectionContent?.label ?? '',
        heading: sectionContent?.heading ?? '',
        footerButtonText: sectionContent?.footerButtonText ?? '',
        footerButtonHref: sectionContent?.footerButtonHref ?? '',
        items: sectionContent?.items ?? [],
        arrowIcon: sectionContent?.arrowIcon ?? null,
        readMoreArrowIcon: sectionContent?.readMoreArrowIcon ?? null,
      };
    }

    // Features components
    case 'feature-element-dynamic': {
      const sectionContent = mappedContent.features as any;
      return {
        label: sectionContent?.label ?? '',
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        primaryCtaText: sectionContent?.primaryCtaText ?? '',
        secondaryCtaText: sectionContent?.secondaryCtaText ?? '',
        features: sectionContent?.items?.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
        })) ?? [],
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
    blog: {
      title: 'Latest Articles',
      subtitle: 'Insights and updates from our team',
      items: [],
    },
    'company-story': {
      title: 'Our Story',
      subtitle: 'Building the future together',
      intro: 'We started with a simple mission and have grown ever since.',
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
