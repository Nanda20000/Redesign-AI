"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);

    // Define the callback function to handle media query changes
    const callback = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the callback as a listener
    media.addEventListener("change", callback);

    // Clean up
    return () => {
      media.removeEventListener("change", callback);
    };
  }, [query]);

  return matches;
}
