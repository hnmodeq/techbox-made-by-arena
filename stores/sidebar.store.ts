import { DESKTOP_KEY, MOBILE_KEY } from "@/config/sidebar.config";
function createBoolStore(key: string, defaultValue: boolean) {
  const listeners = new Set<() => void>();
  const getSnapshot = () => {
    if (typeof window === "undefined") return defaultValue;
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : raw === "true";
  };
  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    const onStorage = (e: StorageEvent) => { if (e.key === key) fn(); };
    if(typeof window !== "undefined"){
      window.addEventListener("storage", onStorage);
      return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
    }
    return ()=>{listeners.delete(fn)};
  };
  const set = (value: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, String(value));
    listeners.forEach((l) => l());
  };
  return { getSnapshot, subscribe, set };
}
export const desktopStore = createBoolStore(DESKTOP_KEY, true);
export const mobileStore = createBoolStore(MOBILE_KEY, false);
