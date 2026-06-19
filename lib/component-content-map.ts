/**
 * Component Content Map
 * Declares what text content each component can accept dynamically.
 *
 * isDynamic: true  = component can receive extracted website text
 * isDynamic: false = component has hardcoded content, skip in layout
 *
 * contentSlots = list of text fields the component accepts as props
 * Each slot has:
 *   prop     = the prop name on the component
 *   type     = 'heading' | 'paragraph' | 'list' | 'label' | 'cta'
 *   maxWords = soft limit, content will be summarised to fit
 */

export interface ContentSlot {
  prop: string;
  type: 'heading' | 'paragraph' | 'list' | 'label' | 'cta';
  maxWords: number;
}

export interface ComponentContentConfig {
  isDynamic: boolean;
  contentSlots: ContentSlot[];
}

export const COMPONENT_CONTENT_MAP: Record<string, ComponentContentConfig> = {

  // ── HERO ────────────────────────────────────────────────────────────
  'hero-action-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 3 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 4 },
      { prop: 'trustText', type: 'paragraph', maxWords: 15 },
      { prop: 'floatingCard1Title', type: 'heading', maxWords: 3 },
      { prop: 'floatingCard1Subtitle', type: 'paragraph', maxWords: 8 },
      { prop: 'floatingCard2Title', type: 'heading', maxWords: 4 },
      { prop: 'floatingCard2Subtitle', type: 'paragraph', maxWords: 8 },
    ],
  },

  'hero-adapt-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'trustpilotRating', type: 'label', maxWords: 5 },
      { prop: 'trustpilotReviews', type: 'label', maxWords: 5 },
      { prop: 'trustpilotSubLabel', type: 'paragraph', maxWords: 15 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'feature1Text', type: 'list', maxWords: 10 },
      { prop: 'feature2Text', type: 'list', maxWords: 10 },
      { prop: 'feature3Text', type: 'list', maxWords: 10 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-alpha-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 10 },
      { prop: 'titleStart', type: 'heading', maxWords: 5 },
      { prop: 'titleAccent', type: 'heading', maxWords: 2 },
      { prop: 'titleEnd', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-anchor-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 5 },
    ],
  },

  'hero-apex-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'subheading', type: 'paragraph', maxWords: 25 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'ratingValue', type: 'label', maxWords: 3 },
      { prop: 'testimonialQuote', type: 'paragraph', maxWords: 15 },
      { prop: 'testimonialAuthor', type: 'label', maxWords: 5 },
      { prop: 'featureTitle', type: 'heading', maxWords: 8 },
      { prop: 'featureDescription', type: 'paragraph', maxWords: 15 },
      { prop: 'stat1Value', type: 'label', maxWords: 5 },
      { prop: 'stat1Label', type: 'label', maxWords: 8 },
      { prop: 'sinceLabel', type: 'label', maxWords: 3 },
      { prop: 'sinceValue', type: 'label', maxWords: 3 },
    ],
  },

  'hero-aspect-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'ratingValue', type: 'label', maxWords: 5 },
      { prop: 'ratingLabel', type: 'paragraph', maxWords: 10 },
      { prop: 'features', type: 'list', maxWords: 60 }
    ],
  },

  'hero-atlas-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'eyebrow', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'highlightedTitle', type: 'heading', maxWords: 5 },
      { prop: 'primaryCta', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCta', type: 'cta', maxWords: 5 },
      { prop: 'floatingCardLabel', type: 'label', maxWords: 5 },
      { prop: 'floatingCardTitle', type: 'heading', maxWords: 10 },
      { prop: 'floatingCardDescription', type: 'paragraph', maxWords: 25 },
    ],
  },

  // ── ABOUT ───────────────────────────────────────────────────────────
  'about-crew-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'values', type: 'list', maxWords: 50 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'imageNumber', type: 'label', maxWords: 5 },
      { prop: 'imageLabel', type: 'label', maxWords: 10 },
    ],
  },

  'about-brand-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 12 },
      { prop: 'description', type: 'paragraph', maxWords: 50 },
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
      { prop: 'items', type: 'list', maxWords: 30 },
    ],
  },

  'about-brief-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description1', type: 'paragraph', maxWords: 60 },
      { prop: 'description2', type: 'paragraph', maxWords: 60 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  // ── FOOTER ──────────────────────────────────────────────────────────
  'footer-simple': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName',   type: 'label',     maxWords: 4  },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'copyright',   type: 'label',     maxWords: 10 },
    ],
  },

  'footer-glow-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 50 },
      { prop: 'newsletterTitle', type: 'heading', maxWords: 10 },
      { prop: 'newsletterDescription', type: 'paragraph', maxWords: 40 },
      { prop: 'newsletterPlaceholder', type: 'label', maxWords: 10 },
      { prop: 'newsletterButtonText', type: 'cta', maxWords: 5 },
      { prop: 'copyrightText', type: 'paragraph', maxWords: 15 }
    ],
  },

  'footer-halo-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 5 },
      { prop: 'brandDescription', type: 'paragraph', maxWords: 35 },
      { prop: 'copyrightText', type: 'label', maxWords: 8 },
      { prop: 'column1Title', type: 'heading', maxWords: 4 },
      { prop: 'column1Links', type: 'list', maxWords: 20 },
      { prop: 'column2Title', type: 'heading', maxWords: 4 },
      { prop: 'column2Links', type: 'list', maxWords: 20 },
      { prop: 'column3Title', type: 'heading', maxWords: 4 },
      { prop: 'column3Links', type: 'list', maxWords: 20 }
    ],
  },

  'footer-prism-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'heading', maxWords: 5 },
      { prop: 'logoSubtext', type: 'label', maxWords: 10 },
      { prop: 'copyrightText', type: 'paragraph', maxWords: 15 },
      { prop: 'copyrightBrandText', type: 'label', maxWords: 10 }
    ],
  },

  'footer-ether-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName', type: 'heading', maxWords: 10 },
      { prop: 'brandDescription', type: 'paragraph', maxWords: 80 },
      { prop: 'searchPlaceholder', type: 'label', maxWords: 6 },
      { prop: 'menuTitle', type: 'heading', maxWords: 8 },
      { prop: 'infoTitle', type: 'heading', maxWords: 8 },
      { prop: 'socialTitle', type: 'heading', maxWords: 8 },
      { prop: 'goOnTopText', type: 'label', maxWords: 6 },
      { prop: 'copyrightText', type: 'paragraph', maxWords: 15 }
    ],
  },

  'footer-lume-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'heading', maxWords: 4 },
      { prop: 'brandDescription', type: 'paragraph', maxWords: 20 },
      { prop: 'col2Title', type: 'label', maxWords: 4 },
      { prop: 'col3Title', type: 'label', maxWords: 4 },
      { prop: 'col4Title', type: 'label', maxWords: 4 },
      { prop: 'col4Description', type: 'paragraph', maxWords: 20 },
      { prop: 'newsletterPlaceholder', type: 'label', maxWords: 6 },
      { prop: 'contactEmail', type: 'paragraph', maxWords: 6 },
      { prop: 'copyrightText', type: 'paragraph', maxWords: 10 },
      { prop: 'privacyText', type: 'label', maxWords: 4 },
      { prop: 'termsText', type: 'label', maxWords: 4 }
    ],
  },

  // ── CONTACT ─────────────────────────────────────────────────────────
  'contact-form-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'emailLabel', type: 'label', maxWords: 5 },
      { prop: 'email', type: 'paragraph', maxWords: 10 },
      { prop: 'phoneLabel', type: 'label', maxWords: 5 },
      { prop: 'phone', type: 'paragraph', maxWords: 10 },
      { prop: 'addressLabel', type: 'label', maxWords: 5 },
      { prop: 'address', type: 'paragraph', maxWords: 30 },
      { prop: 'socialTitle', type: 'label', maxWords: 5 },
      { prop: 'formNameLabel', type: 'label', maxWords: 5 },
      { prop: 'formNamePlaceholder', type: 'paragraph', maxWords: 10 },
      { prop: 'formEmailLabel', type: 'label', maxWords: 5 },
      { prop: 'formEmailPlaceholder', type: 'paragraph', maxWords: 10 },
      { prop: 'formMessageLabel', type: 'label', maxWords: 5 },
      { prop: 'formMessagePlaceholder', type: 'paragraph', maxWords: 15 },
      { prop: 'formSubmitLabel', type: 'cta', maxWords: 5 },
    ],
  },

  'contact-help-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 6 },
      { prop: 'heading', type: 'heading', maxWords: 12 },
      { prop: 'descriptionText', type: 'paragraph', maxWords: 40 },
      { prop: 'phoneText', type: 'label', maxWords: 8 },
      { prop: 'addressText', type: 'label', maxWords: 15 },
      { prop: 'emailText', type: 'label', maxWords: 15 },
      { prop: 'formNameLabel', type: 'label', maxWords: 5 },
      { prop: 'formNamePlaceholder', type: 'label', maxWords: 5 },
      { prop: 'formPhoneLabel', type: 'label', maxWords: 5 },
      { prop: 'formPhonePlaceholder', type: 'label', maxWords: 5 },
      { prop: 'formServicesLabel', type: 'label', maxWords: 5 },
      { prop: 'formServicesPlaceholder', type: 'label', maxWords: 8 },
      { prop: 'formServicesOptions', type: 'list', maxWords: 30 },
      { prop: 'submitText', type: 'cta', maxWords: 5 }
    ],
  },

  'contact-inbox-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 6 },
      { prop: 'titlePart1', type: 'heading', maxWords: 15 },
      { prop: 'titlePart2', type: 'heading', maxWords: 5 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'formNameLabel', type: 'label', maxWords: 5 },
      { prop: 'formNamePlaceholder', type: 'label', maxWords: 5 },
      { prop: 'formPhoneLabel', type: 'label', maxWords: 5 },
      { prop: 'formPhonePlaceholder', type: 'label', maxWords: 5 },
      { prop: 'formServiceLabel', type: 'label', maxWords: 5 },
      { prop: 'formServicePlaceholder', type: 'label', maxWords: 5 },
      { prop: 'formSubmitText', type: 'cta', maxWords: 5 }
    ],
  },

  'contact-lead-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'tagText', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'emailLabel', type: 'label', maxWords: 8 },
      { prop: 'emailValue', type: 'paragraph', maxWords: 15 },
      { prop: 'phoneLabel', type: 'label', maxWords: 8 },
      { prop: 'phoneValue', type: 'paragraph', maxWords: 15 },
      { prop: 'officeLabel', type: 'label', maxWords: 8 },
      { prop: 'officeValue', type: 'paragraph', maxWords: 20 },
      { prop: 'nameLabel', type: 'label', maxWords: 8 },
      { prop: 'namePlaceholder', type: 'label', maxWords: 8 },
      { prop: 'lastNameLabel', type: 'label', maxWords: 8 },
      { prop: 'lastNamePlaceholder', type: 'label', maxWords: 8 },
      { prop: 'emailFieldLabel', type: 'label', maxWords: 8 },
      { prop: 'emailFieldPlaceholder', type: 'label', maxWords: 8 },
      { prop: 'messageLabel', type: 'label', maxWords: 8 },
      { prop: 'messagePlaceholder', type: 'label', maxWords: 10 },
      { prop: 'submitButtonText', type: 'cta', maxWords: 5 }
    ],
  },

  'contact-link-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 5 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'namePlaceholder', type: 'label', maxWords: 2 },
      { prop: 'emailPlaceholder', type: 'label', maxWords: 2 },
      { prop: 'messagePlaceholder', type: 'label', maxWords: 2 },
      { prop: 'buttonText', type: 'cta', maxWords: 1 },
    ],
  },

  'contact-mail-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 50 },
      { prop: 'address', type: 'paragraph', maxWords: 30 },
      { prop: 'email', type: 'paragraph', maxWords: 15 },
      { prop: 'nameLabel', type: 'label', maxWords: 8 },
      { prop: 'emailLabel', type: 'label', maxWords: 8 },
      { prop: 'companyLabel', type: 'label', maxWords: 8 },
      { prop: 'phoneLabel', type: 'label', maxWords: 8 },
      { prop: 'messageLabel', type: 'label', maxWords: 8 },
      { prop: 'submitButtonText', type: 'cta', maxWords: 5 },
      { prop: 'successMessage', type: 'paragraph', maxWords: 30 }
    ],
  },

  'contact-office-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 4 },
      { prop: 'fullNameLabel', type: 'label', maxWords: 4 },
      { prop: 'fullNamePlaceholder', type: 'paragraph', maxWords: 6 },
      { prop: 'emailLabel', type: 'label', maxWords: 6 },
      { prop: 'emailPlaceholder', type: 'paragraph', maxWords: 6 },
      { prop: 'messageLabel', type: 'label', maxWords: 6 },
      { prop: 'messagePlaceholder', type: 'paragraph', maxWords: 10 },
      { prop: 'submitButtonText', type: 'cta', maxWords: 3 },
      { prop: 'cardTitle', type: 'heading', maxWords: 8 },
      { prop: 'cardSubtitle', type: 'paragraph', maxWords: 12 }
    ],
  },

  'contact-reach-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'titleLine', type: 'heading', maxWords: 10 },
      { prop: 'brandName', type: 'heading', maxWords: 8 },
      { prop: 'description', type: 'paragraph', maxWords: 35 },
      { prop: 'formTitle', type: 'heading', maxWords: 10 },
      { prop: 'nameLabel', type: 'label', maxWords: 5 },
      { prop: 'namePlaceholder', type: 'paragraph', maxWords: 8 },
      { prop: 'emailLabel', type: 'label', maxWords: 5 },
      { prop: 'emailPlaceholder', type: 'paragraph', maxWords: 8 },
      { prop: 'servicesLabel', type: 'label', maxWords: 5 },
      { prop: 'servicesPlaceholder', type: 'paragraph', maxWords: 8 },
      { prop: 'messageLabel', type: 'label', maxWords: 5 },
      { prop: 'messagePlaceholder', type: 'paragraph', maxWords: 8 },
      { prop: 'submitButtonText', type: 'cta', maxWords: 5 }
    ],
  },

  'contact-support-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 8 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'emailLabel', type: 'label', maxWords: 4 },
      { prop: 'emailPlaceholder', type: 'label', maxWords: 6 },
      { prop: 'messageLabel', type: 'label', maxWords: 4 },
      { prop: 'messagePlaceholder', type: 'label', maxWords: 6 },
      { prop: 'submitButtonText', type: 'cta', maxWords: 3 },
      { prop: 'successMessage', type: 'paragraph', maxWords: 15 }
    ],
  },

  // ── CTA ─────────────────────────────────────────────────────────────
  'cta-banner-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 20 },
      { prop: 'items', type: 'list', maxWords: 20 },
      { prop: 'bottomLabel', type: 'label', maxWords: 10 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
    ],
  },

  'cta-button-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 }
    ],
  },

  'cta-click-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 }
    ],
  },

  'cta-convert-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 35 },
      { prop: 'inputLabel', type: 'label', maxWords: 5 },
      { prop: 'inputPlaceholder', type: 'label', maxWords: 5 },
      { prop: 'buttonText', type: 'cta', maxWords: 3 },
      { prop: 'subtext', type: 'paragraph', maxWords: 15 },
      { prop: 'linkText', type: 'cta', maxWords: 5 }
    ],
  },

  'cta-drive-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 25 },
      { prop: 'cardText', type: 'paragraph', maxWords: 60 },
      { prop: 'inputPlaceholder', type: 'label', maxWords: 8 },
      { prop: 'buttonText', type: 'cta', maxWords: 5 },
      { prop: 'privacyTextPrefix', type: 'paragraph', maxWords: 15 },
      { prop: 'privacyLinkText', type: 'cta', maxWords: 5 }
    ],
  },

  'cta-goal-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeCategory', type: 'label', maxWords: 5 },
      { prop: 'badgeText', type: 'paragraph', maxWords: 15 },
      { prop: 'heading', type: 'heading', maxWords: 20 },
      { prop: 'description', type: 'paragraph', maxWords: 50 },
      { prop: 'inputPlaceholder', type: 'label', maxWords: 10 },
      { prop: 'buttonText', type: 'cta', maxWords: 10 }
    ],
  },

  // ── NAVBAR ──────────────────────────────────────────────────────────
  'nav-bar-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 5 },
      { prop: 'loginLabel', type: 'cta', maxWords: 3 },
      { prop: 'signupLabel', type: 'cta', maxWords: 3 },
      { prop: 'navLinks', type: 'list', maxWords: 10 },
    ],
  },

  'nav-float-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 3 },
      { prop: 'ctaText', type: 'cta', maxWords: 3 },
    ],
  },

  'nav-header-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName', type: 'label', maxWords: 5 },
      { prop: 'searchPlaceholder', type: 'cta', maxWords: 3 },
      { prop: 'navLinks', type: 'list', maxWords: 10 },
    ],
  },

  'nav-link-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'heading', maxWords: 4 },
      { prop: 'topLink1Text', type: 'label', maxWords: 5 },
      { prop: 'topLink2Text', type: 'label', maxWords: 5 },
      { prop: 'topLink3Text', type: 'label', maxWords: 5 },
      { prop: 'mainLink1Text', type: 'label', maxWords: 4 },
      { prop: 'mainLink2Text', type: 'label', maxWords: 4 },
      { prop: 'mainLink3Text', type: 'label', maxWords: 4 },
      { prop: 'mainLink4Text', type: 'label', maxWords: 4 }
    ],
  },

  'nav-menu-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'brandName', type: 'heading', maxWords: 5 },
      { prop: 'topLinks', type: 'list', maxWords: 15 },
      { prop: 'mainLinks', type: 'list', maxWords: 20 }
    ],
  },

  'nav-panel-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'logoText', type: 'label', maxWords: 5 },
      { prop: 'signInText', type: 'cta', maxWords: 3 },
      { prop: 'signUpText', type: 'cta', maxWords: 3 }
    ],
  },

  // ── TESTIMONIALS ────────────────────────────────────────────────────
  'testi-client-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'subtext', type: 'paragraph', maxWords: 25 },
      { prop: 'testimonials', type: 'list', maxWords: 0 },
    ],
  },

  'testi-critique-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 5 },
      { prop: 'headingText', type: 'heading', maxWords: 15 },
      { prop: 'testimonials', type: 'list', maxWords: 200 }
    ],
  },

  'testi-feedback-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 25 },
    ],
  },

  'testi-honor-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'items.quote', type: 'paragraph', maxWords: 80 },
      { prop: 'items.authorName', type: 'heading', maxWords: 10 },
      { prop: 'items.authorRole', type: 'label', maxWords: 10 }
    ],
  },

  'testi-praise-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'items', type: 'list', maxWords: 15 },
      { prop: 'dividerText', type: 'label', maxWords: 5 }
    ],
  },

  'testi-quote-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'quoteText', type: 'paragraph', maxWords: 60 },
      { prop: 'authorName', type: 'heading', maxWords: 8 },
      { prop: 'authorRole', type: 'label', maxWords: 10 }
    ],
  },

  // ── MISSION-VISION ───────────────────────────────────────────────────
  'mission-new-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'items', type: 'list', maxWords: 150 }
    ],
  },

  'mission-enhanced-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 60 },
    ],
  },

  'mission-brand-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
    ],
  },

  // ── GALLERY ─────────────────────────────────────────────────────────
  'gallery-album-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
    ],
  },

  // ── FEATURE ─────────────────────────────────────────────────────────
  'feature-aspect-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
      { prop: 'feature1Title', type: 'label', maxWords: 5 },
      { prop: 'feature1Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature2Title', type: 'label', maxWords: 5 },
      { prop: 'feature2Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature3Title', type: 'label', maxWords: 5 },
      { prop: 'feature3Description', type: 'paragraph', maxWords: 15 },
      { prop: 'feature4Title', type: 'label', maxWords: 5 },
      { prop: 'feature4Description', type: 'paragraph', maxWords: 15 },
    ],
  },

  'feature-detail-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'loadMoreText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },

  'feature-facet-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 12 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 80 }
    ],
  },

  'feature-focus-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 30 },
      { prop: 'features', type: 'list', maxWords: 100 }
    ],
  },

  'feature-item-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 40 },
      { prop: 'primaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'secondaryCtaText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 150 }
    ],
  },

  'feature-list-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'ctaText', type: 'cta', maxWords: 5 },
      { prop: 'features', type: 'list', maxWords: 100 }
    ],
  },

  // ── BLOG ─────────────────────────────────────────────────────────────
  'blog-journal-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'subtitle', type: 'label', maxWords: 10 },
      { prop: 'title', type: 'heading', maxWords: 20 },
      { prop: 'items.title', type: 'heading', maxWords: 25 },
      { prop: 'items.description', type: 'paragraph', maxWords: 50 },
      { prop: 'items.category', type: 'label', maxWords: 5 },
      { prop: 'items.date', type: 'label', maxWords: 10 }
    ],
  },

  // ── BENEFITS ──────────────────────────────────────────────────────────
  'benefits-advantage-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 3 },
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'items', type: 'list', maxWords: 60 },
      { prop: 'experienceValue', type: 'label', maxWords: 2 },
      { prop: 'experienceLabel', type: 'label', maxWords: 3 },
    ],
  },

  'benefits-asset-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 5 },
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'footerButtonText', type: 'cta', maxWords: 5 },
      { prop: 'items', type: 'list', maxWords: 100 },
    ],
  },

  // ── PRICING ──────────────────────────────────────────────────────────
  'pricing-matrix-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'featuresHeader', type: 'label', maxWords: 5 }
    ],
  },

  'pricing-static-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'subtitle', type: 'paragraph', maxWords: 20 },
      { prop: 'toggleMonthlyLabel', type: 'label', maxWords: 5 },
      { prop: 'toggleYearlyLabel', type: 'label', maxWords: 5 },
      { prop: 'toggleSaveLabel', type: 'label', maxWords: 5 },
    ],
  },

  // ── FAQ-PROCESS ─────────────────────────────────────────────────────
  'faq-great-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'titleHighlight', type: 'label', maxWords: 4 },
      { prop: 'description', type: 'paragraph', maxWords: 40 }
    ],
  },

  'faq-new-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 10 },
      { prop: 'headingPart1', type: 'heading', maxWords: 15 },
      { prop: 'headingPart2', type: 'heading', maxWords: 15 },
      { prop: 'headingHighlightDetail', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 80 },
      { prop: 'cardTitle', type: 'heading', maxWords: 15 },
      { prop: 'cardDescription1', type: 'paragraph', maxWords: 80 },
      { prop: 'cardDescription2', type: 'paragraph', maxWords: 80 },
      { prop: 'cardCtaText', type: 'cta', maxWords: 10 }
    ],
  },

  'faq-super-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badgeText', type: 'label', maxWords: 4 },
      { prop: 'heading', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 30 },
      { prop: 'buttonText', type: 'cta', maxWords: 4 }
    ],
  },

  // ── COMPANY-STORY ──────────────────────────────────────────────────────
  'story-event-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'title', type: 'heading', maxWords: 10 },
      { prop: 'description', type: 'paragraph', maxWords: 55 },
      { prop: 'buttonText', type: 'cta', maxWords: 5 }
    ],
  },

  'story-chapter-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'label', type: 'label', maxWords: 4 },
      { prop: 'titlePrefix', type: 'heading', maxWords: 6 },
      { prop: 'titleHighlight', type: 'heading', maxWords: 4 },
      { prop: 'description', type: 'paragraph', maxWords: 60 },
      { prop: 'ctaText', type: 'cta', maxWords: 4 },
      { prop: 'item1Title', type: 'label', maxWords: 6 },
      { prop: 'item1Description', type: 'paragraph', maxWords: 15 },
      { prop: 'item2Title', type: 'label', maxWords: 6 },
      { prop: 'item2Description', type: 'paragraph', maxWords: 15 },
      { prop: 'item3Title', type: 'label', maxWords: 6 },
      { prop: 'item3Description', type: 'paragraph', maxWords: 15 },
      { prop: 'item4Title', type: 'label', maxWords: 6 },
      { prop: 'item4Description', type: 'paragraph', maxWords: 15 }
    ],
  },

  'story-heritage-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'headingStart', type: 'heading', maxWords: 10 },
      { prop: 'headingAccent', type: 'heading', maxWords: 5 },
      { prop: 'headingEnd', type: 'heading', maxWords: 10 },
      { prop: 'rightHeading', type: 'heading', maxWords: 20 },
      { prop: 'rightDescription', type: 'paragraph', maxWords: 80 }
    ],
  },

  'story-history-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'badge', type: 'label', maxWords: 5 },
      { prop: 'title', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 80 },
      { prop: 'buttonText', type: 'cta', maxWords: 6 }
    ],
  },

  'story-journey-dynamic': {
    isDynamic: true,
    contentSlots: [
      { prop: 'heading', type: 'heading', maxWords: 15 },
      { prop: 'description', type: 'paragraph', maxWords: 40 },
      { prop: 'overlayTitle', type: 'label', maxWords: 8 }
    ],
  },

};

/**
 * Check if a component can accept dynamic content.
 */
export function isComponentDynamic(componentName: string): boolean {
  // Explicit map entry takes priority
  if (componentName in COMPONENT_CONTENT_MAP) {
    return COMPONENT_CONTENT_MAP[componentName].isDynamic;
  }
  // Any component whose name ends with -dynamic is implicitly dynamic
  // (it accepts AI-generated props even without a manual content slot declaration)
  return componentName.endsWith('-dynamic');
}

/**
 * Get all dynamic component names for a given section category.
 * Used by the layout generator to exclude static-only components.
 */
export function getDynamicComponents(category: string): string[] {
  return Object.entries(COMPONENT_CONTENT_MAP)
    .filter(([name, config]) => {
      const isInCategory = name.startsWith(category);
      return isInCategory && config.isDynamic;
    })
    .map(([name]) => name);
}

/**
 * Get all dynamic-only component names (components ending with -dynamic).
 * These are the ONLY components that should be selected by the AI layout generator.
 */
export function getDynamicOnlyComponents(): string[] {
  return Object.entries(COMPONENT_CONTENT_MAP)
    .filter(([name, config]) => name.endsWith('-dynamic') && config.isDynamic)
    .map(([name]) => name);
}

/**
 * Get all static-only component names.
 * These should never be selected by the AI layout generator.
 * ANY component NOT ending in '-dynamic' is treated as static/excluded.
 */
export function getStaticOnlyComponents(): string[] {
  return Object.keys(COMPONENT_CONTENT_MAP).filter(name => !name.endsWith('-dynamic'));
}
