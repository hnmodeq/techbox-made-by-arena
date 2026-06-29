"use client";
import { useEffect, useState, Suspense } from "react";
import { getCurrentUserClient, canEdit, type AppUser } from "@/lib/auth";
import { moduleMeta, type ModuleSlug, getBySlug } from "@/lib/content";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

function NewPostInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const modParam = (sp.get("module") as ModuleSlug) || "blog";
  const editSlug = sp.get("edit");
  const [user, setUser] = useState<AppUser | null>(null);
  const [module, setModule] = useState<ModuleSlug>(modParam);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  useEffect(()=>{ setUser(getCurrentUserClient()); },[]);
  useEffect(()=>{
    if (editSlug) {
      const it = getBySlug(module, editSlug);
      if (it) {
        setTitle(it.title); setSlug(it.slug); setExcerpt(it.excerpt);
        setTags(it.tags.join(", ")); setContent(it.content || "");
      }
    }
  }, [editSlug, module]);

  if (!user) return <main className="p-10 text-center" dir="rtl">ابتدا <Link className="text-brand underline" href="/admin/login">وارد شوید</Link></main>;
  if (!canEdit(user, module)) return <main className="p-10 text-center text-rose-400" dir="rtl">دسترسی ندارید</main>;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `tb_drafts_${module}`;
    const drafts = JSON.parse(localStorage.getItem(key) || "[]");
    const obj = {
      slug: slug || title.toLowerCase().replace(/\s+/g,"-"),
      title, excerpt, content,
      tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
      author: user.name,
      date: new Date().toISOString(),
    };
    if (editSlug) {
      const idx = drafts.findIndex((d:any)=>d.slug===editSlug);
      if (idx>=0) drafts[idx]=obj; else drafts.push(obj);
    } else {
      drafts.push(obj);
    }
    localStorage.setItem(key, JSON.stringify(drafts));
    alert("ذخیره شد (لوکال – دمو).");
    router.push(`/admin/posts?module=${module}`);
  };

  const allowed = (Object.keys(moduleMeta) as ModuleSlug[]).filter(m=>canEdit(user,m));

  return (
    <main className="max-w-3xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-2xl font-black mb-6">{editSlug ? "ویرایش مطلب" : "مطلب جدید"}</h1>
      <form onSubmit={save} className="card p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">ماژول</label>
            <select value={module} onChange={e=>setModule(e.target.value as ModuleSlug)} className="input mt-1">
              {allowed.map(m => <option key={m} value={m}>{moduleMeta[m].titleFa} ({m})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">اسلاگ</label>
            <input value={slug} onChange={e=>setSlug(e.target.value)} className="input mt-1" placeholder="my-post-slug" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">عنوان</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="input mt-1" required />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">خلاصه</label>
          <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} className="input min-h-[80px] mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">برچسب‌ها (با , جدا کنید – مثلا QNAP-2277, nas)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} className="input mt-1" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">محتوا</label>
          <textarea value={content} onChange={e=>setContent(e.target.value)} className="input min-h-[220px] mt-1" placeholder="متن کامل مقاله..." />
        </div>
        <div className="flex gap-3 justify-end">
          <Link href={`/admin/posts?module=${module}`} className="btn btn-ghost">انصراف</Link>
          <button className="btn btn-primary" type="submit">{editSlug ? "ذخیره تغییرات" : "انتشار"}</button>
        </div>
        <p className="text-[11px] text-muted-foreground">نویسنده: {user.name} • نقش: {user.role} • دسترسی: {user.modules.join(", ")}</p>
      </form>
    </main>
  );
}

export default function NewPostPage(){
  return (
    <Suspense fallback={<div className="p-10 text-center">در حال بارگذاری...</div>}>
      <NewPostInner />
    </Suspense>
  );
}
