// Re-export centralized font – single source of truth
// Kalameh – local WOFF2 – /public/fonts/KalamehWebFaNum-*.woff2
// Fallback to Vazirmatn provided via @fontsource files copied to public/fonts

export { kalameh } from "@/config/fonts";
// keep alias for legacy @/lib/fonts imports:
export { kalameh as default } from "@/config/fonts";
