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
}): ExtractedContent {
  const headings = structure.headings || [];
  const paragraphs = structure.sections.map((s) => s.textPreview).filter((t) => t && t.length > 20);
  const navigationLinks = structure.navigation || [];

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

  // Use AI-processed content if available
  const processed = content.processed;
  
  // Use first heading as potential brand/hero title
  const mainHeading = content.headings[0] || 'Welcome';
  const subHeading = content.headings[1] || content.paragraphs[0]?.slice(0, 100) || 'Discover more';

  // Map navbar content
  if (sections.includes('navbar') && content.navigationLinks.length > 0) {
    mapped.navbar = {
      menu: content.navigationLinks.slice(0, 6).map((link) => ({
        title: link,
        url: `#${link.toLowerCase().replace(/\s+/g, '-')}`,
      })),
      auth: {
        login: { text: 'Sign In', url: '#' },
        signup: { text: 'Get Started', url: '#' },
      },
    };
  }

  // Map hero content
  if (sections.includes('hero')) {
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
    };
  }

  // Map features content - Use AI-processed if available
  if (sections.includes('features')) {
    if (processed?.features) {
      mapped.features = {
        badge: 'Features',
        heading: processed.features.heading || 'Our Features',
        description: processed.features.description || 'Discover what we offer',
      };
    } else {
      // Fallback to basic extraction
      const featureItems = content.headings.slice(1, 4).map((heading) => ({
        title: heading,
        description: content.paragraphs.find((p) => p.length < 200) || 'Learn more about our features',
      }));

      mapped.features = {
        badge: 'Features',
        heading: content.headings.find((h) => h.toLowerCase().includes('feature')) || 'Our Features',
        description: content.paragraphs.find((p) => p.toLowerCase().includes('feature') || p.toLowerCase().includes('service')) || 
                     'Discover what we offer',
        items: featureItems.length > 0 ? featureItems : undefined,
      };
    }
  }

  // Map about content - Use AI-processed if available
  if (sections.includes('about')) {
    if (processed?.about) {
      mapped.about = {
        title: processed.about.title || 'About Us',
        description: processed.about.description || 'Learn more about our organization',
        companies: processed.about.companies || [],
        achievements: processed.about.achievements || [],
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
      };
    }
  }

  // Map testimonials content
  if (sections.includes('testimonials')) {
    mapped.testimonials = {
      title: 'What Our Clients Say',
      description: 'Real feedback from our valued customers',
      testimonials: [
        {
          image: 'https://avatars.githubusercontent.com/u/1?v=4',
          name: 'Happy Customer',
          username: '@customer1',
          text: content.paragraphs[0]?.slice(0, 100) || 'Great service and excellent support!',
          social: 'https://twitter.com',
        },
        {
          image: 'https://avatars.githubusercontent.com/u/2?v=4',
          name: 'Satisfied Client',
          username: '@client2',
          text: content.paragraphs[1]?.slice(0, 100) || 'Highly recommended for quality work',
          social: 'https://twitter.com',
        },
        {
          image: 'https://avatars.githubusercontent.com/u/3?v=4',
          name: 'Regular User',
          username: '@user3',
          text: content.paragraphs[2]?.slice(0, 100) || 'Amazing experience overall',
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
    case 'hero-modern':
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
      };

    // About components
    case 'about-two-column':
      const aboutContent = mappedContent.about as any;
      return {
        title: aboutContent?.title || 'About Us',
        description: aboutContent?.description || 'Learn more about our organization',
        injectedCompanies: aboutContent?.companies || [],
        injectedAchievements: aboutContent?.achievements || [],
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
