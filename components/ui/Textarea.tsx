import * as React from "react";
import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref)=> (
    <textarea ref={ref}
      className={cn(
        "w-full min-h-[110px] bg-[var(--muted)] text-[var(--foreground)]",
        "border border-[var(--border)] rounded-[var(--tb-radius-md)]",
        "px-[14px] py-[10px] text-[13px] leading-6",
        "placeholder:text-[var(--muted-foreground)]/75",
        "focus:outline-none focus:border-[var(--ring)] focus:shadow-[var(--tb-focus-ring)]",
        "transition-[border-color,box-shadow] duration-[var(--tb-duration-fast)]",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName="Textarea";
export default Textarea;
