# TechBox v4 – Final Polish
Next 16.2.9 | React 19 | Tailwind 4.3.1 | Prisma 6.7
Target: zero errors, fully responsive sm → 4K TV

## A. Backend / Data – MUST FINISH
- [ ] Prisma: `npx prisma db push` + `npm run db:seed` verified
- [ ] API: /api/auth/login, /api/auth/me, /api/auth/logout – JWT cookie – tested
- [ ] API: /api/posts GET/POST – RBAC server-side
- [ ] API: /api/like POST – toggle – returns {liked, likes}
- [ ] API: /api/comments GET/POST – nested parentId support
- [ ] API: /api/comments/vote – up/down
- [ ] UI SWAP: LikeButton → fetch /api/like (was localStorage)
- [ ] UI SWAP: CommentSection → fetch /api/comments
- [ ] UI SWAP: CommentVote → POST /api/comments/vote
- [ ] AdminPosts → fetch /api/posts?module=… + POST new

## B. Fonts – local Kalameh safe
- [ ] lib/fonts.ts – try next/font/local first, fallback to Vazirmatn if woff2 missing / 0-byte / parse fail
- [ ] provide /public/fonts/.keep + README telling user to drop KalamehWebFaNum-*.woff2
- [ ] font-size audit: Sidebar logo “تکباکس” 14px bold, theme toggle 12px, nav items 13px, h1 30-48px clamp, h2 24-32px, h3 18-22px, body 14-15px, card titles 14-16px – consistent scale
- [ ] check: theme changer text MUST NOT be larger than logo title – fix to text-xs

## C. Media – HLS real player
- [ ] add hls.js ^1.6
- [ ] components/media/video-player.tsx – <video> + hls.js attach, poster, controls, PiP
- [ ] MediaGallery + ContentDetail (media) use <VideoPlayer>
- [ ] show: views • likes • comments count – already, verify Persian numbers
- [ ] duration overlay, quality selector stub

## D. Shop – checkout + cart sidebar
- [ ] CartProvider already wraps LayoutShell – verify
- [ ] Sidebar: add ShoppingBag cart icon with badge – top header (already) + also in nav list?
- [ ] /shop/checkout page – cart summary, shipping form, 3-step UI
- [ ] shop feed items → SQUARE (currently 4:3 / 80px) → change to aspect-square
- [ ] product cards: category filter + search – already done – verify mobile

## E. Forum – Reddit nested
- [ ] CommentSection → tree render: parent → replies indent (border-right)
- [ ] “موضوع جدید” modal → POST /api/posts?module=forum
- [ ] author avatar 32px beside name – already
- [ ] vote arrows ▲/▼ left column – already
- [ ] solved toggle (author / mod only)
- [ ] Home forum feed: avatar + author + answers + solved badge – already

## F. Home Bento – desktop fix + hover isolate
- [ ] Grid: `md:grid-cols-7` auto-rows 320px → test xl / 2xl / 4K – add `xl:grid-cols-12`, `2xl:max-w-[1600px]`, correct col-span mapping
- [ ] Remove card-level `group-hover` that purples all inner titles – scope hover to `group/item`
- [ ] Each feed item hover independently – already via ContentCard group
- [ ] Feed title = Link to module – not whole card clickable – BentoCard currently whole card is <Link> – change to div + title link only
- [ ] Remove scrollbars from feeds – overflow-visible – EXCEPT news feed: keep `max-h-[260px] overflow-y-auto` vertical only
- [ ] All feeds show images:
  - blog: square image top ✓
  - news: image thumb
  - media: video thumbnail ▶
  - review: image + author avatar + stats
  - shop: **square** product image
  - download: thumbnail + download button
  - forum: avatar + meta

## G. Sidebar – full v2
- [ ] Search bar – top – already – ensure collapsed state = icon only that expands on hover/focus
- [ ] Profile avatar bottom – shows user.avatar / fallback – already – ensure collapsed shows avatar icon only
- [ ] Notification bell – currently opens left:0 – RTL fix → `right-0` / `left-auto`, so panel stays inside viewport on RTL
- [ ] Login modal – already – polish: username+password, error state, “ورود با sara/admin”
- [ ] Date/Time – live fa-IR Asia/Tehran – currently shows in expanded footer – add collapsed icon mode: Clock icon, tooltip shows full date/time on hover
- [ ] Consultation VIP button – currently shows only expanded – add collapsed icon (Headphones / MessageCircle) with tooltip
- [ ] Cart icon – already top header – also add to nav list?
- [ ] Tools quick-launch – currently 2 small buttons in sidebar mid – **convert to full NavItem style**: icon + title, like other nav items
  - add navItems: “ماشین حساب RAID” → /tools/raid-calculator (Wrench icon, cyan)
  - “ماشین حساب شبکه” → /tools/subnet-calculator
  - ensure collapsed sidebar shows tooltips
- [ ] All new sidebar items (search, VIP, tools, cart, date/time) must appear (icon-only) when sidebar collapsed – with SidebarTooltip

## H. Tools – separate pages
- [ ] /tools/raid-calculator – dedicated page – render <RaidCalculator /> full width
- [ ] /tools/subnet-calculator – dedicated page
- [ ] /tools page = hub grid linking to each tool
- [ ] Remove tools from home Bento – already done

## I. Review
- [ ] ReviewGrid – already square aspect-square – verify
- [ ] Author avatar beside name – yes
- [ ] Views / comments / likes visible on list card – add row
- [ ] Home review feed – already ReviewFeedCard with avatar + stats

## J. Download
- [ ] DownloadTable – filters: brand / type / OS – already
- [ ] Tags clickable → /search?q=tag – already
- [ ] Detail page: OS chooser + version table date-sorted – DownloadDetail.tsx already – verify sort toggle works, add “دانلود قدیمی‌ها” toggle
- [ ] Home download feed: show thumbnail + direct download button – already DownloadFeedCard

## K. Profile
- [ ] /account – already has: avatar upload preview, name, lastName, nick, email, jobTitle, birthday, change password, logout, stats cards
- [ ] Add: clear validation, save to /api/auth/me PATCH (fallback localStorage)
- [ ] Sidebar avatar reflects uploaded image (localStorage tb_profile_*)

## L. About / WorkWithUs
- [ ] About – team grid from users.json – done – add: role bio, social links, OSM map iframe – done – polish spacing for TV
- [ ] WorkWithUs – /workwithus list – job cards – done
- [ ] /workwithus/[slug] – detail + apply form with CV upload – done – ensure form is client component – already “use client”

## M. News enhancements
- [ ] News list items – show **clock icon + publish time**, plus **source badge** (e.g. BBC / Dell / تکباکس)
  - extend data/news.json → add `"source": "BBC Persian"` etc.
  - UI: ⏱ {time} • 📰 {source}
- [ ] NewsTicker auto-feed = news + blog – already: getAllAcross filter news|blog

## N. Typography / responsive audit
- [ ] Audit all font sizes:
  - Sidebar logo title: 14px bold
  - Nav items: 13px
  - Theme toggle: 12px (currently was larger – fix)
  - Card titles: 15-16px
  - Body: 14px
  - Meta: 11-12px
  - Hero: clamp(2.8rem,7vw,5.5rem)
- [ ] Responsive test matrix:
  - 360px mobile
  - 768px tablet
  - 1024px laptop
  - 1440px desktop
  - 1920px FHD
  - 2560px QHD / TV
  → Bento grid: 1 col mobile, 7 col md, 12 col xl – auto-rows adjust
  → Sidebar: collapses to 64px, FAB 72px mobile
  → All images use sizes + object-cover
- [ ] Remove horizontal scrolls – only news feed allows vertical scroll

## O. Final QA
- [ ] `npm run build` – 0 errors – Next 16 / React 19 / TS6
- [ ] `npm run dev` crawl – curl 200 OK:
  / /blog /blog/* /news /news/* /media/* /review/* /tools/* /download/* /shop/* /forum/* /account /admin /admin/login /search
- [ ] Click audit: every card, like button → POST /api/like, comment submit → POST /api/comments, vote ▲▼, cart add/remove, forum new topic, job apply, profile save, theme toggle, sidebar collapse, mobile FAB drag
- [ ] Lighthouse check (manual): no hydration mismatch (params await fixed), no 404s
- [ ] `npx prisma db push && npm run db:seed` – verify 8 modules seeded, 6 users (password techbox123)

---
Checklist: 0/68 – updating live as we ship.
