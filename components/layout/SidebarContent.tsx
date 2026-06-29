"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Bell, Search, Clock, ShoppingCart } from "lucide-react";
import {
  ICON_STROKE,
  navItems,
  accountItem,
  themeIconClass,
  linkBase,
  linkInactive,
  isActive,
} from "@/config/sidebar.config";
import { SidebarContentProps } from "@/types/sidebar.types";
import SidebarTooltip from "@/components/layout/SidebarTooltip";
import { useEffect, useState, useMemo } from "react";
import { getCurrentUserClient, logout, type AppUser } from "@/lib/auth";
import { useCart } from "@/providers/cart.provider";
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

  useEffect(()=>{ setUser(getCurrentUserClient()); setNow(new Date()); const t=setInterval(()=>setNow(new Date()), 30000); return ()=>clearInterval(t); },[]);
  useEffect(()=>{ const h=()=>setUser(getCurrentUserClient()); window.addEventListener("storage",h); return ()=>window.removeEventListener("storage",h);},[]);

  const notifications = useMemo(()=> getAllAcross().slice(0,6), []);
  const cart = (()=>{ try{ const { useCart:uc } = require("@/providers/cart.provider"); return null;}catch{return null} })();
  // useCart must be inside a client that is under CartProvider – Sidebar is under CartProvider via LayoutShell – safe:
  let cartCount = 0;
  try { /* eslint-disable-next-line react-hooks/rules-of-hooks */ const { count } = require("@/providers/cart.provider").useCart(); cartCount = count; } catch {}
  // fallback – read directly:
  if(typeof window !== "undefined" && cartCount===0){
    try{ const raw = localStorage.getItem("tb_cart_v2"); if(raw){ const arr = JSON.parse(raw); cartCount = arr.reduce((s:number,i:any)=>s+(i.qty||0),0);} }catch{}
  }

  const doSearch = (e?: React.FormEvent)=>{ e?.preventDefault(); if(q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); onLinkClick?.(); } };

  const iconRail = [
    { label: "جستجو", icon: Search, onClick: ()=> { if(!expanded){ const v = prompt("جستجو در تکباکس:"); if(v) router.push(`/search?q=${encodeURIComponent(v)}`);} } },
    { label: "مشاوره VIP", href: "/consultation", icon: null, emoji: "⚡" },
    { label: "سبد خرید", onClick: ()=> { try{ const ev = new CustomEvent("tb_cart_open"); window.dispatchEvent(ev); }catch{} /* CartIconButton handles */ }, badge: cartCount>0 ? String(cartCount) : "", icon: ShoppingCart },
    { label: now ? new Intl.DateTimeFormat("fa-IR",{dateStyle:"full", timeStyle:"short", timeZone:"Asia/Tehran"}).format(now) : "ساعت تهران", icon: Clock },
  ];

  return (
    <div className="relative flex h-full w-full flex-col text-[13px]" dir="rtl">
      {/* Header */}
      <header className="shrink-0 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 shrink-0 relative">
            {onLogoClick ? (
              <SidebarTooltip label="باز/بستن منو" enabled={!expanded}>
                <button onClick={onLogoClick} className="w-10 h-10 rounded-xl overflow-hidden hover:opacity-90 transition-opacity" aria-label="toggle sidebar">
                  <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain" />
                </button>
              </SidebarTooltip>
            ) : (
              <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain" />
            )}
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${expanded ? "max-w-[170px] opacity-100" : "max-w-0 opacity-0"}`}>
            <div className="text-[14px] font-black leading-tight" style={{color:"var(--foreground)"}}>تکباکس</div>
            <div className="text-[10px] leading-tight" style={{color:"var(--muted-foreground)"}}>پاتوق بچه‌های فناوری اطلاعات</div>
          </div>
          {/* notif + cart – always visible, even collapsed */}
          <div className="ms-auto flex items-center gap-1">
            <div className="relative">
              <SidebarTooltip label="اعلان‌ها" enabled={!expanded}>
                <button onClick={()=>setNotifOpen(o=>!o)} className="icon-rail-btn relative" aria-label="notifications">
                  <Bell size={18} />
                  <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                </button>
              </SidebarTooltip>
              {notifOpen && (
                <div className="fixed sm:absolute right-3 sm:right-0 top-20 sm:top-10 w-[320px] max-w-[92vw] card p-3 z-modal text-right" style={{zIndex:500}}>
                  <div className="text-[12px] font-bold mb-2">آخرین رویدادها</div>
                  <ul className="space-y-2 max-h-80 overflow-y-auto text-[11px]">
                    {notifications.map((n:any)=>(
                      <li key={n.slug} className="border-b border-border/40 pb-2 last:border-0">
                        <Link href={`/${n.module}/${n.slug}`} onClick={()=>setNotifOpen(false)} className="hover:text-brand line-clamp-2 leading-5">{n.title}</Link>
                        <div style={{color:"var(--muted-foreground)"}} className="text-[10px] mt-0.5">{n.date_fa} • {n.module}</div>
                      </li>
                    ))}
                  </ul>
                  <button onClick={()=>setNotifOpen(false)} className="text-[10px] text-muted-foreground mt-2 hover:text-foreground w-full text-center">بستن</button>
                </div>
              )}
            </div>
            <SidebarTooltip label={cartCount>0 ? `سبد خرید – ${cartCount} قلم` : "سبد خرید"} enabled={!expanded}>
              <button onClick={()=>{ try{ (document.querySelector('[class*="CartIconButton"]') as HTMLElement)?.click(); }catch{}; /* fallback */ const el=document.querySelector('button[aria-label*="سبد"]') as HTMLElement; el?.click(); const ev = new Event("click"); }} className="icon-rail-btn relative" aria-label="سبد خرید">
                <ShoppingCart size={18} />
                {cartCount>0 && <span className="absolute -top-0.5 -left-0.5 bg-lime-400 text-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 font-bold">{cartCount > 99 ? "۹۹+" : cartCount.toLocaleString("fa-IR")}</span>}
              </button>
            </SidebarTooltip>
          </div>
        </div>

        {/* search – expanded full, collapsed icon */}
        {expanded ? (
          <form onSubmit={doSearch} className="relative">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجو در تکباکس…" className="input !py-2 text-xs pe-8" />
            <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="search">
              <Search size={14} />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <SidebarTooltip label="جستجو" enabled={true}>
              <button onClick={()=>{ const v = prompt("جستجو:"); if(v) router.push(`/search?q=${encodeURIComponent(v)}`); }} className="icon-rail-btn">
                <Search size={18} />
              </button>
            </SidebarTooltip>
          </div>
        )}

        {/* VIP consultation – expanded full, collapsed icon */}
        {expanded ? (
          <Link href="/consultation" onClick={onLinkClick}
            className="w-full rounded-xl text-white text-[12px] font-black py-2.5 text-center shadow-lg hover:brightness-110 transition-all block"
            style={{background:"linear-gradient(135deg,#1e40af 0%, #3b82f6 50%, #0ea5e9 100%)"}}>
            مشاوره VIP ⚡
          </Link>
        ) : (
          <SidebarTooltip label="مشاوره VIP" enabled={true}>
            <Link href="/consultation" onClick={onLinkClick} className="icon-rail-btn" style={{color:"#60a5fa"}}>
              <span className="text-[16px]">⚡</span>
            </Link>
          </SidebarTooltip>
        )}

        {/* theme toggle – font size FIXED to text-xs (was larger than logo) */}
        <SidebarTooltip label={theme==="dark" ? "حالت روز" : "حالت شب"} enabled={!expanded}>
          <button type="button" onClick={onToggleTheme}
            className="group flex w-full items-center text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded-lg h-10">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <Sun className={`h-[18px] w-[18px] absolute transition-all ${theme==="dark" ? "opacity-100 scale-100 text-yellow-400" : "opacity-0 scale-0"}`} />
              <Moon className={`h-[18px] w-[18px] absolute transition-all ${theme==="dark" ? "opacity-0 scale-0" : "opacity-100 scale-100"}`} style={{color:"var(--muted-foreground)"}} />
            </span>
            <span className={`whitespace-nowrap overflow-hidden transition-all ${expanded ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"} text-[11px]`}>
              {theme==="dark" ? "حالت روز" : "حالت شب"}
            </span>
          </button>
        </SidebarTooltip>

        <div className="border-t" style={{borderColor:"var(--border)"}} />
      </header>

      {/* NAV – includes: Home, Blog, News, Media, Shop, Tools, Forum, Review, Download, + RAID Calculator, Subnet Calculator, مشاوره VIP – all from navItems */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="flex flex-col gap-[2px]">
          {navItems.map(item=>{
            const Icon = item.icon as any;
            const active = isActive(pathname, item.href);
            const iconClass = active ? (item.iconActiveClassName || "text-primary") : (item.iconClassName || "text-muted-foreground");
            return (
              <SidebarTooltip key={item.href} label={item.title} enabled={!expanded}>
                <Link href={item.href} onClick={onLinkClick}
                  className={`${linkBase} ${active ? "text-foreground" : linkInactive}`}
                  style={{background: active ? "var(--secondary)" : "transparent", fontSize:"13px"}}
                >
                  {active && <span className="absolute right-0 top-[8px] bottom-[8px] w-[3px] rounded-full" style={{background:"var(--primary)"}} />}
                  <span className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Icon size={19} className={iconClass} strokeWidth={1.75} />
                  </span>
                  <span className={`truncate transition-all ${expanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"}`}>{item.title}</span>
                </Link>
              </SidebarTooltip>
            );
          })}
        </div>
      </nav>

      {/* bottom – date/time + account – collapsed icons included */}
      <div className="shrink-0 border-t px-2 py-2 space-y-2" style={{borderColor:"var(--border)"}}>
        {/* date/time */}
        {expanded ? (
          now && (
            <div className="text-center py-1 rounded-lg" style={{background:"var(--muted)"}}>
              <div className="text-[10px]" style={{color:"var(--muted-foreground)"}}>
                {now.toLocaleDateString("fa-IR", { weekday:"long", timeZone:"Asia/Tehran" })}
              </div>
              <div className="text-[11px] font-mono font-bold" dir="ltr">
                {now.toLocaleTimeString("fa-IR", { hour:"2-digit", minute:"2-digit", second:"2-digit", timeZone:"Asia/Tehran" })}
              </div>
              <div className="text-[10px]" style={{color:"var(--muted-foreground)"}}>
                {now.toLocaleDateString("fa-IR", { year:"numeric", month:"long", day:"numeric", timeZone:"Asia/Tehran" })}
              </div>
            </div>
          )
        ) : (
          <SidebarTooltip
            enabled={true}
            label={now ? `${now.toLocaleDateString("fa-IR",{timeZone:"Asia/Tehran"})} – ${now.toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Tehran"})} تهران` : "ساعت تهران"}
          >
            <button className="icon-rail-btn w-full" aria-label="date time">
              <Clock size={18} />
            </button>
          </SidebarTooltip>
        )}

        {/* account */}
        {user ? (
          <Link href="/account" onClick={onLinkClick}
            className={`${linkBase} ${isActive(pathname,"/account") ? "" : linkInactive}`}
            style={{fontSize:"12px", background: isActive(pathname,"/account") ? "var(--secondary)" : "transparent"}}
          >
            <span className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src={user.avatar || "/assets/hooman.png"} alt={user.name} width={28} height={28} className="rounded-full object-cover" style={{border:"1px solid var(--border)"}} />
            </span>
            <span className={`truncate leading-tight ${expanded ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"} overflow-hidden transition-all`}>
              <span className="block font-bold text-[12px]">{user.name}</span>
              <span className="block text-[10px]" style={{color:"var(--muted-foreground)"}}>{user.role==="super_admin"?"مدیر کل":"ویراستار"}</span>
            </span>
          </Link>
        ) : (
          <SidebarTooltip label="ورود / حساب کاربری" enabled={!expanded}>
            <button onClick={()=>setLoginOpen(true)} className={`${linkBase} ${linkInactive} w-full`} style={{fontSize:"12px"}}>
              <span className="w-10 h-10 flex items-center justify-center">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]" style={{background:"var(--muted)"}}>👤</span>
              </span>
              <span className={`${expanded ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"} truncate transition-all`}>ورود</span>
            </button>
          </SidebarTooltip>
        )}
      </div>

      {/* login modal – z-[500] – fixes “behind feeds” bug */}
      {loginOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{zIndex:500}} dir="rtl">
          <div className="absolute inset-0" style={{background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)"}} onClick={()=>setLoginOpen(false)} />
          <div className="relative card w-full max-w-sm p-5 space-y-3" style={{zIndex:501}}>
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[15px]">ورود به تکباکس</h3>
              <button onClick={()=>setLoginOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <p className="text-[11px]" style={{color:"var(--muted-foreground)"}}>
              حساب تست: <b>sara</b> / <b>nima</b> / <b>rojina</b> / <b>admin</b><br/>رمز همه: <code>techbox123</code>
            </p>
            <a href="/admin/login" onClick={()=>setLoginOpen(false)} className="btn btn-primary w-full text-[13px]">رفتن به ورود کامل →</a>
            <button onClick={()=>setLoginOpen(false)} className="btn btn-ghost w-full text-[11px]">بستن</button>
          </div>
        </div>
      )}
    </div>
  );
}
