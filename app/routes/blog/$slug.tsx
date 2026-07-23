import { useLoaderData, Link } from "react-router";
import { JsonLd } from "~/components/json-ld";
import { markdownToHtml, formatBlogDate } from "~/lib/markdown";
import { getArticleBySlug } from "~/lib/blog";
import { breadcrumbSchema, ogMeta, SITE_URL } from "~/lib/seo";
import { useState, useEffect } from "react";

/** Cache individual blog posts at the Cloudflare edge for 2 hours. */
export function headers() {
  return {
    "Cache-Control": "public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400",
  };
}

export async function loader({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return article;
}

export function meta({ data }: { data: any }) {
  if (!data) {
    return [{ title: "Blog — Toolhub" }];
  }
  const title = `${data.title} — Blog Toolhub`;
  const description =
    data.description || `Baca artikel ${data.title} di Blog Toolhub.`;
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, `/blog/${data.slug}`),
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: data.date },
    ...(data.tags?.map((tag: string) => ({
      property: "article:tag",
      content: tag,
    })) || []),
  ];
}

/* =========================================================================
 * Copy link button
 * ========================================================================= */

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary"
      style={{ backgroundColor: "var(--tk-surface-container)" }}
      aria-label={copied ? "Link copied" : "Copy article link"}
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-tertiary"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-tertiary">Tersalin</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>Copy link</span>
        </>
      )}
    </button>
  );
}

/* =========================================================================
 * Tag pills
 * ========================================================================= */

function TagPills({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--tk-primary) 8%, transparent)",
            color: "var(--tk-primary)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/* =========================================================================
 * Article JSON-LD
 * ========================================================================= */

function articleSchema(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: article.author || "Toolhub",
    },
    publisher: {
      "@type": "Organization",
      name: "Toolhub",
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${article.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

/* =========================================================================
 * Page component
 * ========================================================================= */

export default function BlogPost() {
  const article = useLoaderData() as any;

  const html = markdownToHtml(article.content);
  const dateDisplay = article.date ? formatBlogDate(article.date) : "";
  const readingTimeDisplay =
    article.readingTime != null
      ? typeof article.readingTime === "number"
        ? `${article.readingTime} min read`
        : article.readingTime
      : null;

  return (
    <article className="max-w-3xl mx-auto animate-fade-in pb-16">
      {/* JSON-LD */}
      <JsonLd data={articleSchema(article)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `/blog/${article.slug}` },
        ])}
      />

      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-8 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Kembali ke Blog
      </Link>

      {/* Header */}
      <header className="flex flex-col gap-4 mb-10">
        {/* Category badge */}
        <span
          className="inline-flex self-start px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full text-tertiary"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--tk-tertiary) 12%, transparent)",
          }}
        >
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-on-surface tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Meta row: date + reading time + author */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
          {article.author && (
            <span className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {article.author}
            </span>
          )}
          {dateDisplay && (
            <time dateTime={article.date} className="tabular-nums">
              {dateDisplay}
            </time>
          )}
          {readingTimeDisplay && (
            <span className="tabular-nums">{readingTimeDisplay}</span>
          )}
        </div>

        {/* Tags */}
        <TagPills tags={article.tags} />
      </header>

      {/* Article body */}
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Divider */}
      <hr
        className="my-10 border-0 h-px"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)",
        }}
      />

      {/* Share / footer */}
      <footer className="flex flex-col gap-4">
        <p className="text-sm text-on-surface-variant">
          Baca artikel lainnya di{" "}
          <Link
            to="/blog"
            className="text-tertiary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Blog Toolhub
          </Link>
        </p>
        <CopyLinkButton />
      </footer>
    </article>
  );
}
