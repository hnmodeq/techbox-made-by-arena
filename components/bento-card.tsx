import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  href?: string;
  color?: string;
  className?: string;
  children?: ReactNode;
};

export default function BentoCard({
  title,
  description,
  href = "#",
  color = "text-foreground",
  className = "",
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background/50 p-6 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/5 hover:border-brand/20",
        className
      )}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-2">
          <h3 className={cn("text-xl font-bold leading-tight transition-colors", color)}>
            {title}
          </h3>
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {children ?? (
            <div className="absolute inset-0 rounded-2xl border border-dashed border-border/40 bg-muted/10 group-hover:bg-muted/20 transition-colors" />
          )}
        </div>
      </div>
      
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
