# TechBox – تکباکس

Next.js 14 App Router, RTL Persian, Tailwind OKLCH theme.

Scaffolded from your dump on 2026-06-28. All entities unescaped, import typos fixed.

```
app/
  page.tsx              # Hero + Ticker + Modules
  blog/page.tsx
  news/page.tsx
  media/page.tsx
  shop/page.tsx
  tools/page.tsx
  forum/page.tsx
  review/page.tsx
  download/page.tsx
  about / contact / consultation / workwithus / account / admin
components/
  bento-card.tsx
  layout-shell.tsx
  sections/
    hero-section.tsx
    home-modules-section.tsx
    home-news-ticker-section.tsx
    blog-section.tsx
    footer-section.tsx
    sidebar-section.tsx
  sidebar/
    SidebarShell.tsx
    SidebarContent.tsx
    SidebarTooltip.tsx
    sidebar.config.ts
    sidebar.store.ts
    theme.store.ts
    useFabTop.ts
    sidebar.types.ts
lib/
  module-colors.ts
  modules.ts
  fonts.ts (Kalameh variable)
  utils.ts
data/news.json
```

Run:
```
npm i
npm run dev
```

Notes / fixes applied while scaffolding:
- Fixed malformed imports: `@/components/sidebar/[sidebar.store]` → `sidebar.store`, `[theme.store]` → `theme.store`
- Fixed `moduleColors.blog` accesses (prompt had `[moduleColors.blog]`)
- Fixed `posts.map` / `post.id` JSX escaping
- Fixed `isActive`: `pathname.startsWith\`${href}/\`` → `pathname.startsWith(\`${href}/\`)`
- globals.css: `&amp;:is` → `&:is`, z-index body::before -1
- Footer social hrefs cleaned

Known TODOs in your code:
- hero-title-fill has `z-index: -1` – will hide under body
- /admin/posts and /admin/posts/new pages missing (links exist)
- blog-section uses `.card` / `.badge` classes not defined in globals.css
- logo.png / /assets/blog-* images not in repo yet
- tools page title typo «ابزراها»

Ready – tell me what to build first.
