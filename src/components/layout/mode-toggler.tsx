"use client";

import React from "react";
import { Button } from "../ui/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ModeToggler = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <div className="space-y-1">
      <h1 className="text-sm text-muted-foreground">Theme</h1>
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-10"
        onClick={toggleTheme}
      >
        {theme === "system" ? (
          <>
            <Laptop className="w-4 h-4" />
            <span>System</span>
          </>
        ) : theme === "dark" ? (
          <>
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ModeToggler;
