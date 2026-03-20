import * as React from "react";
import { cn } from "@/lib/utils";

interface MenuToggleIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

const MenuToggleIcon = React.forwardRef<SVGSVGElement, MenuToggleIconProps>(
  ({ className, isOpen = false, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(className)}
        {...props}
      >
        {isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </>
        )}
      </svg>
    );
  }
);
MenuToggleIcon.displayName = "MenuToggleIcon";

export { MenuToggleIcon };
