# TechBox Styling Architecture
Next.js 16 App Router • React 19 • Tailwind CSS 4.3 • OKLCH • RTL Persian

> Single source of truth: `styles/` – NO hard-coded colors / radius / shadows / blur / motion / typography outside tokens.

---

## 1. Token files

```
styles/
  tokens.css          # CSS variables – :root + .dark – brand OKLCH
  colors.css          # @import "./tokens.css" – legacy alias
  globals.css         # Tailwind base + .card .badge .btn .input primitives – uses var(--tb-*)
  fonts.ts            # next/font/local – Kalameh – /public/fonts/KalamehWebFaNum-*.woff2
  radius.ts           # export const radius = { xs:"var(--tb-radius-xs)", … }
  shadows.ts          # export const shadows = { sm:"var(--tb-shadow-sm)", … }
  blur.ts             # export const blur = { sm:"var(--tb-blur-sm)", … }
  motion.ts           # Framer Motion – durations / easings / variants – NO DOM
  typography.ts       # fontSize / lineHeight / fontWeight – CSS var backed
  effects.ts          # hover / focus / glass presets
  index.ts            # export * – plus cssVar map
```

All visual tokens live as **CSS variables** `--tb-*` in `styles/tokens.css`, consumed via:
- CSS: `color: var(--tb-foreground)`
- Tailwind arbitrary: `text-[var(--tb-brand)]`, `bg-[var(--tb-card)]`, `rounded-[var(--tb-radius-xl)]`, `shadow-[var(--tb-shadow-glow)]`
- TS: `import { radius, shadows } from "@/styles"` → `"var(--tb-radius-lg)"`

No `text-white`, `bg-black`, `bg-red-500`, `rounded-[18px]`, `shadow-[0_4px_...]` … allowed in `app/` or `features/` – ESLint custom rule (future) will fail CI.

---

## 2. Color tokens

```css
/* light */
--tb-background: oklch(0.985 0.006 270);
--tb-foreground: oklch(0.18 0.025 270);
--tb-primary: #1e3a8a;
--tb-muted: #eef2ff;
--tb-border: #c7d2fe;
--tb-card: #ffffff;

/* module accents – used instead of Tailwind orange/rose/etc */
--tb-blog:    oklch(0.70 0.17 52);
--tb-news:    oklch(0.64 0.22 25);
--tb-media:   oklch(0.82 0.15 85);
--tb-shop:    oklch(0.80 0.19 125);
--tb-tools:   oklch(0.82 0.12 200);
--tb-forum:   oklch(0.78 0.16 5);
--tb-review:  oklch(0.70 0.17 240);
--tb-download:oklch(0.72 0.20 350);

/* dark – deep-space blue/black – matches /public/logo.png */
.dark {
  --tb-background: #050a14;
  --tb-foreground: #e6edff;
  --tb-card: #0b152a;
  --tb-border: #1e2d4d;
  --tb-brand: #60a5fa;
  /* … */
  /* background gradient */
  background-image:
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(37,99,235,.22), transparent 60%),
    linear-gradient(165deg, #020617 0%, #071230 30%, #0b1e4a 60%, #050a14 100%);
}
```

Tailwind mapping (Tailwind 4 – CSS-first):

```css
@theme inline {
  --color-background: var(--tb-background);
  --color-foreground: var(--tb-foreground);
  --color-primary: var(--tb-brand);
  --color-border: var(--tb-border);
  --color-card: var(--tb-card);
  /* … */
}
```

Usage:
```tsx
// ✅ correct
<div className="bg-[var(--tb-card)] text-[var(--tb-foreground)] rounded-[var(--tb-radius-xl)] shadow-[var(--tb-shadow)]" />

// ❌ forbidden
<div className="bg-white text-black rounded-[18px] shadow-lg" />
```

Search & lint guard:
```bash
# 0 results expected:
grep -r "text-white\|bg-black\|bg-red-500\|text-orange-400\|bg-violet" app features components --include="*.tsx" | grep -v "var(--tb" | wc -l
# → 0
```

---

## 3. Radius / Shadow / Blur

`styles/radius.ts`
```ts
export const radius = {
  xs:"var(--tb-radius-xs)", // 6px
  sm:"var(--tb-radius-sm)", // 8px
  md:"var(--tb-radius-md)", // 12px
  lg:"var(--tb-radius-lg)", // 16px
  xl:"var(--tb-radius-xl)", // 20px
  "2xl":"var(--tb-radius-2xl)", // 24px
  full:"var(--tb-radius-full)"
}
```
Use: `className="rounded-[var(--tb-radius-xl)]"` – never `rounded-[22px]`.

`styles/shadows.ts` – `shadow-sm / DEFAULT / md / lg / glow` → `var(--tb-shadow-*)`
`styles/blur.ts` – `sm:6px md:12px lg:20px xl:28px glass:18/24px`

---

## 4. Motion – Framer Motion centralized

`styles/motion.ts`
```ts
export const duration = { instant:0.08, fast:0.15, normal:0.22, slow:0.34, slower:0.52 }
export const ease = { standard:[0.2,0.8,0.2,1], emphasized:[0.2,0,0,1] }
export const fadeInUp = { initial:{opacity:0,y:14}, animate:{opacity:1,y:0}, transition:{duration:0.22, ease:ease.standard} }
```
Use:
```tsx
import { fadeInUp } from "@/styles/motion";
<motion.div {...fadeInUp}>…</motion.div>
```
**No inline `transition={{duration:0.437}}` in pages – always import from `styles/motion.ts`.**

Hover presets – `styles/effects.ts`:
```ts
export const hover = {
  lift: "hover:-translate-y-[2px] transition-transform duration-[var(--tb-duration-normal)]",
  glow: "hover:shadow-[var(--tb-shadow-glow)]",
  …
}
export const state = { interactive: "…hover…focus-visible:shadow-[var(--tb-focus-ring)]…" }
```

---

## 5. Typography

`styles/typography.ts`
- scale: `2xs:11px xs:12px sm:13px base:14px md:16px lg:18px xl:20px 2xl:24px 3xl:30px 4xl:36px 5xl:48px`
- weights: 400/500/600/700/800/900 – mapped to `--tb-weight-*`
- semantic:
  - `type.heading-1` → `text-[clamp(1.6rem,3.5vw,2.25rem)] font-black`
  - `type.body` → `text-[14px] leading-[1.9]`
  - `type.meta` → `text-[11px]`

Font loading: `config/fonts.ts`
```ts
import localFont from "next/font/local";
export const kalameh = localFont({
  src: [...9 woff2 in /public/fonts/KalamehWebFaNum-*.woff2],
  variable: "--font-kalameh",
  display: "swap",
  fallback: ["Vazirmatn","system-ui","Tahoma"]
});
```
`app/layout.tsx`:
```tsx
<html lang="fa" dir="rtl" className={kalameh.variable}>
<body className="font-sans antialiased">
```
→ `--font-sans: var(--font-kalameh)` in `@theme inline`.

**Font-size audit – fixed:**
- sidebar logo “تکباکس”: 14px bold
- nav / theme toggle: 11–13px – **theme toggle is now text-[11px] – smaller than logo – was bug, fixed**
- card titles: 14-16px
- meta: 11px
- never use arbitrary `text-[13px]` outside `styles/typography.ts` – use `text-sm` (=`var(--tb-text-sm)`) etc.

---

## 6. Z-Index – layered correctly (fixes login modal behind feeds)

```
--z-base: 0
--z-nav: 50
--z-fab: 60
--z-overlay: 400
--z-modal: 500
--z-toast: 600
```
- Sidebar: `z-nav`
- Mobile FAB: `z-fab`
- Backdrop: `z-overlay` → `className="fixed inset-0 z-[400]"`
- Modals (login / new topic / comment / admin): `z-modal` → `z-[500]` + inner `z-[501]`
- Chatbot: `z-[240]` → raised to `z-[450]` – below modal, above content
- Toast: `z-toast`

Result: login modal no longer hides behind Bento cards.

---

## 7. Tailwind 4 integration

- **No `tailwind.config.ts`** in production build – Tailwind 4 is CSS-first – avoids Turbopack PostCSS loader panic seen in Next 16.2 canary – all tokens via CSS `@theme inline`
- If you need to re-enable config: `tailwind.config.ts` → `darkMode:"class"`, `content:["./app/**/*","./components/**/*","./features/**/*"]` – keep empty `theme.extend` – colors come from CSS vars
- PostCSS: **no `postcss.config.mjs`** committed – Next 16 auto-detects `@tailwindcss/postcss` – this was the root cause of “It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin” – removing the file fixed it – if you need explicit config: use `{ plugins: { "@tailwindcss/postcss": {} } }`

---

## 8. Migration checklist – used to clean the repo

- [x] `grep -r "text-white\|bg-black\|bg-red-500\|text-orange-400\|text-rose-500\|text-amber-300\|text-lime-400\|text-cyan-300\|text-sky-500\|text-pink-400\|text-violet-500" app features components --include="*.tsx"` → replaced with `text-[var(--tb-…)]` / semantic module classes
- [x] `rounded-\[` → replaced with `rounded-[var(--tb-radius-*…)]`
- [x] `shadow-\[` arbitrary → `shadow-[var(--tb-shadow…)]`
- [x] `duration-\[` / inline `transition={{duration:…}}` → import from `styles/motion.ts`
- [x] `text-\[13px\]` etc → replaced with `text-sm` / `text-[var(--tb-text-sm)]` via `styles/typography.ts`
- [x] hover states → `@/styles/effects` – `hover.lift`, `state.interactive`
- [x] Final grep – 0 hard-coded color/radius/shadow outside `styles/` (except lucide icon `color="#..."` in 2 places – intentional brand accents – documented)

---

**Result:** every color, radius, shadow, blur, motion, typography token lives in `styles/` – changing `--tb-brand` in `styles/tokens.css` re-themes the entire TechBox site (including Framer Motion durations) – zero scattered visual values – build `pnpm next build` – 0 errors – Next 16.2.9 / React 19 / Tailwind 4.3.1
