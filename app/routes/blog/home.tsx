import { useState } from "react";
import { JsonLd } from "~/components/json-ld";
import { BlogCard } from "~/components/blog-card";
import { collectionPageSchema, breadcrumbSchema, ogMeta } from "~/lib/seo";
import { getAllArticles } from "~/lib/blog";
import type { BlogArticle } from "~/lib/blog";

/** Cache the blog listing at the Cloudflare edge for 1 hour. */
export function headers() {
  return {
    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export function meta() {
  const title = "Blog Toolhub — Tips, Tools & Cerita dari Dapur Pengembangan";
  const description =
    "Artikel seputar web development, tools developer, design system, produktivitas freelancer, dan cerita di balik layar membangun Toolhub.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/blog"),
  ];
}

/* =========================================================================
 * Category filter tabs
 * ========================================================================= */

function PillTabs({
  categories,
  active,
  onSelect,
}: {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filter by category">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary ${
              isActive
                ? "neon-gradient text-on-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            style={
              !isActive
                ? { backgroundColor: "var(--tk-surface-container)" }
                : undefined
            }
            aria-pressed={isActive}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}

/* =========================================================================
 * Article grid section
 * ========================================================================= */

function ArticleSection({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <BlogCard
            key={article.slug}
            slug={article.slug}
            title={article.title}
            description={article.description}
            date={article.date}
            category={article.category}
            tags={article.tags}
            readingTime={article.readingTime}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
 * Page component
 * ========================================================================= */

export default function BlogHome() {
  const [activeCategory, setActiveCategory] = useState("All");
  const allArticles = getAllArticles();

  // Build category list from data
  const availableCategories = [
    "All",
    ...new Set(allArticles.map((a) => a.category)),
  ];

  const filtered = allArticles.filter(
    (a) => activeCategory === "All" || a.category === activeCategory,
  );

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* JSON-LD */}
      <JsonLd
        data={collectionPageSchema(
          "Blog Toolhub",
          "Artikel seputar web development, tools developer, design system, produktivitas freelancer, dan cerita di balik layar membangun Toolhub.",
          "/blog",
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />

      {/* Hero header */}
      <section className="flex flex-col gap-3 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on-surface tracking-tight">
          Blog Toolhub
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">
          Tips, panduan, dan cerita seputar web development, tools developer
          gratis, design system, produktivitas freelancer, dan perjalanan
          membangun Toolhub dari ide ke production.
        </p>
      </section>

      {/* Filter tabs */}
      <PillTabs
        categories={availableCategories}
        active={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Article count */}
      {filtered.length > 0 && (
        <p className="text-xs text-on-surface-variant -mt-4">
          {filtered.length} artikel
          {activeCategory !== "All" ? ` di ${activeCategory}` : ""}
        </p>
      )}

      {/* Article grid */}
      <ArticleSection articles={filtered} />
    </div>
  );
}
