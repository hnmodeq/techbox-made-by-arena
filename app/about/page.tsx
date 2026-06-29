import users from "@/data/users.json";
import Link from "next/link";

export const metadata = { title: "درباره تکباکس" };

export default function About(){
  const team = (users as any[]).slice(0,6);
  return (
    <main className="max-w-6xl mx-auto px-4 py-14" dir="rtl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-black">درباره تکباکس</h1>
        <p className="text-muted-foreground mt-3 leading-8">
          تکباکس – پاتوق بچه‌های فناوری اطلاعات ایران. مجله، اخبار فوری، رسانه ویدیویی، نقد تخصصی، ابزارهای مهندسی، دانلود، فروشگاه زیرساخت و انجمن – همه در یک Bento feed زنده، با CMS نقش‌محور.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {[
          ["۸ ماژول", "محتوای یکپارچه"],
          ["۶ ویراستار تخصصی", "RBAC واقعی"],
          ["۱۴۰۵", "هونامیک ارتباط رستاک"],
        ].map(([k,v])=>(
          <div key={k as string} className="card p-5 text-center">
            <div className="text-2xl font-black text-brand">{k}</div>
            <div className="text-xs text-muted-foreground mt-1">{v}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-black mb-4">تیم تحریریه</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {team.map(u=>(
          <div key={u.username} className="card p-4 flex items-center gap-3">
            <img src={u.avatar || "/assets/hooman.png"} className="w-14 h-14 rounded-2xl object-cover ring-1 ring-border" alt="" />
            <div>
              <div className="font-bold text-[14px]">{u.name}</div>
              <div className="text-[11px] text-muted-foreground">{u.role==="super_admin" ? "مدیر کل" : "ویراستار"} • {u.modules.join("، ")}</div>
              <Link href={`/account`} className="text-[10px] text-brand hover:underline">مشاهده پروفایل →</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-3 card p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold">دفتر تهران</h3>
            <p className="text-xs text-muted-foreground mt-1">میرداماد، هونامیک ارتباط رستاک</p>
          </div>
          {/* OSM embed – works offline preview degraded, live works */}
          <iframe
            title="map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=51.41%2C35.75%2C51.45%2C35.77&layer=mapnik&marker=35.76%2C51.43"
            className="w-full h-[320px] border-0"
            loading="lazy"
          />
        </div>
        <div className="lg:col-span-2 space-y-3 text-sm leading-7 text-muted-foreground card p-5">
          <p>تماس: <span dir="ltr">021-9100xxxx</span></p>
          <p>ایمیل: info@techbox.ir</p>
          <p>ساعت کاری: شنبه–چهارشنبه ۹–۱۷</p>
          <Link href="/contact" className="btn btn-primary w-full mt-2 text-sm">ارتباط با ما</Link>
          <Link href="/consultation" className="btn btn-ghost w-full text-sm">درخواست مشاوره VIP</Link>
        </div>
      </div>
    </main>
  );
}
