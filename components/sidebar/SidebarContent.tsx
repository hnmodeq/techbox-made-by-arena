"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ICON_STROKE,
  navItems,
  accountItem,
  themeIconClass,
  linkBase,
  linkInactive,
  isActive,
} from "./sidebar.config";
import { SidebarContentProps } from "./sidebar.types";
import SidebarTooltip from "./SidebarTooltip";

export default function SidebarContent({
  expanded,
  theme,
  onToggleTheme,
  onLogoClick,
  onLinkClick,
}: SidebarContentProps) {
  const pathname = usePathname();

  const renderLink = (item: typeof accountItem) => {
    const Icon = item.icon;
    const active = isActive(pathname, item.href);
    const iconClass = active
      ? item.iconActiveClassName ?? "text-primary"
      : `${item.iconClassName ?? "text-muted-foreground"} ${
          item.iconHoverClassName ?? "group-hover:text-foreground"
        }`;

    return (
      <SidebarTooltip
        key={item.href}
        label={item.title}
        enabled={!expanded}
        tooltipClassName={item.iconActiveClassName}
      >
        <Link
          href={item.href}
          onClick={onLinkClick}
          className={cn(
            linkBase,
            active ? "bg-secondary/40 text-foreground" : linkInactive,
            "w-full justify-start px-1 relative overflow-hidden"
          )}
          aria-label={item.title}
        >
          {active && (
            <div
              className={cn(
                "absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full",
                item.indicatorClassName ?? "bg-primary"
              )}
            />
          )}
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <Icon className={cn("h-5 w-5", iconClass)} strokeWidth={ICON_STROKE} />
            </span>
          </span>
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
              expanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"
            )}
          >
            {item.title}
          </span>
        </Link>
      </SidebarTooltip>
    );
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Header */}
      <header className="shrink-0 p-4">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center justify-start gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              {onLogoClick ? (
                <SidebarTooltip label="باز کردن / بستن منو" enabled={!expanded}>
                  <button
                    type="button"
                    onClick={onLogoClick}
                    className="relative h-10 w-10 rounded-md transition-opacity hover:opacity-80"
                    aria-label="باز/بسته کردن منو"
                  >
                    <Image
                      src="/logo.png"
                      alt="لوگو تکباکس"
                      fill
                      priority
                      sizes="40px"
                      className="rounded-md object-contain"
                    />
                  </button>
                </SidebarTooltip>
              ) : (
                <div className="relative h-10 w-10">
                  <Image
                    src="/logo.png"
                    alt="لوگو تکباکس"
                    fill
                    priority
                    sizes="40px"
                    className="rounded-md object-contain"
                  />
                </div>
              )}
            </div>
            <div
              className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"
              )}
            >
              <p className="truncate text-sm font-bold leading-tight">تکباکس</p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                پاتوق بچه‌های فناوری اطلاعات
              </p>
            </div>
          </div>
          <SidebarTooltip label={theme === "dark" ? "حالت روز" : "حالت شب"} enabled={!expanded}>
            <button
              type="button"
              onClick={onToggleTheme}
              className={cn(
                themeIconClass.buttonBase,
                themeIconClass.buttonClassName,
                themeIconClass.buttonHoverClassName,
                "w-full justify-start px-0 group"
              )}
              aria-label="تغییر تم"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Sun
                    className={cn(
                      "absolute h-5 w-5 transition-all duration-300",
                      theme === "dark"
                        ? "rotate-0 scale-100 opacity-100 text-yellow-400"
                        : "rotate-90 scale-0 opacity-0"
                    )}
                    strokeWidth={ICON_STROKE}
                  />
                  <Moon
                    className={cn(
                      "absolute h-5 w-5 transition-all duration-300",
                      theme === "dark"
                        ? "-rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100 text-slate-600 dark:text-slate-300"
                    )}
                    strokeWidth={ICON_STROKE}
                  />
                </span>
              </span>
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
                  expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
                )}
              >
                {theme === "dark" ? "حالت روز" : "حالت شب"}
              </span>
            </button>
          </SidebarTooltip>
          <div className="my-1 w-full border-t border-border/50" />
        </div>
      </header>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 py-2">
        <div className="my-auto flex flex-col gap-1">
          {navItems.map(renderLink)}
        </div>
      </nav>

      {/* Account */}
      <div className="shrink-0 px-2 py-3">
        {renderLink(accountItem)}
      </div>
    </div>
  );
}
