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

    case 'hero-aspect-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.primaryCta?.text ?? '',
        ratingValue: sectionContent?.socialProof?.value ?? '',
        ratingLabel: sectionContent?.socialProof?.label ?? '',
        ratingAvatars: sectionContent?.socialProof?.avatars ?? [],
        videoThumbnail: sectionContent?.image ?? '',
        features: sectionContent?.items?.map((item: any) => ({
          title: item?.title ?? '',
          description: item?.description ?? '',
        })) ?? [],
      };
    }

    case 'hero-atlas-dynamic': {
      const sectionContent = mappedContent.hero as any;
      return {
        eyebrow: sectionContent?.eyebrow ?? '',
        title: sectionContent?.title ?? '',
        highlightedTitle: sectionContent?.highlightedTitle ?? '',
        primaryCta: sectionContent?.primaryCta ?? '',
        secondaryCta: sectionContent?.secondaryCta ?? '',
        backgroundImage: sectionContent?.backgroundImage ?? '',
        floatingCardLabel: sectionContent?.floatingCardLabel ?? '',
        floatingCardTitle: sectionContent?.floatingCardTitle ?? '',
        floatingCardDescription: sectionContent?.floatingCardDescription ?? '',
        floatingCardImages: sectionContent?.floatingCardImages ?? [],
        primaryCtaIcon: sectionContent?.primaryCtaIcon,
        secondaryCtaIcon: sectionContent?.secondaryCtaIcon,
        cardArrowIcon: sectionContent?.cardArrowIcon,
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

    case 'about-crew-dynamic': {
      const sectionContent = mappedContent.about as any;
      return {
        label: sectionContent?.label ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        values: sectionContent?.items?.map((item: any) => item.title || item.text) ?? [],
        ctaText: sectionContent?.ctaText ?? '',
        ctaLink: sectionContent?.ctaLink ?? '',
        backgroundImage: sectionContent?.image || sectionContent?.backgroundImage || '',
        imageNumber: sectionContent?.imageNumber ?? '',
        imageLabel: sectionContent?.imageLabel ?? '',
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

    case 'footer-glow-dynamic': {
      const sectionContent = mappedContent.footer as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        description: sectionContent?.description ?? '',
        newsletterTitle: sectionContent?.newsletterTitle ?? '',
        newsletterDescription: sectionContent?.newsletterDescription ?? '',
        newsletterPlaceholder: sectionContent?.newsletterPlaceholder ?? '',
        newsletterButtonText: sectionContent?.newsletterButtonText ?? '',
        copyrightText: sectionContent?.copyrightText ?? '',
        columns: sectionContent?.columns ?? [],
        bottomLinks: sectionContent?.bottomLinks ?? [],
      };
    }

    case 'footer-halo-dynamic': {
      const sectionContent = mappedContent.footer as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        brandDescription: sectionContent?.brandDescription ?? '',
        copyrightText: sectionContent?.copyrightText ?? '',
        column1Title: sectionContent?.column1Title ?? '',
        column1Links: sectionContent?.column1Links ?? [],
        column2Title: sectionContent?.column2Title ?? '',
        column2Links: sectionContent?.column2Links ?? [],
        column3Title: sectionContent?.column3Title ?? '',
        column3Links: sectionContent?.column3Links ?? [],
      };
    }

    case 'footer-prism-dynamic': {
      const sectionContent = mappedContent.footer as any;
      return {
        logoImgSrc: sectionContent?.logoImgSrc ?? '',
        logoImgAlt: sectionContent?.logoImgAlt ?? '',
        logoText: sectionContent?.logoText ?? '',
        logoSubtext: sectionContent?.logoSubtext ?? '',
        links: sectionContent?.links ?? [],
        socials: sectionContent?.socials ?? [],
        copyrightText: sectionContent?.copyrightText ?? '',
        copyrightBrandText: sectionContent?.copyrightBrandText ?? '',
        copyrightBrandHref: sectionContent?.copyrightBrandHref ?? '',
      };
    }

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

    case 'footer-lume-dynamic': {
      const sectionContent = mappedContent.footer as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        brandDescription: sectionContent?.brandDescription ?? '',
        col2Title: sectionContent?.col2Title ?? '',
        col2Links: sectionContent?.links?.slice(0, 5).map((l: any) => ({ label: l.label, href: l.href })) ?? [],
        col3Title: sectionContent?.col3Title ?? '',
        col3Links: sectionContent?.links?.slice(5, 10).map((l: any) => ({ label: l.label, href: l.href })) ?? [],
        col4Title: sectionContent?.col4Title ?? '',
        col4Description: sectionContent?.col4Description ?? '',
        newsletterPlaceholder: sectionContent?.newsletterPlaceholder ?? '',
        contactEmail: sectionContent?.contactEmail ?? '',
        copyrightText: sectionContent?.copyrightText ?? '',
        privacyText: sectionContent?.privacyText ?? '',
        privacyUrl: sectionContent?.privacyUrl ?? '',
        termsText: sectionContent?.termsText ?? '',
        termsUrl: sectionContent?.termsUrl ?? '',
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

    case 'contact-help-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        heading: sectionContent?.heading ?? '',
        descriptionText: sectionContent?.descriptionText ?? '',
        phoneText: sectionContent?.phoneText ?? '',
        addressText: sectionContent?.addressText ?? '',
        emailText: sectionContent?.emailText ?? '',
        formNameLabel: sectionContent?.formNameLabel ?? '',
        formNamePlaceholder: sectionContent?.formNamePlaceholder ?? '',
        formPhoneLabel: sectionContent?.formPhoneLabel ?? '',
        formPhonePlaceholder: sectionContent?.formPhonePlaceholder ?? '',
        formServicesLabel: sectionContent?.formServicesLabel ?? '',
        formServicesPlaceholder: sectionContent?.formServicesPlaceholder ?? '',
        formServicesOptions: sectionContent?.formServicesOptions ?? [],
        submitText: sectionContent?.submitText ?? '',
      };
    }

    case 'contact-inbox-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        titlePart1: sectionContent?.titlePart1 ?? sectionContent?.title ?? '',
        titlePart2: sectionContent?.titlePart2 ?? sectionContent?.subtitle ?? '',
        description: sectionContent?.description ?? '',
        formNameLabel: sectionContent?.formNameLabel ?? '',
        formNamePlaceholder: sectionContent?.formNamePlaceholder ?? '',
        formPhoneLabel: sectionContent?.formPhoneLabel ?? '',
        formPhonePlaceholder: sectionContent?.formPhonePlaceholder ?? '',
        formServiceLabel: sectionContent?.formServiceLabel ?? '',
        formServicePlaceholder: sectionContent?.formServicePlaceholder ?? '',
        formServiceOptions: sectionContent?.formServiceOptions ?? [],
        formSubmitText: sectionContent?.formSubmitText ?? '',
        items: sectionContent?.items ?? [],
      };
    }

    case 'contact-lead-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        tagText: sectionContent?.tag || '',
        title: sectionContent?.title || '',
        description: sectionContent?.description || '',
        emailLabel: sectionContent?.emailLabel || '',
        emailValue: sectionContent?.email || '',
        phoneLabel: sectionContent?.phoneLabel || '',
        phoneValue: sectionContent?.phone || '',
        officeLabel: sectionContent?.officeLabel || '',
        officeValue: sectionContent?.address || '',
        nameLabel: sectionContent?.firstNameLabel || '',
        namePlaceholder: sectionContent?.firstNamePlaceholder || '',
        lastNameLabel: sectionContent?.lastNameLabel || '',
        lastNamePlaceholder: sectionContent?.lastNamePlaceholder || '',
        emailFieldLabel: sectionContent?.emailInputLabel || '',
        emailFieldPlaceholder: sectionContent?.emailInputPlaceholder || '',
        messageLabel: sectionContent?.messageInputLabel || '',
        messagePlaceholder: sectionContent?.messageInputPlaceholder || '',
        submitButtonText: sectionContent?.submitText || '',
      };
    }

    case 'contact-link-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        namePlaceholder: sectionContent?.namePlaceholder ?? '',
        emailPlaceholder: sectionContent?.emailPlaceholder ?? '',
        messagePlaceholder: sectionContent?.messagePlaceholder ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        imageUrl: sectionContent?.imageUrl ?? '',
      };
    }

    case 'contact-mail-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        address: sectionContent?.address ?? '',
        email: sectionContent?.email ?? '',
        linkedinUrl: sectionContent?.linkedinUrl ?? '',
        facebookUrl: sectionContent?.facebookUrl ?? '',
        twitterUrl: sectionContent?.twitterUrl ?? '',
        nameLabel: sectionContent?.nameLabel ?? '',
        emailLabel: sectionContent?.emailLabel ?? '',
        companyLabel: sectionContent?.companyLabel ?? '',
        phoneLabel: sectionContent?.phoneLabel ?? '',
        messageLabel: sectionContent?.messageLabel ?? '',
        submitButtonText: sectionContent?.submitButtonText ?? '',
        successMessage: sectionContent?.successMessage ?? '',
      };
    }

    case 'contact-office-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        title: sectionContent?.title ?? '',
        fullNameLabel: sectionContent?.fullNameLabel ?? '',
        fullNamePlaceholder: sectionContent?.fullNamePlaceholder ?? '',
        emailLabel: sectionContent?.emailLabel ?? '',
        emailPlaceholder: sectionContent?.emailPlaceholder ?? '',
        messageLabel: sectionContent?.messageLabel ?? '',
        messagePlaceholder: sectionContent?.messagePlaceholder ?? '',
        submitButtonText: sectionContent?.submitButtonText ?? '',
        cardTitle: sectionContent?.cardTitle ?? '',
        cardSubtitle: sectionContent?.cardSubtitle ?? '',
        contactItems: sectionContent?.contactItems ?? []
      };
    }

    case 'contact-reach-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        backgroundImageUrl: sectionContent?.backgroundImageUrl ?? '',
        titleLine: sectionContent?.titleLine ?? '',
        brandName: sectionContent?.brandName ?? '',
        description: sectionContent?.description ?? '',
        formTitle: sectionContent?.formTitle ?? '',
        nameLabel: sectionContent?.nameLabel ?? '',
        namePlaceholder: sectionContent?.namePlaceholder ?? '',
        emailLabel: sectionContent?.emailLabel ?? '',
        emailPlaceholder: sectionContent?.emailPlaceholder ?? '',
        servicesLabel: sectionContent?.servicesLabel ?? '',
        servicesPlaceholder: sectionContent?.servicesPlaceholder ?? '',
        servicesOptions: sectionContent?.servicesOptions ?? [],
        messageLabel: sectionContent?.messageLabel ?? '',
        messagePlaceholder: sectionContent?.messagePlaceholder ?? '',
        submitButtonText: sectionContent?.submitButtonText ?? '',
      };
    }

    case 'contact-support-dynamic': {
      const sectionContent = mappedContent.contact as any;
      return {
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        emailLabel: sectionContent?.emailLabel ?? '',
        emailPlaceholder: sectionContent?.emailPlaceholder ?? '',
        messageLabel: sectionContent?.messageLabel ?? '',
        messagePlaceholder: sectionContent?.messagePlaceholder ?? '',
        submitButtonText: sectionContent?.submitButtonText ?? '',
        successMessage: sectionContent?.successMessage ?? '',
        images: sectionContent?.images ?? [],
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

    case 'cta-button-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
        imageSrc: sectionContent?.imageSrc ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
      };
    }

    case 'cta-click-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        heading: sectionContent?.heading ?? '',
      };
    }

    case 'cta-convert-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        inputLabel: sectionContent?.inputLabel ?? '',
        inputPlaceholder: sectionContent?.inputPlaceholder ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        subtext: sectionContent?.subtext ?? '',
        linkText: sectionContent?.linkText ?? '',
        linkUrl: sectionContent?.linkUrl ?? '',
      };
    }

    case 'cta-drive-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        cardText: sectionContent?.cardText ?? '',
        inputPlaceholder: sectionContent?.inputPlaceholder ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        privacyTextPrefix: sectionContent?.privacyTextPrefix ?? '',
        privacyLinkText: sectionContent?.privacyLinkText ?? '',
        privacyLinkUrl: sectionContent?.privacyLinkUrl ?? '',
      };
    }

    case 'cta-goal-dynamic': {
      const sectionContent = mappedContent.cta as any;
      return {
        badgeCategory: sectionContent?.badgeCategory ?? '',
        badgeText: sectionContent?.badgeText ?? '',
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        inputPlaceholder: sectionContent?.inputPlaceholder ?? '',
        buttonText: sectionContent?.buttonText ?? '',
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

    case 'nav-header-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        brandName: sectionContent?.brandName ?? '',
        brandLink: sectionContent?.brandLink ?? '',
        navLinks: sectionContent?.links ?? [],
        searchPlaceholder: sectionContent?.searchPlaceholder ?? '',
      };
    }

    case 'nav-link-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        topLink1Text: sectionContent?.topLink1Text ?? '',
        topLink1Url: sectionContent?.topLink1Url ?? '',
        topLink2Text: sectionContent?.topLink2Text ?? '',
        topLink2Url: sectionContent?.topLink2Url ?? '',
        topLink3Text: sectionContent?.topLink3Text ?? '',
        topLink3Url: sectionContent?.topLink3Url ?? '',
        mainLink1Text: sectionContent?.mainLink1Text ?? '',
        mainLink1Url: sectionContent?.mainLink1Url ?? '',
        mainLink2Text: sectionContent?.mainLink2Text ?? '',
        mainLink2Url: sectionContent?.mainLink2Url ?? '',
        mainLink3Text: sectionContent?.mainLink3Text ?? '',
        mainLink3Url: sectionContent?.mainLink3Url ?? '',
        mainLink4Text: sectionContent?.mainLink4Text ?? '',
        mainLink4Url: sectionContent?.mainLink4Url ?? '',
      };
    }

    case 'nav-menu-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        topLinks: sectionContent?.topLinks ?? [],
        brandName: sectionContent?.brandName ?? '',
        brandHref: sectionContent?.brandHref ?? '#',
        mainLinks: sectionContent?.mainLinks ?? [],
      };
    }

    case 'nav-panel-dynamic': {
      const sectionContent = mappedContent.navbar as any;
      return {
        logoText: sectionContent?.logoText ?? '',
        navItems: sectionContent?.navItems ?? [],
        signInText: sectionContent?.signInText ?? '',
        signInUrl: sectionContent?.signInUrl ?? '',
        signUpText: sectionContent?.signUpText ?? '',
        signUpUrl: sectionContent?.signUpUrl ?? '',
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

    case 'testi-critique-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        badgeText: sectionContent?.badge ?? '',
        headingText: sectionContent?.title ?? '',
        testimonials: Array.isArray(sectionContent?.items) 
          ? sectionContent.items.map((item: any, idx: number) => ({
              id: item.id || idx,
              quote: item.text || item.quote || '',
              authorName: item.name || item.author || '',
              authorHandle: item.handle || '',
              authorAvatar: item.image || item.avatar || '',
            }))
          : [],
      };
    }

    case 'testi-feedback-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        items: sectionContent?.items?.map((item: any, idx: number) => ({
          id: item.id ?? idx,
          feedback: item.feedback ?? '',
          authorName: item.authorName ?? '',
          authorRole: item.authorRole ?? '',
          authorAvatarUrl: item.authorAvatarUrl ?? '',
        })) ?? [],
      };
    }

    case 'testi-honor-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        items: sectionContent?.items?.map((item: any) => ({
          quote: item?.quote ?? '',
          authorName: item?.authorName ?? '',
          authorRole: item?.authorRole ?? '',
          authorAvatar: item?.authorAvatar ?? '',
        })) ?? [],
      };
    }

    case 'testi-praise-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        items: sectionContent?.items?.map((item: any, idx: number) => ({
          id: item?.id ?? idx,
          quote: item?.quote ?? '',
          ratingText: item?.ratingText ?? '',
          authorName: item?.authorName ?? '',
          authorRole: item?.authorRole ?? '',
          authorImage: item?.authorImage ?? '',
        })) ?? [],
        dividerText: sectionContent?.dividerText ?? '————',
      };
    }

    case 'testi-quote-dynamic': {
      const sectionContent = mappedContent.testimonials as any;
      return {
        quoteText: sectionContent?.quoteText ?? '',
        authorName: sectionContent?.authorName ?? '',
        authorRole: sectionContent?.authorRole ?? '',
        authorAvatarUrl: sectionContent?.authorAvatarUrl ?? '',
        testimonialImageUrl: sectionContent?.testimonialImageUrl ?? '',
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

    case 'pricing-matrix-dynamic': {
      const sectionContent = mappedContent.pricing as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        featuresHeader: sectionContent?.featuresHeader ?? '',
        cards: sectionContent?.cards ?? [],
      };
    }

    case 'pricing-static-dynamic': {
      const sectionContent = mappedContent.pricing as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        toggleMonthlyLabel: sectionContent?.toggleMonthlyLabel ?? '',
        toggleYearlyLabel: sectionContent?.toggleYearlyLabel ?? '',
        toggleSaveLabel: sectionContent?.toggleSaveLabel ?? '',
        plans: sectionContent?.plans ?? [],
      };
    }

    // Company-story components
    case 'story-event-dynamic': {
      const sectionContent = mappedContent['company-story'] as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        imageUrl: sectionContent?.imageUrl ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        items: sectionContent?.items ?? [],
      };
    }

    case 'story-chapter-dynamic': {
      const sectionContent = mappedContent['company-story'] as any;
      return {
        label: sectionContent?.label ?? '',
        titlePrefix: sectionContent?.titlePrefix ?? '',
        titleHighlight: sectionContent?.titleHighlight ?? '',
        description: sectionContent?.description ?? '',
        ctaText: sectionContent?.ctaText ?? '',
        ctaHref: sectionContent?.ctaHref ?? '',
        item1Title: sectionContent?.item1Title ?? '',
        item1Description: sectionContent?.item1Description ?? '',
        item2Title: sectionContent?.item2Title ?? '',
        item2Description: sectionContent?.item2Description ?? '',
        item3Title: sectionContent?.item3Title ?? '',
        item3Description: sectionContent?.item3Description ?? '',
        item4Title: sectionContent?.item4Title ?? '',
        item4Description: sectionContent?.item4Description ?? '',
      };
    }

    case 'story-heritage-dynamic': {
      const sectionContent = mappedContent['company-story'] as any;
      return {
        headingStart: sectionContent?.headingStart ?? '',
        headingAccent: sectionContent?.headingAccent ?? '',
        headingEnd: sectionContent?.headingEnd ?? '',
        imageSrc: sectionContent?.imageSrc ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        rightHeading: sectionContent?.rightHeading ?? '',
        rightDescription: sectionContent?.rightDescription ?? '',
        stats: sectionContent?.stats ?? [],
      };
    }

    case 'story-history-dynamic': {
      const sectionContent = mappedContent.companyStory as any;
      return {
        badge: sectionContent?.badge ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        imageUrl: sectionContent?.imageUrl ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        stats: sectionContent?.stats ?? [],
      };
    }

    case 'story-journey-dynamic': {
      const sectionContent = mappedContent.companyStory as any;
      return {
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        imageSrc: sectionContent?.imageSrc ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        overlayTitle: sectionContent?.overlayTitle ?? '',
        overlayItems: sectionContent?.overlayItems ?? [],
        features: sectionContent?.features ?? [],
        stats: sectionContent?.stats ?? [],
      };
    }

    // Mission-vision components
    case 'mission-new-dynamic': {
      const sectionContent = mappedContent['mission-vision'] as any;
      return {
        badge: sectionContent?.badge ?? '',
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        items: sectionContent?.items ?? [],
        imageUrl: sectionContent?.imageUrl ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
      };
    }

    case 'mission-enhanced-dynamic': {
      const sectionContent = mappedContent['mission-vision'] as any;
      return {
        title: sectionContent?.title ?? '',
        description: sectionContent?.description ?? '',
        items: sectionContent?.items ?? [],
      };
    }

    case 'mission-brand-dynamic': {
      const sectionContent = mappedContent['mission-vision'] as any;
      return {
        title: sectionContent?.title ?? '',
        imageUrl: sectionContent?.imageUrl ?? '',
        imageAlt: sectionContent?.imageAlt ?? '',
        items: sectionContent?.items ?? [],
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

    case 'faq-process-dynamic': {
      const sectionContent = mappedContent['faq-process'] as any;
      return {
        title: sectionContent?.title ?? '',
        subtitle: sectionContent?.subtitle ?? '',
        type: sectionContent?.type ?? 'faq',
        faqItems: sectionContent?.faqItems ?? sectionContent?.items ?? [],
        processSteps: sectionContent?.processSteps ?? [],
      };
    }

    case 'faq-new-dynamic': {
      const sectionContent = mappedContent['faq-process'] as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        headingPart1: sectionContent?.headingPart1 ?? '',
        headingPart2: sectionContent?.headingPart2 ?? '',
        headingHighlightDetail: sectionContent?.headingHighlightDetail ?? '',
        description: sectionContent?.description ?? '',
        cardTitle: sectionContent?.cardTitle ?? '',
        cardDescription1: sectionContent?.cardDescription1 ?? '',
        cardDescription2: sectionContent?.cardDescription2 ?? '',
        cardCtaText: sectionContent?.cardCtaText ?? '',
        cardCtaUrl: sectionContent?.cardCtaUrl ?? '',
        items: sectionContent?.faqItems ?? sectionContent?.items ?? [],
      };
    }

    case 'faq-super-dynamic': {
      const sectionContent = mappedContent['faq-process'] as any;
      return {
        badgeText: sectionContent?.badgeText ?? '',
        heading: sectionContent?.heading ?? '',
        description: sectionContent?.description ?? '',
        buttonText: sectionContent?.buttonText ?? '',
        buttonLink: sectionContent?.buttonLink ?? '',
        faqItems: (sectionContent?.faqItems || []).map((item: any, idx: number) => ({
          id: item?.id || `faq-item-${idx}`,
          question: item?.question || '',
          answer: item?.answer || ''
        }))
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
