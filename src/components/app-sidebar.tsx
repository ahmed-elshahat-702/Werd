"use client";

import type * as React from "react";
import {
  BookOpen,
  Calendar,
  Home,
  Moon,
  Sun,
  User,
  Clock,
  Heart,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import Logo from "./layout/logo";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    arabic: "الرئيسية",
  },
  {
    title: "Qur'an",
    url: "/quran",
    icon: BookOpen,
    arabic: "القرآن",
  },
  {
    title: "Hadith",
    url: "/hadith",
    icon: Bookmark,
    arabic: "الحديث",
  },
  {
    title: "Azkar",
    url: "/azkar",
    icon: Heart,
    arabic: "الأذكار",
  },
  {
    title: "Misbaha",
    url: "/misbaha",
    icon: Clock,
    arabic: "المسبحة",
  },
  {
    title: "Prayer Times",
    url: "/prayer-times",
    icon: Clock,
    arabic: "أوقات الصلاة",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    arabic: "التقويم",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    arabic: "الملف الشخصي",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppStore();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      <span className="ml-auto text-xs arabic-text text-muted-foreground">
                        {item.arabic}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
