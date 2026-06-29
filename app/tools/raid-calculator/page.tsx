import RaidCalculator from "@/features/tools/components/RaidCalculator";
export const metadata = { title: "ماشین حساب RAID | تکباکس" };
export default function Page(){
  return (
    <main className="max-w-4xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-2xl font-black mb-2" style={{color:"var(--accent-cyan)"}}>RAID Calculator</h1>
      <p className="text-sm mb-6" style={{color:"var(--muted-foreground)"}}>محاسبه ظرفیت مفید، تحمل خطا و راندمان – اجرا مستقیم در مرورگر</p>
      <RaidCalculator />
      <div className="text-[11px] mt-4" style={{color:"var(--muted-foreground)"}}>
        راهنما: <a href="/blog/hp-raid-config" className="underline" style={{color:"var(--accent-cyan)"}}>راهنمای RAID در سرورهای HP – بلاگ تکباکس</a>
      </div>
    </main>
  );
}
