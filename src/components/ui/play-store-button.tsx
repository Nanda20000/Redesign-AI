import * as React from "react";
import { cn } from "@/lib/utils";

interface PlayStoreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const PlayStoreButton = React.forwardRef<HTMLButtonElement, PlayStoreButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          className
        )}
        {...props}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.18,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
        </svg>
        <span>Get it on Google Play</span>
      </button>
    );
  }
);
PlayStoreButton.displayName = "PlayStoreButton";

export { PlayStoreButton };
