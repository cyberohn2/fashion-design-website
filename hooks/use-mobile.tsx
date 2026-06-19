"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      typeof window !== "undefined" && setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    mql.addEventListener("change", checkMobile);

    return () => {
      mql.removeEventListener("change", checkMobile);
    };
  }, []);

  return isMobile;
}
