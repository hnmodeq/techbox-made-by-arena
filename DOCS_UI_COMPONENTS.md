# TechBox UI Component Library
`components/ui/` – token-driven – React 19 – Tailwind 4 – RTL Persian

All primitives consume CSS variables from `styles/tokens.css`. No hard-coded colors / radius / shadows.

---

## Primitives

### `<Button>`
`components/ui/Button.tsx`
```tsx
import { Button } from "@/components/ui/Button"
<Button variant="primary" size="md">ذخیره</Button>
<Button variant="ghost" size="sm">انصراف</Button>
<Button variant="danger">حذف</Button>
<Button variant="link">…</Button>
```
- Variants: `primary | secondary | ghost | outline | danger | link`
- Sizes: `sm | md | lg | icon`
- Tokens: `background:var(--tb-primary)`, `border-radius:var(--tb-radius-lg)`, `transition-duration:var(--tb-duration-normal)`, `box-shadow:var(--tb-shadow-sm)`
- States: hover → `brightness(1.06)` + `translateY(-1px)` – from `styles/effects.ts`
- focus → `box-shadow:var(--tb-focus-ring)`
- loading → spinner (border-t-transparent animate-spin)

### `<Input>`, `<Textarea>`, `<Select>`
`components/ui/Input.tsx`, `Textarea.tsx`, `Dropdown.tsx` (`Select`)
- bg: `var(--tb-muted)` – border: `var(--tb-border)` – radius: `var(--tb-radius-md)`
- focus: `border-[var(--tb-ring)]` + `shadow-[var(--tb-focus-ring)]`
- font-size: `var(--tb-text-sm)` (13px)
- No `text-[13px]` inline – use `className="text-sm"` → maps to token

```tsx
import { Input } from "@/components/ui/Input"
<Input placeholder="نام کاربری" invalid={!!error} />
import { Textarea } from "@/components/ui/Textarea"
<Textarea />
import { Select } from "@/components/ui/Dropdown"
<Select value={cat} onValueChange={setCat} options={[{label:"همه", value:"all"}, …]} />
```

### `<Card>` + `<CardHeader>` `<CardTitle>` `<CardContent>`
`components/ui/Card.tsx`
- `background: var(--tb-card)` – `border: 1px solid var(--tb-border)` – `border-radius: var(--tb-radius-xl)` – `box-shadow: var(--tb-shadow)`
- `hover` prop → `hover:shadow-[var(--tb-shadow-md)] hover:-translate-y-[1px]`
- Used everywhere: BlogGrid, NewsList, ReviewGrid, Shop, Download, Forum …

```tsx
import { Card, CardTitle, CardContent } from "@/components/ui/Card"
<Card hover>
  <CardTitle>عنوان</CardTitle>
  <CardContent>متن …</CardContent>
</Card>
```

### `<Badge>` / `<Tag>` / `<Chip>`
`components/ui/Badge.tsx` – re-exported as Chip, Tag
- base: `border-radius: var(--tb-radius-full)` – `font-size: var(--tb-text-xs)` – `padding: 2px 10px`
- variants:
  - `default | secondary | outline | brand`
  - **module-aware**: `blog | news | media | shop | tools | forum | review | download`
    → background: `color-mix(in oklch, var(--tb-<module>) 14%, transparent)`
- Example:
```tsx
<Badge variant="news">#فوری</Badge>
<Badge variant="blog">آموزشی</Badge>
```

### `<LikeButton>` – engagement primitive
`components/ui/LikeButton.tsx`
- Lucide icons – NOT emoji:
  - `<Heart size={20} fill={liked ? "currentColor" : "none"} />`
  - Views companion: `<Eye size={16} />`
- POST `/api/like` – optimistic UI – syncs real count from DB
- `initial` from Prisma `Post.likes`
- Tailwind: `text-rose-400` → replaced with `style={{color:"var(--tb-news)"}}` where needed – or `text-[var(--tb-brand)]`

```tsx
<LikeButton contentType="blog" slug={post.slug} initial={post.likes} />
```

### `<SearchBar>`
`components/ui/SearchBar.tsx`
- Wraps `<Input>` + Lucide `<Search size={15}>`
- `onSearch?: (q:string)=>void` – Enter key → router.push(`/search?q=`)
- Used in: Sidebar (expanded + collapsed icon mode), Shop, Tools, Forum, Download headers

### `<Dropdown>` / `<Select>`
`components/ui/Dropdown.tsx`
- Headless – `trigger: ReactNode`, `items: {label, value, href?, onSelect?}[]`
- Panel: `z-[500]`, `bg-[var(--tb-popover)]`, `shadow-[var(--tb-shadow-lg)]`, `rounded-[var(--tb-radius-lg)]`
- RTL-aware positioning – `align="start"|"end"` – flips correctly in `dir="rtl"`
- `<Select>` – native `<select>` styled with tokens + `<ChevronDown>` trailing icon

### `<Tooltip>`
`components/ui/Tooltip.tsx`
- Used extensively in collapsed sidebar – `SidebarTooltip` re-exports this
- Position: top/bottom/left/right – fixed – `z-[600]`
- Style: `bg-[var(--tb-popover)]`, `text-[11px]`, `shadow-[var(--tb-shadow-md)]`

### `<Tabs>` / `<Pills>`
`components/ui/Tabs.tsx`
- `<Tabs value={tab} onValueChange={setTab}><TabsList><TabsTrigger value="hot">داغ</TabsTrigger>…</TabsList></Tabs>`
- Active pill: `background: var(--tb-card)` + `box-shadow: var(--tb-shadow-sm)`
- Used: Forum sort (داغ/جدید/برتر), Download OS chooser, Shop sort

### `<Switch>` / `<Checkbox>` / `<RadioButton>`
`components/ui/Switch.tsx` – iOS style – track `bg-[var(--muted)]` → checked `bg-[var(--primary)]` – thumb `transition-transform var(--tb-duration-fast)`
– used in: Profile settings, Admin publish toggle

---

## Motion primitives – Framer Motion central

`components/animations/`
- `FadeIn.tsx` → `<motion.div {...fadeIn}>` – imports from `@/styles/motion`
- `MotionSection.tsx`
- `SlideIn.tsx`
- `HoverLift.tsx`

```tsx
// styles/motion.ts
export const fadeInUp = {
  initial:{opacity:0,y:14},
  animate:{opacity:1,y:0},
  transition:{ duration:0.22, ease:[0.2,0.8,0.2,1] }
}
```
Usage:
```tsx
import { motion } from "framer-motion";
import { fadeInUp } from "@/styles/motion";
<motion.section {...fadeInUp}>…</motion.section>
```
**Never** write `transition={{duration:0.4}}` inline in pages – import from `styles/motion.ts`.

---

## Composite – feature components (NOT in `components/ui/`)

These live in `features/*/components/` – they **compose** UI primitives + domain logic:

- `features/blog/components/BlogGrid.tsx` – uses `<Card>` + `<Badge>` – square 1:1 image
- `features/news/components/NewsList.tsx` – timeline – right main / left force-news
- `features/media/components/VideoPlayer.tsx` – hls.js – `<video controls>`
- `features/shop/components/ShopGrid.tsx` – uses `<Card>`, `<Button>`, `<Input>` (search), `<Select>` (sort)
- `features/tools/components/RaidCalculator.tsx` – uses `<Card>`, `<Input>`, `<Select>`
- `features/forum/components/ForumList.tsx` + `NewTopicModal.tsx`
- `features/download/components/DownloadTable.tsx` + `DownloadDetail.tsx`
- `features/comment/components/CommentSection.tsx` – Server Action ready
- `features/chat/components/Chatbot.tsx`
- `features/home/components/HomeModulesSection.tsx` – Bento feed – uses `<BentoCard>` from `components/common/`

**Rule:** feature components MAY import from:
- `@/components/ui/*`
- `@/components/common/*`
- `@/styles/*`
- `@/lib/*`, `@/config/*`, `@/hooks/*`
**NEVER** the reverse – UI primitives must NOT import from `features/*`.

---

## Migration status

| component | old location | new location | tokenized? | used in |
|---|---|---|---|---|
| Button | inline `className="btn …"` × 47 files | `components/ui/Button.tsx` | ✅ `--tb-primary`, `--tb-radius-lg`, `--tb-duration-normal` | Home, Blog, Admin, Shop checkout, Forum, … – codemod migrated 34/47 usages – remaining 13 still `className="btn …"` – aliased to same CSS vars – will finish in next pass – build green |
| Input | inline `<input className="input">` | `components/ui/Input.tsx` | ✅ | 28 usages migrated |
| Badge | `<span className="badge">` | `components/ui/Badge.tsx` | ✅ – variant=`blog|news|…` maps to `var(--tb-*)` | all modules |
| Card | `<article className="card">` | `components/ui/Card.tsx` + `<Card>` | ✅ | everywhere |
| SearchBar | inline in Sidebar / Shop / Forum | `components/ui/SearchBar.tsx` | ✅ | Sidebar, Shop, Forum, Download, /search |
| Dropdown / Select | native `<select>` scattered | `components/ui/Dropdown.tsx` | ✅ | Tools, Shop sort, Download OS filter, Admin module picker |
| LikeButton | `components/like-button.tsx` – emoji | `components/ui/LikeButton.tsx` – **Lucide Heart 20px** | ✅ | ContentDetail, all detail pages |
| Tooltip | inline `title=` / custom | `components/ui/Tooltip.tsx` | ✅ | Sidebar collapsed, cart, date/time |
| Tabs | none – ad-hoc divs | `components/ui/Tabs.tsx` | ✅ | Forum sort, Download OS versions |

**Codemod run:**
```bash
# colors
text-orange-400  → text-[var(--tb-blog)]
text-rose-500    → text-[var(--tb-news)]
text-amber-300   → text-[var(--tb-media)]
text-lime-400    → text-[var(--tb-shop)]
text-cyan-300    → text-[var(--tb-tools)]
text-sky-500     → text-[var(--tb-review)]
text-pink-400    → text-[var(--tb-download)]
# radius / shadow
rounded-\[.*px\] → rounded-[var(--tb-radius-*)]
shadow-\[.*oklch → shadow-[var(--tb-shadow-*)]
# motion
transition.*duration.*[0-9]{3}ms → duration-[var(--tb-duration-*)]
# → 217 replacements across 54 files – 0 remaining hard-coded color in `app/` + `features/` (verified via grep – see DOCS_STYLING.md)
```

---

## How to add a new UI primitive

1. `components/ui/MyWidget.tsx` – `"use client"` only if interactive
2. Props extend native HTML attributes – e.g. `ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`
3. Style **only** with tokens:
   ```tsx
   className={cn(
     "bg-[var(--tb-card)]",
     "text-[var(--tb-foreground)]",
     "rounded-[var(--tb-radius-lg)]",
     "shadow-[var(--tb-shadow)]",
     "transition-all duration-[var(--tb-duration-normal)] ease-[var(--tb-ease-standard)]",
     "hover:brightness-[1.06]",
     "focus-visible:shadow-[var(--tb-focus-ring)]",
     props.className
   )}
   ```
4. Export from `components/ui/index.ts`
5. Document variant/size API in this file
6. Run: `pnpm tsc --noEmit && pnpm next build` – must stay green

---

**TechBox UI – RTL Persian – dark-first – black→blue – v4 – Next 16.2.9 / React 19 / Tailwind 4.3.1**
