import HeroSection from "@/components/sections/hero-section";
import HomeModulesSection from "@/components/sections/home-modules-section";
import NewsTicker from "@/components/sections/home-news-ticker-section";
import BlogSection from "@/components/sections/blog-section";
import newsData from "@/data/news.json";

export default function Page() {
  return (
    <main className="relative flex flex-col gap-12">
      <HeroSection />
      
      <div className="space-y-20">
        <NewsTicker items={newsData} />
        <HomeModulesSection />
        
        <div className="bg-background/40 backdrop-blur-md border-y border-border/50">
           <div className="max-w-7xl mx-auto px-6 pt-12">
              <h2 className="text-3xl font-black text-right">آخرین مطالب مجله</h2>
           </div>
           <BlogSection />
        </div>
      </div>
    </main>
  );
}
