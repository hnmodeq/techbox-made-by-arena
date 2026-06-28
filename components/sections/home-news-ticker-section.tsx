import Link from "next/link";
import { cn } from "@/lib/utils";

type NewsItem = {
  slug: string;
  title: string;
};

type NewsTickerProps = {
  items: NewsItem[];
  className?: string;
};

export default function NewsTicker({ items, className = "" }: NewsTickerProps) {
  if (!items?.length) return null;

  return (
    <section className={cn("w-full overflow-hidden", className)} aria-label="اخبار اخیر">
      <div
        dir="rtl"
        className="ticker-wrapper relative w-full overflow-hidden border-y border-border/40 bg-background/30 backdrop-blur-sm"
      >
        <div className="ticker-track flex w-max items-center gap-12 py-3">
          {[...items, ...items].map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/news/${item.slug}`}
              className="ticker-item flex shrink-0 items-center gap-3 whitespace-nowrap text-sm text-muted-foreground transition-all hover:text-brand"
            >
              <span className="flex h-2 w-2 rounded-full bg-brand/50 shadow-[0_0_8px_rgba(var(--brand),0.5)]" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
