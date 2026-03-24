import { Badge } from "@/components/ui/badge";

interface FeaturesImageNewProps {
  badge?: string;
  title?: string;
  description?: string;
  images?: string[];
}

function FeaturesImageNew({
  badge = "Platform",
  title = "Make your site a true standout.",
  description = "Discover new web trends that help you craft sleek, highly functional sites that drive traffic and convert leads into customers.",
  images = [],
}: FeaturesImageNewProps) {
  const displayImage = images.length > 0 ? images[0] : null;

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
          <div className="w-full aspect-video h-full flex-1 overflow-hidden rounded-md bg-muted">
            {displayImage ? (
              <img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
          <div className="flex gap-4 pl-0 lg:pl-20 flex-col flex-1">
            <div>
              <Badge>{badge}</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                {title}
              </h2>
              <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FeaturesImageNew };
