/**
 * Content Injection System
 * Maps extracted webpage content to component props
 */

import type { ProcessedSectionContent } from './ai-content-processor';

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
  sections: string[]
): MappedContent {
  const mapped: MappedContent = {};

  // Safe handling of empty/null content
  // Create a copy of images for intelligent distribution
  const images = [...(content.images || [])];
  const headings = content.headings || [];
  const paragraphs = content.paragraphs || [];
  const navigationLinks = content.navigationLinks || [];

  // Log received images
  console.log("[ContentMapper] Images received:", images.length || 0);
  if (images.length) {
    console.log("[ContentMapper] First image:", images[0]?.src?.slice(0, 50));
  }

  // Helper function to get random images from the pool
  function getRandomImages(count: number) {
    if (!images || images.length === 0) {
      return [];
    }
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Use AI-processed content if available
  const processed = content.processed;

  // Use first heading as potential brand/hero title
  const mainHeading = headings[0] || 'Welcome';
  const subHeading = headings[1] || paragraphs[0]?.slice(0, 100) || 'Discover more';

  // Map navbar content
  if (sections.includes('navbar') && navigationLinks.length > 0) {
    mapped.navbar = {
      menu: navigationLinks.slice(0, 6).map((link) => ({
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
    const heroImage = images[0] || null;

    mapped.hero = {
      title: mainHeading,
      description: subHeading,
      primaryAction: {
        label: 'Get Started',
        onClick: () => console.log('Primary action clicked'),
      },
      secondaryAction: {
        label: 'Learn More',
        onClick: () => console.log('Secondary action clicked'),
      },
      image: heroImage?.src || "",
    };
  }

  // Map about content - Use AI-processed if available, assign 2 random images
  if (sections.includes('about')) {
    const aboutImages = getRandomImages(2);

    if (processed?.about) {
      mapped.about = {
        title: processed.about.title || 'About Us',
        description: processed.about.description || 'Learn more about our organization',
        companies: processed.about.companies || [],
        achievements: processed.about.achievements || [],
        images: aboutImages.map(img => img.src),
      };
    } else {
      // Fallback to basic extraction
      const aboutHeading = content.headings.find((h) => h.toLowerCase().includes('about')) || 'About Us';
      const aboutParagraph = content.paragraphs.find((p) =>
        p.toLowerCase().includes('about') ||
        p.toLowerCase().includes('mission') ||
        p.toLowerCase().includes('vision')
      ) || content.paragraphs[0] || 'Learn more about our organization';

      mapped.about = {
        title: aboutHeading,
        description: aboutParagraph.slice(0, 300),
        companies: [],
        achievements: [],
        images: aboutImages.map(img => img.src),
      };
    }
  }

  // Map features content - Use AI-processed if available, assign 4 random images
  if (sections.includes('features')) {
    const featureImages = getRandomImages(4);

    if (processed?.features) {
      mapped.features = {
        badge: 'Features',
        heading: processed.features.heading || 'Our Features',
        description: processed.features.description || 'Discover what we offer',
        images: featureImages.map(img => img.src),
      };
    } else {
      // Fallback to basic extraction
      const featureItems = headings.slice(1, 4).map((heading) => ({
        title: heading,
        description: paragraphs.find((p) => p.length < 200) || 'Learn more about our features',
      }));

      mapped.features = {
        badge: 'Features',
        heading: headings.find((h) => h.toLowerCase().includes('feature')) || 'Our Features',
        description: paragraphs.find((p) => p.toLowerCase().includes('feature') || p.toLowerCase().includes('service')) ||
                     'Discover what we offer',
        items: featureItems.length > 0 ? featureItems : undefined,
        images: featureImages.map(img => img.src),
      };
    }
  }

  // Map testimonials content - Assign images using modulo for distribution
  if (sections.includes('testimonials')) {
    // Get 3 random images for testimonials, or use fallback avatars
    const testimonialImages = getRandomImages(3);

    mapped.testimonials = {
      title: 'What Our Clients Say',
      description: 'Real feedback from our valued customers',
      testimonials: testimonialImages.length > 0
        ? testimonialImages.map((img, i) => ({
            image: img.src,
            name: `User ${i + 1}`,
            username: `@user${i + 1}`,
            text: paragraphs[i]?.slice(0, 100) || 'Sample feedback',
            social: 'https://twitter.com',
          }))
        : [
            {
              image: 'https://avatars.githubusercontent.com/u/1?v=4',
              name: 'Happy Customer',
              username: '@customer1',
              text: paragraphs[0]?.slice(0, 100) || 'Great service and excellent support!',
              social: 'https://twitter.com',
            },
            {
              image: 'https://avatars.githubusercontent.com/u/2?v=4',
              name: 'Satisfied Client',
              username: '@client2',
              text: paragraphs[1]?.slice(0, 100) || 'Highly recommended for quality work',
              social: 'https://twitter.com',
            },
            {
              image: 'https://avatars.githubusercontent.com/u/3?v=4',
              name: 'Regular User',
              username: '@user3',
              text: paragraphs[2]?.slice(0, 100) || 'Amazing experience overall',
              social: 'https://twitter.com',
            },
          ],
    };
  }

  // Map contact content
  if (sections.includes('contact')) {
    mapped.contact = {
      title: 'Get In Touch',
      subtitle: content.contactInfo 
        ? `Email: ${content.contactInfo.email || 'N/A'} | Phone: ${content.contactInfo.phone || 'N/A'}`
        : 'Have a question? We\'d love to hear from you.',
      submitText: 'Send Message',
    };
  }

  // Map footer content - Use AI-processed if available
  if (sections.includes('footer')) {
    const brandName = mainHeading.split(' ')[0];
    const copyrightYear = new Date().getFullYear();
    
    if (processed?.footer) {
      mapped.footer = {
        brandName: processed.footer.brandName || brandName,
        description: processed.footer.description || subHeading.slice(0, 150),
        links: content.navigationLinks.slice(0, 5).map((link) => ({
          name: link,
          url: `#${link.toLowerCase().replace(/\s+/g, '-')}`,
        })),
        copyright: processed.footer.copyright || `© ${copyrightYear} ${brandName}. All rights reserved.`,
      };
    } else {
      mapped.footer = {
        brandName: brandName,
        description: content.footerText?.slice(0, 150) || subHeading.slice(0, 150),
        links: content.navigationLinks.slice(0, 5).map((link) => ({
          name: link,
          url: `#${link.toLowerCase().replace(/\s+/g, '-')}`,
        })),
        copyright: `${content.footerText?.match(/©|copyright/i) ? content.footerText : `© ${copyrightYear} ${brandName}. All rights reserved.`}`,
      };
    }
  }

  // Map pricing content (uses defaults as pricing is usually specific)
  if (sections.includes('pricing')) {
    mapped.pricing = {
      heading: 'Simple, Transparent Pricing',
      subheading: 'Choose the plan that works best for you',
      plans: [
        {
          name: 'Starter',
          price: '0',
          period: 'month',
          features: ['Basic Features', 'Limited Support', '1 User'],
          description: 'Perfect for getting started',
          buttonText: 'Get Started',
          href: '#',
          isPopular: false,
        },
        {
          name: 'Professional',
          price: '29',
          period: 'month',
          features: ['All Features', 'Priority Support', 'Unlimited Users'],
          description: 'Best for growing teams',
          buttonText: 'Start Free Trial',
          href: '#',
          isPopular: true,
        },
        {
          name: 'Enterprise',
          price: '99',
          period: 'month',
          features: ['Custom Solutions', '24/7 Support', 'Dedicated Manager'],
          description: 'For large organizations',
          buttonText: 'Contact Sales',
          href: '#',
          isPopular: false,
        },
      ],
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
          title: mappedContent.navbar?.menu?.[0]?.title || 'Brand',
        },
        menu: mappedContent.navbar?.menu?.map((item) => ({
          title: item.title,
          url: item.url,
        })) || [],
        auth: mappedContent.navbar?.auth,
      };

    case 'navbar-minimal':
      return {
        theme: 'light' as const,
        logo: <span className="text-xl font-bold">{mappedContent.navbar?.menu?.[0]?.title || 'Brand'}</span>,
        menuItems: mappedContent.navbar?.menu?.map((item) => ({
          to: item.url,
          text: item.title,
        })) || [],
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
        })) || [],
      };

    // Hero components
    case 'hero-ab':
      // HeroSlide component supports images prop
      const heroAbProps = {
        content: {
          title: (mappedContent.hero as any)?.title || 'Welcome',
          subtitle: (mappedContent.hero as any)?.description,
          description: (mappedContent.hero as any)?.description,
          buttonText: (mappedContent.hero as any)?.primaryAction?.label,
        },
        ...(mappedContent.hero?.image && { images: [mappedContent.hero.image] }),
      };
      if (heroAbProps.images) {
        console.log("[getComponentContentProps] hero-ab: passing", heroAbProps.images.length, "image(s)");
      }
      return heroAbProps;

    case 'hero-modern':
      // OceanHero does NOT support image prop - omit it
      return {
        title: (mappedContent.hero as any)?.title || 'Welcome',
        description: (mappedContent.hero as any)?.description || 'Discover more about us',
        primaryAction: (mappedContent.hero as any)?.primaryAction,
        secondaryAction: (mappedContent.hero as any)?.secondaryAction,
      };

    case 'hero-minimal':
      return {}; // Uses internal state

    case 'hero-elegant':
      return {}; // Shader-based hero, no content props

    // Features components
    case 'features-grid':
      const featuresContent = mappedContent.features as any;
      return {
        badge: featuresContent?.badge || 'Features',
        heading: featuresContent?.heading || 'Our Features',
        description: featuresContent?.description || 'Discover what we offer',
        featureItems: featuresContent?.items || [],
        images: featuresContent?.images || [],
      };

    case 'features-slideshow':
      const featuresSlideshowContent = mappedContent.features as any;
      return {
        heading: featuresSlideshowContent?.heading || 'Gallery',
        images: featuresSlideshowContent?.images || [],
      };

    case 'features-gallery-type':
      const featuresGalleryTypeContent = mappedContent.features as any;
      return {
        title: featuresGalleryTypeContent?.heading || 'Case Studies',
        description: featuresGalleryTypeContent?.description || 'Discover more',
        images: featuresGalleryTypeContent?.images || [],
      };

    case 'features-coursel':
      const featuresCourselContent = mappedContent.features as any;
      return {
        title: featuresCourselContent?.heading || 'Case Studies',
        description: featuresCourselContent?.description || 'Discover more',
        images: featuresCourselContent?.images || [],
      };

    // About components
    case 'about-two-column':
      const aboutContent = mappedContent.about as any;
      return {
        title: aboutContent?.title || 'About Us',
        description: aboutContent?.description || 'Learn more about our organization',
        injectedCompanies: aboutContent?.companies || [],
        injectedAchievements: aboutContent?.achievements || [],
        images: aboutContent?.images || [],
      };

    // Testimonials components
    case 'testimonial-cards':
      return {
        title: (mappedContent.testimonials as any)?.title || 'Testimonials',
        description: (mappedContent.testimonials as any)?.description || 'What our clients say',
        testimonials: (mappedContent.testimonials as any)?.testimonials || [],
      };

    // Contact components
    case 'contact-form':
      const contactContent = mappedContent.contact as any;
      const contactEmail = contactContent?.email || 'contact@example.com';
      const contactPhone = contactContent?.phone || '+1 (555) 123-4567';
      return {
        title: contactContent?.title || 'Get In Touch',
        description: contactContent?.subtitle || 'We\'d love to hear from you',
        contactInfo: [
          {
            icon: 'Mail',
            label: 'Email',
            value: contactEmail,
          },
          {
            icon: 'Phone',
            label: 'Phone',
            value: contactPhone,
          },
          {
            icon: 'MapPin',
            label: 'Address',
            value: contactContent?.address || '123 Business St, City, State 12345',
          },
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
              {contactContent?.submitText || 'Send Message'}
            </button>
          </form>
        ),
      };

    // Footer components - Now accepts props
    case 'footer-simple':
      return {
        brandName: (mappedContent.footer as any)?.brandName || 'Brand',
        description: (mappedContent.footer as any)?.description || 'Providing quality services',
        contactInfo: (mappedContent.footer as any)?.contactInfo || {},
        copyright: (mappedContent.footer as any)?.copyright || `© ${new Date().getFullYear()}. All rights reserved.`,
      };

    // Pricing components
    case 'pricing-cards':
      return {
        heading: (mappedContent.pricing as any)?.heading || 'Pricing',
        subheading: (mappedContent.pricing as any)?.subheading || 'Choose your plan',
        plans: (mappedContent.pricing as any)?.plans || [],
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
