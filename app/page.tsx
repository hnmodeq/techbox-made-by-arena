import HeroSection from "@/components/sections/hero-section";
import HomeModulesSection from "@/components/sections/home-modules-section";
import NewsTicker from "@/components/sections/home-news-ticker-section";
import { getAllAcross } from "@/lib/content";

export default function Page() {
  // news ticker = latest from news + blog (force news)
  const ticker = getAllAcross()
    .filter(i => ["news","blog"].includes(i.module))
    .slice(0, 12);
  return (
    <main className="relative">
      <HeroSection />
      <NewsTicker items={ticker} className="pb-10" />
      <HomeModulesSection />
    </main>
  )
}
