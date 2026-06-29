# Project Structure

```
techbox-made-by-arena
├── .config
│   └── nextjs-nodejs
│       └── config.json
├── app
│   ├── about
│   │   └── page.tsx
│   ├── account
│   │   └── page.tsx
│   ├── admin
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── posts
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   └── me
│   │   │       └── route.ts
│   │   ├── comments
│   │   │   ├── vote
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── like
│   │   │   └── route.ts
│   │   └── posts
│   │       └── route.ts
│   ├── blog
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── consultation
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── download
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── forum
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── media
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── news
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── review
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── search
│   │   └── page.tsx
│   ├── shop
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   ├── checkout
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── tools
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   ├── raid-calculator
│   │   │   └── page.tsx
│   │   ├── subnet-calculator
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── workwithus
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── media
│   │   └── video-player.tsx
│   ├── sections
│   │   ├── blog-section.tsx
│   │   ├── footer-section.tsx
│   │   ├── hero-section.tsx
│   │   ├── home-modules-section.tsx
│   │   ├── home-news-ticker-section.tsx
│   │   └── sidebar-section.tsx
│   ├── shop
│   │   └── cart-context.tsx
│   ├── sidebar
│   │   ├── sidebar.config.ts
│   │   ├── sidebar.store.ts
│   │   ├── sidebar.types.ts
│   │   ├── SidebarContent.tsx
│   │   ├── SidebarShell.tsx
│   │   ├── SidebarTooltip.tsx
│   │   ├── theme.store.ts
│   │   └── useFabTop.ts
│   ├── tools
│   │   ├── raid-calculator.tsx
│   │   └── subnet-calculator.tsx
│   ├── bento-card.tsx
│   ├── blog-grid.tsx
│   ├── comment-section.tsx
│   ├── content-card.tsx
│   ├── content-detail.tsx
│   ├── download-detail.tsx
│   ├── download-table.tsx
│   ├── forum-list.tsx
│   ├── layout-shell.tsx
│   ├── like-button.tsx
│   ├── media-gallery.tsx
│   ├── module-list.tsx
│   ├── news-list.tsx
│   ├── review-grid.tsx
│   ├── shop-grid.tsx
│   ├── suggestion-grid.tsx
│   └── tools-grid.tsx
├── data
│   ├── blog.json
│   ├── comments.json
│   ├── download.json
│   ├── forum.json
│   ├── jobs.json
│   ├── media.json
│   ├── news.json
│   ├── review.json
│   ├── shop.json
│   ├── tools.json
│   └── users.json
├── lib
│   ├── auth-server.ts
│   ├── auth.ts
│   ├── content.ts
│   ├── db.ts
│   ├── fonts.ts
│   ├── module-colors.ts
│   ├── modules.ts
│   └── utils.ts
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── assets
│   │   ├── atiye.png
│   │   ├── behnaz.png
│   │   ├── blog-1.jpg
│   │   ├── blog-2.jpg
│   │   ├── blog-3.jpeg
│   │   ├── blog-4.jpg
│   │   ├── blog-5.jpg
│   │   ├── blog-6.png
│   │   ├── hooman.png
│   │   ├── me.jpg
│   │   ├── nastaran.png
│   │   └── rojina.png
│   ├── fonts
│   │   ├── KalamehWebFaNum-Black.woff2
│   │   ├── KalamehWebFaNum-Bold.woff2
│   │   ├── KalamehWebFaNum-ExtraBold.woff2
│   │   ├── KalamehWebFaNum-ExtraLight.woff2
│   │   ├── KalamehWebFaNum-Light.woff2
│   │   ├── KalamehWebFaNum-Medium.woff2
│   │   ├── KalamehWebFaNum-Regular.woff2
│   │   ├── KalamehWebFaNum-SemiBold.woff2
│   │   └── KalamehWebFaNum-Thin.woff2
│   └── logo.png
├── scripts
│   ├── transferdata.cjs
│   └── transfertree.cjs
├── .env
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── postcss.config.mjs.off
├── README.md
├── tailwind.config.ts
├── tailwind.config.ts.off
├── TODO_TECHBOX_v3.md
├── TODO_TECHBOX_v4.md
└── tsconfig.json
```
