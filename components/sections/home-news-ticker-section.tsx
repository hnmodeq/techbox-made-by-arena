import Link from "next/link";

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
    <section className={`w-full overflow-hidden ${className}`} aria-label="اخبار">
      <div
        dir="rtl"
        className="ticker-wrapper relative w-full overflow-hidden"
      >
        <div className="ticker-track flex w-max items-center gap-10 py-2">
          {[...items, ...items].map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/news/${item.slug}`}
              className="ticker-item flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              <span className="text-[10px] leading-none text-brand/60">●</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
