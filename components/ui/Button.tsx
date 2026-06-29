"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "link";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold select-none " +
  "transition-all duration-[var(--tb-duration-normal)] ease-[var(--tb-ease-standard)] " +
  "focus-visible:outline-none focus-visible:shadow-[var(--tb-focus-ring)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant,string> = {
  primary:   "text-[var(--tb-primary-foreground)] bg-[var(--tb-primary)] hover:brightness-[1.06] active:scale-[0.985] shadow-[var(--tb-shadow-sm)]",
  secondary: "text-[var(--tb-secondary-foreground)] bg-[var(--tb-secondary)] hover:brightness-[1.03]",
  ghost:     "bg-transparent text-[var(--tb-foreground)] hover:bg-[var(--tb-muted)]",
  outline:   "bg-transparent border text-[var(--tb-foreground)] hover:bg-[var(--tb-muted)]",
  danger:    "text-white",
  link:      "bg-transparent underline-offset-4 hover:underline p-0 h-auto"
};

const sizes: Record<Size,string> = {
  sm: "h-8 px-3 text-[11.5px] rounded-[var(--tb-radius-md)]",
  md: "h-10 px-4 text-[13px]  rounded-[var(--tb-radius-lg)]",
  lg: "h-11 px-5 text-[14px]  rounded-[var(--tb-radius-xl)]",
  icon: "h-10 w-10 p-0 rounded-[var(--tb-radius-lg)]"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant="primary", size="md", loading, children, style, ...props }, ref) => {
    const v = variant==="danger" ? {} : {};
    const dangerStyle = variant==="danger" ? { background:"oklch(0.60 0.22 25)", color:"white", borderColor:"transparent" } : {};
    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          "rounded-[var(--tb-radius-lg)]",
          className
        )}
        style={{ ...dangerStyle, ...style, borderColor: variant==="outline" ? "var(--tb-border)" : undefined }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
