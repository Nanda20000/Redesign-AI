import { Button } from "@/components/ui/button";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
  // Content injection props
  injectedCompanies?: string[];
  injectedAchievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
];

export const About3 = ({
  title,
  description,
  mainImage,
  secondaryImage,
  breakout,
  companiesTitle,
  companies,
  achievementsTitle,
  achievementsDescription,
  achievements,
  injectedCompanies,
  injectedAchievements,
}: About3Props) => {
  // Use injected content if provided, otherwise use defaults
  const finalTitle = title || "About Us";
  const finalDescription = description || "We are dedicated to providing excellence in everything we do.";
  const finalMainImage = mainImage || {
    src: "https://shadcnblocks.com/images/block/placeholder-1.svg",
    alt: "placeholder",
  };
  const finalSecondaryImage = secondaryImage || {
    src: "https://shadcnblocks.com/images/block/placeholder-2.svg",
    alt: "placeholder",
  };
  const finalBreakout = breakout || {
    src: "https://shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "Our Mission",
    description: "To deliver exceptional value and service to our customers",
    buttonText: "Learn More",
    buttonUrl: "#",
  };
  const finalCompaniesTitle = companiesTitle || "Trusted by organizations worldwide";
  
  // Use injected companies or provided companies or defaults
  const finalCompanies = injectedCompanies && injectedCompanies.length > 0
    ? injectedCompanies.map((name, idx) => ({
        src: `https://shadcnblocks.com/images/block/logos/company/fictional-company-logo-${(idx % 6) + 1}.svg`,
        alt: name,
      }))
    : companies || defaultCompanies;
  
  const finalAchievementsTitle = achievementsTitle || "Our Achievements";
  const finalAchievementsDescription = achievementsDescription || "We take pride in our accomplishments and the value we deliver.";
  
  // Use injected achievements or provided achievements or defaults
  const finalAchievements = injectedAchievements && injectedAchievements.length > 0
    ? injectedAchievements
    : achievements || defaultAchievements;

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h1 className="text-5xl font-semibold">{finalTitle}</h1>
          <p className="text-muted-foreground">{finalDescription}</p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={finalMainImage.src}
            alt={finalMainImage.alt}
            className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted p-7 md:w-1/2 lg:w-auto">
              <img
                src={finalBreakout.src}
                alt={finalBreakout.alt}
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{finalBreakout.title}</p>
                <p className="text-muted-foreground">{finalBreakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto" asChild>
                <a href={finalBreakout.buttonUrl} target="_blank">
                  {finalBreakout.buttonText}
                </a>
              </Button>
            </div>
            <img
              src={finalSecondaryImage.src}
              alt={finalSecondaryImage.alt}
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>
        <div className="py-32">
          <p className="text-center">{finalCompaniesTitle} </p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {finalCompanies.map((company, idx) => (
              <div className="flex items-center gap-3" key={company.src + idx}>
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-6 w-auto md:h-8"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-muted p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-4xl font-semibold">{finalAchievementsTitle}</h2>
            <p className="max-w-screen-sm text-muted-foreground">
              {finalAchievementsDescription}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
            {finalAchievements.map((item, idx) => (
              <div className="flex flex-col gap-4" key={item.label + idx}>
                <p>{item.label}</p>
                <span className="text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};
