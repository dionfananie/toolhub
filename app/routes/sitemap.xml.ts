/**
 * XML Sitemap route — serves /sitemap.xml
 *
 * Lists all active routes with priority and changefreq for SEO.
 * Homepage = 1.0, Category pages = 0.9, Tool pages = 0.8.
 */

const SITE_URL = "https://toolhub.app";

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: string;
}

const ENTRIES: SitemapEntry[] = [
  // Homepage
  { path: "/", priority: "1.0", changefreq: "weekly" },

  // Financial category
  { path: "/financial", priority: "0.9", changefreq: "weekly" },
  { path: "/financial/currency", priority: "0.8", changefreq: "monthly" },
  { path: "/financial/gold", priority: "0.8", changefreq: "monthly" },

  // Developer category
  { path: "/dev", priority: "0.9", changefreq: "weekly" },
  { path: "/dev/json", priority: "0.8", changefreq: "monthly" },
  { path: "/dev/uuid", priority: "0.8", changefreq: "monthly" },
  { path: "/dev/base64", priority: "0.8", changefreq: "monthly" },
  { path: "/dev/regex", priority: "0.8", changefreq: "monthly" },
  { path: "/dev/cron", priority: "0.8", changefreq: "monthly" },
  { path: "/dev/jwt", priority: "0.8", changefreq: "monthly" },

  // Text & Data category
  { path: "/text", priority: "0.9", changefreq: "weekly" },
  { path: "/text/word-count", priority: "0.8", changefreq: "monthly" },
  { path: "/text/diff", priority: "0.8", changefreq: "monthly" },
  { path: "/text/case-convert", priority: "0.8", changefreq: "monthly" },
  { path: "/text/slug", priority: "0.8", changefreq: "monthly" },
  { path: "/text/markdown", priority: "0.8", changefreq: "monthly" },

  // Converter category
  { path: "/convert", priority: "0.9", changefreq: "weekly" },
  { path: "/convert/pdf-scanner", priority: "0.8", changefreq: "monthly" },
  { path: "/convert/json-to-csv", priority: "0.8", changefreq: "monthly" },
  { path: "/convert/roman-to-decimal", priority: "0.8", changefreq: "monthly" },

  // Design Assets category
  { path: "/design", priority: "0.9", changefreq: "weekly" },
  { path: "/design/memoji", priority: "0.8", changefreq: "monthly" },
];

const LAST_MOD = "2026-07-22";

function entryXml(entry: SitemapEntry): string {
  return `  <url>
    <loc>${SITE_URL}${entry.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

export async function loader() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ENTRIES.map(entryXml).join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
