## `styles/blur.ts`

```ts
export const blur = {
  sm: "var(--tb-blur-sm)",
  md: "var(--tb-blur-md)",
  lg: "var(--tb-blur-lg)",
  xl: "var(--tb-blur-xl)",
  glass: "var(--tb-glass-blur)",
} as const;
export type BlurToken = keyof typeof blur;

```

---

## `styles/colors.css`

```css
/* Re-export tokens.css – keeps @import path stable for legacy imports */
@import "./tokens.css";

```

---

## `styles/effects.ts`

```ts
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

```

---

## `styles/fonts.ts`

```ts
// Re-export centralized font – single source of truth
// Kalameh – local WOFF2 – /public/fonts/KalamehWebFaNum-*.woff2
// Fallback to Vazirmatn provided via @fontsource files copied to public/fonts

export { kalameh } from "@/config/fonts";
// keep alias for legacy @/lib/fonts imports:
export { kalameh as default } from "@/config/fonts";

```

---

## `styles/globals.css`

```css
@import "tailwindcss";

/* TechBox – black → blue – matches cube logo */
@theme inline {
  --font-sans: var(--font-kalameh);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}

:root{
  --background: #f7f9ff;
  --foreground: #0b1428;
  --primary: #1e3a8a;
  --primary-foreground: #ffffff;
  --secondary: #dbeafe;
  --secondary-foreground: #1e3a8a;
  --muted: #eef2ff;
  --muted-foreground: #475569;
  --border: #c7d2fe;
  --ring: #3b82f6;
  --card: #ffffff;
  --card-foreground: #0b1428;
  --brand: #2563eb;
}
.dark{
  --background: #050a14;
  --foreground: #e6edff;
  --primary: #60a5fa;
  --primary-foreground: #05122a;
  --secondary: #0d1a33;
  --secondary-foreground: #c7dfff;
  --muted: #0f172a;
  --muted-foreground: #8aa0c7;
  --border: #1e2d4d;
  --ring: #3b82f6;
  --card: #0b152a;
  --card-foreground: #e6edff;
  --brand: #3b82f6;
}

*{box-sizing:border-box}
html{font-family:var(--font-kalameh),Vazirmatn,system-ui,sans-serif; direction:rtl}
body{
  margin:0; background:var(--background); color:var(--foreground);
  min-height:100dvh;
  /* TechBox black → blue cinematic – matches logo */
  background-image:
    radial-gradient(ellipse 90% 70% at 50% -5%, rgba(37,99,235,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 15%, rgba(14,165,233,0.10) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 15% 30%, rgba(30,58,138,0.16) 0%, transparent 50%),
    linear-gradient(170deg, #020617 0%, #081229 35%, #0b1a3a 65%, #0a0f1f 100%);
  background-attachment:fixed;
  background-repeat:no-repeat;
}
.dark body{
  background-image:
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(37,99,235,0.22) 0%, transparent 60%),
    radial-gradient(ellipse 70% 50% at 80% 10%, rgba(14,165,233,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 60% 45% at 15% 30%, rgba(30,64,175,0.20) 0%, transparent 55%),
    linear-gradient(165deg, #020617 0%, #071230 30%, #0b1e4a 60%, #050a14 100%);
}
h1{font-size:clamp(1.6rem,3.5vw,2.25rem); font-weight:900; line-height:1.35; margin:0}
h2{font-size:clamp(1.3rem,2.5vw,1.75rem); font-weight:800}
h3{font-size:clamp(1.05rem,1.8vw,1.25rem); font-weight:700}
p,li{font-size:14px; line-height:1.9; color:var(--muted-foreground)}
small,.text-xs{font-size:11.5px}
.text-sm{font-size:13px}

/* primitives – Tailwind 4 safe, no @apply */
.card{ background:var(--card); color:var(--card-foreground); border:1px solid var(--border); border-radius:1.25rem; padding:1rem; box-shadow:0 6px 28px rgba(2,8,23,.10); }
.dark .card{ box-shadow:0 8px 36px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.035); }
.badge{ display:inline-flex; align-items:center; gap:.3em; border-radius:9999px; padding:2px 10px; font-size:11px; font-weight:600; background:var(--secondary); color:var(--secondary-foreground); border:1px solid var(--border); }
.btn{ display:inline-flex; align-items:center; justify-content:center; gap:.45rem; border-radius:.8rem; padding:.58rem .95rem; font-weight:700; font-size:13px; cursor:pointer; transition:.15s; border:1px solid transparent; }
.btn-primary{ background:var(--primary); color:var(--primary-foreground); }
.btn-primary:hover{ filter:brightness(1.07); transform:translateY(-1px); }
.btn-ghost{ background:transparent; border-color:var(--border); color:var(--foreground); }
.btn-ghost:hover{ background:var(--muted); }
.input, .textarea, select.input{
  width:100%; background:var(--muted); border:1px solid var(--border);
  border-radius:.6rem; padding:.6rem .85rem; color:var(--foreground); font-size:13px; outline:none;
}
.input:focus, .textarea:focus, select.input:focus{ border-color:var(--ring); box-shadow:0 0 0 3px rgba(59,130,246,.18); }
.textarea{ min-height:120px; resize:vertical; }

/* hero */
.hero-title{ font-size:clamp(3rem,8vw,6.2rem); font-weight:900; line-height:1.1;
  background:linear-gradient(135deg,#ffffff 0%, #60a5fa 35%, #1d4ed8 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.dark .hero-title{ background:linear-gradient(135deg,#e6f0ff 0%, #60a5fa 45%, #93c5fd 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }

/* ticker */
@keyframes ticker-rtl { from{transform:translateX(0)} to{transform:translateX(50%)} }
.ticker-wrapper{ overflow:hidden; -webkit-mask-image:linear-gradient(to left,transparent,black 8%,black 92%,transparent); mask-image:linear-gradient(to left,transparent,black 8%,black 92%,transparent);}
.ticker-track{ display:flex; width:max-content; gap:2.5rem; animation: ticker-rtl 28s linear infinite; }
.ticker-track:hover{ animation-play-state:paused; }

/* utilities */
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

/* z-index system – fixes login modal behind feeds */
.z-nav { z-index: 50; }
.z-fab { z-index: 60; }
.z-overlay { z-index: 400; }
.z-modal { z-index: 500; }
.z-toast { z-index: 600; }

/* sidebar collapsed icon rail helpers */
.icon-rail-btn{ width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:10px; color:var(--muted-foreground); transition:.15s;}
.icon-rail-btn:hover{ background:var(--muted); color:var(--foreground); }

/* responsive type scale – TV / 4K */
@media (min-width: 1920px){
  html{ font-size:17px; }
  .container-7xl{ max-width:1600px; }
}
@media (min-width: 2560px){
  html{ font-size:18px; }
  .container-7xl{ max-width:1800px; }
}

```

---

## `styles/index.ts`

```ts
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

```

---

## `styles/motion.ts`

```ts
// Framer Motion – central tokens – Next 16 / React 19
// No Tailwind / no DOM – pure JS – safe to import in hooks/services

export const duration = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.22,
  slow: 0.34,
  slower: 0.52,
} as const; // seconds – matches --tb-duration-*

export const ease = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  out: [0, 0, 0.38, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.standard },
  normal: { duration: duration.normal, ease: ease.standard },
  slow: { duration: duration.slow, ease: ease.emphasized },
};

// Framer Motion variants – reusable
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transition.normal,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: transition.normal,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: transition.fast,
};

export const hoverScale = {
  whileHover: { scale: 1.015, y: -2 },
  whileTap: { scale: 0.99 },
  transition: transition.fast,
};

export const slideIn = fadeInUp;
export const slideInLeft = { initial:{opacity:0,x:-24}, animate:{opacity:1,x:0}, exit:{opacity:0,x:-24}, transition: transition.normal };
export const slideInRight = { initial:{opacity:0,x:24}, animate:{opacity:1,x:0}, exit:{opacity:0,x:24}, transition: transition.normal };

```

---

## `styles/radius.ts`

```ts
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

```

---

## `styles/shadows.ts`

```ts
export const shadows = {
  sm: "var(--tb-shadow-sm)",
  DEFAULT: "var(--tb-shadow)",
  md: "var(--tb-shadow-md)",
  lg: "var(--tb-shadow-lg)",
  glow: "var(--tb-shadow-glow)",
  none: "none",
} as const;
export type ShadowToken = keyof typeof shadows;

```

---

## `styles/tokens.css`

```css
/* TechBox Design Tokens – single source of truth
   OKLCH – Persian RTL – matches /public/logo.png black→blue */
:root {
  /* — Brand — */
  --tb-brand: oklch(0.62 0.21 255);
  --tb-brand-foreground: oklch(0.98 0.005 255);
  --tb-brand-dim: oklch(0.62 0.21 255 / 0.14);

  /* — Semantic – light — */
  --tb-background: oklch(0.985 0.006 270);
  --tb-foreground: oklch(0.18 0.025 270);
  --tb-surface-1: oklch(0.96 0.012 270);
  --tb-surface-2: oklch(0.92 0.015 270);
  --tb-muted: oklch(0.94 0.010 270);
  --tb-muted-foreground: oklch(0.50 0.025 270);
  --tb-border: oklch(0.88 0.018 270);
  --tb-ring: oklch(0.55 0.20 260);
  --tb-card: oklch(1 0 0);
  --tb-card-foreground: oklch(0.18 0.025 270);
  --tb-popover: oklch(1 0 0);
  --tb-popover-foreground: oklch(0.18 0.025 270);

  /* — Module accent tokens — */
  --tb-blog:    oklch(0.70 0.17 52);   /* orange */
  --tb-news:    oklch(0.64 0.22 25);   /* rose */
  --tb-media:   oklch(0.82 0.15 85);   /* amber */
  --tb-shop:    oklch(0.80 0.19 125);  /* lime */
  --tb-tools:   oklch(0.82 0.12 200);  /* cyan */
  --tb-forum:   oklch(0.78 0.16 5);    /* rose-300 */
  --tb-review:  oklch(0.70 0.17 240);  /* sky */
  --tb-download: oklch(0.72 0.20 350);
  --tb-home:    oklch(0.62 0.22 290);  /* violet */
  --tb-account: oklch(0.80 0.12 15);   /* red-200 */

  /* — Radius — */
  --tb-radius-xs: 6px;
  --tb-radius-sm: 8px;
  --tb-radius-md: 12px;
  --tb-radius-lg: 16px;
  --tb-radius-xl: 20px;
  --tb-radius-2xl: 24px;
  --tb-radius-full: 9999px;

  /* — Elevation / Shadow — */
  --tb-shadow-sm: 0 1px 3px rgba(2,8,23,.06), 0 1px 2px rgba(2,8,23,.04);
  --tb-shadow: 0 4px 16px rgba(2,8,23,.08), 0 2px 6px rgba(2,8,23,.05);
  --tb-shadow-md: 0 8px 28px rgba(2,8,23,.10), 0 3px 10px rgba(2,8,23,.06);
  --tb-shadow-lg: 0 16px 44px rgba(2,8,23,.14), 0 6px 16px rgba(2,8,23,.08);
  --tb-shadow-glow: 0 0 24px rgba(59,130,246,.22), 0 0 72px rgba(14,165,233,.10);

  /* — Blur — */
  --tb-blur-sm: 6px;
  --tb-blur-md: 12px;
  --tb-blur-lg: 20px;
  --tb-blur-xl: 28px;
  --tb-glass-blur: 18px;

  /* — Motion — */
  --tb-duration-instant: 80ms;
  --tb-duration-fast: 150ms;
  --tb-duration-normal: 220ms;
  --tb-duration-slow: 340ms;
  --tb-duration-slower: 520ms;
  --tb-ease-standard: cubic-bezier(.2,.8,.2,1);
  --tb-ease-emphasized: cubic-bezier(.2,0,0,1);
  --tb-ease-out: cubic-bezier(0,0,.38,1);
  --tb-ease-in-out: cubic-bezier(.4,0,.2,1);

  /* — Typography scale — */
  --tb-text-2xs: 0.6875rem; /*11px*/
  --tb-text-xs: 0.75rem;    /*12px*/
  --tb-text-sm: 0.8125rem;  /*13px*/
  --tb-text-base: 0.875rem; /*14px*/
  --tb-text-md: 1rem;       /*16px*/
  --tb-text-lg: 1.125rem;   /*18px*/
  --tb-text-xl: 1.25rem;    /*20px*/
  --tb-text-2xl: 1.5rem;    /*24px*/
  --tb-text-3xl: 1.875rem;  /*30px*/
  --tb-text-4xl: 2.25rem;   /*36px*/
  --tb-text-5xl: 3rem;      /*48px*/

  --tb-leading-tight: 1.25;
  --tb-leading-snug: 1.45;
  --tb-leading-normal: 1.7;
  --tb-leading-relaxed: 1.95;

  --tb-weight-regular: 400;
  --tb-weight-medium: 500;
  --tb-weight-semibold: 600;
  --tb-weight-bold: 700;
  --tb-weight-extrabold: 800;
  --tb-weight-black: 900;

  /* — Focus ring — */
  --tb-focus-ring: 0 0 0 3px rgba(59,130,246,.35);
}

/* DARK – TechBox cube – #020617 → #0b1e4a */
.dark {
  --tb-background: #050a14;
  --tb-foreground: #e6edff;
  --tb-surface-1: #0f172a;
  --tb-surface-2: #12223f;
  --tb-muted: #0f172a;
  --tb-muted-foreground: #8aa0c7;
  --tb-border: #1e2d4d;
  --tb-ring: #60a5fa;
  --tb-card: #0b152a;
  --tb-card-foreground: #e6edff;
  --tb-popover: #0b152a;
  --tb-popover-foreground: #e6edff;

  --tb-brand: #60a5fa;
  --tb-brand-dim: rgba(96,165,250,.18);

  /* module accents – dark tuned */
  --tb-blog:    #fb923c;
  --tb-news:    #fb7185;
  --tb-media:   #fcd34d;
  --tb-shop:    #a3e635;
  --tb-tools:   #67e8f9;
  --tb-forum:   #fda4af;
  --tb-review:  #38bdf8;
  --tb-download:#f472b6;
  --tb-home:    #a78bfa;
  --tb-account: #fca5a5;

  --tb-shadow-sm: 0 1px 3px rgba(0,0,0,.30), 0 1px 2px rgba(0,0,0,.22);
  --tb-shadow: 0 6px 24px rgba(0,0,0,.38), 0 2px 8px rgba(0,0,0,.24);
  --tb-shadow-md: 0 10px 36px rgba(0,0,0,.42), 0 4px 12px rgba(0,0,0,.28);
  --tb-shadow-lg: 0 20px 60px rgba(0,0,0,.5), 0 8px 20px rgba(0,0,0,.32);
  --tb-shadow-glow: 0 0 28px rgba(59,130,246,.28), 0 0 80px rgba(14,165,233,.14);
  --tb-glass-blur: 24px;
}

```

---

## `styles/typography.ts`

```ts
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

```

---

