/**
 * Content Injection System
 * Maps extracted webpage content to component props
 */

import type { ProcessedSectionContent } from './ai-content-processor';
import { distributeImages } from './image-distributor';
import { getComponentImageConfig } from './component-image-map';
import { isComponentDynamic } from './component-content-map';

/**
 * Build testimonial objects from images and text content.
 */
function buildTestimonialItems(
  images: string[],
  paragraphs: string[],
  headings: string[]
): Array<{ image: string; name: string; username: string; text: string; social: string }> {
  if (images.length === 0) {
    return [
      {
        image: 'https://avatars.githubusercontent.com/u/1?v=4',
        name: 'Happy Customer',
        username: '@customer1',
        text: paragraphs[0]?.slice(0, 120) || 'Great service and excellent support!',
        social: 'https://twitter.com',
      },
    ];
  }
  return images.map((imgSrc, i) => ({
    image: imgSrc,
    name: headings[i + 2] || `Customer ${i + 1}`,
    username: `@customer${i + 1}`,
    text: paragraphs[i]?.slice(0, 120) || 'Excellent service and outstanding results.',
    social: 'https://twitter.com',
  }));
}

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
}

export interface MappedContent {
  navbar?: {
    logo?: {
      url: string;
      src: string;
      alt: string;
      title: string;
    };
    menu?: Array<{
      title: string;
      url: string;
    }>;
    auth?: {
      login: { text: string; url: string };
      signup: { text: string; url: string };
    };
  };
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
  features?: {
    badge: string;
    heading: string;
    description: string;
    images?: string[];
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
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
  testimonials?: {
    title: string;
    description: string;
    testimonials: Array<{
      image: string;
      name: string;
      username: string;
      text: string;
      social: string;
    }>;
  };
  contact?: {
    title: string;
    subtitle: string;
  };
  footer?: {
    brandName: string;
    description: string;
    links: Array<{ name: string; url: string }>;
    socialLinks?: Array<{ platform: string; url: string }>;
    copyright: string;
  };
  pricing?: {
    heading: string;
    subheading: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      features: string[];
      description: string;
      buttonText: string;
      href: string;
      isPopular: boolean;
    }>;
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

  // Use the image distributor if layout is provided, otherwise fall back
  // to sequential distribution
  const imageAllocation = layout
    ? distributeImages(images, layout)
    : {};

  // Helper: get images for a section from allocation or fall back to slice
  let fallbackCursor = 0;
  function getImages(section: string, count: number): string[] {
    if (layout && imageAllocation[section]) {
      return imageAllocation[section];
    }
    // Fallback: sequential slice
    const srcs = images
      .slice(fallbackCursor, fallbackCursor + count)
      .map(img => img.src);
    fallbackCursor += count;
    // If not enough images, fill with empty strings
    while (srcs.length < count) srcs.push('');
    return srcs;
  }

  // Log received images
  console.log("[ContentMapper] Images received:", images.length || 0);
  if (images.length) {
    console.log("[ContentMapper] First image:", images[0]?.src?.slice(0, 50));
  }

  // Map navbar content - Always ensure navbar has menu items
  if (sections.includes('navbar')) {
    const navLinks = processed?.footer?.description ? navigationLinks : navigationLinks.slice(0, 5);
    mapped.navbar = {
      menu: navLinks.map(link => ({
        title: link,
        url: `#${link.toLowerCase().replace(/\s+/g, '-')}`,
      })),
      auth: {
        login: { text: 'Sign In', url: '#' },
        signup: { text: 'Get Started', url: '#' },
      },
    };
  }

  // Map hero content - Assign 1 image
  if (sections.includes('hero')) {
    const heroImgs = getImages('hero', 1);
    mapped.hero = {
      title: processed?.about?.title ?? headings[0] ?? '',
      description: processed?.about?.description ?? paragraphs[0]?.slice(0, 150) ?? '',
      primaryAction: { label: 'Get Started', onClick: () => {} },
      secondaryAction: { label: 'Learn More', onClick: () => {} },
      image: heroImgs[0] ?? '',
    };
  }

  // Map about content - Use AI-processed if available, assign 2 images
  if (sections.includes('about')) {
    const aboutImages = getImages('about', 2);
    mapped.about = {
      title: processed?.about?.title ?? 'About Us',
      description: processed?.about?.description ?? paragraphs[1]?.slice(0, 200) ?? '',
      companies: processed?.about?.companies ?? [],
      achievements: processed?.about?.achievements ?? [],
      images: aboutImages,
    };
  }

  // Map features content - Use AI-processed if available, assign 4 images
  if (sections.includes('features')) {
    const featureImages = getImages('features', 4);
    mapped.features = {
      badge: processed?.features?.heading ? 'Features' : '',
      heading: processed?.features?.heading ?? 'Our Features',
      description: processed?.features?.description ?? paragraphs[2]?.slice(0, 100) ?? '',
      items: processed?.features?.items && processed.features.items.length > 0
        ? processed.features.items
        : undefined,
      images: featureImages,
    };
  }

  // Map testimonials content - Assign 3 images sequentially
  if (sections.includes('testimonials')) {
    const testimonialImages = getImages('testimonials', 3);
    const builtTestimonials = testimonialImages.map((imgSrc, i) => ({
      image: imgSrc,
      name: headings[i + 2] || `Customer ${i + 1}`,
      username: `@customer${i + 1}`,
      text: paragraphs[i]?.slice(0, 120) ?? 'Great service!',
      social: 'https://twitter.com',
    }));
    mapped.testimonials = {
      title: 'What Our Clients Say',
      description: 'Real feedback from real customers',
      testimonials: builtTestimonials.length > 0
        ? builtTestimonials
        : [],
    };
  }

  // Map contact content
  if (sections.includes('contact')) {
    mapped.contact = {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you',
      submitText: 'Send Message',
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

  // Map pricing content (uses defaults as pricing is usually specific)
  if (sections.includes('pricing')) {
    mapped.pricing = {
      heading: '',
      subheading: '',
      plans: [],
    };
  }

  // Debug logs for image distribution
  console.log('[Image Distribution]', {
    hero: mapped.hero?.image ? 'yes' : 'no',
    about: mapped.about?.images?.length || 0,
    features: mapped.features?.images?.length || 0,
    testimonials: mapped.testimonials?.testimonials?.filter((t) => t.image).length || 0,
  });

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
    // Navbar components
    case 'navbar-modern':
      return {
        logo: {
          url: '/',
          src: 'https://www.shadcnblocks.com/images/block/block-1.svg',
          alt: 'Logo',
          title: mappedContent.navbar?.menu?.[0]?.title ?? '',
        },
        menu: mappedContent.navbar?.menu?.map((item) => ({
          title: item.title,
          url: item.url,
        })) ?? [],
        auth: mappedContent.navbar?.auth,
      };

    case 'navbar-minimal':
      const menuItems = mappedContent.navbar?.menu?.map((item) => ({
        to: item.url,
        text: item.title,
      })) ?? [];

      return {
        theme: 'light' as const,
        logo: <span className="text-xl font-bold">{mappedContent.navbar?.menu?.[0]?.title ?? ''}</span>,
        menuItems: menuItems,
        rightContent: (
          <>
            <button className="text-sm font-medium hover:underline">Sign In</button>
            <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90">
              Get Started
            </button>
          </>
        ),
      };

    case 'navbar-elegant':
      return {
        navItems: mappedContent.navbar?.menu?.map((item, index) => ({
          name: item.title,
          link: item.url,
          icon: <span>{['🏠', '✨', '💰', '📞', 'ℹ️'][index % 5]}</span>,
        })) ?? [],
      };

    // Hero components
    case 'hero-ab':
      // HeroSlide component supports images prop
      const heroAbProps = {
        content: {
          title: (mappedContent.hero as any)?.title ?? '',
          subtitle: '',
          description: (mappedContent.hero as any)?.description ?? '',
          buttonText: 'Get Started',
        },
        images: (mappedContent.hero as any)?.image
          ? [(mappedContent.hero as any).image]
          : [],
      };
      if (heroAbProps.images && heroAbProps.images.length > 0) {
        console.log("[getComponentContentProps] hero-ab: passing", heroAbProps.images.length, "image(s)");
      }
      return heroAbProps;

    case 'hero-modern':
      // OceanHero does NOT support image prop - omit it
      return {
        title: (mappedContent.hero as any)?.title ?? '',
        description: (mappedContent.hero as any)?.description ?? '',
        primaryAction: (mappedContent.hero as any)?.primaryAction,
        secondaryAction: (mappedContent.hero as any)?.secondaryAction,
      };

    case 'hero-minimal':
      return {}; // Uses internal state

    case 'hero-elegant':
      return {}; // Shader-based hero, no content props

    // Features components
    case 'features- Image':
      return {
        heading: (mappedContent.features as any)?.heading ?? '',
        images: (mappedContent.features as any)?.images ?? [],
      };

    case 'features-Image-new':
      return {
        badge: (mappedContent.features as any)?.badge ?? '',
        title: (mappedContent.features as any)?.heading ?? '',
        description: (mappedContent.features as any)?.description ?? '',
        images: (mappedContent.features as any)?.images ?? [],
      };

    case 'features-grid':
      const featuresContent = mappedContent.features as any;
      return {
        badge: featuresContent?.badge ?? '',
        heading: featuresContent?.heading ?? '',
        description: featuresContent?.description ?? '',
        featureItems: featuresContent?.items ?? [],
        images: featuresContent?.images ?? [],
      };

    case 'features-slideshow':
      const featuresSlideshowContent = mappedContent.features as any;
      return {
        heading: featuresSlideshowContent?.heading ?? '',
        images: featuresSlideshowContent?.images ?? [],
      };

    case 'features-gallery-type':
      const featuresGalleryTypeContent = mappedContent.features as any;
      return {
        title: featuresGalleryTypeContent?.heading ?? '',
        description: featuresGalleryTypeContent?.description ?? '',
        images: featuresGalleryTypeContent?.images ?? [],
      };

    case 'features-coursel':
      const featuresCourselContent = mappedContent.features as any;
      return {
        title: featuresCourselContent?.heading ?? '',
        description: featuresCourselContent?.description ?? '',
        images: featuresCourselContent?.images ?? [],
      };

    // About components
    case 'about-two-column':
      const aboutContent = mappedContent.about as any;
      return {
        title: aboutContent?.title ?? '',
        description: aboutContent?.description ?? '',
        achievementsTitle: 'Our Achievements',
        achievementsDescription: '',
        companiesTitle: 'Trusted By',
        injectedCompanies: aboutContent?.companies ?? [],
        injectedAchievements: aboutContent?.achievements ?? [],
        images: aboutContent?.images ?? [],
      };

    // Testimonials components
    case 'testimonial-cards':
    case 'testimonial-section5':
      return {
        title: (mappedContent.testimonials as any)?.title ?? '',
        description: (mappedContent.testimonials as any)?.description ?? '',
        testimonials: (mappedContent.testimonials as any)?.testimonials ?? [],
      };

    case 'testimonial-gradient':
    case 'testimonial-section4':
    case 'testimonial-section5': {
      const t = mappedContent.testimonials as any;
      const items = (t?.testimonials ?? []).map((item: any) => ({
        text: item.text ?? '',
        image: item.image ?? '',
        name: item.name ?? '',
        role: item.username ?? '',
      }));
      return { testimonials: items };
    }

    case 'testimonial-modern': {
      const t = mappedContent.testimonials as any;
      const items = (t?.testimonials ?? []).map((item: any, i: number) => ({
        type: i === 1 ? 'quote' : 'user',
        quote: item.text ?? '',
        name: item.name ?? '',
        role: item.username ?? '',
        avatarSrc: item.image ?? '',
        avatarFallback: (item.name ?? 'C').charAt(0),
      }));
      return {
        title: t?.title ?? '',
        testimonials: items,
      };
    }

    // Contact components
    case 'contact-form':
      const contactContent = mappedContent.contact as any;
      return {
        title: contactContent?.title ?? '',
        description: contactContent?.subtitle ?? '',
        contactInfo: [
          { icon: 'Mail',   label: 'Email',   value: mappedContent.footer?.brandName ?? '' },
          { icon: 'Phone',  label: 'Phone',   value: '' },
          { icon: 'MapPin', label: 'Address', value: '' },
        ],
        children: (
          <form className="flex w-full flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="How can we help?"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {contactContent?.submitText ?? ''}
            </button>
          </form>
        ),
      };

    // Footer components - Now accepts props
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

    // Pricing components
    case 'pricing-cards':
      return {
        heading: (mappedContent.pricing as any)?.heading ?? '',
        subheading: (mappedContent.pricing as any)?.subheading ?? '',
        plans: (mappedContent.pricing as any)?.plans ?? [],
      };

    default:
      return {};
  }
}

/**
 * Default fallback content when no extracted content is available
 */
export function getDefaultMappedContent(): MappedContent {
  return {
    navbar: {
      menu: [
        { title: 'Home', url: '#' },
        { title: 'Features', url: '#features' },
        { title: 'About', url: '#about' },
        { title: 'Contact', url: '#contact' },
      ],
      auth: {
        login: { text: 'Sign In', url: '#' },
        signup: { text: 'Get Started', url: '#' },
      },
    },
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
    features: {
      badge: 'Features',
      heading: 'Our Features',
      description: 'Explore what makes us special',
      items: [
        { title: 'Feature One', description: 'Description of feature one' },
        { title: 'Feature Two', description: 'Description of feature two' },
        { title: 'Feature Three', description: 'Description of feature three' },
      ],
    },
    about: {
      title: 'About Us',
      description: 'We are dedicated to providing the best service possible',
    },
    testimonials: {
      title: 'What Our Clients Say',
      description: 'Real feedback from real customers',
      testimonials: [
        {
          image: 'https://avatars.githubusercontent.com/u/1?v=4',
          name: 'John Doe',
          username: '@johndoe',
          text: 'Excellent service!',
          social: 'https://twitter.com',
        },
      ],
    },
    contact: {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you',
      submitText: 'Send Message',
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
    pricing: {
      heading: 'Simple, Transparent Pricing',
      subheading: 'Choose the plan that\'s right for you',
      plans: [
        {
          name: 'Starter',
          price: '0',
          period: 'month',
          features: ['Basic Features', 'Limited Support'],
          description: 'Perfect for getting started',
          buttonText: 'Get Started',
          href: '#',
          isPopular: false,
        },
        {
          name: 'Pro',
          price: '29',
          period: 'month',
          features: ['All Features', 'Priority Support'],
          description: 'Best for professionals',
          buttonText: 'Start Free Trial',
          href: '#',
          isPopular: true,
        },
      ],
    },
  };
}
