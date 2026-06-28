"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  enabled: boolean;
  children: React.ReactNode;
  tooltipClassName?: string;
};

export default function SidebarTooltip({
  label,
  enabled,
  children,
  tooltipClassName = "",
}: Props) {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ right: 0, top: 0 });
  const triggerRef = React.useRef<HTMLSpanElement | null>(null);

  const updatePosition = React.useCallback(() => {
    if (!enabled || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({
      right: window.innerWidth - rect.left + 12,
      top: rect.top + rect.height / 2,
    });
  }, [enabled]);

  const show = () => {
    if (!enabled) return;
    updatePosition();
    setVisible(true);
  };

  const hide = () => setVisible(false);

  React.useEffect(() => {
    if (!visible) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible, updatePosition]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex w-full"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {visible && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none fixed z-[300] whitespace-nowrap rounded-lg bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-xl ring-1 ring-border/50 animate-in fade-in zoom-in-95 duration-200",
            tooltipClassName
          )}
          style={{
            right: pos.right,
            top: pos.top,
            transform: "translateY(-50%)",
          }}
        >
          {label}
        </span>
      )}
    </>
  );
}
