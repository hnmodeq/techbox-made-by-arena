"use client";
import { getModuleItems, moduleMeta } from "@/lib/content";
import Link from "next/link";

export default function NewsList() {
  const items = getModuleItems("news");
  const meta = moduleMeta.news;
  const mainNews = items.slice(0, 4);
  const forceNews = items.slice(4).concat(items.slice(0,2));

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-12" dir="rtl">
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" style={{boxShadow:"0 0 12px rgba(244,63,94,.45)"}} />
        <h1 className="text-[28px] md:text-[32px] font-black" style={{color:"var(--foreground)"}}>اخبار تکنولوژی</h1>
        <span className="text-[11px] px-2 py-1 rounded-full" style={{background:"rgba(244,63,94,.1)", color:"#fb7185", border:"1px solid rgba(244,63,94,.25)"}}>زنده</span>
        <span className="text-[11px]" style={{color:"var(--muted-foreground)"}}>با منبع و ساعت انتشار</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-7 items-start">
        {/* RIGHT – main news */}
        <section className="lg:col-span-8 order-1 lg:order-2">
          <div className="grid sm:grid-cols-2 gap-5">
            {mainNews.map((n:any, i:number) => (
              <article key={n.slug} className={`card overflow-hidden group hover:shadow-lg transition-all ${i===0 ? "sm:col-span-2" : ""}`} style={{padding:0}}>
                <Link href={`/news/${n.slug}`} className="block relative aspect-[16/9] overflow-hidden" style={{background:"var(--muted)"}}>
                  <img src={n.image || ""} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 badge" style={{background:"rgba(0,0,0,.55)", color:"#fff", borderColor:"rgba(255,255,255,.2)"}}>{n.category}</span>
                  {n.source && (
                    <span className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-sky-500/90 text-white font-bold">📰 {n.source}</span>
                  )}
                </Link>
                <div className="p-4">
                  <div className="text-[11px] flex flex-wrap items-center gap-2" style={{color:"var(--muted-foreground)"}}>
                    <span>🕒 {n.date_fa} {n.time ? `• ${n.time}` : ""}</span>
                    <span>•</span>
                    <span>{n.author?.name || "تحریریه"}</span>
                    {n.source && <><span>•</span><span style={{color:"#7dd3fc"}}>منبع: {n.source}</span></>}
                  </div>
                  <h3 className="font-extrabold text-[16px] md:text-[18px] leading-7 mt-2 hover:text-rose-400 transition-colors">
                    <Link href={`/news/${n.slug}`}>{n.title}</Link>
                  </h3>
                  <p className="text-[13px] leading-6 line-clamp-2 mt-2" style={{color:"var(--muted-foreground)"}}>{n.excerpt}</p>
                  <div className="text-[11px] mt-3 flex gap-3" style={{color:"var(--muted-foreground)"}}>👁 {n.views.toLocaleString("fa-IR")} • ♥ {n.likes}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* LEFT – force news */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="card p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[15px]" style={{color:"#fb7185"}}>اخبار فوری</h3>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="relative">
              <div className="absolute right-[9px] top-1 bottom-1 w-px" style={{background:"linear-gradient(to bottom, rgba(244,63,94,.6), var(--border), transparent)"}} />
              <ul className="space-y-5">
                {(forceNews.length?forceNews:items).slice(0,8).map((f:any)=>(
                  <li key={f.slug} className="relative pe-7">
                    <span className="absolute right-0 top-[6px] w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{background:"var(--background)", border:"2px solid rgba(244,63,94,.55)"}}>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    </span>
                    <div className="text-[10px] flex items-center gap-2 flex-wrap" style={{color:"#fda4af"}}>
                      <span>🕒 {f.date_fa} {f.time||""}</span>
                      {f.source && <span className="px-1.5 py-0.5 rounded text-[9px]" style={{background:"rgba(14,165,233,.12)", color:"#7dd3fc"}}>{f.source}</span>}
                    </div>
                    <Link href={`/news/${f.slug}`} className="text-[13px] font-bold leading-6 hover:text-rose-400 block mt-1">{f.title}</Link>
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
