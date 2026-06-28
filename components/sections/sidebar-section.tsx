"use client";

import * as React from "react";
import { SidebarMainProps } from "@/components/sidebar/sidebar.types";
import { desktopStore, mobileStore } from "@/components/sidebar/sidebar.store";
import { themeStore } from "@/components/sidebar/theme.store";
import SidebarShell from "@/components/sidebar/SidebarShell";

export default function SidebarMain({ onMobileOpenChange }: SidebarMainProps) {
  const desktopOpen = React.useSyncExternalStore(
    desktopStore.subscribe,
    desktopStore.getSnapshot,
    () => true
  );
  
  const mobileOpen = React.useSyncExternalStore(
    mobileStore.subscribe,
    mobileStore.getSnapshot,
    () => false
  );
  
  const theme = React.useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getClientSnapshot,
    themeStore.getServerSnapshot
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  React.useEffect(() => {
    onMobileOpenChange?.(mobileOpen);
  }, [mobileOpen, onMobileOpenChange]);

  // Handle scroll lock for mobile
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <SidebarShell
      mobileOpen={mobileOpen}
      desktopOpen={desktopOpen}
      theme={theme}
      onToggleTheme={() => themeStore.toggle()}
      onToggleMobile={() => mobileStore.set(!mobileOpen)}
      onCloseMobile={() => mobileStore.set(false)}
      onToggleDesktop={() => desktopStore.set(!desktopOpen)}
    />
  );
}
