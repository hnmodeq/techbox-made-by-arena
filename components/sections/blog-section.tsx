// components/sections/blog-section.tsx
import Image from "next/image"

const posts = [
  {
    id: 1,
    title: "نصب سیستم عامل بر روی سرور Dell",
    href: "#",
    description:
      "اینکه چطور بخوایم سیستم عامل یک سرور رو نصب و تنظیم کنیم نیاز به کمی حوصله داره چرا که همچین کاری برای کسانی که تجربه کافی ندارن اصلاً توصیه نمیشه. در ادامه با من همراه باشید.",
    imageUrl: "/assets/blog-1.jpg",
    date: "1 تیر 1405",
    datetime: "2026-06-22",
    category: { title: "آموزشی", href: "#" },
    author: {
      name: "هومن مدق",
      role: "کارشناس فناوری اطلاعات",
      href: "#",
      imageUrl: "/assets/hooman.png",
    },
  },
  {
    id: 2,
    title: "راهنمای کامل پیکربندی RAID در سرورهای HP",
    href: "#",
    description:
      "در این مقاله به‌صورت قدم‌به‌قدم نحوه ایجاد و مدیریت RAID را بررسی می‌کنیم تا بتوانید بهترین تعادل بین کارایی و امنیت اطلاعات را برای زیرساخت سازمان خود انتخاب کنید.",
    imageUrl: "/assets/blog-2.jpg",
    date: "5 تیر 1405",
    datetime: "2026-06-26",
    category: { title: "زیرساخت", href: "#" },
    author: {
      name: "عطیه حاتمی",
      role: "مهندس کامپیوتر",
      href: "#",
      imageUrl: "/assets/atiye.png",
    },
  },
  {
    id: 3,
    title: "بهینه‌سازی مصرف منابع در ماشین‌های مجازی VMware",
    href: "#",
    description:
      "اگر با کندی VMها یا مصرف بالای RAM و CPU روبه‌رو هستید، این مطلب به شما کمک می‌کند با تنظیمات درست، عملکرد پایدارتر و هزینه نگهداری کمتر داشته باشید.",
    imageUrl: "/assets/blog-3.jpeg",
    date: "9 تیر 1405",
    datetime: "2026-06-30",
    category: { title: "مجازی‌سازی", href: "#" },
    author: {
      name: "بهناز قادری",
      role: "طراح سایت",
      href: "#",
      imageUrl: "/assets/behnaz.png",
    },
  },
  {
    id: 4,
    title: "۱۰ نکته مهم برای افزایش امنیت شبکه داخلی سازمان",
    href: "#",
    description:
      "از تفکیک VLAN گرفته تا مدیریت دسترسی کاربران و مانیتورینگ ترافیک، این نکات کاربردی می‌توانند سطح امنیت شبکه داخلی شما را به شکل قابل توجهی افزایش دهند.",
    imageUrl: "/assets/blog-4.jpg",
    date: "13 تیر 1405",
    datetime: "2026-07-04",
    category: { title: "امنیت", href: "#" },
    author: {
      name: "نسترن خداکرمی",
      role: "فعال حوزه فناوری اطلاعات",
      href: "#",
      imageUrl: "/assets/nastaran.png",
    },
  },
  {
    id: 5,
    title: "آموزش مانیتورینگ سرورها با Zabbix از صفر تا اجرا",
    href: "#",
    description:
      "در این راهنما یاد می‌گیرید چطور Zabbix را نصب کنید، هاست‌ها را اضافه کنید، تریگرها را تنظیم کنید و داشبوردی کاربردی برای پایش دائمی سرویس‌های حیاتی بسازید.",
    imageUrl: "/assets/blog-5.jpg",
    date: "17 تیر 1405",
    datetime: "2026-07-08",
    category: { title: "مانیتورینگ", href: "#" },
    author: {
      name: "روژینا باقری",
      role: "کارشناس شبکه",
      href: "#",
      imageUrl: "/assets/rojina.png",
    },
  },
  {
    id: 6,
    title: "بررسی تفاوت NAS و SAN برای ذخیره‌سازی سازمانی",
    href: "#",
    description:
      "انتخاب بین NAS و SAN همیشه ساده نیست. در این مقاله مزایا، محدودیت‌ها و سناریوهای مناسب هرکدام را بررسی می‌کنیم تا انتخاب دقیق‌تری برای کسب‌وکارتان داشته باشید.",
    imageUrl: "/assets/blog-6.png",
    date: "21 تیر 1405",
    datetime: "2026-07-12",
    category: { title: "ذخیره‌سازی", href: "#" },
    author: {
      name: "هومن مدق",
      role: "کارشناس فناوری اطلاعات",
      href: "#",
      imageUrl: "/assets/hooman.png",
    },
  },
]

export default function BlogSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card group/card relative isolate flex flex-col gap-8 p-6 lg:flex-row"
              >
                <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-64 lg:shrink-0">
                  <Image
                    alt={post.title}
                    src={post.imageUrl}
                    className="absolute inset-0 size-full rounded-2xl bg-muted object-cover"
                    width={728}
                    height={405}
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/30" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={post.datetime} className="text-muted-foreground">
                        {post.date}
                      </time>
                      <span className="badge">
                        {post.category.title}
                      </span>
                    </div>
                    <div className="group relative max-w-xl">
                      <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover/card:text-accent-purple">
                        <a href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-muted-foreground line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex border-t border-border/50 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <Image
                        alt={post.author.name}
                        src={post.author.imageUrl}
                        className="size-10 rounded-full bg-muted object-cover ring-1 ring-border/30"
                        width={40}
                        height={40}
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">
                          <a href={post.author.href}>
                            <span className="absolute inset-0" />
                            {post.author.name}
                          </a>
                        </p>
                        <p className="text-muted-foreground">{post.author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
