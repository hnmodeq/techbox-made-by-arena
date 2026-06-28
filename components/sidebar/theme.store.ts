import { THEME_KEY } from "./sidebar.config";
import type { ThemeMode } from "./sidebar.types";

function createThemeStore() {
  const listeners = new Set<() => void>();
  
  const getServerSnapshot = (): ThemeMode => "light";
  
  const getClientSnapshot = (): ThemeMode => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved as ThemeMode;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    
    if (typeof window === "undefined") return () => {};

    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY) listener();
    };
    
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      if (localStorage.getItem(THEME_KEY) == null) listener();
    };

    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onMedia);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", onMedia);
    };
  };

  const set = (next: ThemeMode) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(THEME_KEY, next);
    listeners.forEach((l) => l());
  };

  const toggle = () => {
    const next = getClientSnapshot() === "dark" ? "light" : "dark";
    set(next);
  };

  return { getServerSnapshot, getClientSnapshot, subscribe, set, toggle };
}

export const themeStore = createThemeStore();
