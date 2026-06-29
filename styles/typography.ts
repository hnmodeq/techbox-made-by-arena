export const fontSize = {
  "2xs": "var(--tb-text-2xs)",
  xs: "var(--tb-text-xs)",
  sm: "var(--tb-text-sm)",
  base: "var(--tb-text-base)",
  md: "var(--tb-text-md)",
  lg: "var(--tb-text-lg)",
  xl: "var(--tb-text-xl)",
  "2xl": "var(--tb-text-2xl)",
  "3xl": "var(--tb-text-3xl)",
  "4xl": "var(--tb-text-4xl)",
  "5xl": "var(--tb-text-5xl)",
} as const;

export const lineHeight = {
  tight: "var(--tb-leading-tight)",
  snug: "var(--tb-leading-snug)",
  normal: "var(--tb-leading-normal)",
  relaxed: "var(--tb-leading-relaxed)",
} as const;

export const fontWeight = {
  regular: "var(--tb-weight-regular)",
  medium: "var(--tb-weight-medium)",
  semibold: "var(--tb-weight-semibold)",
  bold: "var(--tb-weight-bold)",
  extrabold: "var(--tb-weight-extrabold)",
  black: "var(--tb-weight-black)",
} as const;

export const type = {
  "heading-1": "text-[clamp(1.6rem,3.5vw,2.25rem)] font-black leading-tight tracking-tight",
  "heading-2": "text-[clamp(1.3rem,2.5vw,1.75rem)] font-extrabold leading-snug",
  "heading-3": "text-[clamp(1.05rem,1.8vw,1.25rem)] font-bold",
  "body": "text-[14px] leading-[1.9]",
  "body-sm": "text-[13px] leading-[1.8]",
  "meta": "text-[11px] leading-[1.6]",
  "caption": "text-[11.5px] leading-[1.5]",
} as const;
