"use client";
import { useCart } from "@/components/shop/cart-context";
import Link from "next/link";

export default function CheckoutPage(){
  const { items, count, clear } = useCart();
  const totalItems = count;
  // mock total price – sum not calculated (prices are strings fa)
  return (
    <main className="max-w-5xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-2xl font-black mb-6 text-lime-400">تسویه حساب</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-4">
          <h3 className="font-bold">اطلاعات ارسال</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <input className="input" placeholder="نام و نام خانوادگی *" />
            <input className="input" placeholder="تلفن *" dir="ltr" />
            <input className="input sm:col-span-2" placeholder="آدرس" />
            <input className="input" placeholder="کد پستی" dir="ltr" />
            <select className="input"><option>تهران</option><option>اصفهان</option><option>مشهد</option><option>شیراز</option></select>
          </div>
          <h3 className="font-bold pt-2">پرداخت</h3>
          <div className="flex gap-3 text-xs">
            <label className="flex items-center gap-2"><input type="radio" name="pay" defaultChecked /> درگاه زرین‌پال</label>
            <label className="flex items-center gap-2"><input type="radio" name="pay" /> کارت به کارت</label>
          </div>
          <button onClick={()=>{alert("سفارش ثبت شد – دموی تکباکس"); clear();}} className="btn btn-primary w-full">پرداخت و ثبت نهایی</button>
          <p className="text-[11px] text-muted-foreground">تست – بدون پرداخت واقعی. سبد در localStorage ذخیره می‌شود.</p>
        </div>
        <div className="card p-5 h-fit">
          <h4 className="font-bold mb-3">خلاصه سبد ({totalItems.toLocaleString("fa-IR")} قلم)</h4>
          <div className="space-y-2 max-h-72 overflow-y-auto text-[12px]">
            {items.length===0 ? <p className="text-muted-foreground">سبد خالی است – <Link href="/shop" className="text-lime-400 underline">رفتن به فروشگاه</Link></p> :
              items.map(i=>(
                <div key={i.slug} className="flex justify-between border-b border-border/40 pb-2">
                  <span className="truncate ps-2">{i.title} × {i.qty.toLocaleString("fa-IR")}</span>
                  <span className="text-muted-foreground">{i.price}</span>
                </div>
              ))
            }
          </div>
          <div className="mt-3 pt-3 border-t border-border text-sm flex justify-between font-bold">
            <span>جمع</span><span>تماس بگیرید</span>
          </div>
        </div>
      </div>
    </main>
  );
}
