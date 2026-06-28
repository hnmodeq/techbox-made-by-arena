import Image from "next/image";
import posts from "@/data/posts.json";
import { cn } from "@/lib/utils";

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
  );
}
