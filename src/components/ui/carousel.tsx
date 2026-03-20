"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CarouselApi {
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

interface CarouselProps {
  opts?: {
    breakpoints?: Record<string, { dragFree?: boolean }>;
  };
  setApi?: (api: CarouselApi) => void;
  className?: string;
  children?: React.ReactNode;
}

interface CarouselContextValue {
  carouselRef: React.RefObject<HTMLDivElement | null>;
  api: CarouselApi | null;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, opts, setApi, children, ...props }, ref) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [api, setApiState] = React.useState<CarouselApi | null>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
      }
    }, []);

    const scrollNext = React.useCallback(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, []);

    const scrollTo = React.useCallback((index: number) => {
      if (carouselRef.current) {
        const itemWidth = 320; // approximate item width
        carouselRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
      }
    }, []);

    const handleScroll = React.useCallback(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollPrev(scrollLeft > 0);
        setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
        setSelectedIndex(Math.round(scrollLeft / 320));
      }
    }, []);

    React.useEffect(() => {
      if (!carouselRef.current) return;

      const api: CarouselApi = {
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
        scrollPrev,
        scrollNext,
        scrollTo,
        selectedScrollSnap: () => selectedIndex,
        on: () => {},
        off: () => {},
      };

      setApiState(api);
      handleScroll();
    }, [canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo, selectedIndex, handleScroll]);

    React.useEffect(() => {
      if (setApi) {
        setApi(api!);
      }
    }, [api, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
        }}
      >
        <div
          ref={ref}
          className={cn("relative", className)}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { carouselRef } = useCarousel();

    return (
      <div
        ref={carouselRef}
        className={cn("overflow-x-auto scroll-smooth", className)}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={(e) => {
          props.onScroll?.(e);
        }}
        {...props}
      >
        <div className="flex">{children}</div>
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-shrink-0", className)}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
};
