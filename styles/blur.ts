export const blur = {
  sm: "var(--tb-blur-sm)",
  md: "var(--tb-blur-md)",
  lg: "var(--tb-blur-lg)",
  xl: "var(--tb-blur-xl)",
  glass: "var(--tb-glass-blur)",
} as const;
export type BlurToken = keyof typeof blur;
