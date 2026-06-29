import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "brand" |
  "blog" | "news" | "media" | "shop" | "tools" | "forum" | "review" | "download";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const base =
  "inline-flex items-center gap-1 rounded-full border px-[10px] py-[3px] " +
  "text-[11px] font-[600] leading-none whitespace-nowrap " +
  "transition-colors duration-[var(--tb-duration-fast)]";

const variants: Record<Variant, string> = {
  default:   "bg-[var(--tb-secondary)] text-[var(--tb-secondary-foreground)] border-[var(--tb-border)]",
  secondary: "bg-[var(--tb-muted)] text-[var(--tb-muted-foreground)] border-[var(--tb-border)]",
  outline:   "bg-transparent text-[var(--tb-foreground)] border-[var(--tb-border)]",
  brand:     "bg-[color-mix(in_oklch,var(--tb-brand)_14%,transparent)] text-[var(--tb-brand)] border-[color-mix(in_oklch,var(--tb-brand)_30%,transparent)]",
  blog:      "bg-[oklch(0.95_0.04_60/1)] text-[oklch(0.45_0.15_50)] border-[oklch(0.85_0.08_60/1)] dark:bg-[oklch(0.25_0.07_50/1)] dark:text-[oklch(0.82_0.14_65)] dark:border-[oklch(0.35_0.08_50/1)]",
  news:      "",
  media:     "",
  shop:      "",
  tools:     "",
  forum:     "",
  review:    "",
  download:  "",
};

// fill module variants with CSS variables – keeps everything token-driven
const moduleMap: Record<string, string> = {
  news:     "background:color-mix(in oklch, var(--tb-news) 14%, transparent); color:var(--tb-news); border-color:color-mix(in oklch, var(--tb-news) 30%, transparent)",
  media:    "background:color-mix(in oklch, var(--tb-media) 14%, transparent); color:var(--tb-media); border-color:color-mix(in oklch, var(--tb-media) 30%, transparent)",
  shop:     "background:color-mix(in oklch, var(--tb-shop) 14%, transparent); color:var(--tb-shop); border-color:color-mix(in oklch, var(--tb-shop) 30%, transparent)",
  tools:    "background:color-mix(in oklch, var(--tb-tools) 14%, transparent); color:var(--tb-tools); border-color:color-mix(in oklch, var(--tb-tools) 30%, transparent)",
  forum:    "background:color-mix(in oklch, var(--tb-forum) 14%, transparent); color:var(--tb-forum); border-color:color-mix(in oklch, var(--tb-forum) 30%, transparent)",
  review:   "background:color-mix(in oklch, var(--tb-review) 14%, transparent); color:var(--tb-review); border-color:color-mix(in oklch, var(--tb-review) 30%, transparent)",
  download: "background:color-mix(in oklch, var(--tb-download) 14%, transparent); color:var(--tb-download); border-color:color-mix(in oklch, var(--tb-download) 30%, transparent)",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant="default", style, ...props }, ref) => {
    const isModule = ["news","media","shop","tools","forum","review","download"].includes(variant);
    return (
      <span
        ref={ref}
        className={cn(base, !isModule && variants[variant as keyof typeof variants], className)}
        style={isModule ? { ...(style||{}), ...Object.fromEntries((moduleMap[variant]||"").split(";").filter(Boolean).map(s=>{const [k,...v]=s.split(":"); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.join(":").trim()]})) } : style}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
export default Badge;
