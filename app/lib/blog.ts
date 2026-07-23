/**
 * Blog article loading and parsing utility.
 *
 * Uses Vite's import.meta.glob to load all markdown files at build time,
 * parses YAML-like frontmatter, and provides lookup functions by slug.
 *
 * Frontmatter fields vary across articles — this utility normalizes them:
 *   - slug:    explicit or derived from filename
 *   - date:    date | published | pubDate
 *   - author:  author field or "Toolhub"
 *   - readingTime: parsed from string or number
 */

/**
 * Editorial pillar categories. Used for filter tabs in the blog listing.
 */
export const BLOG_CATEGORIES = [
  "All",
  "Developer Tools",
  "Design Engineering",
  "Productivity",
  "Tech Trends",
  "Behind the Scenes",
] as const;

/**
 * Normalize raw categories and slugs to the pillar names above.
 */
const CATEGORY_MAP: Record<string, string> = {
  "developer tools": "Developer Tools",
  "developer tools & workflow": "Developer Tools",
  "produktivitas": "Productivity",
  "design engineering": "Design Engineering",
  "tech trends": "Tech Trends",
  "behind the scenes": "Behind the Scenes",
  "10-tools-developer-gratis-2026": "Developer Tools",
  "base64-encode-decode-panduan-lengkap": "Developer Tools",
  "cara-format-json-online": "Developer Tools",
  "uuid-v4-vs-v7": "Developer Tools",
  "cloudflare-workers-deploy-react": "Tech Trends",
  "react-router-7-vs-nextjs": "Tech Trends",
  "state-of-web-dev-indonesia-2026": "Tech Trends",
  "tailwind-css-v4-upgrade-guide": "Tech Trends",
  "design-engineer-role-2026": "Design Engineering",
  "design-token-figma-ke-code": "Design Engineering",
  "15-tools-gratis-pengganti-berbayar": "Productivity",
  "kelola-keuangan-freelance-tools-sederhana": "Productivity",
  "bikin-toolhub-dari-ide-ke-production": "Behind the Scenes",
};

export interface BlogArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime?: number;
  author?: string;
}

export interface BlogArticle extends BlogArticleMeta {
  content: string;
}

/* ---------- frontmatter parser ---------- */

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, string | string[]>;
  content: string;
} {
  // Match content between --- delimiters
  const match = raw.match(/^---\n([\s\S]*?)\n?---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw.trim() };
  }

  const lines = match[1].split("\n").filter(Boolean);
  const frontmatter: Record<string, string | string[]> = {};

  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;

    let value: string | string[] = kv[2].trim();

    // Strip surrounding quotes (single or double)
    if (value.length >= 2) {
      const first = value[0];
      const last = value[value.length - 1];
      if (
        (first === '"' && last === '"') ||
        (first === "'" && last === "'")
      ) {
        value = value.slice(1, -1);
      }
    }

    // Parse YAML array syntax: [item1, item2, item3]
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((i) => {
          let item = i.trim();
          if (item.length >= 2) {
            const f = item[0];
            const l = item[item.length - 1];
            if ((f === '"' && l === '"') || (f === "'" && l === "'")) {
              item = item.slice(1, -1);
            }
          }
          return item;
        })
        .filter(Boolean);
    }

    frontmatter[kv[1]] = value;
  }

  return { frontmatter, content: match[2].trim() };
}

/* ---------- helpers ---------- */

/** Derive a slug from the filename when frontmatter doesn't provide one. */
function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, "");
}

/** Extract the first h1 heading from markdown content (fallback title). */
function extractTitle(content: string): string | null {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

/** Safely read a string value from parsed frontmatter. */
function getStr(
  fm: Record<string, string | string[]>,
  key: string,
  fallback = "",
): string {
  const v = fm[key];
  return typeof v === "string" ? v : fallback;
}

/** Safely read a string array from parsed frontmatter. */
function getStrArray(
  fm: Record<string, string | string[]>,
  key: string,
): string[] {
  const v = fm[key];
  return Array.isArray(v) ? v : typeof v === "string" ? [v] : [];
}

/* ---------- article loading ---------- */

// Load all blog markdown files at build time via Vite's import.meta.glob.
// With query: "?raw", the file is imported as a raw string.
const modules = import.meta.glob(
  "/content/blog/*.md",
  { eager: true, query: "?raw" },
) as Record<string, string>;

let _articles: BlogArticle[] | null = null;

function buildArticles(): BlogArticle[] {
  const articles = Object.entries(modules).map(
    ([filepath, raw]): BlogArticle => {
      const filename = filepath.split("/").pop() || "";
      const { frontmatter, content } = parseFrontmatter(raw);

      // ---- title ----
      const title =
        getStr(frontmatter, "title") ||
        extractTitle(content) ||
        filenameToSlug(filename).replace(/-/g, " ");

      // ---- slug ----
      const slug = getStr(frontmatter, "slug") || filenameToSlug(filename);

      // ---- date: normalize date | published | pubDate ----
      const rawDate =
        getStr(frontmatter, "date") ||
        getStr(frontmatter, "published") ||
        getStr(frontmatter, "pubDate") ||
        new Date().toISOString().split("T")[0];
      // Normalize ISO date: strip time if present
      const date = rawDate.split("T")[0];

      // ---- description ----
      const description = getStr(frontmatter, "description") || "";

      // ---- category: normalize to editorial pillars ----
      const rawCategory = getStr(frontmatter, "category") || "";
      const category = CATEGORY_MAP[rawCategory.toLowerCase()] ||
        CATEGORY_MAP[slug] ||
        rawCategory || "Developer Tools";

      // ---- tags ----
      const tags = getStrArray(frontmatter, "tags");

      // ---- readingTime ----
      let readingTime: number | undefined;
      const rt = frontmatter.readingTime;
      if (rt !== undefined) {
        const parsed =
          typeof rt === "string" ? parseInt(rt, 10) : (rt as number);
        if (!isNaN(parsed)) readingTime = parsed;
      }

      // ---- author ----
      const author = getStr(frontmatter, "author") || "Toolhub";

      return {
        slug,
        title,
        description,
        date,
        category,
        tags,
        readingTime,
        author,
        content,
      };
    },
  );

  // Sort newest first
  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return articles;
}

/** Return all articles, newest first. */
export function getAllArticles(): BlogArticle[] {
  if (!_articles) _articles = buildArticles();
  return _articles;
}

/** Look up a single article by its slug. Returns null if not found. */
export function getArticleBySlug(slug: string): BlogArticle | null {
  return getAllArticles().find((a) => a.slug === slug) || null;
}

/** Return a sorted list of all unique article categories. */
export function getAllCategories(): string[] {
  const cats = new Set(getAllArticles().map((a) => a.category));
  return Array.from(cats).sort();
}
