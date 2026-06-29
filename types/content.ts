export type ModuleSlug = "blog" | "news" | "media" | "review" | "tools" | "download" | "shop" | "forum";
export interface ContentAuthor { name: string; role?: string; avatar?: string; }
export interface ContentItem {
  slug: string;
  module: ModuleSlug;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  tags: string[];
  author: ContentAuthor;
  date: string;
  date_fa: string;
  time?: string;
  source?: string;
  likes: number;
  views: number;
  category?: string;
}
