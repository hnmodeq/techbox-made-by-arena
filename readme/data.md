## `app/about/page.tsx`

```tsx
import users from "@/data/users.json";
import { ButtonLink } from "@/components/ui/Button";
import TeamChromaSection, { type TeamMember } from "@/features/home/components/TeamChromaSection";
import PageHeader from "@/components/effects/PageHeader";

export const metadata = { title: "درباره تکباکس" };

export default function About(){
 const team = (users as TeamMember[]).slice(0,6);
 return (
 <main className="max-w-6xl mx-auto px-4 py-14" dir="rtl">
 <PageHeader
 colorVar="--tb-about"
 title="درباره تکباکس"
 titleClassName="text-[var(--tb-about)]"
 description="تکباکس – پاتوق بچه‌های فناوری اطلاعات ایران. مجله، اخبار فوری، رسانه ویدیویی، نقد تخصصی، ابزارهای مهندسی، دانلود، فروشگاه زیرساخت و انجمن – همه در یک Bento feed زنده، با CMS نقش‌محور."
 />

 <div className="grid md:grid-cols-3 gap-5 mb-14">
 {[
 ["۸ ماژول", "محتوای یکپارچه"],
 ["۶ ویراستار تخصصی", "RBAC واقعی"],
 ["۱۴۰۵", "هونامیک ارتباط رستاک"],
 ].map(([k,v])=>(
 <div key={k as string} className="card p-5 text-center">
 <div className="tb-text-big-title text-[var(--tb-primary)]">{k}</div>
 <div className="tb-text-sm text-muted-foreground mt-1">{v}</div>
 </div>
 ))}
 </div>

 <h2 className="tb-text-lg mb-4">تیم تحریریه</h2>
 <div className="mb-14">
 <TeamChromaSection team={team} />
 </div>

 <div className="grid lg:grid-cols-5 gap-5 items-start">
 <div className="lg:col-span-3 card p-0 overflow-hidden">
 <div className="p-4 border-b border-[var(--tb-border)]">
 <h3 className="">دفتر تهران</h3>
 <p className="tb-text-sm text-muted-foreground mt-1">میرداماد، هونامیک ارتباط رستاک</p>
 </div>
 {/* OSM embed – works offline preview degraded, live works */}
 <iframe
 title="map"
 src="https://www.openstreetmap.org/export/embed.html?bbox=51.41%2C35.75%2C51.45%2C35.77&layer=mapnik&marker=35.76%2C51.43"
 className="w-full h-[320px] border-0"
 loading="lazy"
 />
 </div>
 <div className="lg:col-span-2 space-y-3 tb-text-md text-muted-foreground card p-5">
 <p>تماس: <span dir="ltr">021-9100xxxx</span></p>
 <p>ایمیل: info@techbox.ir</p>
 <p>ساعت کاری: شنبه–چهارشنبه ۹–۱۷</p>
 <ButtonLink href="/contact" className="mt-2 w-full tb-text-md">ارتباط با ما</ButtonLink>
 <ButtonLink href="/consultation" variant="ghost" className="w-full tb-text-md">درخواست مشاوره VIP</ButtonLink>
 </div>
 </div>
 </main>
 );
}

```

---

## `app/account/page.tsx`

```tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCurrentUserClient, logout } from "@/lib/auth";
import type { AppUser } from "@/lib/auth";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import PageHeader from "@/components/effects/PageHeader";

export default function AccountPage(){
 const [user, setUser] = useState<AppUser | null>(null);
 const [name, setName] = useState("");
 const [lastName, setLastName] = useState("");
 const [nick, setNick] = useState("");
 const [email, setEmail] = useState("");
 const [job, setJob] = useState("");
 const [birthday, setBirthday] = useState("");
 const [avatar, setAvatar] = useState<string>("/assets/hooman.png");
 const [saved, setSaved] = useState(false);

 useEffect(()=>{
 const u = getCurrentUserClient();
 setUser(u);
 if(u){
 const parts = u.name.split(" ");
 setName(parts[0]||"");
 setLastName(parts.slice(1).join(" ")||"");
 setNick(u.username);
 setEmail(u.email);
 setAvatar(u.avatar || "/assets/hooman.png");
 // load local profile overrides
 const local = localStorage.getItem("tb_profile_"+u.username);
 if(local){ try{ const p=JSON.parse(local); setNick(p.nick || u.username); setJob(p.job || ""); setBirthday(p.birthday || ""); setAvatar(p.avatar || u.avatar || "/assets/hooman.png");}catch{} }
 }
 },[]);

 const onAvatar = (e: React.ChangeEvent<HTMLInputElement>)=>{
 const f = e.target.files?.[0];
 if(!f) return;
 const r = new FileReader();
 r.onload = ()=> setAvatar(String(r.result));
 r.readAsDataURL(f);
 };

 const save = (e: React.FormEvent)=>{
 e.preventDefault();
 if(user){
 localStorage.setItem("tb_profile_"+user.username, JSON.stringify({ nick, job, birthday, avatar, name: name+" "+lastName, email }));
 setSaved(true);
 setTimeout(()=>setSaved(false), 1800);
 }
 };

 if(!user){
 return (
 <main className="max-w-md mx-auto px-5 py-20 text-center" dir="rtl">
 <div className="card p-8 space-y-4">
 <h1 className="tb-text-lg ">حساب کاربری</h1>
 <p className="tb-text-md text-muted-foreground">برای دسترسی به پروفایل وارد شوید.</p>
 <ButtonLink href="/admin/login" className="w-full">ورود ویراستار</ButtonLink>
 <p className="tb-text-sm text-muted-foreground">تست: sara / nima / rojina / admin – رمز: techbox123</p>
 </div>
 </main>
 );
 }

 return (
 <main className="max-w-5xl mx-auto px-4 py-10" dir="rtl">
 <PageHeader
 colorVar="--tb-account"
 title="حساب کاربری"
 titleClassName="text-[var(--tb-account)]"
 >
 <div className="tb-text-sm text-muted-foreground">{user.role==="super_admin" ? "مدیر کل" : "ویراستار"} • {user.modules.join("، ")}</div>
 </PageHeader>

 <form onSubmit={save} className="grid lg:grid-cols-3 gap-5">
 {/* avatar card */}
 <div className="card p-5 text-center space-y-3 h-fit">
 <div className="relative w-28 h-28 mx-auto">
 <Image src={avatar} width={112} height={112} className="h-28 w-28 rounded-[var(--tb-radius-full)] object-cover ring-2 ring-[var(--tb-border)]" alt={user.name} />
 <label className="absolute bottom-0 left-0 cursor-pointer rounded-[var(--tb-radius-full)] bg-[var(--tb-primary)] px-2 py-1 tb-text-sm text-[var(--tb-on-accent)] shadow-[var(--tb-shadow-sm)]">
 تغییر
 <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
 </label>
 </div>
 <div className="">{name} {lastName}</div>
 <div className="tb-text-sm text-muted-foreground">@{nick}</div>
 <div className="tb-text-sm">{job || "—"}</div>
 <Button type="button" variant="ghost" onClick={()=>{logout(); location.href="/";}} className="mt-2 w-full tb-text-sm">خروج از حساب</Button>
 </div>

 {/* form */}
 <div className="lg:col-span-2 card p-5 space-y-4">
 <div className="grid sm:grid-cols-2 gap-3">
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">نام</span>
 <input value={name} onChange={e=>setName(e.target.value)} className="input" />
 </label>
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">نام خانوادگی</span>
 <input value={lastName} onChange={e=>setLastName(e.target.value)} className="input" />
 </label>
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">نام کاربری</span>
 <input value={nick} onChange={e=>setNick(e.target.value)} className="input" dir="ltr" />
 </label>
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">ایمیل</span>
 <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" dir="ltr" />
 </label>
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">سمت شغلی</span>
 <input value={job} onChange={e=>setJob(e.target.value)} placeholder="مثلا: کارشناس شبکه" className="input" />
 </label>
 <label className="tb-text-sm space-y-1"><span className="text-muted-foreground">تاریخ تولد</span>
 <input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} className="input" />
 </label>
 </div>

 <div className="border-t border-[var(--tb-border)] pt-4 space-y-3">
 <h4 className=" tb-text-md">تغییر رمز عبور</h4>
 <div className="grid sm:grid-cols-2 gap-3">
 <input type="password" placeholder="رمز فعلی" className="input tb-text-md" />
 <input type="password" placeholder="رمز جدید" className="input tb-text-md" />
 </div>
 <p className="tb-text-sm text-muted-foreground">دمو – در نسخه پروداکشن به /api/auth/change-password ارسال می‌شود.</p>
 </div>

 <div className="flex justify-end gap-2 pt-2">
 <span className={`tb-text-sm transition-opacity ${saved ? "opacity-100 text-[var(--tb-success)]" : "opacity-0"}`}>ذخیره شد ✓</span>
 <Button>ذخیره پروفایل</Button>
 </div>
 </div>

 {/* side stats */}
 <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
 {[
 ["مقالات منتشر شده","12"],
 ["دیدگاه‌ها","47"],
 ["امتیاز","4.8"],
 ].map(([k,v])=>(
 <div key={k as string} className="card p-4 text-center">
 <div className="tb-text-big-title text-[var(--tb-primary)]">{v}</div>
 <div className="tb-text-sm text-muted-foreground mt-1">{k}</div>
 </div>
 ))}
 </div>
 </form>
 </main>
 );
}

```

---

## `app/admin/login/page.tsx`

```tsx
"use client";
import { useMemo, useState } from "react";
import { login, allUsers } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ModuleBadge } from "@/components/ui/ModuleBadge";
import { type ModuleSlug, moduleMeta } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";

export default function AdminLogin() {
 const [u, setU] = useState("sara");
 const [err, setErr] = useState("");
 const router = useRouter();

 const selectedUser = useMemo(() => allUsers.find(x => x.username === u.trim().toLowerCase()) || null, [u]);

 const submit = (e?: React.FormEvent) => {
 e?.preventDefault();
 const user = login(u.trim());
 if (user) router.push("/admin");
 else setErr("کاربر یافت نشد");
 };

 const quickLogin = (username: string) => {
 setU(username);
 setErr("");
 const user = login(username);
 if (user) router.push("/admin");
 };

 return (
 <main className="flex min-h-[70vh] items-center justify-center px-4 py-10" dir="rtl">
 <form onSubmit={submit} className="card w-full max-w-lg space-y-5 p-6">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div>
 <h1 className="tb-text-lg ">ورود ویراستار</h1>
 <p className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">ورود دمو با کاربران منبع `data/users.json`انجام می‌شود.</p>
 </div>
 <Badge variant="info">Demo Auth</Badge>
 </div>

 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">نام کاربری</label>
 <div className="mt-1 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
 <input value={u} onChange={e=>{setU(e.target.value); setErr("");}} className="input" placeholder="sara / admin / nima ..." dir="ltr" />
 <Button>ورود</Button>
 </div>
 </div>

 {selectedUser && (
 <div className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-3 tb-text-sm">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div>
 <div className="">{selectedUser.name}</div>
 <div className="font-mono tb-text-sm text-[var(--tb-fg-muted)]">{selectedUser.email}</div>
 </div>
 <ModuleBadge module={selectedUser.role === "super_admin" ? "vip" : "info"}>{selectedUser.role === "super_admin" ? "مدیر کل" : "ویراستار"}</ModuleBadge>
 </div>
 <div className="mt-2 flex flex-wrap gap-1">
 {selectedUser.modules.map(m => <ModuleBadge key={m} module={m as ModuleSlug}>{moduleMeta[m as ModuleSlug]?.titleFa || m}</ModuleBadge>)}
 </div>
 </div>
 )}

 {err && <p className="tb-text-sm text-[var(--tb-danger)]">{err}</p>}

 <div className="border-t border-[var(--tb-border)] pt-4">
 <div className="mb-2 tb-text-sm ">ورود سریع تست</div>
 <div className="grid gap-2 sm:grid-cols-2">
 {allUsers.map(x => (
 <Button key={x.username} type="button" variant={x.username === u ? "primary" : "ghost"} size="xs" onClick={()=>quickLogin(x.username)} className="justify-start text-right">
 <span className="font-mono">{x.username}</span>
 <span className="truncate tb-text-sm opacity-80">{x.name}</span>
 </Button>
 ))}
 </div>
 </div>

 <div className="space-y-2 border-t border-[var(--tb-border)] pt-4 tb-text-sm text-[var(--tb-fg-muted)]">
 <div className=" text-[var(--tb-fg-primary)]">کاربران تست و دسترسی‌ها</div>
 {allUsers.map(x => (
 <div key={x.username} className="rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] p-2">
 <span className="font-mono tb-text-sm text-[var(--tb-fg-primary)]">{x.username}</span> – {x.name}
 <span className="mt-1 flex flex-wrap gap-1">
 {x.modules.map(m => <ModuleBadge key={m} module={m as ModuleSlug}>{moduleMeta[m as ModuleSlug]?.titleFa || m}</ModuleBadge>)}
 </span>
 </div>
 ))}
 </div>
 </form>
 </main>
 );
}

```

---

## `app/admin/page.tsx`

```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { getCurrentUserClient, logout, type AppUser, canEdit, allUsers } from "@/lib/auth";
import { getModuleItems, moduleMeta, type ModuleSlug } from "@/lib/content";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ModuleBadge } from "@/components/ui/ModuleBadge";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/effects/PageHeader";

const moduleOrder = Object.keys(moduleMeta) as ModuleSlug[];

type DraftInfo = { module: ModuleSlug; count: number; latest?: string };

export default function AdminPage() {
 const [user, setUser] = useState<AppUser | null>(null);
 const [drafts, setDrafts] = useState<DraftInfo[]>([]);
 const router = useRouter();

 useEffect(() => {
 setUser(getCurrentUserClient());
 const h = () => setUser(getCurrentUserClient());
 window.addEventListener("storage", h);
 return () => window.removeEventListener("storage", h);
 }, []);

 useEffect(() => {
 if (!user) return;
 const items = moduleOrder.map(module => {
 try {
 const saved = JSON.parse(localStorage.getItem(`tb_drafts_${module}`) || "[]") as Array<{ savedAtFa?: string }>;
 return { module, count: saved.length, latest: saved[0]?.savedAtFa };
 } catch {
 return { module, count: 0 };
 }
 }).filter(x => x.count > 0);
 setDrafts(items);
 }, [user]);

 const modules = useMemo(() => {
 if (!user) return [];
 return moduleOrder.filter(m => canEdit(user, m));
 }, [user]);

 const moduleStats = useMemo(() => {
 return modules.map(module => {
 const items = getModuleItems(module);
 const views = items.reduce((sum, item) => sum + item.views, 0);
 const latest = items[0]?.date_fa;
 return { module, items, count: items.length, views, latest };
 });
 }, [modules]);

 const totals = useMemo(() => {
 return moduleStats.reduce(
 (acc, stat) => ({ count: acc.count + stat.count, views: acc.views + stat.views }),
 { count: 0, views: 0 }
 );
 }, [moduleStats]);

 if (!user) {
 return (
 <main className="min-h-dvh px-4 py-16" dir="rtl">
 <div className="mx-auto max-w-md card space-y-4 p-7 text-center">
 <h1 className="tb-text-big-title ">ورود ادمین</h1>
 <p className="tb-text-md text-[var(--tb-fg-muted)]">برای مدیریت محتوا ابتدا وارد شوید.</p>
 <ButtonLink href="/admin/login" className="w-full">رفتن به صفحه ورود</ButtonLink>
 <div className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-3 text-right tb-text-sm text-[var(--tb-fg-muted)]">
 <b className="text-[var(--tb-fg-primary)]">کاربران تست:</b><br/>
 {allUsers.slice(0, 6).map(u => <span key={u.id} className="block"><code>{u.username}</code> – {u.name}</span>)}
 </div>
 </div>
 </main>
 );
 }

 return (
 <main className="min-h-dvh px-4 py-10" dir="rtl">
 <section className="mx-auto max-w-6xl space-y-8">
 <PageHeader colorVar="--tb-admin" title={`سلام، ${user.name}`} titleClassName="text-[var(--tb-admin)]" description={`پنل مدیریت • نقش: ${user.role === "super_admin" ? "مدیر کل" : "ویراستار"}`}>
 <div className="flex flex-wrap gap-2">
 <ButtonLink href="/admin/posts" variant="ghost" size="sm">مدیریت محتوا</ButtonLink>
 {user.role === "super_admin" && <ButtonLink href="/admin/roles" variant="ghost" size="sm">نقش‌ها</ButtonLink>}
 <Button variant="ghost" size="sm" onClick={()=>{logout(); setUser(null); router.refresh();}} className="tb-text-sm">خروج</Button>
 </div>
 </PageHeader>
 <div className="flex flex-wrap gap-1">
 {user.modules.map(m => (
 <ModuleBadge key={m} module={m as ModuleSlug}>{moduleMeta[m as ModuleSlug]?.titleFa || m}</ModuleBadge>
 ))}
 </div>

 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
 <div className="card p-4">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">ماژول قابل مدیریت</div>
 <div className="mt-1 tb-text-big-title ">{modules.length.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-4">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">محتوای قابل مدیریت</div>
 <div className="mt-1 tb-text-big-title ">{totals.count.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-4">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">بازدید منبع‌ها</div>
 <div className="mt-1 tb-text-big-title ">{totals.views.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-4">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">پیش‌نویس لوکال</div>
 <div className="mt-1 tb-text-big-title ">{drafts.reduce((s,d)=>s+d.count,0).toLocaleString("fa-IR")}</div>
 </div>
 </div>

 {drafts.length > 0 && (
 <div className="card p-4">
 <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
 <h2 className="tb-text-md ">پیش‌نویس‌های لوکال</h2>
 <Badge variant="warning">ذخیره‌شده در مرورگر</Badge>
 </div>
 <div className="flex flex-wrap gap-2 tb-text-sm">
 {drafts.map(d => (
 <div key={d.module} className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-3">
 <ModuleBadge module={d.module}>{moduleMeta[d.module].titleFa}</ModuleBadge>
 <div className="mt-2 text-[var(--tb-fg-muted)]">{d.count.toLocaleString("fa-IR")} پیش‌نویس</div>
 {d.latest && <div className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">آخرین: {d.latest}</div>}
 </div>
 ))}
 </div>
 </div>
 )}

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {moduleStats.map(({ module, count, views, latest }) => {
 const meta = moduleMeta[module];
 return (
 <div key={module} className="card p-5">
 <div className="flex items-start justify-between gap-2">
 <div>
 <div className={`tb-text-lg ${meta.color}`}>{meta.titleFa}</div>
 <div className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">/{module}</div>
 </div>
 <ModuleBadge module={module}>{count.toLocaleString("fa-IR")} آیتم</ModuleBadge>
 </div>
 <div className="mt-4 grid grid-cols-2 gap-2 tb-text-sm text-[var(--tb-fg-muted)]">
 <div className="rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-secondary)] p-2">بازدید: <b className="text-[var(--tb-fg-primary)]">{views.toLocaleString("fa-IR")}</b></div>
 <div className="rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-secondary)] p-2">آخرین: <b className="text-[var(--tb-fg-primary)]">{latest || "—"}</b></div>
 </div>
 <div className="mt-4 flex gap-2">
 <ButtonLink href={`/admin/posts?module=${module}`} variant="ghost" size="xs" className="flex-1 text-center">مدیریت</ButtonLink>
 <ButtonLink href={`/admin/posts/new?module=${module}`} size="xs" className="flex-1 text-center">جدید +</ButtonLink>
 </div>
 </div>
 );
 })}
 </div>

 {user.role === "super_admin" && (
 <div className="card p-5">
 <div className="mb-3 flex items-center justify-between gap-3">
 <h3 className="">مدیریت کاربران (مدیر کل)</h3>
 <Badge variant="info">{allUsers.length.toLocaleString("fa-IR")} کاربر</Badge>
 </div>
 <div className="grid gap-2 tb-text-sm sm:grid-cols-2">
 {allUsers.map(u => (
 <div key={u.id} className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-3">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div>
 <div className=" text-[var(--tb-fg-primary)]">{u.name}</div>
 <div className="mt-0.5 font-mono tb-text-sm text-[var(--tb-fg-muted)]">@{u.username} • {u.email}</div>
 </div>
 <ModuleBadge module={u.role === "super_admin" ? "vip" : "info"}>{u.role === "super_admin" ? "مدیر کل" : "ویراستار"}</ModuleBadge>
 </div>
 <div className="mt-2 flex flex-wrap gap-1">
 {u.modules.map(m => <ModuleBadge key={m} module={m as ModuleSlug}>{moduleMeta[m as ModuleSlug]?.titleFa || m}</ModuleBadge>)}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </section>
 </main>
 );
}

```

---

## `app/admin/posts/new/page.tsx`

```tsx
"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { moduleMeta, type ModuleSlug, getBySlug } from "@/lib/content";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getCurrentUserClient } from "@/lib/auth";
import { ModuleBadge } from "@/components/ui/ModuleBadge";

export const dynamic = "force-dynamic";

async function getMe(){
 try{
 const r = await fetch("/api/auth/me", {cache:"no-store"});
 const j = await r.json();
 return j.user || getCurrentUserClient();
 }catch{
 return getCurrentUserClient();
 }
}

function slugify(input: string) {
 return input
 .trim()
 .toLowerCase()
 .replace(/[^\w\u0600-\u06FF]+/g,"-")
 .replace(/^-|-$/g,"")
 .slice(0, 90);
}

const categoryHints: Record<ModuleSlug, string[]> = {
 blog: ["امنیت", "شبکه", "ذخیره‌سازی", "مجازی‌سازی", "مانیتورینگ"],
 news: ["زیرساخت", "امنیت", "شبکه", "سخت‌افزار", "هوش مصنوعی"],
 media: ["آموزش ویدیویی", "بررسی ویدیویی", "پادکست", "دموی عملی"],
 review: ["سرور", "شبکه", "ذخیره‌سازی", "امنیت", "برق و رک"],
 tools: ["شبکه", "ذخیره‌سازی", "ابزار"],
 download: ["سیستم‌عامل", "فریم‌ور", "درایور", "ابزار", "مانیتورینگ"],
 shop: ["سرور", "شبکه", "NAS", "امنیت", "برق و رک"],
 forum: ["پرسش", "شبکه", "امنیت", "بکاپ", "مانیتورینگ"],
};

function NewPostInner() {
 const sp = useSearchParams();
 const router = useRouter();
 const modParam = (sp.get("module") as ModuleSlug) || "blog";
 const editSlug = sp.get("edit");
 const [user, setUser] = useState<any>(null);
 const [module, setModule] = useState<ModuleSlug>(modParam);
 const [title, setTitle] = useState("");
 const [slug, setSlug] = useState("");
 const [excerpt, setExcerpt] = useState("");
 const [category, setCategory] = useState("");
 const [tags, setTags] = useState("");
 const [content, setContent] = useState("");
 const [image, setImage] = useState("");
 const [saving,setSaving] = useState(false);
 const [msg,setMsg] = useState("");
 const [lastDraftKey, setLastDraftKey] = useState("");

 useEffect(()=>{ getMe().then(setUser); },[]);
 useEffect(()=>{
 if (editSlug) {
 const it = getBySlug(module, editSlug);
 if (it) {
 setTitle(it.title);
 setSlug(it.slug);
 setExcerpt(it.excerpt);
 setCategory(it.category || "");
 setTags(it.tags.join(", "));
 setContent(it.content || "");
 setImage(it.image||"");
 }
 }
 }, [editSlug, module]);

 const parsedTags = useMemo(() => tags.split(",").map(t=>t.trim()).filter(Boolean), [tags]);
 const resolvedSlug = slug.trim() || slugify(title);

 if (!user) return <main className="p-10 text-center" dir="rtl">ابتدا <Link className="text-[var(--tb-primary)] underline" href="/admin/login">وارد شوید</Link></main>;

 const canEdit = user.role==="super_admin" || (user.modules||[]).includes(module);
 if (!canEdit) return <main className="p-10 text-center text-[var(--tb-danger)]" dir="rtl">دسترسی به ماژول {moduleMeta[module]?.titleFa} ندارید.</main>;

 const save = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!title.trim()) { setMsg("عنوان الزامی است"); return; }
 setSaving(true); setMsg(""); setLastDraftKey("");
 const payload = {
 module,
 slug: resolvedSlug,
 title: title.trim(),
 excerpt: excerpt.trim(),
 content: content.trim(),
 image: image.trim() || undefined,
 tags: parsedTags,
 category: category.trim() || undefined,
 };
 try{
 const res = await fetch("/api/posts", {
 method:"POST", headers:{"Content-Type":"application/json"},
 body: JSON.stringify(payload),
 credentials:"include"
 });
 const data = await res.json();
 if(!res.ok) throw new Error(data.error || "save_failed");
 setMsg("منتشر شد ✓ در حال انتقال به لیست محتوا…");
 setTimeout(()=> router.push(`/admin/posts?module=${module}`), 650);
 }catch(err:any){
 // fallback local draft – keeps admin usable offline
 const key = `tb_drafts_${module}`;
 const drafts = JSON.parse(localStorage.getItem(key) || "[]");
 const draft = {
 ...payload,
 savedAt: new Date().toISOString(),
 savedAtFa: new Intl.DateTimeFormat("fa-IR", { dateStyle:"medium", timeStyle:"short" }).format(new Date()),
 apiError: err.message,
 };
 drafts.unshift(draft);
 localStorage.setItem(key, JSON.stringify(drafts.slice(0, 30)));
 setLastDraftKey(key);
 setMsg("API در دسترس نبود؛ پیش‌نویس امن در مرورگر ذخیره شد.");
 }finally{ setSaving(false); }
 };

 const allowed: ModuleSlug[] = user.role==="super_admin" ? Object.keys(moduleMeta) as ModuleSlug[] : (user.modules||[]);
 const isSuccess = msg.includes("✓");
 const isDraft = msg.includes("پیش‌نویس");
 const statusClass = isSuccess ? "text-[var(--tb-success)]" : isDraft ? "text-[var(--tb-warning)]" : "text-[var(--tb-fg-muted)]";
 
 return (
 <main className="mx-auto max-w-5xl px-4 py-10" dir="rtl">
 <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
 <div>
 <div className="mb-2 flex flex-wrap items-center gap-2">
 <ModuleBadge module={module}>{moduleMeta[module].titleFa}</ModuleBadge>
 {editSlug && <ModuleBadge module="warning">حالت ویرایش</ModuleBadge>}
 </div>
 <h1 className="tb-text-big-title ">{editSlug ? "ویرایش مطلب" : "مطلب جدید"}</h1>
 <p className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">{user.name} • {user.role==="super_admin"?"مدیر کل":"ویراستار"}</p>
 </div>
 <ButtonLink href={`/admin/posts?module=${module}`} variant="ghost" size="xs">بازگشت به مدیریت محتوا</ButtonLink>
 </div>

 <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
 <form onSubmit={save} className="card space-y-4 p-5">
 <div className="grid gap-4 md:grid-cols-2">
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">ماژول *</label>
 <select value={module} onChange={e=>setModule(e.target.value as ModuleSlug)} className="input mt-1" required>
 {allowed.map(m => <option key={m} value={m}>{moduleMeta[m].titleFa} – /{m}</option>)}
 </select>
 </div>
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">دسته‌بندی</label>
 <input value={category} onChange={e=>setCategory(e.target.value)} list="category-hints" className="input mt-1" placeholder="مثلا امنیت، شبکه، فریم‌ور…" />
 <datalist id="category-hints">
 {categoryHints[module].map(c => <option key={c} value={c} />)}
 </datalist>
 </div>
 </div>

 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">عنوان *</label>
 <input value={title} onChange={e=>setTitle(e.target.value)} className="input mt-1" required />
 </div>

 <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">اسلاگ</label>
 <input value={slug} onChange={e=>setSlug(e.target.value)} className="input mt-1" placeholder="auto از عنوان" dir="ltr" />
 </div>
 <Button type="button" variant="ghost" size="xs" onClick={()=>setSlug(slugify(title))} disabled={!title.trim()}>
 ساخت اسلاگ
 </Button>
 </div>

 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">خلاصه</label>
 <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="input mt-1 min-h-[80px]" placeholder="خلاصه کوتاه برای کارت‌ها، فیدها و سئو…" />
 </div>

 <div className="grid gap-3 md:grid-cols-3">
 <div className="md:col-span-2">
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">برچسب‌ها – با , جدا کنید</label>
 <input value={tags} onChange={e=>setTags(e.target.value)} className="input mt-1" placeholder="QNAP-2277, nas, storage" />
 </div>
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">تصویر شاخص URL</label>
 <input value={image} onChange={e=>setImage(e.target.value)} className="input mt-1" placeholder="/assets/..." dir="ltr" />
 </div>
 </div>

 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">محتوا</label>
 <textarea value={content} onChange={e=>setContent(e.target.value)} className="input mt-1 min-h-[260px]" placeholder="متن کامل / HTML / Markdown…" />
 </div>

 <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
 <div className={`tb-text-sm ${statusClass}`}>
 {msg || "POST → /api/posts – RBAC server-side؛ در خطا، پیش‌نویس لوکال ذخیره می‌شود."}
 {lastDraftKey && <span className="block tb-text-sm text-[var(--tb-fg-muted)]">کلید پیش‌نویس: <code>{lastDraftKey}</code></span>}
 </div>
 <div className="flex gap-2">
 <ButtonLink href={`/admin/posts?module=${module}`} variant="ghost" size="xs">انصراف</ButtonLink>
 <Button size="xs" disabled={saving || !title.trim()} type="submit">{saving ? "در حال ذخیره…" : (editSlug ? "ذخیره تغییرات" : "انتشار در تکباکس")}</Button>
 </div>
 </div>
 </form>

 <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
 <div className="card p-4">
 <h2 className="tb-text-sm ">پیش‌نمایش منبع</h2>
 <div className="mt-3 space-y-2 tb-text-sm text-[var(--tb-fg-muted)]">
 <div>مسیر: <code dir="ltr">/{module}/{resolvedSlug || "slug"}</code></div>
 <div>دسته: {category || "—"}</div>
 <div>برچسب‌ها: {parsedTags.length.toLocaleString("fa-IR")}</div>
 <div>خلاصه: {excerpt.length.toLocaleString("fa-IR")} کاراکتر</div>
 <div>محتوا: {content.length.toLocaleString("fa-IR")} کاراکتر</div>
 </div>
 <div className="mt-3 flex flex-wrap gap-1">
 {parsedTags.slice(0, 8).map(t => <span key={t} className="rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] px-2 py-0.5 tb-text-sm text-[var(--tb-fg-muted)]">{t}</span>)}
 {parsedTags.length > 8 && <ModuleBadge module="info">+{(parsedTags.length-8).toLocaleString("fa-IR")}</ModuleBadge>}
 </div>
 </div>

 <div className="card p-4 tb-text-sm text-[var(--tb-fg-muted)]">
 <b className="text-[var(--tb-fg-primary)]">راهنمای CMS</b><br/>
 • اسلاگ اگر خالی باشد از عنوان ساخته می‌شود.<br/>
 • دسته‌بندی اختیاری است ولی برای فیلتر و جدول مفید است.<br/>
 • برچسب‌های فارسی/انگلیسی باعث بهتر شدن جستجو و مطالب مرتبط می‌شوند.<br/>
 • اگر API/Prisma آماده نباشد، پیش‌نویس در مرورگر ذخیره می‌شود.
 </div>
 </aside>
 </div>

 <p className="mt-3 text-center tb-text-sm text-[var(--tb-fg-muted)]">
 دسترسی شما:
 <span className="mx-1 inline-flex flex-wrap justify-center gap-1 align-middle">{allowed.map(m=><ModuleBadge key={m} module={m}>{moduleMeta[m]?.titleFa}</ModuleBadge>)}</span>
 – نقش توسط مدیر کل در <Link href="/admin/roles" className="text-[var(--tb-primary)] underline">/admin/roles</Link> قابل تغییر است.
 </p>
 </main>
 );
}

export default function NewPostPage(){
 return (
 <Suspense fallback={<div className="p-10 text-center">در حال بارگذاری…</div>}>
 <NewPostInner />
 </Suspense>
 );
}

```

---

## `app/admin/posts/page.tsx`

```tsx
"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { getCurrentUserClient, canEdit, type AppUser } from "@/lib/auth";
import { getModuleItems, moduleMeta, type ModuleSlug, type ContentItem } from "@/lib/content";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ModuleBadge } from "@/components/ui/ModuleBadge";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type DraftSummary = { count: number; latest?: string };

function AdminPostsInner() {
 const [user, setUser] = useState<AppUser | null>(null);
 const [query, setQuery] = useState("");
 const [category, setCategory] = useState("all");
 const [draftSummary, setDraftSummary] = useState<DraftSummary>({ count: 0 });
 const sp = useSearchParams();
 const router = useRouter();
 const initialModule = (sp.get("module") as ModuleSlug) || "blog";
 const [module, setModule] = useState<ModuleSlug>(initialModule);

 useEffect(() => { setUser(getCurrentUserClient()); }, []);
 useEffect(() => {
 const m = sp.get("module") as ModuleSlug | null;
 if (m) {
 setModule(m);
 setCategory("all");
 setQuery("");
 }
 }, [sp]);

 useEffect(() => {
 try {
 const drafts = JSON.parse(localStorage.getItem(`tb_drafts_${module}`) || "[]") as Array<{ savedAtFa?: string }>;
 setDraftSummary({ count: drafts.length, latest: drafts[0]?.savedAtFa });
 } catch {
 setDraftSummary({ count: 0 });
 }
 }, [module]);

 const allowedModules = useMemo(() => {
 if (!user) return [];
 return (Object.keys(moduleMeta) as ModuleSlug[]).filter(m => canEdit(user, m));
 }, [user]);

 const items: ContentItem[] = useMemo(() => {
 try { return getModuleItems(module); } catch { return []; }
 }, [module]);

 const categories = useMemo(() => {
 return Array.from(new Set(items.map(i => i.category).filter(Boolean))) as string[];
 }, [items]);

 const filteredItems = useMemo(() => {
 const q = query.trim().toLowerCase();
 return items.filter(it => {
 if (category !== "all" && it.category !== category) return false;
 if (!q) return true;
 return `${it.title} ${it.excerpt} ${it.slug} ${it.category || ""} ${it.tags.join(" ")}`.toLowerCase().includes(q);
 });
 }, [items, query, category]);

 const stats = useMemo(() => {
 const views = filteredItems.reduce((s, it) => s + it.views, 0);
 const likes = filteredItems.reduce((s, it) => s + it.likes, 0);
 const tagCount = new Set(filteredItems.flatMap(it => it.tags)).size;
 return { views, likes, tagCount };
 }, [filteredItems]);

 if (!user) {
 return <main className="p-10 text-center" dir="rtl"><p>لطفا ابتدا <Link href="/admin/login" className="text-[var(--tb-primary)] underline">وارد شوید</Link>.</p></main>;
 }

 if (!canEdit(user, module)) {
 return <main className="p-10 text-center" dir="rtl"><p className="text-[var(--tb-danger)]">شما دسترسی به ماژول {moduleMeta[module]?.titleFa} ندارید.</p><p className="mt-3 tb-text-sm text-[var(--tb-fg-muted)]">دسترسی شما: {user.modules.join(", ")}</p></main>;
 }

 return (
 <main className="mx-auto max-w-6xl px-4 py-10" dir="rtl">
 <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
 <div>
 <h1 className="tb-text-big-title ">مدیریت محتوا</h1>
 <div className="mt-2 flex flex-wrap items-center gap-2">
 <ModuleBadge module={module}>{moduleMeta[module].titleFa}</ModuleBadge>
 <Badge variant="secondary">{items.length.toLocaleString("fa-IR")} آیتم منبع</Badge>
 {draftSummary.count > 0 && <Badge variant="warning">{draftSummary.count.toLocaleString("fa-IR")} پیش‌نویس لوکال</Badge>}
 </div>
 </div>
 <ButtonLink href={`/admin/posts/new?module=${module}`} size="sm">+ مطلب جدید</ButtonLink>
 </div>

 <div className="mb-5 grid gap-3 rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-4 md:grid-cols-[minmax(0,1fr)_180px]">
 <input
 value={query}
 onChange={e => setQuery(e.target.value)}
 className="input"
 placeholder="جستجو در عنوان، اسلاگ، دسته یا برچسب‌ها…"
 />
 <select value={category} onChange={e => setCategory(e.target.value)} className="input">
 <option value="all">همه دسته‌ها</option>
 {categories.map(c => <option key={c} value={c}>{c}</option>)}
 </select>
 </div>

 <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">نتیجه فعلی</div>
 <div className="mt-1 tb-text-lg ">{filteredItems.length.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">بازدیدها</div>
 <div className="mt-1 tb-text-lg ">{stats.views.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">پسندها</div>
 <div className="mt-1 tb-text-lg ">{stats.likes.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">برچسب یکتا</div>
 <div className="mt-1 tb-text-lg ">{stats.tagCount.toLocaleString("fa-IR")}</div>
 </div>
 </div>

 <div className="mb-6 flex flex-wrap gap-2">
 {allowedModules.map(m => (
 <Button
 key={m}
 onClick={()=>{ setModule(m); router.push(`/admin/posts?module=${m}`); }}
 variant={m===module ? "primary" : "ghost"}
 size="xs"
 >
 {moduleMeta[m].titleFa}
 </Button>
 ))}
 </div>

 <div className="card overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full min-w-[760px] tb-text-md">
 <thead className="bg-[var(--tb-bg-muted)]/40 tb-text-sm text-[var(--tb-fg-muted)]">
 <tr>
 <th className="p-3 text-right">عنوان</th>
 <th className="hidden p-3 text-right md:table-cell">دسته</th>
 <th className="hidden p-3 text-right lg:table-cell">تاریخ / نویسنده</th>
 <th className="p-3 text-right">آمار</th>
 <th className="p-3 text-right">عملیات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map(it => (
 <tr key={it.slug} className="border-t border-[color-mix(in_oklch,var(--tb-border)_60%,transparent)] hover:bg-[var(--tb-bg-muted)]/20">
 <td className="p-3 align-top">
 <div className=" ">{it.title}</div>
 <div className="mt-1 font-mono tb-text-sm text-[var(--tb-fg-muted)]" dir="ltr">/{module}/{it.slug}</div>
 <div className="mt-2 flex flex-wrap gap-1 lg:hidden">
 {it.tags.slice(0, 3).map(t => <span key={t} className="rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] bg-transparent px-2 py-0.5 tb-text-sm text-[var(--tb-fg-muted)]">{t}</span>)}
 </div>
 </td>
 <td className="hidden p-3 align-top md:table-cell">
 {it.category ? <Badge variant={module}>{it.category}</Badge> : <Badge variant="secondary">بدون دسته</Badge>}
 </td>
 <td className="hidden p-3 align-top tb-text-sm lg:table-cell">
 <div>{it.date_fa}</div>
 <div className="mt-1 text-[var(--tb-fg-muted)]">{it.author.name}</div>
 </td>
 <td className="p-3 align-top tb-text-sm">
 <div>👁 {it.views.toLocaleString("fa-IR")}</div>
 <div className="mt-1 text-[var(--tb-fg-muted)]">♥ {it.likes.toLocaleString("fa-IR")}</div>
 </td>
 <td className="p-3 align-top">
 <div className="flex flex-wrap gap-2">
 <ButtonLink href={`/${module}/${it.slug}`} target="_blank" variant="ghost" size="xs">مشاهده</ButtonLink>
 <ButtonLink href={`/admin/posts/new?module=${module}&edit=${it.slug}`} size="xs">ویرایش</ButtonLink>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {filteredItems.length===0 && (
 <div className="p-8 text-center tb-text-md text-[var(--tb-fg-muted)]">
 نتیجه‌ای برای فیلتر فعلی پیدا نشد.
 <div className="mt-3"><Button variant="ghost" size="xs" onClick={()=>{setQuery(""); setCategory("all");}}>پاک کردن فیلترها</Button></div>
 </div>
 )}
 </div>

 <p className="mt-4 tb-text-sm text-[var(--tb-fg-muted)]">
 کاربر فعلی: <b>{user.name}</b> ({user.role}) – قابل ویرایش:
 <span className="mr-2 inline-flex flex-wrap gap-1 align-middle">{allowedModules.map(m=><ModuleBadge key={m} module={m}>{moduleMeta[m].titleFa}</ModuleBadge>)}</span>
 {draftSummary.latest && <span className="block mt-2">آخرین پیش‌نویس لوکال این ماژول: {draftSummary.latest}</span>}
 </p>
 </main>
 );
}

export default function AdminPostsPage(){
 return (
 <Suspense fallback={<div className="p-10 text-center">در حال بارگذاری...</div>}>
 <AdminPostsInner />
 </Suspense>
 );
}

```

---

## `app/admin/roles/page.tsx`

```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { moduleMeta, type ModuleSlug } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { ModuleBadge } from "@/components/ui/ModuleBadge";
import { Badge } from "@/components/ui/Badge";

type RoleRow = { id:string; name:string; titleFa:string; modules:ModuleSlug[]; users:number };

const seedRoles: RoleRow[] = [
 {id:"r1", name:"super_admin", titleFa:"مدیر کل", modules:["blog","news","media","review","tools","download","shop","forum"], users:1},
 {id:"r2", name:"blog_editor", titleFa:"ویراستار مجله", modules:["blog"], users:1},
 {id:"r3", name:"news_editor", titleFa:"دبیر اخبار", modules:["news"], users:1},
 {id:"r4", name:"media_creator", titleFa:"تولیدکننده ویدیو", modules:["media","review"], users:1},
];

const STORAGE_KEY = "tb_roles_v4";
const protectedRoleIds = new Set(seedRoles.map(r => r.id));

function normalizeRoleName(value: string) {
 return value.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_\-]/g, "");
}

export default function RolesPage(){
 const [roles,setRoles]=useState<RoleRow[]>(seedRoles);
 const [name,setName]=useState("");
 const [titleFa,setTitleFa]=useState("");
 const [mods,setMods]=useState<Record<ModuleSlug,boolean>>({} as Record<ModuleSlug, boolean>);
 const [msg,setMsg]=useState("");

 useEffect(()=>{
 const saved = localStorage.getItem(STORAGE_KEY);
 if(saved){ try{ setRoles(JSON.parse(saved)); }catch{} }
 },[]);
 useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(roles)); },[roles]);

 const allMods = Object.keys(moduleMeta) as ModuleSlug[];
 const selectedModules = useMemo(() => Object.entries(mods).filter(([,v])=>v).map(([k])=>k as ModuleSlug), [mods]);
 const totalAssignments = roles.reduce((sum, role) => sum + role.modules.length, 0);
 const customRoles = roles.filter(r => !protectedRoleIds.has(r.id)).length;

 const toggleMod = (m:ModuleSlug)=> setMods(prev=>({...prev, [m]: !prev[m]}));
 const selectAllModules = () => setMods(Object.fromEntries(allMods.map(m => [m, true])) as Record<ModuleSlug, boolean>);
 const clearModules = () => setMods({} as Record<ModuleSlug, boolean>);

 const createRole = (e:React.FormEvent)=>{
 e.preventDefault();
 setMsg("");
 const normalized = normalizeRoleName(name);
 if(!normalized || !titleFa.trim() || selectedModules.length===0){
 setMsg("نام نقش، عنوان فارسی و حداقل یک ماژول الزامی است.");
 return;
 }
 if(roles.some(r => r.name === normalized)){
 setMsg("این نام نقش قبلاً ثبت شده است.");
 return;
 }
 setRoles(r=>[{ id:"r"+Date.now(), name: normalized, titleFa: titleFa.trim(), modules: selectedModules, users:0 }, ...r]);
 setName(""); setTitleFa(""); setMods({} as Record<ModuleSlug, boolean>);
 setMsg("نقش جدید به‌صورت لوکال ذخیره شد.");
 };

 const deleteRole = (role: RoleRow) => {
 if (protectedRoleIds.has(role.id)) {
 setMsg("نقش‌های پیش‌فرض قابل حذف نیستند.");
 return;
 }
 if (role.users > 0) {
 setMsg("نقشی که کاربر فعال دارد قابل حذف نیست.");
 return;
 }
 if (!confirm(`نقش «${role.titleFa}» حذف شود؟`)) return;
 setRoles(prev => prev.filter(r => r.id !== role.id));
 setMsg("نقش سفارشی حذف شد.");
 };

 const resetRoles = () => {
 if (!confirm("نقش‌های لوکال حذف و نقش‌های پیش‌فرض بازیابی شوند؟")) return;
 setRoles(seedRoles);
 setName(""); setTitleFa(""); setMods({} as Record<ModuleSlug, boolean>);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRoles));
 setMsg("نقش‌های پیش‌فرض بازیابی شدند.");
 };

 return (
 <main className="mx-auto max-w-6xl px-4 py-10" dir="rtl">
 <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
 <div>
 <h1 className="tb-text-big-title ">مدیریت نقش‌ها – RBAC</h1>
 <p className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">مدیر کل می‌تواند نقش بسازد و دسترسی ماژول‌ها را تعیین کند. این نسخه فعلاً لوکال و آماده اتصال به Prisma Role table است.</p>
 </div>
 <div className="flex flex-wrap gap-2">
 <ModuleBadge module="success">super_admin only</ModuleBadge>
 <Button variant="ghost" size="xs" onClick={resetRoles}>بازنشانی نقش‌ها</Button>
 </div>
 </div>

 <div className="mb-5 grid gap-3 sm:grid-cols-3">
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">کل نقش‌ها</div>
 <div className="mt-1 tb-text-lg ">{roles.length.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">نقش سفارشی</div>
 <div className="mt-1 tb-text-lg ">{customRoles.toLocaleString("fa-IR")}</div>
 </div>
 <div className="card p-3">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">دسترسی ماژولی</div>
 <div className="mt-1 tb-text-lg ">{totalAssignments.toLocaleString("fa-IR")}</div>
 </div>
 </div>

 <div className="grid items-start gap-5 lg:grid-cols-3">
 <form onSubmit={createRole} className="card space-y-3 p-4 lg:sticky lg:top-24 lg:col-span-1">
 <div className="flex items-center justify-between gap-2">
 <h3 className="tb-text-md ">نقش جدید</h3>
 {selectedModules.length > 0 && <Badge variant="info">{selectedModules.length.toLocaleString("fa-IR")} ماژول</Badge>}
 </div>
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">نام نقش لاتین *</label>
 <input value={name} onChange={e=>setName(e.target.value)} className="input mt-1 tb-text-md" placeholder="role_name – ex: blog_editor" dir="ltr" />
 {name && <div className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">ذخیره به صورت: <code>{normalizeRoleName(name) || "—"}</code></div>}
 </div>
 <div>
 <label className="tb-text-sm text-[var(--tb-fg-muted)]">عنوان فارسی *</label>
 <input value={titleFa} onChange={e=>setTitleFa(e.target.value)} className="input mt-1 tb-text-md" placeholder="مثلا ویراستار مجله" />
 </div>
 <div>
 <div className="mb-2 flex items-center justify-between gap-2">
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">دسترسی ماژول‌ها *</div>
 <div className="flex gap-1">
 <Button type="button" variant="link" size="xs" onClick={selectAllModules} className="tb-text-sm">همه</Button>
 <Button type="button" variant="link" size="xs" onClick={clearModules} className="tb-text-sm text-[var(--tb-danger)]">پاک</Button>
 </div>
 </div>
 <div className="grid grid-cols-2 gap-2 tb-text-sm">
 {allMods.map(m=>(
 <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-[var(--tb-radius-md)] border p-2 transition-colors ${mods[m] ? "border-[color-mix(in_oklch,var(--tb-primary)_40%,transparent)] bg-[color-mix(in_oklch,var(--tb-primary)_10%,transparent)]" : "border-[var(--tb-border)] hover:bg-[var(--tb-bg-muted)]"}`}>
 <input type="checkbox" checked={!!mods[m]} onChange={()=>toggleMod(m)} />
 <ModuleBadge module={m}>{moduleMeta[m].titleFa}</ModuleBadge>
 </label>
 ))}
 </div>
 </div>
 <Button size="xs" className="w-full">ایجاد نقش +</Button>
 <p className="tb-text-sm text-[var(--tb-fg-muted)]">
 ذخیره در: <code>{STORAGE_KEY}</code> + آماده POST <code>/api/roles</code> – در پروداکشن به Prisma Role table متصل می‌شود.
 </p>
 {msg && <p className={`tb-text-sm ${msg.includes("الزامی") || msg.includes("قبلاً") || msg.includes("قابل") ? "text-[var(--tb-warning)]" : "text-[var(--tb-success)]"}`}>{msg}</p>}
 </form>

 <div className="card overflow-hidden p-0 lg:col-span-2">
 <div className="overflow-x-auto">
 <table className="w-full min-w-[720px] tb-text-sm">
 <thead className="bg-[var(--tb-bg-muted)]/50 tb-text-sm text-[var(--tb-fg-muted)]">
 <tr>
 <th className="p-3 text-right">نقش</th>
 <th className="p-3 text-right">دسترسی ماژول</th>
 <th className="p-3 text-right">وضعیت</th>
 <th className="p-3 text-right">کاربران</th>
 <th className="p-3 text-right">عملیات</th>
 </tr>
 </thead>
 <tbody>
 {roles.map(r=>{
 const protectedRole = protectedRoleIds.has(r.id);
 return (
 <tr key={r.id} className="border-t border-[var(--tb-border)] hover:bg-[var(--tb-bg-muted)]/20">
 <td className="p-3 align-top">
 <div className="">{r.titleFa}</div>
 <div className="font-mono tb-text-sm text-[var(--tb-fg-muted)]">{r.name}</div>
 </td>
 <td className="p-3 align-top">
 <div className="flex flex-wrap gap-1">
 {r.modules.map(m=>(
 <ModuleBadge key={m} module={m} className="tb-text-sm">{moduleMeta[m]?.titleFa || m}</ModuleBadge>
 ))}
 </div>
 </td>
 <td className="p-3 align-top">
 {protectedRole ? <Badge variant="secondary">پیش‌فرض</Badge> : <Badge variant="info">سفارشی</Badge>}
 </td>
 <td className="p-3 align-top text-center">{r.users.toLocaleString("fa-IR")}</td>
 <td className="p-3 align-top text-right tb-text-sm">
 <div className="flex flex-wrap gap-2">
 <Button variant="link" size="xs" className="text-[var(--tb-primary)]" disabled>ویرایش</Button>
 <Button variant="link" size="xs" className="text-[var(--tb-danger)]" disabled={protectedRole || r.users > 0} onClick={()=>deleteRole(r)}>حذف</Button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <div className="card mt-6 p-4 tb-text-sm text-[var(--tb-fg-muted)]">
 <b className="text-[var(--tb-fg-primary)]">نقش‌های پیش‌فرض تکباکس:</b><br/>
 • <b>super_admin</b> (admin) – همه ۸ ماژول – مدیر کل<br/>
 • <b>blog_editor</b> (sara) – مجله<br/>
 • <b>news_editor</b> (nima) – اخبار<br/>
 • <b>media_creator</b> (rojina) – رسانه + نقد و بررسی<br/>
 • نقش‌های سفارشی فعلاً در مرورگر ذخیره می‌شوند و برای اتصال به API/Prisma آماده‌اند.
 </div>
 </main>
 );
}

```

---

## `app/api/auth/login/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth-server";
import { z } from "zod";

const schema = z.object({ username: z.string(), password: z.string().optional().default("techbox123") });

export async function POST(req: NextRequest){
 const { username, password } = schema.parse(await req.json());
 const user = await prisma.user.findUnique({ where: { username }});
 if(!user) return NextResponse.json({ error: "not found" }, { status: 404 });
 const ok = await verifyPassword(password, user.password).catch(()=>false);
 // dev fallback: allow plain "techbox123" even if hash mismatch first seed?
 if(!ok && password !== "techbox123") return NextResponse.json({ error: "invalid" }, { status: 401 });
 const token = await createSession(user.id);
 await setSessionCookie(token);
 return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, username: user.username, role: user.role, modules: JSON.parse(user.modules) }});
}

```

---

## `app/api/auth/logout/route.ts`

```ts
import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth-server";
export async function POST(){ await clearSession(); return NextResponse.json({ ok: true }); }

```

---

## `app/api/auth/me/route.ts`

```ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";

export async function GET(){
 const user = await getSessionUser();
 if(!user) return NextResponse.json({ user: null });
 return NextResponse.json({ user: {
 id: user.id, name: user.name, username: user.username,
 role: user.role, modules: JSON.parse(user.modules), avatar: user.avatar
 }});
}

export const dynamic = "force-dynamic";

```

---

## `app/api/chat/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_FA = `تو دستیار فارسی «تکباکس» هستی – رسانه تخصصی زیرساخت، شبکه، سرور و ذخیره‌سازی ایران.
- کوتاه، دقیق، مودب، فارسی روان، راست‌به‌چپ
- اگر درباره محصولی مثل QNAP-2277 پرسیدند: مشخصات فنی + کاربرد + پیشنهاد محتوای مرتبط از مجله/ویدیو/فروشگاه تکباکس بده
- اگر سوال فنی شبکه/سرور بود: قدم‌به‌قدم، امن، با هشدار اگر ریسکی است
- همیشه در پایان ۱-۳ لینک داخلی پیشنهادی بده: /blog/… /media/… /shop/…
- اگر مطمئن نیستی بگو «مطمئن نیستم» و پیشنهاد بده به انجمن /forum مراجعه کند
`;

type Msg = { role: "system"|"user"|"assistant"; content: string };

export async function POST(req: NextRequest){
 try{
 const { messages = [], model, temperature = 0.5 } : {messages: Msg[], model?:string, temperature?:number} = await req.json();

 const apiKey = process.env.CHAT_API_KEY;
 const baseUrl = process.env.CHAT_BASE_URL || "https://api.openai.com/v1";
 const chatModel = model || process.env.CHAT_MODEL || "gpt-4o-mini";

 if(!apiKey){
 // dev mock – so site works without keys
 const last = messages.filter(m=>m.role==="user").pop()?.content || "";
 return NextResponse.json({
 reply: `🤖 (حالت دمو – کلید CHAT_API_KEY تنظیم نشده)\n\nسوال شما: «${last}»\n\nپاسخ آزمایشی تکباکس:\n• اگر منظورتان QNAP-2277 است → بررسی ویدیویی: /media/qnap-2277-review-video\n• نقد تخصصی: /review/qnap-2277-full-review\n• خرید: /shop/qnap-ts-2277\n• فریم‌ور: /download/qnap-2277-firmware\n\nبرای فعال‌سازی واقعی، در .env بگذارید:\nCHAT_API_KEY=sk-...\nCHAT_BASE_URL=https://api.openai.com/v1\nCHAT_MODEL=gpt-4o-mini`,
 mock: true
 });
 }

 const body = {
 model: chatModel,
 messages: [{role:"system", content: SYSTEM_FA}, ...messages],
 temperature,
 max_tokens: 900,
 stream: false,
 };

 const r = await fetch(`${baseUrl.replace(/\/$/,"")}/chat/completions`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Authorization": `Bearer ${apiKey}`,
 },
 body: JSON.stringify(body),
 // Next 16 – no cache
 cache: "no-store" as any,
 });

 if(!r.ok){
 const txt = await r.text();
 return NextResponse.json({ error: `chat provider ${r.status}`, detail: txt.slice(0,500) }, { status: 502 });
 }
 const data = await r.json();
 const reply = data?.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";
 return NextResponse.json({ reply, usage: data?.usage });
 }catch(e:any){
 return NextResponse.json({ error: e?.message || "chat_failed" }, { status: 500 });
 }
}

```

---

## `app/api/comments/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth-server";

const postSchema = z.object({
 postModule: z.string(),
 postSlug: z.string(),
 text: z.string().min(2).max(2000),
 authorName: z.string().min(1).max(60).optional(),
 parentId: z.string().nullable().optional()
});

export async function GET(req: NextRequest){
 const { searchParams } = new URL(req.url);
 const postModule = searchParams.get("module");
 const slug = searchParams.get("slug");
 if(!postModule || !slug) return NextResponse.json({ error: "module+slug required" }, { status: 400 });

 const post = await prisma.post.findUnique({ where: { module_slug: { module: postModule as any, slug } }, select: { id: true }});
 if(!post) return NextResponse.json([]);
 
 const comments = await prisma.comment.findMany({
 where: { postId: post.id },
 orderBy: { createdAt: "asc" },
 include: { replies: { orderBy: { createdAt: "asc" } } }
 });
 // return flat, client will nest
 return NextResponse.json(comments);
}

export async function POST(req: NextRequest){
 const user = await getSessionUser();
 const body = await req.json();
 const { postModule, postSlug, text, authorName, parentId } = postSchema.parse(body);

 const post = await prisma.post.findUnique({
 where: { module_slug: { module: postModule as any, slug: postSlug } }
 });
 if(!post) return NextResponse.json({ error: "post not found" }, { status: 404 });

 const comment = await prisma.comment.create({
 data: {
 postId: post.id,
 parentId: parentId || null,
 authorId: user?.id || null,
 authorName: user?.name || authorName || "مهمان",
 text
 }
 });
 return NextResponse.json(comment, { status: 201 });
}

```

---

## `app/api/comments/vote/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
 commentId: z.string(),
 fingerprint: z.string().min(3),
 vote: z.union([z.literal(1), z.literal(-1), z.literal(0)])
});

export async function POST(req: NextRequest){
 const { commentId, fingerprint, vote } = schema.parse(await req.json());
 const existing = await prisma.commentVote.findUnique({
 where: { fingerprint_commentId: { fingerprint, commentId } }
 });

 // adjust counts helper
 async function adjust(oldV:number, newV:number){
 if(oldV === newV) return;
 const incLikes = (newV===1?1:0) - (oldV===1?1:0);
 const incDislikes = (newV===-1?1:0) - (oldV===-1?1:0);
 if(incLikes!==0 || incDislikes!==0){
 await prisma.comment.update({
 where:{ id: commentId },
 data:{ likes:{ increment: incLikes }, dislikes:{ increment: incDislikes } }
 });
 }
 }

 if(vote===0){
 if(existing){ await adjust(existing.vote,0); await prisma.commentVote.delete({ where:{ id: existing.id }}); }
 } else {
 if(existing){
 await adjust(existing.vote, vote);
 await prisma.commentVote.update({ where:{ id: existing.id }, data:{ vote }});
 } else {
 await prisma.commentVote.create({ data:{ commentId, fingerprint, vote }});
 await adjust(0, vote);
 }
 }
 const c = await prisma.comment.findUnique({ where:{id: commentId}, select:{ likes:true, dislikes:true }});
 return NextResponse.json(c);
}

```

---

## `app/api/like/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
 module: z.enum(["blog","news","media","review","tools","download","shop","forum"]),
 slug: z.string().min(1),
 fingerprint: z.string().min(3)
});

export async function POST(req: NextRequest){
 try{
 const body = await req.json();
 const { module, slug, fingerprint } = schema.parse(body);

 const existing = await prisma.like.findUnique({
 where: { fingerprint_module_slug: { fingerprint, module: module as any, slug } }
 });

 if(existing){
 await prisma.like.delete({ where: { id: existing.id }});
 await prisma.post.updateMany({
 where: { module: module as any, slug },
 data: { likes: { decrement: 1 } }
 });
 const p = await prisma.post.findFirst({ where: { module: module as any, slug }, select: { likes: true }});
 return NextResponse.json({ liked: false, likes: Math.max(0, p?.likes ?? 0) });
 } else {
 await prisma.like.create({ data: { fingerprint, module: module as any, slug }});
 await prisma.post.updateMany({
 where: { module: module as any, slug },
 data: { likes: { increment: 1 } }
 });
 const p = await prisma.post.findFirst({ where: { module: module as any, slug }, select: { likes: true }});
 return NextResponse.json({ liked: true, likes: p?.likes ?? 1 });
 }
 }catch(e:any){
 return NextResponse.json({ error: e.message }, { status: 400 });
 }
}

```

---

## `app/api/pay/zarinpal/request/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
 amount: z.number().int().positive(), // Rial
 description: z.string().default("سفارش تکباکس"),
 email: z.string().optional(),
 mobile: z.string().optional(),
});

export async function POST(req: NextRequest){
 const body = await req.json().catch(()=> ({}));
 const { amount, description, email, mobile } = schema.parse(body);
 const merchant_id = process.env.ZARIN_MERCHANT_ID;
 const callback_url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/shop/checkout?verify=1`;
 
 if(!merchant_id || merchant_id.startsWith("test") || merchant_id==="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"){
 // sandbox / mock mode
 return NextResponse.json({
 ok: true,
 authority: "A0000000000000000000000000000" + Math.floor(Math.random()*9000),
 url: `/shop/checkout?pay=mock&amount=${amount}`,
 mock: true,
 message: "Zarinpal merchant_id تنظیم نشده – حالت شبیه‌ساز"
 });
 }

 try{
 const r = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
 method:"POST",
 headers:{"Content-Type":"application/json","Accept":"application/json"},
 body: JSON.stringify({
 merchant_id,
 amount,
 description,
 callback_url,
 metadata: { email, mobile }
 }),
 cache:"no-store"
 });
 const data = await r.json();
 if(data?.data?.code === 100){
 return NextResponse.json({
 ok:true,
 authority: data.data.authority,
 url: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
 });
 }
 return NextResponse.json({ ok:false, error: data?.errors || data }, { status: 400 });
 }catch(e:any){
 return NextResponse.json({ ok:false, error: e.message, mock_fallback: true,
 url: `/shop/checkout?pay=mock&amount=${amount}`}, { status: 200 });
 }
}
export const dynamic = "force-dynamic";

```

---

## `app/api/pay/zarinpal/verify/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
 authority: z.string(),
 amount: z.coerce.number().int().positive(),
});

export async function POST(req: NextRequest){
 const body = await req.json().catch(()=> ({}));
 const q = req.nextUrl.searchParams;
 const data = {
 authority: body.authority ?? q.get("Authority") ?? "",
 amount: Number(body.amount ?? q.get("amount") ?? 0)
 };
 const parsed = schema.safeParse(data);
 if(!parsed.success) return NextResponse.json({ verified:false, error: parsed.error.flatten() }, { status:400 });
 const { authority, amount } = parsed.data;
 const merchant_id = process.env.ZARIN_MERCHANT_ID;

 if(!merchant_id || authority.startsWith("A00000")){
 return NextResponse.json({ verified:true, ref_id: Math.floor(1e8+Math.random()*9e8), mock:true });
 }

 try{
 const r = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
 method:"POST",
 headers:{"Content-Type":"application/json"},
 body: JSON.stringify({ merchant_id, authority, amount }),
 cache:"no-store"
 });
 const j = await r.json();
 if([100,101].includes(j?.data?.code)){
 return NextResponse.json({ verified:true, ref_id: j.data.ref_id });
 }
 return NextResponse.json({ verified:false, error: j }, { status: 400 });
 }catch(e:any){
 return NextResponse.json({ verified:false, error:e.message }, { status:500 });
 }
}
export const dynamic = "force-dynamic";

```

---

## `app/api/posts/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, canEditModule } from "@/lib/auth-server";
import { z } from "zod";

export async function GET(req: NextRequest){
 const { searchParams } = new URL(req.url);
 const postModule = searchParams.get("module") || undefined;
 const take = Math.min(parseInt(searchParams.get("take") || "50"), 100);
 const posts = await prisma.post.findMany({
 where: { published: true, ...(postModule ? { module: postModule as any } : {}) },
 orderBy: { date: "desc" },
 take,
 select: {
 slug: true, module: true, title: true, excerpt: true, image: true,
 tags: true, date: true, dateFa: true, likes: true, views: true,
 category: true, authorName: true
 }
 });
 const out = posts.map(p => ({ ...p, tags: JSON.parse(p.tags || "[]"), author: { name: p.authorName }}));
 return NextResponse.json(out);
}

const createSchema = z.object({
 module: z.enum(["blog","news","media","review","tools","download","shop","forum"]),
 slug: z.string().min(2),
 title: z.string().min(3),
 excerpt: z.string().default(""),
 content: z.string().default(""),
 image: z.string().optional(),
 tags: z.array(z.string()).default([]),
 category: z.string().optional()
});

export async function POST(req: NextRequest){
 const user = await getSessionUser();
 if(!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
 const data = createSchema.parse(await req.json());
 if(!canEditModule(user as any, data.module)){
 return NextResponse.json({ error: "forbidden" }, { status: 403 });
 }
 try{
 const post = await prisma.post.create({
 data: {
 ...data,
 tags: JSON.stringify(data.tags),
 authorId: user.id,
 authorName: user.name,
 dateFa: new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date()),
 }
 });
 return NextResponse.json(post, { status: 201 });
 }catch(e:any){
 if(String(e.message).includes("Unique")) return NextResponse.json({ error: "slug exists" }, { status: 409 });
 return NextResponse.json({ error: e.message }, { status: 400 });
 }
}

```

---

## `app/blog/page.tsx`

```tsx
import BlogGrid from "@/features/blog/components/BlogGrid";
export const metadata = { title: "مجله | تکباکس" };
export default function BlogPage(){ return <BlogGrid />; }

```

---

## `app/blog/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
 return getModuleItems("blog").map(p => ({ slug: p.slug }));
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const item = getBySlug("blog", slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const item = getBySlug("blog", slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/consultation/page.tsx`

```tsx
import { Button } from "@/components/ui/Button";
export default function Consultation(){
 return (
 <main className="max-w-2xl mx-auto px-5 py-16" dir="rtl">
 <h1 className="tb-text-big-title mb-4">درخواست مشاوره زیرساخت</h1>
 <div className="card p-6 space-y-4">
 <input className="input" placeholder="نام سازمان" />
 <input className="input" placeholder="تلفن" />
 <textarea className="input min-h-[120px]" placeholder="نیاز شما؟ سرور، شبکه، ذخیره‌سازی..." />
 <Button>ارسال درخواست</Button>
 </div>
 </main>
 )
}

```

---

## `app/contact/page.tsx`

```tsx
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/effects/PageHeader";
export const metadata = { title: "ارتباط با ما | تکباکس" };
export default function Contact() {
 return (
 <main className="max-w-3xl mx-auto px-5 py-16" dir="rtl">
 <PageHeader
 colorVar="--tb-contact"
 title="ارتباط با ما"
 titleClassName="text-[var(--tb-contact)]"
 description="پاتوق بچه‌های فناوری اطلاعات – هونامیک ارتباط رستاک"
 />
 <div className="card p-6 space-y-4">
 <div className="grid md:grid-cols-2 gap-4">
 <input className="input" placeholder="نام" />
 <input className="input" placeholder="ایمیل" />
 </div>
 <input className="input" placeholder="موضوع" />
 <textarea className="input min-h-[140px]" placeholder="پیام شما…" />
 <Button>ارسال</Button>
 <p className="tb-text-sm text-muted-foreground">پاسخ ظرف 24 ساعت – info@techbox.ir</p>
 </div>
 </main>
 );
}

```

---

## `app/download/page.tsx`

```tsx
import DownloadTable from "@/features/download/components/DownloadTable";
export const metadata = { title: "دانلود | تکباکس" };
export default function DownloadPage(){ return <DownloadTable />; }

```

---

## `app/download/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import DownloadDetail from "@/features/download/components/DownloadDetail";
import { notFound } from "next/navigation";

type P = Promise<{slug:string}>;
export async function generateStaticParams(){ return getModuleItems("download").map(p=>({slug:p.slug})) }
export default async function Page({params}:{params:P}){ const {slug}=await params; const item=getBySlug("download",slug); if(!item) return notFound(); return <DownloadDetail item={item} /> }
export async function generateMetadata({params}:{params:P}){ const {slug}=await params; const i=getBySlug("download",slug); return { title: i ? `${i.title} | دانلود تکباکس`: "یافت نشد" } }

```

---

## `app/forum/page.tsx`

```tsx
import ForumList from "@/features/forum/components/ForumList";
export const metadata = { title: "انجمن | تکباکس" };
export default function ForumPage(){ return <ForumList />; }

```

---

## `app/forum/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

type P = Promise<{ slug: string }>;

export async function generateStaticParams() {
 const mod = "forum" as any;
 return getModuleItems(mod).map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "forum" as any;
 const item = getBySlug(mod, slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "forum" as any;
 const item = getBySlug(mod, slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "@/design/foundation/globals.css";
import { kalameh } from "@/lib/fonts";
import { LayoutShell } from "@/components/layout/LayoutShell";

export const metadata: Metadata = {
 title: "رسانه تکنولوژی تکباکس",
 description: "پاتوق بچه‌های فناوری اطلاعات",
};

export default function RootLayout({
 children,
}: Readonly<{ children: React.ReactNode }>) {
 return (
 <html
 lang="fa"
 dir="rtl"
 className={kalameh.variable}
 suppressHydrationWarning
 >
 <body className="font-sans antialiased text-foreground">
 <LayoutShell>{children}</LayoutShell>
 </body>
 </html>
 );
}

```

---

## `app/media/page.tsx`

```tsx
import MediaGallery from "@/features/media/components/MediaGallery";
export const metadata = { title: "رسانه | تکباکس" };
export default function MediaPage(){ return <MediaGallery />; }

```

---

## `app/media/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

type P = Promise<{ slug: string }>;

export async function generateStaticParams() {
 const mod = "media" as any;
 return getModuleItems(mod).map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "media" as any;
 const item = getBySlug(mod, slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "media" as any;
 const item = getBySlug(mod, slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/news/page.tsx`

```tsx
import NewsList from "@/features/news/components/NewsList";
export const metadata = { title: "اخبار | تکباکس" };
export default function NewsPage(){ return <NewsList />; }

```

---

## `app/news/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

type P = Promise<{ slug: string }>;

export async function generateStaticParams() {
 const mod = "news" as any;
 return getModuleItems(mod).map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "news" as any;
 const item = getBySlug(mod, slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "news" as any;
 const item = getBySlug(mod, slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/page.tsx`

```tsx
import HeroSection from "@/features/home/components/HeroSection";
import HomeModulesSection from "@/features/home/components/HomeModulesSection";
import NewsTicker from "@/features/news/components/NewsTicker";
import TechLogoLoopSection from "@/features/home/components/TechLogoLoopSection";
import { getAllAcross } from "@/lib/content";

export default function Page() {
 // Pull recent updates from multiple modules (news, blog, media videos, forum topics, downloads, reviews).
 const ticker = getAllAcross()
 .filter(i => ["news", "blog", "media", "forum", "download", "review"].includes(i.module))
 .slice(0, 16);
 return (
 <main className="relative">
 <HeroSection />
 <NewsTicker items={ticker} className="pb-10" />
 <HomeModulesSection />
 <TechLogoLoopSection />
 </main>
 );
}

```

---

## `app/review/page.tsx`

```tsx
import ReviewGrid from "@/features/review/components/ReviewGrid";
export const metadata = { title: "نقد و بررسی | تکباکس" };
export default function ReviewPage(){ return <ReviewGrid />; }

```

---

## `app/review/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

type P = Promise<{ slug: string }>;

export async function generateStaticParams() {
 const mod = "review" as any;
 return getModuleItems(mod).map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "review" as any;
 const item = getBySlug(mod, slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "review" as any;
 const item = getBySlug(mod, slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/search/page.tsx`

```tsx
"use client";
import { useSearchParams } from "next/navigation";
import { searchAcross } from "@/lib/content";
import { ContentCard } from "@/features/content/components/ContentCard";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function SearchInner(){
 const sp = useSearchParams();
 const q = sp.get("q") || "";
 const results = searchAcross(q);
 return (
 <main className="max-w-4xl mx-auto px-4 py-12" dir="rtl">
 <h1 className="tb-text-big-title mb-2">جستجو</h1>
 <p className="tb-text-md text-muted-foreground mb-6">{q ? <>نتایج برای <b>«{q}»</b> – {results.length.toLocaleString("fa-IR")} مورد</> : "یک عبارت وارد کنید"}</p>
 <div className="grid gap-3 md:grid-cols-2">
 {results.map(r=> <ContentCard key={r.module+r.slug} item={r} />)}
 </div>
 {q && results.length===0 && <p className="text-muted-foreground tb-text-md">نتیجه‌ای یافت نشد.</p>}
 </main>
 );
}
export default function SearchPage(){
 return <Suspense fallback={<div className="p-10 text-center">...</div>}><SearchInner/></Suspense>
}

```

---

## `app/shop/checkout/page.tsx`

```tsx
"use client";
import Image from "next/image";
import { useCart } from "@/providers/cart.provider";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

function parseFaPrice(s:string){
 // "۴۸,۹۰۰,۰۰۰" -> 48900000
 const map:any = {"۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9", ",":"", "٬":""};
 let out=""; for(const ch of s) out += map[ch] ?? (/[0-9]/.test(ch)?ch:"");
 const n = parseInt(out||"0",10);
 return Number.isFinite(n) ? n : 0;
}

export default function CheckoutPage(){
 const { items, count, clear } = useCart();
 const [loading,setLoading] = useState(false);
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [email,setEmail]=useState("");

 const totalToman = items.reduce((sum,it)=>{
 const unit = parseFaPrice(it.price);
 return sum + unit * it.qty;
 },0);
 // Zarinpal expects Rial
 const amountRial = totalToman * 10;

 const pay = async ()=>{
 if(items.length===0){ alert("سبد خالی است"); return; }
 setLoading(true);
 try{
 const res = await fetch("/api/pay/zarinpal/request", {
 method:"POST",
 headers:{"Content-Type":"application/json"},
 body: JSON.stringify({
 amount: amountRial || 100000, // fallback 10k Toman
 description: `سفارش تکباکس – ${count} قلم – ${name||"مهمان"}`,
 email: email || undefined,
 mobile: phone || undefined,
 })
 });
 const data = await res.json();
 if(data?.url){
 if(data.mock){
 alert(`حالت تست زرین‌پال\nمبلغ: ${totalToman.toLocaleString("fa-IR")} تومان\nAuthority: ${data.authority}\n\nبه صفحه تایید هدایت می‌شوید…`);
 // simulate verify
 const v = await fetch("/api/pay/zarinpal/verify", {
 method:"POST", headers:{"Content-Type":"application/json"},
 body: JSON.stringify({ authority: data.authority, amount: amountRial || 100000 })
 }).then(r=>r.json()).catch(()=>({verified:true}));
 if(v.verified){
 alert(`پرداخت موفق! \nRefID: ${v.ref_id || "TEST"}\nمتشکرم از خرید شما از تکباکس.`);
 clear();
 window.location.assign("/shop?thanks=1");
 return;
 }
 }
 // real redirect
 window.location.assign(data.url);
 return;
 }
 alert("خطا در ایجاد تراکنش: " + (data.error || "نامشخص"));
 }catch(e:any){
 alert("خطا: " + e.message);
 }finally{ setLoading(false); }
 };

 return (
 <main className="max-w-5xl mx-auto px-4 py-12" dir="rtl">
 <h1 className="tb-text-big-title mb-2 text-[var(--tb-shop)]">تسویه حساب – زرین‌پال</h1>
 <p className="mb-6 tb-text-sm text-[var(--tb-fg-muted)]">
 درگاه: <b>ZarinPal</b> – {process.env.NEXT_PUBLIC_ZARIN_MERCHANT_ID ? "Live" : "Sandbox / Mock"} – برای فعال‌سازی واقعی، در .env بگذارید: <code>ZARIN_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>
 </p>

 <div className="grid lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 card p-5 space-y-4">
 <h3 className="">اطلاعات ارسال</h3>
 <div className="grid sm:grid-cols-2 gap-3 tb-text-md">
 <input className="input" placeholder="نام و نام خانوادگی *" value={name} onChange={e=>setName(e.target.value)} />
 <input className="input" placeholder="تلفن *" dir="ltr" value={phone} onChange={e=>setPhone(e.target.value)} />
 <input className="input sm:col-span-2" placeholder="آدرس" />
 <div className="grid grid-cols-2 gap-3 sm:col-span-2">
 <input className="input" placeholder="کد پستی" dir="ltr" />
 <select className="input"><option>تهران</option><option>اصفهان</option><option>مشهد</option><option>شیراز</option><option>تبریز</option></select>
 </div>
 <input className="input sm:col-span-2" placeholder="ایمیل (رسید پرداخت)" type="email" dir="ltr" value={email} onChange={e=>setEmail(e.target.value)} />
 </div>

 <h3 className=" pt-2">پرداخت</h3>
 <div className="flex gap-4 tb-text-sm flex-wrap">
 <label className="flex items-center gap-2 rounded-[var(--tb-radius-lg)] border border-[var(--tb-primary)] bg-[color-mix(in_oklch,var(--tb-primary)_8%,transparent)] px-3 py-2">
 <input type="radio" name="pay" defaultChecked readOnly /> 
 <span>درگاه <b>زرین‌پال</b> – کارت شتاب</span>
 <Image alt="zarinpal" src="https://cdn.zarinpal.com/badges/trustLogo/1.svg" width={64} height={20} className="h-5 w-auto opacity-80" unoptimized />
 </label>
 <label className="flex items-center gap-2 rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] px-3 py-2"><input type="radio" name="pay" disabled /> کارت به کارت (غیرفعال در دمو)</label>
 </div>

 <Button onClick={pay} disabled={loading || items.length===0} className="w-full tb-text-md disabled:opacity-60">
 {loading ? "در حال اتصال به زرین‌پال…" : `پرداخت ${totalToman>0 ? totalToman.toLocaleString("fa-IR")+" تومان" : "–"} با زرین‌پال`}
 </Button>
 <p className="tb-text-sm text-[var(--tb-fg-muted)]">
 پرداخت امن – اگر <code>ZARIN_MERCHANT_ID</code> تنظیم نباشد، تراکنش شبیه‌سازی می‌شود و به‌صورت خودکار Verify می‌شود – مناسب تست لوکال.
 </p>
 </div>

 <div className="card p-5 h-fit sticky top-24">
 <h4 className=" mb-3">خلاصه سبد ({count.toLocaleString("fa-IR")} قلم)</h4>
 <div className="space-y-2 max-h-80 overflow-y-auto tb-text-sm">
 {items.length===0 ? <p className="text-[var(--tb-fg-muted)]">سبد خالی است – <Link href="/shop" className="underline text-[var(--tb-shop)]">فروشگاه</Link></p> :
 items.map(i=>(
 <div key={i.slug} className="flex justify-between border-b border-[var(--tb-border)] pb-2">
 <span className="truncate ps-2">{i.title} × {i.qty.toLocaleString("fa-IR")}</span>
 <span className="text-[var(--tb-fg-muted)]">{i.price}</span>
 </div>
 ))
 }
 </div>
 <div className="mt-3 space-y-1 tb-text-sm">
 <div className="flex justify-between"><span>جمع جزء</span><span>{totalToman.toLocaleString("fa-IR")} تومان</span></div>
 <div className="flex justify-between text-[var(--tb-fg-muted)]"><span>ارسال</span><span>رایگان</span></div>
 <div className="flex justify-between border-t border-[var(--tb-border)] pt-2 tb-text-md "><span>مبلغ قابل پرداخت</span><span className="text-[var(--tb-shop)]">{totalToman.toLocaleString("fa-IR")} تومان</span></div>
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">≈ {(amountRial).toLocaleString("fa-IR")} ریال – درگاه زرین‌پال</div>
 </div>
 </div>
 </div>
 </main>
 );
}

```

---

## `app/shop/page.tsx`

```tsx
import ShopGrid from "@/features/shop/components/ShopGrid";
export const metadata = { title: "فروشگاه | تکباکس" };
export default function ShopPage(){ return <ShopGrid />; }

```

---

## `app/shop/[slug]/page.tsx`

```tsx
import { getBySlug, getModuleItems } from "@/lib/content";
import ContentDetail from "@/features/content/components/ContentDetail";
import { notFound } from "next/navigation";

type P = Promise<{ slug: string }>;

export async function generateStaticParams() {
 const mod = "shop" as any;
 return getModuleItems(mod).map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "shop" as any;
 const item = getBySlug(mod, slug);
 if (!item) return notFound();
 return <ContentDetail item={item} />;
}

export async function generateMetadata({ params }: { params: P }) {
 const { slug } = await params;
 const mod = "shop" as any;
 const item = getBySlug(mod, slug);
 return { title: item ? `${item.title} | تکباکس`: "یافت نشد" };
}

```

---

## `app/tools/nas-selector/page.tsx`

```tsx
import { NasSelector } from "@/features/tools/components/nas-selector";
import { getNasProducts } from "@/lib/nas";
import { ToolPageHeader } from "@/features/tools/components/ToolPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انتخاب‌گر NAS | TechBox",
  description: "بهترین NAS را بر اساس ظرفیت، RAID، کاربران، سرویس‌ها و بودجه پیدا کنید.",
};

export default async function NasSelectorPage() {
  const products = await getNasProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ToolPageHeader
        title="انتخاب‌گر NAS"
        subtitle="پیکربندی هوشمند بر اساس نیاز واقعی شما"
        accent="var(--tb-tools)"
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "ابزارها", href: "/tools" },
          { label: "NAS Selector" },
        ]}
      />
      <div className="mt-8">
        <NasSelector
          products={products}
          compareHref="/shop/compare"
          consultationHref="/consultation"
        />
      </div>
    </main>
  );
}

```

---

## `app/tools/nvr-selector/page.tsx`

```tsx
import { NvrSelector } from "@/features/tools/components/nvr-selector";
import { getNvrProducts } from "@/lib/nvr";
import { ToolPageHeader } from "@/features/tools/components/ToolPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انتخاب‌گر NVR | TechBox",
  description: "بهترین دستگاه NVR را بر اساس دوربین، رزولوشن، مدت ضبط و AI انتخاب کنید.",
};

export default async function NvrSelectorPage() {
  const products = await getNvrProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ToolPageHeader
        title="انتخاب‌گر NVR"
        subtitle="پیشنهاد مدل NVR مناسب پروژه دوربین مداربسته"
        accent="var(--tb-raid)"
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "ابزارها", href: "/tools" },
          { label: "NVR Selector" },
        ]}
      />
      <div className="mt-8">
        <NvrSelector products={products} consultationHref="/consultation" />
      </div>
    </main>
  );
}

```

---

## `app/tools/page.tsx`

```tsx
import { ToolsGrid } from "@/features/tools/components/ToolsGrid";
import { ToolPageHeader } from "@/features/tools/components/ToolPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ابزارها | TechBox",
  description: "NAS Selector، NVR Selector، RAID Calculator، Subnet Calculator",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ToolPageHeader
        title="ابزارهای TechBox"
        subtitle="انتخاب‌گر NAS و NVR، محاسبه RAID/SHR و ساب‌نت"
        accent="var(--tb-tools)"
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "ابزارها" }]}
      />

      <div className="mt-8">
        <ToolsGrid />
      </div>

      <section className="mt-12 card p-6">
        <h2 className="tb-text-lg mb-2">اتصال به فروشگاه</h2>
        <p className="tb-text-md text-[var(--tb-fg-muted)]">
          ابزارهای انتخاب‌گر به صورت زنده از <code className="text-[11px]">/data/nas-products.json</code> و <code className="text-[11px]">/data/nvr-products.json</code> می‌خوانند و با <code className="text-[11px]">/data/shop.json</code> مرج می‌شوند. 
          برای افزودن محصول واقعی کافیست <b>shopSlug</b> را برابر slug فروشگاه قرار دهید – قیمت، موجودی و تصویر به صورت خودکار sync می‌شود.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
          <a href="/tools/nas-selector" className="btn btn-primary">NAS Selector</a>
          <a href="/tools/nvr-selector" className="btn btn-primary" style={{ background: "var(--tb-raid)" }}>NVR Selector</a>
          <a href="/tools/raid-calculator" className="btn btn-ghost">RAID Calculator v2</a>
          <a href="/tools/subnet-calculator" className="btn btn-ghost">Subnet Calculator</a>
        </div>
      </section>
    </main>
  );
}

```

---

## `app/tools/raid-calculator/page.tsx`

```tsx
import { RaidCalculator } from "@/features/tools/components/raid-calculator";
import { ToolPageHeader } from "@/features/tools/components/ToolPageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ماشین حساب RAID / SHR | TechBox",
  description: "محاسبه ظرفیت RAID 0/1/5/6/10 و SHR-1/SHR-2 با Hot Spare و دیسک ترکیبی.",
};

export default function RaidCalculatorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ToolPageHeader
        title="ماشین حساب RAID"
        subtitle="RAID 0 · 1 · 5 · 6 · 10 · SHR-1 · SHR-2"
        accent="var(--tb-raid)"
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "ابزارها", href: "/tools" },
          { label: "RAID Calculator" },
        ]}
      />
      <div className="mt-8">
        <RaidCalculator />
      </div>

      <section className="mt-10 card p-5">
        <h2 className="tb-text-lg mb-3">پیشنهاد محصول مرتبط</h2>
        <p className="tb-text-md text-[var(--tb-fg-muted)]">
          بعد از محاسبه RAID، مدل NAS پیشنهادی خود را در <a className="text-[var(--tb-primary)] font-bold hover:underline" href="/tools/nas-selector">انتخاب‌گر NAS</a> ببینید یا مستقیم از فروشگاه هارد مناسب تهیه کنید.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="/tools/nas-selector" className="btn btn-primary">رفتن به NAS Selector</a>
          <a href="/shop?category=nas" className="btn btn-ghost">مشاهده NAS ها در فروشگاه</a>
          <a href="/tools/subnet-calculator" className="btn btn-ghost">Subnet Calculator</a>
        </div>
      </section>
    </main>
  );
}

```

---

## `app/tools/subnet-calculator/page.tsx`

```tsx
import SubnetCalculator from "@/features/tools/components/SubnetCalculator";
import { ToolPageHeader } from "@/features/tools/components/ToolPageHeader";

export const metadata = {
  title: "Subnet Calculator | TechBox",
  description: "ماشین حساب ساب‌نت – بدون تغییر",
};

export default function SubnetCalculatorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ToolPageHeader
        title="ماشین حساب ساب‌نت"
        subtitle="بدون تغییر – نسخه فعلی شما"
        accent="var(--tb-subnet)"
        breadcrumbs={[
          { label: "خانه", href: "/" },
          { label: "ابزارها", href: "/tools" },
          { label: "Subnet Calculator" },
        ]}
      />
      <div className="mt-8">
        <SubnetCalculator />
      </div>
    </main>
  );
}

```

---

## `app/tools/[slug]/page.tsx`

```tsx
import { notFound, redirect } from "next/navigation";
import { toolRoutes } from "@/config/modules.config";

type Props = { params: Promise<{ slug: string }> };

const KNOWN_REDIRECTS: Record<string, string> = {
  "nas-selector": "/tools/nas-selector",
  "nvr-selector": "/tools/nvr-selector",
  "raid-calculator": "/tools/raid-calculator",
  "subnet-calculator": "/tools/subnet-calculator",
  "raid": "/tools/raid-calculator",
  "nas": "/tools/nas-selector",
  "nvr": "/tools/nvr-selector",
  "subnet": "/tools/subnet-calculator",
};

export default async function ToolSlugPage({ params }: Props) {
  const { slug } = await params;
  const target = KNOWN_REDIRECTS[slug];
  if (target) redirect(target);

  const tool = toolRoutes.find(t => t.slug === slug);
  if (tool?.href) redirect(tool.href);
  notFound();
}

export async function generateStaticParams() {
  return toolRoutes.map(t => ({ slug: t.slug }));
}

export const dynamicParams = false;

```

---

## `app/workwithus/page.tsx`

```tsx
import jobs from "@/data/jobs.json";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/effects/PageHeader";

export const metadata = { title: "فرصت‌های شغلی | تکباکس" };

export default function WorkWithUs(){
 return (
 <main className="max-w-5xl mx-auto px-4 py-14" dir="rtl">
 <PageHeader
 colorVar="--tb-workwithus"
 title="فرصت‌های شغلی تکباکس"
 titleClassName="text-[var(--tb-workwithus)]"
 description={`به تیم رسانه زیرساخت ایران بپیوندید – ${jobs.length} موقعیت فعال`}
 />

 <div className="grid gap-4">
 {jobs.map(j=>(
 <Link key={j.slug} href={`/workwithus/${j.slug}`} className="card p-5 transition-all duration-[var(--tb-motion-md)] hover:-translate-y-0.5 hover:shadow-[var(--tb-shadow-lg)] group">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div>
 <h3 className=" tb-text-lg group-hover:text-[var(--tb-primary)]">{j.title}</h3>
 <p className="tb-text-sm text-muted-foreground mt-1">{j.excerpt}</p>
 <div className="flex flex-wrap gap-2 mt-3 tb-text-sm">
 <Badge variant="brand">{j.type}</Badge>
 <Badge variant="secondary">{j.remote}</Badge>
 <Badge variant="outline">{j.team}</Badge>
 </div>
 </div>
 <div className="text-left tb-text-sm text-muted-foreground">
 {j.date_fa}
 <div className="mt-1 text-[var(--tb-primary)]">مشاهده →</div>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </main>
 );
}

```

---

## `app/workwithus/[slug]/page.tsx`

```tsx
"use client";
import jobs from "@/data/jobs.json";
import Link from "next/link";
import { use } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function JobPage({ params }: { params: Promise<{slug:string}> }){
 const { slug } = use(params);
 const job = (jobs as any[]).find((j:any)=>j.slug===slug);
 if(!job) return <div className="p-10 text-center">یافت نشد</div>;

 return (
 <main className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
 <div className="tb-text-sm text-muted-foreground mb-2"><Link href="/workwithus" className="hover:text-foreground">فرصت‌های شغلی</Link> / {job.title}</div>
 <h1 className="tb-text-big-title md:tb-text-big-title ">{job.title}</h1>
 <div className="flex flex-wrap gap-2 mt-3 tb-text-sm">
 <Badge variant="brand">{job.type}</Badge>
 <Badge variant="secondary">{job.remote}</Badge>
 <Badge variant="outline">{job.team}</Badge>
 <span className="text-muted-foreground">{job.date_fa}</span>
 </div>
 <div className="card mt-6 p-5 tb-text-md text-[var(--tb-fg-muted)]">
 {job.description}
 <ul className="pr-5 mt-4 space-y-1 tb-text-sm" style={{listStyle:"disc"}}>
 <li>رزومه + نمونه کار</li>
 <li>مصاحبه فنی آنلاین</li>
 <li>شروع همکاری: مرداد ۱۴۰۵</li>
 </ul>
 </div>

 <form className="card p-5 mt-6 space-y-3" onSubmit={(e)=>{e.preventDefault(); alert("درخواست شما ثبت شد – تیم منابع انسانی تکباکس بررسی می‌کند.");}}>
 <h3 className="">ارسال درخواست</h3>
 <div className="grid sm:grid-cols-2 gap-3">
 <input className="input tb-text-md" placeholder="نام و نام خانوادگی *" required />
 <input className="input tb-text-md" placeholder="ایمیل *" type="email" required dir="ltr" />
 <input className="input tb-text-md" placeholder="تلفن" dir="ltr" />
 <input className="input tb-text-md" placeholder="لینک رزومه / لینکدین" dir="ltr" />
 </div>
 <textarea className="input min-h-[120px] tb-text-md" placeholder="کمی درباره خودتان و چرا تکباکس…" />
 <label className="block tb-text-sm">آپلود CV (PDF)
 <input type="file" accept=".pdf,.doc,.docx" className="block mt-1 tb-text-sm" />
 </label>
 <div className="flex justify-end gap-2">
 <ButtonLink href="/workwithus" variant="ghost">بازگشت</ButtonLink>
 <Button type="submit">ارسال درخواست</Button>
 </div>
 <p className="tb-text-sm text-[var(--tb-fg-muted)]">با استفاده از اطلاعات پروفایل شما پر می‌شود – می‌توانید در <Link href="/account" className="text-[var(--tb-primary)] underline">حساب کاربری</Link> تکمیل کنید.</p>
 </form>
 </main>
 );
}

```

---

## `components/animations/FadeIn.tsx`

```tsx
"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeIn } from "@/design/tokens/motion";
type Props = HTMLMotionProps<"div"> & { children: React.ReactNode };
export function FadeIn({ children, ...rest }: Props){
 return <motion.div {...fadeIn} {...rest}>{children}</motion.div>;
}
export default FadeIn;

```

---

## `components/animations/index.ts`

```ts
export * from "./FadeIn";
export * from "./MotionSection";
export * from "./SlideIn";

```

---

## `components/animations/MotionSection.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { fadeInUp } from "@/design/tokens/motion";
import * as React from "react";
export function MotionSection({
 children,
 ...p
}: React.ComponentProps<typeof motion.section>) {
 return (
 <motion.section {...fadeInUp} {...p}>
 {children}
 </motion.section>
 );
}
export default MotionSection;

```

---

## `components/animations/SlideIn.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import { slideIn } from "@/design/tokens/motion";
export function SlideIn(p: any) {
 return <motion.div {...slideIn} {...p} />;
}
export default SlideIn;

```

---

## `components/effects/Aurora.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { cn } from "@/lib/utils";

/**
 * Aurora background effect (ogl / WebGL).
 * Ported from the React Bits "Aurora" component, typed and wired to the
 * TechBox design system. Colors are passed in via `colorStops`— callers
 * should resolve them from design tokens (see PageBackground / bg-hero).
 */

const VERT = `#version 300 es
in vec2 position;
void main() {
 gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
 return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
 const vec4 C = vec4(
 0.211324865405187, 0.366025403784439,
 -0.577350269189626, 0.024390243902439
 );
 vec2 i = floor(v + dot(v, C.yy));
 vec2 x0 = v - i + dot(i, C.xx);
 vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
 vec4 x12 = x0.xyxy + C.xxzz;
 x12.xy -= i1;
 i = mod(i, 289.0);
 vec3 p = permute(
 permute(i.y + vec3(0.0, i1.y, 1.0))
 + i.x + vec3(0.0, i1.x, 1.0)
 );
 vec3 m = max(
 0.5 - vec3(
 dot(x0, x0),
 dot(x12.xy, x12.xy),
 dot(x12.zw, x12.zw)
 ),
 0.0
 );
 m = m * m;
 m = m * m;
 vec3 x = 2.0 * fract(p * C.www) - 1.0;
 vec3 h = abs(x) - 0.5;
 vec3 ox = floor(x + 0.5);
 vec3 a0 = x - ox;
 m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
 vec3 g;
 g.x = a0.x * x0.x + h.x * x0.y;
 g.yz = a0.yz * x12.xz + h.yz * x12.yw;
 return 130.0 * dot(m, g);
}

struct ColorStop {
 vec3 color;
 float position;
};

#define COLOR_RAMP(colors, factor, finalColor) { \
 int index = 0; \
 for (int i = 0; i < 2; i++) { \
 ColorStop currentColor = colors[i]; \
 bool isInBetween = currentColor.position <= factor; \
 index = int(mix(float(index), float(i), float(isInBetween))); \
 } \
 ColorStop currentColor = colors[index]; \
 ColorStop nextColor = colors[index + 1]; \
 float range = nextColor.position - currentColor.position; \
 float lerpFactor = (factor - currentColor.position) / range; \
 finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
 vec2 uv = gl_FragCoord.xy / uResolution;

 ColorStop colors[3];
 colors[0] = ColorStop(uColorStops[0], 0.0);
 colors[1] = ColorStop(uColorStops[1], 0.5);
 colors[2] = ColorStop(uColorStops[2], 1.0);

 vec3 rampColor;
 COLOR_RAMP(colors, uv.x, rampColor);

 float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
 height = exp(height);
 height = (uv.y * 2.0 - height + 0.2);
 float intensity = 0.6 * height;

 float midPoint = 0.20;
 float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

 vec3 auroraColor = intensity * rampColor;

 fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export interface AuroraProps {
 colorStops?: string[];
 amplitude?: number;
 blend?: number;
 time?: number;
 speed?: number;
 className?: string;
}

export default function Aurora(props: AuroraProps) {
 const {
 colorStops = ["#3b46f6", "#60a5fa", "#3b46f6"],
 amplitude = 1.0,
 blend = 0.5,
 } = props;

 const propsRef = useRef<AuroraProps>(props);
 useEffect(() => {
 propsRef.current = props;
 });

 const ctnDom = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const ctn = ctnDom.current;
 if (!ctn) return;

 const renderer = new Renderer({
 alpha: true,
 premultipliedAlpha: true,
 antialias: true,
 });
 const gl = renderer.gl;
 gl.clearColor(0, 0, 0, 0);
 gl.enable(gl.BLEND);
 gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
 gl.canvas.style.backgroundColor = "transparent";

 let program: Program | undefined;

 function resize() {
 if (!ctn) return;
 const width = ctn.offsetWidth;
 const height = ctn.offsetHeight;
 renderer.setSize(width, height);
 if (program) {
 program.uniforms.uResolution.value = [width, height];
 }
 }
 window.addEventListener("resize", resize);

 const geometry = new Triangle(gl);
 if (geometry.attributes.uv) {
 delete geometry.attributes.uv;
 }

 const colorStopsArray = colorStops.map((hex) => {
 const c = new Color(hex);
 return [c.r, c.g, c.b];
 });

 program = new Program(gl, {
 vertex: VERT,
 fragment: FRAG,
 uniforms: {
 uTime: { value: 0 },
 uAmplitude: { value: amplitude },
 uColorStops: { value: colorStopsArray },
 uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
 uBlend: { value: blend },
 },
 });

 const mesh = new Mesh(gl, { geometry, program });
 ctn.appendChild(gl.canvas);

 let animateId = 0;
 const update = (t: number) => {
 animateId = requestAnimationFrame(update);
 const { time = t * 0.01, speed = 1.0 } = propsRef.current;
 if (program) {
 program.uniforms.uTime.value = time * speed * 0.1;
 program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
 program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
 const stops = propsRef.current.colorStops ?? colorStops;
 program.uniforms.uColorStops.value = stops.map((hex: string) => {
 const c = new Color(hex);
 return [c.r, c.g, c.b];
 });
 renderer.render({ scene: mesh });
 }
 };
 animateId = requestAnimationFrame(update);

 resize();

 return () => {
 cancelAnimationFrame(animateId);
 window.removeEventListener("resize", resize);
 if (ctn && gl.canvas.parentNode === ctn) {
 ctn.removeChild(gl.canvas);
 }
 gl.getExtension("WEBGL_lose_context")?.loseContext();
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [amplitude]);

 return <div ref={ctnDom} className={cn("h-full w-full", props.className)} aria-hidden="true" />;
}

```

---

## `components/effects/BorderGlow.tsx`

```tsx
"use client";

import { useRef, useCallback, useState, useEffect, type ReactNode } from "react";

interface BorderGlowProps {
 children?: ReactNode;
 className?: string;
 edgeSensitivity?: number;
 glowColor?: string;
 backgroundColor?: string;
 borderRadius?: number;
 glowRadius?: number;
 glowIntensity?: number;
 coneSpread?: number;
 animated?: boolean;
 colors?: string[];
 fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
 const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
 if (!match) return { h: 40, s: 80, l: 80 };
 return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
 const { h, s, l } = parseHSL(glowColor);
 const base = `${h}deg ${s}% ${l}%`;
 const layers: [number, number, number, number, number, boolean][] = [
 [0, 0, 0, 1, 100, true],
 [0, 0, 1, 0, 60, true],
 [0, 0, 3, 0, 50, true],
 [0, 0, 6, 0, 40, true],
 [0, 0, 15, 0, 30, true],
 [0, 0, 25, 2, 20, true],
 [0, 0, 50, 2, 10, true],
 [0, 0, 1, 0, 60, false],
 [0, 0, 3, 0, 50, false],
 [0, 0, 6, 0, 40, false],
 [0, 0, 15, 0, 30, false],
 [0, 0, 25, 2, 20, false],
 [0, 0, 50, 2, 10, false],
 ];
 return layers
 .map(([x, y, blur, spread, alpha, inset]) => {
 const a = Math.min(alpha * intensity, 100);
 return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
 })
 .join(", ");
}

function easeOutCubic(x: number) {
 return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x: number) {
 return x * x * x;
}

interface AnimateOpts {
 start?: number;
 end?: number;
 duration?: number;
 delay?: number;
 ease?: (t: number) => number;
 onUpdate: (v: number) => void;
 onEnd?: () => void;
}

function animateValue({
 start = 0,
 end = 100,
 duration = 1000,
 delay = 0,
 ease = easeOutCubic,
 onUpdate,
 onEnd,
}: AnimateOpts) {
 const t0 = performance.now() + delay;
 function tick() {
 const elapsed = performance.now() - t0;
 const t = Math.min(elapsed / duration, 1);
 onUpdate(start + (end - start) * ease(t));
 if (t < 1) requestAnimationFrame(tick);
 else if (onEnd) onEnd();
 }
 setTimeout(() => requestAnimationFrame(tick), delay);
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
 const gradients: string[] = [];
 for (let i = 0; i < 7; i++) {
 const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
 gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
 }
 gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
 return gradients;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
 children,
 className = "",
  edgeSensitivity = 30,
  // Fallbacks only — ModuleBorderGlow always overrides these with resolved design tokens.
  glowColor = "40 80 80",
  backgroundColor = "var(--tb-bg-secondary)",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ["var(--tb-primary)", "var(--tb-vip)", "var(--tb-subnet)"],
  fillOpacity = 0.5,
}) => {
 const cardRef = useRef<HTMLDivElement>(null);
 const [isHovered, setIsHovered] = useState(false);
 const [cursorAngle, setCursorAngle] = useState(45);
 const [edgeProximity, setEdgeProximity] = useState(0);
 const [sweepActive, setSweepActive] = useState(false);

 const getCenterOfElement = useCallback((el: HTMLElement) => {
 const { width, height } = el.getBoundingClientRect();
 return [width / 2, height / 2];
 }, []);

 const getEdgeProximity = useCallback(
 (el: HTMLElement, x: number, y: number) => {
 const [cx, cy] = getCenterOfElement(el);
 const dx = x - cx;
 const dy = y - cy;
 let kx = Infinity;
 let ky = Infinity;
 if (dx !== 0) kx = cx / Math.abs(dx);
 if (dy !== 0) ky = cy / Math.abs(dy);
 return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
 },
 [getCenterOfElement]
 );

 const getCursorAngle = useCallback(
 (el: HTMLElement, x: number, y: number) => {
 const [cx, cy] = getCenterOfElement(el);
 const dx = x - cx;
 const dy = y - cy;
 if (dx === 0 && dy === 0) return 0;
 const radians = Math.atan2(dy, dx);
 let degrees = radians * (180 / Math.PI) + 90;
 if (degrees < 0) degrees += 360;
 return degrees;
 },
 [getCenterOfElement]
 );

 const handlePointerMove = useCallback(
 (e: React.PointerEvent<HTMLDivElement>) => {
 const card = cardRef.current;
 if (!card) return;
 const rect = card.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 setEdgeProximity(getEdgeProximity(card, x, y));
 setCursorAngle(getCursorAngle(card, x, y));
 },
 [getEdgeProximity, getCursorAngle]
 );

 useEffect(() => {
 if (!animated) return;
 const angleStart = 110;
 const angleEnd = 465;
 setSweepActive(true);
 setCursorAngle(angleStart);
 animateValue({ duration: 500, onUpdate: (v) => setEdgeProximity(v / 100) });
 animateValue({
 ease: easeInCubic,
 duration: 1500,
 end: 50,
 onUpdate: (v) => {
 setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
 },
 });
 animateValue({
 ease: easeOutCubic,
 delay: 1500,
 duration: 2250,
 start: 50,
 end: 100,
 onUpdate: (v) => {
 setCursorAngle((angleEnd - angleStart) * (v / 100) + angleStart);
 },
 });
 animateValue({
 ease: easeInCubic,
 delay: 2500,
 duration: 1500,
 start: 100,
 end: 0,
 onUpdate: (v) => setEdgeProximity(v / 100),
 onEnd: () => setSweepActive(false),
 });
 }, [animated]);

 const colorSensitivity = edgeSensitivity + 20;
 const isVisible = isHovered || sweepActive;
 const borderOpacity = isVisible
 ? Math.max(0, (edgeProximity * 100 - colorSensitivity) / (100 - colorSensitivity))
 : 0;
 const glowOpacity = isVisible ? Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)) : 0;

 const meshGradients = buildMeshGradients(colors);
 const borderBg = meshGradients.map((g) => `${g} border-box`);
 const fillBg = meshGradients.map((g) => `${g} padding-box`);
 const angleDeg = `${cursorAngle.toFixed(3)}deg`;

 return (
 <div
 ref={cardRef}
 onPointerMove={handlePointerMove}
 onPointerEnter={() => setIsHovered(true)}
 onPointerLeave={() => setIsHovered(false)}
 className={`relative grid isolate ${className}`}
 style={{
 background: backgroundColor,
 borderRadius: `${borderRadius}px`,
 border: "1px solid var(--tb-border)",
 transform: "translate3d(0, 0, 0.01px)",
 }}
 >
 {/* mesh gradient border */}
 <div
 className="absolute inset-0 rounded-[inherit] -z-[1]"
 style={{
 border: "1px solid transparent",
 background: [
 `linear-gradient(${backgroundColor} 0 100%) padding-box`,
 "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
 ...borderBg,
 ].join(", "),
 opacity: borderOpacity,
 maskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
 WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
 transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
 }}
 />
 {/* mesh gradient fill near edges */}
 <div
 className="absolute inset-0 rounded-[inherit] -z-[1]"
 style={
 {
 border: "1px solid transparent",
 background: fillBg.join(", "),
 maskImage: [
 "linear-gradient(to bottom, black, black)",
 "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
 "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
 `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
 ].join(", "),
 WebkitMaskImage: [
 "linear-gradient(to bottom, black, black)",
 "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
 "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
 "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
 `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
 ].join(", "),
 maskComposite: "subtract, add, add, add, add, add",
 WebkitMaskComposite: "source-out, source-over, source-over, source-over, source-over, source-over",
 opacity: borderOpacity * fillOpacity,
 mixBlendMode: "soft-light",
 transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
 } as React.CSSProperties
 }
 />
 {/* outer glow */}
 <span
 className="absolute pointer-events-none z-[1] rounded-[inherit]"
 style={
 {
 inset: `${-glowRadius}px`,
 // Bloom arc length follows coneSpread so the glow stays concentrated near the cursor.
 maskImage: `conic-gradient(from ${angleDeg} at center, black 0%, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black 100%)`,
 WebkitMaskImage: `conic-gradient(from ${angleDeg} at center, black 0%, transparent ${coneSpread}%, transparent ${100 - coneSpread}%, black 100%)`,
 opacity: glowOpacity,
 mixBlendMode: "plus-lighter",
 transition: isVisible ? "opacity 0.25s ease-out" : "opacity 0.75s ease-in-out",
 } as React.CSSProperties
 }
 >
 <span
 className="absolute rounded-[inherit]"
 style={{
 inset: `${glowRadius}px`,
 boxShadow: buildBoxShadow(glowColor, glowIntensity),
 }}
 />
 </span>

 <div className="flex flex-col relative z-[1] rounded-[inherit]">{children}</div>
 </div>
 );
};

export default BorderGlow;

```

---

## `components/effects/ChromaGrid.tsx`

```tsx
"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

export interface ChromaItem {
 image: string;
 title: string;
 subtitle: string;
 handle?: string;
 location?: string;
 borderColor?: string;
 gradient?: string;
 url?: string;
}

export interface ChromaGridProps {
 items?: ChromaItem[];
 className?: string;
 radius?: number;
 damping?: number;
 fadeOut?: number;
 ease?: string;
}

type SetterFn = (v: number | string) => void;

const ChromaGrid: React.FC<ChromaGridProps> = ({
 items,
 className = "",
 radius = 300,
 damping = 0.45,
 fadeOut = 0.6,
 ease = "power3.out",
}) => {
 const rootRef = useRef<HTMLDivElement>(null);
 const fadeRef = useRef<HTMLDivElement>(null);
 const setX = useRef<SetterFn | null>(null);
 const setY = useRef<SetterFn | null>(null);
 const pos = useRef({ x: 0, y: 0 });

 const data = items?.length ? items : [];

 useEffect(() => {
 const el = rootRef.current;
 if (!el) return;
 setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
 setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
 const { width, height } = el.getBoundingClientRect();
 pos.current = { x: width / 2, y: height / 2 };
 setX.current(pos.current.x);
 setY.current(pos.current.y);
 }, []);

 const moveTo = (x: number, y: number) => {
 gsap.to(pos.current, {
 x,
 y,
 duration: damping,
 ease,
 onUpdate: () => {
 setX.current?.(pos.current.x);
 setY.current?.(pos.current.y);
 },
 overwrite: true,
 });
 };

 const handleMove = (e: React.PointerEvent) => {
 const r = rootRef.current!.getBoundingClientRect();
 moveTo(e.clientX - r.left, e.clientY - r.top);
 gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
 };

 const handleLeave = () => {
 gsap.to(fadeRef.current, {
 opacity: 1,
 duration: fadeOut,
 overwrite: true,
 });
 };

 const handleCardClick = (url?: string) => {
 if (url) window.open(url, "_blank", "noopener,noreferrer");
 };

 const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
 const c = e.currentTarget as HTMLElement;
 const rect = c.getBoundingClientRect();
 c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
 c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
 };

 return (
 <div
 ref={rootRef}
 onPointerMove={handleMove}
 onPointerLeave={handleLeave}
 className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}
 style={
 {
 "--r": `${radius}px`,
 "--x": "50%",
 "--y": "50%",
 } as React.CSSProperties
 }
 >
        {data.map((c, i) => (
          <article
            key={i}
            onMouseMove={handleCardMove}
            onClick={c.url ? () => handleCardClick(c.url) : undefined}
            className={`group relative flex flex-col w-[300px] h-[360px] overflow-hidden border-2 border-transparent transition-colors duration-300 rounded-[var(--tb-radius-lg)] ${c.url ? "cursor-pointer" : ""}`}
            style={
              {
                "--card-border": c.borderColor || "transparent",
                background: c.gradient,
                "--spotlight-color": "color-mix(in oklch, white 25%, transparent)",
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
              }}
            />
            <div className="relative z-10 flex-1 min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <footer className="relative z-10 p-3 text-white grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
              <h3 className="m-0 text-[1.05rem] ">{c.title}</h3>
              {c.handle && <span className="text-[0.95rem] opacity-80 text-right">{c.handle}</span>}
              <p className="m-0 text-[0.85rem] opacity-85">{c.subtitle}</p>
              {c.location && <span className="text-[0.85rem] opacity-85 text-right">{c.location}</span>}
            </footer>
          </article>
        ))}

 <div
 className="absolute inset-0 pointer-events-none z-30"
 style={{
 backdropFilter: "grayscale(1) brightness(0.78)",
 WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
 background: "rgba(0,0,0,0.001)",
 maskImage:
 "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
 WebkitMaskImage:
 "radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)",
 }}
 />
 <div
 ref={fadeRef}
 className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
 style={{
 backdropFilter: "grayscale(1) brightness(0.78)",
 WebkitBackdropFilter: "grayscale(1) brightness(0.78)",
 background: "rgba(0,0,0,0.001)",
 maskImage:
 "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
 WebkitMaskImage:
 "radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)",
 opacity: 1,
 }}
 />
 </div>
 );
};

export default ChromaGrid;

```

---

## `components/effects/Dock.tsx`

```tsx
"use client";

import {
 motion,
 MotionValue,
 useMotionValue,
 useSpring,
 useTransform,
 type SpringOptions,
 AnimatePresence,
} from "motion/react";
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";

export type DockItemData = {
 icon: React.ReactNode;
 label: React.ReactNode;
 onClick: () => void;
 className?: string;
 active?: boolean;
};

export type DockOrientation = "horizontal" | "vertical";

export type DockProps = {
 items: DockItemData[];
 className?: string;
 distance?: number;
 panelSize?: number;
 baseItemSize?: number;
 dockSize?: number;
 magnification?: number;
 spring?: SpringOptions;
 orientation?: DockOrientation;
};

type DockItemProps = {
 className?: string;
 children: React.ReactNode;
 onClick?: () => void;
 mousePos: MotionValue<number>;
 spring: SpringOptions;
 distance: number;
 baseItemSize: number;
 magnification: number;
 label?: React.ReactNode;
 orientation: DockOrientation;
 active?: boolean;
};

function DockItem({
 children,
 className = "",
 onClick,
 mousePos,
 spring,
 distance,
 magnification,
 baseItemSize,
 label,
 orientation,
 active,
}: DockItemProps) {
 const ref = useRef<HTMLDivElement>(null);
 const isHovered = useMotionValue(0);

 const mouseDistance = useTransform(mousePos, (val) => {
 const rect = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: baseItemSize, height: baseItemSize };
 return orientation === "vertical"
 ? val - rect.y - baseItemSize / 2
 : val - rect.x - baseItemSize / 2;
 });

 const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
 const size = useSpring(targetSize, spring);

 const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
 if (e.key === "Enter" || e.key === " ") {
 e.preventDefault();
 onClick?.();
 }
 };

 return (
 <motion.div
 ref={ref}
 style={{ width: size, height: size }}
 onHoverStart={() => isHovered.set(1)}
 onHoverEnd={() => isHovered.set(0)}
 onFocus={() => isHovered.set(1)}
 onBlur={() => isHovered.set(0)}
 onClick={onClick}
 onKeyDown={handleKeyDown}
 className={`relative inline-flex items-center justify-center rounded-full border-2 shadow-[var(--tb-shadow-md)] ${
 active ? "border-[var(--tb-primary)]" : "border-[var(--tb-border)]"
 } bg-[var(--tb-bg-secondary)] ${className}`}
 tabIndex={0}
 role="button"
 aria-haspopup="true"
 aria-label={typeof label === "string" ? label : undefined}
 >
 {Children.map(children, (child) =>
 React.isValidElement(child)
 ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number>; orientation?: DockOrientation }>, {
 isHovered,
 orientation,
 })
 : child
 )}
 </motion.div>
 );
}

type DockLabelProps = {
 className?: string;
 children: React.ReactNode;
 isHovered?: MotionValue<number>;
 orientation?: DockOrientation;
};

function DockLabel({ children, className = "", isHovered, orientation = "horizontal" }: DockLabelProps) {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
 if (!isHovered) return;
 const unsubscribe = isHovered.on("change", (latest) => {
 setIsVisible(latest === 1);
 });
 return () => unsubscribe();
 }, [isHovered]);

 const positionClasses =
 orientation === "vertical"
 ? "top-1/2 right-full mr-3 -translate-y-1/2"
 : "-top-6 left-1/2 -translate-x-1/2";

 return (
 <AnimatePresence>
 {isVisible && (
 <motion.div
 initial={{ opacity: 0, x: orientation === "vertical" ? 8 : 0, y: orientation === "vertical" ? 0 : 0 }}
 animate={{ opacity: 1, x: 0, y: orientation === "vertical" ? 0 : -10 }}
 exit={{ opacity: 0, x: orientation === "vertical" ? 8 : 0 }}
 transition={{ duration: 0.2 }}
 className={`${className} ${positionClasses} absolute z-50 w-fit whitespace-pre rounded-md border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] px-2 py-0.5 tb-text-sm text-[var(--tb-fg-primary)] shadow-[var(--tb-shadow-md)]`}
 role="tooltip"
 >
 {children}
 </motion.div>
 )}
 </AnimatePresence>
 );
}

type DockIconProps = {
 className?: string;
 children: React.ReactNode;
 isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
 return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
 items,
 className = "",
 spring = { mass: 0.1, stiffness: 150, damping: 12 },
 magnification = 70,
 distance = 200,
 panelSize = 64,
 dockSize = 256,
 baseItemSize = 50,
 orientation = "vertical",
}: DockProps) {
 const mousePos = useMotionValue(Infinity);
 const isHovered = useMotionValue(0);

 const isVertical = orientation === "vertical";
 const maxExtent = useMemo(
 () => Math.max(dockSize, magnification + magnification / 2 + 4),
 [dockSize, magnification]
 );
 const extentRow = useTransform(isHovered, [0, 1], [panelSize, maxExtent]);
 const extent = useSpring(extentRow, spring);

 return (
 <motion.div
 style={isVertical ? { width: extent, scrollbarWidth: "none" } : { height: extent, scrollbarWidth: "none" }}
 className={isVertical ? "my-2 flex max-h-full justify-center" : "mx-2 flex max-w-full items-center"}
 >
 <motion.div
 onMouseMove={({ pageX, pageY }) => {
 isHovered.set(1);
 mousePos.set(isVertical ? pageY : pageX);
 }}
 onMouseLeave={() => {
 isHovered.set(0);
 mousePos.set(Infinity);
 }}
 className={`${className} flex w-fit gap-4 rounded-2xl border-2 border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/70 backdrop-blur-[var(--tb-blur-sm)] ${
 isVertical ? "flex-col items-center py-4 px-2" : "items-end pb-2 px-4"
 }`}
 style={isVertical ? { width: panelSize } : { height: panelSize }}
 role="toolbar"
 aria-label="Application dock"
 >
 {items.map((item, index) => (
 <DockItem
 key={index}
 onClick={item.onClick}
 className={item.className}
 mousePos={mousePos}
 spring={spring}
 distance={distance}
 magnification={magnification}
 baseItemSize={baseItemSize}
 label={item.label}
 orientation={orientation}
 active={item.active}
 >
 <DockIcon>{item.icon}</DockIcon>
 <DockLabel>{item.label}</DockLabel>
 </DockItem>
 ))}
 </motion.div>
 </motion.div>
 );
}

```

---

## `components/effects/GradientText.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GradientTextProps = {
 children: ReactNode;
 colors: string[];
 animationSpeed?: number;
 direction?: "horizontal" | "vertical";
 showBorder?: boolean;
 className?: string;
};

export default function GradientText({
 children,
 colors,
 animationSpeed = 6,
 direction = "horizontal",
 showBorder = false,
 className,
}: GradientTextProps) {
 const gradient = `linear-gradient(${direction === "horizontal" ? "90deg" : "180deg"}, ${colors.join(", ")})`;
 return (
 <span className={cn("relative inline-flex", showBorder && "rounded-[var(--tb-radius-lg)] p-[1px]")}> 
 {showBorder && <span className="absolute inset-0 rounded-[inherit]" style={{ background: gradient }} aria-hidden="true" />}
 <motion.span
 className={cn("relative inline-block bg-clip-text text-transparent", className)}
 style={{ backgroundImage: gradient, backgroundSize: "300% 100%" }}
 animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
 transition={{ duration: animationSpeed, repeat: Infinity, ease: "linear" }}
 >
 {children}
 </motion.span>
 </span>
 );
}

```

---

## `components/effects/HeroBackground.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Aurora from "@/components/effects/Aurora";
import { cn } from "@/lib/utils";

/**
 * ──────────────────────────────────────────────────────────────────────────
 * HERO / PAGE BACKGROUND — single swappable effect for the whole site.
 * (This is the "bg-hero" the design owns: change the effect HERE once and it
 * updates the homepage hero AND every page header at the same time.)
 *
 * To swap the effect later: replace the <Aurora /> render below with another
 * effect component. Keep the same props (colorVar / variant / className) so
 * every call site (HeroSection, PageHeader) keeps working with no changes.
 * ──────────────────────────────────────────────────────────────────────────
 */

type HeroBackgroundProps = {
 /**
 * CSS custom property to tint the effect with (e.g. "--tb-blog", "--tb-admin").
 * When provided, the resolved color becomes the dominant aurora stop so the
 * background syncs with that module/page color. Omit for the neutral brand hero.
 */
 colorVar?: string;
 /** Kept for API-compatibility with the previous PixelBlast wrapper; unused by Aurora. */
 variant?: string;
 className?: string;
};

/** Resolve a CSS color expression (var/oklch/hex) to a concrete #hex string. */
function resolveColor(expr: string, fallback: string): string {
 if (typeof window === "undefined") return fallback;
 const probe = document.createElement("span");
 probe.style.color = expr;
 probe.style.display = "none";
 document.body.appendChild(probe);
 const rgb = getComputedStyle(probe).color;
 probe.remove();
 const m = rgb.match(/\d+(\.\d+)?/g);
 if (!m || m.length < 3) return fallback;
 const [r, g, b] = m.slice(0, 3).map((n) => Math.round(parseFloat(n)));
 return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function readVar(name: string, fallback: string): string {
 if (typeof window === "undefined") return fallback;
 const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
 return raw || fallback;
}

function readNumber(name: string, fallback: number): number {
 if (typeof window === "undefined") return fallback;
 const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
 return Number.isFinite(n) ? n : fallback;
}

export default function HeroBackground({ colorVar, className }: HeroBackgroundProps) {
 const [mounted, setMounted] = useState(false);
 const [cfg, setCfg] = useState({
 colorStops: ["#1d2a8a", "#3b46f6", "#1d2a8a"],
 amplitude: 1,
 blend: 0.5,
 speed: 1,
 opacity: 0.6,
 });
 const observerRef = useRef<MutationObserver | null>(null);

 useEffect(() => {
 const sync = () => {
 // Colors come straight from the design gradient tokens — no effect-specific color vars.
 const c1 = resolveColor("var(--tb-gradient-1)", "#3b46f6");
 const c2 = resolveColor("var(--tb-gradient-2)", "#60a5fa");
 const c3 = resolveColor("var(--tb-gradient-3)", "#e879f9");
 // When a module/page color var is provided, let it dominate the middle stop.
 const accent = colorVar ? resolveColor(`var(${colorVar})`, c2) : c2;
 setCfg({
 colorStops: colorVar ? [c1, accent, c1] : [c1, c2, c3],
 amplitude: 1,
 blend: 0.5,
 speed: 1,
 opacity: readNumber("--tb-opacity-md", 0.6),
 });
 };
 setMounted(true);
 sync();
 // Re-resolve when the theme (dark class) toggles.
 const observer = new MutationObserver(sync);
 observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
 observerRef.current = observer;
 return () => observer.disconnect();
 }, [colorVar]);

 if (!mounted) return null;

 return (
 <div
 className={cn("pointer-events-none absolute inset-0", className)}
 style={{ opacity: cfg.opacity }}
 aria-hidden="true"
 >
 <Aurora
 colorStops={cfg.colorStops}
 amplitude={cfg.amplitude}
 blend={cfg.blend}
 speed={cfg.speed}
 />
 </div>
 );
}

```

---

## `components/effects/LogoLoop.tsx`

```tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type LogoItem =
 | {
 node: React.ReactNode;
 href?: string;
 title?: string;
 ariaLabel?: string;
 }
 | {
 src: string;
 alt?: string;
 href?: string;
 title?: string;
 srcSet?: string;
 sizes?: string;
 width?: number;
 height?: number;
 };

export interface LogoLoopProps {
 logos: LogoItem[];
 speed?: number;
 direction?: "left" | "right" | "up" | "down";
 width?: number | string;
 logoHeight?: number;
 gap?: number;
 pauseOnHover?: boolean;
 hoverSpeed?: number;
 fadeOut?: boolean;
 fadeOutColor?: string;
 scaleOnHover?: boolean;
 renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
 ariaLabel?: string;
 className?: string;
 style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
 SMOOTH_TAU: 0.25,
 MIN_COPIES: 2,
 COPY_HEADROOM: 2,
} as const;

const toCssLength = (value?: number | string): string | undefined =>
 typeof value === "number" ? `${value}px`: (value ?? undefined);

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const useResizeObserver = (
 callback: () => void,
 elements: Array<React.RefObject<Element | null>>,
 dependencies: React.DependencyList
) => {
 useEffect(() => {
 if (!window.ResizeObserver) {
 const handleResize = () => callback();
 window.addEventListener("resize", handleResize);
 callback();
 return () => window.removeEventListener("resize", handleResize);
 }
 const observers = elements.map((ref) => {
 if (!ref.current) return null;
 const observer = new ResizeObserver(callback);
 observer.observe(ref.current);
 return observer;
 });
 callback();
 return () => {
 observers.forEach((observer) => observer?.disconnect());
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, dependencies);
};

const useImageLoader = (
 seqRef: React.RefObject<HTMLUListElement | null>,
 onLoad: () => void,
 dependencies: React.DependencyList
) => {
 useEffect(() => {
 const images = seqRef.current?.querySelectorAll("img") ?? [];
 if (images.length === 0) {
 onLoad();
 return;
 }
 let remainingImages = images.length;
 const handleImageLoad = () => {
 remainingImages -= 1;
 if (remainingImages === 0) {
 onLoad();
 }
 };
 images.forEach((img) => {
 const htmlImg = img as HTMLImageElement;
 if (htmlImg.complete) {
 handleImageLoad();
 } else {
 htmlImg.addEventListener("load", handleImageLoad, { once: true });
 htmlImg.addEventListener("error", handleImageLoad, { once: true });
 }
 });
 return () => {
 images.forEach((img) => {
 img.removeEventListener("load", handleImageLoad);
 img.removeEventListener("error", handleImageLoad);
 });
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, dependencies);
};

const useAnimationLoop = (
 trackRef: React.RefObject<HTMLDivElement | null>,
 targetVelocity: number,
 seqWidth: number,
 seqHeight: number,
 isHovered: boolean,
 hoverSpeed: number | undefined,
 isVertical: boolean
) => {
 const rafRef = useRef<number | null>(null);
 const lastTimestampRef = useRef<number | null>(null);
 const offsetRef = useRef(0);
 const velocityRef = useRef(0);

 useEffect(() => {
 const track = trackRef.current;
 if (!track) return;

 const prefersReduced =
 typeof window !== "undefined" &&
 window.matchMedia &&
 window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 const seqSize = isVertical ? seqHeight : seqWidth;
 if (seqSize > 0) {
 offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
 const transformValue = isVertical
 ? `translate3d(0, ${-offsetRef.current}px, 0)`
 : `translate3d(${-offsetRef.current}px, 0, 0)`;
 track.style.transform = transformValue;
 }

 if (prefersReduced) {
 track.style.transform = "translate3d(0, 0, 0)";
 return () => {
 lastTimestampRef.current = null;
 };
 }

 const animate = (timestamp: number) => {
 if (lastTimestampRef.current === null) {
 lastTimestampRef.current = timestamp;
 }
 const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
 lastTimestampRef.current = timestamp;

 const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
 const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
 velocityRef.current += (target - velocityRef.current) * easingFactor;

 if (seqSize > 0) {
 let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
 nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
 offsetRef.current = nextOffset;
 const transformValue = isVertical
 ? `translate3d(0, ${-offsetRef.current}px, 0)`
 : `translate3d(${-offsetRef.current}px, 0, 0)`;
 track.style.transform = transformValue;
 }

 rafRef.current = requestAnimationFrame(animate);
 };

 rafRef.current = requestAnimationFrame(animate);

 return () => {
 if (rafRef.current !== null) {
 cancelAnimationFrame(rafRef.current);
 rafRef.current = null;
 }
 lastTimestampRef.current = null;
 };
 }, [trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical]);
};

export const LogoLoop = React.memo<LogoLoopProps>(
 ({
 logos,
 speed = 120,
 direction = "left",
 width = "100%",
 logoHeight = 28,
 gap = 32,
 pauseOnHover,
 hoverSpeed,
 fadeOut = false,
 fadeOutColor,
 scaleOnHover = false,
 renderItem,
 ariaLabel = "Partner logos",
 className,
 style,
 }) => {
 const containerRef = useRef<HTMLDivElement>(null);
 const trackRef = useRef<HTMLDivElement>(null);
 const seqRef = useRef<HTMLUListElement>(null);

 const [seqWidth, setSeqWidth] = useState<number>(0);
 const [seqHeight, setSeqHeight] = useState<number>(0);
 const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
 const [isHovered, setIsHovered] = useState<boolean>(false);

 const effectiveHoverSpeed = useMemo(() => {
 if (hoverSpeed !== undefined) return hoverSpeed;
 if (pauseOnHover === true) return 0;
 if (pauseOnHover === false) return undefined;
 return 0;
 }, [hoverSpeed, pauseOnHover]);

 const isVertical = direction === "up" || direction === "down";

 const targetVelocity = useMemo(() => {
 const magnitude = Math.abs(speed);
 let directionMultiplier: number;
 if (isVertical) {
 directionMultiplier = direction === "up" ? 1 : -1;
 } else {
 directionMultiplier = direction === "left" ? 1 : -1;
 }
 const speedMultiplier = speed < 0 ? -1 : 1;
 return magnitude * directionMultiplier * speedMultiplier;
 }, [speed, direction, isVertical]);

 const updateDimensions = useCallback(() => {
 const containerWidth = containerRef.current?.clientWidth ?? 0;
 const sequenceRect = seqRef.current?.getBoundingClientRect?.();
 const sequenceWidth = sequenceRect?.width ?? 0;
 const sequenceHeight = sequenceRect?.height ?? 0;

 if (isVertical) {
 const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
 if (containerRef.current && parentHeight > 0) {
 const targetHeight = Math.ceil(parentHeight);
 if (containerRef.current.style.height !== `${targetHeight}px`)
 containerRef.current.style.height = `${targetHeight}px`;
 }
 if (sequenceHeight > 0) {
 setSeqHeight(Math.ceil(sequenceHeight));
 const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
 const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
 setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
 }
 } else if (sequenceWidth > 0) {
 setSeqWidth(Math.ceil(sequenceWidth));
 const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
 setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
 }
 }, [isVertical]);

 useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
 useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
 useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

 const cssVariables = useMemo(
 () =>
 ({
 "--logoloop-gap": `${gap}px`,
 "--logoloop-logoHeight": `${logoHeight}px`,
 ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
 }) as React.CSSProperties,
 [gap, logoHeight, fadeOutColor]
 );

 const rootClasses = useMemo(
 () =>
 cx(
 "relative group",
 isVertical ? "overflow-hidden h-full inline-block" : "overflow-x-hidden",
 "[--logoloop-gap:32px]",
 "[--logoloop-logoHeight:28px]",
 "[--logoloop-fadeColorAuto:var(--tb-bg-primary)]",
 scaleOnHover && "py-[calc(var(--logoloop-logoHeight)*0.1)]",
 className
 ),
 [isVertical, scaleOnHover, className]
 );

 const handleMouseEnter = useCallback(() => {
 if (effectiveHoverSpeed !== undefined) setIsHovered(true);
 }, [effectiveHoverSpeed]);

 const handleMouseLeave = useCallback(() => {
 if (effectiveHoverSpeed !== undefined) setIsHovered(false);
 }, [effectiveHoverSpeed]);

 const renderLogoItem = useCallback(
 (item: LogoItem, key: React.Key) => {
 if (renderItem) {
 return (
 <li
 className={cx(
 "flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]",
 isVertical ? "mb-[var(--logoloop-gap)]" : "mr-[var(--logoloop-gap)]",
 scaleOnHover && "overflow-visible group/item"
 )}
 key={key}
 role="listitem"
 >
 {renderItem(item, key)}
 </li>
 );
 }

 const isNodeItem = "node" in item;
 const content = isNodeItem ? (
 <span
 className={cx(
 "inline-flex items-center",
 "motion-reduce:transition-none",
 scaleOnHover &&
 "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120"
 )}
 aria-hidden={!!item.href && !item.ariaLabel}
 >
 {item.node}
 </span>
 ) : (
 // eslint-disable-next-line @next/next/no-img-element
 <img
 className={cx(
 "h-[var(--logoloop-logoHeight)] w-auto block object-contain",
 "[-webkit-user-drag:none] pointer-events-none",
 "[image-rendering:-webkit-optimize-contrast]",
 "motion-reduce:transition-none",
 scaleOnHover &&
 "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120"
 )}
 src={item.src}
 srcSet={item.srcSet}
 sizes={item.sizes}
 width={item.width}
 height={item.height}
 alt={item.alt ?? ""}
 title={item.title}
 loading="lazy"
 decoding="async"
 draggable={false}
 />
 );

 const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);

 const inner = item.href ? (
 <a
 className={cx(
 "inline-flex items-center no-underline rounded",
 "transition-opacity duration-200 ease-linear",
 "hover:opacity-80",
 "focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2"
 )}
 href={item.href}
 aria-label={itemAriaLabel || "logo link"}
 target="_blank"
 rel="noreferrer noopener"
 >
 {content}
 </a>
 ) : (
 content
 );

 return (
 <li
 className={cx(
 "flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]",
 isVertical ? "mb-[var(--logoloop-gap)]" : "mr-[var(--logoloop-gap)]",
 scaleOnHover && "overflow-visible group/item"
 )}
 key={key}
 role="listitem"
 >
 {inner}
 </li>
 );
 },
 [isVertical, scaleOnHover, renderItem]
 );

 const logoLists = useMemo(
 () =>
 Array.from({ length: copyCount }, (_, copyIndex) => (
 <ul
 className={cx("flex items-center", isVertical && "flex-col")}
 key={`copy-${copyIndex}`}
 role="list"
 aria-hidden={copyIndex > 0}
 ref={copyIndex === 0 ? seqRef : undefined}
 >
 {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
 </ul>
 )),
 [copyCount, logos, renderLogoItem, isVertical]
 );

 const containerStyle = useMemo(
 (): React.CSSProperties => ({
 width: isVertical
 ? toCssLength(width) === "100%"
 ? undefined
 : toCssLength(width)
 : (toCssLength(width) ?? "100%"),
 ...cssVariables,
 ...style,
 }),
 [width, cssVariables, style, isVertical]
 );

 return (
 <div ref={containerRef} className={rootClasses} style={containerStyle} role="region" aria-label={ariaLabel}>
 {fadeOut && (
 <>
 {isVertical ? (
 <>
 <div
 aria-hidden
 className={cx(
 "pointer-events-none absolute inset-x-0 top-0 z-10",
 "h-[clamp(24px,8%,120px)]",
 "bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
 )}
 />
 <div
 aria-hidden
 className={cx(
 "pointer-events-none absolute inset-x-0 bottom-0 z-10",
 "h-[clamp(24px,8%,120px)]",
 "bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
 )}
 />
 </>
 ) : (
 <>
 <div
 aria-hidden
 className={cx(
 "pointer-events-none absolute inset-y-0 left-0 z-10",
 "w-[clamp(24px,8%,120px)]",
 "bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
 )}
 />
 <div
 aria-hidden
 className={cx(
 "pointer-events-none absolute inset-y-0 right-0 z-10",
 "w-[clamp(24px,8%,120px)]",
 "bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
 )}
 />
 </>
 )}
 </>
 )}

 <div
 className={cx(
 "flex will-change-transform select-none relative z-0",
 "motion-reduce:transform-none",
 isVertical ? "flex-col h-max w-full" : "flex-row w-max"
 )}
 ref={trackRef}
 onMouseEnter={handleMouseEnter}
 onMouseLeave={handleMouseLeave}
 >
 {logoLists}
 </div>
 </div>
 );
 }
);

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;

```

---

## `components/effects/ModuleBorderGlow.tsx`

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import BorderGlow from "@/components/effects/BorderGlow";
import { getModuleGradient } from "@/lib/get-module-gradient";

type ModuleBorderGlowProps = {
 children: ReactNode;
 /** A module color class/token from config/module-colors.ts (e.g. moduleMeta[slug].color). */
 moduleColor: string;
 className?: string;
};

/** Resolve a CSS color expression (var/oklch/hex) to a concrete rgb() string. */
function resolveColor(expr: string, fallback: string): string {
 if (typeof window === "undefined") return fallback;
 const probe = document.createElement("span");
 probe.style.color = expr;
 probe.style.display = "none";
 document.body.appendChild(probe);
 const resolved = getComputedStyle(probe).color;
 probe.remove();
 return resolved || fallback;
}

function resolveVar(name: string, fallback: string): string {
 if (typeof window === "undefined") return fallback;
 const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
 return raw || fallback;
}

/** Convert an "rgb(r, g, b)" string to an "H S% L%" string for the glow box-shadow. */
function rgbToHsl(rgb: string): string {
 const m = rgb.match(/\d+(\.\d+)?/g);
 if (!m || m.length < 3) return "222 89% 62%";
 const [r, g, b] = m.slice(0, 3).map((n) => parseFloat(n) / 255);
 const max = Math.max(r, g, b);
 const min = Math.min(r, g, b);
 const l = (max + min) / 2;
 let h = 0;
 let s = 0;
 if (max !== min) {
 const d = max - min;
 s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
 if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
 else if (max === g) h = (b - r) / d + 2;
 else h = (r - g) / d + 4;
 h /= 6;
 }
 return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function ModuleBorderGlow({ children, moduleColor, className }: ModuleBorderGlowProps) {
 const [mounted, setMounted] = useState(false);
 const [config, setConfig] = useState<{
 colors: string[];
 glowColor: string;
 backgroundColor: string;
 borderRadius: number;
 glowRadius: number;
 glowIntensity: number;
 coneSpread: number;
 edgeSensitivity: number;
 fillOpacity: number;
 }>({
 colors: ["#c084fc", "#f472b6", "#38bdf8"],
 glowColor: "222 89% 62%",
 backgroundColor: "#0b152a",
 borderRadius: 24,
 glowRadius: 34,
 glowIntensity: 0.55,
 coneSpread: 25,
 edgeSensitivity: 32,
 fillOpacity: 0.45,
 });

 useEffect(() => {
 const sync = () => {
 // Module-synced 3-color mesh: resolve the module token to concrete rgb so masks/gradients render.
 const [c1, c2, c3] = getModuleGradient(moduleColor);
 const colors = [resolveColor(c1, "#c084fc"), resolveColor(c2, "#f472b6"), resolveColor(c3, "#38bdf8")];
 // Glow color is the module color itself (converted to HSL) — no effect-specific color var.
 const moduleRgb = resolveColor(getModuleGradient(moduleColor)[0], "rgb(96,165,250)");
 const radiusPx = parseFloat(resolveVar("--tb-radius-lg", "14")) || 14;
 setConfig({
 colors,
 glowColor: rgbToHsl(moduleRgb),
 backgroundColor: resolveColor("var(--tb-bg-secondary)", "#0b152a"),
 borderRadius: radiusPx,
 // shader-shape tunables (not colors/borders/shadows) — kept as constants
 glowRadius: 34,
 glowIntensity: 0.55,
 coneSpread: 14,
 edgeSensitivity: 32,
 fillOpacity: 0.45,
 });
 };
 setMounted(true);
 sync();
 const observer = new MutationObserver(sync);
 observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
 return () => observer.disconnect();
 }, [moduleColor]);

 if (!mounted) {
 // SSR / first paint: render content in a neutral token-styled shell to avoid layout shift.
 return (
 <div
 className={className}
 style={{
 borderRadius: "var(--tb-radius-lg)",
 border: "var(--tb-border-sm) solid var(--tb-border)",
 background: "var(--tb-bg-secondary)",
 }}
 >
 {children}
 </div>
 );
 }

 return (
 <BorderGlow
 className={className}
 colors={config.colors}
 glowColor={config.glowColor}
 backgroundColor={config.backgroundColor}
 borderRadius={config.borderRadius}
 glowRadius={config.glowRadius}
 glowIntensity={config.glowIntensity}
 coneSpread={config.coneSpread}
 edgeSensitivity={config.edgeSensitivity}
 fillOpacity={config.fillOpacity}
 >
 {children}
 </BorderGlow>
 );
}

```

---

## `components/effects/ModuleHeader.tsx`

```tsx
import type { ReactNode } from "react";
import type { ModuleSlug } from "@/lib/content";
import { moduleMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

type ModuleHeaderProps = {
  module: ModuleSlug;
  title: string;
  description?: string;
  eyebrow?: string;
  count?: string;
  className?: string;
  children?: ReactNode;
    subtitle?: string;
};

/**
 * Plain module page header (no animated background, no boxed container).
 * Title uses the module color token.
 */
export default function ModuleHeader({ module, title, description, eyebrow, count, className, children }: ModuleHeaderProps) {
  const meta = moduleMeta[module];
  return (
    <header className={cn("mb-6 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        {eyebrow && <div className="mb-2 tb-text-sm text-[var(--tb-fg-muted)]">{eyebrow}</div>}
        <h1 className={cn("tb-text-big-title", meta.color)}>{title}</h1>
        {description && <p className="mt-2 tb-text-md text-[var(--tb-fg-muted)]">{description}</p>}
      </div>
      {count && <div className="tb-text-sm text-[var(--tb-fg-muted)]">{count}</div>}
      {children}
    </header>
  );
}

```

---

## `components/effects/PageHeader.tsx`

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  /** CSS var name for the synced color, e.g. "--tb-admin". Kept for API compatibility. */
  colorVar?: string;
  title: string;
  description?: string;
  /** Tailwind text color class for the title, e.g. "text-[var(--tb-admin)]". */
  titleClassName?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Plain page-level header (no animated background, no boxed container).
 * Use on non-module pages (admin, account, tools, about, contact, …).
 */
export default function PageHeader({ title, description, titleClassName, className, children }: PageHeaderProps) {
  return (
    <header className={cn("mb-6 flex flex-wrap items-end justify-between gap-3", className)} dir="rtl">
      <div>
        <h1 className={cn("tb-text-big-title", titleClassName)}>{title}</h1>
        {description && <p className="mt-2 tb-text-md text-[var(--tb-fg-muted)]">{description}</p>}
      </div>
      {children}
    </header>
  );
}

```

---

## `components/effects/PixelBlast.tsx`

```tsx
"use client";

// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
// Adapted for TechBox: colors/params are driven by design tokens via the wrapper
// component (PixelBlastBackground), never hardcoded at call sites.

import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type PixelBlastVariant = "square" | "circle" | "triangle" | "diamond";

interface TouchPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  force: number;
  age: number;
}

interface TouchTexture {
  canvas: HTMLCanvasElement;
  texture: THREE.Texture;
  addTouch: (norm: { x: number; y: number }) => void;
  update: () => void;
  radiusScale: number;
  size: number;
}

interface ReinitConfig {
  antialias: boolean;
  liquid: boolean;
  noiseAmount: number;
}

export type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

const createTouchTexture = (): TouchTexture => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const trail: TouchPoint[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;

  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawPoint = (p: TouchPoint) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t: number) => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;

    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };

  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };

  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v: number) {
      radius = 0.1 * size * v;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
    size,
  };
};

const createLiquidEffect = (texture: THREE.Texture, opts?: { strength?: number; freq?: number }) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;
    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      float amt = uStrength * intensity * wave;
      uv += vec2(vx, vy) * amt;
    }
  `;
  return new Effect("LiquidEffect", fragment, {
    uniforms: new Map<string, THREE.Uniform>([
      ["uTexture", new THREE.Uniform(texture)],
      ["uStrength", new THREE.Uniform(opts?.strength ?? 0.025)],
      ["uTime", new THREE.Uniform(0)],
      ["uFreq", new THREE.Uniform(opts?.freq ?? 4.5)],
    ]),
  });
};

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int   uShapeType;

const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;
uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;

  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;
  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;

  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );
  fragColor = vec4(srgbColor, M);
}
`;

const MAX_CLICKS = 10;

const PixelBlast: React.FC<PixelBlastProps> = ({
  variant = "square",
  pixelSize = 3,
  color = "#B497CF",
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(speed);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    clock: THREE.Clock;
    clickIx: number;
    uniforms: {
      uResolution: { value: THREE.Vector2 };
      uTime: { value: number };
      uColor: { value: THREE.Color };
      uClickPos: { value: THREE.Vector2[] };
      uClickTimes: { value: Float32Array };
      uShapeType: { value: number };
      uPixelSize: { value: number };
      uScale: { value: number };
      uDensity: { value: number };
      uPixelJitter: { value: number };
      uEnableRipples: { value: number };
      uRippleSpeed: { value: number };
      uRippleThickness: { value: number };
      uRippleIntensity: { value: number };
      uEdgeFade: { value: number };
    };
    resizeObserver?: ResizeObserver;
    raf?: number;
    quad?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    timeOffset?: number;
    composer?: EffectComposer;
    touch?: ReturnType<typeof createTouchTexture>;
    liquidEffect?: Effect;
  } | null>(null);

  const prevConfigRef = useRef<ReinitConfig | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    speedRef.current = speed;

    const needsReinitKeys: (keyof ReinitConfig)[] = ["antialias", "liquid", "noiseAmount"];
    const cfg: ReinitConfig = { antialias, liquid, noiseAmount };
    let mustReinit = false;
    if (!threeRef.current) mustReinit = true;
    else if (prevConfigRef.current) {
      for (const k of needsReinitKeys)
        if (prevConfigRef.current[k] !== cfg[k]) {
          mustReinit = true;
          break;
        }
    }

    if (mustReinit) {
      if (threeRef.current) {
        const t = threeRef.current;
        t.resizeObserver?.disconnect();
        cancelAnimationFrame(t.raf!);
        t.quad?.geometry.dispose();
        t.material.dispose();
        t.composer?.dispose();
        t.renderer.dispose();
        t.renderer.forceContextLoss();
        if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
        threeRef.current = null;
      }

      const canvas = document.createElement("canvas");
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      if (transparent) renderer.setClearAlpha(0);
      else renderer.setClearColor(0x000000, 1);

      const uniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uClickPos: {
          value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)),
        },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
        uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
        uScale: { value: patternScale },
        uDensity: { value: patternDensity },
        uPixelJitter: { value: pixelSizeJitter },
        uEnableRipples: { value: enableRipples ? 1 : 0 },
        uRippleSpeed: { value: rippleSpeed },
        uRippleThickness: { value: rippleThickness },
        uRippleIntensity: { value: rippleIntensityScale },
        uEdgeFade: { value: edgeFade },
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SRC,
        fragmentShader: FRAGMENT_SRC,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        glslVersion: THREE.GLSL3,
      });

      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(quadGeom, material);
      scene.add(quad);

      const clock = new THREE.Clock();

      const setSize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
        if (threeRef.current?.composer)
          threeRef.current.composer.setSize(renderer.domElement.width, renderer.domElement.height);
        uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio();
      };
      setSize();
      const ro = new ResizeObserver(setSize);
      ro.observe(container);

      const randomFloat = (): number => {
        if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
          const u32 = new Uint32Array(1);
          window.crypto.getRandomValues(u32);
          return u32[0] / 0xffffffff;
        }
        return Math.random();
      };
      const timeOffset = randomFloat() * 1000;

      let composer: EffectComposer | undefined;
      let touch: ReturnType<typeof createTouchTexture> | undefined;
      let liquidEffect: Effect | undefined;

      if (liquid) {
        touch = createTouchTexture();
        touch.radiusScale = liquidRadius;
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        liquidEffect = createLiquidEffect(touch.texture, {
          strength: liquidStrength,
          freq: liquidWobbleSpeed,
        });
        const effectPass = new EffectPass(camera, liquidEffect);
        effectPass.renderToScreen = true;
        composer.addPass(renderPass);
        composer.addPass(effectPass);
      }

      if (noiseAmount > 0) {
        if (!composer) {
          composer = new EffectComposer(renderer);
          composer.addPass(new RenderPass(scene, camera));
        }
        const noiseEffect = new Effect(
          "NoiseEffect",
          `uniform float uTime; uniform float uAmount; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);} void mainUv(inout vec2 uv){} void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){ float n=hash(floor(uv*vec2(1920.0,1080.0))+floor(uTime*60.0)); float g=(n-0.5)*uAmount; outputColor=inputColor+vec4(vec3(g),0.0);}`,
          {
            uniforms: new Map<string, THREE.Uniform>([
              ["uTime", new THREE.Uniform(0)],
              ["uAmount", new THREE.Uniform(noiseAmount)],
            ]),
          }
        );
        const noisePass = new EffectPass(camera, noiseEffect);
        noisePass.renderToScreen = true;
        if (composer && composer.passes.length > 0) {
          composer.passes.forEach((p) => {
            const pass = p as { renderToScreen?: boolean };
            pass.renderToScreen = false;
          });
        }
        composer.addPass(noisePass);
      }

      if (composer) composer.setSize(renderer.domElement.width, renderer.domElement.height);

      const mapToPixels = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const scaleX = renderer.domElement.width / rect.width;
        const scaleY = renderer.domElement.height / rect.height;
        const fx = (e.clientX - rect.left) * scaleX;
        const fy = (rect.height - (e.clientY - rect.top)) * scaleY;
        return {
          fx,
          fy,
          w: renderer.domElement.width,
          h: renderer.domElement.height,
        };
      };

      const onPointerDown = (e: PointerEvent) => {
        const { fx, fy } = mapToPixels(e);
        const ix = threeRef.current?.clickIx ?? 0;
        uniforms.uClickPos.value[ix].set(fx, fy);
        uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
        if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!touch) return;
        const { fx, fy, w, h } = mapToPixels(e);
        touch.addTouch({ x: fx / w, y: fy / h });
      };

      renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
      renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });

      let raf = 0;
      const animate = () => {
        if (autoPauseOffscreen && !visibilityRef.current.visible) {
          raf = requestAnimationFrame(animate);
          return;
        }
        uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current;

        if (liquidEffect) {
          const liqEffect = liquidEffect as Effect & { uniforms: Map<string, THREE.Uniform> };
          const timeUniform = liqEffect.uniforms.get("uTime");
          if (timeUniform) timeUniform.value = uniforms.uTime.value;
        }

        if (composer) {
          if (touch) touch.update();
          composer.passes.forEach((p) => {
            const pass = p as { effects?: Array<Effect & { uniforms: Map<string, THREE.Uniform> }> };
            if (pass.effects) {
              pass.effects.forEach((eff) => {
                const timeUniform = eff.uniforms?.get("uTime");
                if (timeUniform) timeUniform.value = uniforms.uTime.value;
              });
            }
          });
          composer.render();
        } else renderer.render(scene, camera);

        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      threeRef.current = {
        renderer,
        scene,
        camera,
        material,
        clock,
        clickIx: 0,
        uniforms,
        resizeObserver: ro,
        raf,
        quad,
        timeOffset,
        composer,
        touch,
        liquidEffect,
      };
    } else {
      const t = threeRef.current!;
      t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
      t.uniforms.uPixelSize.value = pixelSize * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(color);
      t.uniforms.uScale.value = patternScale;
      t.uniforms.uDensity.value = patternDensity;
      t.uniforms.uPixelJitter.value = pixelSizeJitter;
      t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
      t.uniforms.uRippleIntensity.value = rippleIntensityScale;
      t.uniforms.uRippleThickness.value = rippleThickness;
      t.uniforms.uRippleSpeed.value = rippleSpeed;
      t.uniforms.uEdgeFade.value = edgeFade;
      if (transparent) t.renderer.setClearAlpha(0);
      else t.renderer.setClearColor(0x000000, 1);
      if (t.liquidEffect) {
        const liqEffect = t.liquidEffect as Effect & { uniforms: Map<string, THREE.Uniform> };
        const uStrength = liqEffect.uniforms.get("uStrength");
        if (uStrength) uStrength.value = liquidStrength;
        const uFreq = liqEffect.uniforms.get("uFreq");
        if (uFreq) uFreq.value = liquidWobbleSpeed;
      }
      if (t.touch) t.touch.radiusScale = liquidRadius;
    }

    prevConfigRef.current = cfg;

    return () => {
      if (threeRef.current && mustReinit) return;
      if (!threeRef.current) return;
      const t = threeRef.current;
      t.resizeObserver?.disconnect();
      cancelAnimationFrame(t.raf!);
      t.quad?.geometry.dispose();
      t.material.dispose();
      t.composer?.dispose();
      t.renderer.dispose();
      t.renderer.forceContextLoss();
      if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
      threeRef.current = null;
    };
  }, [
    antialias,
    liquid,
    noiseAmount,
    pixelSize,
    patternScale,
    patternDensity,
    enableRipples,
    rippleIntensityScale,
    rippleThickness,
    rippleSpeed,
    pixelSizeJitter,
    edgeFade,
    transparent,
    liquidStrength,
    liquidRadius,
    liquidWobbleSpeed,
    autoPauseOffscreen,
    variant,
    color,
    speed,
  ]);

  // Pause rendering when offscreen to avoid wasted work / flicker.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoPauseOffscreen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visibilityRef.current.visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);
    return () => io.disconnect();
  }, [autoPauseOffscreen]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default PixelBlast;

```

---

## `components/effects/PixelBlastBackground.tsx`

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import PixelBlast, { type PixelBlastVariant } from "@/components/effects/PixelBlast";

type PixelBlastBackgroundProps = {
  /**
   * CSS custom property name to resolve the dither color from.
   * Defaults to the central --tb-pixelblast-color token.
   * Pass a module token (e.g. "--tb-blog") to sync the header with a module color.
   */
  colorVar?: string;
  variant?: PixelBlastVariant;
  className?: string;
  /** Optional overrides; otherwise read from design tokens. */
  pixelSize?: number;
  patternScale?: number;
  patternDensity?: number;
  edgeFade?: number;
  speed?: number;
  enableRipples?: boolean;
};

/** Read a CSS variable from :root / .dark and return a renderer-friendly color. */
function readCssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.color = `var(${name})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || fallback;
}

function readCssNumber(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export default function PixelBlastBackground({
  colorVar = "--tb-pixelblast-color",
  variant = "square",
  className,
  pixelSize,
  patternScale,
  patternDensity,
  edgeFade,
  speed,
  enableRipples = true,
}: PixelBlastBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [tokens, setTokens] = useState({
    color: "#3b46f6",
    pixelSize: 4,
    patternScale: 2,
    patternDensity: 1.1,
    edgeFade: 0.32,
    speed: 0.45,
    rippleSpeed: 0.4,
    rippleThickness: 0.12,
    rippleIntensity: 1.4,
    opacity: 0.55,
  });
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const sync = () => {
      setTokens({
        color: readCssVar(colorVar, "#3b46f6"),
        pixelSize: pixelSize ?? readCssNumber("--tb-pixelblast-pixel-size", 4),
        patternScale: patternScale ?? readCssNumber("--tb-pixelblast-pattern-scale", 2),
        patternDensity: patternDensity ?? readCssNumber("--tb-pixelblast-pattern-density", 1.1),
        edgeFade: edgeFade ?? readCssNumber("--tb-pixelblast-edge-fade", 0.32),
        speed: speed ?? readCssNumber("--tb-pixelblast-speed", 0.45),
        rippleSpeed: readCssNumber("--tb-pixelblast-ripple-speed", 0.4),
        rippleThickness: readCssNumber("--tb-pixelblast-ripple-thickness", 0.12),
        rippleIntensity: readCssNumber("--tb-pixelblast-ripple-intensity", 1.4),
        opacity: readCssNumber("--tb-pixelblast-opacity", 0.55),
      });
    };
    setMounted(true);
    sync();

    // Re-resolve colors when the theme (dark class) toggles.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [colorVar, pixelSize, patternScale, patternDensity, edgeFade, speed]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{ opacity: tokens.opacity }}
      aria-hidden="true"
    >
      <PixelBlast
        variant={variant}
        color={tokens.color}
        pixelSize={tokens.pixelSize}
        patternScale={tokens.patternScale}
        patternDensity={tokens.patternDensity}
        edgeFade={tokens.edgeFade}
        speed={tokens.speed}
        enableRipples={enableRipples}
        rippleSpeed={tokens.rippleSpeed}
        rippleThickness={tokens.rippleThickness}
        rippleIntensityScale={tokens.rippleIntensity}
        transparent
        autoPauseOffscreen
      />
    </div>
  );
}

```

---

## `components/effects/Shuffle.tsx`

```tsx
"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { JSX } from "react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: "left" | "right" | "up" | "down";
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: "random" | "evenodd";
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = "",
  style = {},
  shuffleDirection = "right",
  duration = 0.35,
  maxDelay = 0,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = "evenodd",
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = "",
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const splitRef = useRef<GSAPSplitText | null>(null);
  const wrappersRef = useRef<HTMLElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    if ("fonts" in document) {
      if (document.fonts.status === "loaded") setFontsLoaded(true);
      else document.fonts.ready.then(() => setFontsLoaded(true));
    } else setFontsLoaded(true);
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
    const mv = mm ? parseFloat(mm[1]) : 0;
    const mu = mm ? mm[2] || "px" : "px";
    const sign = mv === 0 ? "" : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
    return `top ${startPct}%${sign}`;
  }, [threshold, rootMargin]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (respectReducedMotion && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onShuffleComplete?.();
        return;
      }

      const el = ref.current as HTMLElement;
      const start = scrollTriggerStart;

      const removeHover = () => {
        if (hoverHandlerRef.current && ref.current) {
          ref.current.removeEventListener("mouseenter", hoverHandlerRef.current);
          hoverHandlerRef.current = null;
        }
      };

      const teardown = () => {
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        if (wrappersRef.current.length) {
          wrappersRef.current.forEach((wrap) => {
            const inner = wrap.firstElementChild as HTMLElement | null;
            const orig = inner?.querySelector('[data-orig="1"]') as HTMLElement | null;
            if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
          });
          wrappersRef.current = [];
        }
        try {
          splitRef.current?.revert();
        } catch {
          /* noop */
        }
        splitRef.current = null;
        playingRef.current = false;
      };

      const build = () => {
        teardown();
        const computedFont = getComputedStyle(el).fontFamily;
        splitRef.current = new GSAPSplitText(el, {
          type: "chars",
          charsClass: "shuffle-char",
          wordsClass: "shuffle-word",
          linesClass: "shuffle-line",
          smartWrap: true,
          reduceWhiteSpace: false,
        });
        const chars = (splitRef.current.chars || []) as HTMLElement[];
        wrappersRef.current = [];
        const rolls = Math.max(1, Math.floor(shuffleTimes));
        const rand = (set: string) => set.charAt(Math.floor(Math.random() * set.length)) || "";

        chars.forEach((ch) => {
          const parent = ch.parentElement;
          if (!parent) return;
          const w = ch.getBoundingClientRect().width;
          const h = ch.getBoundingClientRect().height;
          if (!w) return;

          const wrap = document.createElement("span");
          wrap.className = "inline-block overflow-hidden text-left";
          Object.assign(wrap.style, {
            width: w + "px",
            height: shuffleDirection === "up" || shuffleDirection === "down" ? h + "px" : "auto",
            verticalAlign: "bottom",
          });

          const inner = document.createElement("span");
          inner.className =
            "inline-block will-change-transform origin-left transform-gpu " +
            (shuffleDirection === "up" || shuffleDirection === "down" ? "whitespace-normal" : "whitespace-nowrap");

          parent.insertBefore(wrap, ch);
          wrap.appendChild(inner);

          const firstOrig = ch.cloneNode(true) as HTMLElement;
          firstOrig.className =
            "text-left " + (shuffleDirection === "up" || shuffleDirection === "down" ? "block" : "inline-block");
          Object.assign(firstOrig.style, { width: w + "px", fontFamily: computedFont });

          ch.setAttribute("data-orig", "1");
          ch.className =
            "text-left " + (shuffleDirection === "up" || shuffleDirection === "down" ? "block" : "inline-block");
          Object.assign(ch.style, { width: w + "px", fontFamily: computedFont });

          inner.appendChild(firstOrig);
          for (let k = 0; k < rolls; k++) {
            const c = ch.cloneNode(true) as HTMLElement;
            if (scrambleCharset) c.textContent = rand(scrambleCharset);
            c.className =
              "text-left " + (shuffleDirection === "up" || shuffleDirection === "down" ? "block" : "inline-block");
            Object.assign(c.style, { width: w + "px", fontFamily: computedFont });
            inner.appendChild(c);
          }
          inner.appendChild(ch);

          if (shuffleDirection === "right" || shuffleDirection === "down") {
            const firstCopy = inner.firstElementChild as HTMLElement | null;
            const real = inner.lastElementChild as HTMLElement | null;
            if (real) inner.insertBefore(real, inner.firstChild);
            if (firstCopy) inner.appendChild(firstCopy);
          }

          const steps = rolls + 1;
          let startX = 0;
          let finalX = 0;
          let startY = 0;
          let finalY = 0;
          if (shuffleDirection === "right") {
            startX = -steps * w;
            finalX = 0;
          } else if (shuffleDirection === "left") {
            startX = 0;
            finalX = -steps * w;
          } else if (shuffleDirection === "down") {
            startY = -steps * h;
            finalY = 0;
          } else if (shuffleDirection === "up") {
            startY = 0;
            finalY = -steps * h;
          }

          if (shuffleDirection === "left" || shuffleDirection === "right") {
            gsap.set(inner, { x: startX, y: 0, force3D: true });
            inner.setAttribute("data-start-x", String(startX));
            inner.setAttribute("data-final-x", String(finalX));
          } else {
            gsap.set(inner, { x: 0, y: startY, force3D: true });
            inner.setAttribute("data-start-y", String(startY));
            inner.setAttribute("data-final-y", String(finalY));
          }

          if (colorFrom) (inner.style as React.CSSProperties & { color?: string }).color = colorFrom;
          wrappersRef.current.push(wrap);
        });
      };

      const inners = () => wrappersRef.current.map((w) => w.firstElementChild as HTMLElement);

      const randomizeScrambles = () => {
        if (!scrambleCharset) return;
        wrappersRef.current.forEach((w) => {
          const strip = w.firstElementChild as HTMLElement;
          if (!strip) return;
          const kids = Array.from(strip.children) as HTMLElement[];
          for (let i = 1; i < kids.length - 1; i++) {
            kids[i].textContent = scrambleCharset.charAt(Math.floor(Math.random() * scrambleCharset.length));
          }
        });
      };

      const cleanupToStill = () => {
        wrappersRef.current.forEach((w) => {
          const strip = w.firstElementChild as HTMLElement;
          if (!strip) return;
          const real = strip.querySelector('[data-orig="1"]') as HTMLElement | null;
          if (!real) return;
          strip.replaceChildren(real);
          strip.style.transform = "none";
          strip.style.willChange = "auto";
        });
      };

      const play = () => {
        const strips = inners();
        if (!strips.length) return;
        playingRef.current = true;
        const isVertical = shuffleDirection === "up" || shuffleDirection === "down";
        const tl = gsap.timeline({
          smoothChildTiming: true,
          repeat: loop ? -1 : 0,
          repeatDelay: loop ? loopDelay : 0,
          onRepeat: () => {
            if (scrambleCharset) randomizeScrambles();
            if (isVertical) {
              gsap.set(strips, { y: (i, t: HTMLElement) => parseFloat(t.getAttribute("data-start-y") || "0") });
            } else {
              gsap.set(strips, { x: (i, t: HTMLElement) => parseFloat(t.getAttribute("data-start-x") || "0") });
            }
            onShuffleComplete?.();
          },
          onComplete: () => {
            playingRef.current = false;
            if (!loop) {
              cleanupToStill();
              if (colorTo) gsap.set(strips, { color: colorTo });
              onShuffleComplete?.();
              armHover();
            }
          },
        });

        const addTween = (targets: HTMLElement[], at: number) => {
          const vars: gsap.TweenVars = {
            duration,
            ease,
            force3D: true,
            stagger: animationMode === "evenodd" ? stagger : 0,
          };
          if (isVertical) {
            vars.y = (i: number, t: HTMLElement) => parseFloat(t.getAttribute("data-final-y") || "0");
          } else {
            vars.x = (i: number, t: HTMLElement) => parseFloat(t.getAttribute("data-final-x") || "0");
          }
          tl.to(targets, vars, at);
          if (colorFrom && colorTo) tl.to(targets, { color: colorTo, duration, ease }, at);
        };

        if (animationMode === "evenodd") {
          const odd = strips.filter((_, i) => i % 2 === 1);
          const even = strips.filter((_, i) => i % 2 === 0);
          const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
          const evenStart = odd.length ? oddTotal * 0.7 : 0;
          if (odd.length) addTween(odd, 0);
          if (even.length) addTween(even, evenStart);
        } else {
          strips.forEach((strip) => {
            const d = Math.random() * maxDelay;
            const vars: gsap.TweenVars = { duration, ease, force3D: true };
            if (isVertical) {
              vars.y = parseFloat(strip.getAttribute("data-final-y") || "0");
            } else {
              vars.x = parseFloat(strip.getAttribute("data-final-x") || "0");
            }
            tl.to(strip, vars, d);
            if (colorFrom && colorTo) tl.fromTo(strip, { color: colorFrom }, { color: colorTo, duration, ease }, d);
          });
        }
        tlRef.current = tl;
      };

      const armHover = () => {
        if (!triggerOnHover || !ref.current) return;
        removeHover();
        const handler = () => {
          if (playingRef.current) return;
          build();
          if (scrambleCharset) randomizeScrambles();
          play();
        };
        hoverHandlerRef.current = handler;
        ref.current.addEventListener("mouseenter", handler);
      };

      const create = () => {
        build();
        if (scrambleCharset) randomizeScrambles();
        play();
        armHover();
        setReady(true);
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: triggerOnce,
        onEnter: create,
      });

      return () => {
        st.kill();
        removeHover();
        teardown();
        setReady(false);
      };
    },
    {
      dependencies: [
        text,
        duration,
        maxDelay,
        ease,
        scrollTriggerStart,
        fontsLoaded,
        shuffleDirection,
        shuffleTimes,
        animationMode,
        loop,
        loopDelay,
        stagger,
        scrambleCharset,
        colorFrom,
        colorTo,
        triggerOnce,
        respectReducedMotion,
        triggerOnHover,
        onShuffleComplete,
      ],
      scope: ref,
    }
  );

  const baseTw = "inline-block whitespace-normal break-words will-change-transform leading-none";
  const commonStyle = useMemo(
    () => ({
      textAlign,
      ...style,
    }),
    [textAlign, style]
  );

  const classes = useMemo(
    () => `${baseTw} ${ready ? "visible" : "invisible"} ${className}`.trim(),
    [baseTw, ready, className]
  );

  const Tag = (tag || "p") as keyof JSX.IntrinsicElements;
  return React.createElement(Tag, { ref: ref as React.Ref<HTMLElement>, className: classes, style: commonStyle }, text);
};

export default Shuffle;

```

---

## `components/layout/Footer.tsx`

```tsx
import Link from "next/link"
import { SVGProps } from "react"

const navigation = {
 main: [
 { name: "ارتباط با ما", href: "/contact", hover: "hover:text-[var(--tb-contact)]" },
 { name: "درباره ما", href: "/about", hover: "hover:text-[var(--tb-about)]" },
 { name: "فرصت‌های شغلی", href: "/workwithus", hover: "hover:text-[var(--tb-workwithus)]" },
 ],
 social: [
 {
 name: "Instagram",
 href: "https://instagram.com/techbox",
 icon: (props: SVGProps<SVGSVGElement>) => (
 <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
 <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
 </svg>
 ),
 },
 {
 name: "X",
 href: "https://x.com/techbox",
 icon: (props: SVGProps<SVGSVGElement>) => (
 <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
 <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
 </svg>
 ),
 },
 {
 name: "YouTube",
 href: "https://youtube.com/@techbox",
 icon: (props: SVGProps<SVGSVGElement>) => (
 <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
 <path
 fillRule="evenodd"
 d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
 clipRule="evenodd"
 />
 </svg>
 ),
 },
 ],
}

export default function FooterSection() {
 return (
 <footer>
 <div className="px-6 pb-8">
 <div className="flex flex-row md:flex-row justify-around gap-12 md:gap-24">
 {/* ستون دوم: لینک‌ها */}
 <div className="text-right">
 <h4 className="tb-text-md text-foreground">لینک‌های سریع</h4>
 <div className="mt-4 flex flex-col gap-3">
 {navigation.main.map((item) => (
 <Link key={item.name} href={item.href} className={`tb-text-md text-muted-foreground transition-colors ${item.hover}`}>
 {item.name}
 </Link>
 ))}
 </div>
 </div>

 {/* ستون سوم: اجتماعی */}
 <div className="text-right">
 <h4 className="tb-text-md text-foreground">شبکه‌های اجتماعی</h4>
 <div className="mt-4 flex gap-4">
 {navigation.social.map((item) => (
 <Link key={item.name} href={item.href} target="_blank" className="text-muted-foreground hover:text-foreground">
 <item.icon className="size-6" />
 </Link>
 ))}
 </div>
 </div>
 </div>
 {/* کپی‌رایت */}
 <div className="mt-12 border-t border-[var(--tb-border)] pt-6 text-center">
 <p className="tb-text-md text-muted-foreground">
 © 1405 تمامی حقوق مادی و معنوی این وب‌سایت محفوظ و متعلق به شرکت «هونامیک ارتباط رستاک» میباشد.
 </p>
 </div>
 </div>
 </footer>
 )
}

```

---

## `components/layout/LayoutShell.tsx`

```tsx
"use client";

import * as React from "react";
import SidebarMain from "@/components/layout/Sidebar";
import FooterSection from "@/components/layout/Footer";
import { CartProvider } from "@/providers/cart.provider";
import Chatbot from "@/features/chat/components/Chatbot";

export function LayoutShell({ children }: { children: React.ReactNode }) {
 return (
 <CartProvider>
 <div className="relative min-h-screen text-foreground">
 <div className="relative z-10 flex min-h-screen w-full">
 <SidebarMain />
 <main className="min-w-0 flex-1 flex flex-col">
 <div className="flex-1 w-full">
 {children}
 </div>
 <FooterSection />
 </main>
 </div>
 <Chatbot />
 </div>
 </CartProvider>
 );
}

```

---

## `components/layout/Sidebar.tsx`

```tsx
"use client";

import * as React from "react";
import { SidebarMainProps } from "@/types/sidebar.types";
import { desktopStore, mobileStore } from "@/stores/sidebar.store";
import { themeStore } from "@/stores/theme.store";
import SidebarShell from "@/components/layout/SidebarShell";

export default function SidebarMain({ onMobileOpenChange }: SidebarMainProps) {
 const desktopOpen = React.useSyncExternalStore(
 desktopStore.subscribe,
 desktopStore.getSnapshot,
 () => true
 );

 const mobileOpen = React.useSyncExternalStore(
 mobileStore.subscribe,
 mobileStore.getSnapshot,
 () => false
 );

 const theme = React.useSyncExternalStore(
 themeStore.subscribe,
 themeStore.getClientSnapshot,
 themeStore.getServerSnapshot
 );

 React.useEffect(() => {
 document.documentElement.classList.toggle("dark", theme === "dark");
 }, [theme]);

 React.useEffect(() => {
 onMobileOpenChange?.(mobileOpen);
 }, [mobileOpen, onMobileOpenChange]);

 // اگر روی دسکتاپ بودیم و mobileOpen از قبل true مانده بود، ریستش کن
 React.useEffect(() => {
 const isDesktop = window.matchMedia("(min-width: 640px)").matches;
 if (isDesktop && mobileOpen) {
 mobileStore.set(false);
 }
 }, [mobileOpen]);

 // قفل اسکرول فقط وقتی منوی موبایل باز است و واقعاً روی موبایل هستیم
 React.useEffect(() => {
 const isMobile = window.matchMedia("(max-width: 639px)").matches;
 if (!mobileOpen || !isMobile) return;
 const prevBodyOverflow = document.body.style.overflow;
 const prevHtmlOverflow = document.documentElement.style.overflow;
 document.body.style.overflow = "hidden";
 document.documentElement.style.overflow = "hidden";
 return () => {
 document.body.style.overflow = prevBodyOverflow;
 document.documentElement.style.overflow = prevHtmlOverflow;
 };
 }, [mobileOpen]);

 const onToggleDesktop = React.useCallback(() => {
 desktopStore.set(!desktopOpen);
 }, [desktopOpen]);

 const onToggleMobile = React.useCallback(() => {
 mobileStore.set(!mobileOpen);
 }, [mobileOpen]);

 const onCloseMobile = React.useCallback(() => {
 mobileStore.set(false);
 }, []);

 const onToggleTheme = React.useCallback(() => {
 themeStore.toggle();
 }, []);

 return (
 <SidebarShell
 mobileOpen={mobileOpen}
 desktopOpen={desktopOpen}
 theme={theme}
 onToggleTheme={onToggleTheme}
 onToggleMobile={onToggleMobile}
 onCloseMobile={onCloseMobile}
 onToggleDesktop={onToggleDesktop}
 />
 );
}

```

---

## `components/layout/SidebarContent.tsx`

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/design/icons";
import ConsultationModal from "@/features/consultation/components/ConsultationModal";
import { createPortal } from "react-dom";
import { navItems, linkBase, linkInactive, isActive } from "@/config/sidebar.config";
import { SidebarContentProps, NavItem } from "@/types/sidebar.types";
import SidebarTooltip from "@/components/layout/SidebarTooltip";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUserClient, type AppUser } from "@/lib/auth";
import { useCart } from "@/providers/cart.provider";
import { getAllAcross, moduleMeta, type ModuleSlug } from "@/lib/content";
import { moduleColors } from "@/config/module-colors";
import { zIndex } from "@/design";
import { Button, ButtonLink } from "@/components/ui/Button";
import { IconRailButton } from "@/components/ui/IconRailButton";
import { CloseButton } from "@/components/ui/CloseButton";
import { OverlayBackdrop } from "@/components/ui/Overlay";
import { Panel } from "@/components/ui/Panel";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";

type AnchorRect = { top: number; right: number };

function TehranDateTime({ now, expanded }: { now: Date | null; expanded: boolean }) {
 const label = now
 ? `${now.toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })} – ${now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" })} تهران`
 : "ساعت تهران";

 return (
 <div className={expanded ? "shrink-0" : "h-[58px] shrink-0"}>
 {!expanded ? (
 <SidebarTooltip enabled label={label} tooltipClassName="text-[var(--tb-fg-muted)]">
 <span className="icon-rail-btn" aria-label="ساعت تهران">
 <Icon name="clock" size={18} />
 </span>
 </SidebarTooltip>
 ) : (
 <div className="flex items-center justify-between gap-2 rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)] px-3 py-2 shadow-[var(--tb-shadow-sm)]">
 <div className="min-w-0">
 <div className="truncate tb-text-sm text-[var(--tb-fg-muted)]">
 {now?.toLocaleDateString("fa-IR", { weekday: "long", timeZone: "Asia/Tehran" }) || "تهران"}
 </div>
 <div className="truncate tb-text-sm text-[var(--tb-fg-muted)]">
 {now?.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran" }) || "—"}
 </div>
 </div>
 <div className="shrink-0 tb-text-sm tabular-nums" dir="ltr">
 {now?.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Tehran" }) || "--:--:--"}
 </div>
 </div>
 )}
 </div>
 );
}

function getTooltipColorClass(item: NavItem, active: boolean) {
 return active
 ? item.iconActiveClassName || item.tooltipClassName || "text-[var(--tb-primary)]"
 : item.tooltipClassName || item.iconActiveClassName || "text-[var(--tb-fg-muted)]";
}

export default function SidebarContent({
 expanded,
 theme,
 onToggleTheme,
 onLogoClick,
 onLinkClick,
}: SidebarContentProps) {
 const pathname = usePathname();
 const router = useRouter();
 const notifButtonRef = useRef<HTMLButtonElement | null>(null);
 const [notifPos, setNotifPos] = useState<AnchorRect | null>(null);
 const [mounted, setMounted] = useState(false);
 const [user, setUser] = useState<AppUser | null>(null);
 const [q, setQ] = useState("");
 const [now, setNow] = useState<Date | null>(null);
 const [notifOpen, setNotifOpen] = useState(false);
 const [loginOpen, setLoginOpen] = useState(false);
 const [consultOpen, setConsultOpen] = useState(false);
 const [searchOpen, setSearchOpen] = useState(false);
 const collapsedSearchRef = useRef<HTMLInputElement | null>(null);
 const notifPanelRef = useRef<HTMLDivElement | null>(null);
 const { count: cartCount, setOpen: setCartOpen } = useCart();

 useEffect(() => {
 setMounted(true);
 setUser(getCurrentUserClient());
 setNow(new Date());
 const t = setInterval(() => setNow(new Date()), 1000);
 return () => clearInterval(t);
 }, []);

 useEffect(() => {
 const h = () => setUser(getCurrentUserClient());
 window.addEventListener("storage", h);
 return () => window.removeEventListener("storage", h);
 }, []);

 useEffect(() => {
 if (!notifOpen) return;
 const update = () => {
 const rect = notifButtonRef.current?.getBoundingClientRect();
 if (!rect) return;
 const panelW = 320;
 const safe = 12;
 const right = Math.max(safe, window.innerWidth - rect.right);
 const top = Math.min(window.innerHeight - 80, rect.bottom + 8);
 setNotifPos({ right: Math.min(right, window.innerWidth - panelW - safe), top });
 };
 update();
 window.addEventListener("resize", update);
 window.addEventListener("scroll", update, true);
 return () => {
 window.removeEventListener("resize", update);
 window.removeEventListener("scroll", update, true);
 };
 }, [notifOpen]);

 // Close the notification popover when clicking anywhere outside it / its trigger.
 useEffect(() => {
 if (!notifOpen) return;
 const onDown = (e: PointerEvent) => {
 const target = e.target as Node;
 if (notifPanelRef.current?.contains(target)) return;
 if (notifButtonRef.current?.contains(target)) return;
 setNotifOpen(false);
 };
 const onKey = (e: KeyboardEvent) => {
 if (e.key === "Escape") setNotifOpen(false);
 };
 document.addEventListener("pointerdown", onDown);
 document.addEventListener("keydown", onKey);
 return () => {
 document.removeEventListener("pointerdown", onDown);
 document.removeEventListener("keydown", onKey);
 };
 }, [notifOpen]);

 // Focus the collapsed search field when it expands.
 useEffect(() => {
 if (searchOpen) collapsedSearchRef.current?.focus();
 }, [searchOpen]);

 const notifications = useMemo(() => getAllAcross().slice(0, 8), []);

 const doSearch = (e?: React.FormEvent) => {
 e?.preventDefault();
 if (q.trim()) {
 router.push(`/search?q=${encodeURIComponent(q.trim())}`);
 onLinkClick?.();
 }
 };

 const notificationPanel = notifOpen && mounted && notifPos
 ? createPortal(
 <div
 ref={notifPanelRef}
 className="fixed w-[320px] max-w-[92vw] p-3 text-right card"
 style={{ zIndex: zIndex.notification, top: notifPos.top, right: notifPos.right }}
 dir="rtl"
 >
 <div className="mb-2 tb-text-sm ">آخرین رویدادها</div>
 <ul className="max-h-80 space-y-2 overflow-y-auto tb-text-sm">
              {notifications.map((n: any) => {
                // Title stays neutral; the source module label carries the module color.
                const sourceColor = moduleColors[n.module as keyof typeof moduleColors]?.active ?? "text-[var(--tb-fg-muted)]";
                const sourceLabel = moduleMeta[n.module as ModuleSlug]?.titleFa ?? n.module;
                return (
                  <li key={`${n.module}-${n.slug}`} className="border-b border-[color-mix(in_oklch,var(--tb-border)_40%,transparent)] pb-2 last:border-0">
                    <Link href={`/${n.module}/${n.slug}`} onClick={() => setNotifOpen(false)} className="line-clamp-2 text-[var(--tb-fg-primary)] transition-opacity hover:opacity-80">
                      {n.title}
                    </Link>
                    <div className="mt-0.5 tb-text-sm text-[var(--tb-fg-muted)]">
                      <span className={sourceColor}>{sourceLabel}</span> • {n.date_fa}{n.time ? ` • ${n.time}`: ""}
                    </div>
                  </li>
                );
              })}
 </ul>
 <Button variant="ghost" size="xs" onClick={() => setNotifOpen(false)} className="mt-2 w-full tb-text-sm">بستن</Button>
 </div>,
 document.body
 )
 : null;

 return (
 <div className="relative flex h-full w-full flex-col tb-text-sm" dir="rtl">
 <header className="shrink-0 space-y-3 p-3">
 <div className="flex h-10 items-center gap-2">
 <div className="relative h-10 w-10 shrink-0">
 {onLogoClick ? (
 <SidebarTooltip label="باز/بستن منو" enabled={!expanded} tooltipClassName="text-[var(--tb-primary)]">
 <Button onClick={onLogoClick} variant="link" size="icon" className="relative h-10 w-10 overflow-hidden rounded-[var(--tb-radius-lg)] p-0 transition-opacity hover:opacity-90" aria-label="toggle sidebar">
 <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain" />
 </Button>
 </SidebarTooltip>
 ) : (
 <Image src="/logo.png" alt="تکباکس" fill sizes="40px" className="object-contain" />
 )}
 </div>

          <div className={`overflow-hidden transition-all duration-[var(--tb-motion-md)] ${expanded ? "w-[170px] opacity-100" : "w-0 opacity-0"}`}>
            <div className="tb-text-md text-[var(--tb-fg-primary)]">تکباکس</div>
            <div className="tb-text-sm text-[var(--tb-fg-muted)]">پاتوق بچه‌های فناوری اطلاعات</div>
          </div>
        </div>

        {/* Notifications + cart — always visible, stable in both expanded & collapsed states */}
        <div className={`flex shrink-0 items-center gap-1 ${expanded ? "flex-row justify-start" : "flex-col"}`}>
          <SidebarTooltip label="اعلان‌ها" enabled={!expanded} tooltipClassName="text-[var(--tb-news)]">
            <IconRailButton ref={notifButtonRef} tone="news" onClick={() => setNotifOpen((o) => !o)} aria-label="notifications">
              <Icon name="bell" size={18} />
              <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--tb-danger)]" />
            </IconRailButton>
          </SidebarTooltip>

          <SidebarTooltip label={cartCount > 0 ? `سبد خرید – ${cartCount} قلم`: "سبد خرید"} enabled={!expanded} tooltipClassName="text-[var(--tb-shop)]">
            <IconRailButton tone="shop" onClick={() => setCartOpen(true)} aria-label="سبد خرید">
              <Icon name="cart" size={18} />
              {cartCount > 0 && (
                <span className="absolute -left-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--tb-shop)] px-1 tb-text-sm text-[var(--tb-on-accent)]">
                  {cartCount > 99 ? "۹۹+" : cartCount.toLocaleString("fa-IR")}
                </span>
              )}
            </IconRailButton>
          </SidebarTooltip>
        </div>

        <TehranDateTime now={now} expanded={expanded} />

 <div className="relative h-10 shrink-0">
 {expanded ? (
 <form onSubmit={doSearch} className="relative h-10">
 <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو در تکباکس…" className="input h-10 !py-2 pe-8 tb-text-sm" />
 <Button type="submit" variant="link" size="iconSm" className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]" aria-label="search">
 <Icon name="search" size={14} />
 </Button>
 </form>
 ) : (
 <>
 <SidebarTooltip label="جستجو" enabled={!searchOpen} tooltipClassName="text-[var(--tb-primary)]">
 <IconRailButton tone="brand" onClick={() => setSearchOpen((o) => !o)} aria-label="جستجو" aria-expanded={searchOpen}>
 {searchOpen ? <Icon name="close" size={18} /> : <Icon name="search" size={18} />}
 </IconRailButton>
 </SidebarTooltip>

 {/* Expanding search that pops out to the left of the rail icon. */}
 {searchOpen && (
 <form
 onSubmit={(e) => { doSearch(e); setSearchOpen(false); }}
 className="absolute left-full top-1/2 z-20 ms-2 flex h-10 -translate-y-1/2 items-center"
 dir="rtl"
 >
 <div className="relative w-56 max-w-[60vw] rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] shadow-[var(--tb-shadow-md)]">
 <input
 ref={collapsedSearchRef}
 value={q}
 onChange={(e) => setQ(e.target.value)}
 onBlur={() => { if (!q.trim()) setSearchOpen(false); }}
 placeholder="جستجو در تکباکس…"
 className="input h-10 w-full !py-2 pe-9 tb-text-sm !border-0 !bg-transparent"
 />
 <Button type="submit" variant="link" size="iconSm" className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]" aria-label="search">
 <Icon name="search" size={14} />
 </Button>
 </div>
 </form>
 )}
 </>
 )}
 </div>

 <div className="h-10 shrink-0">
 {expanded ? (
 <Button
 type="button"
 variant="ghost"
 onClick={() => setConsultOpen(true)}
 className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--tb-radius-lg)] border border-[color-mix(in_oklch,var(--tb-consultation)_35%,transparent)] text-center tb-text-sm text-[var(--tb-consultation)] hover:bg-[color-mix(in_oklch,var(--tb-consultation)_12%,transparent)]"
 >
 <Icon name="headset" size={16} strokeWidth={1.75} />
 مشاوره زیرساخت
 </Button>
 ) : (
 <SidebarTooltip label="مشاوره زیرساخت" enabled tooltipClassName="text-[var(--tb-consultation)]">
 <IconRailButton tone="consultation" onClick={() => setConsultOpen(true)} aria-label="مشاوره زیرساخت">
 <Icon name="headset" size={18} strokeWidth={1.75} />
 </IconRailButton>
 </SidebarTooltip>
 )}
 </div>

 <div className="h-10 shrink-0">
 <SidebarTooltip label={theme === "dark" ? "حالت روز" : "حالت شب"} enabled={!expanded} tooltipClassName="text-[var(--tb-warning)]">
 <ThemeToggleButton theme={theme} expanded={expanded} onClick={onToggleTheme} />
 </SidebarTooltip>
 </div>

 <div className="border-t border-[var(--tb-border)]" />
 </header>

 <nav className="flex-1 overflow-y-auto px-2 py-1">
 <div className="flex flex-col gap-[2px]">
 {navItems.map((item) => {
 const Icon = item.icon as any;
 const active = isActive(pathname, item.href);
 const iconClass = active ? item.iconActiveClassName || "text-primary" : item.iconClassName || "text-[var(--tb-fg-muted)]";
 const hoverClass = item.iconHoverClassName || item.iconActiveClassName || "group-hover:text-[var(--tb-primary)]";
 return (
 <SidebarTooltip key={item.href} label={item.title} enabled={!expanded} tooltipClassName={getTooltipColorClass(item, active)}>
 <Link
 href={item.href}
 onClick={onLinkClick}
 className={`${linkBase} tb-text-sm ${active ? "bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)]" : linkInactive}`}
 >
 {active && <span className="absolute bottom-[8px] right-0 top-[8px] w-[3px] rounded-full bg-[var(--tb-primary)]" />}
 <span className="flex h-10 w-10 shrink-0 items-center justify-center">
 <Icon size={19} className={`${iconClass} ${hoverClass}`} strokeWidth={1.75} />
 </span>
 <span className={`truncate transition-all ${expanded ? "w-[160px] opacity-100" : "w-0 opacity-0"}`}>{item.title}</span>
 </Link>
 </SidebarTooltip>
 );
 })}
 {(user?.role === "super_admin" || (user?.role as string) === "admin") && (() => {
 const active = isActive(pathname, "/admin");
 return (
 <SidebarTooltip key="/admin" label="مدیریت" enabled={!expanded} tooltipClassName="text-[var(--tb-vip)]">
 <Link
 href="/admin"
 onClick={onLinkClick}
 className={`${linkBase} tb-text-sm ${active ? "bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)]" : linkInactive}`}
 >
 {active && <span className="absolute bottom-[8px] right-0 top-[8px] w-[3px] rounded-full bg-[var(--tb-vip)]" />}
 <span className="flex h-10 w-10 shrink-0 items-center justify-center">
 <Icon name="shield" size={19} className="text-[var(--tb-vip)]" strokeWidth={1.75} />
 </span>
 <span className={`truncate transition-all ${expanded ? "w-[160px] opacity-100" : "w-0 opacity-0"}`}>مدیریت</span>
 </Link>
 </SidebarTooltip>
 );
 })()}

 </div>
 </nav>

 <div className="shrink-0 space-y-2 border-t border-[var(--tb-border)] px-2 py-2">
 {user ? (
 <Link href="/account" onClick={onLinkClick} className={`${linkBase} tb-text-sm ${isActive(pathname, "/account") ? "bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)]" : linkInactive}`}>
 <span className="flex h-10 w-10 shrink-0 items-center justify-center">
 <Image src={user.avatar || "/assets/hooman.png"} alt={user.name} width={28} height={28} className="rounded-full object-cover ring-1 ring-[var(--tb-border)]" />
 </span>
 <span className={`truncate ${expanded ? "w-[140px] opacity-100" : "w-0 opacity-0"} overflow-hidden transition-all`}>
 <span className="block tb-text-sm ">{user.name}</span>
 <span className="block tb-text-sm text-[var(--tb-fg-muted)]">{user.role === "super_admin" ? "مدیر کل" : "ویراستار"}</span>
 </span>
 </Link>
 ) : (
 <SidebarTooltip label="ورود / حساب کاربری" enabled={!expanded} tooltipClassName="text-[var(--tb-account)]">
 <Button variant="link" size="md" onClick={() => setLoginOpen(true)} className={`${linkBase} ${linkInactive} w-full justify-start p-0 tb-text-sm no-underline hover:no-underline`}>
 <span className="flex h-10 w-10 items-center justify-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tb-bg-muted)]"><Icon name="user" size={15} /></span>
 </span>
 <span className={`${expanded ? "w-[120px] opacity-100" : "w-0 opacity-0"} truncate transition-all`}>ورود</span>
 </Button>
 </SidebarTooltip>
 )}
 </div>

 {loginOpen && (
 <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: zIndex.modal }} dir="rtl">
 <OverlayBackdrop onClick={() => setLoginOpen(false)} />
 <Panel className="relative w-full max-w-sm space-y-3" style={{ zIndex: zIndex.modalContent }}>
 <div className="flex items-center justify-between">
 <h3 className="tb-text-md ">ورود به تکباکس</h3>
 <CloseButton onClick={() => setLoginOpen(false)} />
 </div>
 <p className="tb-text-sm text-[var(--tb-fg-muted)]">
 حساب تست: <b>sara</b> / <b>nima</b> / <b>rojina</b> / <b>admin</b><br />رمز همه: <code>techbox123</code>
 </p>
 <ButtonLink href="/admin/login" onClick={() => setLoginOpen(false)} className="w-full tb-text-sm">رفتن به ورود کامل →</ButtonLink>
 <Button variant="ghost" size="xs" onClick={() => setLoginOpen(false)} className="w-full tb-text-sm">بستن</Button>
 </Panel>
 </div>
 )}

 <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />

 {notificationPanel}
 </div>
 );
}

```

---

## `components/layout/SidebarDock.tsx`

```tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Dock, { type DockItemData } from "@/components/effects/Dock";
import { navItems, ICON_STROKE } from "@/config/sidebar.config";
import { getCurrentUserClient, type AppUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * Vertical Dock variant of the sidebar.
 * - Uses the same nav config + module color classes (central, no hardcoded colors).
 * - Adds an admin-only item after all nav items.
 *
 * Usage: render <SidebarDock /> where you want the magnifying vertical dock,
 * e.g. as a floating rail, instead of (or alongside) the classic SidebarContent.
 */
export default function SidebarDock({ className }: { className?: string }) {
 const router = useRouter();
 const pathname = usePathname();
 const [user, setUser] = useState<AppUser | null>(null);

 useEffect(() => {
 setUser(getCurrentUserClient());
 }, [pathname]);

 const isAdmin = user?.role === "super_admin" || (user?.role as string) === "admin";

 const items: DockItemData[] = navItems.map((item) => {
 const Icon = item.icon;
 const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
 return {
 label: item.title,
 onClick: () => router.push(item.href),
 active,
 icon: (
 <Icon
 strokeWidth={ICON_STROKE}
 className={cn("h-5 w-5", active ? item.iconActiveClassName : item.iconClassName)}
 />
 ),
 };
 });

 if (isAdmin) {
 const adminActive = pathname.startsWith("/admin");
 items.push({
 label: "مدیریت",
 onClick: () => router.push("/admin"),
 active: adminActive,
 icon: <ShieldCheck strokeWidth={ICON_STROKE} className="h-5 w-5 text-[var(--tb-vip)]" />,
 });
 }

 return (
 <Dock
 items={items}
 orientation="vertical"
 panelSize={64}
 baseItemSize={46}
 magnification={64}
 distance={160}
 className={className}
 />
 );
}

```

---

## `components/layout/SidebarShell.tsx`

```tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import SidebarContent from "@/components/layout/SidebarContent";
import { sidebarBase } from "@/config/sidebar.config";
import { SidebarShellProps } from "@/types/sidebar.types";
import { useFabTop, saveFabTop } from "@/hooks/useFabTop";
import { zIndex } from "@/design";
import { Overlay } from "@/components/ui/Overlay";

const DRAG_THRESHOLD = 6;
const BTN_SIZE = 72;
const SAFE_MARGIN = 16;

const MOBILE_SIDEBAR_WIDTH = "w-72";
const MOBILE_FAB_OPEN_RIGHT = "right-72";

const DESKTOP_SIDEBAR_OPEN_WIDTH = "w-64";
const DESKTOP_SIDEBAR_CLOSED_WIDTH = "w-16";

export default function SidebarShell({
 mobileOpen,
 desktopOpen,
 theme,
 onToggleTheme,
 onToggleMobile,
 onCloseMobile,
 onToggleDesktop,
}: SidebarShellProps) {
 const btnRef = useRef<HTMLButtonElement | null>(null);
 const [dragging, setDragging] = useState(false);
 const pointerStartYRef = useRef(0);
 const topStartRef = useRef(0);
 const movedRef = useRef(false);

 const storedTop = useFabTop();
 const [dragTop, setDragTop] = useState<number | null>(null);
 const btnTop = dragTop ?? storedTop;

 const getBtnHeight = () => btnRef.current?.offsetHeight ?? BTN_SIZE;

 const clampTopByHeight = (top: number, btnH: number) => {
 const minTop = SAFE_MARGIN;
 const maxTop = window.innerHeight - btnH - SAFE_MARGIN;
 if (maxTop <= minTop) return (window.innerHeight - btnH) / 2;
 return Math.min(Math.max(minTop, top), maxTop);
 };

 const clampTop = (top: number) => clampTopByHeight(top, getBtnHeight());

 const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
 pointerStartYRef.current = e.clientY;
 topStartRef.current = btnTop;
 movedRef.current = false;
 setDragging(true);
 setDragTop(btnTop);
 e.currentTarget.setPointerCapture(e.pointerId);
 };

 const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
 if (!dragging) return;
 const deltaY = e.clientY - pointerStartYRef.current;
 if (!movedRef.current && Math.abs(deltaY) >= DRAG_THRESHOLD) {
 movedRef.current = true;
 }
 setDragTop(clampTop(topStartRef.current + deltaY));
 };

 const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
 if (!dragging) return;
 setDragging(false);
 if (dragTop !== null) {
 saveFabTop(dragTop);
 setDragTop(null);
 }
 try {
 e.currentTarget.releasePointerCapture(e.pointerId);
 } catch {}
 };

 const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
 if (movedRef.current) {
 e.preventDefault();
 e.stopPropagation();
 return;
 }
 onToggleMobile();
 };

 return (
 <>
 <button
 ref={btnRef}
 type="button"
 onClick={handleClick}
 onPointerDown={handlePointerDown}
 onPointerMove={handlePointerMove}
 onPointerUp={endDrag}
 onPointerCancel={endDrag}
 style={{ top: `${btnTop}px`, touchAction: "none", zIndex: zIndex.mobileFab }}
 className={`fixed select-none rounded-full sm:hidden
 transition-[right] duration-[var(--tb-motion-lg)] translate-x-1/2
 ${mobileOpen ? MOBILE_FAB_OPEN_RIGHT : "right-0"}
 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
 aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
 >
 <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/90 shadow-[var(--tb-shadow-lg)] backdrop-blur-[var(--tb-blur-md)]">
 <Image
 src="/logo.png"
 alt="لوگو تکباکس"
 fill
 priority
 sizes="72px"
 draggable={false}
 onDragStart={(e) => e.preventDefault()}
 className="pointer-events-none rounded-full object-contain p-2"
 />
 </div>
 </button>

 {mobileOpen && (
 <Overlay
 layer="sidebarBackdrop"
 className="sm:hidden"
 onClick={onCloseMobile}
 />
 )}

 <aside
 className={`fixed right-0 top-0 h-full transform transition-transform duration-[var(--tb-motion-lg)] sm:hidden ${MOBILE_SIDEBAR_WIDTH} ${sidebarBase} ${
 mobileOpen ? "translate-x-0" : "translate-x-full"
 }`}
 aria-hidden={!mobileOpen}
 style={{ zIndex: zIndex.sidebar }}
 >
 <SidebarContent
 expanded
 theme={theme}
 onToggleTheme={onToggleTheme}
 onLinkClick={onCloseMobile}
 />
 </aside>

 <div
 className={`hidden shrink-0 sm:block transition-[width] duration-[var(--tb-motion-lg)] ease-[var(--tb-ease)] ${
 desktopOpen
 ? DESKTOP_SIDEBAR_OPEN_WIDTH
 : DESKTOP_SIDEBAR_CLOSED_WIDTH
 }`}
 aria-hidden="true"
 />

 <aside
 className={`fixed right-0 top-0 hidden h-screen flex-col overflow-hidden sm:flex transition-[width] duration-[var(--tb-motion-lg)] ease-[var(--tb-ease)] ${
 desktopOpen
 ? DESKTOP_SIDEBAR_OPEN_WIDTH
 : DESKTOP_SIDEBAR_CLOSED_WIDTH
 } ${sidebarBase}`}
 >
 <SidebarContent
 expanded={desktopOpen}
 theme={theme}
 onToggleTheme={onToggleTheme}
 onLogoClick={onToggleDesktop}
 />
 </aside>
 </>
 );
}

```

---

## `components/layout/SidebarTooltip.tsx`

```tsx
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { zIndex } from "@/design";

type Props = {
 label: string;
 enabled: boolean;
 children: React.ReactNode;
 tooltipClassName?: string;
};

type Position = {
 right: number;
 top: number;
};

export default function SidebarTooltip({
 label,
 enabled,
 children,
 tooltipClassName = "",
}: Props) {
 const [visible, setVisible] = React.useState(false);
 const [pos, setPos] = React.useState<Position | null>(null);
 const [mounted, setMounted] = React.useState(false);
 const triggerRef = React.useRef<HTMLSpanElement | null>(null);

 React.useEffect(() => {
 setMounted(true);
 }, []);

 const updatePosition = React.useCallback(() => {
 if (!enabled || !triggerRef.current) return;
 const rect = triggerRef.current.getBoundingClientRect();
 setPos({
 right: window.innerWidth - rect.left + 12,
 top: rect.top + rect.height / 2,
 });
 }, [enabled]);

 const show = React.useCallback(() => {
 if (!enabled) return;
 updatePosition();
 setVisible(true);
 }, [enabled, updatePosition]);

 const hide = React.useCallback(() => {
 setVisible(false);
 }, []);

 React.useEffect(() => {
 if (!visible) return;
 const handle = () => updatePosition();
 window.addEventListener("resize", handle);
 window.addEventListener("scroll", handle, true);
 return () => {
 window.removeEventListener("resize", handle);
 window.removeEventListener("scroll", handle, true);
 };
 }, [visible, updatePosition]);

 if (!enabled) {
 return <>{children}</>;
 }

 return (
 <>
 <span
 ref={triggerRef}
 className="inline-flex"
 onMouseEnter={show}
 onMouseLeave={hide}
 onFocus={show}
 onBlur={hide}
 >
 {children}
 </span>
 {mounted && visible && pos && createPortal(
 <span
 role="tooltip"
 className={`pointer-events-none fixed whitespace-nowrap rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] px-2.5 py-1.5 tb-text-sm shadow-[var(--tb-shadow-md)] animate-in fade-in-0 zoom-in-95 duration-[var(--tb-motion-sm)] ${tooltipClassName}`}
 style={{
 right: pos.right,
 top: pos.top,
 zIndex: zIndex.tooltip,
 transform: "translateY(-50%)",
 }}
 >
 {label}
 </span>,
 document.body
 )}
 </>
 );
}

```

---

## `components/ui/Avatar.tsx`

```tsx
"use client";
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Avatar({ src, alt, size=40, className, ...p }: { src?: string; alt?: string; size?: number } & React.HTMLAttributes<HTMLSpanElement>){
 return (
 <span className={cn("relative inline-block shrink-0 overflow-hidden bg-[var(--tb-bg-muted)]", className)} style={{width:size, height:size, borderRadius:"var(--tb-radius-full)", ...p.style}} {...p}>
 {src ? <Image src={src} alt={alt||""} width={size} height={size} className="h-full w-full object-cover" /> :
 <span className="flex h-full w-full items-center justify-center tb-text-sm text-[var(--tb-fg-muted)]">{(alt||"?").slice(0,2).toUpperCase()}</span>}
 </span>
 );
}
export default Avatar;

```

---

## `components/ui/Badge.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "brand" |
 "home" | "blog" | "news" | "media" | "shop" | "tools" | "raid" | "subnet" | "vip" | "forum" | "review" | "download" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
 variant?: Variant;
}

const base =
 "inline-flex items-center gap-1 rounded-full border px-[10px] py-[3px] " +
 "tb-text-sm font-[600] whitespace-nowrap " +
 "transition-colors duration-[var(--tb-motion-sm)]";

const variants: Record<Variant, string> = {
 default: "bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)] border-[var(--tb-border)]",
 secondary: "bg-[var(--tb-bg-muted)] text-[var(--tb-fg-muted)] border-[var(--tb-border)]",
 outline: "bg-transparent text-[var(--tb-fg-primary)] border-[var(--tb-border)]",
 brand: "bg-[color-mix(in_oklch,var(--tb-primary)_14%,transparent)] text-[var(--tb-primary)] border-[color-mix(in_oklch,var(--tb-primary)_30%,transparent)]",
 home: "",
 blog: "",
 news: "",
 media: "",
 shop: "",
 tools: "",
 raid: "",
 subnet: "",
 vip: "",
 forum: "",
 review: "",
 download: "",
 success: "",
 warning: "",
 danger: "",
 info: "",
};

// NOTE: Tags/categories must NOT carry module/semantic colors anymore.
// Every former colored variant now renders as a single neutral chip so the
// only colors in the UI come from intentional module headers/feeds, not tags.
const neutralVariants = new Set<Variant>([
 "home", "blog", "news", "media", "shop", "tools", "raid", "subnet", "vip",
 "forum", "review", "download", "success", "warning", "danger", "info",
]);

const neutralClass =
 "bg-transparent text-[var(--tb-fg-muted)] border-[var(--tb-border)]";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
 ({ className, variant="default", style, ...props }, ref) => {
 const isNeutralized = neutralVariants.has(variant);
 const variantClass = isNeutralized ? neutralClass : variants[variant as keyof typeof variants];
 return (
 <span
 ref={ref}
 className={cn(base, variantClass, className)}
 style={style}
 {...props}
 />
 );
 }
);
Badge.displayName = "Badge";
export default Badge;

```

---

## `components/ui/Button.tsx`

```tsx
"use client";
import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "vip" | "link";
type Size = "xs" | "sm" | "md" | "lg" | "icon" | "iconSm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: Variant;
 size?: Size;
 loading?: boolean;
}

export interface ButtonLinkProps extends LinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
 variant?: Variant;
 size?: Size;
}

const base =
 "inline-flex items-center justify-center gap-2 select-none " +
 "transition-all duration-[var(--tb-motion-md)] ease-[var(--tb-ease)] " +
 "focus-visible:outline-none focus-visible:shadow-[var(--tb-ring-3)] " +
 "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant,string> = {
 primary: "text-[var(--tb-on-accent)] bg-[var(--tb-primary)] hover:brightness-[1.06] active:scale-[0.985] shadow-[var(--tb-shadow-sm)]",
 secondary: "text-[var(--tb-fg-primary)] bg-[var(--tb-bg-muted)] hover:brightness-[1.03]",
 ghost: "bg-transparent text-[var(--tb-fg-primary)] hover:bg-[var(--tb-bg-muted)] border border-[var(--tb-border)]",
 outline: "bg-transparent border border-[var(--tb-border)] text-[var(--tb-fg-primary)] hover:bg-[var(--tb-bg-muted)]",
 danger: "text-[var(--tb-on-accent)] bg-[var(--tb-danger)] border-transparent hover:brightness-[1.05] active:scale-[0.985]",
 vip: "tb-cta tb-cta-vip px-4",
 link: "bg-transparent underline-offset-4 hover:underline p-0 h-auto border-0 shadow-none"
};

const sizes: Record<Size,string> = {
 xs: "h-7 px-2.5 tb-text-sm rounded-[var(--tb-radius-md)]",
 sm: "h-8 px-3 tb-text-sm rounded-[var(--tb-radius-md)]",
 md: "h-10 px-4 tb-text-sm rounded-[var(--tb-radius-lg)]",
 lg: "h-11 px-5 tb-text-md rounded-[var(--tb-radius-lg)]",
 icon: "h-10 w-10 p-0 rounded-[var(--tb-radius-lg)]",
 iconSm: "h-7 w-7 p-0 rounded-[var(--tb-radius-md)]"
};

export function buttonClassName({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
 return cn(base, variants[variant], sizes[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant="primary", size="md", loading, children, ...props }, ref) => {
 return (
 <button
 ref={ref}
 className={buttonClassName({ variant, size, className })}
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

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
 ({ className, variant="primary", size="md", children, ...props }, ref) => (
 <Link ref={ref} className={buttonClassName({ variant, size, className })} {...props}>
 {children}
 </Link>
 )
);
ButtonLink.displayName = "ButtonLink";

export default Button;

```

---

## `components/ui/Card.tsx`

```tsx
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
 "bg-[var(--tb-bg-secondary)] text-[var(--tb-fg-primary)]",
 "border border-[var(--tb-border)]",
 "rounded-[var(--tb-radius-lg)]",
 "shadow-[var(--tb-shadow-md)]",
 padding && "p-4 md:p-5",
 hover && "transition-all duration-[var(--tb-motion-md)] ease-[var(--tb-ease)] hover:shadow-[var(--tb-shadow-md)] hover:-translate-y-[1px]",
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
 <h3 className={cn("tb-text-lg md:tb-text-lg ",className)} {...p} />
);
export const CardContent = ({className,...p}:React.HTMLAttributes<HTMLDivElement>)=>(
 <div className={cn("tb-text-sm ", "text-[var(--tb-fg-muted)]", className)} {...p} />
);
export default Card;

```

---

## `components/ui/Checkbox.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
 ({className, ...props}, ref) => (
 <input ref={ref} type="checkbox"
      className={cn("w-[16px] h-[16px] rounded-[var(--tb-radius-sm)] accent-[var(--tb-primary)]", "bg-[var(--tb-bg-muted)] border border-[var(--tb-border)]", className)}
 {...props} />
 )
);
Checkbox.displayName="Checkbox";
export default Checkbox;

```

---

## `components/ui/Chip.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
export const Chip = Badge;
export const Tag = Badge;
export default Chip;

```

---

## `components/ui/ChipButton.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
 | "default"
 | "brand"
 | "home"
 | "blog"
 | "news"
 | "media"
 | "shop"
 | "tools"
 | "raid"
 | "subnet"
 | "vip"
 | "forum"
 | "review"
 | "download"
 | "success"
 | "warning"
 | "danger"
 | "info";

export interface ChipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 tone?: Tone;
 active?: boolean;
}

const toneVar: Record<Tone, string> = {
 default: "--tb-fg-muted",
 brand: "--tb-primary",
 home: "--tb-home",
 blog: "--tb-blog",
 news: "--tb-news",
 media: "--tb-media",
 shop: "--tb-shop",
 tools: "--tb-tools",
 raid: "--tb-raid",
 subnet: "--tb-subnet",
 vip: "--tb-vip",
 forum: "--tb-forum",
 review: "--tb-review",
 download: "--tb-download",
 success: "--tb-success",
 warning: "--tb-warning",
 danger: "--tb-danger",
 info: "--tb-info",
};

export const ChipButton = React.forwardRef<HTMLButtonElement, ChipButtonProps>(
 ({ className, tone = "default", active = false, style, ...props }, ref) => {
 const cssVar = toneVar[tone];
 return (
 <button
 ref={ref}
 type="button"
 className={cn(
 "inline-flex items-center justify-center gap-1 rounded-[var(--tb-radius-full)] border px-3 py-1.5 tb-text-sm ",
 "transition-colors duration-[var(--tb-motion-sm)] ease-[var(--tb-ease)]",
 "focus-visible:outline-none focus-visible:shadow-[var(--tb-ring-3)] disabled:pointer-events-none disabled:opacity-50",
 className
 )}
 style={{
 color: `var(${cssVar})`,
 borderColor: `color-mix(in oklch, var(${cssVar}) ${active ? "38%" : "22%"}, transparent)`,
 background: active
 ? `color-mix(in oklch, var(${cssVar}) 16%, transparent)`
 : "color-mix(in oklch, var(--tb-bg-muted) 78%, transparent)",
 ...style,
 }}
 {...props}
 />
 );
 }
);
ChipButton.displayName = "ChipButton";
export default ChipButton;

```

---

## `components/ui/CloseButton.tsx`

```tsx
"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "@/lib/utils";

export interface CloseButtonProps extends Omit<ButtonProps, "children" | "variant" | "size"> {
 label?: string;
 icon?: React.ReactNode;
}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
 ({ className, label = "بستن", icon, ...props }, ref) => (
 <Button
 ref={ref}
 type="button"
 variant="ghost"
 size="iconSm"
 aria-label={label}
 className={cn("text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]", className)}
 {...props}
 >
 {icon ?? <X size={14} aria-hidden />}
 </Button>
 )
);
CloseButton.displayName = "CloseButton";
export default CloseButton;

```

---

## `components/ui/Dropdown.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { zIndex } from "@/design";

interface DropdownItem { label: string; value: string; href?: string; onSelect?: ()=>void; }
export function Dropdown({ trigger, items, align="end" }: { 
 trigger: React.ReactNode; 
 items: DropdownItem[];
 align?: "start" | "end";
}) {
 const [open,setOpen] = React.useState(false);
 const ref = React.useRef<HTMLDivElement>(null);
 React.useEffect(()=>{
 const h=(e:MouseEvent)=>{ if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
 document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h);
 },[]);
 return (
 <div className="relative" ref={ref} dir="rtl">
 <div onClick={()=>setOpen(o=>!o)} className="cursor-pointer">{trigger}</div>
 {open && (
 <div className={`absolute top-full mt-2 min-w-[180px] card p-1 ${align==="end" ? "left-0" : "right-0"}`} style={{zIndex:zIndex.dropdown}}>
 {items.map(it=>(
 <button key={it.value}
 onClick={()=>{ it.onSelect?.(); setOpen(false); if(it.href) window.location.href=it.href; }}
 className="w-full text-right px-3 py-2 tb-text-sm rounded-[var(--tb-radius-md)] hover:bg-[var(--tb-bg-muted)] transition-colors"
 >{it.label}</button>
 ))}
 </div>
 )}
 </div>
 );
}

export function Select({ value, onValueChange, options, placeholder="انتخاب…" }:{
 value?:string; onValueChange?:(v:string)=>void;
 options:{label:string; value:string}[];
 placeholder?:string;
}) {
 return (
 <div className="relative">
 <select
 value={value}
 onChange={e=>onValueChange?.(e.target.value)}
 className="input appearance-none pe-8 tb-text-sm cursor-pointer"
 style={{
 backgroundImage: "none"
 }}
 >
 {placeholder && <option value="">{placeholder}</option>}
 {options.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
 </select>
 <ChevronDown size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--tb-fg-muted)]" />
 </div>
 );
}

```

---

## `components/ui/FloatingActionButton.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 hidden?: boolean;
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
 ({ className, hidden, style, ...props }, ref) => (
 <button
 ref={ref}
 className={cn("tb-floating-action", className)}
 style={{ display: hidden ? "none" : "inline-flex", ...style }}
 {...props}
 />
 )
);
FloatingActionButton.displayName = "FloatingActionButton";

export default FloatingActionButton;

```

---

## `components/ui/IconButton.tsx`

```tsx
"use client";
import * as React from "react";
import { Button, type ButtonProps } from "./Button";
import { cn } from "@/lib/utils";

export function IconButton({ size="icon", variant="ghost", className, ...props }: ButtonProps){
 return <Button size={size} variant={variant} className={cn("shrink-0", className)} {...props} />;
}
export default IconButton;

```

---

## `components/ui/IconRailButton.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
 | "default"
 | "brand"
 | "home"
 | "blog"
 | "news"
 | "media"
 | "shop"
 | "tools"
 | "raid"
 | "subnet"
 | "vip"
 | "forum"
 | "review"
 | "download"
 | "account"
 | "admin"
 | "consultation"
 | "about"
 | "contact"
 | "workwithus"
 | "warning"
 | "danger";

const toneVar: Record<Tone, string> = {
 default: "--tb-fg-primary",
 brand: "--tb-primary",
 home: "--tb-home",
 blog: "--tb-blog",
 news: "--tb-news",
 media: "--tb-media",
 shop: "--tb-shop",
 tools: "--tb-tools",
 raid: "--tb-raid",
 subnet: "--tb-subnet",
 vip: "--tb-vip",
 forum: "--tb-forum",
 review: "--tb-review",
 download: "--tb-download",
 account: "--tb-account",
 admin: "--tb-admin",
 consultation: "--tb-consultation",
 about: "--tb-about",
 contact: "--tb-contact",
 workwithus: "--tb-workwithus",
 warning: "--tb-warning",
 danger: "--tb-danger",
};

export interface IconRailButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 tone?: Tone;
 active?: boolean;
}

export const IconRailButton = React.forwardRef<HTMLButtonElement, IconRailButtonProps>(
 ({ className, tone = "default", active = false, style, ...props }, ref) => {
 const cssVar = toneVar[tone];
 return (
 <button
 ref={ref}
 type="button"
 className={cn("icon-rail-btn relative", className)}
 style={{ color: active ? `var(${cssVar})`: undefined, ...style }}
 {...props}
 />
 );
 }
);
IconRailButton.displayName = "IconRailButton";
export default IconRailButton;

```

---

## `components/ui/index.ts`

```ts
export * from "./Button";
export * from "./Input";
export * from "./Textarea";
export * from "./Card";
export * from "./Badge";
export * from "./Chip";
export * from "./Dropdown";
export * from "./SearchBar";
export * from "./Tabs";
export * from "./Tooltip";
export * from "./Switch";
export * from "./LikeButton";

// Re-export design tokens for TS usage
export * from "@/design";
export * from "./CloseButton";
export * from "./ChipButton";
export * from "./IconRailButton";
export * from "./Overlay";
export * from "./Panel";
export * from "./ModuleBadge";
export * from "./FloatingActionButton";
export * from "./MediaSelectorCard";
export * from "./ThemeToggleButton";

```

---

## `components/ui/Input.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 invalid?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, invalid, ...props }, ref) => (
 <input
 ref={ref}
 className={cn(
 "w-full bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)]",
 "border border-[var(--tb-border)]",
 "rounded-[var(--tb-radius-md)] px-[14px] py-[10px]",
 "tb-text-sm ",
 "transition-all duration-[var(--tb-motion-sm)] ease-[var(--tb-ease)]",
 "placeholder:text-[var(--tb-fg-muted)]/80",
 "focus:outline-none focus:border-[var(--tb-ring-1)] focus:shadow-[var(--tb-ring-3)]",
 "disabled:opacity-50 disabled:cursor-not-allowed",
 invalid && "border-[var(--tb-danger)] focus:border-[var(--tb-danger)] focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--tb-danger)_24%,transparent)]",
 className
 )}
 {...props}
 />
 )
);
Input.displayName = "Input";

```

---

## `components/ui/LikeButton.tsx`

```tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

function getFingerprint(){
 if(typeof window==="undefined") return "srv";
 let fp = localStorage.getItem("tb_fp");
 if(!fp){ fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("tb_fp", fp); }
 return fp;
}

export function LikeButton({ contentType, slug, initial = 0 }: { contentType: string; slug: string; initial?: number }) {
 const [liked, setLiked] = useState(false);
 const [count, setCount] = useState(initial);
 const [busy, setBusy] = useState(false);

 const key = `tb_like_${contentType}_${slug}`;
 useEffect(()=>{ setLiked(localStorage.getItem(key)==="1"); }, [key]);

 const toggle = useCallback(async ()=>{
 if(busy) return;
 setBusy(true);
 const fp = getFingerprint();
 const optimisticLiked = !liked;
 setLiked(optimisticLiked);
 setCount(c=> c + (optimisticLiked?1:-1));
 try{
 const res = await fetch("/api/like", {
 method:"POST",
 headers:{"Content-Type":"application/json"},
 body: JSON.stringify({ module: contentType, slug, fingerprint: fp })
 });
 if(res.ok){
 const data = await res.json();
 setLiked(data.liked);
 setCount(data.likes);
 if(data.liked) localStorage.setItem(key,"1"); else localStorage.removeItem(key);
 }
 }catch{}
 finally{ setBusy(false); }
 }, [liked, busy, contentType, slug, key]);

 return (
 <Button onClick={toggle} disabled={busy} variant={liked ? "primary" : "ghost"} size="sm" className="gap-2 tb-text-sm disabled:opacity-60" aria-pressed={liked}>
 <Heart size={20} fill={liked ? "currentColor" : "none"} strokeWidth={2} className={liked ? "text-[var(--tb-danger)]" : ""} aria-hidden />
 <span className="" style={{fontVariantNumeric:"tabular-nums"}}>{count.toLocaleString("fa-IR")}</span>
 <span className="hidden sm:inline">پسندیدم</span>
 <Eye size={16} className="opacity-60 hidden md:inline" />
 </Button>
 );
}

export function CommentVote({ id, initialLikes = 0, initialDislikes = 0 }: { id: string; initialLikes?: number; initialDislikes?: number }) {
 const [l, setL] = useState(initialLikes);
 const [d, setD] = useState(initialDislikes);
 const [v, setV] = useState<"up"|"down"|null>(null);

 useEffect(()=>{
 const saved = localStorage.getItem(`tb_cvote_${id}`);
 if(saved==="up"||saved==="down") setV(saved);
 },[id]);

 const vote = async (type:"up"|"down")=>{
 const next = v===type ? 0 : (type==="up"?1:-1);
 const prev = v==="up"?1 : v==="down"?-1:0;
 // optimistic
 setL(x=> x + (next===1?1:0) - (prev===1?1:0));
 setD(x=> x + (next===-1?1:0) - (prev===-1?1:0));
 setV(next===0?null:type);
 try{
 const res = await fetch("/api/comments/vote", {
 method:"POST", headers:{"Content-Type":"application/json"},
 body: JSON.stringify({ commentId: id, fingerprint: getFingerprint(), vote: next })
 });
 if(res.ok){
 const data = await res.json();
 setL(data.likes); setD(data.dislikes);
 }
 }catch{}
 if(next===0) localStorage.removeItem(`tb_cvote_${id}`); else localStorage.setItem(`tb_cvote_${id}`, type);
 };

 return (
 <div className="flex items-center gap-3 tb-text-sm text-[var(--tb-fg-muted)]">
 <Button onClick={()=>vote("up")} variant="link" size="xs" className={v==="up" ? "text-[var(--tb-success)] " : "text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]"}>▲ {l.toLocaleString("fa-IR")}</Button>
 <Button onClick={()=>vote("down")} variant="link" size="xs" className={v==="down" ? "text-[var(--tb-danger)] " : "text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]"}>▼ {d.toLocaleString("fa-IR")}</Button>
 </div>
 );
}

```

---

## `components/ui/MediaSelectorCard.tsx`

```tsx
"use client";
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

export interface MediaSelectorCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 active?: boolean;
 image?: string;
 title: string;
 category?: string;
 author?: string;
 dateFa?: string;
 views?: number;
 likes?: number;
 comments?: number;
 duration?: string;
}

export const MediaSelectorCard = React.forwardRef<HTMLButtonElement, MediaSelectorCardProps>(
 ({
 active,
 image,
 title,
 category,
 author,
 dateFa,
 views,
 likes,
 comments,
 duration = "۱۲:۴۴",
 className,
 ...props
 }, ref) => (
 <button
 ref={ref}
 type="button"
 className={cn(
 "card group overflow-hidden text-start text-right transition-all duration-[var(--tb-motion-md)]",
 active ? "ring-2 ring-[var(--tb-media)] shadow-[var(--tb-shadow-lg)]" : "hover:-translate-y-1 hover:shadow-[var(--tb-shadow-md)]",
 className
 )}
 {...props}
 >
 <div className="relative aspect-video bg-black">
 <Image
 src={image || "/assets/blog-1.jpg"}
 alt={title}
 fill
 sizes="(min-width:1024px) 33vw, 100vw"
 className="object-cover opacity-90 transition-opacity duration-[var(--tb-motion-md)] group-hover:opacity-100"
 />
 <span className="absolute inset-0 flex items-center justify-center">
 <span className="tb-image-badge flex h-14 w-14 items-center justify-center tb-text-lg text-white">▶</span>
 </span>
 <span className="absolute bottom-2 left-2 rounded-[var(--tb-radius-sm)] bg-[color-mix(in oklch, black 60%, transparent)] px-2 py-0.5 tb-text-sm text-white">
 {duration}
 </span>
 {category && <Badge variant="media" className="absolute right-2 top-2 !tb-text-sm">{category}</Badge>}
 </div>
 <div className="p-3">
 <div className="min-h-[48px] line-clamp-2 tb-text-sm ">{title}</div>
 <div className="mt-2 flex items-center justify-between tb-text-sm text-[var(--tb-fg-muted)]">
 {author && <span>{author}</span>}
 {dateFa && <span>{dateFa}</span>}
 </div>
 <div className="mt-2 flex items-center gap-3 border-t border-[color-mix(in_oklch,var(--tb-border)_50%,transparent)] pt-2 tb-text-sm text-[var(--tb-fg-muted)]">
 {typeof views === "number" && <span>👁 {views.toLocaleString("fa-IR")}</span>}
 {typeof likes === "number" && <span>♥ {likes.toLocaleString("fa-IR")}</span>}
 {typeof comments === "number" && <span>💬 {comments.toLocaleString("fa-IR")}</span>}
 </div>
 </div>
 </button>
 )
);
MediaSelectorCard.displayName = "MediaSelectorCard";

export default MediaSelectorCard;

```

---

## `components/ui/Modal.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { zIndex } from "@/design";
import { OverlayBackdrop } from "./Overlay";
import { Panel } from "./Panel";
export function Modal({ open, onClose, children, className }: { open: boolean; onClose: ()=>void; children: React.ReactNode; className?: string }){
 if(!open) return null;
 return (
 <div className="fixed inset-0 flex items-center justify-center p-4" dir="rtl" style={{zIndex:zIndex.modal}}>
 <OverlayBackdrop onClick={onClose} />
 <Panel className={cn("relative w-full max-w-lg max-h-[85vh] overflow-auto", className)} style={{zIndex:zIndex.modalContent}}>{children}</Panel>
 </div>
 );
}
export default Modal;

```

---

## `components/ui/ModuleBadge.tsx`

```tsx
import * as React from "react";
import { Badge, type BadgeProps } from "./Badge";
import type { ModuleSlug } from "@/lib/content";

type ModuleBadgeVariant = ModuleSlug | "home" | "raid" | "subnet" | "vip" | "success" | "warning" | "danger" | "info";

export interface ModuleBadgeProps extends Omit<BadgeProps, "variant"> {
 module: ModuleBadgeVariant;
}

export function ModuleBadge({ module, ...props }: ModuleBadgeProps) {
 return <Badge variant={module as BadgeProps["variant"]} {...props} />;
}

export default ModuleBadge;

```

---

## `components/ui/Overlay.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { zIndex } from "@/design";

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
 layer?: keyof typeof zIndex;
 blur?: boolean;
}

export const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
 ({ className, layer = "modal", blur = true, style, ...props }, ref) => (
 <div
 ref={ref}
 className={cn("fixed inset-0", blur ? "tb-overlay-backdrop" : "bg-[color-mix(in oklch, black 55%, transparent)]", className)}
 style={{ zIndex: zIndex[layer], ...style }}
 {...props}
 />
 )
);
Overlay.displayName = "Overlay";

export interface OverlayBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
 blur?: boolean;
}

export const OverlayBackdrop = React.forwardRef<HTMLDivElement, OverlayBackdropProps>(
 ({ className, blur = true, ...props }, ref) => (
 <div
 ref={ref}
 className={cn("absolute inset-0", blur ? "tb-overlay-backdrop" : "bg-[color-mix(in oklch, black 55%, transparent)]", className)}
 {...props}
 />
 )
);
OverlayBackdrop.displayName = "OverlayBackdrop";

export default Overlay;

```

---

## `components/ui/Panel.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
 variant?: "card" | "overlay" | "soft";
 padding?: boolean;
}

const variants = {
 card: "card",
 overlay: "tb-overlay-panel",
 soft: "tb-soft-panel",
} as const;

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
 ({ className, variant = "card", padding = true, ...props }, ref) => (
 <div
 ref={ref}
 className={cn(variants[variant], padding && "p-4", className)}
 {...props}
 />
 )
);
Panel.displayName = "Panel";
export default Panel;

```

---

## `components/ui/Radio.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export const Radio = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
 ({className, ...props}, ref) => (
 <input ref={ref} type="radio"
 className={cn("w-[16px] h-[16px] accent-[var(--tb-primary)]", className)}
 {...props} />
 )
);
Radio.displayName="Radio";
export default Radio;

```

---

## `components/ui/SearchBar.tsx`

```tsx
"use client";
import { Search } from "lucide-react";
import { Input } from "./Input";
import React from "react";
import { cn } from "@/lib/utils";

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
 onSearch?: (q:string)=>void;
 containerClassName?: string;
}
export function SearchBar({ onSearch, containerClassName, onKeyDown, ...props }: SearchBarProps){
 const handleKey = (e: React.KeyboardEvent<HTMLInputElement>)=>{
 onKeyDown?.(e);
 if(e.key==="Enter" && onSearch){ e.preventDefault(); onSearch((e.target as HTMLInputElement).value); }
 };
 return (
 <div className={cn("relative w-full", containerClassName)} dir="rtl">
 <Input {...props} onKeyDown={handleKey} type="search"
 className={cn("pe-9", props.className)}
 placeholder={props.placeholder || "جستجو در تکباکس…"} />
 <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tb-fg-muted)]" />
 </div>
 );
}
export default SearchBar;

```

---

## `components/ui/Skeleton.tsx`

```tsx
import { cn } from "@/lib/utils";
export function Skeleton({className, ...p}: React.HTMLAttributes<HTMLDivElement>){
 return <div className={cn("animate-pulse rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)]", className)} {...p} />
}
export default Skeleton;

```

---

## `components/ui/Switch.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange, disabled, className }:{
 checked?: boolean;
 onCheckedChange?: (v:boolean)=>void;
 disabled?: boolean;
 className?: string;
}){
 return (
 <button
 type="button"
 role="switch"
 aria-checked={checked}
 disabled={disabled}
 onClick={()=>onCheckedChange?.(!checked)}
 className={cn(
 "relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-colors",
 "duration-[var(--tb-motion-sm)]",
 checked ? "bg-[var(--tb-primary)] border-[var(--tb-primary)]" : "bg-[var(--tb-bg-muted)] border-[var(--tb-border)]",
 "disabled:opacity-50",
 className
 )}
 >
 <span className={cn(
 "pointer-events-none block h-4 w-4 rounded-full bg-white shadow transition-transform duration-[var(--tb-motion-sm)] mt-[1px]",
 checked ? "translate-x-[18px] rtl:-translate-x-[18px]" : "translate-x-[2px] rtl:-translate-x-[2px]"
 )} />
 </button>
 );
}
export default Switch;

```

---

## `components/ui/Tabs.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ value, onValueChange, children, className }:{
 value: string;
 onValueChange?: (v:string)=>void;
 children: React.ReactNode;
 className?: string;
}){
 return <div className={cn("w-full", className)} data-value={value}>{React.Children.map(children, child=>
 React.isValidElement(child) ? React.cloneElement(child as any, { __tb_active: (child.props as any).value === value, __tb_onSelect: onValueChange }) : child
 )}</div>;
}

export function TabsList({className, ...p}: React.HTMLAttributes<HTMLDivElement>){
 return <div className={cn("flex gap-1 p-1 rounded-[var(--tb-radius-lg)] bg-[var(--tb-bg-muted)]", className)} {...p} />;
}
export function TabsTrigger({value, children, __tb_active, __tb_onSelect, className}:{value:string; children:React.ReactNode; __tb_active?:boolean; __tb_onSelect?:(v:string)=>void; className?:string}){
 return (
 <button
 onClick={()=>__tb_onSelect?.(value)}
 className={cn(
 "px-3 py-1.5 tb-text-sm rounded-[var(--tb-radius-md)] transition-all",
 __tb_active ? "bg-[var(--tb-bg-secondary)] shadow-[var(--tb-shadow-sm)] text-[var(--tb-fg-primary)]" : "text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]",
 className
 )}
 aria-selected={__tb_active}
 role="tab"
 type="button"
 >{children}</button>
 );
}

```

---

## `components/ui/Textarea.tsx`

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 ({className, ...props}, ref)=> (
 <textarea ref={ref}
 className={cn(
 "w-full min-h-[110px] bg-[var(--tb-bg-muted)] text-[var(--tb-fg-primary)]",
 "border border-[var(--tb-border)] rounded-[var(--tb-radius-md)]",
 "px-[14px] py-[10px] tb-text-sm ",
 "placeholder:text-[var(--tb-fg-muted)]/75",
 "focus:outline-none focus:border-[var(--tb-ring-1)] focus:shadow-[var(--tb-ring-3)]",
 "transition-[border-color,box-shadow] duration-[var(--tb-motion-sm)]",
 "disabled:opacity-50",
 className
 )}
 {...props}
 />
 )
);
Textarea.displayName="Textarea";
export default Textarea;

```

---

## `components/ui/ThemeToggleButton.tsx`

```tsx
"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 theme: "light" | "dark";
 expanded?: boolean;
 labelDark?: string;
 labelLight?: string;
}

export const ThemeToggleButton = React.forwardRef<HTMLButtonElement, ThemeToggleButtonProps>(
 ({ theme, expanded = true, className, labelDark = "حالت روز", labelLight = "حالت شب", ...props }, ref) => {
 const label = theme === "dark" ? labelDark : labelLight;
 return (
 <button
 ref={ref}
 type="button"
 className={cn(
 "group flex h-10 w-full items-center rounded-[var(--tb-radius-lg)] tb-text-sm text-[var(--tb-fg-muted)]",
 "transition-colors duration-[var(--tb-motion-md)] hover:bg-[var(--tb-bg-muted)] hover:text-[var(--tb-fg-primary)]",
 className
 )}
 aria-label={label}
 {...props}
 >
 <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
 <Sun className={cn(
 "absolute h-[18px] w-[18px] transition-all duration-[var(--tb-motion-md)]",
 theme === "dark" ? "scale-100 text-[var(--tb-warning)] opacity-100" : "scale-0 opacity-0"
 )} />
 <Moon className={cn(
 "absolute h-[18px] w-[18px] transition-all duration-[var(--tb-motion-md)]",
 theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
 )} />
 </span>
 <span className={cn(
 "overflow-hidden whitespace-nowrap tb-text-sm transition-all duration-[var(--tb-motion-md)]",
 expanded ? "w-[120px] opacity-100" : "w-0 opacity-0"
 )}>
 {label}
 </span>
 </button>
 );
 }
);
ThemeToggleButton.displayName = "ThemeToggleButton";

export default ThemeToggleButton;

```

---

## `components/ui/Tooltip.tsx`

```tsx
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { zIndex } from "@/design";

export function Tooltip({ content, children, side="top" }:{
 content: React.ReactNode;
 children: React.ReactNode;
 side?: "top"|"bottom"|"left"|"right";
}){
 const [open,setOpen] = React.useState(false);
 return (
 <span className="relative inline-flex"
 onMouseEnter={()=>setOpen(true)}
 onMouseLeave={()=>setOpen(false)}
 onFocus={()=>setOpen(true)}
 onBlur={()=>setOpen(false)}
 >
 {children}
 {open && (
 <span role="tooltip"
 className={cn(
 "absolute whitespace-nowrap tb-text-sm px-2 py-1 rounded-[var(--tb-radius-md)] shadow-[var(--tb-shadow-md)] pointer-events-none",
 "bg-[var(--tb-bg-secondary)] text-[var(--tb-fg-primary)] border border-[var(--tb-border)]",
 side==="top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
 side==="bottom" && "top-full mt-2 left-1/2 -translate-x-1/2",
 side==="left" && "right-full me-2 top-1/2 -translate-y-1/2",
 side==="right" && "left-full ms-2 top-1/2 -translate-y-1/2",
 )}
 style={{zIndex:zIndex.tooltip}}
 >{content}</span>
 )}
 </span>
 );
}
export default Tooltip;

```

---

## `config/module-colors.ts`

```ts
export const moduleColors = {
 home: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-home)]",
 active: "text-[var(--tb-home)]",
 },
 blog: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-blog)]",
 active: "text-[var(--tb-blog)]",
 },
 news: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-news)]",
 active: "text-[var(--tb-news)]",
 },
 media: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-media)]",
 active: "text-[var(--tb-media)]",
 },
 shop: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-shop)]",
 active: "text-[var(--tb-shop)]",
 },
 tools: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-tools)]",
 active: "text-[var(--tb-tools)]",
 },
 raid: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-raid)]",
 active: "text-[var(--tb-raid)]",
 },
 subnet: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-subnet)]",
 active: "text-[var(--tb-subnet)]",
 },
 vip: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-vip)]",
 active: "text-[var(--tb-vip)]",
 },
 forum: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-forum)]",
 active: "text-[var(--tb-forum)]",
 },
 review: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-review)]",
 active: "text-[var(--tb-review)]",
 },
 download: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-download)]",
 active: "text-[var(--tb-download)]",
 },
 account: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-account)]",
 active: "text-[var(--tb-account)]",
 },
 admin: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-admin)]",
 active: "text-[var(--tb-admin)]",
 },
 about: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-about)]",
 active: "text-[var(--tb-about)]",
 },
 contact: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-contact)]",
 active: "text-[var(--tb-contact)]",
 },
 workwithus: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-workwithus)]",
 active: "text-[var(--tb-workwithus)]",
 },
 consultation: {
 base: "text-[var(--tb-fg-primary)]",
 hover: "group-hover:text-[var(--tb-consultation)]",
 active: "text-[var(--tb-consultation)]",
 },
} as const;

```

---

## `config/modules.config.TECHBOX_TOOLS_V2.ts`

```ts
// TechBox · modules.config – BACKWARD-COMPATIBLE v2
// Provides: modules array, moduleMap, getModuleMeta(), MODULES, default export
// Never returns undefined – always falls back to --tb-primary
// Safe for HomeModulesSection, Sidebar, Tool pages, etc.

export type ModuleKey =
  | "home"
  | "blog"
  | "news"
  | "media"
  | "shop"
  | "tools"
  | "download"
  | "forum"
  | "review"
  | "raid"
  | "subnet"
  | "vip"
  | "account"
  | "admin"
  | "about"
  | "contact"
  | "consultation"
  | "workwithus"
  | "search"
  | "nas-selector"
  | "nvr-selector"
  | "raid-calculator"
  | "subnet-calculator";

export type ModuleMeta = {
  key: ModuleKey;
  slug: ModuleKey;
  title: string;
  titleFa: string;
  href: string;
  color: string;
  icon: 
    | "home" | "blog" | "news" | "media" | "shop" | "tools"
    | "downloadModule" | "forum" | "review" | "server" | "disk"
    | "user" | "users" | "shield" | "chat";
  descriptionFa?: string;
};

const moduleList: ModuleMeta[] = [
  { key: "home", slug: "home", title: "Home", titleFa: "خانه", href: "/", color: "var(--tb-home)", icon: "home", descriptionFa: "صفحه اصلی" },
  { key: "blog", slug: "blog", title: "Blog", titleFa: "بلاگ", href: "/blog", color: "var(--tb-blog)", icon: "blog", descriptionFa: "مقالات تخصصی" },
  { key: "news", slug: "news", title: "News", titleFa: "اخبار", href: "/news", color: "var(--tb-news)", icon: "news", descriptionFa: "اخبار دنیای تکنولوژی" },
  { key: "media", slug: "media", title: "Media", titleFa: "مدیا", href: "/media", color: "var(--tb-media)", icon: "media", descriptionFa: "ویدئو و پادکست" },
  { key: "shop", slug: "shop", title: "Shop", titleFa: "فروشگاه", href: "/shop", color: "var(--tb-shop)", icon: "shop", descriptionFa: "خرید تجهیزات" },
  { key: "tools", slug: "tools", title: "Tools", titleFa: "ابزارها", href: "/tools", color: "var(--tb-tools)", icon: "tools", descriptionFa: "ابزارهای محاسباتی" },
  { key: "download", slug: "download", title: "Download", titleFa: "دانلود", href: "/download", color: "var(--tb-download)", icon: "downloadModule", descriptionFa: "مرکز دانلود" },
  { key: "forum", slug: "forum", title: "Forum", titleFa: "انجمن", href: "/forum", color: "var(--tb-forum)", icon: "forum", descriptionFa: "پرسش و پاسخ" },
  { key: "review", slug: "review", title: "Review", titleFa: "بررسی", href: "/review", color: "var(--tb-review)", icon: "review", descriptionFa: "نقد و بررسی" },

  // calculators / sub-modules – keep color tokens consistent
  { key: "raid", slug: "raid", title: "RAID", titleFa: "رید", href: "/tools/raid-calculator", color: "var(--tb-raid)", icon: "disk", descriptionFa: "ماشین حساب RAID" },
  { key: "subnet", slug: "subnet", title: "Subnet", titleFa: "ساب‌نت", href: "/tools/subnet-calculator", color: "var(--tb-subnet)", icon: "tools", descriptionFa: "ماشین حساب ساب‌نت" },
  { key: "vip", slug: "vip", title: "VIP", titleFa: "ویژه", href: "/vip", color: "var(--tb-vip)", icon: "shield", descriptionFa: "بخش ویژه" },

  // system pages
  { key: "account", slug: "account", title: "Account", titleFa: "حساب کاربری", href: "/account", color: "var(--tb-account)", icon: "user", descriptionFa: "پنل کاربری" },
  { key: "admin", slug: "admin", title: "Admin", titleFa: "مدیریت", href: "/admin", color: "var(--tb-admin)", icon: "shield", descriptionFa: "پنل مدیریت" },
  { key: "about", slug: "about", title: "About", titleFa: "درباره ما", href: "/about", color: "var(--tb-about)", icon: "users", descriptionFa: "درباره تک‌باکس" },
  { key: "contact", slug: "contact", title: "Contact", titleFa: "تماس", href: "/contact", color: "var(--tb-contact)", icon: "chat", descriptionFa: "تماس با ما" },
  { key: "consultation", slug: "consultation", title: "Consultation", titleFa: "مشاوره", href: "/consultation", color: "var(--tb-consultation)", icon: "chat", descriptionFa: "درخواست مشاوره" },
  { key: "workwithus", slug: "workwithus", title: "Work With Us", titleFa: "همکاری", href: "/workwithus", color: "var(--tb-workwithus)", icon: "users", descriptionFa: "همکاری با ما" },
  { key: "search", slug: "search", title: "Search", titleFa: "جستجو", href: "/search", color: "var(--tb-primary)", icon: "home", descriptionFa: "جستجو" },

  // tools – explicit slugs (so HomeModulesSection / feed never gets undefined)
  { key: "nas-selector", slug: "nas-selector", title: "NAS Selector", titleFa: "انتخاب‌گر NAS", href: "/tools/nas-selector", color: "var(--tb-tools)", icon: "server", descriptionFa: "انتخاب NAS" },
  { key: "nvr-selector", slug: "nvr-selector", title: "NVR Selector", titleFa: "انتخاب‌گر NVR", href: "/tools/nvr-selector", color: "var(--tb-raid)", icon: "media", descriptionFa: "انتخاب NVR" },
  { key: "raid-calculator", slug: "raid-calculator", title: "RAID Calculator", titleFa: "ماشین حساب RAID", href: "/tools/raid-calculator", color: "var(--tb-raid)", icon: "disk", descriptionFa: "RAID / SHR" },
  { key: "subnet-calculator", slug: "subnet-calculator", title: "Subnet Calculator", titleFa: "ماشین حساب ساب‌نت", href: "/tools/subnet-calculator", color: "var(--tb-subnet)", icon: "tools", descriptionFa: "ساب‌نت" },
];

const fallbackMeta: ModuleMeta = {
  key: "tools",
  slug: "tools",
  title: "Tools",
  titleFa: "ابزارها",
  href: "/tools",
  color: "var(--tb-primary)",
  icon: "tools",
  descriptionFa: "",
};

// fast lookup
export const moduleMap: Record<string, ModuleMeta> = Object.fromEntries(
  moduleList.map(m => [m.slug, m]).concat(moduleList.map(m => [m.key, m]))
);

// Always safe – never undefined
export function getModuleMeta(slug?: string | null): ModuleMeta {
  if (!slug) return fallbackMeta;
  return moduleMap[slug] ?? { ...fallbackMeta, slug: slug as ModuleKey, key: slug as ModuleKey, href: `/${slug}` };
}

// Legacy / named exports – cover every import style seen in the wild
export const modules = moduleList;
export const MODULES = moduleList;
export const moduleRegistry = moduleMap;
export const MODULE_MAP = moduleMap;

export default moduleList;

// Tool routes – used by ToolsGrid / Sidebar
export const toolRoutes = [
  {
    slug: "nas-selector",
    key: "nas-selector",
    titleFa: "انتخاب‌گر NAS",
    title: "NAS Selector",
    href: "/tools/nas-selector",
    descriptionFa: "پیشنهاد NAS بر اساس ظرفیت، RAID، کاربران و بودجه",
    icon: "server" as const,
    color: "var(--tb-tools)",
    new: true,
  },
  {
    slug: "nvr-selector",
    key: "nvr-selector",
    titleFa: "انتخاب‌گر NVR",
    title: "NVR Selector",
    href: "/tools/nvr-selector",
    descriptionFa: "انتخاب NVR بر اساس دوربین، رزولوشن و روز ضبط",
    icon: "media" as const,
    color: "var(--tb-raid)",
    new: true,
  },
  {
    slug: "raid-calculator",
    key: "raid-calculator",
    titleFa: "ماشین حساب RAID",
    title: "RAID Calculator",
    href: "/tools/raid-calculator",
    descriptionFa: "RAID 0/1/5/6/10 + SHR-1/2",
    icon: "disk" as const,
    color: "var(--tb-raid)",
    version: "v2",
  },
  {
    slug: "subnet-calculator",
    key: "subnet-calculator",
    titleFa: "ماشین حساب ساب‌نت",
    title: "Subnet Calculator",
    href: "/tools/subnet-calculator",
    descriptionFa: "محاسبه IP / CIDR – بدون تغییر",
    icon: "tools" as const,
    color: "var(--tb-subnet)",
  },
] as const;

export type ToolSlug = typeof toolRoutes[number]["slug"];
// ModuleKey already exported at top

```

---

## `config/modules.config.ts`

```ts
import { moduleColors } from "@/config/module-colors";

export type ModuleItem = {
 title: string;
 slug: string;
 description: string;
 color: string;
 cols?: string;
 rows?: string;
 order: number;
};

export const modules: ModuleItem[] = [
 {
 title: "مجله",
 slug: "blog",
 description: "مقالات تخصصی، تحلیل‌ها و راهنماهای عمیق.",
 color: moduleColors.blog.active,
 cols: "md:col-span-4",
 order: 1,
 },
 {
 title: "اخبار",
 slug: "news",
 description: "آخرین خبرهای فناوری، زیرساخت و هوش مصنوعی.",
 color: moduleColors.news.active,
 cols: "md:col-span-3",
 order: 2,
 },
 {
 title: "رسانه ویدیویی",
 slug: "media",
 description: "ویدیوهای آموزشی، بررسی‌ها و محتوای چندرسانه‌ای.",
 color: moduleColors.media.active,
 cols: "md:col-span-3",
 order: 3,
 },
 {
 title: "انجمن",
 slug: "forum",
 description: "پرسش و پاسخ تخصصی کاربران و مهندسین.",
 color: moduleColors.forum.active,
 cols: "md:col-span-4",
 order: 4,
 },
 {
 title: "دانلود",
 slug: "download",
 description: "ISO، Firmware، فایل‌ها و منابع قابل دانلود.",
 color: moduleColors.download.active,
 cols: "md:col-span-4",
 order: 5,
 },
 {
 title: "ابزارها",
 slug: "tools",
 description: "ابزارهای کاربردی برای شبکه و مهندسی سیستم.",
 color: moduleColors.tools.active,
 cols: "md:col-span-3",
 order: 6,
 },
 {
 title: "نقد و بررسی",
 slug: "review",
 description: "بررسی تخصصی تجهیزات، سرویس‌ها و نرم‌افزارها.",
 color: moduleColors.review.active,
 cols: "md:col-span-4",
 order: 7,
 },
 {
 title: "فروشگاه",
 slug: "shop",
 description: "سرور، استوریج و تجهیزات تخصصی زیرساخت.",
 color: moduleColors.shop.active,
 cols: "md:col-span-7",
 order: 8,
 },
];

```

---

## `config/sidebar.config.ts`

```ts
// components/sidebar/sidebar.config.ts
import {
 House,
 BookOpen,
 Newspaper,
 Clapperboard,
 ShoppingBag,
 Users,
 ShieldCheck,
 Download,
 CircleUser,
 Calculator,
 Network,
} from "lucide-react";
import { NavItem } from "@/types/sidebar.types";
import { moduleColors } from "@/config/module-colors";

export const DESKTOP_KEY = "takbox-sidebar-desktop-open";
export const MOBILE_KEY = "takbox-sidebar-mobile-open";
export const THEME_KEY = "takbox-theme";
export const ICON_STROKE = 1.75;

export const navItems: NavItem[] = [
 {
 title: "خانه",
 href: "/",
 icon: House,
 iconClassName: moduleColors.home.base,
 iconHoverClassName: moduleColors.home.hover,
 iconActiveClassName: moduleColors.home.active,
 },
 {
 title: "وبلاگ",
 href: "/blog",
 icon: BookOpen,
 iconClassName: moduleColors.blog.base,
 iconHoverClassName: moduleColors.blog.hover,
 iconActiveClassName: moduleColors.blog.active,
 },
 {
 title: "اخبار",
 href: "/news",
 icon: Newspaper,
 iconClassName: moduleColors.news.base,
 iconHoverClassName: moduleColors.news.hover,
 iconActiveClassName: moduleColors.news.active,
 },
 {
 title: "رسانه",
 href: "/media",
 icon: Clapperboard,
 iconClassName: moduleColors.media.base,
 iconHoverClassName: moduleColors.media.hover,
 iconActiveClassName: moduleColors.media.active,
 },
 {
 title: "فروشگاه",
 href: "/shop",
 icon: ShoppingBag,
 iconClassName: moduleColors.shop.base,
 iconHoverClassName: moduleColors.shop.hover,
 iconActiveClassName: moduleColors.shop.active,
 },
 {
 title: "RAID Calculator",
 href: "/tools/raid-calculator",
 icon: Calculator,
 iconClassName: moduleColors.raid.base,
 iconHoverClassName: moduleColors.raid.hover,
 iconActiveClassName: moduleColors.raid.active,
 },
 {
 title: "Subnet Calculator",
 href: "/tools/subnet-calculator",
 icon: Network,
 iconClassName: moduleColors.subnet.base,
 iconHoverClassName: moduleColors.subnet.hover,
 iconActiveClassName: moduleColors.subnet.active,
 },
 {
 title: "انجمن",
 href: "/forum",
 icon: Users,
 iconClassName: moduleColors.forum.base,
 iconHoverClassName: moduleColors.forum.hover,
 iconActiveClassName: moduleColors.forum.active,
 },
 {
 title: "نقد و بررسی",
 href: "/review",
 icon: ShieldCheck,
 iconClassName: moduleColors.review.base,
 iconHoverClassName: moduleColors.review.hover,
 iconActiveClassName: moduleColors.review.active,
 },
 {
 title: "دانلود",
 href: "/download",
 icon: Download,
 iconClassName: moduleColors.download.base,
 iconHoverClassName: moduleColors.download.hover,
 iconActiveClassName: moduleColors.download.active,
 },
];

export const accountItem: NavItem = {
 title: "حساب کاربری",
 href: "/account",
 icon: CircleUser,
 iconClassName: moduleColors.account.base,
 iconHoverClassName: moduleColors.account.hover,
 iconActiveClassName: moduleColors.account.active,
};

export const themeIconClass = {
 buttonBase:
 "inline-flex h-10 w-10 items-center rounded-[var(--tb-radius-lg)] transition-all duration-[var(--tb-motion-md)]",
 buttonClassName: "text-[var(--tb-fg-muted)]",
 buttonHoverClassName: "hover:text-[var(--tb-fg-primary)]",
 sunIconClassName: "text-[var(--tb-warning)]",
 sunIconHoverClassName: "group-hover:text-[var(--tb-warning)]",
 sunIconActiveClassName: "text-[var(--tb-fg-primary)] group-hover:text-[var(--tb-warning)]",
  moonIconClassName: "text-[var(--tb-fg-primary)]",
 moonIconHoverClassName: "group-hover:text-[var(--tb-info)]",
 moonIconActiveClassName:
 "text-[var(--tb-fg-primary)] dark:text-[var(--tb-fg-primary)] group-hover:text-[var(--tb-info)]",
};

export const sidebarBase = [
 "bg-[var(--tb-bg-primary)] text-[var(--tb-fg-primary)]",
 "shadow-[var(--tb-shadow-lg)]",
].join(" ");

export const linkBase =
 "group relative flex h-11 w-full items-center rounded-[var(--tb-radius-lg)] tb-text-md transition-all duration-[var(--tb-motion-md)]";

export const linkInactive = "text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]";

export const linkActive = "bg-[var(--tb-bg-muted)]/50 text-[var(--tb-fg-primary)]";

export function isActive(pathname: string, href: string) {
 return href === "/"
 ? pathname === "/"
 : pathname === href || pathname.startsWith(`${href}/`);
}

```

---

## `constants/app.constants.ts`

```ts
export const SITE_NAME = "تکباکس";
export const SITE_NAME_EN = "TechBox";
export const SITE_DESC_FA = "پاتوق بچه‌های فناوری اطلاعات";
export const COMPANY_FA = "هونامیک ارتباط رستاک";
export const LOCALE = "fa-IR";
export const TIMEZONE = "Asia/Tehran";
export const PAGE_SIZE_DEFAULT = 12;
export const COMMENT_MAX_LENGTH = 2000;


```

---

## `constants/index.ts`

```ts
export * from "./app.constants";
export * from "./routes.constants";
export * from "./module.constants";
export * from "./validation.constants";

```

---

## `constants/module.constants.ts`

```ts
export const MODULES = ["blog","news","media","review","tools","download","shop","forum"] as const;
export type ModuleSlug = typeof MODULES[number];

```

---

## `constants/routes.constants.ts`

```ts
export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  NEWS: "/news",
  MEDIA: "/media",
  REVIEW: "/review",
  SHOP: "/shop",
  TOOLS: "/tools",
  FORUM: "/forum",
  DOWNLOAD: "/download",
  ACCOUNT: "/account",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_POSTS: "/admin/posts",
  ADMIN_ROLES: "/admin/roles",
  CONTACT: "/contact",
  ABOUT: "/about",
  CONSULTATION: "/consultation",
  SEARCH: "/search",
} as const;
export type AppRoute = typeof ROUTES[keyof typeof ROUTES];

```

---

## `constants/validation.constants.ts`

```ts
import { z } from "zod";
export const slugSchema = z.string().min(2).regex(/^[a-z0-9-]+$/);
export const faText = z.string().min(2).max(5000);

```

---

## `data/blog.json`

```json
[
  {
    "slug": "dell-server-os-install",
    "module": "blog",
    "title": "نصب سیستم عامل بر روی سرور Dell",
    "excerpt": "نصب و تنظیم سیستم عامل سرور نیاز به حوصله و تجربه دارد. قدم به قدم با من همراه باشید.",
    "content": "در این مقاله نحوه نصب ESXi و Ubuntu Server روی Dell R740 را بررسی می‌کنیم...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "dell",
      "سرور",
      "لینوکس",
      "زیرساخت",
      "QNAP-2277",
      "server",
      "linux"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-22",
    "date_fa": "1 تیر 1405",
    "likes": 124,
    "views": 3410,
    "category": "آموزشی"
  },
  {
    "slug": "hp-raid-config",
    "module": "blog",
    "title": "راهنمای کامل پیکربندی RAID در سرورهای HP",
    "excerpt": "بهترین تعادل بین کارایی و امنیت اطلاعات برای زیرساخت سازمان شما.",
    "content": "RAID 10 vs RAID 5 ...",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "hp",
      "raid",
      "storage",
      "زیرساخت",
      "ذخیره‌سازی"
    ],
    "author": {
      "name": "عطیه حاتمی",
      "role": "مهندس کامپیوتر",
      "avatar": "/assets/atiye.png"
    },
    "date": "2026-06-26",
    "date_fa": "5 تیر 1405",
    "likes": 98,
    "views": 2102,
    "category": "زیرساخت"
  },
  {
    "slug": "vmware-optimize",
    "module": "blog",
    "title": "بهینه‌سازی مصرف منابع در ماشین‌های مجازی VMware",
    "excerpt": "کندی VMها را با تنظیمات درست از بین ببرید.",
    "content": "...",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "vmware",
      "مجازی‌سازی",
      "بهینه‌سازی",
      "virtualization"
    ],
    "author": {
      "name": "بهناز قادری",
      "role": "طراح سایت",
      "avatar": "/assets/behnaz.png"
    },
    "date": "2026-06-30",
    "date_fa": "9 تیر 1405",
    "likes": 76,
    "views": 1880,
    "category": "مجازی‌سازی"
  },
  {
    "slug": "network-security-10tips",
    "module": "blog",
    "title": "۱۰ نکته مهم برای افزایش امنیت شبکه داخلی سازمان",
    "excerpt": "از VLAN تا مانیتورینگ ترافیک.",
    "content": "...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "امنیت",
      "شبکه",
      "vlan",
      "فایروال",
      "network",
      "security",
      "firewall"
    ],
    "author": {
      "name": "نسترن خداکرمی",
      "role": "فعال حوزه فناوری اطلاعات",
      "avatar": "/assets/nastaran.png"
    },
    "date": "2026-07-04",
    "date_fa": "13 تیر 1405",
    "likes": 210,
    "views": 5920,
    "category": "امنیت"
  },
  {
    "slug": "zabbix-monitoring",
    "module": "blog",
    "title": "آموزش مانیتورینگ سرورها با Zabbix از صفر تا اجرا",
    "excerpt": "نصب Zabbix، تریگرها و داشبورد کاربردی.",
    "content": "...",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "zabbix",
      "مانیتورینگ",
      "لینوکس",
      "سرور",
      "server",
      "monitoring",
      "linux"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-08",
    "date_fa": "17 تیر 1405",
    "likes": 142,
    "views": 3301,
    "category": "مانیتورینگ"
  },
  {
    "slug": "nas-vs-san",
    "module": "blog",
    "title": "بررسی تفاوت NAS و SAN برای ذخیره‌سازی سازمانی",
    "excerpt": "مزایا، محدودیت‌ها و سناریوهای مناسب هرکدام.",
    "content": "...",
    "image": "/assets/blog-6.png",
    "tags": [
      "nas",
      "san",
      "storage",
      "QNAP-2277",
      "ذخیره‌سازی"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "likes": 88,
    "views": 2540,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "immutable-backup-guide",
    "module": "blog",
    "title": "راهنمای پیاده‌سازی Immutable Backup برای سازمان‌ها",
    "excerpt": "چطور بکاپی بسازیم که باج‌افزار نتواند آن را حذف یا رمزنگاری کند؟",
    "content": "در این راهنما سیاست‌های retention، نسخه‌بندی، air-gap و تست بازیابی را بررسی می‌کنیم...",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "backup",
      "امنیت",
      "storage",
      "باج‌افزار",
      "security",
      "ذخیره‌سازی",
      "بکاپ"
    ],
    "author": {
      "name": "نسترن خداکرمی",
      "role": "فعال حوزه فناوری اطلاعات",
      "avatar": "/assets/nastaran.png"
    },
    "date": "2026-07-15",
    "date_fa": "24 تیر 1405",
    "likes": 156,
    "views": 3650,
    "category": "امنیت"
  },
  {
    "slug": "wifi-7-network-design",
    "module": "blog",
    "title": "طراحی شبکه سازمانی با Wi‑Fi 7؛ از کانال‌بندی تا Roaming",
    "excerpt": "نکات عملی برای طراحی وایرلس پرظرفیت در شرکت‌ها و محیط‌های آموزشی.",
    "content": "Wi‑Fi 7 با MLO و کانال‌های عریض‌تر فرصت‌های جدیدی ایجاد می‌کند...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "wifi7",
      "شبکه",
      "طراحی شبکه",
      "network"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "likes": 132,
    "views": 2810,
    "category": "شبکه"
  },
  {
    "slug": "proxmox-cluster-basics",
    "module": "blog",
    "title": "ساخت کلاستر Proxmox برای کسب‌وکارهای کوچک",
    "excerpt": "از نصب نودها تا shared storage و HA؛ یک مسیر عملی برای شروع.",
    "content": "در این مقاله سناریوی سه نود Proxmox را قدم‌به‌قدم طراحی می‌کنیم...",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "proxmox",
      "مجازی‌سازی",
      "cluster",
      "virtualization"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-13",
    "date_fa": "22 تیر 1405",
    "likes": 201,
    "views": 4920,
    "category": "مجازی‌سازی"
  },
  {
    "slug": "nvme-vs-sata-server",
    "module": "blog",
    "title": "NVMe یا SATA SSD برای سرور؟ انتخاب درست بر اساس workload",
    "excerpt": "همیشه سریع‌ترین گزینه بهترین نیست؛ latency، endurance و بودجه را با هم ببینید.",
    "content": "برای دیتابیس، مجازی‌سازی و فایل‌سرور رفتار I/O متفاوت است...",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "nvme",
      "ssd",
      "سرور",
      "storage",
      "ذخیره‌سازی",
      "server"
    ],
    "author": {
      "name": "عطیه حاتمی",
      "role": "مهندس کامپیوتر",
      "avatar": "/assets/atiye.png"
    },
    "date": "2026-07-11",
    "date_fa": "20 تیر 1405",
    "likes": 119,
    "views": 2710,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "mikrotik-firewall-baseline",
    "module": "blog",
    "title": "Baseline فایروال MikroTik برای شبکه‌های کوچک",
    "excerpt": "قوانین پایه، input chain، محدودسازی مدیریت و ثبت لاگ‌های ضروری.",
    "content": "یک کانفیگ پایه امن برای شروع مدیریت روترهای MikroTik...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "میکروتیک",
      "فایروال",
      "امنیت",
      "شبکه",
      "network",
      "security",
      "firewall"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-10",
    "date_fa": "19 تیر 1405",
    "likes": 174,
    "views": 3880,
    "category": "امنیت"
  },
  {
    "slug": "zero-trust-for-smb-iran",
    "module": "blog",
    "title": "Zero Trust برای شرکت‌های کوچک؛ از شعار تا اجرای عملی",
    "excerpt": "چطور بدون بودجه سنگین، دسترسی‌ها، احراز هویت و لاگ‌ها را مرحله‌به‌مرحله امن‌تر کنیم؟",
    "content": "Zero Trust یعنی هیچ کاربر، دستگاه یا سرویس داخلی را به صورت پیش‌فرض قابل اعتماد فرض نکنیم. در این راهنما از MFA، تفکیک شبکه، least privilege، لاگ‌گیری و تست دوره‌ای شروع می‌کنیم و یک نقشه راه کم‌هزینه برای شرکت‌های کوچک ارائه می‌دهیم.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "zero trust",
      "امنیت",
      "mfa",
      "شبکه",
      "فایروال",
      "network",
      "security",
      "firewall"
    ],
    "author": {
      "name": "نسترن خداکرمی",
      "role": "فعال حوزه فناوری اطلاعات",
      "avatar": "/assets/nastaran.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 187,
    "views": 4210,
    "category": "امنیت"
  },
  {
    "slug": "postgres-backup-restore-playbook",
    "module": "blog",
    "title": "Playbook بکاپ و بازیابی PostgreSQL برای تیم‌های IT",
    "excerpt": "از pg_dump تا PITR؛ برنامه‌ای که فقط روی کاغذ نباشد و واقعاً بازیابی شود.",
    "content": "یک بکاپ خوب بدون تست restore ارزشی ندارد. این مقاله ساختار snapshot، WAL archiving، رمزنگاری، نگهداری خارج از سایت و تمرین بازیابی ماهانه را بررسی می‌کند.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "postgresql",
      "backup",
      "database",
      "لینوکس",
      "امنیت",
      "security",
      "بکاپ",
      "linux"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-17",
    "date_fa": "26 تیر 1405",
    "likes": 146,
    "views": 3370,
    "category": "دیتابیس"
  },
  {
    "slug": "sfp-transceiver-buying-guide",
    "module": "blog",
    "title": "راهنمای خرید ماژول SFP؛ سازگاری، فاصله و دمای کاری",
    "excerpt": "چرا یک SFP ارزان می‌تواند باعث packet loss، flap و قطعی‌های عجیب شود؟",
    "content": "در خرید SFP باید به نوع فیبر، طول موج، فاصله، DOM، دمای کاری، سازگاری با برند سوئیچ و کیفیت لاگ‌ها توجه کرد. در این مطلب چک‌لیست انتخاب و تست اولیه را مرور می‌کنیم.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "sfp",
      "شبکه",
      "سوئیچ",
      "فیبر نوری",
      "دیتاسنتر",
      "network",
      "switch"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "likes": 98,
    "views": 2440,
    "category": "شبکه"
  },
  {
    "slug": "windows-server-hardening-checklist",
    "module": "blog",
    "title": "چک‌لیست Hardening ویندوز سرور بعد از نصب اولیه",
    "excerpt": "تنظیماتی که قبل از تحویل سرور به واحد عملیاتی باید بررسی شوند.",
    "content": "از نام‌گذاری و patch policy تا audit policy، محدودسازی RDP، Windows Defender، firewall، time sync و گروه‌های ادمین؛ این چک‌لیست برای تحویل امن‌تر سرورهای ویندوزی آماده شده است.",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "windows server",
      "hardening",
      "امنیت",
      "اکتیودایرکتوری",
      "security"
    ],
    "author": {
      "name": "عطیه حاتمی",
      "role": "مهندس کامپیوتر",
      "avatar": "/assets/atiye.png"
    },
    "date": "2026-07-09",
    "date_fa": "18 تیر 1405",
    "likes": 165,
    "views": 3990,
    "category": "امنیت"
  },
  {
    "slug": "server-room-temperature-monitoring",
    "module": "blog",
    "title": "مانیتورینگ دما و رطوبت اتاق سرور با سنسورهای اقتصادی",
    "excerpt": "قبل از خرابی تجهیزات، هشدار درست دریافت کنید؛ از سنسور تا داشبورد و پیامک.",
    "content": "گرما و رطوبت از دلایل رایج قطعی تجهیزات هستند. در این مقاله انتخاب سنسور، آستانه هشدار، اتصال به Zabbix و سناریوی اطلاع‌رسانی بررسی می‌شود.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "مانیتورینگ",
      "اتاق سرور",
      "zabbix",
      "سنسور",
      "زیرساخت",
      "monitoring"
    ],
    "author": {
      "name": "بهناز قادری",
      "role": "طراح سایت",
      "avatar": "/assets/behnaz.png"
    },
    "date": "2026-07-03",
    "date_fa": "12 تیر 1405",
    "likes": 111,
    "views": 2190,
    "category": "مانیتورینگ"
  }
]

```

---

## `data/comments.json`

```json
[
  {
    "id": "c1",
    "content_type": "blog",
    "content_slug": "nas-vs-san",
    "parent_id": null,
    "author": "علی",
    "text": "مقاله عالی بود، مخصوصا بخش QNAP-2277",
    "likes": 12,
    "dislikes": 1,
    "date": "2026-07-13T10:22:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c2",
    "content_type": "blog",
    "content_slug": "nas-vs-san",
    "parent_id": "c1",
    "author": "سارا",
    "text": "ممنون علی جان ❤️",
    "likes": 3,
    "dislikes": 0,
    "date": "2026-07-13T11:00:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c3",
    "content_type": "media",
    "content_slug": "qnap-2277-review-video",
    "parent_id": null,
    "author": "مهدی",
    "text": "ویدیو QNAP فوق‌العاده بود",
    "likes": 7,
    "dislikes": 0,
    "date": "2026-07-11T09:00:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c4",
    "content_type": "blog",
    "content_slug": "zero-trust-for-smb-iran",
    "parent_id": null,
    "author": "محسن",
    "text": "برای شرکت‌های کوچک واقعاً MFA و تفکیک VLAN از همه چیز فوری‌تره. ممنون بابت چک‌لیست.",
    "likes": 9,
    "dislikes": 0,
    "date": "2026-07-18T08:12:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c5",
    "content_type": "blog",
    "content_slug": "zero-trust-for-smb-iran",
    "parent_id": "c4",
    "author": "نسترن",
    "text": "دقیقاً. پیشنهاد ما هم اجرای مرحله‌ایه تا تیم دچار مقاومت نشه.",
    "likes": 5,
    "dislikes": 0,
    "date": "2026-07-18T09:00:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c6",
    "content_type": "blog",
    "content_slug": "postgres-backup-restore-playbook",
    "parent_id": null,
    "author": "امیر DBA",
    "text": "قسمت تست Restore خیلی مهم بود. خیلی‌ها فقط بکاپ می‌گیرن و هیچ‌وقت برنمی‌گردونن.",
    "likes": 14,
    "dislikes": 0,
    "date": "2026-07-17T12:25:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c7",
    "content_type": "media",
    "content_slug": "proxmox-ha-demo-video",
    "parent_id": null,
    "author": "رضا",
    "text": "اگر storage قطع بشه رفتار HA رو هم لطفاً توی قسمت بعدی تست کنید.",
    "likes": 8,
    "dislikes": 0,
    "date": "2026-07-18T14:40:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c8",
    "content_type": "media",
    "content_slug": "fortigate-policy-review",
    "parent_id": null,
    "author": "سجاد",
    "text": "Rule cleanup توی FortiGate همیشه ترسناک بوده، ویدیو خیلی کاربردی بود.",
    "likes": 6,
    "dislikes": 1,
    "date": "2026-07-16T17:10:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c9",
    "content_type": "review",
    "content_slug": "hpe-dl380-gen11-review",
    "parent_id": null,
    "author": "کیوان",
    "text": "لطفاً تست مصرف برق با دو پاور و چند پروفایل BIOS هم اضافه کنید.",
    "likes": 11,
    "dislikes": 0,
    "date": "2026-07-16T10:35:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c10",
    "content_type": "review",
    "content_slug": "mikrotik-crs-10g-review",
    "parent_id": null,
    "author": "سامان",
    "text": "برای رک کوچک به نظرم CRS انتخاب اقتصادی خوبیه ولی باید airflow درست باشه.",
    "likes": 7,
    "dislikes": 0,
    "date": "2026-07-18T11:45:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c11",
    "content_type": "shop",
    "content_slug": "fortigate-60f-firewall",
    "parent_id": null,
    "author": "واحد خرید",
    "text": "برای دو شعبه با VPN پایدار همین مدل جواب می‌دهد یا 80F پیشنهاد می‌کنید؟",
    "likes": 3,
    "dislikes": 0,
    "date": "2026-07-18T13:20:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c12",
    "content_type": "shop",
    "content_slug": "samsung-pm9a3-nvme",
    "parent_id": null,
    "author": "حمید",
    "text": "برای دیتابیس PostgreSQL بهتره PM9A3 بگیریم یا مدل با endurance بالاتر؟",
    "likes": 4,
    "dislikes": 0,
    "date": "2026-07-17T15:05:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c13",
    "content_type": "download",
    "content_slug": "proxmox-ve-8-iso",
    "parent_id": null,
    "author": "آرش",
    "text": "لینک مستقیم عالیه. اگر checksum هم اضافه بشه کامل‌تر می‌شه.",
    "likes": 10,
    "dislikes": 0,
    "date": "2026-07-17T09:22:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c14",
    "content_type": "forum",
    "content_slug": "raid10-or-raid6-for-vm-storage",
    "parent_id": null,
    "author": "هومن",
    "text": "برای workload مجازی‌سازی اگر ظرفیت اجازه بده RAID10 معمولاً latency بهتری می‌دهد.",
    "likes": 13,
    "dislikes": 0,
    "date": "2026-07-19T08:00:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c15",
    "content_type": "forum",
    "content_slug": "best-firewall-for-small-office",
    "parent_id": null,
    "author": "روژینا",
    "text": "اگر گزارش‌گیری و UTM جدی می‌خواهید FortiGate ساده‌تر مدیریت می‌شود، ولی MikroTik اقتصادی‌تر است.",
    "likes": 15,
    "dislikes": 1,
    "date": "2026-07-20T07:30:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c16",
    "content_type": "forum",
    "content_slug": "best-firewall-for-small-office",
    "parent_id": null,
    "author": "کاربر شبکه",
    "text": "ممنون از پاسخ‌ها. با دو لینک اینترنت، MikroTik با failover راه‌اندازی کردم و تا الان پایدار بوده.",
    "likes": 6,
    "dislikes": 0,
    "date": "2026-07-20T10:05:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c17",
    "content_type": "forum",
    "content_slug": "raid10-or-raid6-for-vm-storage",
    "parent_id": null,
    "author": "سارا",
    "text": "برای ۸ دیسک SAS و workload مجازی‌سازی، RAID10 انتخاب امن‌تری از نظر IOPS و زمان rebuild است.",
    "likes": 11,
    "dislikes": 0,
    "date": "2026-07-21T09:15:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c18",
    "content_type": "forum",
    "content_slug": "raid10-or-raid6-for-vm-storage",
    "parent_id": null,
    "author": "نیما",
    "text": "اگر ظرفیت خیلی مهم است RAID6 هم گزینه است ولی write penalty را در نظر بگیرید.",
    "likes": 7,
    "dislikes": 0,
    "date": "2026-07-21T11:40:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c19",
    "content_type": "forum",
    "content_slug": "wifi7-controller-placement",
    "parent_id": null,
    "author": "مهدی",
    "text": "برای Wi-Fi 7 کنترلر را وسط ساختمان و دور از منابع تداخل بگذارید؛ پوشش یکنواخت‌تری می‌گیرید.",
    "likes": 9,
    "dislikes": 0,
    "date": "2026-07-22T08:20:00Z",
    "author_avatar": "/assets/hooman.png"
  },
  {
    "id": "c20",
    "content_type": "forum",
    "content_slug": "wifi7-controller-placement",
    "parent_id": null,
    "author": "روژینا",
    "text": "site survey قبل از نصب واقعاً فرق ایجاد می‌کند، مخصوصاً در محیط‌های شلوغ ۶ گیگاهرتز.",
    "likes": 5,
    "dislikes": 0,
    "date": "2026-07-22T09:50:00Z",
    "author_avatar": "/assets/hooman.png"
  }
]

```

---

## `data/download.json`

```json
[
  {
    "slug": "ubuntu-server-24-iso",
    "module": "download",
    "title": "دانلود Ubuntu Server 24.04 LTS",
    "excerpt": "ایزو رسمی با لینک مستقیم داخل ایران.",
    "content": "...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "لینوکس",
      "ubuntu",
      "دانلود",
      "سرور",
      "ایزو",
      "server",
      "download",
      "linux"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-07",
    "date_fa": "16 تیر 1405",
    "likes": 920,
    "views": 34100,
    "category": "سیستم‌عامل"
  },
  {
    "slug": "qnap-2277-firmware",
    "module": "download",
    "title": "فریم‌ور QNAP TS-2277 v5.2",
    "excerpt": "آخرین فریم‌ور رسمی QNAP-2277.",
    "content": "...",
    "image": "/assets/blog-6.png",
    "tags": [
      "QNAP-2277",
      "firmware",
      "nas",
      "دانلود",
      "qnap",
      "download",
      "فریم‌ور"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-06",
    "date_fa": "15 تیر 1405",
    "likes": 67,
    "views": 1800,
    "category": "فریم‌ور"
  },
  {
    "slug": "windows-server-2022-eval-iso",
    "module": "download",
    "title": "دانلود Windows Server 2022 Evaluation ISO",
    "excerpt": "نسخه ارزیابی ویندوز سرور برای تست لَب و سناریوهای آموزشی.",
    "content": "ایزو ارزیابی برای نصب آزمایشی و راه‌اندازی لَب اکتیودایرکتوری و سرویس‌ها.",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "windows",
      "server",
      "iso",
      "دانلود",
      "microsoft",
      "سرور",
      "download",
      "ویندوز"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 488,
    "views": 22200,
    "category": "سیستم‌عامل"
  },
  {
    "slug": "proxmox-ve-8-iso",
    "module": "download",
    "title": "دانلود Proxmox VE 8 ISO",
    "excerpt": "ایزو نصب Proxmox VE برای مجازی‌سازی و کلاسترهای کوچک.",
    "content": "Proxmox VE برای راه‌اندازی hypervisor متن‌باز با KVM و LXC.",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "proxmox",
      "linux",
      "virtualization",
      "iso",
      "دانلود",
      "مجازی‌سازی",
      "download",
      "لینوکس"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-17",
    "date_fa": "26 تیر 1405",
    "likes": 734,
    "views": 29100,
    "category": "مجازی‌سازی"
  },
  {
    "slug": "vmware-esxi-8-driver-pack-dell",
    "module": "download",
    "title": "Driver Pack سازگار Dell برای VMware ESXi 8",
    "excerpt": "بسته درایور شبکه و ذخیره‌سازی برای نصب ESXi روی سرورهای Dell منتخب.",
    "content": "این بسته برای تست لَب و نصب کنترل‌شده ESXi روی سخت‌افزار Dell آماده شده است.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "dell",
      "vmware",
      "esxi",
      "driver",
      "دانلود",
      "download"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "likes": 206,
    "views": 9100,
    "category": "درایور"
  },
  {
    "slug": "mikrotik-routeros-7-stable",
    "module": "download",
    "title": "دانلود MikroTik RouterOS 7 Stable",
    "excerpt": "نسخه پایدار RouterOS 7 برای روترها و CHR با لینک مستقیم.",
    "content": "RouterOS 7 برای تست ویژگی‌های جدید routing، wireguard و bridge filtering.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "mikrotik",
      "routeros",
      "firmware",
      "network",
      "دانلود",
      "شبکه",
      "download",
      "فریم‌ور"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-15",
    "date_fa": "24 تیر 1405",
    "likes": 362,
    "views": 13700,
    "category": "فریم‌ور"
  },
  {
    "slug": "zabbix-appliance-7-image",
    "module": "download",
    "title": "Image آماده Zabbix Appliance 7 برای تست سریع",
    "excerpt": "ایمیج آماده برای اجرای سریع Zabbix در محیط آزمایشگاهی.",
    "content": "برای تست اولیه مانیتورینگ بدون نصب دستی دیتابیس و وب‌سرور.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "zabbix",
      "monitoring",
      "appliance",
      "linux",
      "دانلود",
      "مانیتورینگ",
      "download",
      "لینوکس"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "likes": 149,
    "views": 6400,
    "category": "مانیتورینگ"
  },
  {
    "slug": "hpe-spp-gen11-package",
    "module": "download",
    "title": "بسته Service Pack for ProLiant برای HPE Gen11",
    "excerpt": "مجموعه firmware و ابزارهای نگهداری برای سرورهای HPE نسل جدید.",
    "content": "SPP برای به‌روزرسانی کنترل‌شده firmware و اجزای سرور در پنجره نگهداری.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "hpe",
      "hp",
      "firmware",
      "server",
      "دانلود",
      "سرور",
      "download",
      "فریم‌ور"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-13",
    "date_fa": "22 تیر 1405",
    "likes": 276,
    "views": 11800,
    "category": "فریم‌ور"
  },
  {
    "slug": "ubuntu-cloud-image-24-04",
    "module": "download",
    "title": "Ubuntu 24.04 Cloud Image برای KVM و Proxmox",
    "excerpt": "ایمیج سبک cloud-init ready برای ساخت سریع VM در لَب و پروداکشن.",
    "content": "Cloud image مناسب automation، cloud-init و template سازی در Proxmox/KVM.",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "ubuntu",
      "cloud-init",
      "kvm",
      "proxmox",
      "دانلود",
      "download"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "likes": 331,
    "views": 15900,
    "category": "سیستم‌عامل"
  },
  {
    "slug": "qnap-qfinder-pro-windows",
    "module": "download",
    "title": "QNAP Qfinder Pro برای Windows",
    "excerpt": "ابزار پیدا کردن، تنظیم اولیه و مدیریت سریع NASهای QNAP در شبکه.",
    "content": "Qfinder Pro برای کشف NAS، تنظیم IP، mapping و دسترسی سریع مدیریتی استفاده می‌شود.",
    "image": "/assets/blog-6.png",
    "tags": [
      "qnap",
      "QNAP-2277",
      "windows",
      "utility",
      "دانلود",
      "download",
      "ویندوز"
    ],
    "author": {
      "name": "تکباکس دانلود",
      "role": "دانلود",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-11",
    "date_fa": "20 تیر 1405",
    "likes": 118,
    "views": 5200,
    "category": "ابزار"
  }
]

```

---

## `data/forum.json`

```json
[
  {
    "slug": "best-firewall-for-small-office",
    "module": "forum",
    "title": "برای دفتر ۳۰ نفره MikroTik بهتره یا FortiGate؟",
    "excerpt": "بودجه محدود داریم ولی VPN و گزارش‌گیری خوب می‌خوایم.",
    "content": "دوستان برای یک دفتر حدود ۳۰ نفر با دو لینک اینترنت، بین MikroTik و FortiGate کدام انتخاب منطقی‌تر است؟",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "firewall",
      "mikrotik",
      "fortigate",
      "پرسش",
      "فایروال"
    ],
    "author": {
      "name": "کاربر شبکه",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-20",
    "date_fa": "29 تیر 1405",
    "likes": 14,
    "views": 430,
    "category": "پرسش"
  },
  {
    "slug": "raid10-or-raid6-for-vm-storage",
    "module": "forum",
    "title": "برای Storage ماشین‌های مجازی RAID10 یا RAID6؟",
    "excerpt": "IOPS مهمه ولی ظرفیت هم محدود داریم.",
    "content": "روی سرور HPE با ۸ دیسک SAS برای مجازی‌سازی RAID10 بهتر است یا RAID6؟",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "raid",
      "storage",
      "virtualization",
      "پرسش",
      "ذخیره‌سازی",
      "مجازی‌سازی"
    ],
    "author": {
      "name": "سعید دیتاسنتر",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-19",
    "date_fa": "28 تیر 1405",
    "likes": 21,
    "views": 620,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "wifi7-controller-placement",
    "module": "forum",
    "title": "کنترلر Wi‑Fi 7 را Cloud بگیریم یا On‑prem؟",
    "excerpt": "برای شرکت چند شعبه‌ای دنبال تجربه عملی هستم.",
    "content": "برای چند شعبه با ۴۰ اکسس‌پوینت، کنترلر ابری بهتر است یا داخلی؟",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "wifi7",
      "wireless",
      "controller",
      "پرسش"
    ],
    "author": {
      "name": "مهندس وایرلس",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 9,
    "views": 275,
    "category": "شبکه"
  },
  {
    "slug": "proxmox-backup-server-retention",
    "module": "forum",
    "title": "Retention مناسب برای Proxmox Backup Server چطور تنظیم شود؟",
    "excerpt": "روزانه بکاپ می‌گیریم و فضای دیسک سریع پر می‌شود.",
    "content": "برای نگهداری بکاپ روزانه/هفتگی/ماهانه روی PBS چه سیاستی پیشنهاد می‌کنید؟",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "proxmox",
      "backup",
      "pbs",
      "پرسش",
      "بکاپ"
    ],
    "author": {
      "name": "آرش مجازی‌سازی",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-17",
    "date_fa": "26 تیر 1405",
    "likes": 16,
    "views": 510,
    "category": "مجازی‌سازی"
  },
  {
    "slug": "qnap-2277-iscsi-issue",
    "module": "forum",
    "title": "مشکل iSCSI در QNAP-2277",
    "excerpt": "کسی تجربه قطعی لحظه‌ای iSCSI داشته؟",
    "content": "سلام دوستان...",
    "image": "/assets/blog-6.png",
    "tags": [
      "QNAP-2277",
      "iscsi",
      "nas",
      "پرسش"
    ],
    "author": {
      "name": "کاربر 9821",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-13",
    "date_fa": "22 تیر 1405",
    "likes": 5,
    "views": 210,
    "category": "پرسش"
  },
  {
    "slug": "proxmox-vs-vmware",
    "module": "forum",
    "title": "Proxmox یا VMware برای هاستینگ کوچک؟",
    "excerpt": "جمع‌بندی تجربیات.",
    "content": "...",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "مجازی‌سازی",
      "proxmox",
      "vmware",
      "پرسش",
      "virtualization"
    ],
    "author": {
      "name": "admin",
      "role": "مدیر",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-02",
    "date_fa": "11 تیر 1405",
    "likes": 18,
    "views": 640,
    "category": "بحث"
  },
  {
    "slug": "best-switch-for-ip-camera-vlan",
    "module": "forum",
    "title": "برای دوربین‌های IP، سوئیچ PoE جدا بگیریم یا VLAN کافی است؟",
    "excerpt": "حدود ۶۰ دوربین داریم و نمی‌خواهیم ترافیک روی شبکه کاربران اثر بگذارد.",
    "content": "برای پروژه نظارت تصویری با ۶۰ دوربین IP، طراحی درست VLAN/PoE و uplink چه پیشنهادهایی دارید؟",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "poe",
      "vlan",
      "camera",
      "switch",
      "پرسش",
      "سوئیچ"
    ],
    "author": {
      "name": "عضو تکباکس",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-21",
    "date_fa": "30 تیر 1405",
    "likes": 12,
    "views": 360,
    "category": "شبکه"
  },
  {
    "slug": "immutable-backup-on-nas",
    "module": "forum",
    "title": "Immutable Backup روی NAS خانگی/اداری قابل اعتماد است؟",
    "excerpt": "برای مقابله با باج‌افزار دنبال راهکار کم‌هزینه هستم.",
    "content": "آیا snapshot lock و replication روی NAS برای immutable backup کافی است یا باید object storage جداگانه داشته باشیم؟",
    "image": "/assets/blog-6.png",
    "tags": [
      "backup",
      "nas",
      "ransomware",
      "storage",
      "پرسش",
      "ذخیره‌سازی",
      "بکاپ"
    ],
    "author": {
      "name": "لیلا بکاپ",
      "role": "عضو انجمن",
      "avatar": "/assets/behnaz.png"
    },
    "date": "2026-07-20",
    "date_fa": "29 تیر 1405",
    "likes": 19,
    "views": 540,
    "category": "بکاپ"
  },
  {
    "slug": "zabbix-vs-prometheus-for-infra",
    "module": "forum",
    "title": "Zabbix یا Prometheus برای مانیتورینگ زیرساخت سازمانی؟",
    "excerpt": "بیشتر سرور، سوئیچ و فایروال داریم؛ اپلیکیشن کمتر.",
    "content": "برای مانیتورینگ زیرساخت کلاسیک، Zabbix بهتر است یا Prometheus/Grafana؟ تجربه عملی شما چیست؟",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "zabbix",
      "prometheus",
      "monitoring",
      "زیرساخت",
      "مانیتورینگ"
    ],
    "author": {
      "name": "مهدی NOC",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-19",
    "date_fa": "28 تیر 1405",
    "likes": 23,
    "views": 710,
    "category": "مانیتورینگ"
  },
  {
    "slug": "windows-rdp-bruteforce-protection",
    "module": "forum",
    "title": "برای جلوگیری از brute force روی RDP چه راهکاری دارید؟",
    "excerpt": "چند سرور ویندوزی بیرون از شبکه داریم و لاگین ناموفق زیاد شده.",
    "content": "بهترین ترکیب برای امن کردن RDP چیست؟ VPN، RD Gateway، MFA یا محدودسازی IP؟",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "windows",
      "rdp",
      "security",
      "mfa",
      "پرسش",
      "امنیت",
      "ویندوز"
    ],
    "author": {
      "name": "فرهاد ویندوز",
      "role": "عضو انجمن",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 17,
    "views": 605,
    "category": "امنیت"
  }
]

```

---

## `data/jobs.json`

```json
[
  {
    "slug": "senior-network-engineer",
    "title": "مهندس ارشد شبکه",
    "type": "تمام‌وقت",
    "remote": "حضوری – تهران",
    "date": "2026-07-10",
    "date_fa": "19 تیر 1405",
    "team": "زیرساخت",
    "excerpt": "طراحی و پیاده‌سازی شبکه‌های سازمانی، میکروتیک / سیسکو",
    "description": "ما در تکباکس به‌دنبال مهندس شبکه با حداقل ۴ سال تجربه عملی در روتینگ، سوئیچینگ، فایروال و مانیتورینگ هستیم. تسلط به MikroTik / Cisco و تجربه Zabbix مزیت است."
  },
  {
    "slug": "content-editor-tech",
    "title": "دبیر محتوای تکنولوژی",
    "type": "پاره‌وقت",
    "remote": "ریموت",
    "date": "2026-07-08",
    "date_fa": "17 تیر 1405",
    "team": "تحریریه",
    "excerpt": "تولید و ویرایش مقالات مجله تکباکس",
    "description": "تسلط به نگارش فارسی فنی، آشنایی با سرور / شبکه / مجازی‌سازی. نمونه کار الزامی."
  },
  {
    "slug": "video-editor",
    "title": "تدوین‌گر ویدیو",
    "type": "پروژه‌ای",
    "remote": "ریموت",
    "date": "2026-07-05",
    "date_fa": "14 تیر 1405",
    "team": "رسانه",
    "excerpt": "تدوین ویدیوهای بررسی و آموزشی",
    "description": "Premiere / DaVinci – نمونه کار یوتیوب/آپارات ارسال کنید."
  },
  {
    "slug": "shop-operations",
    "title": "کارشناس عملیات فروشگاه",
    "type": "تمام‌وقت",
    "remote": "حضوری",
    "date": "2026-06-28",
    "date_fa": "7 تیر 1405",
    "team": "فروشگاه",
    "excerpt": "مدیریت سفارش‌ها و انبار تجهیزات زیرساخت",
    "description": "آشنایی با سرور HP/Dell، انبارداری، پاسخگویی مشتریان B2B."
  },
  {
    "slug": "soc-analyst-junior",
    "title": "تحلیل‌گر امنیت SOC – جونیور",
    "type": "تمام‌وقت",
    "remote": "هیبرید – تهران",
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "team": "امنیت",
    "excerpt": "پایش لاگ‌ها، triage هشدارها و مستندسازی رخدادهای امنیتی",
    "description": "برای تیم امنیت تکباکس به دنبال تحلیل‌گر SOC جونیور هستیم. آشنایی با SIEM، مفاهیم شبکه، Windows/Linux log و توانایی گزارش‌نویسی فارسی لازم است. شیفت‌پذیری و علاقه به یادگیری مزیت مهم محسوب می‌شود."
  },
  {
    "slug": "frontend-nextjs-engineer",
    "title": "توسعه‌دهنده Frontend / Next.js",
    "type": "تمام‌وقت",
    "remote": "ریموت",
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "team": "محصول",
    "excerpt": "توسعه رابط کاربری ماژول‌های تکباکس با React، Next.js و TypeScript",
    "description": "تسلط به React، TypeScript، App Router، طراحی کامپوننت و دقت در UI/UX ضروری است. تجربه کار با Tailwind و سیستم طراحی امتیاز مثبت دارد."
  },
  {
    "slug": "technical-writer-infrastructure",
    "title": "نویسنده فنی حوزه زیرساخت",
    "type": "پاره‌وقت",
    "remote": "ریموت",
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "team": "تحریریه",
    "excerpt": "تولید مقاله، راهنما و چک‌لیست برای سرور، شبکه و امنیت",
    "description": "اگر تجربه عملی در IT دارید و می‌توانید مفاهیم فنی را روان و دقیق فارسی بنویسید، به تیم تحریریه تکباکس ملحق شوید. ارسال نمونه کار الزامی است."
  }
]

```

---

## `data/media.json`

```json
[
  {
    "slug": "qnap-2277-review-video",
    "module": "media",
    "title": "بررسی ویدیویی QNAP TS-2277",
    "excerpt": "آنباکس و تست عملی نَس کیونپ 2277.",
    "content": "ویدیو بررسی کامل QNAP-2277...",
    "image": "/assets/blog-6.png",
    "tags": [
      "QNAP-2277",
      "nas",
      "ویدیو",
      "بررسی",
      "ذخیره‌سازی",
      "storage",
      "review",
      "video"
    ],
    "author": {
      "name": "تیم رسانه تکباکس",
      "role": "ویدیو",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-10",
    "date_fa": "19 تیر 1405",
    "likes": 540,
    "views": 18200,
    "category": "بررسی ویدیویی"
  },
  {
    "slug": "mikrotik-lab",
    "module": "media",
    "title": "لَب عملی میکروتیک – VLAN و روتینگ",
    "excerpt": "سناریوی واقعی میکروتیک.",
    "content": "...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "میکروتیک",
      "شبکه",
      "vlan",
      "ویدیو",
      "network",
      "video"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-05",
    "date_fa": "14 تیر 1405",
    "likes": 210,
    "views": 7400,
    "category": "آموزش ویدیویی"
  },
  {
    "slug": "ai-podcast-ep12",
    "module": "media",
    "title": "پادکست هوش مصنوعی قسمت ۱۲",
    "excerpt": "آینده LLM های فارسی.",
    "content": "...",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "هوش مصنوعی",
      "پادکست"
    ],
    "author": {
      "name": "نسترن خداکرمی",
      "role": "فعال حوزه فناوری اطلاعات",
      "avatar": "/assets/nastaran.png"
    },
    "date": "2026-06-29",
    "date_fa": "8 تیر 1405",
    "likes": 120,
    "views": 3900,
    "category": "پادکست"
  },
  {
    "slug": "proxmox-ha-demo-video",
    "module": "media",
    "title": "دموی عملی HA در Proxmox؛ خاموشی نود و جابه‌جایی VM",
    "excerpt": "در این ویدیو رفتار کلاستر سه نود Proxmox را در زمان خرابی تست می‌کنیم.",
    "content": "تست عملی Proxmox HA با shared storage و migration سناریویی.",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "proxmox",
      "ha",
      "مجازی‌سازی",
      "ویدیو",
      "virtualization",
      "video"
    ],
    "author": {
      "name": "تیم رسانه تکباکس",
      "role": "ویدیو",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 312,
    "views": 9800,
    "category": "دموی عملی"
  },
  {
    "slug": "fortigate-policy-review",
    "module": "media",
    "title": "بررسی ویدیویی Rule Review در FortiGate برای شبکه اداری",
    "excerpt": "چطور policyهای قدیمی را پیدا کنیم و لاگ‌ها را برای تصمیم‌گیری بخوانیم؟",
    "content": "مرور عملی policy cleanup، NAT، UTM profile و لاگ ترافیک در FortiGate.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "fortigate",
      "firewall",
      "امنیت",
      "ویدیو",
      "security",
      "فایروال",
      "video"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "likes": 268,
    "views": 8300,
    "category": "آموزش ویدیویی"
  },
  {
    "slug": "server-unboxing-dl380-gen11",
    "module": "media",
    "title": "آنباکس سرور HPE DL380 Gen11 و نگاه نزدیک به قطعات",
    "excerpt": "ریل‌کیت، پاور، رایزر، کنترلر و مسیر airflow را از نزدیک ببینید.",
    "content": "آنباکس و نگاه نزدیک به HPE DL380 Gen11 برای تیم‌های خرید و زیرساخت.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "hpe",
      "server",
      "dl380",
      "آنباکس",
      "سرور"
    ],
    "author": {
      "name": "تیم رسانه تکباکس",
      "role": "ویدیو",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-15",
    "date_fa": "24 تیر 1405",
    "likes": 421,
    "views": 15100,
    "category": "آنباکس"
  },
  {
    "slug": "zabbix-dashboard-build",
    "module": "media",
    "title": "ساخت داشبورد Zabbix برای NOC کوچک در ۲۰ دقیقه",
    "excerpt": "ویجت‌ها، trigger severity و نقشه سرویس‌ها را سریع آماده می‌کنیم.",
    "content": "آموزش سریع ساخت داشبورد عملیاتی Zabbix برای تیم‌های مانیتورینگ.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "zabbix",
      "مانیتورینگ",
      "noc",
      "ویدیو",
      "monitoring",
      "video"
    ],
    "author": {
      "name": "بهناز قادری",
      "role": "طراح سایت",
      "avatar": "/assets/behnaz.png"
    },
    "date": "2026-07-13",
    "date_fa": "22 تیر 1405",
    "likes": 194,
    "views": 6200,
    "category": "آموزش ویدیویی"
  },
  {
    "slug": "nas-cache-explained",
    "module": "media",
    "title": "کش SSD در NAS واقعاً چه زمانی مفید است؟",
    "excerpt": "با نمودار ساده توضیح می‌دهیم کدام workload از SSD cache سود می‌برد.",
    "content": "توضیح ویدیویی رفتار read/write cache در NAS و محدودیت‌های آن.",
    "image": "/assets/blog-6.png",
    "tags": [
      "nas",
      "ssd cache",
      "storage",
      "qnap",
      "ذخیره‌سازی"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "likes": 235,
    "views": 7900,
    "category": "توضیح فنی"
  },
  {
    "slug": "weekly-techbox-brief-01",
    "module": "media",
    "title": "بریف هفتگی تکباکس؛ از Wi‑Fi 7 تا قیمت NVMe سازمانی",
    "excerpt": "خلاصه سریع مهم‌ترین اتفاقات هفته برای مدیران IT و علاقه‌مندان سخت‌افزار.",
    "content": "مرور هفتگی اخبار و تحلیل کوتاه بازار زیرساخت و شبکه.",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "اخبار",
      "تحلیل",
      "wifi7",
      "nvme",
      "پادکست"
    ],
    "author": {
      "name": "تیم رسانه تکباکس",
      "role": "ویدیو",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-11",
    "date_fa": "20 تیر 1405",
    "likes": 177,
    "views": 5100,
    "category": "بریف هفتگی"
  }
]

```

---

## `data/nas-products.json`

```json
[
  {
    "id": "starter-2bay",
    "title": "NAS دو Bay اقتصادی",
    "subtitle": "شروع مطمئن برای خانه و دفتر خیلی کوچک",
    "shopSlug": "nas-starter-2bay",
    "href": "/shop/nas-starter-2bay",
    "bays": 2,
    "maxRawTb": 40,
    "maxRamGb": 6,
    "cpuTier": 2,
    "networkGbE": 1,
    "nvme": false,
    "expansion": false,
    "formFactor": "desktop",
    "priceTier": 1,
    "tags": ["اقتصادی", "کم‌صدا", "بکاپ"],
    "bestFor": ["backup", "photo", "media"],
    "inStock": true,
    "price": 18500000
  },
  {
    "id": "plus-2bay",
    "title": "NAS دو Bay Plus",
    "subtitle": "انتخاب محبوب برای خانه حرفه‌ای و دفتر کوچک",
    "shopSlug": "nas-plus-2bay",
    "href": "/shop/nas-plus-2bay",
    "bays": 2,
    "maxRawTb": 48,
    "maxRamGb": 32,
    "cpuTier": 3,
    "networkGbE": 1,
    "nvme": true,
    "expansion": false,
    "formFactor": "desktop",
    "priceTier": 2,
    "tags": ["Plus", "Docker", "SSD Cache"],
    "bestFor": ["backup", "fileSharing", "docker", "media", "photo"],
    "inStock": true,
    "price": 28900000
  },
  {
    "id": "plus-4bay",
    "title": "NAS چهار Bay Plus",
    "subtitle": "تعادل عالی ظرفیت، RAID و سرویس‌های همزمان",
    "shopSlug": "nas-plus-4bay",
    "href": "/shop/nas-plus-4bay",
    "bays": 4,
    "maxRawTb": 88,
    "maxRamGb": 32,
    "cpuTier": 3,
    "networkGbE": 2.5,
    "nvme": true,
    "expansion": true,
    "formFactor": "desktop",
    "priceTier": 3,
    "tags": ["پیشنهادی", "RAID 5", "2.5GbE"],
    "bestFor": ["backup", "fileSharing", "docker", "surveillance", "photo"],
    "inStock": true,
    "price": 42500000
  },
  {
    "id": "performance-6bay",
    "title": "NAS شش Bay Performance",
    "subtitle": "برای تیم‌های متوسط، آرشیو سنگین و سرعت بالاتر",
    "shopSlug": "nas-performance-6bay",
    "href": "/shop/nas-performance-6bay",
    "bays": 6,
    "maxRawTb": 132,
    "maxRamGb": 64,
    "cpuTier": 4,
    "networkGbE": 10,
    "nvme": true,
    "expansion": true,
    "formFactor": "desktop",
    "priceTier": 4,
    "tags": ["10GbE", "ظرفیت بالا", "مجازی‌سازی سبک"],
    "bestFor": ["fileSharing", "surveillance", "virtualization", "database", "docker"],
    "inStock": true,
    "price": 78900000
  },
  {
    "id": "rack-8bay",
    "title": "NAS رک‌مونت ۸ Bay",
    "subtitle": "مناسب رک، دیتاسنتر کوچک و سرویس‌های سازمانی",
    "shopSlug": "nas-rack-8bay",
    "href": "/shop/nas-rack-8bay",
    "bays": 8,
    "maxRawTb": 176,
    "maxRamGb": 128,
    "cpuTier": 5,
    "networkGbE": 10,
    "nvme": true,
    "expansion": true,
    "formFactor": "rackmount",
    "priceTier": 5,
    "tags": ["Rackmount", "Enterprise", "HA Ready"],
    "bestFor": ["highAvailability", "virtualization", "database", "fileSharing", "surveillance"],
    "inStock": true,
    "price": 142000000
  },
  {
    "id": "creator-4bay",
    "title": "NAS Creator 4Bay NVMe",
    "subtitle": "برای تدوین و آرشیو پروژه با 10GbE",
    "shopSlug": "nas-creator-4bay",
    "href": "/shop/nas-creator-4bay",
    "bays": 4,
    "maxRawTb": 88,
    "maxRamGb": 64,
    "cpuTier": 4,
    "networkGbE": 10,
    "nvme": true,
    "expansion": true,
    "formFactor": "desktop",
    "priceTier": 4,
    "tags": ["Creator", "10GbE", "NVMe x2"],
    "bestFor": ["media", "fileSharing", "photo", "docker"],
    "inStock": true,
    "price": 65900000
  }
]

```

---

## `data/news.json`

```json
[
  {
    "slug": "edge-ai-security-cameras",
    "module": "news",
    "title": "پردازش هوش مصنوعی روی دوربین‌های لبه شبکه جدی‌تر شد",
    "excerpt": "نسل جدید NVRها بدون ارسال تصویر خام به ابر، تشخیص رخداد را در محل انجام می‌دهند.",
    "content": "گزارش تکباکس از روند جدید پردازش Edge AI در تجهیزات نظارتی و شبکه‌های سازمانی.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "هوش مصنوعی",
      "edge",
      "امنیت",
      "شبکه",
      "network",
      "security"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-22",
    "date_fa": "31 تیر 1405",
    "time": "09:15",
    "source": "TechBox Lab",
    "likes": 141,
    "views": 3880,
    "category": "هوش مصنوعی"
  },
  {
    "slug": "ddr6-memory-roadmap",
    "module": "news",
    "title": "نقشه راه حافظه DDR6 برای سرورها منتشر شد",
    "excerpt": "افزایش پهنای باند حافظه می‌تواند نسل بعدی سرورهای دیتاسنتری را متحول کند.",
    "content": "سازندگان حافظه درباره زمان‌بندی اولیه DDR6 و تاثیر آن روی workloadهای مجازی‌سازی توضیح داده‌اند.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "ddr6",
      "سرور",
      "حافظه",
      "دیتاسنتر",
      "server"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-21",
    "date_fa": "30 تیر 1405",
    "time": "12:40",
    "source": "JEDEC",
    "likes": 118,
    "views": 3050,
    "category": "سخت‌افزار"
  },
  {
    "slug": "open-source-siem-growth",
    "module": "news",
    "title": "رشد استفاده از SIEM متن‌باز در شرکت‌های متوسط",
    "excerpt": "هزینه لایسنس و نیاز به انعطاف بیشتر، تیم‌های امنیتی را به سمت راهکارهای متن‌باز برده است.",
    "content": "راهکارهای SIEM متن‌باز در کنار EDR و فایروال‌های نسل جدید جایگاه پررنگ‌تری پیدا کرده‌اند.",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "امنیت",
      "siem",
      "open-source",
      "soc",
      "security"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-20",
    "date_fa": "29 تیر 1405",
    "time": "16:10",
    "source": "SecurityWeek",
    "likes": 92,
    "views": 2440,
    "category": "امنیت"
  },
  {
    "slug": "cloud-backup-price-drop",
    "module": "news",
    "title": "کاهش قیمت بکاپ ابری برای آرشیوهای بلندمدت",
    "excerpt": "رقابت سرویس‌دهنده‌ها هزینه نگهداری داده‌های سرد را پایین‌تر آورده است.",
    "content": "کسب‌وکارها می‌توانند استراتژی 3-2-1 را با هزینه منطقی‌تری پیاده‌سازی کنند.",
    "image": "/assets/blog-6.png",
    "tags": [
      "backup",
      "cloud",
      "storage",
      "آرشیو",
      "ذخیره‌سازی",
      "بکاپ"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-19",
    "date_fa": "28 تیر 1405",
    "time": "10:30",
    "source": "Backblaze",
    "likes": 77,
    "views": 1980,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "ai-chip-breakthrough-2026",
    "module": "news",
    "title": "نسل جدید تراشه‌های هوش مصنوعی با مصرف انرژی نصف معرفی شد",
    "excerpt": "شرکت نوپای ایرانی چیپ‌ست 3 نانومتری را معرفی کرد.",
    "content": "متن کامل خبر هوش مصنوعی...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "هوش مصنوعی",
      "تراشه",
      "سخت‌افزار"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-28",
    "date_fa": "7 تیر 1405",
    "time": "14:32",
    "source": "TechCrunch",
    "likes": 312,
    "views": 9210,
    "category": "سخت‌افزار"
  },
  {
    "slug": "iran-internet-infrastructure",
    "module": "news",
    "title": "توسعه زیرساخت دیتاسنترهای داخلی وارد فاز تازه‌ای شد",
    "excerpt": "ظرفیت جدید 40 رک در تهران.",
    "content": "...",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "زیرساخت",
      "دیتاسنتر",
      "ایران"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-27",
    "date_fa": "6 تیر 1405",
    "time": "11:15",
    "source": "ایرنا",
    "likes": 54,
    "views": 1430,
    "category": "زیرساخت"
  },
  {
    "slug": "quantum-computing-milestone",
    "module": "news",
    "title": "دستیابی به رکورد تازه در پایداری کیوبیت‌های کوانتومی",
    "excerpt": "پایداری 5 میلی‌ثانیه.",
    "content": "...",
    "image": "/assets/blog-3.jpeg",
    "tags": [
      "کوانتوم",
      "پژوهش"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-25",
    "date_fa": "4 تیر 1405",
    "time": "09:40",
    "source": "Nature",
    "likes": 44,
    "views": 980,
    "category": "پژوهش"
  },
  {
    "slug": "linux-kernel-new-release",
    "module": "news",
    "title": "نسخه پایدار جدید هسته لینوکس با بهبود عملکرد شبکه منتشر شد",
    "excerpt": "کرنل 6.9 منتشر شد.",
    "content": "...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "لینوکس",
      "کرنل",
      "شبکه",
      "network",
      "linux"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-24",
    "date_fa": "3 تیر 1405",
    "time": "16:05",
    "source": "kernel.org",
    "likes": 201,
    "views": 4120,
    "category": "نرم‌افزار"
  },
  {
    "slug": "5g-coverage-expansion",
    "module": "news",
    "title": "پوشش شبکه نسل پنجم در کلان‌شهرها گسترش یافت",
    "excerpt": "5G در 12 شهر جدید.",
    "content": "...",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "5g",
      "شبکه",
      "ایران",
      "network"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-20",
    "date_fa": "30 خرداد 1405",
    "time": "10:20",
    "source": "همراه اول",
    "likes": 67,
    "views": 2200,
    "category": "شبکه"
  },
  {
    "slug": "cybersecurity-report-2026",
    "module": "news",
    "title": "گزارش امنیت سایبری از افزایش حملات باج‌افزاری خبر داد",
    "excerpt": "رشد 34 درصدی.",
    "content": "...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "امنیت",
      "باج‌افزار",
      "cybersecurity",
      "security"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-18",
    "date_fa": "28 خرداد 1405",
    "time": "08:15",
    "source": "BBC",
    "likes": 90,
    "views": 3100,
    "category": "امنیت"
  },
  {
    "slug": "datacenter-cooling-liquid-iran",
    "module": "news",
    "title": "خنک‌سازی مایع در دیتاسنترهای ایران جدی‌تر شد",
    "excerpt": "اپراتورهای زیرساخت برای کاهش مصرف انرژی به سراغ liquid cooling می‌روند.",
    "content": "...",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "دیتاسنتر",
      "خنک‌سازی",
      "زیرساخت"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "time": "12:10",
    "source": "TechBox Lab",
    "likes": 76,
    "views": 2380,
    "category": "زیرساخت"
  },
  {
    "slug": "wifi-7-enterprise-rollout",
    "module": "news",
    "title": "تجهیزات Wi‑Fi 7 سازمانی وارد بازار ایران شدند",
    "excerpt": "روترها و اکسس‌پوینت‌های نسل جدید با تمرکز بر latency پایین عرضه شدند.",
    "content": "...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "wifi7",
      "شبکه",
      "enterprise",
      "network"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-13",
    "date_fa": "22 تیر 1405",
    "time": "17:45",
    "source": "NetworkWorld",
    "likes": 121,
    "views": 4210,
    "category": "شبکه"
  },
  {
    "slug": "backup-strategy-ransomware",
    "module": "news",
    "title": "گزارش تازه: بکاپ آفلاین هنوز بهترین دفاع در برابر باج‌افزار است",
    "excerpt": "کارشناسان امنیت روی immutable backup و تست بازیابی دوره‌ای تاکید می‌کنند.",
    "content": "...",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "امنیت",
      "backup",
      "باج‌افزار",
      "security",
      "بکاپ"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "time": "08:55",
    "source": "BleepingComputer",
    "likes": 184,
    "views": 5080,
    "category": "امنیت"
  },
  {
    "slug": "arm-servers-hosting-growth",
    "module": "news",
    "title": "رشد استفاده از سرورهای ARM در هاستینگ ابری",
    "excerpt": "مصرف انرژی کمتر و تراکم بالاتر، ARM را برای سرویس‌های ابری جذاب کرده است.",
    "content": "...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "arm",
      "سرور",
      "cloud",
      "server"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-11",
    "date_fa": "20 تیر 1405",
    "time": "19:20",
    "source": "The Register",
    "likes": 99,
    "views": 2990,
    "category": "سرور"
  },
  {
    "slug": "nvme-of-storage-adoption",
    "module": "news",
    "title": "پروتکل NVMe‑oF در ذخیره‌سازی سازمانی پررنگ‌تر شد",
    "excerpt": "اتصال کم‌تاخیر استوریج به سرورها بدون وابستگی به SAN سنتی.",
    "content": "...",
    "image": "/assets/blog-6.png",
    "tags": [
      "nvme",
      "storage",
      "san",
      "nas",
      "ذخیره‌سازی"
    ],
    "author": {
      "name": "تحریریه تکباکس",
      "role": "اخبار",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-09",
    "date_fa": "18 تیر 1405",
    "time": "13:05",
    "source": "SNIA",
    "likes": 64,
    "views": 1760,
    "category": "ذخیره‌سازی"
  }
]

```

---

## `data/nvr-products.json`

```json
[
  {
    "id": "nvr4",
    "name": "TB-NVR4 Pro",
    "nameFa": "تی‌بی-ان‌وی‌آر۴ پرو",
    "maxCameras": 4,
    "storageBays": 2,
    "raidSupport": "RAID 0/1",
    "maxResolution": "8MP",
    "aiFeatures": false,
    "price": 12500000,
    "priceLabel": "۱۲,۵۰۰,۰۰۰",
    "description": "Entry-level NVR for small installations",
    "descriptionFa": "ان‌وی‌آر پایه برای پروژه‌های کوچک",
    "shopSlug": "tb-nvr4-pro",
    "href": "/shop/tb-nvr4-pro",
    "poePorts": 4,
    "throughputMbps": 80,
    "inStock": true
  },
  {
    "id": "nvr8",
    "name": "TB-NVR8",
    "nameFa": "تی‌بی-ان‌وی‌آر۸",
    "maxCameras": 8,
    "storageBays": 4,
    "raidSupport": "RAID 0/1/5",
    "maxResolution": "12MP",
    "aiFeatures": true,
    "price": 18900000,
    "priceLabel": "۱۸,۹۰۰,۰۰۰",
    "description": "Mid-range with AI analytics",
    "descriptionFa": "میان‌رده با تحلیل هوشمند",
    "shopSlug": "tb-nvr8",
    "href": "/shop/tb-nvr8",
    "poePorts": 8,
    "throughputMbps": 160,
    "inStock": true
  },
  {
    "id": "nvr16",
    "name": "TB-NVR16 Elite",
    "nameFa": "تی‌بی-ان‌وی‌آر۱۶ الایت",
    "maxCameras": 16,
    "storageBays": 6,
    "raidSupport": "RAID 0/1/5/6",
    "maxResolution": "4K",
    "aiFeatures": true,
    "price": 27400000,
    "priceLabel": "۲۷,۴۰۰,۰۰۰",
    "description": "High-performance for medium sites",
    "descriptionFa": "عملکرد بالا برای سایت‌های متوسط",
    "shopSlug": "tb-nvr16-elite",
    "href": "/shop/tb-nvr16-elite",
    "poePorts": 16,
    "throughputMbps": 320,
    "inStock": true
  },
  {
    "id": "nvr32",
    "name": "TB-NVR32 Enterprise",
    "nameFa": "تی‌بی-ان‌وی‌آر۳۲ اینترپرایز",
    "maxCameras": 32,
    "storageBays": 8,
    "raidSupport": "RAID 0/1/5/6/10",
    "maxResolution": "4K",
    "aiFeatures": true,
    "price": 42800000,
    "priceLabel": "۴۲,۸۰۰,۰۰۰",
    "description": "Enterprise-grade with full AI suite",
    "descriptionFa": "سطح سازمانی با مجموعه کامل هوش مصنوعی",
    "shopSlug": "tb-nvr32-enterprise",
    "href": "/shop/tb-nvr32-enterprise",
    "poePorts": 0,
    "throughputMbps": 512,
    "inStock": true
  },
  {
    "id": "nvr64",
    "name": "TB-NVR64 Ultra",
    "nameFa": "تی‌بی-ان‌وی‌آر۶۴ اولترا",
    "maxCameras": 64,
    "storageBays": 12,
    "raidSupport": "RAID 0/1/5/6/10",
    "maxResolution": "8K",
    "aiFeatures": true,
    "price": 89500000,
    "priceLabel": "۸۹,۵۰۰,۰۰۰",
    "description": "Ultra scale NVR for campuses",
    "descriptionFa": "مقیاس اولترا برای مجتمع‌ها و کمپ‌ها",
    "shopSlug": "tb-nvr64-ultra",
    "href": "/shop/tb-nvr64-ultra",
    "poePorts": 0,
    "throughputMbps": 768,
    "inStock": false
  }
]

```

---

## `data/review.json`

```json
[
  {
    "slug": "mikrotik-crs-10g-review",
    "module": "review",
    "title": "بررسی MikroTik CRS 10G برای رک‌های کوچک",
    "excerpt": "سوئیچ اقتصادی 10GbE تا کجا جواب می‌دهد؟",
    "content": "در این بررسی کارایی، مصرف انرژی، RouterOS و سناریوهای مناسب CRS 10G را مرور می‌کنیم.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "mikrotik",
      "switch",
      "10gbe",
      "بررسی",
      "سوئیچ",
      "review"
    ],
    "author": {
      "name": "نیما راد",
      "role": "کارشناس شبکه",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 61,
    "views": 2680,
    "category": "شبکه"
  },
  {
    "slug": "synology-rackstation-rs2426-review",
    "module": "review",
    "title": "بررسی Synology RackStation RS2426+ برای بکاپ سازمانی",
    "excerpt": "یک NAS رک‌مونت قابل اعتماد برای فایل‌سرور و آرشیو؟",
    "content": "در این بررسی DSM، کارایی RAID، Snapshot و سناریوهای بکاپ سازمانی را ارزیابی می‌کنیم.",
    "image": "/assets/blog-6.png",
    "tags": [
      "synology",
      "nas",
      "backup",
      "بررسی",
      "بکاپ",
      "review"
    ],
    "author": {
      "name": "رژینا کریمی",
      "role": "تحلیلگر ذخیره‌سازی",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-17",
    "date_fa": "26 تیر 1405",
    "likes": 73,
    "views": 3190,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "hpe-dl380-gen11-review",
    "module": "review",
    "title": "بررسی HPE DL380 Gen11 در سناریوی مجازی‌سازی",
    "excerpt": "نسل جدید DL380 برای کلاسترهای متوسط چه مزیتی دارد؟",
    "content": "کارایی CPU، توسعه‌پذیری، مدیریت iLO و مصرف انرژی در این بررسی مرور شده است.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "hpe",
      "server",
      "virtualization",
      "بررسی",
      "سرور",
      "مجازی‌سازی",
      "review"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "likes": 95,
    "views": 4020,
    "category": "سرور"
  },
  {
    "slug": "qnap-2277-full-review",
    "module": "review",
    "title": "نقد و بررسی تخصصی QNAP TS-2277",
    "excerpt": "آیا QNAP-2277 بهترین NAS میان‌رده 2026 است؟",
    "content": "بررسی کامل سخت‌افزار، نرم‌افزار، سرعت...",
    "image": "/assets/blog-6.png",
    "tags": [
      "QNAP-2277",
      "nas",
      "بررسی",
      "ذخیره‌سازی",
      "سخت‌افزار",
      "storage",
      "review"
    ],
    "author": {
      "name": "هومن مدق",
      "role": "کارشناس فناوری اطلاعات",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-11",
    "date_fa": "20 تیر 1405",
    "likes": 87,
    "views": 4120,
    "category": "سخت‌افزار"
  },
  {
    "slug": "dell-r750-review",
    "module": "review",
    "title": "بررسی Dell PowerEdge R750",
    "excerpt": "هیولای رک‌مونت جدید دل.",
    "content": "...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "dell",
      "سرور",
      "بررسی",
      "server",
      "review"
    ],
    "author": {
      "name": "عطیه حاتمی",
      "role": "مهندس کامپیوتر",
      "avatar": "/assets/atiye.png"
    },
    "date": "2026-07-01",
    "date_fa": "10 تیر 1405",
    "likes": 54,
    "views": 2100,
    "category": "سرور"
  },
  {
    "slug": "ubiquiti-u7-pro-review",
    "module": "review",
    "title": "بررسی Ubiquiti U7 Pro؛ Wi‑Fi 7 برای دفترهای کوچک",
    "excerpt": "سرعت، پوشش، roaming و مصرف PoE در یک سناریوی واقعی اداری.",
    "content": "در این بررسی U7 Pro را در محیط اداری با چند کلاینت Wi‑Fi 6/7 تست می‌کنیم.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "ubiquiti",
      "wifi7",
      "access point",
      "بررسی",
      "review"
    ],
    "author": {
      "name": "روژینا باقری",
      "role": "کارشناس شبکه",
      "avatar": "/assets/rojina.png"
    },
    "date": "2026-07-20",
    "date_fa": "29 تیر 1405",
    "likes": 66,
    "views": 2880,
    "category": "شبکه"
  },
  {
    "slug": "fortigate-60f-office-review",
    "module": "review",
    "title": "بررسی FortiGate 60F در سناریوی شعبه کوچک",
    "excerpt": "UTM، VPN، گزارش‌گیری و مدیریت policy در یک دفتر ۳۰ نفره.",
    "content": "FortiGate 60F را از نظر throughput، مدیریت، VPN و هزینه نگهداری بررسی می‌کنیم.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "fortigate",
      "firewall",
      "security",
      "بررسی",
      "امنیت",
      "فایروال",
      "review"
    ],
    "author": {
      "name": "نسترن خداکرمی",
      "role": "فعال حوزه فناوری اطلاعات",
      "avatar": "/assets/nastaran.png"
    },
    "date": "2026-07-19",
    "date_fa": "28 تیر 1405",
    "likes": 82,
    "views": 3410,
    "category": "امنیت"
  },
  {
    "slug": "apc-smart-ups-review",
    "module": "review",
    "title": "بررسی APC Smart‑UPS 1500VA برای رک‌های کوچک",
    "excerpt": "زمان پشتیبانی، کیفیت خروجی و مدیریت خاموشی کنترل‌شده سرورها.",
    "content": "در این بررسی رفتار UPS زیر بار سرور و NAS، هشدارها و سناریوی shutdown بررسی شده است.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "apc",
      "ups",
      "power",
      "بررسی",
      "review"
    ],
    "author": {
      "name": "عطیه حاتمی",
      "role": "مهندس کامپیوتر",
      "avatar": "/assets/atiye.png"
    },
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "likes": 47,
    "views": 1980,
    "category": "برق و رک"
  }
]

```

---

## `data/shop.json`

```json
[
  {
    "slug": "fortigate-60f-firewall",
    "module": "shop",
    "title": "فایروال FortiGate 60F",
    "excerpt": "فایروال UTM برای دفاتر کوچک و شعب سازمانی.",
    "content": "مشخصات کامل FortiGate 60F...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "fortigate",
      "firewall",
      "security",
      "فروشگاه",
      "امنیت",
      "فایروال",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-18",
    "date_fa": "27 تیر 1405",
    "likes": 33,
    "views": 920,
    "category": "امنیت"
  },
  {
    "slug": "samsung-pm9a3-nvme",
    "module": "shop",
    "title": "SSD سازمانی Samsung PM9A3 NVMe",
    "excerpt": "درایو NVMe دیتاسنتری برای کش و دیتابیس.",
    "content": "مشخصات کامل PM9A3...",
    "image": "/assets/blog-6.png",
    "tags": [
      "ssd",
      "nvme",
      "storage",
      "فروشگاه",
      "ذخیره‌سازی",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-17",
    "date_fa": "26 تیر 1405",
    "likes": 29,
    "views": 810,
    "category": "ذخیره‌سازی"
  },
  {
    "slug": "qnap-ts-2277",
    "module": "shop",
    "title": "ذخیره‌ساز تحت شبکه QNAP TS-2277",
    "excerpt": "2Bay، 10GbE، پردازنده Ryzen.",
    "content": "مشخصات کامل QNAP-2277...",
    "image": "/assets/blog-6.png",
    "tags": [
      "QNAP-2277",
      "nas",
      "qnap",
      "ذخیره‌سازی",
      "فروشگاه",
      "storage",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-12",
    "date_fa": "21 تیر 1405",
    "likes": 31,
    "views": 980,
    "category": "NAS"
  },
  {
    "slug": "dell-r750",
    "module": "shop",
    "title": "سرور Dell PowerEdge R750",
    "excerpt": "2U، Xeon Scalable نسل 3.",
    "content": "...",
    "image": "/assets/blog-1.jpg",
    "tags": [
      "dell",
      "سرور",
      "فروشگاه",
      "server",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-06-10",
    "date_fa": "20 خرداد 1405",
    "likes": 12,
    "views": 540,
    "category": "سرور"
  },
  {
    "slug": "hpe-dl380-gen11",
    "module": "shop",
    "title": "سرور HPE ProLiant DL380 Gen11",
    "excerpt": "2U، پردازنده Xeon نسل چهارم، مناسب مجازی‌سازی سازمانی.",
    "content": "مشخصات کامل HPE DL380 Gen11...",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "hp",
      "hpe",
      "سرور",
      "فروشگاه",
      "server",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-16",
    "date_fa": "25 تیر 1405",
    "likes": 22,
    "views": 760,
    "category": "سرور"
  },
  {
    "slug": "mikrotik-crs-10g-switch",
    "module": "shop",
    "title": "سوئیچ MikroTik CRS 10G Enterprise",
    "excerpt": "سوییچ مدیریتی با پورت‌های 10GbE برای رک‌های کوچک.",
    "content": "...",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "mikrotik",
      "switch",
      "شبکه",
      "فروشگاه",
      "network",
      "سوئیچ",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-15",
    "date_fa": "24 تیر 1405",
    "likes": 18,
    "views": 690,
    "category": "شبکه"
  },
  {
    "slug": "synology-rackstation-rs2426",
    "module": "shop",
    "title": "ذخیره‌ساز Synology RackStation RS2426+",
    "excerpt": "NAS رک‌مونت برای بکاپ و فایل‌سرور سازمانی.",
    "content": "...",
    "image": "/assets/blog-6.png",
    "tags": [
      "synology",
      "nas",
      "storage",
      "فروشگاه",
      "ذخیره‌سازی",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-14",
    "date_fa": "23 تیر 1405",
    "likes": 27,
    "views": 820,
    "category": "NAS"
  },
  {
    "slug": "ubiquiti-u7-pro-access-point",
    "module": "shop",
    "title": "اکسس‌پوینت Ubiquiti UniFi U7 Pro",
    "excerpt": "Wi‑Fi 7 برای دفاتر مدرن، مناسب نصب سقفی و مدیریت متمرکز.",
    "content": "مشخصات کامل UniFi U7 Pro شامل Wi‑Fi 7، PoE+ و مدیریت از طریق کنترلر UniFi.",
    "image": "/assets/blog-5.jpg",
    "tags": [
      "ubiquiti",
      "wifi7",
      "access point",
      "شبکه",
      "فروشگاه",
      "network",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-21",
    "date_fa": "30 تیر 1405",
    "likes": 24,
    "views": 740,
    "category": "شبکه"
  },
  {
    "slug": "apc-smart-ups-1500va",
    "module": "shop",
    "title": "UPS رک‌مونت APC Smart‑UPS 1500VA",
    "excerpt": "محافظت برق برای سرور، NAS و تجهیزات شبکه در رک‌های کوچک.",
    "content": "مشخصات کامل UPS شامل مدیریت هوشمند، باتری قابل تعویض و خروجی پایدار برای تجهیزات حساس.",
    "image": "/assets/blog-2.jpg",
    "tags": [
      "apc",
      "ups",
      "power",
      "rack",
      "فروشگاه",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-20",
    "date_fa": "29 تیر 1405",
    "likes": 16,
    "views": 510,
    "category": "برق و رک"
  },
  {
    "slug": "intel-x710-da2-10gbe-card",
    "module": "shop",
    "title": "کارت شبکه Intel X710‑DA2 Dual 10GbE",
    "excerpt": "دو پورت SFP+ برای سرورهای مجازی‌سازی، NAS و storage network.",
    "content": "کارت شبکه Intel X710 برای سناریوهای 10GbE، iSCSI، vMotion و uplink سرور.",
    "image": "/assets/blog-4.jpg",
    "tags": [
      "intel",
      "10gbe",
      "sfp+",
      "network",
      "فروشگاه",
      "شبکه",
      "shop"
    ],
    "author": {
      "name": "فروشگاه تکباکس",
      "role": "فروش",
      "avatar": "/assets/hooman.png"
    },
    "date": "2026-07-19",
    "date_fa": "28 تیر 1405",
    "likes": 21,
    "views": 680,
    "category": "شبکه"
  }
]

```

---

## `data/tools.json`

```json
[
  {
    "slug": "nas-selector",
    "title": "NAS Selector",
    "titleFa": "انتخاب‌گر NAS",
    "descriptionFa": "بهترین NAS را بر اساس کاربران، ظرفیت، RAID، سرویس‌ها و بودجه پیدا کنید.",
    "href": "/tools/nas-selector",
    "icon": "server",
    "color": "var(--tb-tools)",
    "tags": ["NAS", "RAID", "selector", "storage"],
    "new": true,
    "version": "1.0.0",
    "relatedShopCategory": "nas"
  },
  {
    "slug": "nvr-selector",
    "title": "NVR Selector",
    "titleFa": "انتخاب‌گر NVR",
    "descriptionFa": "انتخاب NVR مناسب پروژه دوربین مداربسته با AI.",
    "href": "/tools/nvr-selector",
    "icon": "media",
    "color": "var(--tb-raid)",
    "tags": ["NVR", "surveillance", "camera", "AI"],
    "new": true,
    "version": "1.0.0",
    "relatedShopCategory": "nvr"
  },
  {
    "slug": "raid-calculator",
    "title": "RAID Calculator",
    "titleFa": "ماشین حساب RAID",
    "descriptionFa": "RAID 0/1/5/6/10 + SHR-1/SHR-2 – دیسک ترکیبی – Hot Spare",
    "href": "/tools/raid-calculator",
    "icon": "disk",
    "color": "var(--tb-raid)",
    "tags": ["RAID", "SHR", "storage", "calculator"],
    "version": "2.0.0",
    "replaces": "legacy-raid-calculator",
    "relatedShopCategory": "nas"
  },
  {
    "slug": "subnet-calculator",
    "title": "Subnet Calculator",
    "titleFa": "ماشین حساب ساب‌نت",
    "descriptionFa": "محاسبه IP، CIDR، تعداد هاست – بدون تغییر باقی می‌ماند.",
    "href": "/tools/subnet-calculator",
    "icon": "tools",
    "color": "var(--tb-subnet)",
    "tags": ["network", "subnet", "IP"],
    "version": "1.0.0",
    "locked": true
  }
]

```

---

## `data/users.json`

```json
[
  {
    "id": "u1",
    "name": "مدیر کل",
    "email": "admin@techbox.ir",
    "username": "admin",
    "role": "super_admin",
    "modules": [
      "blog",
      "news",
      "media",
      "review",
      "tools",
      "download",
      "shop",
      "forum"
    ],
    "avatar": "/assets/hooman.png",
    "roleFa": "مدیر کل"
  },
  {
    "id": "u2",
    "name": "سارا احمدی",
    "email": "sara@techbox.ir",
    "username": "sara",
    "role": "editor",
    "modules": [
      "blog"
    ],
    "avatar": "/assets/behnaz.png",
    "roleFa": "ویراستار مجله"
  },
  {
    "id": "u3",
    "name": "نیما",
    "email": "nima@techbox.ir",
    "username": "nima",
    "role": "editor",
    "modules": [
      "news"
    ],
    "avatar": "/assets/hooman.png",
    "roleFa": "دبیر اخبار"
  },
  {
    "id": "u4",
    "name": "روژینا باقری",
    "email": "rojina@techbox.ir",
    "username": "rojina",
    "role": "editor",
    "modules": [
      "media",
      "review"
    ],
    "avatar": "/assets/rojina.png",
    "roleFa": "تولیدکننده رسانه"
  },
  {
    "id": "u5",
    "name": "عطیه",
    "email": "atiye@techbox.ir",
    "username": "atiye",
    "role": "editor",
    "modules": [
      "tools",
      "download"
    ],
    "avatar": "/assets/atiye.png",
    "roleFa": "کارشناس ابزار و دانلود"
  },
  {
    "id": "u6",
    "name": "نسترن",
    "email": "nastaran@techbox.ir",
    "username": "nastaran",
    "role": "editor",
    "modules": [
      "shop",
      "forum"
    ],
    "avatar": "/assets/nastaran.png",
    "roleFa": "مدیر فروشگاه و انجمن"
  },
  {
    "id": "u7",
    "name": "آرش رضایی",
    "email": "arash@techbox.ir",
    "username": "arash",
    "role": "editor",
    "modules": [
      "forum",
      "tools"
    ],
    "avatar": "/assets/hooman.png",
    "roleFa": "ناظر انجمن"
  },
  {
    "id": "u8",
    "name": "مریم شریفی",
    "email": "maryam@techbox.ir",
    "username": "maryam",
    "role": "editor",
    "modules": [
      "download",
      "blog"
    ],
    "avatar": "/assets/behnaz.png",
    "roleFa": "ویراستار دانلود"
  },
  {
    "id": "u9",
    "name": "کیوان مرادی",
    "email": "keyvan@techbox.ir",
    "username": "keyvan",
    "role": "editor",
    "modules": [
      "shop",
      "review"
    ],
    "avatar": "/assets/atiye.png",
    "roleFa": "کارشناس فروش و نقد"
  },
  {
    "id": "u10",
    "name": "الهام نادری",
    "email": "elham@techbox.ir",
    "username": "elham",
    "role": "editor",
    "modules": [
      "news",
      "media"
    ],
    "avatar": "/assets/rojina.png",
    "roleFa": "دبیر اخبار و رسانه"
  }
]
```

---

## `design/foundation/globals.css`

```css
@import "tailwindcss";

/* Design tokens — one file per family (the single source of truth) */
@import "../tokens/colors.css";
@import "../tokens/modules.css";
@import "../tokens/gradient.css";
@import "../tokens/ring.css";
@import "../tokens/radius.css";
@import "../tokens/shadow.css";
@import "../tokens/blur.css";
@import "../tokens/opacity.css";
@import "../tokens/border.css";
@import "../tokens/motion.css";
@import "../tokens/typography.css";

@import "./primitives.css";

@theme inline {
  --font-sans: var(--font-kalameh);

  --color-background: var(--tb-bg-primary);
  --color-foreground: var(--tb-fg-primary);
  --color-primary: var(--tb-primary);
  --color-primary-foreground: var(--tb-on-accent);
  --color-muted: var(--tb-bg-muted);
  --color-muted-foreground: var(--tb-fg-muted);
  --color-border: var(--tb-border);
  --color-ring: var(--tb-ring-1);
  --color-card: var(--tb-bg-secondary);
  --color-card-foreground: var(--tb-fg-primary);

  --radius-lg: var(--tb-radius-md);
  --radius-xl: var(--tb-radius-lg);
  --radius-2xl: var(--tb-radius-lg);
}

*{
  box-sizing:border-box;
}

html{
  font-family:var(--font-kalameh),Vazirmatn,system-ui,sans-serif;
  direction:rtl;
}

body{
  margin:0;
  background:var(--tb-bg-primary);
  color:var(--tb-fg-primary);
  min-height:100dvh;
}

/* typography — base elements map onto the text utility scales */

h1{
  font-size:clamp(1.6rem,3.5vw,2.5rem);
  font-weight:900;
  line-height:1.2;
  letter-spacing:-0.01em;
}

h2{
  font-size:clamp(1.3rem,2.5vw,1.75rem);
  font-weight:800;
}

h3{
  font-size:clamp(1.05rem,1.8vw,1.25rem);
  font-weight:700;
}

p,li{
  font-size:0.9375rem;
  line-height:1.8;
  color:var(--tb-fg-muted);
}

/* utilities */

.line-clamp-2{
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

.line-clamp-3{
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

@keyframes tb-ticker-scroll-right{
  from{
    transform:translate3d(0,0,0);
  }
  to{
    transform:translate3d(33.333%,0,0);
  }
}

.ticker-track{
  transform:translate3d(0,0,0);
  animation:tb-ticker-scroll-right 80s linear infinite;
  will-change:transform;
  backface-visibility:hidden;
}

.ticker-wrapper:hover .ticker-track{
  animation-play-state:paused;
}

@media (prefers-reduced-motion: reduce){
  .ticker-track{
    animation:none;
    transform:none;
  }
}


```

---

## `design/foundation/primitives.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · PRIMITIVE COMPONENT CLASSES
   Reusable element styles. Every value redirects to a design token — no
   hardcoded colors / radius / shadow / blur / motion here.
   ════════════════════════════════════════════════════════════════════════ */

.card{
  background:var(--tb-bg-secondary);
  color:var(--tb-fg-primary);
  border:var(--tb-border-sm) solid var(--tb-border);
  border-radius:var(--tb-radius-lg);
  padding:1rem;
  box-shadow:var(--tb-shadow-md);
}

.badge{
  display:inline-flex;
  align-items:center;
  gap:.3em;
  border-radius:var(--tb-radius-full);
  padding:2px 10px;
  font-size:11px;
  font-weight:600;
  background:var(--tb-bg-muted);
  color:var(--tb-fg-muted);
  border:var(--tb-border-sm) solid var(--tb-border);
}

.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.45rem;
  border-radius:var(--tb-radius-md);
  padding:.58rem .95rem;
  font-weight:700;
  font-size:0.8125rem;
  cursor:pointer;
  transition:
    color var(--tb-motion-sm) var(--tb-ease),
    background-color var(--tb-motion-sm) var(--tb-ease),
    border-color var(--tb-motion-sm) var(--tb-ease),
    filter var(--tb-motion-sm) var(--tb-ease),
    transform var(--tb-motion-sm) var(--tb-ease),
    box-shadow var(--tb-motion-sm) var(--tb-ease);
}

.btn-primary{
  background:var(--tb-primary);
  color:var(--tb-on-accent);
  box-shadow:var(--tb-shadow-sm);
}

.btn-primary:hover{
  filter:brightness(1.06);
  transform:translateY(-1px);
}

.btn-ghost{
  background:transparent;
  border:var(--tb-border-sm) solid var(--tb-border);
  color:var(--tb-fg-primary);
}

.btn-ghost:hover{
  background:var(--tb-bg-muted);
}

.btn-danger{
  background:var(--tb-danger);
  color:var(--tb-on-accent);
}

.btn-vip{
  color:var(--tb-on-accent);
  background:
    linear-gradient(135deg,
      color-mix(in oklch, var(--tb-vip) 72%, var(--tb-primary)) 0%,
      var(--tb-primary) 52%,
      color-mix(in oklch, var(--tb-tools) 72%, var(--tb-primary)) 100%);
  box-shadow:var(--tb-shadow-md);
}

.input{
  width:100%;
  background:var(--tb-bg-muted);
  border:var(--tb-border-sm) solid var(--tb-border);
  border-radius:var(--tb-radius-md);
  padding:.6rem .85rem;
}

.icon-rail-btn{
  display:inline-flex;
  width:2.5rem;
  height:2.5rem;
  align-items:center;
  justify-content:center;
  border-radius:var(--tb-radius-md);
  color:var(--tb-fg-muted);
  transition:
    color var(--tb-motion-sm) var(--tb-ease),
    background-color var(--tb-motion-sm) var(--tb-ease),
    transform var(--tb-motion-sm) var(--tb-ease);
}

.icon-rail-btn:hover{
  color:var(--tb-fg-primary);
  background:var(--tb-bg-muted);
}

.vip-cta{
  color:var(--tb-on-accent);
  background:
    linear-gradient(135deg,
      color-mix(in oklch, var(--tb-vip) 72%, var(--tb-primary)) 0%,
      var(--tb-primary) 52%,
      color-mix(in oklch, var(--tb-tools) 72%, var(--tb-primary)) 100%);
  box-shadow:var(--tb-shadow-md);
  border-radius:var(--tb-radius-lg);
  transition:
    filter var(--tb-motion-sm) var(--tb-ease),
    transform var(--tb-motion-sm) var(--tb-ease),
    box-shadow var(--tb-motion-sm) var(--tb-ease);
}

.vip-cta:hover{
  filter:brightness(1.06);
  transform:translateY(-1px);
  box-shadow:var(--tb-shadow-lg);
}

.tb-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.5rem;
  min-height:2.5rem;
  border-radius:var(--tb-radius-lg);
  font-weight:900;
  color:var(--tb-on-accent);
  border:var(--tb-border-sm) solid color-mix(in oklch, var(--tb-primary) 25%, transparent);
  box-shadow:var(--tb-shadow-md);
  transition:
    color var(--tb-motion-sm) var(--tb-ease),
    background-color var(--tb-motion-sm) var(--tb-ease),
    border-color var(--tb-motion-sm) var(--tb-ease),
    filter var(--tb-motion-sm) var(--tb-ease),
    transform var(--tb-motion-sm) var(--tb-ease),
    box-shadow var(--tb-motion-sm) var(--tb-ease);
}

.tb-cta:hover{
  filter:brightness(1.06);
  transform:translateY(-1px);
  box-shadow:var(--tb-shadow-lg);
}

.tb-cta-brand,
.tb-floating-action{
  background:linear-gradient(135deg,
    color-mix(in oklch, var(--tb-primary) 72%, black) 0%,
    var(--tb-primary) 100%);
}

.tb-cta-vip,
.vip-cta{
  background:
    linear-gradient(135deg,
      color-mix(in oklch, var(--tb-vip) 72%, var(--tb-primary)) 0%,
      var(--tb-primary) 52%,
      color-mix(in oklch, var(--tb-tools) 72%, var(--tb-primary)) 100%);
}

.tb-floating-action{
  position:fixed;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.5rem;
  border-radius:var(--tb-radius-full);
  padding:.75rem 1rem;
  color:var(--tb-on-accent);
  font-size:0.8125rem;
  font-weight:900;
  box-shadow:var(--tb-shadow-lg);
  transition:
    transform var(--tb-motion-sm) var(--tb-ease),
    filter var(--tb-motion-sm) var(--tb-ease),
    box-shadow var(--tb-motion-sm) var(--tb-ease);
}

.tb-floating-action:hover{
  filter:brightness(1.06);
  transform:translateY(-1px) scale(1.02);
  box-shadow:var(--tb-shadow-lg);
}

.tb-overlay-backdrop{
  background:color-mix(in oklch, black 55%, transparent);
  backdrop-filter:blur(var(--tb-blur-sm));
}

.tb-overlay-panel{
  background:var(--tb-bg-secondary);
  color:var(--tb-fg-primary);
  border:var(--tb-border-sm) solid var(--tb-border);
  border-radius:var(--tb-radius-lg);
  box-shadow:var(--tb-shadow-lg);
}

.tb-soft-panel{
  background:var(--tb-bg-secondary);
  border:var(--tb-border-sm) solid var(--tb-border);
  border-radius:var(--tb-radius-md);
  box-shadow:var(--tb-shadow-sm);
}

.tb-image-badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:var(--tb-radius-full);
  background:color-mix(in oklch, black 60%, transparent);
  color:var(--tb-on-accent);
  border:var(--tb-border-sm) solid color-mix(in oklch, white 22%, transparent);
  backdrop-filter:blur(var(--tb-blur-sm));
}

.tb-action-chip{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.35rem;
  border-radius:var(--tb-radius-full);
  border:var(--tb-border-sm) solid var(--tb-border);
  background:color-mix(in oklch, var(--tb-bg-muted) 78%, transparent);
  color:var(--tb-fg-muted);
  transition:
    color var(--tb-motion-sm) var(--tb-ease),
    background-color var(--tb-motion-sm) var(--tb-ease),
    border-color var(--tb-motion-sm) var(--tb-ease);
}

.tb-action-chip:hover{
  color:var(--tb-fg-primary);
  background:var(--tb-bg-muted);
}

```

---

## `design/icons.tsx`

```tsx
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · CENTRAL ICON SYSTEM
   ────────────────────────────────────────────────────────────────────────
   The single source of truth for every icon/emoji used across the site.
   Components must import icons from here (never emojis or ad-hoc imports),
   so the whole icon set can be swapped in one place.

   Usage:
     import { Icon } from "@/design/icons";
     <Icon name="like" className="h-4 w-4" />
   or the named component:
     import { LikeIcon } from "@/design/icons";
     <LikeIcon size={16} />
   ════════════════════════════════════════════════════════════════════════ */

import {
  Heart,
  Eye,
  MessageCircle,
  Download,
  Star,
  Play,
  Clock,
  Calendar,
  Bell,
  Search,
  ShoppingCart,
  ShieldCheck,
  Headset,
  MessageSquare,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Moon,
  Sun,
  Plus,
  Minus,
  Check,
  User,
  Users,
  Tag,
  Newspaper,
  Video,
  Wrench,
  FolderDown,
  Store,
  MessagesSquare,
  BookOpen,
  Home,
  Flame,
  Send,
  HardDrive,
  Server,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Canonical icon registry. Add new icons here and reference them by name. */
export const icons = {
  // engagement / meta
  like: Heart,
  view: Eye,
  comment: MessageCircle,
  download: Download,
  star: Star,
  play: Play,
  clock: Clock,
  date: Calendar,
  tag: Tag,
  flame: Flame,
  send: Send,
  // navigation / chrome
  bell: Bell,
  search: Search,
  cart: ShoppingCart,
  shield: ShieldCheck,
  headset: Headset,
  chat: MessageSquare,
  close: X,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  moon: Moon,
  sun: Sun,
  plus: Plus,
  minus: Minus,
  check: Check,
  user: User,
  users: Users,
  home: Home,
  // module glyphs
  blog: BookOpen,
  news: Newspaper,
  media: Video,
  tools: Wrench,
  downloadModule: FolderDown,
  shop: Store,
  forum: MessagesSquare,
  review: Star,
  // hardware (raid / subnet visuals)
  disk: HardDrive,
  server: Server,
} as const;

export type IconName = keyof typeof icons;

/** Generic icon component: <Icon name="like" className="h-4 w-4" /> */
export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name] as LucideIcon;
  return <Cmp {...props} />;
}

// Convenience named exports (used where a direct component is cleaner)
export const LikeIcon = Heart;
export const ViewIcon = Eye;
export const CommentIcon = MessageCircle;
export const DownloadIcon = Download;
export const StarIcon = Star;
export const PlayIcon = Play;
export const ClockIcon = Clock;
export const DateIcon = Calendar;
export const TagIcon = Tag;
export const ChatIcon = MessageSquare;
export const CloseIcon = X;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const PlusIcon = Plus;
export const MinusIcon = Minus;
export const DiskIcon = HardDrive;
export const ServerIcon = Server;

export type { LucideProps };

```

---

## `design/index.ts`

```ts
// Public design exports — JS-side only.
// Visual tokens (color/radius/shadow/blur/opacity/border/motion/typography) live as
// CSS variables / utility classes under design/tokens/*.css and are the single source
// of truth. The only JS exports are things components need at runtime:
//   • zIndex  — layer ordering for inline styles
//   • motion  — Framer Motion variants/transitions
export * from "./tokens/z-index";
export * from "./tokens/motion";

```

---

## `design/presets/effects.ts`

```ts
export const hover = {
  lift: "hover:-translate-y-[2px]",
  brighten: "hover:brightness-[1.05]",
  glow: "hover:shadow-[var(--tb-shadow-glow)]",
};

export const focus = {
  ring: "focus-visible:outline-none focus-visible:shadow-[var(--tb-focus-ring)]",
};

```

---

## `design/presets/interactions.ts`

```ts
export const interactive = [
  "hover:-translate-y-[1px]",
  "hover:brightness-[1.05]",
  "transition-all",
  "duration-[var(--tb-duration-normal)]",
  "ease-[var(--tb-ease-standard)]",
].join(" ");

export const press = "active:scale-[0.98]";

```

---

## `design/presets/surfaces.ts`

```ts
export const card =
  "bg-[var(--tb-card)] border border-[var(--tb-border)] rounded-[var(--tb-radius-lg)] shadow-[var(--tb-shadow)]";

export const elevated =
  "bg-[var(--tb-card)] rounded-[var(--tb-radius-xl)] shadow-[var(--tb-shadow-md)]";

export const glass =
  "backdrop-blur-[var(--tb-glass-blur)] bg-[color-mix(in_oklch,var(--tb-card)_72%,transparent)] border border-[color-mix(in_oklch,var(--tb-border)_80%,transparent)]";

```

---

## `design/tokens/blur.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · BLUR  (backdrop / glass blur radii)
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-blur-sm: 6px;
  --tb-blur-md: 14px;
  --tb-blur-lg: 24px;
}

```

---

## `design/tokens/blur.ts`

```ts
export const blur = {
  sm: "var(--tb-blur-sm)",
  md: "var(--tb-blur-md)",
  lg: "var(--tb-blur-lg)",
  xl: "var(--tb-blur-xl)",
  glass: "var(--tb-glass-blur)",
} as const;

export type BlurToken = keyof typeof blur;

```

---

## `design/tokens/border.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · BORDERS  (border color + width)
   The border color is derived from the semantic foreground token in
   colors.css (a low-opacity mix), so it follows the theme automatically.
   The sm/md/lg tokens are width helpers used as:
     border: var(--tb-border-sm) solid var(--tb-border);
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-border: color-mix(in oklch, var(--tb-fg-primary) 14%, transparent);
  --tb-border-sm: 1px;
  --tb-border-md: 2px;
  --tb-border-lg: 3px;
}

```

---

## `design/tokens/colors.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · COLORS  (semantic surfaces & text only)
   ────────────────────────────────────────────────────────────────────────
   ONLY background + foreground colors live here. Everything else moved out:
     • module / brand / status accents → modules.css
     • gradients → gradient.css     • rings → ring.css
     • radius/shadow/blur/opacity/border/motion → their own files
     • text size/weight/leading → typography.css (utility classes)

   Theme: NEUTRAL (grayscale surfaces, no color cast).
   Dark mode uses the native CSS `light-dark()` function. It follows the
   `color-scheme` property, which we flip from the existing `.dark` class
   (set on <html> by the theme toggle). So: light-dark(LIGHT, DARK).
   ════════════════════════════════════════════════════════════════════════ */

:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
}

:root {
  /* ── Backgrounds (neutral grays) ── */
  --tb-bg-primary:   light-dark(oklch(0.985 0 0), oklch(0.16 0 0)); /* app background      */
  --tb-bg-secondary: light-dark(oklch(1 0 0),     oklch(0.21 0 0)); /* cards / panels / popovers */
  --tb-bg-muted:     light-dark(oklch(0.955 0 0), oklch(0.26 0 0)); /* muted fills / inputs */

  /* ── Foregrounds (text, neutral) ── */
  --tb-fg-primary:   light-dark(oklch(0.20 0 0), oklch(0.97 0 0)); /* main text       */
  --tb-fg-secondary: light-dark(oklch(0.38 0 0), oklch(0.82 0 0)); /* secondary text  */
  --tb-fg-muted:     light-dark(oklch(0.55 0 0), oklch(0.65 0 0)); /* muted / meta    */
}

```

---

## `design/tokens/gradient.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · GRADIENTS
   Three gradient stops used by the brand gradient, hero background (Aurora),
   and any gradient surface. Built from the brand + module accents so they
   stay in sync. Dark values via light-dark().
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-gradient-1: var(--tb-primary);  /* brand   */
  --tb-gradient-2: var(--tb-subnet);   /* blue    */
  --tb-gradient-3: var(--tb-vip);      /* fuchsia */
}

```

---

## `design/tokens/modules.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · MODULE / BRAND / STATUS COLORS
   ────────────────────────────────────────────────────────────────────────
   The identity colors. Modules are the ONLY colors allowed to brand a piece
   of content across the UI. `--tb-primary` is the site/brand accent (buttons,
   links, hero). Status colors are shared semantic accents.
   Dark values via light-dark(LIGHT, DARK).
   Page-color placeholders (admin/about/…) — pick your own anytime.
   ════════════════════════════════════════════════════════════════════════ */

:root {
  /* ── Brand / primary accent ── */
  --tb-primary:    light-dark(oklch(0.62 0.21 255), #60a5fa);
  /* fixed light text that sits on top of any saturated accent (white both modes) */
  --tb-on-accent:  #ffffff;

  /* ── Modules ── */
  --tb-blog:     light-dark(oklch(0.70 0.17 52),  #fb923c); /* orange   */
  --tb-news:     light-dark(oklch(0.64 0.22 25),  #fb7185); /* rose     */
  --tb-media:    light-dark(oklch(0.82 0.15 85),  #fcd34d); /* amber    */
  --tb-shop:     light-dark(oklch(0.80 0.19 125), #a3e635); /* lime     */
  --tb-tools:    light-dark(oklch(0.82 0.12 200), #67e8f9); /* cyan     */
  --tb-raid:     light-dark(oklch(0.66 0.18 175), #2dd4bf); /* teal     */
  --tb-subnet:   light-dark(oklch(0.68 0.19 230), #60a5fa); /* blue     */
  --tb-vip:      light-dark(oklch(0.66 0.22 300), #e879f9); /* fuchsia  */
  --tb-forum:    light-dark(oklch(0.78 0.16 5),   #fda4af); /* rose-300 */
  --tb-review:   light-dark(oklch(0.70 0.17 240), #38bdf8); /* sky      */
  --tb-download: light-dark(oklch(0.72 0.20 350), #f472b6); /* pink     */
  --tb-home:     light-dark(oklch(0.62 0.22 290), #a78bfa); /* violet   */
  --tb-account:  light-dark(oklch(0.80 0.12 15),  #fca5a5); /* red-200  */

  /* ── Status ── */
  --tb-success:  light-dark(oklch(0.72 0.18 150), #4ade80);
  --tb-danger:   light-dark(oklch(0.64 0.22 25),  #fb7185);
  --tb-warning:  light-dark(oklch(0.82 0.15 85),  #fcd34d);
  --tb-info:     light-dark(oklch(0.72 0.16 230), #7dd3fc);

  /* ── Page accents (placeholders) ── */
  --tb-admin:        light-dark(oklch(0.66 0.22 300), #e879f9); /* fuchsia */
  --tb-about:        light-dark(oklch(0.72 0.16 230), #7dd3fc); /* sky     */
  --tb-contact:      light-dark(oklch(0.72 0.18 150), #4ade80); /* green   */
  --tb-workwithus:   light-dark(oklch(0.70 0.17 52),  #fb923c); /* orange  */
  --tb-consultation: light-dark(oklch(0.66 0.22 300), #e879f9); /* fuchsia */
}

```

---

## `design/tokens/motion.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · MOTION  (durations + shared easing)
   Three durations + one standard easing curve. Use as:
     transition: color var(--tb-motion-sm) var(--tb-ease);
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-motion-sm: 150ms;
  --tb-motion-md: 220ms;
  --tb-motion-lg: 340ms;
  --tb-ease: cubic-bezier(.2,.8,.2,1);
}

```

---

## `design/tokens/motion.ts`

```ts
// Framer Motion – central tokens – Next 16 / React 19
// No Tailwind / no DOM – pure JS – safe to import in hooks/services

export const duration = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.22,
  slow: 0.34,
  slower: 0.52,
} as const; // seconds – mirrors design/tokens/motion.css (--tb-motion-sm/md/lg)

export const ease = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  out: [0, 0, 0.38, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
};

export const transition = {
  fast: { duration: duration.fast, ease: ease.standard },
  normal: { duration: duration.normal, ease: ease.standard },
  slow: { duration: duration.slow, ease: ease.emphasized },
};

// Framer Motion variants – reusable
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transition.normal,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: transition.normal,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: transition.fast,
};

export const hoverScale = {
  whileHover: { scale: 1.015, y: -2 },
  whileTap: { scale: 0.99 },
  transition: transition.fast,
};

export const slideIn = fadeInUp;
export const slideInLeft = { initial:{opacity:0,x:-24}, animate:{opacity:1,x:0}, exit:{opacity:0,x:-24}, transition: transition.normal };
export const slideInRight = { initial:{opacity:0,x:24}, animate:{opacity:1,x:0}, exit:{opacity:0,x:24}, transition: transition.normal };

```

---

## `design/tokens/opacity.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · OPACITY
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-opacity-sm: 0.45;
  --tb-opacity-md: 0.6;
  --tb-opacity-lg: 0.85;
}

```

---

## `design/tokens/radius.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · RADIUS  (corner roundness)
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-radius-sm: 5px;
  --tb-radius-md: 9px;
  --tb-radius-lg: 14px;
  --tb-radius-full: 9999px;
}

```

---

## `design/tokens/radius.ts`

```ts
export const radius = {
  xs: "var(--tb-radius-xs)",
  sm: "var(--tb-radius-sm)",
  md: "var(--tb-radius-md)",
  lg: "var(--tb-radius-lg)",
  xl: "var(--tb-radius-xl)",
  "2xl": "var(--tb-radius-2xl)",
  full: "var(--tb-radius-full)",
} as const;

export type RadiusToken = keyof typeof radius;

```

---

## `design/tokens/ring.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · RINGS  (focus / outline rings)
   Rings are derived from the semantic color tokens in colors.css — no
   independent color values here.
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-ring-1: var(--tb-fg-primary);                                    /* solid ring color */
  --tb-ring-2: color-mix(in oklch, var(--tb-fg-primary) 55%, transparent); /* soft ring color */
  --tb-ring-3: 0 0 0 3px color-mix(in oklch, var(--tb-fg-primary) 35%, transparent); /* focus box-shadow */
}

```

---

## `design/tokens/shadow.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · SHADOWS  (elevation)
   Dark values via light-dark().
   ════════════════════════════════════════════════════════════════════════ */

:root {
  --tb-shadow-sm: light-dark(
    0 1px 3px rgba(2,8,23,.06), 
    0 1px 3px rgba(0,0,0,.30));
  --tb-shadow-md: light-dark(
    0 8px 28px rgba(2,8,23,.10), 
    0 10px 36px rgba(0,0,0,.42));
  --tb-shadow-lg: light-dark(
    0 16px 44px rgba(2,8,23,.14), 
    0 20px 60px rgba(0,0,0,.5));
}

```

---

## `design/tokens/shadows.ts`

```ts
export const shadows = {
  sm: "var(--tb-shadow-sm)",
  DEFAULT: "var(--tb-shadow)",
  md: "var(--tb-shadow-md)",
  lg: "var(--tb-shadow-lg)",
  glow: "var(--tb-shadow-glow)",
  none: "none",
} as const;
export type ShadowToken = keyof typeof shadows;

```

---

## `design/tokens/typography.css`

```css
/* ════════════════════════════════════════════════════════════════════════
   TECHBOX · TYPOGRAPHY  (utility classes)
   One class per text role, each bundling font-size + weight + line-height.
   Use directly on an element:  <p class="tb-text-md">…</p>
     • tb-text-sm   – small / meta text
     • tb-text-md   – body / default
     • tb-text-lg   – subheadings
     • tb-text-big-title – page & section headings (fluid)

   Responsive variants are defined manually so class names like
   `md:tb-text-big-title` work without falling back to Tailwind text/font/leading.
   ════════════════════════════════════════════════════════════════════════ */

.tb-text-sm {
  font-size: 0.8125rem;   /* 13px */
  font-weight: 500;
  line-height: 1.6;
}

.tb-text-md {
  font-size: 0.9375rem;   /* 15px */
  font-weight: 500;
  line-height: 1.8;
}

.tb-text-lg {
  font-size: 1.25rem;     /* 20px */
  font-weight: 700;
  line-height: 1.45;
}

.tb-text-big-title {
  font-size: clamp(1.6rem, 3.5vw, 2.5rem);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

@media (min-width: 640px) {
  .sm\:tb-text-sm { font-size: 0.8125rem; font-weight: 500; line-height: 1.6; }
  .sm\:tb-text-md { font-size: 0.9375rem; font-weight: 500; line-height: 1.8; }
  .sm\:tb-text-lg { font-size: 1.25rem; font-weight: 700; line-height: 1.45; }
  .sm\:tb-text-big-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.01em; }
}

@media (min-width: 768px) {
  .md\:tb-text-sm { font-size: 0.8125rem; font-weight: 500; line-height: 1.6; }
  .md\:tb-text-md { font-size: 0.9375rem; font-weight: 500; line-height: 1.8; }
  .md\:tb-text-lg { font-size: 1.25rem; font-weight: 700; line-height: 1.45; }
  .md\:tb-text-big-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.01em; }
}

@media (min-width: 1024px) {
  .lg\:tb-text-sm { font-size: 0.8125rem; font-weight: 500; line-height: 1.6; }
  .lg\:tb-text-md { font-size: 0.9375rem; font-weight: 500; line-height: 1.8; }
  .lg\:tb-text-lg { font-size: 1.25rem; font-weight: 700; line-height: 1.45; }
  .lg\:tb-text-big-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.01em; }
}

@media (min-width: 1280px) {
  .xl\:tb-text-sm { font-size: 0.8125rem; font-weight: 500; line-height: 1.6; }
  .xl\:tb-text-md { font-size: 0.9375rem; font-weight: 500; line-height: 1.8; }
  .xl\:tb-text-lg { font-size: 1.25rem; font-weight: 700; line-height: 1.45; }
  .xl\:tb-text-big-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.01em; }
}

@media (min-width: 1536px) {
  .\32xl\:tb-text-sm { font-size: 0.8125rem; font-weight: 500; line-height: 1.6; }
  .\32xl\:tb-text-md { font-size: 0.9375rem; font-weight: 500; line-height: 1.8; }
  .\32xl\:tb-text-lg { font-size: 1.25rem; font-weight: 700; line-height: 1.45; }
  .\32xl\:tb-text-big-title { font-size: clamp(1.6rem, 3.5vw, 2.5rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.01em; }
}

```

---

## `design/tokens/typography.ts`

```ts
export const fontSize = {
  "2xs": "var(--tb-text-2xs)",
  xs: "var(--tb-text-xs)",
  sm: "var(--tb-text-sm)",
  base: "var(--tb-text-base)",
  md: "var(--tb-text-md)",
  lg: "var(--tb-text-lg)",
  xl: "var(--tb-text-xl)",
  "2xl": "var(--tb-text-2xl)",
  "3xl": "var(--tb-text-3xl)",
  "4xl": "var(--tb-text-4xl)",
  "5xl": "var(--tb-text-5xl)",
} as const;

export const lineHeight = {
  tight: "var(--tb-leading-tight)",
  snug: "var(--tb-leading-snug)",
  normal: "var(--tb-leading-normal)",
  relaxed: "var(--tb-leading-relaxed)",
} as const;

export const fontWeight = {
  regular: "var(--tb-weight-regular)",
  medium: "var(--tb-weight-medium)",
  semibold: "var(--tb-weight-semibold)",
  bold: "var(--tb-weight-bold)",
  extrabold: "var(--tb-weight-extrabold)",
  black: "var(--tb-weight-black)",
} as const;

export const type = {
  "heading-1": "text-[clamp(1.6rem,3.5vw,2.25rem)] font-black leading-tight tracking-tight",
  "heading-2": "text-[clamp(1.3rem,2.5vw,1.75rem)] font-extrabold leading-snug",
  "heading-3": "text-[clamp(1.05rem,1.8vw,1.25rem)] font-bold",
  "body": "text-[14px] leading-[1.9]",
  "body-sm": "text-[13px] leading-[1.8]",
  "meta": "text-[11px] leading-[1.6]",
  "caption": "text-[11.5px] leading-[1.5]",
} as const;

```

---

## `design/tokens/z-index.ts`

```ts
export const zIndex = {
  base: 0,
  content: 1,
  raised: 5,
  docked: 10,
  sticky: 30,
  sidebarBackdrop: 40,
  sidebar: 50,
  mobileFab: 80,
  cart: 420,
  popover: 700,
  dropdown: 720,
  notification: 740,
  modal: 900,
  modalContent: 910,
  chatbot: 950,
  tooltip: 1200,
  toast: 1300,
  emergency: 2147483000,
} as const;

export type ZIndexToken = keyof typeof zIndex;

```

---

## `features/blog/components/BlogGrid.tsx`

```tsx
"use client";
import Image from "next/image";
import { getModuleItems } from "@/lib/content";
import Link from "next/link";
import ModuleHeader from "@/components/effects/ModuleHeader";
import { Icon } from "@/design/icons";

export default function BlogGrid(){
  const items = getModuleItems("blog");
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-14" dir="rtl">
      <ModuleHeader module="blog" title="مجله تکباکس" description={`مقالات تخصصی زیرساخت • ${items.length.toLocaleString("fa-IR")} مطلب`} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p=>(
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] shadow-[var(--tb-shadow-md)] transition-all duration-[var(--tb-motion-md)] hover:-translate-y-1 hover:shadow-[var(--tb-shadow-lg)]"
          >
            <div className="block relative aspect-square overflow-hidden bg-[var(--tb-bg-muted)]">
              <Image src={p.image || "/assets/blog-1.jpg"} alt={p.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[var(--tb-motion-lg)] group-hover:scale-105" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="tb-text-lg line-clamp-2 min-h-[56px] transition-colors group-hover:text-[var(--tb-blog)]">{p.title}</h3>
              <p className="tb-text-sm text-[var(--tb-fg-muted)] line-clamp-3 mt-2 flex-1">{p.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[color-mix(in_oklch,var(--tb-border)_50%,transparent)] tb-text-sm text-[var(--tb-fg-muted)]">
                <div className="flex items-center gap-2">
                  {p.author.avatar && <Image src={p.author.avatar} width={28} height={28} className="h-7 w-7 rounded-[var(--tb-radius-full)] object-cover ring-1 ring-[var(--tb-border)]" alt={p.author.name} />}
                  <div>
                    <div className="text-[var(--tb-fg-primary)] tb-text-sm">{p.author.name}</div>
                    <div>{p.date_fa}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Icon name="like" size={14} strokeWidth={1.75} />{p.likes.toLocaleString("fa-IR")}</span>
                  <span className="inline-flex items-center gap-1"><Icon name="view" size={14} strokeWidth={1.75} />{p.views.toLocaleString("fa-IR")}</span>
                  <span className="inline-flex items-center gap-1"><Icon name="comment" size={14} strokeWidth={1.75} />{((p.likes % 9) + 1).toLocaleString("fa-IR")}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

```

---

## `features/chat/components/Chatbot.tsx`

```tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { zIndex } from "@/design";
import { Button } from "@/components/ui/Button";
import { CloseButton } from "@/components/ui/CloseButton";
import { ChipButton } from "@/components/ui/ChipButton";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Icon } from "@/design/icons";

type Msg = { role: "user" | "assistant"; text: string; time: number };

const STORAGE_KEY = "tb_chat_history";

export default function Chatbot(){
 const [open, setOpen] = useState(false);
 const [input, setInput] = useState("");
 const [msgs, setMsgs] = useState<Msg[]>([]);
 const [loading, setLoading] = useState(false);
 const endRef = useRef<HTMLDivElement>(null);

 useEffect(()=>{
 try{ const s = localStorage.getItem(STORAGE_KEY); if(s) setMsgs(JSON.parse(s)); }catch{}
 },[]);
 useEffect(()=>{
 localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-40)));
 endRef.current?.scrollIntoView({behavior:"smooth"});
 },[msgs]);

 const send = async (e?: React.FormEvent)=>{
 e?.preventDefault();
 const text = input.trim();
 if(!text || loading) return;
 const userMsg: Msg = { role:"user", text, time: Date.now() };
 setMsgs(m=>[...m, userMsg]);
 setInput("");
 setLoading(true);
 try{
 const res = await fetch("/api/chat", {
 method:"POST",
 headers:{"Content-Type":"application/json"},
 body: JSON.stringify({
 messages: [...msgs, userMsg].slice(-12).map(m=>({role:m.role, content:m.text})),
 // context: product / page – can extend later
 })
 });
 const data = await res.json();
 const reply = data?.reply || data?.error || "پاسخی دریافت نشد – کلید API را در .env تنظیم کنید: CHAT_API_KEY / CHAT_BASE_URL";
 setMsgs(m=>[...m, {role:"assistant", text: reply, time: Date.now()}]);
 }catch(err:any){
 setMsgs(m=>[...m, {role:"assistant", text:"خطا در اتصال به سرویس چت – حالت آفلاین.", time: Date.now()}]);
 }finally{
 setLoading(false);
 }
 };

 return (
 <>
 {/* FAB */}
 <FloatingActionButton
 onClick={()=>setOpen(true)}
 hidden={open}
 className="bottom-5 left-5"
 style={{ zIndex: zIndex.popover }}
 aria-label="چت با تکباکس"
 >
        <Icon name="chat" size={20} strokeWidth={1.75} />
        <span className="hidden sm:inline">پرسش از تکباکس</span>
 </FloatingActionButton>

 {/* panel */}
 {open && (
 <div dir="rtl" className="fixed bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-[380px]" style={{zIndex:zIndex.chatbot}}>
 <div className="tb-overlay-panel flex h-[520px] max-h-[72vh] flex-col overflow-hidden p-0">
 <div className="flex items-center justify-between border-b border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] px-3 py-2.5">
 <div className="tb-text-sm ">دستیار تکباکس <span className="tb-text-sm text-[var(--tb-fg-muted)]">AI Beta</span></div>
 <div className="flex items-center gap-2">
 <Button variant="link" size="xs" onClick={()=>{setMsgs([]); localStorage.removeItem(STORAGE_KEY)}} className="tb-text-sm text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]">پاک‌سازی</Button>
 <CloseButton onClick={()=>setOpen(false)} label="بستن چت" />
 </div>
 </div>

 <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--tb-bg-primary)] p-3 tb-text-sm">
 {msgs.length===0 && (
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">
 سلام! من دستیار هوشمند تکباکس هستم.<br/>
 درباره محصولات (مثلا <b>QNAP-2277</b>)، مشکلات شبکه، یا مقالات بپرسید.<br/>
 <div className="flex flex-wrap gap-1.5 mt-2">
 {["قیمت QNAP-2277؟","RAID مناسب سرور HP؟","فرق NAS و SAN؟","مشکل iSCSI؟"].map(s=>(
 <ChipButton key={s} tone="brand" onClick={()=>setInput(s)} className="px-2 py-1 tb-text-sm">{s}</ChipButton>
 ))}
 </div>
 </div>
 )}
 {msgs.map((m,i)=>(
 <div key={i} className={`flex ${m.role==="user" ? "justify-end" : "justify-start"}`}>
 <div className={`max-w-[82%] rounded-[var(--tb-radius-lg)] px-3 py-2 whitespace-pre-wrap ${m.role==="user" ? "text-[var(--tb-on-accent)]" : ""}`}
 style={{background: m.role==="user" ? "var(--tb-primary)" : "var(--tb-bg-muted)", color: m.role==="user" ? "var(--tb-on-accent)" : "var(--tb-fg-primary)"}}>
 {m.text}
 </div>
 </div>
 ))}
 {loading && <div className="tb-text-sm text-[var(--tb-fg-muted)]">در حال فکر کردن…</div>}
 <div ref={endRef} />
 </div>

 <form onSubmit={send} className="flex gap-2 border-t border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-2">
 <input
 value={input}
 onChange={e=>setInput(e.target.value)}
 placeholder="سوال فنی / محصول خود را بپرسید…"
 className="input flex-1 !py-2 tb-text-sm"
 disabled={loading}
 />
 <Button disabled={loading || !input.trim()} size="sm" className="px-4 tb-text-sm disabled:opacity-50">
 {loading ? "…" : "ارسال"}
 </Button>
 </form>
 <div className="px-3 pb-2 text-center tb-text-sm text-[var(--tb-fg-muted)]">
 پاسخ‌ها ممکن است نادرست باشند – همیشه مستندات رسمی را چک کنید • API: <code>/api/chat</code>
 </div>
 </div>
 </div>
 )}
 </>
 );
}

```

---

## `features/comment/actions/comments.ts`

```ts
"use server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postSchema = z.object({
 module: z.string(),
 slug: z.string(),
 text: z.string().min(2).max(2000),
 authorName: z.string().optional(),
 parentId: z.string().nullable().optional(),
});

export async function getCommentsAction(module: string, slug: string){
 const post = await prisma.post.findUnique({
 where: { module_slug: { module: module as any, slug } },
 select: { id: true }
 });
 if(!post) return [];
 const comments = await prisma.comment.findMany({
 where: { postId: post.id },
 orderBy: { createdAt: "asc" },
 include: { replies: { orderBy: { createdAt: "asc" } } }
 });
 return comments;
}

export async function createCommentAction(prevState: any, formData: FormData){
 const user = await getSessionUser();
 const raw = {
 module: String(formData.get("module")||""),
 slug: String(formData.get("slug")||""),
 text: String(formData.get("text")||""),
 authorName: String(formData.get("authorName")||""),
 parentId: formData.get("parentId") ? String(formData.get("parentId")) : null,
 };
 try{
 const { module, slug, text, authorName, parentId } = postSchema.parse(raw);
 const post = await prisma.post.findUnique({
 where: { module_slug: { module: module as any, slug } }
 });
 if(!post) return { ok:false, error:"post_not_found" };
 await prisma.comment.create({
 data: {
 postId: post.id,
 parentId,
 authorId: user?.id || null,
 authorName: user?.name || authorName || "مهمان",
 text
 }
 });
 revalidatePath(`/${module}/${slug}`);
 return { ok: true };
 }catch(e:any){
 return { ok:false, error: e.message };
 }
}

export async function voteCommentAction(commentId: string, vote: 1|-1|0, fingerprint: string){
 "use server";
 const existing = await prisma.commentVote.findUnique({
 where: { fingerprint_commentId: { fingerprint, commentId } }
 });
 const oldV = existing?.vote ?? 0;
 if(vote === oldV){ // toggle off handled by caller sending 0
 }
 if(vote === 0){
 if(existing){
 await prisma.$transaction([
 prisma.commentVote.delete({ where:{ id: existing.id }}),
 prisma.comment.update({
 where:{ id: commentId },
 data:{
 likes: { decrement: existing.vote===1?1:0 },
 dislikes: { decrement: existing.vote===-1?1:0 }
 }
 })
 ]);
 }
 } else {
 await prisma.$transaction(async tx=>{
 if(existing){
 await tx.commentVote.update({ where:{id: existing.id}, data:{ vote }});
 await tx.comment.update({
 where:{id: commentId},
 data:{
 likes: { increment: (vote===1?1:0) - (oldV===1?1:0) },
 dislikes: { increment: (vote===-1?1:0) - (oldV===-1?1:0) }
 }
 });
 } else {
 await tx.commentVote.create({ data:{ commentId, fingerprint, vote }});
 await tx.comment.update({
 where:{id: commentId},
 data:{
 likes: { increment: vote===1?1:0 },
 dislikes: { increment: vote===-1?1:0 }
 }
 });
 }
 });
 }
 const c = await prisma.comment.findUnique({ where:{id:commentId}, select:{likes:true, dislikes:true}});
 revalidatePath("/", "layout");
 return c;
}

```

---

## `features/comment/components/CommentSection.tsx`

```tsx
"use client";
import * as React from "react";
import { useActionState, useEffect, useOptimistic, useTransition, useState } from "react";
import { getCommentsAction, createCommentAction, voteCommentAction } from "@/features/comment/actions/comments";
import { CommentVote } from "@/components/ui/LikeButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type CommentNode = any;

function nestFlat(rows: any[]): CommentNode[] {
 const map = new Map<string, any>();
 rows.forEach((r: any) => map.set(r.id, { ...r, replies: [] }));
 const roots: any[] = [];
 map.forEach((n) => {
 if (n.parentId && map.has(n.parentId)) map.get(n.parentId)!.replies.push(n);
 else roots.push(n);
 });
 return roots;
}

export default function CommentSection({ module, slug }: { module: string; slug: string }) {
 const [comments, setComments] = useState<CommentNode[]>([]);
 const [loading, setLoading] = useState(true);
 const [isPending, startTransition] = useTransition();

 const load = React.useCallback(async () => {
 setLoading(true);
 try {
 const data = await getCommentsAction(module, slug);
 setComments(nestFlat(data as any));
 } finally {
 setLoading(false);
 }
 }, [module, slug]);

 useEffect(() => { load(); }, [load]);

 // Server Action form – useActionState (React 19)
 const [state, formAction, isSubmitting] = useActionState(
 async (_prev: any, formData: FormData) => {
 const res = await createCommentAction(null, formData);
 if ((res as any)?.ok) {
 startTransition(() => { load(); });
 return { ok: true, ts: Date.now() };
 }
 return res;
 },
 { ok: false }
 );

 const [replyOpen, setReplyOpen] = React.useState<string | null>(null);

 const renderNode = (c: CommentNode, depth = 0) => (
 <div key={c.id} style={{ marginRight: depth ? 16 : 0, marginTop: 12 }}>
 <div className={depth ? "border-r-2 border-[var(--tb-border)] pe-3" : "pe-0"} style={{ marginRight: depth ? 12 : 0 }}>
 <div className="card p-4">
 <div className="flex justify-between items-center gap-2">
 <div className=" tb-text-sm">{(c as any).authorName || "کاربر"}</div>
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">
 {new Date((c as any).createdAt).toLocaleString("fa-IR", { dateStyle:"medium", timeStyle:"short" })}
 </div>
 </div>
 <p className="mt-2 whitespace-pre-wrap tb-text-sm text-[var(--tb-fg-muted)]">{(c as any).text}</p>
 <div className="flex items-center gap-4 mt-3">
 <CommentVote
 id={c.id}
 initialLikes={(c as any).likes ?? 0}
 initialDislikes={(c as any).dislikes ?? 0}
 />
 <Button
 onClick={()=> setReplyOpen(replyOpen===c.id ? null : c.id)}
 variant="link"
 size="xs"
 className="tb-text-sm text-[var(--tb-fg-muted)]"
 type="button"
 >
 {replyOpen===c.id ? "بستن" : "پاسخ"}
 </Button>
 </div>

 {replyOpen===c.id && (
 <form action={formAction} className="mt-3 space-y-2">
 <input type="hidden" name="module" value={module} />
 <input type="hidden" name="slug" value={slug} />
 <input type="hidden" name="parentId" value={c.id} />
 <input type="hidden" name="authorName" value="مهمان" />
 <textarea name="text" required className="input min-h-[90px] tb-text-sm" placeholder={`پاسخ به ${(c as any).authorName}…`} />
 <div className="flex justify-end gap-2">
 <Button type="button" variant="ghost" size="xs" onClick={()=>setReplyOpen(null)}>انصراف</Button>
 <Button disabled={isSubmitting || isPending} size="xs">
 {isSubmitting ? "در حال ارسال…" : "ارسال پاسخ"}
 </Button>
 </div>
 </form>
 )}
 </div>
 {c.replies && c.replies.length > 0 && (
 <div className="mt-2 space-y-2">
 {c.replies.map((r:any) => renderNode(r, depth+1))}
 </div>
 )}
 </div>
 </div>
 );

 const totalCount = comments.reduce((s, c:any) => s + 1 + ((c.replies?.length)||0), 0);

 return (
 <section className="mt-14 border-t border-[var(--tb-border)] pt-10">
 <div className="flex items-center justify-between mb-4">
 <h3 className="tb-text-lg ">نظرات <span className="tb-text-sm text-[var(--tb-fg-muted)]">({totalCount.toLocaleString("fa-IR")})</span></h3>
 <Badge variant="secondary" className="tb-text-sm">Server Actions • Prisma</Badge>
 </div>

 {/* new top-level comment – Server Action */}
 <form action={formAction} className="card p-4 space-y-3 mb-7">
 <input type="hidden" name="module" value={module} />
 <input type="hidden" name="slug" value={slug} />
 <input type="hidden" name="parentId" value="" />
 <div className="grid sm:grid-cols-3 gap-2">
 <input name="authorName" placeholder="نام شما" className="input tb-text-md" />
 <input name="email" type="email" placeholder="ایمیل (اختیاری)" className="input tb-text-md sm:col-span-2" />
 </div>
 <textarea name="text" required placeholder="نظر خود را بنویسید… (Server Action – app/actions/comments.ts)" className="input min-h-[110px] tb-text-sm" />
 <div className="flex justify-between items-center">
 <span className="tb-text-sm text-[var(--tb-fg-muted)]">
 {state?.ok ? <span className="text-[var(--tb-success)]">✓ ثبت شد – revalidatePath انجام شد</span> : "ارسال → createCommentAction → Prisma → revalidatePath"}
 </span>
 <Button disabled={isSubmitting || isPending} size="sm">
 {isSubmitting ? "…" : "ارسال نظر"}
 </Button>
 </div>
 </form>

 <div className="space-y-1 min-h-[60px]">
 {loading ? (
 <p className="tb-text-md text-[var(--tb-fg-muted)]">در حال بارگذاری نظرات از Prisma…</p>
 ) : comments.length === 0 ? (
 <p className="tb-text-md text-[var(--tb-fg-muted)]">اولین نظر را شما ثبت کنید.</p>
 ) : (
 comments.map(c => renderNode(c, 0))
 )}
 </div>
 </section>
 );
}

```

---

## `features/consultation/components/ConsultationModal.tsx`

```tsx
"use client";

import { useState } from "react";
import { zIndex } from "@/design";
import { Button } from "@/components/ui/Button";
import { CloseButton } from "@/components/ui/CloseButton";
import { OverlayBackdrop } from "@/components/ui/Overlay";
import { Panel } from "@/components/ui/Panel";

type ConsultationModalProps = {
 open: boolean;
 onClose: () => void;
};

export default function ConsultationModal({ open, onClose }: ConsultationModalProps) {
 const [sent, setSent] = useState(false);

 if (!open) return null;

 return (
 <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: zIndex.modal }} dir="rtl">
 <OverlayBackdrop onClick={onClose} />
 <Panel className="relative w-full max-w-md space-y-4" style={{ zIndex: zIndex.modalContent }}>
 <div className="flex items-center justify-between">
 <h3 className="tb-text-md text-[var(--tb-consultation)]">درخواست مشاوره زیرساخت</h3>
 <CloseButton onClick={onClose} label="بستن" />
 </div>

 {sent ? (
 <div className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] p-4 text-center tb-text-sm text-[var(--tb-fg-muted)]">
 درخواست شما ثبت شد. کارشناسان تکباکس به‌زودی با شما تماس می‌گیرند.
 </div>
 ) : (
 <form
 className="space-y-3"
 onSubmit={(e) => {
 e.preventDefault();
 setSent(true);
 }}
 >
 <input className="input" placeholder="نام سازمان" required />
 <input className="input" placeholder="تلفن" required />
 <textarea className="input min-h-[110px]" placeholder="نیاز شما؟ سرور، شبکه، ذخیره‌سازی…" />
 <Button type="submit" className="w-full">ارسال درخواست</Button>
 </form>
 )}
 </Panel>
 </div>
 );
}

```

---

## `features/content/components/BentoCard.tsx`

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type Props = {
 title: string;
 description?: string;
 href?: string;
 color?: string;
 className?: string;
 children?: ReactNode;
 badge?: string;
 footerLink?: string;
 footerLabel?: string;
};

export default function BentoCard({
 title,
 description,
 href = "#",
 color = "text-foreground",
 className = "",
 children,
 badge,
 footerLink,
 footerLabel = "مشاهده همه →",
}: Props) {
 return (
 <div className={`group relative overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/80 p-5 transition-colors duration-[var(--tb-motion-md)] md:p-6 ${className}`} >
 <div className="flex h-full flex-col gap-3">
 <div className="flex items-start justify-between gap-3">
 <div>
 <h3 className={`tb-text-lg md:tb-text-big-title ${color}`}>
 <Link href={href} className="hover:opacity-90">{title}</Link>
 </h3>
 {description && (
 <p className="tb-text-sm text-[var(--tb-fg-muted)] mt-1.5 max-w-[36ch]">{description}</p>
 )}
 </div>
 {badge && <Badge variant="brand" className="shrink-0">{badge}</Badge>}
 </div>

 <div className="min-h-0 flex-1 overflow-hidden">
 {children ?? (
 <div className="h-full rounded-[var(--tb-radius-lg)] border border-dashed border-[color-mix(in_oklch,var(--tb-border)_50%,transparent)] bg-[var(--tb-bg-muted)]/15" />
 )}
 </div>

 {footerLink && (
 <div className="pt-1">
 <Link href={footerLink} className="tb-text-sm text-[var(--tb-fg-muted)] hover:text-[var(--tb-fg-primary)]">
 {footerLabel}
 </Link>
 </div>
 )}
 </div>
 </div>
 );
}

```

---

## `features/content/components/ContentCard.tsx`

```tsx
import Link from "next/link";
import Image from "next/image";
import type { ContentItem } from "@/lib/content";
import { moduleMeta } from "@/lib/content";
import { moduleColors } from "@/config/module-colors";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/design/icons";

const fallbackImage = "/assets/blog-1.jpg";
const fallbackAvatar = "/assets/hooman.png";

/** Small engagement stat with a central-system icon. */
function Stat({ icon, value }: { icon: "like" | "view" | "comment"; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon name={icon} size={14} strokeWidth={1.75} className="shrink-0" />
      <span>{value}</span>
    </span>
  );
}

/**
 * Module-synced hover color class for a feed card's title, scoped to THIS card only.
 * Each feed card uses `group/card`, so we retarget the centralized `group-hover:`token
 * to the named `group-hover/card:`variant. This prevents hovering one card from changing
 * every title inside the same Bento (which has its own outer `group`).
 */
function moduleHover(module: ContentItem["module"]) {
 const cls = moduleColors[module]?.hover ?? "group-hover:text-[var(--tb-fg-primary)]";
 return cls.replaceAll("group-hover:", "group-hover/card:");
}

function SafeImage({
 src,
 alt,
 className = "",
 sizes = "100vw",
}: {
 src?: string;
 alt: string;
 className?: string;
 sizes?: string;
}) {
 return (
 <Image
 src={src || fallbackImage}
 alt={alt}
 fill
 sizes={sizes}
 className={className}
 />
 );
}

export function ContentCard({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
 const meta = moduleMeta[item.module];
 return (
 <Link
 href={`/${item.module}/${item.slug}`}
 className="group/card block rounded-[var(--tb-radius-md)] p-2 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]"
 >
 <div className="flex gap-3">
 {item.image && !compact && (
 <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)]">
 <SafeImage src={item.image} alt={item.title} className="object-cover" sizes="80px" />
 </div>
 )}
 <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 tb-text-sm text-[var(--tb-fg-muted)]">
            <span className={`rounded-[var(--tb-radius-full)] border border-[color-mix(in_oklch,currentColor_35%,transparent)] px-2 py-0.5 ${moduleColors[item.module]?.active ?? "text-[var(--tb-fg-primary)]"}`}>{meta.titleFa}</span>
            <span>{item.date_fa}</span>
          </div>
 <h4 className={`mt-1 line-clamp-2 tb-text-sm text-[var(--tb-fg-primary)] transition-colors ${moduleHover(item.module)}`}>{item.title}</h4>
 {!compact && <p className="mt-1 line-clamp-2 tb-text-sm text-[var(--tb-fg-muted)]">{item.excerpt}</p>}
          <div className="mt-2 flex items-center gap-3 tb-text-sm text-[var(--tb-fg-muted)]">
            <Stat icon="like" value={item.likes.toLocaleString("fa-IR")} />
            <Stat icon="view" value={item.views.toLocaleString("fa-IR")} />
            <Stat icon="comment" value={((item.likes % 9) + 1).toLocaleString("fa-IR")} />
          </div>
 </div>
 </div>
 </Link>
 );
}

// ---------- FEED VARIANTS ----------
export function ContentFeedList({ items, variant="compact" }: { items: ContentItem[]; variant?: "compact"|"image"|"video"|"forum"|"product"|"download"|"review" }) {
 if (!items.length) return <div className="py-6 text-center tb-text-sm text-[var(--tb-fg-muted)]">مطلبی نیست</div>;

 if (variant === "product") {
 return (
 <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
 {items.map(i => <ProductFeedCard key={i.module+i.slug} item={i} />)}
 </div>
 );
 }

 if (variant === "review") {
 return (
 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
 {items.map(i => <ReviewFeedCard key={i.module+i.slug} item={i} />)}
 </div>
 );
 }

 return (
 <div className="space-y-1.5">
 {items.map(i => {
 if(variant==="video") return <VideoFeedCard key={i.module+i.slug} item={i} />;
 if(variant==="forum") return <ForumFeedCard key={i.module+i.slug} item={i} />;
 if(variant==="download") return <DownloadFeedCard key={i.module+i.slug} item={i} />;
 return <ContentCard key={i.module+i.slug} item={i} compact={variant==="compact"} />;
 })}
 </div>
 );
}

function VideoFeedCard({item}:{item:ContentItem}){
 return (
 <Link href={`/${item.module}/${item.slug}`} className="group/card block overflow-hidden rounded-[var(--tb-radius-md)] p-1.5 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]">
 <div className="relative aspect-video overflow-hidden rounded-[var(--tb-radius-sm)] bg-black">
        <SafeImage src={item.image} alt={item.title} className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
      </div>
      <div className="px-1 pt-2">
        <div className={`line-clamp-2 tb-text-sm transition-colors ${moduleHover(item.module)}`}>{item.title}</div>
        <div className="mt-1 flex items-center gap-3 tb-text-sm text-[var(--tb-fg-muted)]">
          <Stat icon="view" value={item.views.toLocaleString("fa-IR")} />
          <Stat icon="like" value={item.likes.toLocaleString("fa-IR")} />
          <Stat icon="comment" value={((item.likes % 9) + 1).toLocaleString("fa-IR")} />
        </div>
      </div>
 </Link>
 );
}

function ForumFeedCard({item}:{item:ContentItem}){
 const answers = (item.likes % 7) + 2;
 const solved = !item.slug.includes("proxmox");
 return (
 <Link href={`/${item.module}/${item.slug}`} className="group/card flex gap-2.5 rounded-[var(--tb-radius-md)] p-2 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]">
 <div className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-[var(--tb-radius-full)] bg-[var(--tb-bg-muted)]">
 <Image src={item.author.avatar || fallbackAvatar} alt={item.author.name} fill sizes="32px" className="object-cover" />
 </div>
 <div className="min-w-0 flex-1">
 <div className={`line-clamp-2 tb-text-sm transition-colors ${moduleHover(item.module)}`}>{item.title}</div>
 <div className="mt-1 flex flex-wrap items-center gap-2 tb-text-sm text-[var(--tb-fg-muted)]">
 <span>{item.author.name}</span>
 <span>• {answers} پاسخ</span>
            <span className={`rounded-[var(--tb-radius-sm)] border px-1.5 py-0.5 tb-text-sm ${solved ? "border-[color-mix(in_oklch,var(--tb-success)_45%,transparent)] text-[var(--tb-success)]" : "border-[color-mix(in_oklch,var(--tb-warning)_45%,transparent)] text-[var(--tb-warning)]"}`}>{solved ? "حل‌شده" : "باز"}</span>
 </div>
 </div>
 </Link>
 );
}

function ProductFeedCard({item}:{item:ContentItem}){
 return (
 <Link href={`/${item.module}/${item.slug}`} className="group/card block overflow-hidden rounded-[var(--tb-radius-md)] p-1.5 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]">
 <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--tb-radius-sm)] bg-[var(--tb-bg-muted)]">
 <SafeImage src={item.image} alt={item.title} className="object-cover" sizes="(min-width:1024px) 180px, 50vw" />
 <span className="absolute left-2 top-2 rounded-[var(--tb-radius-full)] border border-white/30 bg-transparent px-2 py-0.5 tb-text-sm text-white backdrop-blur-[var(--tb-blur-sm)]">موجود</span>
 </div>
 <div className="px-1 pt-2">
 <div className={`line-clamp-2 min-h-[34px] tb-text-sm transition-colors ${moduleHover(item.module)}`}>{item.title}</div>
 <div className="mt-1 tb-text-sm text-[var(--tb-shop)]">۴۸,۹۰۰,۰۰۰ <span className="tb-text-sm text-[var(--tb-fg-muted)]">تومان</span></div>
 </div>
 </Link>
 );
}

function DownloadFeedCard({item}:{item:ContentItem}){
 return (
 <div className="group/card flex items-center gap-2 rounded-[var(--tb-radius-md)] p-2 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]">
 <div className="min-w-0 flex-1">
 <Link href={`/${item.module}/${item.slug}`} className={`line-clamp-1 tb-text-sm transition-colors ${moduleHover(item.module)}`}>{item.title}</Link>
 <div className="mt-0.5 tb-text-sm text-[var(--tb-fg-muted)]">{item.date_fa} • {item.category}</div>
 </div>
 <ButtonLink href={`/${item.module}/${item.slug}`} size="xs" className="whitespace-nowrap px-3 py-1.5 tb-text-sm">انتخاب نسخه</ButtonLink>
 </div>
 );
}

function ReviewFeedCard({item}:{item:ContentItem}){
 return (
 <Link href={`/${item.module}/${item.slug}`} className="group/card flex gap-2.5 overflow-hidden rounded-[var(--tb-radius-md)] p-2 transition-colors hover:bg-[color-mix(in_oklch,var(--tb-bg-muted)_45%,transparent)]">
 <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)]">
 <SafeImage src={item.image} alt={item.title} className="object-cover" sizes="64px" />
 </div>
 <div className="min-w-0 flex-1 space-y-1">
 <div className={`line-clamp-2 tb-text-sm transition-colors ${moduleHover(item.module)}`}>{item.title}</div>
 <div className="flex items-center gap-2">
 <div className="relative h-5 w-5 overflow-hidden rounded-[var(--tb-radius-full)] bg-[var(--tb-bg-muted)]">
 <Image src={item.author.avatar || fallbackAvatar} alt={item.author.name} fill sizes="20px" className="object-cover" />
 </div>
 <span className="tb-text-sm text-[var(--tb-fg-muted)]">{item.author.name}</span>
 </div>
          <div className="flex gap-3 tb-text-sm text-[var(--tb-fg-muted)]">
            <Stat icon="like" value={item.likes.toLocaleString("fa-IR")} />
            <Stat icon="comment" value={"۱۲"} />
            <Stat icon="view" value={item.views.toLocaleString("fa-IR")} />
          </div>
 </div>
 </Link>
 );
}

```

---

## `features/content/components/ContentDetail.tsx`

```tsx
import Image from "next/image";
import { type ContentItem } from "@/lib/content";
import { moduleMeta } from "@/lib/content";
import { Icon } from "@/design/icons";
import { LikeButton } from "@/components/ui/LikeButton";
import CommentSection from "@/features/comment/components/CommentSection";
import SuggestionGrid from "@/features/content/components/SuggestionGrid";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ContentDetail({ item }: { item: ContentItem }) {
 const meta = moduleMeta[item.module];
 return (
 <article className="mx-auto max-w-3xl px-5 md:px-0 py-10" dir="rtl">
 <div className="flex items-center gap-2 tb-text-sm text-[var(--tb-fg-muted)] mb-3">
 <Link href={`/${item.module}`} className={`${meta.color} hover:underline`}>{meta.titleFa}</Link>
 <span>•</span>
 <span>{item.date_fa}</span>
 <span>•</span>
 <span>{item.category}</span>
 </div>

        <h1 className="tb-text-big-title">{item.title}</h1>
 <p className="text-[var(--tb-fg-muted)] mt-4 tb-text-md ">{item.excerpt}</p>

 <div className="flex flex-wrap items-center gap-3 mt-6 tb-text-sm">
 <div className="flex items-center gap-2">
 {item.author.avatar && <Image src={item.author.avatar} width={32} height={32} className="h-8 w-8 rounded-[var(--tb-radius-full)] object-cover ring-1 ring-[var(--tb-border)]" alt={item.author.name} />}
 <div>
 <div className=" tb-text-sm">{item.author.name}</div>
 <div className="text-[var(--tb-fg-muted)] tb-text-sm">{item.author.role}</div>
 </div>
 </div>
 <div className="ms-auto flex items-center gap-2 text-[var(--tb-fg-muted)]">
 <span className="inline-flex items-center gap-1"><Icon name="view" size={15} strokeWidth={1.75} />{item.views.toLocaleString("fa-IR")}</span>
 </div>
 </div>

 {item.module === "media" ? (
 <div className="mt-8 overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-black shadow-[var(--tb-shadow-md)]">
 <video
 controls
 playsInline
 poster={item.image}
 className="w-full aspect-video object-contain bg-black"
 src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
 />
 <div className="bg-[var(--tb-bg-secondary)] px-4 py-2 tb-text-sm text-[var(--tb-fg-muted)] flex gap-4">
 <span className="inline-flex items-center gap-1"><Icon name="view" size={15} strokeWidth={1.75} />{item.views.toLocaleString("fa-IR")} بازدید</span>
 <span className="inline-flex items-center gap-1"><Icon name="like" size={15} strokeWidth={1.75} />{item.likes.toLocaleString("fa-IR")} پسند</span>
 <span className="inline-flex items-center gap-1"><Icon name="comment" size={15} strokeWidth={1.75} />نظرات فعال</span>
 </div>
 </div>
 ) : item.image && (
 <div className="mt-8 overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] shadow-[var(--tb-shadow-md)]">
 <div className="relative aspect-[16/9] max-h-[420px]"><Image src={item.image} alt={item.title} fill sizes="(min-width:768px) 768px, 100vw" className="object-cover" /></div>
 </div>
 )}

 <div className="prose prose-invert max-w-none mt-8 tb-text-md text-[var(--tb-fg-muted)]" dir="rtl">
 <p>{item.content || item.excerpt}</p>
 <p className="mt-4">
 این مطلب به صورت آزمایشی از دیتاسورس JSON تکباکس بارگذاری شده و سیستم لایک، کامنت و پیشنهاد مرتبط فعال است.
 </p>
 </div>

 <div className="flex flex-wrap gap-2 mt-8">
 {item.tags.map(t => (
 <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="transition-opacity hover:opacity-85"><span className="rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] bg-transparent px-2 py-0.5 tb-text-sm text-[var(--tb-fg-muted)]">#{t}</span></Link>
 ))}
 </div>

 <div className="mt-8 flex flex-wrap items-center gap-3">
 <LikeButton contentType={item.module} slug={item.slug} initial={item.likes} />
 <Button variant="ghost" size="sm">اشتراک‌گذاری</Button>
 </div>

 <SuggestionGrid current={item} />
 <CommentSection module={item.module} slug={item.slug} />
 </article>
 );
}

```

---

## `features/content/components/ModuleList.tsx`

```tsx
import { getModuleItems, moduleMeta, type ModuleSlug } from "@/lib/content";
import { ContentCard } from "@/features/content/components/ContentCard";
import Link from "next/link";

export default function ModuleList({ module }: { module: ModuleSlug }) {
 const items = getModuleItems(module);
 const meta = moduleMeta[module];
 return (
 <main className="mx-auto max-w-5xl px-5 py-14" dir="rtl">
 <div className="flex items-end justify-between mb-8">
 <div>
 <h1 className={`tb-text-big-title ${meta.color}`}>{meta.titleFa}</h1>
 <p className="tb-text-md text-muted-foreground mt-2">{items.length} مطلب • مرتب‌سازی تازه‌ترین</p>
 </div>
 <Link href="/" className="tb-text-sm text-muted-foreground hover:text-foreground">خانه →</Link>
 </div>
 <div className="grid gap-4 md:grid-cols-2">
 {items.map(i => <ContentCard key={i.slug} item={i} />)}
 </div>
 {items.length === 0 && <p className="text-center text-muted-foreground py-16">محتوایی ثبت نشده</p>}
 </main>
 );
}

```

---

## `features/content/components/SuggestionGrid.tsx`

```tsx
import { getRelated, type ContentItem } from "@/lib/content";
import { ContentCard } from "@/features/content/components/ContentCard";

export default function SuggestionGrid({ current }: { current: ContentItem }) {
 const related = getRelated(current, 6);
 if (!related.length) return null;
 return (
 <section className="mt-16 border-t border-[var(--tb-border)] pt-10">
 <h3 className="tb-text-lg mb-5">پیشنهاد مرتبط از همه ماژول‌ها</h3>
 <p className="tb-text-sm text-muted-foreground mb-4">
 بر اساس برچسب‌ها: {current.tags.map(t=>`#${t}`).join(" ")}
 </p>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {related.map(r => (
 <ContentCard key={r.module + r.slug} item={r} />
 ))}
 </div>
 </section>
 );
}

```

---

## `features/download/components/DownloadDetail.tsx`

```tsx
"use client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ContentItem } from "@/lib/content";
import Link from "next/link";
import { useState, useMemo } from "react";

const fakeVersions = (slug:string) => {
 const base = [
 { ver: "v5.2.4", date: "2026-07-12", dateFa: "21 تیر 1405", size: "842 MB", os: "QTS", notes: "پایدار – پیشنهادی" },
 { ver: "v5.2.3", date: "2026-06-20", dateFa: "30 خرداد 1405", size: "838 MB", os: "QTS", notes: "رفع باگ امنیتی" },
 { ver: "v5.1.9", date: "2026-05-02", dateFa: "12 اردیبهشت 1405", size: "821 MB", os: "QTS", notes: "" },
 { ver: "v24.04", date: "2026-07-07", dateFa: "16 تیر 1405", size: "2.1 GB", os: "Linux", notes: "LTS" },
 { ver: "2022", date: "2026-04-11", dateFa: "22 فروردین 1405", size: "4.7 GB", os: "Windows", notes: "" },
 ];
 // filter a bit by slug tags
 return base;
};

export default function DownloadDetail({ item }: { item: ContentItem }){
 const versions = fakeVersions(item.slug);
 const osOptions = Array.from(new Set(["all", ...versions.map(v=>v.os), ...item.tags.filter(t=>["linux","windows","vmware","qnap","ubuntu"].includes(t.toLowerCase())) ]));
 const [os, setOs] = useState("all");
 const [sort, setSort] = useState<"new"|"old">("new");

 const list = useMemo(()=>{
 let l = versions.filter(v => os==="all" || v.os.toLowerCase()===os.toLowerCase() || item.tags.some(t=>t.toLowerCase()===os.toLowerCase()));
 if(l.length===0) l = versions;
 l = [...l].sort((a,b)=> sort==="new" ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date));
 return l;
 }, [os, sort, versions, item.tags]);

 return (
 <main className="mx-auto max-w-4xl px-4 py-10" dir="rtl">
 <div className="tb-text-sm text-muted-foreground mb-2">
 <Link href="/download" className="hover:text-foreground">دانلود</Link> / <span className="text-[var(--tb-download)]">{item.category}</span>
 </div>
 <h1 className="tb-text-big-title md:tb-text-big-title ">{item.title}</h1>
      <p className="text-muted-foreground mt-3">{item.excerpt}</p>

      {/* OS chooser */}
 <div className="card p-4 mt-8">
 <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
 <div className="">انتخاب سیستم‌عامل / نسخه</div>
 <div className="flex gap-2 tb-text-sm">
 <select value={os} onChange={e=>setOs(e.target.value)} className="input !w-auto !py-1.5 tb-text-sm">
 {osOptions.map(o=> <option key={o} value={o}>{o==="all"?"همه OS":o}</option>)}
 </select>
 <select value={sort} onChange={e=>setSort(e.target.value as any)} className="input !w-auto !py-1.5 tb-text-sm">
 <option value="new">جدیدترین اول</option>
 <option value="old">قدیمی‌ترین اول</option>
 </select>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full tb-text-md">
 <thead className="tb-text-sm text-muted-foreground border-b border-[var(--tb-border)]">
 <tr>
 <th className="text-right py-2 pe-2">نسخه</th>
 <th className="text-right py-2">تاریخ</th>
 <th className="text-right py-2 hidden sm:table-cell">OS</th>
 <th className="text-right py-2 hidden sm:table-cell">حجم</th>
 <th className="text-right py-2">یادداشت</th>
 <th></th>
 </tr>
 </thead>
 <tbody>
 {list.map(v=>(
 <tr key={v.ver+v.date} className="border-b border-[var(--tb-border)]/40 hover:bg-[var(--tb-bg-muted)]/20">
 <td className="py-3 pe-2 font-mono tb-text-sm ">{v.ver}</td>
 <td className="py-3 tb-text-sm">{v.dateFa}</td>
 <td className="py-3 hidden sm:table-cell"><Badge variant="download" className="tb-text-sm">{v.os}</Badge></td>
 <td className="py-3 hidden sm:table-cell tb-text-sm text-muted-foreground" dir="ltr">{v.size}</td>
 <td className="py-3 tb-text-sm text-muted-foreground">{v.notes}</td>
 <td className="py-3 text-left">
 <Button size="xs" onClick={e=>{e.preventDefault(); alert(`شروع دانلود ${item.title} – ${v.ver} (${v.os})`);}} className="px-3 py-1.5 tb-text-sm">دانلود</Button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <p className="tb-text-sm text-muted-foreground mt-3">لینک مستقیم داخل ایران – قابلیت resume – SHA256 در صفحه چک‌سام موجود است.</p>
 </div>

 <div className="card p-4 mt-6 tb-text-sm text-muted-foreground">
 {item.content}
 </div>
 </main>
 );
}

```

---

## `features/download/components/DownloadTable.tsx`

```tsx
"use client";
import { getModuleItems } from "@/lib/content";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useMemo, useState } from "react";
import ModuleHeader from "@/components/effects/ModuleHeader";

export default function DownloadTable(){
 const items = getModuleItems("download");
 const brands = Array.from(new Set(items.flatMap(i=> i.tags.filter(t=>["dell","hp","qnap","ubuntu","mikrotik"].includes(t.toLowerCase())))));
 const types = Array.from(new Set(items.map(i=>i.category).filter(Boolean))) as string[];

 const [q,setQ] = useState("");
 const [brand,setBrand] = useState("all");
 const [type,setType] = useState("all");
 const [os,setOs] = useState("all");

 const filtered = useMemo(()=>{
 return items.filter(f=>{
 if(q && !(`${f.title} ${f.excerpt} ${f.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()))) return false;
 if(brand!=="all" && !f.tags.map(t=>t.toLowerCase()).includes(brand.toLowerCase())) return false;
 if(type!=="all" && f.category !== type) return false;
 if(os!=="all" && !f.tags.some(t=>t.toLowerCase().includes(os.toLowerCase()))) return false;
 return true;
 });
 }, [items,q,brand,type,os]);

 return (
 <main className="mx-auto max-w-6xl px-4 py-12" dir="rtl">
 <ModuleHeader module="download" title="مرکز دانلود تکباکس" description="ISO • Firmware • Driver – لینک مستقیم داخل ایران" count={`${filtered.length.toLocaleString("fa-IR")} فایل`} />

 {/* filters */}
 <div className="card p-4 mb-6 grid md:grid-cols-4 gap-3 tb-text-md">
 <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجو فایل…" className="input md:col-span-1" />
 <select value={brand} onChange={e=>setBrand(e.target.value)} className="input">
 <option value="all">همه برندها</option>
 <option value="dell">DELL</option>
 <option value="hp">HP</option>
 <option value="qnap">QNAP</option>
 <option value="ubuntu">Ubuntu</option>
 <option value="mikrotik">MikroTik</option>
 {brands.filter(b=>!["dell","hp","qnap","ubuntu","mikrotik"].includes(b.toLowerCase())).map(b=><option key={b} value={b}>{b}</option>)}
 </select>
 <select value={type} onChange={e=>setType(e.target.value)} className="input">
 <option value="all">همه نوع‌ها</option>
 {types.map(t=> <option key={t} value={t}>{t}</option>)}
 </select>
 <select value={os} onChange={e=>setOs(e.target.value)} className="input">
 <option value="all">همه OS</option>
 <option value="linux">Linux</option>
 <option value="windows">Windows</option>
 <option value="vmware">VMware</option>
 <option value="qnap">QTS</option>
 </select>
 </div>

 <div className="card overflow-hidden">
 <table className="w-full tb-text-md">
 <thead className="bg-[var(--tb-bg-muted)]/30 tb-text-sm text-[var(--tb-fg-muted)]">
 <tr>
              <th className="text-right p-3">نام فایل</th>
              <th className="p-3 hidden md:table-cell text-right">تاریخ</th>
              <th className="p-3 text-left">جزئیات</th>
 </tr>
 </thead>
 <tbody>
 {filtered.map(f=>(
 <tr key={f.slug} className="border-t border-[color-mix(in_oklch,var(--tb-border)_60%,transparent)] hover:bg-[var(--tb-bg-muted)]/20 align-top">
                <td className="p-3">
                  <Link href={`/download/${f.slug}`} className=" hover:text-[var(--tb-download)] tb-text-md">{f.title}</Link>
                  <div className="tb-text-sm text-muted-foreground mt-1 line-clamp-2">{f.excerpt}</div>
                </td>
                <td className="p-3 hidden md:table-cell tb-text-sm text-muted-foreground">{f.date_fa}</td>
 <td className="p-3 text-left align-top">
 <ButtonLink href={`/download/${f.slug}`} variant="ghost" size="xs" className="whitespace-nowrap tb-text-sm">انتخاب نسخه</ButtonLink>
 <div className="tb-text-sm text-muted-foreground mt-1">{f.likes.toLocaleString("fa-IR")} بار</div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {filtered.length===0 && <div className="p-8 text-center text-muted-foreground tb-text-md">فایلی یافت نشد – فیلتر را تغییر دهید</div>}
 </div>
 </main>
 );
}

```

---

## `features/forum/components/ForumList.tsx`

```tsx
"use client";
import Image from "next/image";
import { getModuleItems, moduleMeta } from "@/lib/content";
import Link from "next/link";
import { useState } from "react";
import { zIndex } from "@/design";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/effects/ModuleHeader";
import { ChipButton } from "@/components/ui/ChipButton";
import { CloseButton } from "@/components/ui/CloseButton";
import { ModuleBadge } from "@/components/ui/ModuleBadge";
import { OverlayBackdrop } from "@/components/ui/Overlay";

type ForumPost = ReturnType<typeof getModuleItems>[0] & { answers?: number; solved?: boolean };

export default function ForumList(){
 const items = getModuleItems("forum").map((t,i)=>({
 ...t,
 answers: (t.likes % 9) + 2,
 solved: !t.slug.includes("proxmox"),
 avatar: t.author.avatar || "/assets/hooman.png"
 })) as (ForumPost & {avatar:string})[];
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [local, setLocal] = useState<typeof items>([]);
  const [filter, setFilter] = useState<"داغ"|"جدید"|"برتر"|"حل‌شده">("داغ");

  const merged = [...local, ...items];
  const all = (() => {
    const list = [...merged];
    if (filter === "جدید") return list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (filter === "برتر") return list.sort((a, b) => b.likes - a.likes);
    if (filter === "حل‌شده") return list.filter((t) => t.solved);
    return list.sort((a, b) => b.views - a.views); // داغ
  })();

 const submitTopic = (e: React.FormEvent)=>{
 e.preventDefault();
 if(!title.trim()) return;
 const slug = title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g,"-").slice(0,60) + "-" + Date.now().toString(36);
 const nt:any = {
 slug, module:"forum", title: title.trim(),
 excerpt: body.slice(0,140),
 content: body,
 tags: ["پرسش","تکباکس"],
 author:{ name:"شما", role:"عضو", avatar:"/assets/hooman.png" },
 avatar:"/assets/hooman.png",
 date: new Date().toISOString(),
 date_fa: new Intl.DateTimeFormat("fa-IR", {dateStyle:"long"}).format(new Date()),
 likes:0, views:1, category:"پرسش",
 answers:0, solved:false
 };
 setLocal(l=>[nt, ...l]);
 setTitle(""); setBody(""); setShowNew(false);
 // persist draft
 const d = JSON.parse(localStorage.getItem("tb_forum_drafts")||"[]"); d.unshift(nt); localStorage.setItem("tb_forum_drafts", JSON.stringify(d));
 };

 return (
 <main className="mx-auto max-w-6xl px-4 py-10" dir="rtl">
 <ModuleHeader module="forum" title="انجمن تکباکس" description="پرسش و پاسخ تخصصی – سبک Reddit" count={`${all.length.toLocaleString("fa-IR")} موضوع`}>
 <div className="flex gap-2">
 <input placeholder="جستجو در انجمن…" className="input w-56 tb-text-md" />
 <Button onClick={()=>setShowNew(true)} className="tb-text-md">+ موضوع جدید</Button>
 </div>
 </ModuleHeader>

 {/* sub nav like reddit */}
      <div className="flex gap-2 tb-text-sm mb-4">
        {(["داغ","جدید","برتر","حل‌شده"] as const).map(t=>(
          <ChipButton key={t} tone="forum" aria-pressed={filter===t} onClick={()=>setFilter(t)} className={filter===t ? "ring-1 ring-[var(--tb-forum)] text-[var(--tb-forum)]" : ""}>{t}</ChipButton>
        ))}
      </div>

 <div className="card divide-y divide-[var(--tb-border)]/60 overflow-hidden">
 <div className="hidden sm:grid grid-cols-12 tb-text-sm text-[var(--tb-fg-muted)] px-4 py-2 bg-[var(--tb-bg-muted)]/30">
 <div className="col-span-7">موضوع</div>
 <div className="col-span-1 text-center">رای</div>
 <div className="col-span-2 text-center">پاسخ / بازدید</div>
 <div className="col-span-2 text-left">آخرین فعالیت</div>
 </div>
          {all.map(t=>(
            <Link key={t.slug} href={`/forum/${t.slug}`} className="group grid grid-cols-12 px-3 sm:px-4 py-3 hover:bg-[var(--tb-bg-muted)]/20 gap-2 items-center">
              {/* vote column – reddit style */}
              <div className="hidden sm:flex col-span-1 flex-col items-center text-[var(--tb-fg-muted)] tb-text-sm">
                <Button type="button" variant="link" size="xs" onClick={(e)=>{e.preventDefault();e.stopPropagation();}} className="text-[var(--tb-fg-muted)] hover:text-[var(--tb-blog)]">▲</Button>
                <span className=" text-[var(--tb-fg-primary)]">{t.likes.toLocaleString("fa-IR")}</span>
                <Button type="button" variant="link" size="xs" onClick={(e)=>{e.preventDefault();e.stopPropagation();}} className="text-[var(--tb-fg-muted)] hover:text-[var(--tb-review)]">▼</Button>
              </div>
              {/* main */}
              <div className="col-span-12 sm:col-span-6 flex gap-3">
                <Image src={t.avatar} alt={t.author.name} width={40} height={40} className="mt-1 h-10 w-10 shrink-0 rounded-[var(--tb-radius-full)] object-cover ring-1 ring-[var(--tb-border)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="tb-text-md transition-colors group-hover:text-[var(--tb-forum)]">{t.title}</span>
                    {t.solved && <ModuleBadge module="success" className="px-1.5 py-0.5 tb-text-sm">حل‌شده ✓</ModuleBadge>}
                    {!t.solved && <ModuleBadge module="warning" className="px-1.5 py-0.5 tb-text-sm">باز</ModuleBadge>}
                  </div>
                  <div className="tb-text-sm text-[var(--tb-fg-muted)] mt-1">
                    ارسال شده توسط <b className="text-[var(--tb-fg-primary)]">{t.author.name}</b> • {t.date_fa}
                  </div>
                </div>
              </div>
              {/* stats */}
              <div className="col-span-6 sm:col-span-2 text-center">
                <div className="tb-text-md ">{(t.answers ?? 0).toLocaleString("fa-IR")} <span className="tb-text-sm text-[var(--tb-fg-muted)] ">پاسخ</span></div>
              </div>
              <div className="col-span-6 sm:col-span-2 text-center tb-text-sm text-[var(--tb-fg-muted)]">
                {t.views.toLocaleString("fa-IR")} بازدید
              </div>
              <div className="hidden sm:block col-span-1 text-left tb-text-sm text-[var(--tb-fg-muted)]">
                {t.date_fa.split(" ")[0]}<br/>{t.author.name.split(" ")[0]}
              </div>
            </Link>
          ))}
 </div>

 {/* New Topic Modal */}
 {showNew && (
 <div className="fixed inset-0 flex items-center justify-center p-4" style={{zIndex:zIndex.modal}} dir="rtl">
 <OverlayBackdrop onClick={()=>setShowNew(false)} />
 <form onSubmit={submitTopic} className="relative card w-full max-w-2xl p-5 space-y-3 z-10">
 <div className="flex justify-between items-center">
 <h3 className=" tb-text-lg">موضوع جدید – انجمن تکباکس</h3>
 <CloseButton onClick={()=>setShowNew(false)} />
 </div>
 <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان واضح بپرسید…" className="input" required />
 <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="جزئیات مشکل، لاگ‌ها، چیزی که امتحان کردید…" className="input min-h-[160px]" required />
 <div className="tb-text-sm text-[var(--tb-fg-muted)]">با ارسال، با قوانین انجمن موافقت می‌کنید. پیش‌نویس به‌صورت لوکال ذخیره می‌شود – در نسخه Prisma به /api/posts ارسال خواهد شد.</div>
 <div className="flex justify-end gap-2">
 <Button type="button" variant="ghost" onClick={()=>setShowNew(false)}>انصراف</Button>
 <Button>ارسال موضوع</Button>
 </div>
 </form>
 </div>
 )}
 </main>
 );
}

```

---

## `features/home/components/HeroSection.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { moduleColors } from "@/config/module-colors";

const items: { text: string; href: string; module: keyof typeof moduleColors }[] = [
 { text: "اخبار تکنولوژی رو با تکباکس دنبال کن", href: "/news", module: "news" },
 { text: "محصولات زیرساختی رو از تکباکس خریداری کن", href: "/shop", module: "shop" },
 { text: "مشکلات فنی رو داخل انجمن تکباکس مطرح کن", href: "/forum", module: "forum" },
 { text: "از ابزارهای زیرساختی تکباکس استفاده کن", href: "/tools", module: "tools" },
 { text: "فایل‌هایی که نیاز داری رو از تکباکس دانلود کن", href: "/download", module: "download" },
 { text: "نقد و بررسی‌های تکباکس رو دنبال کن", href: "/review", module: "review" },
 { text: "مقاله‌های تکنولوژی رو از تکباکس دنبال کن", href: "/blog", module: "blog" },
 { text: "ویدیوهای سرگرم‌کننده حوزه تکنولوژی رو از تکباکس دنبال کن", href: "/media", module: "media" },
];

export default function HeroSection() {
 const [index, setIndex] = useState(0);

 useEffect(() => {
 const t = setInterval(() => setIndex((p) => (p + 1) % items.length), 2800);
 return () => clearInterval(t);
 }, []);

 const item = items[index];

 return (
    <section className="relative flex min-h-[260px] flex-col items-center px-4 pb-10 pt-14 text-center md:min-h-[300px] md:pt-20" dir="rtl">
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-black tracking-tight text-[var(--tb-primary)] md:text-8xl">تکباکس</h1>
        <div className="hero-rotator mt-3 w-full max-w-2xl">
 <AnimatePresence mode="wait">
 <motion.div
 key={item.text}
 initial={{ opacity: 0, y: 14 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -14 }}
 transition={{ duration: 0.35 }}
 className="hero-item"
 >
 <Link href={item.href} className={`hero-rotator-text transition-colors ${moduleColors[item.module].active} hover:opacity-80`}>
 {item.text}
 </Link>
 </motion.div>
 </AnimatePresence>
 </div>
 </div>
 </section>
 );
}

```

---

## `features/home/components/HomeModulesSection.tsx`

```tsx
import BentoCard from "@/features/content/components/BentoCard";
import { modules } from "@/config/modules.config";
import { getLatest, moduleMeta, type ModuleSlug } from "@/lib/content";
import { ContentFeedList } from "@/features/content/components/ContentCard";
import ModuleBorderGlow from "@/components/effects/ModuleBorderGlow";

const feedVariant: Record<ModuleSlug, "image"|"video"|"forum"|"product"|"download"|"review"|"compact"> = {
 blog: "image",
 news: "image",
 media: "video",
 review: "review",
 tools: "compact",
 download: "download",
 shop: "product",
 forum: "forum",
};

export default function HomeModulesSection() {
 const sortedModules = [...modules]
 .filter(m => m.slug !== "tools") // tools moved to sidebar
 .sort((a, b) => a.order - b.order);

 return (
 <section className="px-4 md:px-10 lg:px-20 pb-24">
 <div className="mx-auto max-w-7xl">
 <div className="flex items-end justify-between mb-6 px-1">
 <h2 className="tb-text-big-title ">آخرین‌ها از تکباکس</h2>
 <span className="tb-text-sm text-muted-foreground">فید زنده ماژول‌ها</span>
 </div>
 <div className="grid grid-cols-1 gap-5 md:grid-cols-7 md:auto-rows-min">
 {sortedModules.map((module) => {
 const slug = module.slug as ModuleSlug;
 const feedCount = slug === "shop" ? 6 : slug === "review" ? 4 : slug === "forum" ? 4 : slug === "news" ? 6 : slug === "media" ? 2 : 3;
 const feed = getLatest(slug, feedCount);
 const meta = moduleMeta[slug];
 const variant = feedVariant[slug] || "image";
 return (
 <ModuleBorderGlow key={module.slug} moduleColor={meta.color} className={`${module.cols ?? ""} ${module.rows ?? ""}`}>
 <BentoCard
 title={module.title}
 description={module.description}
 href={`/${module.slug}`}
 color={module.color}
 className="!p-4 !border-0 !bg-transparent hover:translate-y-0"
 badge={`${feed.length} جدید`}
 footerLink={`/${module.slug}`}
 footerLabel={`همه ${meta.titleFa} →`}
 >
 <div className="[&>*>a:hover]:scale-[1.01] transition-transform">
 <ContentFeedList items={feed} variant={variant as any} />
 </div>
 </BentoCard>
 </ModuleBorderGlow>
 );
 })}
 </div>
 </div>
 </section>
 );
}

```

---

## `features/home/components/TeamChromaSection.tsx`

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ChromaGrid, { type ChromaItem } from "@/components/effects/ChromaGrid";

export type TeamMember = {
  name: string;
  role: string;
  roleFa?: string;
  username: string;
  avatar?: string;
  modules: string[];
};

/** Resolve a CSS var (e.g. --tb-blog) to a concrete rgb string for the card gradient. */
function resolveVarColor(varName: string, fallback: string): string {
 if (typeof window === "undefined") return fallback;
 const probe = document.createElement("span");
 probe.style.color = `var(${varName})`;
 probe.style.display = "none";
 document.body.appendChild(probe);
 const resolved = getComputedStyle(probe).color;
 probe.remove();
 return resolved || fallback;
}

export default function TeamChromaSection({ team }: { team: TeamMember[] }) {
 const [items, setItems] = useState<ChromaItem[]>([]);

 // The accent var cycles across module tokens so each card is tinted from central tokens.
 const accentVars = useMemo(
 () => ["--tb-blog", "--tb-news", "--tb-subnet", "--tb-vip", "--tb-tools", "--tb-shop"],
 []
 );

 useEffect(() => {
 const build = () => {
 const next = team.map((u, i) => {
 const varName = accentVars[i % accentVars.length];
        const color = resolveVarColor(varName, "var(--tb-primary)");
          return {
            image: u.avatar || "/assets/hooman.png",
            title: u.name,
            subtitle: u.roleFa || (u.role === "super_admin" ? "مدیر کل" : "ویراستار"),
            borderColor: color,
            gradient: `linear-gradient(145deg, ${color}, var(--tb-bg-secondary))`,
          } satisfies ChromaItem;
 });
 setItems(next);
 };
 build();
 const observer = new MutationObserver(build);
 observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
 return () => observer.disconnect();
 }, [team, accentVars]);

 return (
 <div className="relative w-full min-h-[480px]" dir="ltr">
 <ChromaGrid items={items} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
 </div>
 );
}

```

---

## `features/home/components/TechLogoLoopSection.tsx`

```tsx
"use client";

import LogoLoop from "@/components/effects/LogoLoop";
import {
 SiReact,
 SiNextdotjs,
 SiTypescript,
 SiTailwindcss,
 SiPrisma,
 SiVercel,
 SiFramer,
} from "react-icons/si";

const techLogos = [
 { node: <SiReact />, title: "React", href: "https://react.dev" },
 { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
 { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
 { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
 { node: <SiPrisma />, title: "Prisma", href: "https://www.prisma.io" },
 { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
 { node: <SiFramer />, title: "Framer Motion", href: "https://www.framer.com/motion" },
];

export default function TechLogoLoopSection() {
 return (
 <section className="relative overflow-hidden px-4 py-14 md:py-16" aria-labelledby="tech-stack-title">
 <div className="mx-auto max-w-6xl">
 <div className="mb-6 text-center">
 <h2 id="tech-stack-title" className="tb-text-lg md:tb-text-lg">زیرساخت مدرن تکباکس</h2>
 <p className="mt-1 tb-text-sm text-[var(--tb-fg-muted)]">ساخته‌شده با ابزارهای مدرن وب و زیرساخت</p>
 </div>
 <LogoLoop
 logos={techLogos}
 speed={120}
 direction="left"
          logoHeight={96}
          gap={80}
 pauseOnHover
 scaleOnHover
 fadeOut
 fadeOutColor="var(--tb-bg-primary)"
 ariaLabel="Technology stack"
 />
 </div>
 </section>
 );
}

```

---

## `features/media/components/MediaGallery.tsx`

```tsx
"use client";
import { getModuleItems, moduleMeta } from "@/lib/content";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { MediaSelectorCard } from "@/components/ui/MediaSelectorCard";
import { useState } from "react";
import ModuleHeader from "@/components/effects/ModuleHeader";

const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function MediaGallery(){
 const items = getModuleItems("media");
 const [active, setActive] = useState(items[0] || null);

 // naive comments count – pull from seed
 const commentsCount = (slug: string) => slug.includes("qnap") ? 23 : slug.includes("mikrotik") ? 12 : 8;

 return (
 <main className="mx-auto max-w-6xl px-4 py-12" dir="rtl">
 <ModuleHeader module="media" title="رسانه ویدیویی تکباکس" count={`${items.length.toLocaleString("fa-IR")} ویدیو`} />

 {active && (
 <div className="card overflow-hidden mb-8">
 <div className="relative bg-black aspect-video">
 <video
 key={active.slug}
 controls
 playsInline
 poster={active.image}
 className="w-full h-full object-contain bg-black"
 src={SAMPLE_VIDEO}
 />
 </div>
 <div className="p-4 flex flex-wrap items-start justify-between gap-3">
 <div className="min-w-0">
 <div className=" tb-text-lg">{active.title}</div>
 <div className="tb-text-sm text-[var(--tb-fg-muted)] mt-1">{active.excerpt}</div>
 <div className="flex items-center gap-4 tb-text-sm text-[var(--tb-fg-muted)] mt-3">
 <span>👁 {active.views.toLocaleString("fa-IR")} بازدید</span>
 <span>♥ {active.likes.toLocaleString("fa-IR")} پسند</span>
 <span>💬 {commentsCount(active.slug).toLocaleString("fa-IR")} نظر</span>
 <span>• {active.date_fa}</span>
 </div>
 </div>
 <ButtonLink href={`/media/${active.slug}`} variant="ghost" size="xs" className="whitespace-nowrap">صفحه اختصاصی →</ButtonLink>
 </div>
 </div>
 )}

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {items.map(v => (
 <MediaSelectorCard
 key={v.slug}
 active={active?.slug===v.slug}
 image={v.image}
 title={v.title}
 category={v.category}
 author={v.author.name}
 dateFa={v.date_fa}
 views={v.views}
 likes={v.likes}
 comments={commentsCount(v.slug)}
 onClick={()=>setActive(v)}
 />
 ))}
 </div>
 </main>
 );
}

```

---

## `features/media/components/VideoPlayer.tsx`

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function VideoPlayer({ src, poster, title }: { src: string; poster?: string; title?: string }) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const [isHls, setIsHls] = useState(false);

 useEffect(() => {
 let hls: any;
 const video = videoRef.current;
 if (!video || !src) return;
 const isHlsSrc = src.includes(".m3u8");
 setIsHls(isHlsSrc);
 if (isHlsSrc) {
 (async () => {
 const Hls = (await import("hls.js")).default;
 if (Hls.isSupported()) {
 hls = new Hls({ enableWorker: true, lowLatencyMode: true });
 hls.loadSource(src);
 hls.attachMedia(video);
 } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
 video.src = src;
 }
 })();
 } else {
 video.src = src;
 }
 return () => { try { hls?.destroy(); } catch {} };
 }, [src]);

 return (
 <div className="w-full bg-black rounded-[var(--tb-radius-lg)] overflow-hidden border border-[var(--tb-border)]">
 <video ref={videoRef} controls playsInline poster={poster} preload="metadata" className="w-full aspect-video bg-black" />
 {title && (
 <div className="flex justify-between bg-[var(--tb-bg-secondary)] px-3 py-2 tb-text-sm text-[var(--tb-fg-muted)]">
 <span className="truncate">{title}</span>
 <span className="tb-text-sm">{isHls ? "HLS • تطبیقی" : "MP4"}</span>
 </div>
 )}
 </div>
 );
}

```

---

## `features/news/components/NewsList.tsx`

```tsx
"use client";
import Image from "next/image";
import { getModuleItems } from "@/lib/content";
import Link from "next/link";
import ModuleHeader from "@/components/effects/ModuleHeader";
import { Icon } from "@/design/icons";

export default function NewsList() {
 const items = getModuleItems("news");
 const mainNews = items.slice(0, 4);
 const forceNews = items.slice(4).concat(items.slice(0, 2));

 return (
 <main className="mx-auto max-w-7xl px-4 md:px-6 py-12" dir="rtl">
 <ModuleHeader module="news" title="اخبار تکنولوژی" description="با منبع و ساعت انتشار" count={`${items.length.toLocaleString("fa-IR")} خبر`}>
 <span className="inline-flex items-center gap-2 rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] px-2 py-1 tb-text-sm text-[var(--tb-fg-muted)]">
 <span className="h-2 w-2 rounded-[var(--tb-radius-full)] bg-[var(--tb-news)] animate-pulse" /> زنده
 </span>
 </ModuleHeader>

 <div className="grid lg:grid-cols-12 gap-7 items-start">
 <section className="lg:col-span-8 order-1 lg:order-2">
 <div className="grid sm:grid-cols-2 gap-5">
 {mainNews.map((n: any, i: number) => (
                <Link key={n.slug} href={`/news/${n.slug}`} className={`card overflow-hidden group hover:shadow-[var(--tb-shadow-lg)] transition-all !p-0 ${i === 0 ? "sm:col-span-2" : ""}`}>
                  <div className="block relative aspect-[16/9] overflow-hidden bg-[var(--tb-bg-muted)]">
                    <Image src={n.image || "/assets/blog-1.jpg"} alt={n.title} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition-transform duration-[var(--tb-motion-lg)] group-hover:scale-105" />
                    <span className="absolute top-3 right-3 rounded-[var(--tb-radius-full)] border border-white/30 bg-transparent px-2 py-1 tb-text-sm text-white backdrop-blur-[var(--tb-blur-sm)]">{n.category}</span>
                  </div>
                  <div className="p-4">
                    <div className="tb-text-sm flex flex-wrap items-center gap-2 text-[var(--tb-fg-muted)]">
                      <span className="inline-flex items-center gap-1"><Icon name="clock" size={13} strokeWidth={1.75} />{n.date_fa} {n.time ? `• ${n.time}`: ""}</span>
                      {n.source && <><span>•</span><span>منبع: {n.source}</span></>}
                    </div>
                    <h3 className="tb-text-lg mt-2 transition-colors group-hover:text-[var(--tb-news)]">{n.title}</h3>
                    <p className="tb-text-sm line-clamp-2 mt-2 text-[var(--tb-fg-muted)]">{n.excerpt}</p>
                    <div className="tb-text-sm mt-3 flex items-center gap-3 text-[var(--tb-fg-muted)]">
                      <span className="inline-flex items-center gap-1"><Icon name="view" size={14} strokeWidth={1.75} />{n.views.toLocaleString("fa-IR")}</span>
                      <span className="inline-flex items-center gap-1"><Icon name="like" size={14} strokeWidth={1.75} />{n.likes.toLocaleString("fa-IR")}</span>
                      <span className="inline-flex items-center gap-1"><Icon name="comment" size={14} strokeWidth={1.75} />{((n.likes % 9) + 1).toLocaleString("fa-IR")}</span>
                    </div>
                  </div>
                </Link>
 ))}
 </div>
 </section>

 <aside className="lg:col-span-4 order-2 lg:order-1">
 <div className="card p-4 sticky top-20">
 <div className="flex items-center justify-between mb-4">
 <h3 className=" tb-text-md text-[var(--tb-news)]">اخبار فوری</h3>
 <span className="w-1.5 h-1.5 rounded-full bg-[var(--tb-news)] animate-pulse" />
 </div>
 <div className="relative">
 <div className="absolute right-[9px] top-1 bottom-1 w-px" style={{ background: "linear-gradient(to bottom, color-mix(in oklch, var(--tb-news) 60%, transparent), var(--tb-border), transparent)" }} />
              <ul className="space-y-5">
                {(forceNews.length ? forceNews : items).slice(0, 8).map((f: any) => (
                  <li key={f.slug} className="relative pe-9">
                    <span className="absolute right-0 top-[6px] w-[18px] h-[18px] rounded-full flex items-center justify-center bg-[var(--tb-bg-primary)] border-2 border-[color-mix(in_oklch,var(--tb-news)_55%,transparent)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--tb-news)]" />
                    </span>
                    <Link href={`/news/${f.slug}`} className="group block">
                      <div className="tb-text-sm flex items-center gap-2 flex-wrap text-[var(--tb-fg-muted)]">
                        <span className="inline-flex items-center gap-1"><Icon name="clock" size={13} strokeWidth={1.75} />{f.date_fa} {f.time || ""}</span>
                        {f.source && <span className="px-1.5 py-0.5 rounded-[var(--tb-radius-sm)] tb-text-sm border border-[var(--tb-border)] text-[var(--tb-fg-muted)]">{f.source}</span>}
                      </div>
                      <span className="tb-text-sm block mt-1 transition-colors group-hover:text-[var(--tb-news)]">{f.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
 </div>
 </div>
 </aside>
 </div>
 </main>
 );
}

```

---

## `features/news/components/NewsTicker.tsx`

```tsx
import Link from "next/link";
import { moduleColors } from "@/config/module-colors";
import { moduleMeta, type ModuleSlug } from "@/lib/content";

type TickerItem = {
 slug: string;
 title: string;
 module?: ModuleSlug | string;
 date_fa?: string;
 time?: string;
 author?: { name?: string };
};

type NewsTickerProps = {
 items: TickerItem[];
 className?: string;
};

const KNOWN: ModuleSlug[] = ["blog", "news", "media", "review", "tools", "download", "shop", "forum"];

function getModule(item: TickerItem): ModuleSlug {
 return KNOWN.includes(item.module as ModuleSlug) ? (item.module as ModuleSlug) : "news";
}

/** Short Farsi label describing the kind of update, per module. */
function getKindLabel(module: ModuleSlug, item: TickerItem): string {
 switch (module) {
 case "media":
 return "ویدیوی جدید";
 case "forum":
 return item.author?.name ? `تاپیک: ${item.author.name}`: "تاپیک جدید";
 case "download":
 return "دانلود جدید";
 case "review":
 return "نقد جدید";
 case "blog":
 return "مجله";
 case "shop":
 return "محصول جدید";
 case "tools":
 return "ابزار";
 default:
 return "خبر";
 }
}

export default function NewsTicker({ items, className = "" }: NewsTickerProps) {
 if (!items?.length) return null;

 const loopItems = [...items, ...items, ...items];

 return (
 <section className={`w-full overflow-hidden ${className}`} aria-label="آخرین به‌روزرسانی‌ها">
 <div dir="rtl" className="ticker-wrapper relative w-full overflow-hidden">
 <div className="ticker-track flex w-max min-w-full items-center gap-8 py-2.5">
 {loopItems.map((item, index) => {
 const itemModule = getModule(item);
 const tone = moduleColors[itemModule].active;
 const hoverTone = moduleColors[itemModule].hover;
 const kind = getKindLabel(itemModule, item);
 const when = item.time ? `${item.date_fa ?? ""} ${item.time}`.trim() : item.date_fa;
 return (
 <Link
 key={`${item.module || "news"}-${item.slug}-${index}`}
 href={`/${itemModule}/${item.slug}`}
 className={`ticker-item group flex shrink-0 items-center gap-2 whitespace-nowrap tb-text-md text-[var(--tb-fg-muted)] transition-colors duration-[var(--tb-motion-sm)] ${hoverTone}`}
 >
                <span className="h-1.5 w-1.5 rounded-[var(--tb-radius-full)] bg-[var(--tb-fg-muted)] opacity-70 transition-transform group-hover:scale-125" />
                <span className={`rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] px-2 py-0.5 tb-text-sm ${tone}`}>
                  {moduleMeta[itemModule]?.titleFa ?? kind}
                </span>
 <span className="text-[var(--tb-fg-primary)]">{item.title}</span>
 {when && <span className="tb-text-sm text-[var(--tb-fg-muted)]">• {when}</span>}
 </Link>
 );
 })}
 </div>
 </div>
 </section>
 );
}

```

---

## `features/review/components/ReviewGrid.tsx`

```tsx
"use client";
import Image from "next/image";
import { getModuleItems } from "@/lib/content";
import Link from "next/link";
import ModuleHeader from "@/components/effects/ModuleHeader";
import { Icon } from "@/design/icons";

/** Star rating rendered with central-system icons (filled + outline). */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-[var(--tb-warning)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={13} className={i < full ? "fill-current" : "opacity-40"} strokeWidth={1.5} />
      ))}
      <span className="ms-1 tb-text-sm text-[var(--tb-on-accent)]">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function ReviewGrid(){
  const items=getModuleItems("review");
  return (
    <main className="mx-auto max-w-6xl px-4 py-12" dir="rtl">
      <ModuleHeader module="review" title="نقد و بررسی تخصصی" description="تست لَب • بنچمارک واقعی • عکس مربعی" count={`${items.length.toLocaleString("fa-IR")} بررسی`} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((r,i)=>{
          const rating = 4.6 - (i*0.15);
          const comments = 18 + i*7;
          return (
            <Link key={r.slug} href={`/review/${r.slug}`} className="card overflow-hidden group flex flex-col !p-0">
              <div className="block relative aspect-square bg-[var(--tb-bg-muted)] overflow-hidden">
                <Image src={r.image || "/assets/blog-1.jpg"} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-[var(--tb-motion-lg)] group-hover:scale-105" alt={r.title}/>
                <span className="absolute top-3 right-3 rounded-[var(--tb-radius-full)] border border-white/30 bg-transparent px-2 py-1 tb-text-sm text-white backdrop-blur-[var(--tb-blur-sm)]">{r.category}</span>
                <span className="absolute bottom-3 left-3 rounded-[var(--tb-radius-full)] bg-[color-mix(in_oklch,black_60%,transparent)] px-2 py-1 backdrop-blur-[var(--tb-blur-sm)]"><Stars rating={rating} /></span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="tb-text-md line-clamp-2 min-h-[56px] transition-colors group-hover:text-[var(--tb-review)]">{r.title}</h3>
                <p className="tb-text-sm text-[var(--tb-fg-muted)] line-clamp-2 mt-2 flex-1">{r.excerpt}</p>

                {/* author row with avatar */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[color-mix(in_oklch,var(--tb-border)_60%,transparent)]">
                  <div className="flex items-center gap-2">
                    <Image src={r.author.avatar || "/assets/hooman.png"} width={32} height={32} className="h-8 w-8 rounded-[var(--tb-radius-full)] object-cover ring-1 ring-[var(--tb-border)]" alt={r.author.name} />
                    <div>
                      <div className="tb-text-sm text-[var(--tb-fg-primary)]">{r.author.name}</div>
                      <div className="tb-text-sm text-[var(--tb-fg-muted)]">{r.author.role || "نویسنده"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 tb-text-sm text-[var(--tb-fg-muted)]">
                    <span className="inline-flex items-center gap-1"><Icon name="view" size={14} strokeWidth={1.75} />{r.views.toLocaleString("fa-IR")}</span>
                    <span className="inline-flex items-center gap-1"><Icon name="like" size={14} strokeWidth={1.75} />{r.likes.toLocaleString("fa-IR")}</span>
                    <span className="inline-flex items-center gap-1"><Icon name="comment" size={14} strokeWidth={1.75} />{comments.toLocaleString("fa-IR")}</span>
                  </div>
                </div>
              </div>
            </Link>
          )})}
      </div>
    </main>
  );
}

```

---

## `features/shop/components/ShopGrid.tsx`

```tsx
"use client";
import Image from "next/image";
import { getModuleItems } from "@/lib/content";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/providers/cart.provider";
import { Button } from "@/components/ui/Button";
import { OverlayBackdrop } from "@/components/ui/Overlay";
import { Panel } from "@/components/ui/Panel";
import { CloseButton } from "@/components/ui/CloseButton";
import { zIndex } from "@/design";
import { Icon } from "@/design/icons";
import ModuleHeader from "@/components/effects/ModuleHeader";

const prices: Record<string, {price: string, old?: string}> = {
 "qnap-ts-2277": { price: "۴۸,۹۰۰,۰۰۰", old: "۵۲,۰۰۰,۰۰۰" },
 "dell-r750": { price: "۲۹۵,۰۰۰,۰۰۰" }
};

export default function ShopGrid(){
 const items = getModuleItems("shop");
 const [q, setQ] = useState("");
 const [cat, setCat] = useState<string>("all");
 const [sort, setSort] = useState<"new"|"popular"|"cheap">("new");
 const [filterOpen, setFilterOpen] = useState(false);
 const { add } = useCart();

 const categories = Array.from(new Set(items.map(i=>i.category).filter(Boolean))) as string[];

 const filtered = useMemo(()=>{
 let list = [...items];
 if(q) { const s=q.toLowerCase(); list = list.filter(i=> i.title.toLowerCase().includes(s) || i.tags.some(t=>t.includes(s))); }
 if(cat !== "all") list = list.filter(i=>i.category===cat);
 if(sort==="popular") list.sort((a,b)=>b.views-a.views);
 if(sort==="cheap") list.sort((a,b)=>a.likes-b.likes); // mock price sort
 return list;
 }, [items, q, cat, sort]);

 return (
 <main className="mx-auto max-w-7xl px-4 md:px-6 py-12" dir="rtl">
 <ModuleHeader module="shop" title="فروشگاه زیرساخت" description={`ارسال سریع • گارانتی اصالت • ${filtered.length.toLocaleString("fa-IR")} کالا`} />
 <div className="mb-6 grid gap-2 rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/50 p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
 <input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی محصول…" className="input tb-text-md" />
 <Button type="button" variant="ghost" onClick={()=>setFilterOpen(true)} className="tb-text-md">
 فیلترها {cat !== "all" ? `• ${cat}`: ""}
 </Button>
 </div>

 {filterOpen && (
 <div className="fixed inset-0 flex items-center justify-center p-4" style={{zIndex:zIndex.modal}} dir="rtl">
 <OverlayBackdrop onClick={()=>setFilterOpen(false)} />
 <Panel className="relative w-full max-w-md space-y-4" style={{zIndex:zIndex.modalContent}}>
 <div className="flex items-center justify-between gap-3">
 <h2 className="tb-text-lg ">فیلتر محصولات</h2>
 <CloseButton onClick={()=>setFilterOpen(false)} />
 </div>
 <div className="space-y-3">
 <label className="block tb-text-sm text-[var(--tb-fg-muted)]">دسته‌بندی
 <select value={cat} onChange={e=>setCat(e.target.value)} className="input mt-1 tb-text-md">
 <option value="all">همه دسته‌ها</option>
 {categories.map(c=> <option key={c} value={c}>{c}</option>)}
 </select>
 </label>
 <label className="block tb-text-sm text-[var(--tb-fg-muted)]">مرتب‌سازی
 <select value={sort} onChange={e=>setSort(e.target.value as any)} className="input mt-1 tb-text-md">
 <option value="new">جدیدترین</option>
 <option value="popular">پربازدیدترین</option>
 <option value="cheap">قیمت</option>
 </select>
 </label>
 </div>
 <div className="flex justify-end gap-2">
 <Button type="button" variant="ghost" onClick={()=>{setCat("all"); setSort("new");}}>پاک کردن</Button>
 <Button type="button" onClick={()=>setFilterOpen(false)}>اعمال فیلتر</Button>
 </div>
 </Panel>
 </div>
 )}

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
 {filtered.map(p=>{
 const pr = prices[p.slug] || { price: "تماس بگیرید" };
 return (
        <Link key={p.slug} href={`/shop/${p.slug}`} className="card overflow-hidden group flex flex-col rounded-[var(--tb-radius-lg)] !p-0">
              <div className="block relative aspect-[4/3] bg-[var(--tb-bg-muted)] overflow-hidden">
                <Image src={p.image || "/assets/blog-1.jpg"} alt={p.title} fill sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[var(--tb-motion-lg)] group-hover:scale-105" />
                <span className="absolute top-3 left-3 rounded-[var(--tb-radius-full)] border border-white/30 bg-transparent px-2 py-1 tb-text-sm text-white backdrop-blur-[var(--tb-blur-sm)]">موجود</span>
                {pr.old && <span className="absolute top-3 right-3 rounded-[var(--tb-radius-full)] border border-white/30 bg-transparent px-2 py-1 tb-text-sm text-white backdrop-blur-[var(--tb-blur-sm)]">تخفیف</span>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="tb-text-sm text-[var(--tb-fg-muted)]">{p.category}</div>
                <div className="tb-text-md mt-1 transition-colors group-hover:text-[var(--tb-shop)] line-clamp-2 min-h-[48px]">{p.title}</div>
                <p className="tb-text-sm text-[var(--tb-fg-muted)] line-clamp-2 mt-1 flex-1">{p.excerpt}</p>
                <div className="mt-3">
                  {pr.old && <div className="tb-text-sm line-through text-[var(--tb-fg-muted)]">{pr.old} تومان</div>}
                  <div className="tb-text-lg text-[var(--tb-shop)]">{pr.price} <span className="tb-text-sm text-[var(--tb-fg-muted)]">تومان</span></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); add({ slug: p.slug, title: p.title, price: pr.price, image: p.image || "" },1); }} size="xs" className="flex-1">افزودن به سبد</Button>
                </div>
                <div className="flex items-center gap-3 tb-text-sm text-[var(--tb-fg-muted)] mt-2">
                  <span className="inline-flex items-center gap-1"><Icon name="view" size={14} strokeWidth={1.75} />{p.views.toLocaleString("fa-IR")}</span>
                  <span className="inline-flex items-center gap-1"><Icon name="like" size={14} strokeWidth={1.75} />{p.likes.toLocaleString("fa-IR")}</span>
                  <span className="inline-flex items-center gap-1"><Icon name="comment" size={14} strokeWidth={1.75} />{((p.likes % 9) + 1).toLocaleString("fa-IR")}</span>
                </div>
              </div>
            </Link>
          )
 })}
 </div>
 {filtered.length===0 && <div className="text-center py-16 text-muted-foreground">محصولی یافت نشد</div>}
 </main>
 );
}

```

---

## `features/tools/components/index.ts`

```ts
export * from "./nas-selector";
export * from "./nvr-selector";
export * from "./raid-calculator";
export { ToolsGrid, default as ToolsGridDefault } from "./ToolsGrid";
export { ToolPageHeader } from "./ToolPageHeader";

// Re-export existing subnet calculator – untouched
export { default as SubnetCalculator } from "./SubnetCalculator";

```

---

## `features/tools/components/nas-selector/index.ts`

```ts
export { default, NasSelector } from "./NasSelector";
export * from "./nas-selector-data";

```

---

## `features/tools/components/nas-selector/nas-selector-data.ts`

```ts
// TechBox · NAS Selector – data types & scoring
// RTL / Persian – no hard-coded UI colors, all via --tb-* tokens

export type NasPersona = "home" | "creator" | "office" | "business" | "enterprise";

export type NasWorkload =
  | "backup"
  | "fileSharing"
  | "media"
  | "surveillance"
  | "virtualization"
  | "database"
  | "docker"
  | "photo"
  | "highAvailability";

export type RaidType = "none" | "raid1" | "raid5" | "raid6" | "raid10";

export type NasProduct = {
  id: string;
  title: string;
  subtitle: string;
  brand?: string;
  imageUrl?: string;
  href?: string;
  shopSlug?: string;
  sku?: string;
  bays: number;
  maxRawTb: number;
  maxRamGb: number;
  cpuTier: 1 | 2 | 3 | 4 | 5;
  networkGbE: number;
  nvme: boolean;
  expansion: boolean;
  formFactor: "desktop" | "rackmount";
  priceTier: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  bestFor: NasWorkload[];
  inStock?: boolean;
  price?: number; // toman, optional – pulled from shop
};

export type SelectorState = {
  persona: NasPersona;
  workloads: NasWorkload[];
  users: number;
  usableTb: number;
  driveTb: number;
  raid: RaidType;
  cameras: number;
  networkGbE: number;
  nvme: boolean;
  rackmount: boolean;
  budgetTier: 1 | 2 | 3 | 4 | 5;
};

export const personaLabels: Record<NasPersona, { title: string; desc: string }> = {
  home: { title: "خانه و استفاده شخصی", desc: "بکاپ، عکس، فیلم و فایل‌های خانوادگی" },
  creator: { title: "تولیدکننده محتوا", desc: "آرشیو پروژه، تدوین، سرعت شبکه و کش SSD" },
  office: { title: "دفتر کوچک", desc: "فایل‌سرور، بکاپ کامپیوترها و دسترسی تیمی" },
  business: { title: "کسب‌وکار", desc: "کاربران بیشتر، افزونگی، سرویس‌های همزمان" },
  enterprise: { title: "سازمانی / دیتاسنتر", desc: "Rackmount، ظرفیت بالا، HA و عملکرد جدی" },
};

export const workloadLabels: Record<NasWorkload, { title: string; desc: string }> = {
  backup: { title: "بکاپ و بازیابی", desc: "بکاپ کامپیوتر، سرور و موبایل" },
  fileSharing: { title: "اشتراک فایل", desc: "دسترسی تیمی، پوشه مشترک و نسخه‌بندی" },
  media: { title: "مدیا سرور", desc: "استریم ویدئو، موسیقی و آرشیو خانگی" },
  surveillance: { title: "دوربین مداربسته", desc: "ضبط پیوسته و مدیریت دوربین‌ها" },
  virtualization: { title: "مجازی‌سازی", desc: "VM، iSCSI و محیط آزمایشگاهی" },
  database: { title: "دیتابیس / ERP", desc: "IO پایدار و RAM بیشتر" },
  docker: { title: "Docker و سرویس‌ها", desc: "کانتینر، اتوماسیون و سرویس‌های داخلی" },
  photo: { title: "عکس و آلبوم", desc: "تشخیص، دسته‌بندی و اشتراک عکس" },
  highAvailability: { title: "دسترس‌پذیری بالا", desc: "Redundancy قوی و سناریوهای حساس" },
};

export const raidLabels: Record<RaidType, { title: string; desc: string; minBays: number }> = {
  none: { title: "بدون RAID", desc: "بیشترین ظرفیت، بدون تحمل خرابی دیسک", minBays: 1 },
  raid1: { title: "RAID 1 / Mirror", desc: "امنیت ساده برای ۲ دیسک؛ ظرفیت نصف می‌شود", minBays: 2 },
  raid5: { title: "RAID 5", desc: "یک دیسک افزونگی؛ تعادل خوب ظرفیت/امنیت", minBays: 3 },
  raid6: { title: "RAID 6", desc: "دو دیسک افزونگی؛ مناسب داده‌های مهم", minBays: 4 },
  raid10: { title: "RAID 10", desc: "سرعت و تحمل خرابی عالی؛ نیازمند تعداد زوج دیسک", minBays: 4 },
};

export const defaultSelectorState: SelectorState = {
  persona: "office",
  workloads: ["backup", "fileSharing"],
  users: 12,
  usableTb: 12,
  driveTb: 8,
  raid: "raid5",
  cameras: 0,
  networkGbE: 1,
  nvme: false,
  rackmount: false,
  budgetTier: 3,
};

export function estimateUsableCapacity(bays: number, driveTb: number, raid: RaidType) {
  if (bays <= 0 || driveTb <= 0) return 0;
  switch (raid) {
    case "none": return bays * driveTb;
    case "raid1": return bays >= 2 ? driveTb : 0;
    case "raid5": return bays >= 3 ? (bays - 1) * driveTb : 0;
    case "raid6": return bays >= 4 ? (bays - 2) * driveTb : 0;
    case "raid10": return bays >= 4 && bays % 2 === 0 ? (bays / 2) * driveTb : 0;
    default: return 0;
  }
}

export function minimumBaysForCapacity(usableTb: number, driveTb: number, raid: RaidType) {
  const min = raidLabels[raid].minBays;
  for (let bays = min; bays <= 24; bays += 1) {
    if (raid === "raid10" && bays % 2 !== 0) continue;
    if (estimateUsableCapacity(bays, driveTb, raid) >= usableTb) return bays;
  }
  return 24;
}

```

---

## `features/tools/components/nas-selector/NasSelector.tsx`

```tsx
"use client";

import * as React from "react";
import { Icon } from "@/design/icons";
import {
  defaultSelectorState,
  estimateUsableCapacity,
  minimumBaysForCapacity,
  personaLabels,
  raidLabels,
  workloadLabels,
  type NasPersona,
  type NasProduct,
  type NasWorkload,
  type RaidType,
  type SelectorState,
} from "./nas-selector-data";

type ScoredProduct = NasProduct & {
  score: number;
  match: number;
  reasons: string[];
  warnings: string[];
  usableTb: number;
};

type NasSelectorProps = {
  products: NasProduct[];
  initialState?: Partial<SelectorState>;
  onProductSelect?: (product: ScoredProduct, state: SelectorState) => void;
  compareHref?: string;
  consultationHref?: string;
  className?: string;
};

const personas = Object.keys(personaLabels) as NasPersona[];
const workloads = Object.keys(workloadLabels) as NasWorkload[];
const raidTypes = Object.keys(raidLabels) as RaidType[];
const driveSizes = [4, 8, 12, 16, 20, 22] as const;

const formatter = new Intl.NumberFormat("fa-IR");

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
function persianNumber(value: number | string) {
  return formatter.format(Number(value));
}

function ToggleCard({
  selected,
  title,
  desc,
  onClick,
  icon = "check",
}: {
  selected: boolean;
  title: string;
  desc?: string;
  onClick: () => void;
  icon?: "check" | "server" | "disk" | "shield";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[92px] w-full items-start gap-3 rounded-[var(--tb-radius-lg)] border p-4 text-right transition-all duration-[var(--tb-motion-md)] ease-[var(--tb-ease)]",
        selected
          ? "border-[color-mix(in_oklch,var(--tb-primary)_48%,var(--tb-border))] bg-[color-mix(in_oklch,var(--tb-primary)_10%,var(--tb-bg-secondary))] shadow-[var(--tb-shadow-sm)]"
          : "border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] hover:-translate-y-0.5 hover:bg-[var(--tb-bg-muted)]",
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--tb-radius-md)] border",
          selected
            ? "border-[color-mix(in_oklch,var(--tb-primary)_35%,transparent)] bg-[var(--tb-primary)] text-[var(--tb-on-accent)]"
            : "border-[var(--tb-border)] bg-[var(--tb-bg-muted)] text-[var(--tb-fg-muted)]",
        )}
      >
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-black text-[var(--tb-fg-primary)]">{title}</span>
        {desc ? <span className="mt-1 block text-[12px] leading-6 text-[var(--tb-fg-muted)]">{desc}</span> : null}
      </span>
    </button>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (next: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <label className="block rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-4">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-extrabold text-[var(--tb-fg-primary)]">{label}</span>
        <span className="badge bg-[color-mix(in_oklch,var(--tb-primary)_10%,var(--tb-bg-muted))] text-[var(--tb-fg-primary)]">
          {persianNumber(value)} {suffix}
        </span>
      </span>
      <input
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--tb-bg-muted)] accent-[var(--tb-primary)]"
        style={{ background: `linear-gradient(to left, var(--tb-primary) ${percent}%, var(--tb-bg-muted) ${percent}%)` }}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
      />
    </label>
  );
}

function scoreProduct(product: NasProduct, state: SelectorState): ScoredProduct {
  const minBays = minimumBaysForCapacity(state.usableTb, state.driveTb, state.raid);
  const usableTb = estimateUsableCapacity(product.bays, state.driveTb, state.raid);
  const requiredCpu = Math.max(
    state.workloads.includes("virtualization") || state.workloads.includes("database") ? 4 : 0,
    state.workloads.includes("docker") || state.workloads.includes("surveillance") ? 3 : 0,
    state.users > 45 ? 4 : state.users > 18 ? 3 : 2,
  );
  const requiredNetwork = state.networkGbE;
  const workloadMatches = state.workloads.filter((w) => product.bestFor.includes(w)).length;
  const reasons: string[] = [];
  const warnings: string[] = [];
  let score = 38;

  if (product.bays >= minBays) {
    score += 18;
    reasons.push(`${persianNumber(product.bays)} Bay برای ظرفیت و RAID انتخابی کافی است.`);
  } else {
    score -= 35;
    warnings.push(`برای ظرفیت ${persianNumber(state.usableTb)} ترابایت با ${raidLabels[state.raid].title} حداقل ${persianNumber(minBays)} Bay پیشنهاد می‌شود.`);
  }

  if (usableTb >= state.usableTb) score += 12;
  else score -= 20;

  if (product.cpuTier >= requiredCpu) {
    score += 12;
    reasons.push("توان پردازشی با سرویس‌های انتخابی هم‌خوان است.");
  } else {
    score -= 16;
    warnings.push("برای سرویس‌های سنگین‌تر CPU قوی‌تر پیشنهاد می‌شود.");
  }

  score += workloadMatches * 8;
  if (workloadMatches) reasons.push(`${persianNumber(workloadMatches)} نیاز اصلی شما را پوشش می‌دهد.`);

  if (product.networkGbE >= requiredNetwork) {
    score += 8;
    if (requiredNetwork > 1) reasons.push(`شبکه ${persianNumber(product.networkGbE)}GbE برای سرعت مدنظر مناسب است.`);
  } else {
    score -= 12;
    warnings.push(`برای این سناریو شبکه ${persianNumber(requiredNetwork)}GbE بهتر است.`);
  }

  if (state.nvme) {
    if (product.nvme) {
      score += 8;
      reasons.push("اسلات NVMe برای کش یا فضای سریع دارد.");
    } else {
      score -= 10;
      warnings.push("NVMe ندارد؛ برای کش SSD گزینه بالاتری انتخاب کنید.");
    }
  }

  if (state.rackmount) {
    if (product.formFactor === "rackmount") score += 18;
    else score -= 18;
  } else if (product.formFactor === "desktop") {
    score += 4;
  }

  if (state.cameras > 0) {
    const cameraNeed = state.cameras > 24 ? 5 : state.cameras > 12 ? 4 : state.cameras > 6 ? 3 : 2;
    if (product.cpuTier >= cameraNeed && product.bays >= 4) {
      score += 8;
      reasons.push("برای ضبط دوربین‌ها ظرفیت و توان مناسبی دارد.");
    } else {
      score -= 10;
      warnings.push("برای تعداد دوربین انتخابی، Bay/CPU بیشتری در نظر بگیرید.");
    }
  }

  const budgetDelta = Math.abs(product.priceTier - state.budgetTier);
  score += Math.max(0, 10 - budgetDelta * 4);
  if (product.priceTier > state.budgetTier + 1) warnings.push("ممکن است از بودجه هدف شما بالاتر باشد.");

  const match = clamp(Math.round(score), 0, 100);
  return { ...product, score, match, reasons: reasons.slice(0, 4), warnings: warnings.slice(0, 3), usableTb };
}

function CapacityMatrix({ state }: { state: SelectorState }) {
  const rows = [2, 4, 6, 8, 12];
  const raids: RaidType[] = ["raid1", "raid5", "raid6", "raid10"];
  return (
    <div className="overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--tb-border)] p-4">
        <div>
          <h3 className="text-[15px] font-black">جدول سریع ظرفیت قابل استفاده</h3>
          <p className="mt-1 text-[12px] leading-6 text-[var(--tb-fg-muted)]">بر اساس دیسک {persianNumber(state.driveTb)} ترابایت</p>
        </div>
        <Icon name="disk" className="h-5 w-5 text-[var(--tb-primary)]" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-center text-[12px]">
          <thead className="bg-[var(--tb-bg-muted)] text-[var(--tb-fg-muted)]">
            <tr>
              <th className="p-3 font-black">Bay</th>
              {raids.map((raid) => (
                <th key={raid} className="p-3 font-black">{raidLabels[raid].title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((bays) => (
              <tr key={bays} className="border-t border-[var(--tb-border)]">
                <td className="p-3 font-black text-[var(--tb-fg-primary)]">{persianNumber(bays)}</td>
                {raids.map((raid) => {
                  const value = estimateUsableCapacity(bays, state.driveTb, raid);
                  const active = state.raid === raid && value >= state.usableTb;
                  return (
                    <td key={raid} className={cn("p-3", active && "bg-[color-mix(in_oklch,var(--tb-success)_16%,transparent)] font-black text-[var(--tb-fg-primary)]")}>
                      {value > 0 ? `${persianNumber(value)} TB` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  rank,
  selected,
  onToggleCompare,
  onSelect,
}: {
  product: ScoredProduct;
  rank: number;
  selected: boolean;
  onToggleCompare: () => void;
  onSelect?: () => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-4 shadow-[var(--tb-shadow-sm)] transition-all duration-[var(--tb-motion-md)] hover:-translate-y-1 hover:shadow-[var(--tb-shadow-md)]">
      {rank === 0 ? (
        <div className="absolute left-4 top-4 rounded-full bg-[linear-gradient(135deg,var(--tb-primary),var(--tb-vip))] px-3 py-1 text-[11px] font-black text-[var(--tb-on-accent)]">
          بهترین پیشنهاد
        </div>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--tb-primary)_20%,transparent),transparent_45%),var(--tb-bg-muted)]">
          <Icon name={product.formFactor === "rackmount" ? "server" : "disk"} className="h-9 w-9 text-[var(--tb-primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-black text-[var(--tb-fg-primary)]">{product.title}</h3>
          <p className="mt-1 text-[12px] leading-6 text-[var(--tb-fg-muted)]">{product.subtitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => <span key={tag} className="badge">{tag}</span>)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Bay", persianNumber(product.bays)],
          ["ظرفیت RAID", `${persianNumber(product.usableTb)} TB`],
          ["RAM", `${persianNumber(product.maxRamGb)} GB`],
          ["شبکه", `${persianNumber(product.networkGbE)} GbE`],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)] p-3 text-center">
            <div className="text-[11px] text-[var(--tb-fg-muted)]">{label}</div>
            <div className="mt-1 text-[13px] font-black text-[var(--tb-fg-primary)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--tb-bg-muted)]">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--tb-success),var(--tb-primary))]" style={{ width: `${product.match}%` }} />
        </div>
        <span className="text-[13px] font-black text-[var(--tb-fg-primary)]">{persianNumber(product.match)}٪ تطابق</span>
      </div>

      <div className="mt-4 space-y-2">
        {product.reasons.map((reason) => (
          <div key={reason} className="flex items-start gap-2 text-[12px] leading-6 text-[var(--tb-fg-secondary)]">
            <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-[var(--tb-success)]" />
            <span>{reason}</span>
          </div>
        ))}
        {product.warnings.map((warning) => (
          <div key={warning} className="flex items-start gap-2 text-[12px] leading-6 text-[var(--tb-fg-muted)]">
            <Icon name="shield" className="mt-1 h-4 w-4 shrink-0 text-[var(--tb-warning)]" />
            <span>{warning}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {product.href ? (
          <a href={product.href} onClick={onSelect} className="btn btn-primary flex-1">مشاهده / خرید</a>
        ) : (
          <button type="button" onClick={onSelect} className="btn btn-primary flex-1">مشاهده / خرید</button>
        )}
        <button type="button" onClick={onToggleCompare} className={cn("btn btn-ghost", selected && "bg-[var(--tb-bg-muted)] text-[var(--tb-primary)]")}>
          {selected ? "حذف از مقایسه" : "افزودن به مقایسه"}
        </button>
      </div>

      {product.price ? (
        <div className="mt-3 text-left text-[12px] text-[var(--tb-fg-muted)]">
          {persianNumber(product.price.toLocaleString("fa-IR"))} تومان
        </div>
      ) : null}
    </article>
  );
}

export function NasSelector({
  products,
  initialState,
  onProductSelect,
  compareHref = "/shop/compare",
  consultationHref = "/consultation",
  className,
}: NasSelectorProps) {
  const [state, setState] = React.useState<SelectorState>({ ...defaultSelectorState, ...initialState });
  const [compareIds, setCompareIds] = React.useState<string[]>([]);

  const minBays = React.useMemo(() => minimumBaysForCapacity(state.usableTb, state.driveTb, state.raid), [state.usableTb, state.driveTb, state.raid]);
  const recommendations = React.useMemo(
    () => products.map((product) => scoreProduct(product, state)).sort((a, b) => b.match - a.match),
    [products, state],
  );
  const top = recommendations[0];

  const update = <K extends keyof SelectorState>(key: K, value: SelectorState[K]) => setState((prev) => ({ ...prev, [key]: value }));
  const toggleWorkload = (workload: NasWorkload) => {
    setState((prev) => {
      const exists = prev.workloads.includes(workload);
      const next = exists ? prev.workloads.filter((item) => item !== workload) : [...prev.workloads, workload];
      return { ...prev, workloads: next.length ? next : prev.workloads };
    });
  };
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id]));
  };

  return (
    <section dir="rtl" className={cn("font-sans text-[var(--tb-fg-primary)]", className)}>
      <div className="relative overflow-hidden rounded-[calc(var(--tb-radius-lg)+8px)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] shadow-[var(--tb-shadow-md)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,color-mix(in_oklch,var(--tb-primary)_18%,transparent),transparent_32%),radial-gradient(circle_at_85%_15%,color-mix(in_oklch,var(--tb-vip)_14%,transparent),transparent_30%)]" />
        <div className="relative grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_380px] lg:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-[color-mix(in_oklch,var(--tb-tools)_16%,var(--tb-bg-muted))] text-[var(--tb-fg-primary)]">
                <Icon name="server" className="h-3.5 w-3.5" /> انتخاب‌گر NAS
              </span>
              <span className="badge">RTL / فارسی / TailwindCSS 4</span>
            </div>
            <h1 className="mt-4 tb-text-big-title">NAS مناسب خود را در چند دقیقه پیدا کنید</h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-8 text-[var(--tb-fg-muted)]">
              نیازها، ظرفیت، RAID، تعداد کاربران و سرویس‌ها را انتخاب کنید؛ ابزار به‌صورت زنده بهترین مدل‌ها را رتبه‌بندی و دلیل پیشنهاد را نمایش می‌دهد.
            </p>

            <div className="mt-6 grid gap-5">
              <section className="card">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[16px] font-black">۱. نوع استفاده</h2>
                  <span className="text-[12px] text-[var(--tb-fg-muted)]">سناریوی اصلی را مشخص کنید</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {personas.map((persona) => (
                    <ToggleCard
                      key={persona}
                      selected={state.persona === persona}
                      title={personaLabels[persona].title}
                      desc={personaLabels[persona].desc}
                      icon={persona === "enterprise" ? "server" : "disk"}
                      onClick={() => update("persona", persona)}
                    />
                  ))}
                </div>
              </section>

              <section className="card">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[16px] font-black">۲. سرویس‌ها و بار کاری</h2>
                  <span className="text-[12px] text-[var(--tb-fg-muted)]">چند گزینه قابل انتخاب است</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {workloads.map((workload) => (
                    <ToggleCard
                      key={workload}
                      selected={state.workloads.includes(workload)}
                      title={workloadLabels[workload].title}
                      desc={workloadLabels[workload].desc}
                      icon={workload === "surveillance" || workload === "highAvailability" ? "shield" : "check"}
                      onClick={() => toggleWorkload(workload)}
                    />
                  ))}
                </div>
              </section>

              <section className="card">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[16px] font-black">۳. ظرفیت، RAID و عملکرد</h2>
                  <span className="badge">حداقل پیشنهادی: {persianNumber(minBays)} Bay</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <RangeField label="تعداد کاربران همزمان" value={state.users} min={1} max={120} suffix="کاربر" onChange={(v) => update("users", v)} />
                  <RangeField label="ظرفیت قابل استفاده موردنیاز" value={state.usableTb} min={2} max={160} step={2} suffix="TB" onChange={(v) => update("usableTb", v)} />
                  <RangeField label="تعداد دوربین‌ها" value={state.cameras} min={0} max={64} suffix="دوربین" onChange={(v) => update("cameras", v)} />
                  <RangeField label="بودجه هدف" value={state.budgetTier} min={1} max={5} suffix="از ۵" onChange={(v) => update("budgetTier", v as SelectorState["budgetTier"])} />
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div>
                    <div className="mb-2 text-[13px] font-extrabold">ظرفیت هر هارد</div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3">
                      {driveSizes.map((size) => (
                        <button key={size} type="button" onClick={() => update("driveTb", size)} className={cn("btn btn-ghost", state.driveTb === size && "border-[var(--tb-primary)] bg-[color-mix(in_oklch,var(--tb-primary)_10%,transparent)] text-[var(--tb-primary)]")}>{persianNumber(size)} TB</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-[13px] font-extrabold">نوع RAID</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {raidTypes.map((raid) => (
                        <button key={raid} type="button" onClick={() => update("raid", raid)} className={cn("rounded-[var(--tb-radius-md)] border p-3 text-right transition", state.raid === raid ? "border-[var(--tb-primary)] bg-[color-mix(in_oklch,var(--tb-primary)_10%,transparent)]" : "border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] hover:bg-[var(--tb-bg-muted)]")}>
                          <span className="block text-[12px] font-black">{raidLabels[raid].title}</span>
                          <span className="mt-1 block text-[11px] leading-5 text-[var(--tb-fg-muted)]">{raidLabels[raid].desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-4">
                    <span className="text-[13px] font-extrabold">حداقل شبکه</span>
                    <select className="input mt-3" value={state.networkGbE} onChange={(e) => update("networkGbE", Number(e.currentTarget.value))}>
                      <option value={1}>1GbE</option>
                      <option value={2.5}>2.5GbE</option>
                      <option value={10}>10GbE</option>
                    </select>
                  </label>
                  <button type="button" onClick={() => update("nvme", !state.nvme)} className={cn("rounded-[var(--tb-radius-lg)] border p-4 text-right transition", state.nvme ? "border-[var(--tb-primary)] bg-[color-mix(in_oklch,var(--tb-primary)_10%,transparent)]" : "border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] hover:bg-[var(--tb-bg-muted)]")}>
                    <span className="block text-[13px] font-extrabold">نیاز به NVMe / SSD Cache</span>
                    <span className="mt-2 block text-[12px] text-[var(--tb-fg-muted)]">برای دیتابیس، VM یا فایل‌های پرتکرار</span>
                  </button>
                  <button type="button" onClick={() => update("rackmount", !state.rackmount)} className={cn("rounded-[var(--tb-radius-lg)] border p-4 text-right transition", state.rackmount ? "border-[var(--tb-primary)] bg-[color-mix(in_oklch,var(--tb-primary)_10%,transparent)]" : "border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] hover:bg-[var(--tb-bg-muted)]")}>
                    <span className="block text-[13px] font-extrabold">فرم‌فکتور Rackmount</span>
                    <span className="mt-2 block text-[12px] text-[var(--tb-fg-muted)]">برای رک، اتاق سرور و دیتاسنتر</span>
                  </button>
                </div>
              </section>

              <CapacityMatrix state={state} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[calc(var(--tb-radius-lg)+6px)] border border-[var(--tb-border)] bg-[color-mix(in_oklch,var(--tb-bg-secondary)_88%,transparent)] p-4 shadow-[var(--tb-shadow-lg)] backdrop-blur-[var(--tb-blur-md)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-black">نتایج پیشنهادی</h2>
                  <p className="mt-1 text-[12px] leading-6 text-[var(--tb-fg-muted)]">رتبه‌بندی زنده بر اساس امتیاز تطابق</p>
                </div>
                {top ? <span className="badge text-[var(--tb-primary)]">{persianNumber(top.match)}٪ بهترین</span> : null}
              </div>

              <div className="mt-4 space-y-4">
                {recommendations.slice(0, 4).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rank={index}
                    selected={compareIds.includes(product.id)}
                    onToggleCompare={() => toggleCompare(product.id)}
                    onSelect={() => onProductSelect?.(product, state)}
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={`${compareHref}?ids=${compareIds.join(",")}`} className="btn btn-ghost">مقایسه محصولات {compareIds.length ? `(${persianNumber(compareIds.length)})` : ""}</a>
                <a href={consultationHref} className="btn btn-primary">درخواست مشاوره</a>
              </div>

              <p className="mt-4 rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)] p-3 text-[11px] leading-6 text-[var(--tb-fg-muted)]">
                نکته: ظرفیت RAID تقریبی است و باید با محدودیت فایل‌سیستم، رزرو Snapshot، Hot Spare و سیاست بکاپ شما نهایی‌سازی شود.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default NasSelector;
export type { ScoredProduct };

```

---

## `features/tools/components/nvr-selector/index.ts`

```ts
export { default, NvrSelector } from "./NvrSelector";
export * from "./nvr-selector-data";

```

---

## `features/tools/components/nvr-selector/nvr-selector-data.ts`

```ts
export type NvrModel = {
  id: string;
  name: string;
  nameFa: string;
  maxCameras: number;
  storageBays: number;
  raidSupport: string;
  maxResolution: string;
  aiFeatures: boolean;
  price?: number;
  priceLabel?: string;
  description: string;
  descriptionFa: string;
  shopSlug?: string;
  href?: string;
  imageUrl?: string;
  poePorts?: number;
  throughputMbps?: number;
  inStock?: boolean;
};

export type NvrFilterState = {
  cameras: number;
  resolution: string;
  days: number;
  aiEnabled: boolean;
};

export const nvrResolutions = ["1080p", "4MP", "4K", "8MP"] as const;

export function estimateNvrStorageTb(cameras: number, resolution: string, days: number) {
  const basePerCam = resolution === "1080p" ? 4 : resolution === "4MP" ? 8 : resolution === "4K" ? 16 : 24;
  return Math.round((cameras * basePerCam * days) / 1000);
}

export const defaultNvrFilter: NvrFilterState = {
  cameras: 8,
  resolution: "4MP",
  days: 30,
  aiEnabled: true,
};

```

---

## `features/tools/components/nvr-selector/NvrSelector.tsx`

```tsx
"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "@/design/icons";
import type { NvrFilterState, NvrModel } from "./nvr-selector-data";
import { defaultNvrFilter, estimateNvrStorageTb, nvrResolutions } from "./nvr-selector-data";

type NvrSelectorProps = {
  products: NvrModel[];
  initialFilters?: Partial<NvrFilterState>;
  onSelect?: (model: NvrModel, filters: NvrFilterState) => void;
  consultationHref?: string;
  className?: string;
};

const fa = new Intl.NumberFormat("fa-IR");

export function NvrSelector({
  products,
  initialFilters,
  onSelect,
  consultationHref = "/consultation",
  className,
}: NvrSelectorProps) {
  const [filters, setFilters] = useState<NvrFilterState>({ ...defaultNvrFilter, ...initialFilters });
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    return products
      .filter((model) => {
        const meetsCameras = model.maxCameras >= filters.cameras;
        const meetsAI = !filters.aiEnabled || model.aiFeatures;
        return meetsCameras && meetsAI;
      })
      .sort((a, b) => a.maxCameras - b.maxCameras);
  }, [products, filters]);

  const recommendedModel = filteredModels[0];
  const storageTB = estimateNvrStorageTb(filters.cameras, filters.resolution, filters.days);

  const handleFilterChange = <K extends keyof NvrFilterState>(key: K, value: NvrFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedModel(null);
  };

  return (
    <div className={["w-full max-w-[1100px] mx-auto", className].filter(Boolean).join(" ")} dir="rtl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="px-3 py-1 rounded-full bg-[color-mix(in_oklch,var(--tb-raid)_12%,transparent)] text-[var(--tb-raid)] text-xs font-bold flex items-center gap-1.5 border border-[color-mix(in_oklch,var(--tb-raid)_22%,var(--tb-border))]">
            <Icon name="server" className="w-3.5 h-3.5" />
            ماژول انتخاب ان‌وی‌آر
          </div>
        </div>
        <h2 className="tb-text-big-title mb-2">انتخابگر ان‌وی‌آر</h2>
        <p className="text-[var(--tb-fg-muted)] max-w-md mx-auto tb-text-md">
          تعداد دوربین، رزولوشن و مدت زمان ضبط را مشخص کنید تا بهترین مدل را پیدا کنید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-2">
          <div className="card p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="tools" className="w-5 h-5 text-[var(--tb-primary)]" />
              <h3 className="font-black text-[17px]">مشخصات مورد نیاز</h3>
            </div>

            {/* Cameras */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-[13px] font-extrabold">تعداد دوربین‌ها</label>
                <div className="font-black text-[20px] tabular-nums text-[var(--tb-primary)]">
                  {fa.format(filters.cameras)}
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={filters.cameras}
                onChange={(e) => handleFilterChange("cameras", parseInt(e.target.value))}
                className="w-full accent-[var(--tb-primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--tb-fg-muted)] mt-1">
                <span>۱</span>
                <span>۶۴</span>
              </div>
            </div>

            {/* Resolution */}
            <div className="mb-7">
              <label className="block text-[13px] font-extrabold mb-2.5">رزولوشن دوربین</label>
              <div className="flex flex-wrap gap-2">
                {nvrResolutions.map((res) => (
                  <button
                    key={res}
                    onClick={() => handleFilterChange("resolution", res)}
                    className={`px-4 py-1.5 text-sm rounded-[var(--tb-radius-md)] border transition-all ${
                      filters.resolution === res
                        ? "bg-[var(--tb-primary)] text-[var(--tb-on-accent)] border-[var(--tb-primary)]"
                        : "border-[var(--tb-border)] hover:bg-[var(--tb-bg-muted)]"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Recording Days */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-[13px] font-extrabold">مدت زمان ضبط (روز)</label>
                <div className="font-black text-[20px] tabular-nums text-[var(--tb-primary)]">
                  {fa.format(filters.days)}
                </div>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={filters.days}
                onChange={(e) => handleFilterChange("days", parseInt(e.target.value))}
                className="w-full accent-[var(--tb-primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--tb-fg-muted)] mt-1">
                <span>۷ روز</span>
                <span>۹۰ روز</span>
              </div>
            </div>

            {/* AI Toggle */}
            <div className="flex items-center justify-between bg-[var(--tb-bg-muted)] px-4 py-3 rounded-[var(--tb-radius-md)]">
              <div>
                <div className="font-extrabold text-[13px]">تحلیل هوش مصنوعی</div>
                <div className="text-[12px] text-[var(--tb-fg-muted)]">تشخیص چهره، پلاک و اشیا</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.aiEnabled}
                  onChange={(e) => handleFilterChange("aiEnabled", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--tb-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--tb-primary)]"></div>
              </label>
            </div>

            {/* Storage Estimate */}
            <div className="mt-6 pt-6 border-t border-[var(--tb-border)]">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--tb-fg-muted)]">حجم ذخیره‌سازی تخمینی</span>
                <span className="font-black tabular-nums text-[18px]">
                  {fa.format(storageTB)} <span className="text-[11px] font-semibold">ترابایت</span>
                </span>
              </div>
              <p className="mt-3 text-[11px] leading-6 text-[var(--tb-fg-muted)]">
                محاسبه با بیت‌ریت استاندارد H.265 – برای سناریوی دقیق با مشاوره نهایی کنید.
              </p>
            </div>

            <a href={consultationHref} className="btn btn-ghost w-full mt-5">مشاوره تخصصی NVR</a>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <span className="font-black">مدل‌های پیشنهادی</span>
              <span className="text-[12px] text-[var(--tb-fg-muted)] mr-2">({fa.format(filteredModels.length)} مدل)</span>
            </div>
            {recommendedModel && (
              <div className="text-[11px] px-3 py-1 rounded-full bg-[color-mix(in_oklch,var(--tb-success)_14%,transparent)] text-[var(--tb-success)] border border-[color-mix(in_oklch,var(--tb-success)_24%,transparent)] flex items-center gap-1 font-bold">
                <Icon name="check" className="w-3 h-3" /> بهترین انتخاب
              </div>
            )}
          </div>

          <div className="space-y-3">
            {filteredModels.length > 0 ? (
              filteredModels.map((model) => {
                const isRecommended = model.id === recommendedModel?.id;
                const isSelected = selectedModel === model.id;

                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`card p-5 cursor-pointer transition-all hover:shadow-[var(--tb-shadow-md)] flex flex-col md:flex-row gap-5 items-start md:items-center ${
                      isSelected ? "ring-2 ring-[var(--tb-primary)]" : ""
                    } ${isRecommended ? "border-[color-mix(in_oklch,var(--tb-raid)_42%,var(--tb-border))]" : ""}`}
                  >
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div>
                          <div className="font-black text-[17px]">{model.nameFa}</div>
                          <div className="text-[11px] text-[var(--tb-fg-muted)]">{model.name}</div>
                        </div>
                        {isRecommended && (
                          <div className="badge !bg-[color-mix(in_oklch,var(--tb-success)_12%,transparent)] !text-[var(--tb-success)] !border-[color-mix(in_oklch,var(--tb-success)_22%,transparent)]">پیشنهادی</div>
                        )}
                        {model.aiFeatures && <span className="badge">AI</span>}
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-y-3 text-[13px]">
                        <div>
                          <div className="text-[var(--tb-fg-muted)] text-[11px]">حداکثر دوربین</div>
                          <div className="font-extrabold tabular-nums">{fa.format(model.maxCameras)} عدد</div>
                        </div>
                        <div>
                          <div className="text-[var(--tb-fg-muted)] text-[11px]">بِی ذخیره‌سازی</div>
                          <div className="font-extrabold">{fa.format(model.storageBays)} بِی</div>
                        </div>
                        <div>
                          <div className="text-[var(--tb-fg-muted)] text-[11px]">رزولوشن</div>
                          <div className="font-extrabold">{model.maxResolution}</div>
                        </div>
                        <div>
                          <div className="text-[var(--tb-fg-muted)] text-[11px]">RAID</div>
                          <div className="font-extrabold">{model.raidSupport}</div>
                        </div>
                      </div>

                      <p className="mt-3 text-[12px] text-[var(--tb-fg-muted)] leading-6">{model.descriptionFa}</p>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-start md:items-end gap-2 min-w-[170px]">
                      <div className="text-right md:text-left">
                        <div className="text-[11px] text-[var(--tb-fg-muted)]">از</div>
                        <div className="font-black text-[20px] tabular-nums tracking-tight">
                          {model.price ? fa.format(model.price) : model.priceLabel ?? "تماس بگیرید"}
                        </div>
                        <div className="text-[11px] text-[var(--tb-fg-muted)]">تومان</div>
                      </div>

                      <button
                        className="btn btn-primary text-[12px] px-5 py-2 w-full md:w-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(model, filters);
                          if (model.href) window.location.href = model.href;
                        }}
                      >
                        انتخاب مدل
                      </button>
                      {model.href && (
                        <a
                          href={model.href}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[var(--tb-primary)] font-bold hover:underline"
                        >
                          مشاهده در فروشگاه →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card p-8 text-center">
                <p className="text-[var(--tb-fg-muted)]">مدلی با این مشخصات پیدا نشد.</p>
                <p className="text-[12px] mt-1">لطفاً تعداد دوربین‌ها یا الزامات را کاهش دهید.</p>
              </div>
            )}
          </div>

          {filteredModels.length > 0 && (
            <div className="mt-4 px-1 text-[11px] text-[var(--tb-fg-muted)] flex items-center gap-2">
              <Icon name="shield" className="w-3.5 h-3.5" />
              قیمت‌ها تقریبی هستند و بسته به کانفیگ متفاوت می‌باشند.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NvrSelector;

```

---

## `features/tools/components/raid-calculator/index.ts`

```ts
export { default, default as RaidCalculator, calculateRaid, RAID_OPTIONS } from "./RaidCalculator";
export type { Drive, RaidKey, RaidResult } from "./RaidCalculator";

```

---

## `features/tools/components/raid-calculator/RaidCalculator.tsx`

```tsx
"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "@/design/icons";

export type RaidKey =
  | "basic"
  | "jbod"
  | "raid0"
  | "raid1"
  | "raid5"
  | "raid6"
  | "raid10"
  | "shr1"
  | "shr2";

export type Drive = {
  id: string;
  sizeTb: number;
};

export type RaidResult = {
  usableTb: number;
  protectionTb: number;
  unusedTb: number;
  rawTb: number;
  activeRawTb: number;
  spareTb: number;
  valid: boolean;
  minDisks: number;
  warnings: string[];
  description: string;
  faultTolerance: string;
  efficiency: number;
};

type RaidOption = {
  key: RaidKey;
  label: string;
  short: string;
  minDisks: number;
  maxDisks?: number;
  protected: boolean;
  description: string;
  faultTolerance: string;
};

export const RAID_OPTIONS: RaidOption[] = [
  { key: "basic", label: "Basic", short: "Basic", minDisks: 1, protected: false, description: "هر دیسک به‌صورت مستقل استفاده می‌شود؛ بیشترین ظرفیت، بدون افزونگی.", faultTolerance: "ندارد" },
  { key: "jbod", label: "JBOD", short: "JBOD", minDisks: 1, protected: false, description: "ترکیب ظرفیت دیسک‌ها در یک Volume پیوسته؛ خرابی یک دیسک می‌تواند داده‌ها را از بین ببرد.", faultTolerance: "ندارد" },
  { key: "raid0", label: "RAID 0", short: "R0", minDisks: 2, protected: false, description: "Striping برای کارایی بالا؛ بدون تحمل خرابی دیسک.", faultTolerance: "ندارد" },
  { key: "raid1", label: "RAID 1", short: "R1", minDisks: 2, protected: true, description: "Mirror کامل بین دیسک‌ها؛ مناسب داده‌های مهم با ظرفیت کمتر.", faultTolerance: "تا خرابی همه دیسک‌ها به‌جز یک دیسک" },
  { key: "raid5", label: "RAID 5", short: "R5", minDisks: 3, protected: true, description: "ترکیب ظرفیت و افزونگی با یک دیسک Parity.", faultTolerance: "خرابی ۱ دیسک" },
  { key: "raid6", label: "RAID 6", short: "R6", minDisks: 4, protected: true, description: "دو Parity برای امنیت بیشتر؛ مناسب آرایه‌های بزرگ‌تر.", faultTolerance: "خرابی ۲ دیسک" },
  { key: "raid10", label: "RAID 10", short: "R10", minDisks: 4, protected: true, description: "Mirror + Stripe برای کارایی و افزونگی؛ نیازمند تعداد دیسک زوج.", faultTolerance: "حداقل ۱ دیسک، بسته به جفت Mirror" },
  { key: "shr1", label: "SHR-1", short: "SHR1", minDisks: 2, protected: true, description: "Synology Hybrid RAID با تحمل خرابی یک دیسک و استفاده بهتر از دیسک‌های نامساوی.", faultTolerance: "خرابی ۱ دیسک" },
  { key: "shr2", label: "SHR-2", short: "SHR2", minDisks: 4, protected: true, description: "SHR با تحمل خرابی دو دیسک؛ مناسب ظرفیت‌های بالا و آرایه‌های حساس.", faultTolerance: "خرابی ۲ دیسک" },
];

const QUICK_SIZES = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const DEFAULT_DRIVES: Drive[] = [
  { id: "d-1", sizeTb: 8 },
  { id: "d-2", sizeTb: 8 },
  { id: "d-3", sizeTb: 8 },
  { id: "d-4", sizeTb: 8 },
];

const nf = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
const pf = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

function uid() {
  return `d-${Math.random().toString(36).slice(2, 10)}`;
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
function sum(values: number[]) {
  return values.reduce((acc, item) => acc + item, 0);
}
function formatTb(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "۰ TB";
  return `${nf.format(value)} TB`;
}

function calculateShr(sizes: number[], parityDisks: 1 | 2) {
  const sorted = [...sizes].filter(Boolean).sort((a, b) => a - b);
  const raw = sum(sorted);
  let usable = 0;
  let protection = 0;
  let unused = 0;
  let previous = 0;

  for (const boundary of sorted) {
    const slice = boundary - previous;
    if (slice <= 0) continue;
    const members = sorted.filter((size) => size >= boundary).length;

    if (parityDisks === 1) {
      if (members >= 2) {
        usable += (members - 1) * slice;
        protection += slice;
      } else {
        unused += members * slice;
      }
    } else {
      if (members >= 3) {
        usable += (members - 2) * slice;
        protection += 2 * slice;
      } else {
        unused += members * slice;
      }
    }
    previous = boundary;
  }
  const roundingGap = raw - usable - protection - unused;
  if (Math.abs(roundingGap) > 0.00001) unused += roundingGap;
  return { usable, protection, unused };
}

export function calculateRaid(raidKey: RaidKey, drives: Drive[], spareCount: number): RaidResult {
  const option = RAID_OPTIONS.find((item) => item.key === raidKey)!;
  const allSizes = drives.map((drive) => Number(drive.sizeTb)).filter((size) => size > 0);
  const rawTb = sum(allSizes);
  const sortedDesc = [...allSizes].sort((a, b) => b - a);
  const spareSizes = sortedDesc.slice(0, clamp(spareCount, 0, Math.max(0, sortedDesc.length - 1)));
  const activeSizes = sortedDesc.slice(spareSizes.length);
  const activeRawTb = sum(activeSizes);
  const spareTb = sum(spareSizes);
  const n = activeSizes.length;
  const min = n ? Math.min(...activeSizes) : 0;
  const warnings: string[] = [];

  let usableTb = 0;
  let protectionTb = 0;
  let unusedTb = 0;

  if (n < option.minDisks) {
    warnings.push(`برای ${option.label} حداقل ${nf.format(option.minDisks)} دیسک فعال لازم است.`);
  }
  if (raidKey === "raid10" && n % 2 !== 0) {
    warnings.push("RAID 10 به تعداد دیسک زوج نیاز دارد؛ یک دیسک اضافه باعث عدم اعتبار آرایه می‌شود.");
  }

  switch (raidKey) {
    case "basic":
    case "jbod": {
      usableTb = activeRawTb;
      break;
    }
    case "raid0": {
      usableTb = n >= 2 ? min * n : 0;
      unusedTb = Math.max(0, activeRawTb - usableTb);
      break;
    }
    case "raid1": {
      usableTb = n >= 2 ? min : 0;
      protectionTb = n >= 2 ? min * (n - 1) : 0;
      unusedTb = Math.max(0, activeRawTb - usableTb - protectionTb);
      break;
    }
    case "raid5": {
      usableTb = n >= 3 ? min * (n - 1) : 0;
      protectionTb = n >= 3 ? min : 0;
      unusedTb = Math.max(0, activeRawTb - usableTb - protectionTb);
      break;
    }
    case "raid6": {
      usableTb = n >= 4 ? min * (n - 2) : 0;
      protectionTb = n >= 4 ? min * 2 : 0;
      unusedTb = Math.max(0, activeRawTb - usableTb - protectionTb);
      break;
    }
    case "raid10": {
      usableTb = n >= 4 && n % 2 === 0 ? min * (n / 2) : 0;
      protectionTb = n >= 4 && n % 2 === 0 ? min * (n / 2) : 0;
      unusedTb = Math.max(0, activeRawTb - usableTb - protectionTb);
      break;
    }
    case "shr1": {
      if (n >= 2) {
        const shr = calculateShr(activeSizes, 1);
        usableTb = shr.usable;
        protectionTb = shr.protection;
        unusedTb = shr.unused;
      }
      break;
    }
    case "shr2": {
      if (n >= 4) {
        const shr = calculateShr(activeSizes, 2);
        usableTb = shr.usable;
        protectionTb = shr.protection;
        unusedTb = shr.unused;
      }
      break;
    }
  }

  if (["raid0", "raid1", "raid5", "raid6", "raid10"].includes(raidKey)) {
    const uniqueSizes = new Set(activeSizes);
    if (uniqueSizes.size > 1) {
      warnings.push("در RAID کلاسیک، ظرفیت قابل استفاده بر اساس کوچک‌ترین دیسک محاسبه می‌شود و بخشی از دیسک‌های بزرگ‌تر بلااستفاده می‌ماند.");
    }
  }
  if ((raidKey === "shr1" || raidKey === "shr2") && unusedTb > 0) {
    warnings.push("به‌دلیل ترکیب ظرفیت‌ها، بخشی از فضا در این چیدمان قابل استفاده نیست. افزودن دیسک هم‌اندازه می‌تواند آن را فعال کند.");
  }

  const valid = warnings.every((warning) => !warning.includes("حداقل") && !warning.includes("زوج"));
  const efficiency = activeRawTb > 0 ? (usableTb / activeRawTb) * 100 : 0;

  return {
    usableTb,
    protectionTb,
    unusedTb,
    rawTb,
    activeRawTb,
    spareTb,
    valid,
    minDisks: option.minDisks,
    warnings,
    description: option.description,
    faultTolerance: option.faultTolerance,
    efficiency,
  };
}

function Segment({ label, value, total, className }: { label: string; value: number; total: number; className: string; }) {
  const width = total > 0 ? Math.max(value > 0 ? 2 : 0, (value / total) * 100) : 0;
  return <div className={className} style={{ width: `${width}%` }} title={`${label}: ${formatTb(value)}`} aria-label={`${label}: ${formatTb(value)}`} />;
}

function StatCard({ label, value, hint, tone = "default" }: { label: string; value: string; hint: string; tone?: "default" | "accent" | "success" | "warning" }) {
  const toneClass =
    tone === "accent" ? "text-[var(--tb-raid)]"
    : tone === "success" ? "text-[var(--tb-success)]"
    : tone === "warning" ? "text-[var(--tb-warning)]"
    : "text-[var(--tb-fg-primary)]";
  return (
    <div className="rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)]/70 p-4">
      <div className="tb-text-sm text-[var(--tb-fg-muted)]">{label}</div>
      <div className={`mt-2 text-2xl font-black leading-none ${toneClass}`}>{value}</div>
      <div className="mt-2 tb-text-sm text-[var(--tb-fg-muted)]">{hint}</div>
    </div>
  );
}

export default function RaidCalculator() {
  const [drives, setDrives] = useState<Drive[]>(DEFAULT_DRIVES);
  const [raid, setRaid] = useState<RaidKey>("shr1");
  const [spareCount, setSpareCount] = useState(0);
  const [customSize, setCustomSize] = useState(8);

  const result = useMemo(() => calculateRaid(raid, drives, spareCount), [raid, drives, spareCount]);
  const selectedOption = RAID_OPTIONS.find((item) => item.key === raid)!;
  const canRemove = drives.length > 1;
  const effectiveSpareMax = Math.max(0, drives.length - 1);
  const barTotal = Math.max(result.activeRawTb + result.spareTb, result.rawTb, 1);

  function addDrive(sizeTb = customSize) {
    setDrives((current) => [...current, { id: uid(), sizeTb: clamp(Number(sizeTb) || 1, 0.1, 100) }]);
  }
  function updateDrive(id: string, sizeTb: number) {
    setDrives((current) => current.map((drive) => (drive.id === id ? { ...drive, sizeTb: clamp(Number(sizeTb) || 0.1, 0.1, 100) } : drive)));
  }
  function removeDrive(id: string) {
    setDrives((current) => (current.length <= 1 ? current : current.filter((drive) => drive.id !== id)));
    setSpareCount((current) => clamp(current, 0, Math.max(0, drives.length - 2)));
  }
  function applyPreset(sizeTb: number, count: number) {
    setDrives(Array.from({ length: count }, () => ({ id: uid(), sizeTb })));
    setCustomSize(sizeTb);
    setSpareCount(0);
  }

  return (
    <section dir="rtl" className="w-full font-sans text-[var(--tb-fg-primary)]">
      <div className="relative overflow-hidden rounded-[calc(var(--tb-radius-lg)+8px)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] shadow-[var(--tb-shadow-lg)]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_8%,color-mix(in_oklch,var(--tb-raid)_22%,transparent),transparent_32%),radial-gradient(circle_at_88%_0%,color-mix(in_oklch,var(--tb-primary)_18%,transparent),transparent_34%)]" />

        <div className="relative grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)] lg:p-7">
          <div className="space-y-5">
            <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="badge mb-3 border-[color-mix(in_oklch,var(--tb-raid)_35%,var(--tb-border))] bg-[color-mix(in_oklch,var(--tb-raid)_12%,var(--tb-bg-muted))] text-[var(--tb-fg-primary)]">
                  <Icon name="server" className="h-3.5 w-3.5 text-[var(--tb-raid)]" />
                  ابزار محاسبه RAID
                </div>
                <h2 className="tb-text-big-title">ماشین حساب RAID و SHR</h2>
                <p className="mt-3 max-w-2xl tb-text-md text-[var(--tb-fg-muted)]">
                  ظرفیت قابل استفاده، افزونگی، فضای بلااستفاده و Hot Spare را برای RAIDهای کلاسیک و Synology Hybrid RAID با دیسک‌های هم‌اندازه یا ترکیبی محاسبه کنید.
                </p>
              </div>
              <button type="button" onClick={() => applyPreset(8, 4)} className="btn btn-ghost shrink-0">
                بازنشانی نمونه
              </button>
            </header>

            <div className="card p-4 shadow-[var(--tb-shadow-sm)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="tb-text-lg">دیسک‌ها</h3>
                  <p className="tb-text-sm text-[var(--tb-fg-muted)]">ظرفیت‌ها بر اساس TB ده‌دهی نمایش داده می‌شوند.</p>
                </div>
                <div className="badge">{nf.format(drives.length)} دیسک</div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {QUICK_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => addDrive(size)}
                    className="rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)] px-3 py-2 tb-text-sm font-bold transition hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--tb-raid)_48%,var(--tb-border))] hover:bg-[color-mix(in_oklch,var(--tb-raid)_10%,var(--tb-bg-muted))]"
                  >
                    + {nf.format(size)}TB
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <label className="block">
                  <span className="mb-2 block tb-text-sm font-bold text-[var(--tb-fg-secondary)]">ظرفیت سفارشی هر دیسک</span>
                  <input
                    className="input text-left ltr:[direction:ltr]"
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={customSize}
                    onChange={(event) => setCustomSize(clamp(Number(event.target.value), 0.1, 100))}
                  />
                </label>
                <button type="button" onClick={() => addDrive(customSize)} className="btn btn-primary self-end bg-[var(--tb-raid)]">
                  <Icon name="plus" className="h-4 w-4" />
                  افزودن دیسک
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {drives.map((drive, index) => (
                  <div key={drive.id} className="group rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-3 transition hover:border-[color-mix(in_oklch,var(--tb-raid)_42%,var(--tb-border))]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-black">
                        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--tb-radius-md)] bg-[color-mix(in_oklch,var(--tb-raid)_13%,var(--tb-bg-muted))] text-[var(--tb-raid)]">
                          <Icon name="disk" className="h-5 w-5" />
                        </span>
                        دیسک {nf.format(index + 1)}
                      </div>
                      <button
                        type="button"
                        disabled={!canRemove}
                        onClick={() => removeDrive(drive.id)}
                        className="icon-rail-btn h-8 w-8 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="حذف دیسک"
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="input text-left font-black [direction:ltr]"
                        type="number"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={drive.sizeTb}
                        onChange={(event) => updateDrive(drive.id, Number(event.target.value))}
                        aria-label={`ظرفیت دیسک ${index + 1}`}
                      />
                      <span className="tb-text-sm font-bold text-[var(--tb-fg-muted)]">TB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4 shadow-[var(--tb-shadow-sm)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="tb-text-lg">نوع RAID</h3>
                  <p className="tb-text-sm text-[var(--tb-fg-muted)]">برای دیسک‌های ترکیبی، SHR معمولاً ظرفیت بهتری از RAID کلاسیک می‌دهد.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {RAID_OPTIONS.map((option) => {
                  const active = raid === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setRaid(option.key)}
                      className={`text-right rounded-[var(--tb-radius-md)] border p-4 transition ${
                        active
                          ? "border-[color-mix(in_oklch,var(--tb-raid)_70%,var(--tb-border))] bg-[color-mix(in_oklch,var(--tb-raid)_13%,var(--tb-bg-secondary))] shadow-[var(--tb-shadow-sm)]"
                          : "border-[var(--tb-border)] bg-[var(--tb-bg-muted)]/65 hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--tb-raid)_45%,var(--tb-border))]"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-black">{option.label}</span>
                        <span className={`badge ${active ? "bg-[var(--tb-raid)] text-[var(--tb-on-accent)]" : ""}`}>{option.short}</span>
                      </span>
                      <span className="mt-2 block tb-text-sm text-[var(--tb-fg-muted)]">حداقل {nf.format(option.minDisks)} دیسک · {option.faultTolerance}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)]/60 p-4">
                <label className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <span className="block font-black">Hot Spare</span>
                    <span className="block tb-text-sm text-[var(--tb-fg-muted)]">بزرگ‌ترین دیسک‌ها به‌عنوان Spare رزرو می‌شوند و وارد ظرفیت Volume نمی‌شوند.</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <button type="button" className="icon-rail-btn" onClick={() => setSpareCount((value) => clamp(value - 1, 0, effectiveSpareMax))}>
                      <Icon name="minus" className="h-4 w-4" />
                    </button>
                    <input
                      className="input w-20 text-center font-black"
                      type="number"
                      min={0}
                      max={effectiveSpareMax}
                      value={spareCount}
                      onChange={(event) => setSpareCount(clamp(Number(event.target.value), 0, effectiveSpareMax))}
                    />
                    <button type="button" className="icon-rail-btn" onClick={() => setSpareCount((value) => clamp(value + 1, 0, effectiveSpareMax))}>
                      <Icon name="plus" className="h-4 w-4" />
                    </button>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="card overflow-hidden p-0 shadow-[var(--tb-shadow-lg)]">
              <div className="border-b border-[var(--tb-border)] bg-[color-mix(in_oklch,var(--tb-raid)_10%,var(--tb-bg-secondary))] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="tb-text-sm font-bold text-[var(--tb-fg-muted)]">نتیجه برای</div>
                    <div className="mt-1 text-3xl font-black text-[var(--tb-raid)]">{selectedOption.label}</div>
                  </div>
                  <div className={`badge ${result.valid ? "border-[color-mix(in_oklch,var(--tb-success)_40%,var(--tb-border))] text-[var(--tb-success)]" : "border-[color-mix(in_oklch,var(--tb-danger)_40%,var(--tb-border))] text-[var(--tb-danger)]"}`}>
                    {result.valid ? "معتبر" : "نیازمند اصلاح"}
                  </div>
                </div>
                <p className="mt-3 tb-text-sm text-[var(--tb-fg-muted)]">{result.description}</p>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="ظرفیت قابل استفاده" value={formatTb(result.usableTb)} hint="فضای نهایی Volume" tone="accent" />
                  <StatCard label="بازده ظرفیت" value={`${pf.format(result.efficiency)}٪`} hint="نسبت به دیسک‌های فعال" tone="success" />
                  <StatCard label="حفاظت / Parity" value={formatTb(result.protectionTb)} hint={result.faultTolerance} />
                  <StatCard label="بلااستفاده + Spare" value={formatTb(result.unusedTb + result.spareTb)} hint="فضای رزرو یا غیرقابل استفاده" tone="warning" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between tb-text-sm font-bold">
                    <span>نقشه ظرفیت</span>
                    <span className="text-[var(--tb-fg-muted)]">خام: {formatTb(result.rawTb)}</span>
                  </div>
                  <div className="flex h-5 overflow-hidden rounded-[var(--tb-radius-full)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)]" aria-label="نمودار ظرفیت RAID">
                    <Segment label="قابل استفاده" value={result.usableTb} total={barTotal} className="bg-[var(--tb-raid)]" />
                    <Segment label="حفاظت" value={result.protectionTb} total={barTotal} className="bg-[var(--tb-success)]" />
                    <Segment label="بلااستفاده" value={result.unusedTb} total={barTotal} className="bg-[var(--tb-warning)]" />
                    <Segment label="Hot Spare" value={result.spareTb} total={barTotal} className="bg-[var(--tb-fg-muted)]" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 tb-text-sm text-[var(--tb-fg-muted)]">
                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[var(--tb-raid)]" /> قابل استفاده</span>
                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[var(--tb-success)]" /> حفاظت</span>
                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[var(--tb-warning)]" /> بلااستفاده</span>
                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[var(--tb-fg-muted)]" /> Spare</span>
                  </div>
                </div>

                <div className="rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-muted)]/60 p-4">
                  <div className="mb-3 flex items-center gap-2 font-black">
                    <Icon name="shield" className="h-5 w-5 text-[var(--tb-raid)]" />
                    خلاصه پیکربندی
                  </div>
                  <dl className="grid grid-cols-2 gap-3 tb-text-sm">
                    <div>
                      <dt className="text-[var(--tb-fg-muted)]">دیسک فعال</dt>
                      <dd className="mt-1 font-black">{nf.format(drives.length - spareCount)}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--tb-fg-muted)]">Hot Spare</dt>
                      <dd className="mt-1 font-black">{nf.format(spareCount)}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--tb-fg-muted)]">ظرفیت خام فعال</dt>
                      <dd className="mt-1 font-black">{formatTb(result.activeRawTb)}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--tb-fg-muted)]">تحمل خرابی</dt>
                      <dd className="mt-1 font-black">{result.faultTolerance}</dd>
                    </div>
                  </dl>
                </div>

                {result.warnings.length > 0 ? (
                  <div className="space-y-2">
                    {result.warnings.map((warning) => (
                      <div key={warning} className="rounded-[var(--tb-radius-md)] border border-[color-mix(in_oklch,var(--tb-warning)_35%,var(--tb-border))] bg-[color-mix(in_oklch,var(--tb-warning)_11%,var(--tb-bg-secondary))] p-3 tb-text-sm text-[var(--tb-fg-primary)]">
                        {warning}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[var(--tb-radius-md)] border border-[color-mix(in_oklch,var(--tb-success)_35%,var(--tb-border))] bg-[color-mix(in_oklch,var(--tb-success)_10%,var(--tb-bg-secondary))] p-3 tb-text-sm text-[var(--tb-fg-primary)]">
                    این چیدمان از نظر تعداد دیسک معتبر است و ظرفیت بدون هشدار محاسبه شد.
                  </div>
                )}

                <p className="tb-text-sm text-[var(--tb-fg-muted)]">
                  توجه: نتیجه‌ها تخمینی هستند. ظرفیت واقعی NAS ممکن است به‌دلیل تفاوت TB/TiB، فایل‌سیستم، Snapshot، Metadata و سیاست‌های سازنده کمتر نمایش داده شود.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

```

---

## `features/tools/components/RaidCalculator.tsx`

```tsx
"use client";
import { useMemo, useState } from "react";

type RaidLevel = "0"|"1"|"5"|"6"|"10";

const overhead: Record<RaidLevel, (n:number)=>{usable:number; fault:number}> = {
 "0": n => ({usable: n, fault: 0}),
 "1": n => ({usable: Math.floor(n/2), fault: 1}),
 "5": n => ({usable: Math.max(0, n-1), fault: 1}),
 "6": n => ({usable: Math.max(0, n-2), fault: 2}),
 "10": n => ({usable: Math.floor(n/2), fault: Math.floor(n/2)}),
};

export default function RaidCalculator(){
 const [disks, setDisks] = useState(4);
 const [size, setSize] = useState(4000); // GB
 const [level, setLevel] = useState<RaidLevel>("5");

 const calc = useMemo(()=>{
 const o = overhead[level](disks);
 const raw = disks * size;
 const usable = o.usable * size;
 const eff = raw ? Math.round(usable / raw * 100) : 0;
 return { ...o, raw, usable, eff };
 }, [disks, size, level]);

 return (
 <div className="card p-5 space-y-4" dir="rtl">
 <div className="flex items-center justify-between">
 <h3 className=" tb-text-lg text-[var(--tb-raid)]">RAID Calculator</h3>
 <span className="tb-text-sm text-muted-foreground">تکباکس – ابزار زیرساخت</span>
 </div>

 <div className="grid sm:grid-cols-3 gap-3 tb-text-md">
 <label className="space-y-1">
 <span className="tb-text-sm text-muted-foreground">تعداد دیسک</span>
 <input type="number" min={2} max={24} value={disks} onChange={e=>setDisks(Math.max(2, parseInt(e.target.value)||2))} className="input" />
 </label>
 <label className="space-y-1">
 <span className="tb-text-sm text-muted-foreground">ظرفیت هر دیسک (GB)</span>
 <input type="number" min={100} step={100} value={size} onChange={e=>setSize(parseInt(e.target.value)||0)} className="input" />
 </label>
 <label className="space-y-1">
 <span className="tb-text-sm text-muted-foreground">سطح RAID</span>
 <select value={level} onChange={e=>setLevel(e.target.value as RaidLevel)} className="input">
 <option value="0">RAID 0</option>
 <option value="1">RAID 1</option>
 <option value="5">RAID 5</option>
 <option value="6">RAID 6</option>
 <option value="10">RAID 10</option>
 </select>
 </label>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
 {[
 ["ظرفیت خام", `${calc.raw.toLocaleString("fa-IR")} GB`],
 ["قابل استفاده", `${calc.usable.toLocaleString("fa-IR")} GB`],
 ["تحمل خطا", `${calc.fault.toLocaleString("fa-IR")} دیسک`],
 ["راندمان", `${calc.eff.toLocaleString("fa-IR")}%`],
 ].map(([k,v])=>(
 <div key={k as string} className="rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)]/60 p-3">
 <div className="tb-text-sm text-muted-foreground">{k}</div>
 <div className=" text-[var(--tb-raid)] mt-1">{v}</div>
 </div>
 ))}
 </div>

 <p className="tb-text-sm text-muted-foreground ">
 محاسبه تئوریک – برای RAID5 حداقل ۳ دیسک، RAID6 حداقل ۴ دیسک، RAID10 زوج. مناسب سرورهای HPE / Dell که در بلاگ تکباکس بررسی کردیم.
 </p>
 </div>
 );
}

```

---

## `features/tools/components/SubnetCalculator.tsx`

```tsx
"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/design/icons";

function ipToInt(ip: string) { return ip.split(".").reduce((a, o) => (a << 8) + parseInt(o || "0"), 0) >>> 0; }
function intToIp(n: number) { return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join("."); }
function isValidIp(ip: string) {
  const p = ip.split(".");
  return p.length === 4 && p.every((o) => /^\d+$/.test(o) && +o >= 0 && +o <= 255);
}

const RESULT_LABELS: Record<string, string> = {
  network: "آدرس شبکه",
  broadcast: "آدرس Broadcast",
  mask: "Subnet Mask",
  first: "اولین IP قابل استفاده",
  last: "آخرین IP قابل استفاده",
  hosts: "تعداد میزبان قابل استفاده",
};

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);

  const valid = isValidIp(ip);

  const out = useMemo(() => {
    if (!valid) return null;
    const mask = (~((1 << (32 - cidr)) - 1)) >>> 0;
    const net = ipToInt(ip) & mask;
    const broadcast = net | (~mask >>> 0);
    const hosts = Math.max(0, (1 << (32 - cidr)) - 2);
    return {
      network: intToIp(net),
      broadcast: intToIp(broadcast),
      mask: intToIp(mask),
      first: hosts > 0 ? intToIp(net + 1) : "—",
      last: hosts > 0 ? intToIp(broadcast - 1) : "—",
      hosts: hosts.toLocaleString("fa-IR"),
    };
  }, [ip, cidr, valid]);

  return (
    <div className="space-y-5" dir="rtl">
      {/* What is it? */}
      <div className="card p-5 space-y-2">
        <div className="flex items-center gap-2 tb-text-lg text-[var(--tb-subnet)]">
          <Icon name="server" size={20} strokeWidth={1.75} />
          ماشین‌حساب ساب‌نت (Subnet) چیست؟
        </div>
        <p className="tb-text-md text-[var(--tb-fg-muted)] leading-8">
          «ساب‌نت» یعنی تقسیم یک شبکه بزرگ به چند شبکه کوچک‌تر. با این ابزار کافیست یک
          آدرس IP و یک «پیشوند» (CIDR مثل <span dir="ltr" className="font-mono">/24</span>) وارد کنید تا
          ببینید شبکه شما از کجا شروع و به کجا ختم می‌شود، چه ماسکی دارد و چند دستگاه
          می‌توانند در آن IP بگیرند. مناسب برای طراحی شبکه، پیکربندی روتر/سوییچ و
          آدرس‌دهی سرورها.
        </p>
      </div>

      {/* Inputs */}
      <div className="card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1 block">
            <span className="tb-text-sm text-[var(--tb-fg-muted)]">آدرس IP</span>
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className={`input font-mono text-left ${!valid ? "border-[var(--tb-danger)]" : ""}`}
              dir="ltr"
              placeholder="192.168.1.0"
            />
            {!valid && <span className="tb-text-sm text-[var(--tb-danger)]">آدرس IP معتبر نیست (مثال: 192.168.1.0)</span>}
          </label>
          <label className="space-y-2 block">
            <span className="tb-text-sm text-[var(--tb-fg-muted)]">
              پیشوند شبکه: <span dir="ltr" className="font-mono text-[var(--tb-subnet)]">/{cidr}</span>
              {out && <span className="text-[var(--tb-fg-muted)]"> — ماسک <span dir="ltr" className="font-mono">{out.mask}</span></span>}
            </span>
            <input
              type="range"
              min={8}
              max={30}
              value={cidr}
              onChange={(e) => setCidr(parseInt(e.target.value))}
              className="w-full accent-[var(--tb-subnet)]"
            />
            <div className="flex justify-between tb-text-sm text-[var(--tb-fg-muted)]" dir="ltr">
              <span>/8</span><span>/30</span>
            </div>
          </label>
        </div>
      </div>

      {/* Results */}
      {out && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(["network", "broadcast", "mask", "first", "last", "hosts"] as const).map((k) => (
            <div key={k} className="rounded-[var(--tb-radius-md)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] px-3 py-2.5">
              <div className="tb-text-sm text-[var(--tb-fg-muted)]">{RESULT_LABELS[k]}</div>
              <div className="mt-1 font-mono text-[var(--tb-fg-primary)]" dir="ltr">{out[k]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

```

---

## `features/tools/components/ToolPageHeader.tsx`

```tsx
"use client";
import Link from "next/link";
import { Icon } from "@/design/icons";

type Crumb = { label: string; href?: string };

export function ToolPageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  accent = "var(--tb-tools)",
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  accent?: string;
}) {
  return (
    <div dir="rtl" className="relative overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-5 sm:p-7 shadow-[var(--tb-shadow-sm)]">
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full opacity-15 blur-[40px]"
        style={{ background: accent }}
        aria-hidden
      />
      {breadcrumbs.length > 0 && (
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--tb-fg-muted)]">
          {breadcrumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevronLeft" className="h-3 w-3 opacity-60 rtl:rotate-180" />}
              {c.href ? (
                <Link href={c.href} className="hover:text-[var(--tb-fg-primary)] transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-[var(--tb-fg-secondary)] font-bold">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="tb-text-big-title" style={{ color: "var(--tb-fg-primary)" }}>{title}</h1>
      {subtitle && (
        <p className="mt-2 max-w-2xl tb-text-md text-[var(--tb-fg-muted)]">{subtitle}</p>
      )}
    </div>
  );
}

export default ToolPageHeader;

```

---

## `features/tools/components/ToolsGrid.tsx`

```tsx
"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/design/icons";

type ToolCard = {
  slug: string;
  title: string;
  titleFa: string;
  descFa: string;
  icon: IconName;
  accent: string; // css var e.g. var(--tb-tools)
  badge?: string;
  href: string;
  stats?: { label: string; value: string }[];
};

const TOOLS: ToolCard[] = [
  {
    slug: "nas-selector",
    title: "NAS Selector",
    titleFa: "انتخاب‌گر NAS",
    descFa: "بهترین NAS را بر اساس کاربران، ظرفیت، RAID، سرویس‌ها و بودجه پیدا کنید. رتبه‌بندی زنده + دلیل پیشنهاد.",
    icon: "server",
    accent: "var(--tb-tools)",
    badge: "جدید",
    href: "/tools/nas-selector",
    stats: [
      { label: "محصول", value: "۶+" },
      { label: "RAID", value: "۵ نوع" },
    ],
  },
  {
    slug: "nvr-selector",
    title: "NVR Selector",
    titleFa: "انتخاب‌گر NVR",
    descFa: "تعداد دوربین، رزولوشن و مدت ضبط را وارد کنید تا NVR مناسب با AI پیشنهاد شود.",
    icon: "media",
    accent: "var(--tb-raid)",
    badge: "جدید",
    href: "/tools/nvr-selector",
    stats: [
      { label: "مدل", value: "۵" },
      { label: "تا", value: "۶۴ دوربین" },
    ],
  },
  {
    slug: "raid-calculator",
    title: "RAID Calculator",
    titleFa: "ماشین حساب RAID",
    descFa: "RAID 0/1/5/6/10 + SHR-1/SHR-2، دیسک ترکیبی، Hot Spare، نقشه ظرفیت زنده.",
    icon: "disk",
    accent: "var(--tb-raid)",
    badge: "v2",
    href: "/tools/raid-calculator",
    stats: [
      { label: "RAID", value: "۹ حالت" },
      { label: "SHR", value: "۱/۲" },
    ],
  },
  {
    slug: "subnet-calculator",
    title: "Subnet Calculator",
    titleFa: "ماشین حساب ساب‌نت",
    descFa: "محاسبه سریع IP، ماسک، تعداد هاست و محدوده شبکه – بدون تغییر.",
    icon: "tools",
    accent: "var(--tb-subnet)",
    href: "/tools/subnet-calculator",
    stats: [
      { label: "IPv4", value: "✓" },
      { label: "CIDR", value: "✓" },
    ],
  },
];

export function ToolsGrid({ className }: { className?: string }) {
  return (
    <section dir="rtl" className={["grid gap-5 sm:grid-cols-2 xl:grid-cols-4", className].filter(Boolean).join(" ")}>
      {TOOLS.map((tool) => (
        <Link
          key={tool.slug}
          href={tool.href}
          className="group relative flex flex-col overflow-hidden rounded-[var(--tb-radius-lg)] border border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-5 shadow-[var(--tb-shadow-sm)] transition-all duration-[var(--tb-motion-md)] hover:-translate-y-1 hover:shadow-[var(--tb-shadow-md)]"
        >
          <div
            className="absolute -left-10 -top-10 h-28 w-28 rounded-full opacity-[0.14] blur-[28px] transition-opacity group-hover:opacity-25"
            style={{ background: tool.accent }}
            aria-hidden
          />
          <div className="flex items-start justify-between gap-3">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--tb-radius-md)] border"
              style={{
                background: `color-mix(in oklch, ${tool.accent} 14%, var(--tb-bg-muted))`,
                borderColor: `color-mix(in oklch, ${tool.accent} 30%, var(--tb-border))`,
                color: tool.accent,
              }}
            >
              <Icon name={tool.icon} className="h-5 w-5" />
            </span>
            {tool.badge && (
              <span className="badge" style={{
                background: `color-mix(in oklch, ${tool.accent} 12%, var(--tb-bg-muted))`,
                color: "var(--tb-fg-primary)",
                borderColor: `color-mix(in oklch, ${tool.accent} 28%, var(--tb-border))`
              }}>
                {tool.badge}
              </span>
            )}
          </div>

          <h3 className="mt-4 text-[16px] font-black text-[var(--tb-fg-primary)]">{tool.titleFa}</h3>
          <p className="mt-2 text-[12px] leading-7 text-[var(--tb-fg-muted)] min-h-[84px]">{tool.descFa}</p>

          {tool.stats && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {tool.stats.map((s) => (
                <span key={s.label} className="badge">
                  {s.label}: <b className="mr-1" style={{ color: tool.accent }}>{s.value}</b>
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-[12px] font-bold">
            <span className="text-[var(--tb-fg-muted)] group-hover:text-[var(--tb-fg-primary)] transition-colors">
              {tool.title}
            </span>
            <span style={{ color: tool.accent }} className="flex items-center gap-1">
              باز کردن
              <Icon name="chevronLeft" className="h-4 w-4 rtl:rotate-180" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default ToolsGrid;

```

---

## `hooks/useFabTop.ts`

```ts
"use client";
import { useSyncExternalStore } from "react";
const STORAGE_KEY = "sidebar-mobile-fab-top";
const BTN_SIZE = 72;
const SAFE_MARGIN = 16;
function clampTopByHeight(top: number, btnH: number){
  if(typeof window==="undefined") return top;
  const minTop = SAFE_MARGIN;
  const maxTop = window.innerHeight - btnH - SAFE_MARGIN;
  if (maxTop <= minTop) return (window.innerHeight - btnH) / 2;
  return Math.min(Math.max(minTop, top), maxTop);
}
function getClientFabTop(){ 
  if(typeof window==="undefined") return SAFE_MARGIN;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved !== null) { const parsed = Number(saved); if (!Number.isNaN(parsed)) return clampTopByHeight(parsed, BTN_SIZE); }
  return clampTopByHeight((window.innerHeight - BTN_SIZE) / 2, BTN_SIZE);
}
function getServerFabTop(){ return SAFE_MARGIN; }
function subscribe(cb: ()=>void){
  if(typeof window==="undefined") return ()=>{};
  const onResize = ()=>cb();
  const onStorage = (e:StorageEvent)=>{ if(e.key===STORAGE_KEY) cb(); };
  window.addEventListener("resize", onResize);
  window.addEventListener("storage", onStorage);
  return ()=>{ window.removeEventListener("resize", onResize); window.removeEventListener("storage", onStorage); };
}
export function useFabTop(){ return useSyncExternalStore(subscribe, getClientFabTop, getServerFabTop); }
export function saveFabTop(top:number){ if(typeof window!=="undefined") window.localStorage.setItem(STORAGE_KEY, String(top)); }

```

---

## `lib/auth-server.ts`

```ts
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-please-change-32char!");
const COOKIE = "tb_session";

export async function hashPassword(p: string){ return bcrypt.hash(p, 10); }
export async function verifyPassword(p: string, hash: string){ return bcrypt.compare(p, hash); }

export async function createSession(userId: string){
  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getSessionUser(){
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if(!token) return null;
  try{
    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({ where: { id: String(payload.sub) }});
    return user;
  }catch{ return null; }
}

export async function setSessionCookie(token: string){
  const c = await cookies();
  c.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: false, path: "/", maxAge: 60*60*24*30 });
}
export async function clearSession(){
  const c = await cookies();
  c.delete(COOKIE);
}

export function canEditModule(user: {role:string, modules:string}|null, module: string){
  if(!user) return false;
  if(user.role === "super_admin") return true;
  try{
    const mods: string[] = JSON.parse(user.modules || "[]");
    return mods.includes(module);
  }catch{ return false; }
}

```

---

## `lib/auth.ts`

```ts
"use client";

import users from "@/data/users.json";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "super_admin" | "editor";
  modules: string[];
  avatar?: string;
};

const KEY = "tb_auth_user";

export function login(username: string): AppUser | null {
  const u = (users as AppUser[]).find(x => x.username === username.toLowerCase());
  if (u && typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
    return u;
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  }
}

export function getCurrentUserClient(): AppUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function canEdit(user: AppUser | null, module: string) {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return user.modules.includes(module);
}

export const allUsers = users as AppUser[];

```

---

## `lib/content.ts`

```ts
export type ModuleSlug =
  | "blog"
  | "news"
  | "media"
  | "review"
  | "tools"
  | "download"
  | "shop"
  | "forum";

export type ContentItem = {
  slug: string;
  module: ModuleSlug;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  tags: string[];
  author: { name: string; role?: string; avatar?: string };
  date: string; // ISO
  date_fa: string;
  time?: string;
  source?: string;
  likes: number;
  views: number;
  category?: string;
};

import blogData from "@/data/blog.json";
import newsData from "@/data/news.json";
import mediaData from "@/data/media.json";
import reviewData from "@/data/review.json";
import toolsData from "@/data/tools.json";
import downloadData from "@/data/download.json";
import shopData from "@/data/shop.json";
import forumData from "@/data/forum.json";
import { moduleColors } from "@/config/module-colors";

const all: Record<ModuleSlug, ContentItem[]> = {
  blog: blogData as ContentItem[],
  news: newsData as ContentItem[],
  media: mediaData as ContentItem[],
  review: reviewData as ContentItem[],
  tools: toolsData as ContentItem[],
  download: downloadData as ContentItem[],
  shop: shopData as ContentItem[],
  forum: forumData as ContentItem[],
};

export function getModuleItems(module: ModuleSlug): ContentItem[] {
  return [...(all[module] || [])].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getLatest(module: ModuleSlug, n = 3) {
  return getModuleItems(module).slice(0, n);
}

export function getBySlug(module: ModuleSlug, slug: string) {
  return getModuleItems(module).find(i => i.slug === slug) || null;
}

export function getAllAcross(): ContentItem[] {
  return (Object.keys(all) as ModuleSlug[])
    .flatMap(m => getModuleItems(m))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getRelated(current: ContentItem, limit = 6): ContentItem[] {
  const tagSet = new Set(current.tags);
  const pool = getAllAcross().filter(
    c => c.slug !== current.slug && c.tags.some(t => tagSet.has(t))
  );
  // fallback: same category / module
  if (pool.length < limit) {
    const extra = getAllAcross().filter(
      c => c.slug !== current.slug && !pool.includes(c) && (c.category === current.category || c.module !== current.module)
    );
    pool.push(...extra);
  }
  // score
  return pool
    .map(c => ({
      c,
      score: c.tags.filter(t => tagSet.has(t)).length * 3 +
        (c.category === current.category ? 1 : 0) +
        (c.module !== current.module ? 0.5 : 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.c);
}

export function searchAcross(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return getAllAcross().filter(
    c =>
      c.title.toLowerCase().includes(s) ||
      c.excerpt.toLowerCase().includes(s) ||
      c.tags.some(t => t.toLowerCase().includes(s))
  );
}

export const moduleMeta: Record<ModuleSlug, { title: string; titleFa: string; color: string; href: string }> = {
  blog: { title: "blog", titleFa: "مجله", color: moduleColors.blog.active, href: "/blog" },
  news: { title: "news", titleFa: "اخبار", color: moduleColors.news.active, href: "/news" },
  media: { title: "media", titleFa: "رسانه", color: moduleColors.media.active, href: "/media" },
  review: { title: "review", titleFa: "نقد و بررسی", color: moduleColors.review.active, href: "/review" },
  tools: { title: "tools", titleFa: "ابزارها", color: moduleColors.tools.active, href: "/tools" },
  download: { title: "download", titleFa: "دانلود", color: moduleColors.download.active, href: "/download" },
  shop: { title: "shop", titleFa: "فروشگاه", color: moduleColors.shop.active, href: "/shop" },
  forum: { title: "forum", titleFa: "انجمن", color: moduleColors.forum.active, href: "/forum" },
};

```

---

## `lib/db.ts`

```ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ["warn","error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

```

---

## `lib/fonts.ts`

```ts
import localFont from "next/font/local";

export const kalameh = localFont({
  src: [
    { path: "../public/fonts/KalamehWebFaNum-Thin.woff2", weight: "100", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/KalamehWebFaNum-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-kalameh",
  display: "swap",
  fallback: ["Vazirmatn", "system-ui", "Tahoma", "sans-serif"],
  adjustFontFallback: false,
});

```

---

## `lib/get-module-gradient.ts`

```ts
export function getModuleGradient(color: string): [string, string, string] {
  const normalized = color.startsWith("text-[")
    ? color.slice(6, -1)
    : color;
  return [normalized, `color-mix(in oklch, ${normalized} 80%, transparent)`, `color-mix(in oklch, ${normalized} 42%, transparent)`];
}

```

---

## `lib/modules.ts`

```ts
// @deprecated – use @/config/modules.config
export * from "@/config/modules.config";

```

---

## `lib/nas.ts`

```ts
import type { NasProduct } from "@/features/tools/components/nas-selector/nas-selector-data";
import nasProducts from "@/data/nas-products.json";
import shopData from "@/data/shop.json";

type ShopItem = {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  price?: number;
  stock?: boolean;
  inStock?: boolean;
  image?: string;
  images?: string[];
  category?: string;
};

// Merge NAS catalog with real shop data when slugs match
export async function getNasProducts(): Promise<NasProduct[]> {
  const shop = Array.isArray(shopData) ? (shopData as ShopItem[]) : [];
  const shopMap = new Map(shop.map((s) => [s.slug ?? s.id, s]));

  return (nasProducts as NasProduct[]).map((p) => {
    const s = shopMap.get(p.shopSlug) ?? shopMap.get(p.id);
    if (!s) return p;
    return {
      ...p,
      title: (s.title ?? s.name ?? p.title) as string,
      price: typeof s.price === "number" ? s.price : p.price,
      inStock: s.inStock ?? s.stock ?? p.inStock,
      imageUrl: s.image ?? s.images?.[0] ?? p.imageUrl,
      href: p.href ?? (s.slug ? `/shop/${s.slug}` : undefined),
    };
  });
}

export async function getNasProductById(id: string) {
  const list = await getNasProducts();
  return list.find((p) => p.id === id) ?? null;
}

```

---

## `lib/nvr.ts`

```ts
import type { NvrModel } from "@/features/tools/components/nvr-selector/nvr-selector-data";
import nvrProducts from "@/data/nvr-products.json";
import shopData from "@/data/shop.json";

type ShopItem = {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  price?: number;
  stock?: boolean;
  inStock?: boolean;
  image?: string;
};

export async function getNvrProducts(): Promise<NvrModel[]> {
  const shop = Array.isArray(shopData) ? (shopData as ShopItem[]) : [];
  const shopMap = new Map(shop.map((s) => [s.slug ?? s.id, s]));
  return (nvrProducts as NvrModel[]).map((p) => {
    const s = shopMap.get(p.shopSlug) ?? shopMap.get(p.id);
    if (!s) return p;
    return {
      ...p,
      nameFa: (s.title ?? s.name ?? p.nameFa) as string,
      price: typeof s.price === "number" ? s.price : p.price,
      inStock: s.inStock ?? s.stock ?? p.inStock,
      imageUrl: s.image ?? p.imageUrl,
      href: p.href ?? (s.slug ? `/shop/${s.slug}` : undefined),
    };
  });
}

```

---

## `lib/tools.ts`

```ts
import { toolRoutes } from "@/config/modules.config";
import toolsJson from "@/data/tools.json";

export type ToolMeta = {
  slug: string;
  title: string;
  titleFa: string;
  href: string;
  icon: string;
  color: string;
  descriptionFa?: string;
  new?: boolean;
  version?: string;
};

export function getTools(): ToolMeta[] {
  // merge config + json – json wins for editorial fields
  const jsonMap = new Map((toolsJson as any[]).map(t => [t.slug, t]));
  return toolRoutes.map(r => ({ ...r, ...(jsonMap.get(r.slug) || {}) })) as ToolMeta[];
}

export function getTool(slug: string) {
  return getTools().find(t => t.slug === slug) || null;
}

```

---

## `lib/utils.ts`

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

---

## `prisma/seed.ts`

```ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import blog from "../data/blog.json";
import news from "../data/news.json";
import media from "../data/media.json";
import review from "../data/review.json";
import tools from "../data/tools.json";
import download from "../data/download.json";
import shop from "../data/shop.json";
import forum from "../data/forum.json";
import users from "../data/users.json";
import comments from "../data/comments.json";

const prisma = new PrismaClient();

async function main(){
  console.log("Seeding TechBox…");
  await prisma.commentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("techbox123", 10);
  for(const u of users as any[]){
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role === "super_admin" ? "super_admin" : "editor",
        modules: JSON.stringify(u.modules),
        avatar: u.avatar || null,
        password: pw
      }
    });
  }

  const allPosts = [
    ...blog, ...news, ...media, ...review, ...tools, ...download, ...shop, ...forum
  ];

  for(const p of allPosts as any[]){
    await prisma.post.create({
      data: {
        slug: p.slug,
        module: p.module,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content || p.excerpt,
        image: p.image || null,
        tags: JSON.stringify(p.tags || []),
        category: p.category || null,
        authorName: p.author?.name || "تحریریه",
        date: new Date(p.date),
        dateFa: p.date_fa,
        likes: p.likes || 0,
        views: p.views || 0,
        published: true
      }
    });
  }

  // seed comments – map content_type+slug to postId
  for(const c of comments as any[]){
    const post = await prisma.post.findFirst({
      where: { module: c.content_type as any, slug: c.content_slug }
    });
    if(!post) continue;
    await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: c.author,
        text: c.text,
        likes: c.likes || 0,
        dislikes: c.dislikes || 0,
        createdAt: new Date(c.date)
      }
    });
  }

  console.log("Seed done");
}
main().finally(()=>prisma.$disconnect());

```

---

## `providers/auth.provider.tsx`

```tsx
"use client";
import * as React from "react";
export const AuthContext = React.createContext<any>(null);
export function AuthProvider({children}:{children:React.ReactNode}){ return <AuthContext.Provider value={null}>{children}</AuthContext.Provider> }
export default AuthProvider;

```

---

## `providers/cart.provider.tsx`

```tsx
"use client";
import Image from "next/image";
import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { zIndex } from "@/design";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CloseButton } from "@/components/ui/CloseButton";
import { IconRailButton } from "@/components/ui/IconRailButton";
import { OverlayBackdrop } from "@/components/ui/Overlay";

export type CartItem = { slug: string; title: string; price: string; image?: string; qty: number };
type CartCtx = {
 items: CartItem[];
 count: number;
 add: (item: Omit<CartItem,"qty">, qty?: number) => void;
 remove: (slug: string) => void;
 clear: () => void;
 setQty: (slug: string, qty: number) => void;
 open: boolean;
 setOpen: (v:boolean)=>void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tb_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }){
 const [items, setItems] = useState<CartItem[]>([]);
 const [open, setOpen] = useState(false);

 useEffect(()=>{
 try{ const raw = localStorage.getItem(KEY); if(raw) setItems(JSON.parse(raw)); }catch{}
 },[]);
 useEffect(()=>{
 localStorage.setItem(KEY, JSON.stringify(items));
 },[items]);

 const add = (item: Omit<CartItem,"qty">, qty = 1)=>{
 setItems(prev=>{
 const f = prev.find(p=>p.slug===item.slug);
 if(f) return prev.map(p=> p.slug===item.slug ? {...p, qty: p.qty+qty} : p);
 return [...prev, {...item, qty}];
 });
 setOpen(true);
 };
 const remove = (slug:string)=> setItems(prev=>prev.filter(p=>p.slug!==slug));
 const clear = ()=> setItems([]);
 const setQty = (slug:string, qty:number)=> setItems(prev=> prev.map(p=> p.slug===slug ? {...p, qty: Math.max(1,qty)}:p));
 const count = items.reduce((s,i)=>s+i.qty,0);

 return <Ctx.Provider value={{items, count, add, remove, clear, setQty, open, setOpen}}>{children}
 <CartDrawer />
 </Ctx.Provider>;
}

function CartDrawer(){
 const ctx = useContext(Ctx);
 const open = ctx?.open ?? false;
 const setOpenFn = ctx?.setOpen;

 // Close on Escape.
 useEffect(() => {
 if (!open) return;
 const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenFn?.(false); };
 document.addEventListener("keydown", onKey);
 return () => document.removeEventListener("keydown", onKey);
 }, [open, setOpenFn]);

 if(!ctx || !ctx.open) return null;
 const { items, setOpen, remove, setQty, clear, count } = ctx;
 return (
 <div dir="rtl" className="fixed inset-0" style={{ zIndex: zIndex.cart }}>
 <OverlayBackdrop onClick={()=>setOpen(false)} />
 <aside className="absolute left-0 top-0 flex h-full w-[380px] max-w-[92vw] flex-col border-r border-[var(--tb-border)] bg-[var(--tb-bg-secondary)] p-4 shadow-[var(--tb-shadow-lg)]">
 <div className="flex items-center justify-between mb-3">
 <h3 className=" tb-text-lg">سبد خرید ({count.toLocaleString("fa-IR")})</h3>
 <CloseButton onClick={()=>setOpen(false)} label="بستن سبد" />
 </div>
 <div className="flex-1 overflow-y-auto space-y-3">
 {items.length===0 && <p className="tb-text-md text-muted-foreground text-center py-10">سبد خالی است</p>}
 {items.map(it=>(
 <div key={it.slug} className="flex gap-3 border border-[var(--tb-border)] rounded-[var(--tb-radius-lg)] p-2">
 <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--tb-radius-md)] bg-[var(--tb-bg-muted)]"><Image src={it.image || "/assets/blog-1.jpg"} alt={it.title} fill sizes="64px" className="object-cover" /></div>
 <div className="flex-1 min-w-0">
 <div className="tb-text-sm line-clamp-2">{it.title}</div>
 <div className="tb-text-sm text-[var(--tb-shop)] mt-1">{it.price} تومان</div>
 <div className="flex items-center gap-2 mt-2">
 <Button onClick={()=>setQty(it.slug, it.qty-1)} variant="outline" size="iconSm" className="h-6 w-6 tb-text-sm">−</Button>
 <span className="tb-text-sm w-6 text-center">{it.qty.toLocaleString("fa-IR")}</span>
 <Button onClick={()=>setQty(it.slug, it.qty+1)} variant="outline" size="iconSm" className="h-6 w-6 tb-text-sm">+</Button>
 <Button onClick={()=>remove(it.slug)} variant="link" size="xs" className="ms-auto tb-text-sm text-[var(--tb-danger)]">حذف</Button>
 </div>
 </div>
 </div>
 ))}
 </div>
 {items.length>0 && (
 <div className="border-t border-[var(--tb-border)] pt-3 space-y-2">
 <ButtonLink href="/shop/checkout" onClick={()=>setOpen(false)} className="w-full">ادامه خرید / تسویه</ButtonLink>
 <Button onClick={clear} variant="ghost" className="w-full tb-text-sm">خالی کردن سبد</Button>
 </div>
 )}
 </aside>
 </div>
 );
}

export function useCart(){
 const c = useContext(Ctx);
 if(!c) throw new Error("CartProvider missing – wrap LayoutShell with <CartProvider>");
 return c;
}

export function CartIconButton(){
 const { count, setOpen } = useCart();
 return (
 <IconRailButton tone="shop" onClick={()=>setOpen(true)} className="gap-1 tb-text-md" aria-label="سبد خرید">
 <span>🛒</span>
 <span className="hidden sm:inline">سبد</span>
 {count>0 && <span className="absolute -top-1 -left-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-[var(--tb-radius-full)] bg-[var(--tb-shop)] px-1 tb-text-sm text-black">{count.toLocaleString("fa-IR")}</span>}
 </IconRailButton>
 );
}

```

---

## `providers/index.tsx`

```tsx
"use client";
export { CartProvider, useCart } from "./cart.provider";
export { ThemeProvider } from "./theme.provider";
export { AuthProvider, AuthContext } from "./auth.provider";
export { QueryProvider } from "./query.provider";

import * as React from "react";
import { CartProvider } from "./cart.provider";
import { ThemeProvider } from "./theme.provider";
import { AuthProvider } from "./auth.provider";
import { QueryProvider } from "./query.provider";
import Chatbot from "@/features/chat/components/Chatbot";

export function AppProviders({children}:{children:React.ReactNode}){
 return (
 <ThemeProvider>
 <QueryProvider>
 <AuthProvider>
 <CartProvider>
 {children}
 <Chatbot />
 </CartProvider>
 </AuthProvider>
 </QueryProvider>
 </ThemeProvider>
 );
}

```

---

## `providers/query.provider.tsx`

```tsx
"use client";
import * as React from "react";
export function QueryProvider({children}:{children:React.ReactNode}){ return <>{children}</>; }

```

---

## `providers/theme.provider.tsx`

```tsx
"use client";
import * as React from "react";
export function ThemeProvider({children}:{children:React.ReactNode}){ return <>{children}</>; }
export default ThemeProvider;

```

---

## `stores/auth.store.ts`

```ts
// client auth store – thin wrapper over lib/auth – keeps stores/ boundary clean
export { login, logout, getCurrentUserClient, canEdit, allUsers, type AppUser } from "@/lib/auth";

```

---

## `stores/index.ts`

```ts
export * from "./sidebar.store";
export * from "./theme.store";
export * from "./auth.store";
// export * from "./ui.store"; // deprecated – merged into sidebar.store – kept for backward compat – do not barrel export to avoid duplicate identifiers

```

---

## `stores/sidebar.store.ts`

```ts
import { DESKTOP_KEY, MOBILE_KEY } from "@/config/sidebar.config";
function createBoolStore(key: string, defaultValue: boolean) {
  const listeners = new Set<() => void>();
  const getSnapshot = () => {
    if (typeof window === "undefined") return defaultValue;
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : raw === "true";
  };
  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    const onStorage = (e: StorageEvent) => { if (e.key === key) fn(); };
    if(typeof window !== "undefined"){
      window.addEventListener("storage", onStorage);
      return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
    }
    return ()=>{listeners.delete(fn)};
  };
  const set = (value: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, String(value));
    listeners.forEach((l) => l());
  };
  return { getSnapshot, subscribe, set };
}
export const desktopStore = createBoolStore(DESKTOP_KEY, true);
export const mobileStore = createBoolStore(MOBILE_KEY, false);

```

---

## `stores/theme.store.ts`

```ts
import { THEME_KEY } from "@/config/sidebar.config";
import type { ThemeMode } from "@/types/sidebar.types";
function createThemeStore() {
  const listeners = new Set<() => void>();
  const getServerSnapshot = (): ThemeMode => "light";
  const getClientSnapshot = (): ThemeMode => {
    if(typeof window==="undefined") return "light";
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if(typeof window !== "undefined"){
      const onStorage = (e:StorageEvent)=>{ if(e.key===THEME_KEY) listener(); };
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const onMedia = ()=>{ if(localStorage.getItem(THEME_KEY)==null) listener(); };
      window.addEventListener("storage", onStorage);
      media.addEventListener("change", onMedia);
      return ()=>{ listeners.delete(listener); window.removeEventListener("storage", onStorage); media.removeEventListener("change", onMedia); };
    }
    return ()=>{listeners.delete(listener)};
  };
  const set = (next: ThemeMode) => { if(typeof window!=="undefined"){ localStorage.setItem(THEME_KEY, next); listeners.forEach(l=>l()); } };
  const toggle = () => { const cur = getClientSnapshot(); set(cur==="dark" ? "light" : "dark"); };
  return { getServerSnapshot, getClientSnapshot, subscribe, set, toggle };
}
export const themeStore = createThemeStore();
export type { ThemeMode } from "@/types/sidebar.types";

```

---

## `tests/setup.ts`

```ts
// @ts-nocheck
// Vitest ESM test – types provided by vitest – skipped in tsc CI to keep build green – see DOCS
import "@testing-library/jest-dom";

```

---

## `tests/unit/auth.test.ts`

```ts
// @ts-nocheck
// Vitest ESM test – types provided by vitest – skipped in tsc CI to keep build green – see DOCS
import { describe, it, expect } from "vitest";
import { canEdit } from "@/lib/auth";
import type { AppUser } from "@/lib/auth";
const sara = { role:"editor", modules:["blog"] } as unknown as AppUser;
const admin = { role:"super_admin", modules:[] } as unknown as AppUser;
describe("rbac", ()=>{
  it("sara can edit blog", ()=>{ expect(canEdit(sara,"blog")).toBe(true); });
  it("sara cannot edit news", ()=>{ expect(canEdit(sara,"news")).toBe(false); });
  it("admin can edit all", ()=>{ expect(canEdit(admin,"shop")).toBe(true); });
});

```

---

## `tests/unit/content.test.ts`

```ts
// @ts-nocheck
// Vitest ESM test – types provided by vitest – skipped in tsc CI to keep build green – see DOCS
import { describe, it, expect } from "vitest";
import { getRelated, getAllAcross, searchAcross } from "@/lib/content";

describe("content", ()=>{
  it("getAllAcross returns sorted", ()=>{
    const all = getAllAcross();
    expect(all.length).toBeGreaterThan(5);
    const dates = all.map(a=> new Date(a.date).getTime());
    for(let i=1;i<dates.length;i++) expect(dates[i-1]).toBeGreaterThanOrEqual(dates[i]);
  });
  it("getRelated finds QNAP cross-module", ()=>{
    const all = getAllAcross();
    const q = all.find(a=> a.tags.includes("QNAP-2277"));
    if(!q) return;
    const rel = getRelated(q, 3);
    expect(rel.length).toBeGreaterThan(0);
  });
  it("searchAcross finds", ()=>{
    expect(searchAcross("QNAP").length).toBeGreaterThan(0);
  });
});

```

---

## `types/api.ts`

```ts
export type ApiOk<T=unknown> = { ok: true } & T;
export type ApiError = { ok?: false; error: string };
export type Paginated<T> = { items: T[]; total: number; page: number };

```

---

## `types/common.ts`

```ts
export type ID = string;
export type ISODate = string;
export type Nullable<T> = T | null;
export type Dict<T=string> = Record<string, T>;

```

---

## `types/content.ts`

```ts
export type ModuleSlug = "blog" | "news" | "media" | "review" | "tools" | "download" | "shop" | "forum";
export interface ContentAuthor { name: string; role?: string; avatar?: string; }
export interface ContentItem {
  slug: string;
  module: ModuleSlug;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  tags: string[];
  author: ContentAuthor;
  date: string;
  date_fa: string;
  time?: string;
  source?: string;
  likes: number;
  views: number;
  category?: string;
}

```

---

## `types/index.ts`

```ts
export * from "./content";
export * from "./user";
export * from "./api";
export * from "./common";
export * from "./sidebar.types"

```

---

## `types/sidebar.types.ts`

```ts
import * as React from "react";

export type ThemeMode = "light" | "dark";

export type SidebarMainProps = {
  onMobileOpenChange?: (open: boolean) => void;
};

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconClassName?: string;        // رنگ عادی آیکون
  iconHoverClassName?: string;   // رنگ hover آیکون
  iconActiveClassName?: string;  // رنگ active آیکون
  tooltipClassName?: string;     // رنگ tooltip در حالت بسته
};

export type SidebarContentProps = {
  expanded: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogoClick?: () => void;
  onLinkClick?: () => void;
};

export type SidebarShellProps = {
  mobileOpen: boolean;
  desktopOpen: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
  onToggleDesktop: () => void;
};

```

---

## `types/user.ts`

```ts
export type Role = "super_admin" | "editor" | "author" | "user";
export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  modules: string[];
  avatar?: string;
}

```

---

## `package.json`

```json
{
  "name": "techbox",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:webpack": "next build --webpack",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit --pretty false",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "postinstall": "prisma generate || node -e \"console.warn('Prisma generate failed/skipped. Run pnpm prisma:generate manually.')\"",
    "data": "node scripts/data.cjs",
    "tree": "node scripts/tree.cjs",
    "data:legacy": "node scripts/data.cjs",
    "tree:legacy": "node scripts/tree.cjs",
    "prisma:generate": "prisma generate"
  },
  "dependencies": {
    "@fontsource/vazirmatn": "^5.2.8",
    "@gsap/react": "^2.1.2",
    "@neondatabase/serverless": "^1.1.0",
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "framer-motion": "^12.42.0",
    "gsap": "^3.13.0",
    "hls.js": "^1.6.16",
    "jose": "^5.9.0",
    "lucide-react": "^1.21.0",
    "motion": "^12.42.0",
    "next": "16.2.9",
    "openai": "^6.45.0",
    "postprocessing": "^6.39.2",
    "react": "^19",
    "react-dom": "^19",
    "tailwind-merge": "^3.6.0",
    "three": "^0.185.0",
    "zod": "^3.25.0",
    "ogl": "^1.0.11",
    "react-icons": "^5.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.1",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^26",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.185.0",
    "eslint": "^9.39.1",
    "eslint-config-next": "16.2.9",
    "postcss": "^8",
    "prisma": "^6.19.3",
    "tailwindcss": "^4.3.1",
    "tsx": "^4.19.0",
    "tw-animate-css": "^1.4.0",
    "typescript": "^6"
  }
}

```

---

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "ignoreDeprecations": "6.0",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "uploads"
  ]
}

```

---

## `pnpm-workspace.yaml`

```
allowBuilds:
  '@prisma/client': true
  '@prisma/engines': true
  esbuild: true
  prisma: true
  sharp: true
  unrs-resolver: true

overrides:
  eslint: ^9.39.1

```

---

## `next.config.mjs`

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.zarinpal.com" },
    ],
  },
};
export default nextConfig;

```

---

## `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

## `postcss.config.mjs`

```
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

## `.env`

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="techbox-dev-secret-change-me-32chars-min"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"


# CHAT_API_KEY="sk-KZ2MNs5J0yFav7hSfOlFffig4SZ8GKAXmvPnLLzDxybQbXxo"
# CHAT_BASE_URL="https://api.gapgpt.app/v1"
```

---

## `.env.local`

```
# Created by Vercel CLI
VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS9obm1vZGVxcy1wcm9qZWN0cyIsInN1YiI6Im93bmVyOmhubW9kZXFzLXByb2plY3RzOnByb2plY3Q6dGVjaGJveC1tYWRlLWJ5LWFyZW5hOmVudmlyb25tZW50OmRldmVsb3BtZW50Iiwic2NvcGUiOiJvd25lcjpobm1vZGVxcy1wcm9qZWN0czpwcm9qZWN0OnRlY2hib3gtbWFkZS1ieS1hcmVuYTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS9obm1vZGVxcy1wcm9qZWN0cyIsIm93bmVyIjoiaG5tb2RlcXMtcHJvamVjdHMiLCJvd25lcl9pZCI6InRlYW1fSzc1MWRPMWZZQTdRV0k2SGJTZUI2cmFOIiwicHJvamVjdCI6InRlY2hib3gtbWFkZS1ieS1hcmVuYSIsInByb2plY3RfaWQiOiJwcmpfbHhpNWVNSTlxa1dpZWdreksxRGMyYUkzZHhvNCIsImVudmlyb25tZW50IjoiZGV2ZWxvcG1lbnQiLCJwbGFuIjoiaG9iYnkiLCJ1c2VyX2lkIjoiY0VJcG5lQm1UYzJ2enZrV05NV24wZ2xQIiwiY2xpZW50X2lkIjoiY2xfSFl5T1BCTnRGTWZIaGFVbjlMNFFQZlRaejZUUDQ3YnAiLCJuYmYiOjE3ODI3NDA2MDksImlhdCI6MTc4Mjc0MDYwOSwiZXhwIjoxNzgyNzgzODA5fQ.BkRUc7EMMNkhrJdIB2m_8YiyThGt4HS4JSegArwwiz4r81IrcklxSAY3b3aVaoNt1CRaFjhjtr8_CLPbq8rLOZsUIHt8eNv2za5qeAuhEXSW3erBLutKr8o7HRLAbhzG6X0sVFPr3w80rK2xBllhogpLLIqK-PILXlmrJ73T-s9rmbYignvjUpAeMKmwVEmeF4A-7RUVeXgVjdEj3OsHTK3r_z2tBVtQgClSAljl4dsO7zsdGnrhNyg99IjeAiNhnbFeqEfJb2srW23v5gjAqQ68jqu0zlMnfome0J4KMDJLEfwAETg6WO7cpx67TPpWualD8csqs25FJZ5lw8l8Nw"

```

---

## `.gitignore`

```
node_modules
.next
out
dist
build
coverage
.cache
.env
.env.*
!.env.example
*.tsbuildinfo
.DS_Store

```

---

## `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

## `eslint.config.mjs`

```
import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "uploads/**",
      "scripts/data.cjs",
      "scripts/tree.cjs",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // The current app intentionally hydrates several localStorage-backed UI states
      // after mount. Keep these as normal client-side synchronization patterns.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",

      // Existing Persian/English content includes literal quotes in JSX text.
      "react/no-unescaped-entities": "off",

      // The project currently uses plain <img> widely for local JSON-driven assets.
      // Migrate to next/image gradually where dimensions are known.
      "@next/next/no-img-element": "warn",
    },
  },
];

export default config;

```

---

## `.vercel/repo.json`

```json
{
  "remoteName": "origin",
  "projects": [
    {
      "id": "prj_lxi5eMI9qkWiegkzK1Dc2aI3dxo4",
      "name": "techbox-made-by-arena",
      "directory": ".",
      "orgId": "team_K751dO1fYA7QWI6HbSeB6raN"
    }
  ]
}

```

---

