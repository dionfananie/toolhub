/**
 * Blog type definitions for Toolhub.
 */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime?: string;
  author?: string;
  content: string;
}
