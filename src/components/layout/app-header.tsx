import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const AppHeader = ({
  englishText,
  arabicText,
}: {
  englishText: string;
  arabicText?: string;
}) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex items-baseline gap-2">
        <h1 className="text-lg font-semibold">{englishText}</h1>
        <span className="text-sm arabic-text text-muted-foreground">
          {arabicText}
        </span>
      </div>
    </header>
  );
};

export default AppHeader;
