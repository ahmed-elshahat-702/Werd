"use client";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { useAppStore } from "@/lib/store";

const AppHeader = () => {
  const { headerArabicTitle, headerEnglishTitle } = useAppStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setHasShadow(currentScrollY > 0);

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 fixed w-full top-0 z-50
        bg-background/70 backdrop-blur-md transition-transform duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${hasShadow ? "shadow-md" : ""}`}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-baseline gap-2">
        <h1 className="text-lg font-semibold">{headerEnglishTitle}</h1>
        <span className="text-sm arabic-text text-muted-foreground">
          {headerArabicTitle}
        </span>
      </div>
    </header>
  );
};

export default AppHeader;
