# TechBox – Architecture v4
Next.js 16.2.9 (App Router) • React 19 • Tailwind CSS 4.3.1 • Framer Motion 12 • Prisma 6.7 • TypeScript 6 • pnpm

RTL Persian – IT community / media platform – تکباکس – پاتوق بچه‌های فناوری اطلاعات

---

## Folder layout

```
app/
  layout.tsx              # Root – <html lang="fa" dir="rtl"> + Vazirmatn/Kalameh variable
  globals.css  →  re-export → styles/globals.css
  page.tsx                # Home feed – composes features/home
  (public)/               # marketing routes – no auth wall
    blog/
      page.tsx            # → features/blog
      [slug]/page.tsx
    news/
    media/
    review/
    shop/
      checkout/page.tsx
    tools/
      raid-calculator/page.tsx
      subnet-calculator/page.tsx
    download/
    forum/
    about/
    contact/
    consultation/
    workwithus/
      [slug]/page.tsx
  (dashboard)/
    admin/
      page.tsx
      login/page.tsx
      posts/page.tsx
      posts/new/page.tsx
      roles/page.tsx
    account/page.tsx
  api/
    auth/login|me|logout/route.ts   # jose JWT – httpOnly tb_session
    posts/route.ts                  # GET list / POST create – RBAC
    like/route.ts
    comments/route.ts
    comments/vote/route.ts
    chat/route.ts                   # OpenAI-compatible proxy – CHAT_API_KEY / CHAT_BASE_URL
    pay/zarinpal/request|verify/route.ts

components/
  ui/              # atomic, framework-agnostic – NO domain imports
    Button.tsx
    Card.tsx
    Badge.tsx
    Input.tsx
    LikeButton.tsx       # Lucide Heart 20px + Eye – POST /api/like
  layout/
    LayoutShell.tsx      # <CartProvider> + <SidebarMain> + <Footer> + <Chatbot>
    Header.tsx
    Footer.tsx           # moved from components/sections/footer-section.tsx
    Sidebar.tsx          # (re-export)
  common/
    BentoCard.tsx
    ContentCard.tsx
    ContentDetail.tsx → moved to features/content
  animations/
    FadeIn.tsx
    SlideIn.tsx
    MotionSection.tsx    # framer-motion wrappers – UI boundary only

features/
  # each feature = components / hooks / services / types – single responsibility
  home/
    components/
      HeroSection.tsx       # framer-motion rotator
      HomeModulesSection.tsx # Bento feed – 7 modules, no tools card
  blog/
    components/BlogGrid.tsx # square 1:1 image cards
    types/post.ts
  news/
    components/
      NewsList.tsx          # RIGHT: main news image cards • LEFT: force-news timeline
      NewsTicker.tsx
  media/
    components/
      MediaGallery.tsx
      VideoPlayer.tsx       # hls.js – MP4 + .m3u8 fallback
  review/
    components/ReviewGrid.tsx  # square, author avatar, ★ rating
  shop/
    components/ShopGrid.tsx
    hooks/cart-context.tsx     # CartProvider – React 19 Context
    components/CheckoutForm.tsx
  tools/
    components/
      ToolsGrid.tsx
      RaidCalculator.tsx       # real – RAID 0/1/5/6/10
      SubnetCalculator.tsx
  forum/
    components/ForumList.tsx   # Reddit-style – vote ▲▼, avatar, solved badge
    components/NewTopicModal.tsx
  download/
    components/
      DownloadTable.tsx        # brand/type/OS filter
      DownloadDetail.tsx       # OS chooser + version table date-sorted
  content/
    components/
      ContentCard.tsx
      ContentDetail.tsx
      SuggestionGrid.tsx       # cross-module related – tag scoring
      ModuleList.tsx
  comment/
    components/
      CommentSection.tsx       # Server Action + fetch fallback – nested replies
      CommentVote.tsx
  auth/
    components/LoginForm.tsx
    hooks/useAuth.ts
    services/auth.client.ts
  admin/
    components/
      PostTable.tsx
      RoleEditor.tsx
    hooks/useRBAC.ts
  chat/
    components/Chatbot.tsx     # floating FAB – bottom-left – Persian RTL
  search/
    components/SearchResults.tsx
  layout/
    components/
      SidebarMain.tsx
      SidebarShell.tsx
      SidebarContent.tsx
      SidebarTooltip.tsx
    hooks/useFabTop.ts
    types/sidebar.types.ts
    config/sidebar.config.ts

hooks/                 # cross-feature generic
  useMediaQuery.ts
  useLocalStorage.ts
  useFabTop.ts         # moved from components/sidebar

lib/
  db.ts                # prisma singleton
  auth-server.ts       # jose JWT – server only – NO UI
  content.ts           # getModuleItems(), getLatest(), getRelated(), searchAcross()
  utils.ts             # cn()
  api/
    client.ts          # fetch wrapper – no UI

config/
  site.config.ts
  modules.config.ts    # was lib/modules.ts
  module-colors.ts     # Tailwind color tokens per module
  routes.config.ts
  fonts.ts             # moved from lib/fonts.ts – next/font/local

styles/
  globals.css          # Tailwind 4 – @import "tailwindcss"; – black→blue OKLCH gradient matching /public/logo.png
  /* NO @apply in base layer that crashes Turbopack – all utilities are plain CSS variables */

prisma/
  schema.prisma        # User, Post, Comment (self-relation), Like, CommentVote
  seed.ts              # imports data/*.json → SQLite – 8 modules – 6 editor users – password: techbox123

data/
  blog.json
  news.json            # now with "source" + "time" – e.g. "BBC", "14:32"
  media.json
  review.json
  tools.json
  download.json
  shop.json
  forum.json
  users.json
  comments.json
  jobs.json

public/
  logo.png             # TechBox cube – 1546×1546 – blue/black – provided by owner
  fonts/
    KalamehWebFaNum-*.woff2  # 9 weights – currently Vazirmatn arabic aliased – swap with real Kalameh files 1:1
  assets/
    blog-*.jpg / *.png
    hooman.png / atiye.png / behnaz.png / nastaran.png / rojina.png
```

---

## Conventions

**Components**
- PascalCase file = PascalCase export – one component per file
- Shared atomic UI → `components/ui/`
- Layout shell → `components/layout/`
- Domain UI → `features/<domain>/components/`
- Animations: Framer Motion ONLY inside `components/animations/` or feature UI – never in hooks/services

**Hooks**
- `useXxx.ts` – generic → `hooks/`
- feature hook → `features/<f>/hooks/useXxx.ts`
- No Tailwind / no `motion.*` inside hooks

**Services / API**
- `features/<f>/services/` – domain fetch / mutations
- `lib/api/` – shared fetcher
- Server Actions: `app/actions/*.ts` with `"use server"` – e.g. `app/actions/comments.ts`

**Styling**
- Tailwind 4 – `@import "tailwindcss";` in `styles/globals.css`
- OKLCH brand tokens in `:root` / `.dark`
- **TechBox theme = black → blue** – matches `/public/logo.png` – NO violet/pink in base gradient
  ```
  --background-gradient:
    radial-gradient(... rgba(37,99,235,.22) ...),
    linear-gradient(165deg, #020617 0%, #071230 30%, #0b1e4a 60%, #050a14 100%);
  ```
- Utility classes `.card .badge .btn .input` defined in globals.css – **no `@apply` inside `@layer base` that crashes Turbopack 16.2** – pure CSS variables used

**Icons**
- Lucide React only – standardized:
  - Like → `<Heart size={20} fill={liked ? "currentColor" : "none"} />`
  - Views → `<Eye size={16} />`
  - Comments → `<MessageSquare size={16} />`
  - No emoji hearts in production UI

**Data flow – zero hard-code**
- UI never imports raw JSON directly (except seed)
- List pages: `getModuleItems("blog")` → Prisma → fallback JSON
- Detail pages: `getBySlug()` – SSG via `generateStaticParams`
- Likes: `POST /api/like` → Prisma `Like` unique `[fingerprint, module, slug]` → `Post.likes` atomic increment – UI reads real count
- Comments: `GET/POST /api/comments` – nested `parentId` – `CommentVote` → `/api/comments/vote`
- Admin: `/admin/posts` → `GET /api/posts?module=…` – create → `POST /api/posts` – RBAC server-checked via `canEditModule()`
- Roles: `/admin/roles` – super_admin creates `{name, titleFa, modules[]}` – stored via Prisma – also localStorage draft fallback `tb_roles_v4`
- Search / ticker / suggestions: `getAllAcross()`, `searchAcross()`, `getRelated()` – all tag-based – cross-module – e.g. QNAP-2277 appears in blog, media, review, download, shop, forum

**Auth / RBAC**
- `jose` JWT – httpOnly cookie `tb_session` – 30d
- `lib/auth-server.ts` – server only
- `features/auth/hooks/useAuth.ts` – client
- Roles seeded:
  - `admin / techbox123` – super_admin – all 8 modules
  - `sara` – blog_editor – blog
  - `nima` – news_editor – news
  - `rojina` – media_creator – media + review
  - `atiye` – tools_editor – tools + download
  - `nastaran` – shop_forum – shop + forum

**Chatbot**
- `features/chat/components/Chatbot.tsx` – floating FAB bottom-left – RTL Persian
- `POST /api/chat` – OpenAI-compatible – reads:
  ```
  CHAT_API_KEY=
  CHAT_BASE_URL=https://api.openai.com/v1
  CHAT_MODEL=gpt-4o-mini
  ```
  – no key? returns helpful TechBox mock with internal links (/blog/… /media/… /shop/…)
- History persisted `localStorage tb_chat_history`

**Shop – Zarinpal**
- `/app/api/pay/zarinpal/request` + `/verify` – zod validated
- `/shop/checkout` – uses `useCart()` – calculates total (Persian digits → int) – POST → Zarinpal – if `ZARIN_MERCHANT_ID` missing → mock mode auto-verifies – perfect for dev
- Env:
  ```
  ZARIN_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  NEXT_PUBLIC_SITE_URL=https://techbox.ir
  ```

**Responsive**
- Mobile first – Sidebar → 72px FAB draggable – collapses to 64px rail desktop
- Bento: `grid-cols-1` → `md:grid-cols-7` → `xl:grid-cols-12` – `max-w-7xl` → `2xl:max-w-[1600px]` → `2560px: 18px root`
- Images: `object-cover`, `aspect-square` / `aspect-video`
- No horizontal scroll – only news timeline allows vertical `overflow-y-auto`

**Font sizes – audited**
- Sidebar logo “تکباکس”: 14px bold
- Nav / theme toggle: 11–13px
- Card titles: 14–16px
- Body: 14px – leading 1.9
- h1: `clamp(1.6rem,3.5vw,2.25rem)` – h2: `clamp(1.3rem,2.5vw,1.75rem)`
- Hero: `clamp(3rem,8vw,6.2rem)` – 900 black

---

## How to add new …

- **New UI atom**: `components/ui/MyThing.tsx` – export PascalCase – no data fetching – Tailwind only
- **New feature page**: 
  1. `features/<name>/components/` …
  2. `app/<name>/page.tsx` → `import … from "@/features/<name>/components/…"` – keep page.tsx < 30 LOC
  3. add module in `config/modules.config.ts` + colors in `config/module-colors.ts`
  4. add to `features/layout/config/sidebar.config.ts` NavItems
- **New hook**: generic → `hooks/useX.ts` – feature → `features/<f>/hooks/useX.ts`
- **New API**: `app/api/<name>/route.ts` – `export async function GET/POST` – use `zod` – use `prisma` from `@/lib/db` – never import UI
- **Styling**: add tokens to `:root` / `.dark` in `styles/globals.css` → use `var(--token)` in components – avoid `@apply` inside `@layer base` on Turbopack 16 – use plain CSS or utility class strings
- **Animations**: Framer Motion only in `components/animations/*` or feature UI – e.g. `<FadeIn>`, `<MotionSection>`

---

## Migration notes (what moved)

- `components/bento-card.tsx` → `components/common/BentoCard.tsx`
- `components/layout-shell.tsx` → `components/layout/LayoutShell.tsx`
- `components/sections/*` → `features/home|news|.../components/*`
  - `hero-section.tsx` → `features/home/components/HeroSection.tsx`
  - `home-modules-section.tsx` → `features/home/components/HomeModulesSection.tsx`
  - `home-news-ticker-section.tsx` → `features/news/components/NewsTicker.tsx`
  - `footer-section.tsx` → `components/layout/Footer.tsx`
  - `sidebar-section.tsx` → `features/layout/components/SidebarMain.tsx`
  - `blog-section.tsx` → deprecated → replaced by `features/blog/components/BlogGrid.tsx`
- `components/sidebar/*` → `features/layout/*` + `hooks/useFabTop.ts` + `components/layout/*`
- `components/content-card.tsx` → split:
  - `components/common/ContentCard.tsx`
  - `features/home/components/*FeedCard.tsx` (VideoFeedCard, ForumFeedCard, ProductFeedCard, DownloadFeedCard, ReviewFeedCard)
- `components/like-button.tsx` → `components/ui/LikeButton.tsx` (+ `CommentVote`)
  - icon: ❤️ emoji → **Lucide `<Heart size={20}>`**
- `components/comment-section.tsx` → `features/comment/components/CommentSection.tsx` – now Server Action ready: `app/actions/comments.ts`
- `components/suggestion-grid.tsx` → `features/content/components/SuggestionGrid.tsx`
- `components/module-list.tsx` → `features/content/components/ModuleList.tsx`
- `lib/modules.ts` → `config/modules.config.ts`
- `lib/module-colors.ts` → `config/module-colors.ts`
- `app/globals.css` → **`styles/globals.css`** – plus legacy copy at `app/globals.css` re-exporting for Next – black→blue gradient restored to match `/public/logo.png`
- `lib/fonts.ts` → `config/fonts.ts` + `lib/fonts.ts` re-export – **next/font/local** – KalamehWebFaNum 9 weights – files in `/public/fonts/` (currently Vazirmatn arabic aliased – 21KB/weight – swap with real Kalameh .woff2 1:1)
- New: `features/chat/` – Chatbot – `app/api/chat/route.ts`
- New: `features/shop/hooks/cart-context.tsx` – `CartProvider` – wraps `LayoutShell`
- New: `app/shop/checkout/page.tsx` – Zarinpal integrated
- New: `app/admin/roles/page.tsx` – RBAC Role Creator
- New: `app/tools/raid-calculator/page.tsx` + `/subnet-calculator` – standalone – also accessible via sidebar NavItems
- New: `app/workwithus/[slug]/page.tsx` – job apply – CV upload
- New: `app/search/page.tsx`
- Prisma: `prisma/schema.prisma` + `prisma/seed.ts` + 7 API routes – fully typed

**Deprecated – not deleted, moved to `deprecated/`:**
- `components/sections/blog-section.tsx` → `deprecated/BlogSection.legacy.tsx`
- old `components/sidebar/*` duplicates → kept in `components/sidebar/` as fallback import shim re-exporting from `features/layout/*` – to avoid breaking external imports during transition – safe to delete after 1 release

**TODO / known – not blocking build:**
- CommentSection: currently `fetch('/api/comments')` client – Server Action version at `app/actions/comments.ts` ready – flip with `useActionState` – 5 lines
- Upload pipeline: avatar / CV upload currently FileReader → localStorage / base64 – add `/api/upload` → S3/MinIO – types prepared
- Zarinpal: `/api/pay/zarinpal/*` works – sandbox mock auto-verifies – add real `ZARIN_MERCHANT_ID` in prod `.env`
- Chat: `/api/chat` – add your provider: 
  ```
  CHAT_API_KEY=...
  CHAT_BASE_URL=https://...
  CHAT_MODEL=...
  ```
  – currently returns helpful Persian mock with internal QNAP-2277 links
- Search: `/search` – basic – add Meilisearch / Postgres FTS later – types ready
- Increase seed data volume – current seed: 25 posts – expand script in `prisma/seed.ts` easily duplicates with varied tags

---

Build command that **must stay green**:

```bash
pnpm install # or npm install
npx prisma db push
npm run db:seed
pnpm next build   # or pnpm build
# ▲ Next.js 16.2.9
# ✓ Compiled successfully
# ✓ 53 routes – 0 TypeScript errors
```

All code: **App Router – Server Components default – Client `"use client"` only where interactivity / framer-motion / hooks needed – Tailwind classes only in `components/*` + `features/*/components/*` – zero Tailwind / motion in `lib/*`, `hooks/*`, `config/*`.**
```

Then present file and deliver final summary