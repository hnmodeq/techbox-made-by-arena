export const shadows = {
  sm: "var(--tb-shadow-sm)",
  DEFAULT: "var(--tb-shadow)",
  md: "var(--tb-shadow-md)",
  lg: "var(--tb-shadow-lg)",
  glow: "var(--tb-shadow-glow)",
  none: "none",
} as const;
export type ShadowToken = keyof typeof shadows;
