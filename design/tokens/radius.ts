export const radius = {
  xs: "var(--tb-radius-xs)",
  sm: "var(--tb-radius-sm)",
  md: "var(--tb-radius-md)",
  lg: "var(--tb-radius-lg)",
  xl: "var(--tb-radius-xl)",
  "2xl": "var(--tb-radius-2xl)",
  full: "var(--tb-radius-full)",
} as const;

export type RadiusToken = keyof typeof radius;
