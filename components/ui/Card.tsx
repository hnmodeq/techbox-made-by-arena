import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
  hover?: boolean;
}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = true, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--card)] text-[var(--card-foreground)]",
        "border border-[var(--border)]",
        "rounded-[var(--tb-radius-xl)]",
        "shadow-[var(--tb-shadow)]",
        padding && "p-4 md:p-5",
        hover && "transition-all duration-[var(--tb-duration-normal)] ease-[var(--tb-ease-standard)] hover:shadow-[var(--tb-shadow-md)] hover:-translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = ({className,...p}:React.HTMLAttributes<HTMLDivElement>)=>(
  <div className={cn("mb-3",className)} {...p} />
);
export const CardTitle = ({className,...p}:React.HTMLAttributes<HTMLHeadingElement>)=>(
  <h3 className={cn("text-[16px] md:text-[18px] font-extrabold leading-tight",className)} {...p} />
);
export const CardContent = ({className,...p}:React.HTMLAttributes<HTMLDivElement>)=>(
  <div className={cn("text-[13px] leading-7", "text-[var(--muted-foreground)]", className)} {...p} />
);
export default Card;
