import { useState, useMemo, useRef, useCallback } from "react";
import type { Route } from "./+types/markdown";
import { useNavigate } from "react-router";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, webPageSchema, softwareAppSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Markdown Preview — Toolhub";
  const description =
    "Write markdown and see the rendered preview in real-time. Live editor with split view, supports headings, code, lists, and more.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/text/markdown"),
  ];
}

/* ---------- Minimal Markdown Parser ---------- */

/**
 * A lightweight markdown-to-HTML converter covering common syntax elements.
 * This is intentionally minimal — not a full CommonMark implementation.
 */
function mdToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (fenced) — must come before inline code
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : "";
    return `<pre class="md-code-block"><code${langAttr}>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code class=\"md-inline-code\">$1</code>");

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3 class=\"md-h3\">$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class=\"md-h2\">$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class=\"md-h1\">$1</h1>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote class=\"md-blockquote\">$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^(---|\*\*\*|___)\s*$/gm, "<hr class=\"md-hr\" />");

  // Images (before links to avoid conflicts)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="md-image" />',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="md-link" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^(\s*)[-*+] (.+)$/gm, "$1<li class=\"md-li\">$2</li>");
  html = html.replace(/(<li[\s\S]*?<\/li>)/g, (match) => {
    if (!match.includes("<ul>")) {
      return `<ul class="md-ul">${match}</ul>`;
    }
    return match;
  });

  // Ordered lists
  html = html.replace(/^(\s*)\d+\. (.+)$/gm, "$1<li class=\"md-li\">$2</li>");
  html = html.replace(/(<li[\s\S]*?<\/li>)/g, (match) => {
    if (!match.includes("<ol>") && !match.includes("<ul>")) {
      return `<ol class="md-ol">${match}</ol>`;
    }
    return match;
  });

  // Fix consecutive list items (merge into same list)
  html = html.replace(/<\/li>\n<li/g, "</li>\n<li");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Line breaks (double newline = paragraph break)
  html = html.replace(/\n\n/g, "</p><p class=\"md-p\">");

  // Single line breaks
  html = html.replace(/\n/g, "<br />");

  // Wrap remaining text in paragraphs unless already wrapped
  if (!html.startsWith("<h") && !html.startsWith("<p") && !html.startsWith("<pre") && !html.startsWith("<ul") && !html.startsWith("<ol") && !html.startsWith("<blockquote")) {
    html = `<p class="md-p">${html}</p>`;
  } else {
    html = `<p class="md-p">${html}</p>`;
  }

  // Clean up empty paragraphs around block elements
  html = html
    .replace(/<p class="md-p"><\/p>/g, "")
    .replace(/<p class="md-p"><br\s*\/><\/p>/g, "");

  return html;
}

/* ---------- Icons ---------- */

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/* ---------- Default Markdown ---------- */

const DEFAULT_MD = `# Hello, Markdown!

This is a **live** preview tool. Edit the markdown on the left and see the rendered result on the right.

## Text Formatting

You can use *italic*, **bold**, ***both***, ~~strikethrough~~, and \`inline code\`.

## Lists

### Unordered
- Item one
- Item two
- Item three

### Ordered
1. First step
2. Second step
3. Third step

## Links & Images

Visit [Toolhub](/) for more tools.

## Blockquotes

> This is a blockquote. It can span multiple lines and is great for highlighting quotes.

## Code

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Markdown"));
\`\`\`

---

That's all you need to get started!
`;

/* ---------- Main Component ---------- */

export default function MarkdownPreview() {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [toast, setToast] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => mdToHtml(markdown), [markdown]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    showToast("Markdown copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in pt-6 pb-12">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("Markdown Preview — Toolhub", "Write markdown and see the rendered preview in real-time with live editor and split view.", "/text/markdown")} />
      <JsonLd data={softwareAppSchema("Markdown Preview", "Write markdown and see the rendered preview in real-time. Live editor with split view, supports headings, code, lists, and more.", "/text/markdown")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Text & Data", url: "/text" },
        { name: "Markdown Preview", url: "/text/markdown" },
      ])} />

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-full glass text-sm font-medium text-on-surface animate-fade-in shadow-lg">
          {toast}
        </div>
      )}

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/text")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Text & Data
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Markdown Preview
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Write markdown and see the rendered preview in real-time.
        </p>
      </section>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full tonal-container p-1">
          {[
            { id: "edit" as const, label: "Edit", icon: <EditIcon /> },
            { id: "split" as const, label: "Split", icon: null },
            { id: "preview" as const, label: "Preview", icon: <EyeIcon /> },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setViewMode(mode.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                viewMode === mode.id
                  ? "neon-gradient text-[#66002c]"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              aria-label={`${mode.label} view`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={copyMarkdown}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer tonal-container-highest"
        >
          <CopyIcon />
          Copy Markdown
        </button>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
        {/* Editor pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="flex-1 flex flex-col rounded-[48px] overflow-hidden"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            }}
          >
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Markdown
              </span>
              <span className="text-[10px] text-on-surface-variant/40">
                {markdown.length} chars
              </span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="flex-1 p-5 resize-none outline-none text-sm font-mono leading-relaxed min-h-[400px]"
              style={{
                backgroundColor: "var(--tk-surface-container-lowest)",
                color: "var(--tk-on-surface)",
              }}
              aria-label="Markdown editor"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex-1 flex flex-col rounded-[48px] overflow-hidden"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            }}
          >
            <div className="px-5 py-3 border-b"
              style={{ borderColor: "color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Preview
              </span>
            </div>
            <div
              ref={previewRef}
              className="flex-1 p-5 overflow-auto min-h-[400px] prose-content"
              style={{ color: "var(--tk-on-surface)" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">Supported Markdown</p>
        <p>
          Headings (# ## ###), bold, italic, strikethrough, inline code,
          fenced code blocks (```), links, images, ordered/unordered lists,
          blockquotes, and horizontal rules. All processing is client-side.
        </p>
      </div>
    </div>
  );
}
