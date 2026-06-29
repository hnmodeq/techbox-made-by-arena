"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Bell, Search, ShoppingCart } from "lucide-react";
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
import { useEffect, useState } from "react";
import { getCurrentUserClient, logout, type AppUser } from "@/lib/auth";
import { CartIconButton } from "@/components/shop/cart-context";
import { getAllAcross } from "@/lib/content";

export default function SidebarContent({
  expanded,
  theme,
  onToggleTheme,
  onLogoClick,
  onLinkClick,
}: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [q, setQ] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(()=>{ setUser(getCurrentUserClient()); setNow(new Date()); const t=setInterval(()=>setNow(new Date()), 1000*30); return ()=>clearInterval(t); },[]);
  useEffect(()=>{ const h=()=>setUser(getCurrentUserClient()); window.addEventListener("storage",h); return ()=>window.removeEventListener("storage",h);},[]);

  const notifications = getAllAcross().slice(0,5);

  const doSearch = (e: React.FormEvent)=>{
    e.preventDefault();
    if(q.trim()){ router.push(`/search?q=${encodeURIComponent(q.trim())}`); onLinkClick?.(); }
  };

  return (
    <div className="relative flex h-full w-full flex-col" dir="rtl">
      {/* Header */}
      <header className="shrink-0 p-3 space-y-3">
        <div className="flex items-center justify-start gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            {onLogoClick ? (
              <SidebarTooltip label="باز/بستن منو" enabled={!expanded}>
                <button type="button" onClick={onLogoClick} className="relative h-10 w-10 rounded-md hover:opacity-80 transition-opacity" aria-label="toggle">
                  <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain rounded-md" />
                </button>
              </SidebarTooltip>
            ) : (
              <div className="relative h-10 w-10">
                <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain rounded-md" />
              </div>
            )}
          </div>
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"}`}>
            <p className="truncate text-sm font-bold leading-tight">تکباکس</p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">پاتوق بچه‌های فناوری اطلاعات</p>
          </div>
          {/* notif + cart */}
          <div className={`ms-auto flex items-center gap-1 transition-opacity ${expanded ? "opacity-100" : "opacity-0 sm:opacity-0"}`}>
            <div className="relative">
              <button onClick={()=>setNotifOpen(o=>!o)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground" aria-label="اعلان‌ها">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-72 card p-3 z-[300] text-right">
                  <div className="text-xs font-bold mb-2">آخرین رویدادها</div>
                  <ul className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map(n=>(
                      <li key={n.slug} className="text-[11px]">
                        <Link href={`/${n.module}/${n.slug}`} className="hover:text-brand line-clamp-2">{n.title}</Link>
                        <div className="text-muted-foreground">{n.date_fa}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="scale-90"><CartIconButton /></div>
          </div>
        </div>

        {/* search */}
        <div className={`${expanded ? "block" : "hidden sm:hidden"} transition-all`}>
          <form onSubmit={doSearch} className="relative">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجو در تکباکس…" className="input !py-2 text-xs pe-8" />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </form>
        </div>

        {/* VIP consultation */}
        <Link
          href="/consultation"
          onClick={onLinkClick}
          className={`w-full rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-500 text-white text-xs font-bold py-2.5 text-center shadow-glow hover:brightness-110 transition-all ${expanded ? "block" : "hidden"}`}
        >
          مشاوره VIP ⚡
        </Link>

        {/* theme toggle */}
        <SidebarTooltip label={theme==="dark" ? "حالت روز" : "حالت شب"} enabled={!expanded}>
          <button type="button" onClick={onToggleTheme}
            className={`group ${themeIconClass.buttonBase} ${themeIconClass.buttonClassName} ${themeIconClass.buttonHoverClassName} w-full justify-start px-0`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Sun className={`absolute h-5 w-5 transition-all duration-300 ${theme==="dark" ? "rotate-0 scale-100 opacity-100 text-yellow-400" : "rotate-90 scale-0 opacity-0"}`} strokeWidth={ICON_STROKE} />
                <Moon className={`absolute h-5 w-5 transition-all duration-300 ${theme==="dark" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-slate-600 dark:text-slate-300"}`} strokeWidth={ICON_STROKE} />
              </span>
            </span>
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}`}>
              {theme==="dark" ? "حالت روز" : "حالت شب"}
            </span>
          </button>
        </SidebarTooltip>

        <div className="w-full border-t border-border/50" />
      </header>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1">
        <div className="flex flex-col gap-[2px]">
          {navItems.map(item=>{
            const Icon=item.icon;
            const active=isActive(pathname,item.href);
            const iconClass = active ? (item.iconActiveClassName ?? "text-primary") : `${item.iconClassName ?? "text-muted-foreground"} ${item.iconHoverClassName ?? "group-hover:text-foreground"}`;
            return (
              <SidebarTooltip key={item.href} label={item.title} enabled={!expanded} tooltipClassName={item.iconActiveClassName}>
                <Link href={item.href} onClick={onLinkClick}
                  className={`${linkBase} ${active ? "bg-secondary/50 text-foreground" : linkInactive} justify-start px-1 relative overflow-hidden`}>
                  {active && <div className="absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full bg-primary/70" />}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center"><Icon className={`h-5 w-5 ${iconClass}`} strokeWidth={ICON_STROKE} /></span>
                  <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}`}>{item.title}</span>
                </Link>
              </SidebarTooltip>
            );
          })}
        </div>

        {/* tools quick launch */}
        <div className={`mt-4 pt-3 border-t border-border/40 ${expanded ? "block":"hidden"}`}>
          <p className="text-[10px] text-muted-foreground px-2 mb-2">ابزارهای سریع</p>
          <div className="grid grid-cols-2 gap-1.5 px-1 text-[11px]">
            <Link href="/tools?tool=raid" className="rounded-lg border border-border px-2 py-1.5 hover:bg-muted text-center">RAID</Link>
            <Link href="/tools?tool=subnet" className="rounded-lg border border-border px-2 py-1.5 hover:bg-muted text-center">Subnet</Link>
          </div>
        </div>
      </nav>

      {/* bottom: date/time + account */}
      <div className="shrink-0 px-2 py-3 border-t border-border/40 space-y-2">
        {expanded && now && (
          <div className="px-2 text-[10px] text-muted-foreground leading-5 text-center">
            <div>{now.toLocaleDateString("fa-IR", { weekday:"long", year:"numeric", month:"long", day:"numeric", timeZone:"Asia/Tehran" })}</div>
            <div className="font-mono text-[11px] text-foreground" dir="ltr">{now.toLocaleTimeString("fa-IR", { hour:"2-digit", minute:"2-digit", timeZone:"Asia/Tehran" })} Tehran</div>
          </div>
        )}

        {/* account */}
        {user ? (
          <Link href="/account" onClick={onLinkClick}
            className={`${linkBase} ${isActive(pathname, "/account") ? "bg-secondary/40 text-foreground":""} ${linkInactive} justify-start px-1`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <img src={user.avatar || "/assets/hooman.png"} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
            </span>
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${expanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}`}>
              <span className="block text-[12px] font-bold leading-tight truncate">{user.name}</span>
              <span className="block text-[10px] text-muted-foreground truncate">{user.role==="super_admin"?"مدیر":"ویراستار"}</span>
            </span>
          </Link>
        ) : (
          <button
            onClick={()=>setLoginOpen(true)}
            className={`${linkBase} ${linkInactive} w-full justify-start px-1`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px]">👤</span>
            </span>
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 text-xs ${expanded ? "max-w-[140px] opacity-100":"max-w-0 opacity-0"}`}>
              ورود / ثبت‌نام
            </span>
          </button>
        )}
      </div>

      {/* login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setLoginOpen(false)} />
          <div className="relative card w-full max-w-sm p-5 space-y-3 z-10">
            <div className="flex justify-between"><h3 className="font-black">ورود سریع</h3><button onClick={()=>setLoginOpen(false)}>✕</button></div>
            <p className="text-xs text-muted-foreground">نام کاربری آزمایشی: sara / nima / rojina / admin – رمز: techbox123</p>
            <a href="/admin/login" className="btn btn-primary w-full text-sm">رفتن به صفحه ورود کامل</a>
            <button onClick={()=>setLoginOpen(false)} className="btn btn-ghost w-full text-xs">بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}
