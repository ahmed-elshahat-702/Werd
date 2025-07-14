"use client";

import type * as React from "react";
import {
  BookOpen,
  Home,
  User,
  Clock,
  Heart,
  Bookmark,
  Settings,
  Droplet,
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
import Logo from "./logo";
import ModeToggler from "./mode-toggler";
import { Separator } from "../ui/separator";

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
    icon: Droplet,
    arabic: "المسبحة",
  },
  {
    title: "Prayer Times",
    url: "/prayer-times",
    icon: Clock,
    arabic: "أوقات الصلاة",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

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
          <SidebarMenuItem className="space-y-2 mb-2">
            <ModeToggler />
            <Separator />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "profile"}>
              <Link href={"/profile"}>
                <User />
                <span>Profile</span>
                <span className="ml-auto text-xs arabic-text text-muted-foreground">
                  الملف الشخصي
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "settings"}>
              <Link href={"/settings"}>
                <Settings />
                <span>Settings</span>
                <span className="ml-auto text-xs arabic-text text-muted-foreground">
                  الإعدادات
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
