import SubnetCalculator from "@/components/tools/subnet-calculator";
export const metadata = { title: "ماشین حساب Subnet | تکباکس" };
export default function Page(){
  return (
    <main className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-2xl font-black mb-2" style={{color:"var(--accent-cyan)"}}>Subnet Calculator فارسی</h1>
      <p className="text-sm mb-6" style={{color:"var(--muted-foreground)"}}>CIDR → Network / Broadcast / Host Range</p>
      <SubnetCalculator />
    </main>
  );
}
