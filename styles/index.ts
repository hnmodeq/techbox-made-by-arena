// TechBox – Central token exports – TS safe
export * from "./radius";
export * from "./shadows";
export * from "./blur";
export * from "./typography";
export * from "./motion";
export * from "./effects";

// CSS variable names – typed helper
export const cssVar = {
  // color
  background: "var(--tb-background)",
  foreground: "var(--tb-foreground)",
  primary: "var(--tb-brand)",
  primaryForeground: "var(--tb-brand-foreground)",
  muted: "var(--tb-muted)",
  mutedForeground: "var(--tb-muted-foreground)",
  border: "var(--tb-border)",
  card: "var(--tb-card)",
  // modules
  blog: "var(--tb-blog)",
  news: "var(--tb-news)",
  media: "var(--tb-media)",
  shop: "var(--tb-shop)",
  tools: "var(--tb-tools)",
  forum: "var(--tb-forum)",
  review: "var(--tb-review)",
  download: "var(--tb-download)",
  // motion
  durationFast: "var(--tb-duration-fast)",
  durationNormal: "var(--tb-duration-normal)",
  easeStandard: "var(--tb-ease-standard)",
  // radius
  radiusSm: "var(--tb-radius-sm)",
  radiusMd: "var(--tb-radius-md)",
  radiusLg: "var(--tb-radius-lg)",
  radiusXl: "var(--tb-radius-xl)",
  // shadow / blur
  shadow: "var(--tb-shadow)",
  shadowMd: "var(--tb-shadow-md)",
  shadowGlow: "var(--tb-shadow-glow)",
  blurGlass: "var(--tb-glass-blur)",
} as const;
