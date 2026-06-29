import jobs from "@/data/jobs.json";
import Link from "next/link";

export const metadata = { title: "فرصت‌های شغلی | تکباکس" };

export default function WorkWithUs(){
  return (
    <main className="max-w-5xl mx-auto px-4 py-14" dir="rtl">
      <h1 className="text-3xl font-black mb-2">فرصت‌های شغلی تکباکس</h1>
      <p className="text-sm text-muted-foreground mb-8">به تیم رسانه زیرساخت ایران بپیوندید – {jobs.length} موقعیت فعال</p>

      <div className="grid gap-4">
        {jobs.map(j=>(
          <Link key={j.slug} href={`/workwithus/${j.slug}`} className="card p-5 hover:shadow-glass hover:-translate-y-0.5 transition-all group">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-[17px] group-hover:text-brand">{j.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{j.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
                  <span className="badge">{j.type}</span>
                  <span className="badge">{j.remote}</span>
                  <span className="badge">{j.team}</span>
                </div>
              </div>
              <div className="text-left text-[11px] text-muted-foreground">
                {j.date_fa}
                <div className="text-brand mt-1">مشاهده →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
