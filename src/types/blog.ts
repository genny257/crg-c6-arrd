
export interface BlogPost {
  id: string;
  title: string;
  date: string; // ISO 8601 format
  excerpt: string;
  image?: string;
  imageHint?: string;
  slug: string;
  visible: boolean;
  content?: string; // Full content for the single post page
}
