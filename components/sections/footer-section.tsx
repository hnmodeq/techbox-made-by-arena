import Link from "next/link";
import { cn } from "@/lib/utils";
import { Instagram, Twitter, Youtube } from "lucide-react";

const navigation = {
  main: [
    { name: "ارتباط با ما", href: "/contact" },
    { name: "درباره ما", href: "/about" },
    { name: "فرصت‌های شغلی", href: "/workwithus" },
    { name: "درخواست مشاوره", href: "/consultation" },
  ],
  social: [
    {
      name: "Instagram",
      href: "https://instagram.com/techbox",
      icon: Instagram,
    },
    {
      name: "Twitter",
      href: "https://x.com/techbox",
      icon: Twitter,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@techbox",
      icon: Youtube,
    },
  ],
};

export default function FooterSection() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2">
          {navigation.social.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-brand transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground md:justify-start">
            {navigation.main.map((item) => (
              <Link key={item.name} href={item.href} className="hover:text-foreground transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground md:text-right">
            &copy; {new Date().toLocaleDateString('fa-IR', { year: 'numeric' })} تمامی حقوق مادی و معنوی این وب‌سایت محفوظ و متعلق به شرکت «هونامیک ارتباط رستاک» می‌باشد.
          </p>
        </div>
      </div>
    </footer>
  );
}
