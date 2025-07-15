"use client";

import { useState, useEffect } from "react";
import { HeaderDestkop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";

export function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <>{isMobile ? <HeaderMobile /> : <HeaderDestkop />}</>;
}
