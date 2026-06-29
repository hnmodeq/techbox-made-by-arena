# TechBox v3 – Module upgrade TODO
Target: Next 16.2.9 / React 19 / Tailwind 4.3.1 / Framer Motion 12 – zero errors

## MODULES
### 1. Blog module
- [ ] Square image grid (1:1), not rectangle
- [ ] Image big on top, title + excerpt below
- [ ] Author avatar + name + date row
- [ ] Likes / views / comments count visible in list
- [ ] Home feed: show article image thumbnail

### 2. News module
- [ ] Split page: RIGHT = main news (big cards w/ image)
- [ ] LEFT = "اخبار فوری" force-news timeline, no image
- [ ] Auto-push news/blog posts → NewsTicker
- [ ] Categories filter

### 3. Video gallery / Media
- [ ] Real `<video>` player (HTML5 + HLS fallback), poster
- [ ] Show views / likes / comments count on gallery cards
- [ ] Gallery grid – video thumbnail with duration overlay, clickable
- [ ] Home feed: video thumbnail card, not text list

### 4. Shop module
- [ ] Category filter, search, price sort
- [ ] Product cards rectangle with image
- [ ] Cart icon in sidebar with badge count
- [ ] Cart drawer / page – add/remove/qty
- [ ] Home shop feed: rectangle product cards

### 5. Tools module
- [ ] REMOVE tools Bento feed – move tools to sidebar quick-launch
- [ ] `/tools` landing = interactive tools grid
- [ ] RAID Calculator – real working (from your demo code)
- [ ] Subnet Calculator – real
- [ ] Tools run inline, no redirect to detail page needed (still keep [slug] for SEO)

### 6. Forum module
- [ ] "موضوع جدید" button – real modal, creates thread (Prisma)
- [ ] Reddit-style list: author avatar + name left of title
- [ ] Replies count, views, solved/unsolved badge
- [ ] Thread page: nested comments
- [ ] Home forum feed: show author avatar, name, answers count, solved status

### 7. Review module
- [ ] Square cards (1:1 image)
- [ ] Author avatar beside author name – visible in list
- [ ] Show views / comments / likes on list cards
- [ ] Home review feed: image + author avatar + stats

### 8. Download module
- [ ] Filter bar: brand / type / OS
- [ ] Tags: DELL, Storage, Firmware – clickable → /search
- [ ] Detail page: OS selector, version list sorted by date DESC/ASC, download button per version
- [ ] Home download feed: latest items, with direct “دانلود” button → detail page OS chooser

### 9. Profile / Account module
- [ ] /account – editable profile:
  - avatar upload (preview, localStorage for now → later /api/upload)
  - name, lastName, nickname, birthday, jobTitle, email
  - change password
  - logout
- [ ] Sidebar bottom: show user avatar + name, not generic CircleUser icon
- [ ] If not logged in → login pop-up from sidebar profile button
- [ ] After login → redirect to /account/edit

## HOME MODULE
- [ ] Remove tools feed card entirely
- [ ] All remaining feeds show images:
  - Blog: image top
  - News: image thumb
  - Media: video thumbnail, clickable play
  - Review: image + author avatar + stats
  - Shop: rectangle product image
  - Forum: author avatar, answers, solved badge
  - Download: thumbnail + direct download button
- [ ] Fix Bento hover: remove card-group hover on whole feed box – only inner items hover individually – card title is link to module
- [ ] NewsTicker auto-feeds from news + blog + “force news” – already via getAllAcross()

## GLOBAL / SIDEBAR
- [ ] Sidebar: search bar (top, filters across modules → /search?q=)
- [ ] Sidebar bottom: show logged-in user avatar + name (replace CircleUser)
- [ ] Sidebar: notification bell – dropdown last 5 events (new post / comment)
- [ ] Sidebar: login pop-up modal if not logged in, else → /account
- [ ] Sidebar: live Persian date + time (fa-IR, Tehran)
- [ ] Sidebar: VIP “درخواست مشاوره” button – move from footer → sidebar (prominent)
- [ ] Cart icon in sidebar (shop) with badge count
- [ ] Tools quick-launch list in sidebar (replaces Bento tools card)

## CONTENT PAGES
- [ ] About us – /about:
  - team members grid – pulls from users (avatar, name, role, bio)
  - map embed – Tehran office – leaflet static / iframe OSM
  - company timeline
- [ ] WorkWithUs – /workwithus:
  - job opportunities list: title, full-time/part-time/remote badge, date
  - /workwithus/[slug] – job detail + apply form
  - apply uses profile data + CV upload (localStorage first)
- [ ] Contact – already card UI – keep, add map small
- [ ] Consultation – move CTA to sidebar VIP – keep page as fallback

## TECH / QA
- [ ] Next 16 async params – ALL [slug] pages already ✅
- [ ] useSearchParams → Suspense – admin + search ✅
- [ ] Tailwind 4 – @tailwindcss/postcss ✅
- [ ] Replace next/font/local (0-byte crash) → Vazirmatn Google – allow easy swap back to Kalameh when you drop real .woff2
- [ ] Prisma: @prisma/client 6.7 – schema ready, seed ready – need `npx prisma db push && npm run db:seed`
- [ ] API: /api/like, /api/comments, /api/comments/vote, /api/posts, /api/auth/*
- [ ] Run `next build` after EACH module – zero TS errors
- [ ] Run `next dev` crawl: 200 OK all routes, 0 console errors
- [ ] Click audit: every card, button, like, comment, filter, cart, login modal

---

Progress tracker will be updated in this file – checking off as we ship.
