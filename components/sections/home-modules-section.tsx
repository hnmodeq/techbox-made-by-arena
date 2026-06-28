import BentoCard from "@/components/bento-card";
import { modules } from "@/lib/modules";
import { cn } from "@/lib/utils";

export default function HomeModulesSection() {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-24">
      <div className="grid auto-rows-[240px] grid-cols-1 gap-6 md:grid-cols-7 lg:grid-cols-7">
        {sortedModules.map((module) => (
          <BentoCard
            key={module.slug}
            title={module.title}
            description={module.description}
            href={`/${module.slug}`}
            color={module.color}
            className={cn(module.cols, module.rows)}
          />
        ))}
      </div>
    </section>
  );
}
