/**
 * Visual effect presets – hover / focus / active – all token-driven
 * Import in UI components – never hard-code hover colors in pages
 */
export const hover = {
  lift: "hover:-translate-y-[2px] transition-transform duration-[var(--tb-duration-normal)]",
  liftSm: "hover:-translate-y-[1px] transition-transform duration-[var(--tb-duration-fast)]",
  glow: "hover:shadow-[var(--tb-shadow-glow)] transition-shadow duration-[var(--tb-duration-normal)]",
  brighten: "hover:brightness-[1.06] transition-[filter] duration-[var(--tb-duration-fast)]",
  fade: "hover:opacity-90 transition-opacity duration-[var(--tb-duration-fast)]",
} as const;

export const focus = {
  ring: "focus-visible:outline-none focus-visible:shadow-[var(--tb-focus-ring)] focus-visible:ring-0",
} as const;

export const press = {
  scaleDown: "active:scale-[0.985] transition-transform duration-[var(--tb-duration-instant)]",
} as const;

export const glass = "backdrop-blur-[var(--tb-glass-blur)] bg-[color-mix(in_oklch,var(--tb-card)_72%,transparent)] border border-[color-mix(in_oklch,var(--tb-border)_80%,transparent)]";

export const state = {
  // combine: hover + focus + press
  interactive: [
    hover.liftSm,
    hover.brighten,
    focus.ring,
    press.scaleDown,
    "transition-all",
    "duration-[var(--tb-duration-normal)]",
    "ease-[var(--tb-ease-standard)]",
  ].join(" "),
};
