"use client";
import { useEffect, useState, useCallback } from "react";
import { CommentVote } from "@/components/ui/LikeButton";

type CommentRow = {
  id: string;
  parentId: string | null;
  authorName: string;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  replies?: CommentRow[];
};

export default function CommentSection({ module, slug }: { module: string; slug: string }) {
  const [list, setList] = useState<CommentRow[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async ()=>{
    setLoading(true);
    try{
      const r = await fetch(`/api/comments?module=${encodeURIComponent(module)}&slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
      if(r.ok){
        const data = await r.json();
        // nest
        const map = new Map<string, CommentRow & {replies: CommentRow[]}>();
        data.forEach((c:any)=> map.set(c.id, {...c, replies: []}));
        const roots: any[] = [];
        map.forEach(c=>{
          if(c.parentId && map.has(c.parentId)){
            map.get(c.parentId)!.replies.push(c);
          } else {
            roots.push(c);
          }
        });
        setList(roots);
        return;
      }
    }catch{}
    // fallback seed
    setList([]);
    setLoading(false);
  }, [module, slug]);

  useEffect(()=>{ load().finally(()=>setLoading(false)); }, [load]);

  const submit = async (e: React.FormEvent, parentId: string | null = null)=>{
    e.preventDefault();
    const bodyText = parentId ? (document.getElementById(`reply-text-${parentId}`) as HTMLTextAreaElement)?.value : text;
    const author = name.trim() || "مهمان";
    if(!bodyText?.trim()) return;
    try{
      const res = await fetch("/api/comments", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          postModule: module,
          postSlug: slug,
          text: bodyText.trim(),
          authorName: author,
          parentId
        })
      });
      if(res.ok){
        if(parentId){ setReplyTo(null); const el = document.getElementById(`reply-text-${parentId}`) as HTMLTextAreaElement; if(el) el.value=""; }
        else { setText(""); }
        await load();
        return;
      }
    }catch{}
    // local fallback
    alert("نظر ثبت شد (حالت آفلاین – لوکال)");
  };

  const renderComment = (c: CommentRow, depth=0)=>(
    <div key={c.id} className={`${depth>0 ? "ms-4 sm:ms-8 border-r-2 pe-3" : ""}`} style={{borderColor: depth>0 ? "var(--border)" : "transparent"}}>
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="font-bold text-[13px]">{c.authorName}</div>
          <div className="text-[10px]" style={{color:"var(--muted-foreground)"}}>
            {new Date(c.createdAt).toLocaleString("fa-IR", {dateStyle:"medium", timeStyle:"short"})}
          </div>
        </div>
        <p className="text-[13px] leading-7 mt-2" style={{color:"var(--muted-foreground)", whiteSpace:"pre-wrap"}}>{c.text}</p>
        <div className="flex items-center gap-4 mt-3">
          <CommentVote id={c.id} initialLikes={c.likes} initialDislikes={c.dislikes} />
          <button onClick={()=> setReplyTo(replyTo===c.id ? null : c.id)} className="text-[11px] text-muted-foreground hover:text-foreground">
            {replyTo===c.id ? "بستن" : "پاسخ"}
          </button>
        </div>
        {replyTo===c.id && (
          <form onSubmit={(e)=>submit(e, c.id)} className="mt-3 space-y-2">
            <textarea id={`reply-text-${c.id}`} className="input text-xs min-h-[80px]" placeholder={`پاسخ به ${c.authorName}…`} required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setReplyTo(null)} className="btn btn-ghost text-[11px]">انصراف</button>
              <button className="btn btn-primary text-[11px]">ارسال پاسخ</button>
            </div>
          </form>
        )}
      </div>
      {c.replies && c.replies.length>0 && (
        <div className="mt-3 space-y-3">
          {c.replies.map(r=> renderComment(r, depth+1))}
        </div>
      )}
    </div>
  );

  return (
    <section className="mt-14 border-t pt-10" style={{borderColor:"var(--border)"}}>
      <h3 className="text-xl font-extrabold mb-5">نظرات ({list.reduce((s,c)=> s+1+(c.replies?.length||0),0).toLocaleString("fa-IR")})</h3>

      <form onSubmit={(e)=>submit(e,null)} className="card p-4 mb-8 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input sm:col-span-1 text-sm" placeholder="نام شما" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input sm:col-span-2 text-sm" placeholder="ایمیل (اختیاری – عمومی نمی‌شود)" />
        </div>
        <textarea className="input min-h-[110px] text-sm" placeholder="نظر خود را بنویسید…" value={text} onChange={e=>setText(e.target.value)} required />
        <div className="flex justify-between items-center">
          <span className="text-[11px]" style={{color:"var(--muted-foreground)"}}>ارسال نظر = موافقت با قوانین – API: POST /api/comments</span>
          <button className="btn btn-primary text-sm" type="submit">ارسال نظر</button>
        </div>
      </form>

      <div className="space-y-4 min-h-[80px]">
        {loading ? <p className="text-sm text-muted-foreground">در حال بارگذاری…</p> : list.length===0 ? (
          <p className="text-sm text-muted-foreground">اولین نظر را شما ثبت کنید.</p>
        ) : list.map(c=> renderComment(c))}
      </div>
    </section>
  );
}
