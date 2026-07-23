/**
 * markdown.ts — Simple frontmatter parser and markdown-to-HTML converter.
 *
 * Handles the subset of markdown used across Toolhub's blog articles:
 * frontmatter, headings, bold/italic, code (inline + fenced), links,
 * images, lists, blockquotes, and horizontal rules.
 *
 * Not a full CommonMark implementation — just enough for the blog.
 */

/* =========================================================================
 * Frontmatter
 * ========================================================================= */

/**
 * Parse frontmatter (YAML-like key-value pairs between `---` delimiters).
 *
 * Supports:
 * - Quoted and unquoted string values
 * - YAML flow arrays: `tags: [a, b, c]`
 * - Comma-separated tags: `tags: a, b, c`
 * - Number values
 * - Multiple date keys: `date`, `published`, `pubDate`
 *
 * Files without a leading `---` block return empty frontmatter and the
 * entire raw string as content.
 */
export function parseFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const frontmatter: Record<string, unknown> = {};

  const trimmed = raw.trimStart();
  if (!trimmed.startsWith("---\n") && !trimmed.startsWith("---\r\n")) {
    return { frontmatter, content: raw };
  }

  // Find the closing `---` delimiter
  const endIndex = trimmed.indexOf("\n---", 4);
  if (endIndex === -1) {
    return { frontmatter, content: raw };
  }

  const fmRaw = trimmed.slice(4, endIndex);
  const rest = trimmed.slice(endIndex + 4);

  for (const line of fmRaw.split("\n")) {
    const tr = line.trim();
    if (!tr || tr.startsWith("#")) continue;

    const colonIdx = tr.indexOf(":");
    if (colonIdx === -1) continue;

    const key = tr.slice(0, colonIdx).trim();
    let value: string = tr.slice(colonIdx + 1).trim();
    if (!value) continue;

    // Quoted strings
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // YAML flow arrays: [a, b, c] or ["a", "b", "c"]
    else if (value.startsWith("[") && value.endsWith("]")) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      continue;
    }
    // Numeric values
    else if (/^\d+(\.\d+)?$/.test(value)) {
      frontmatter[key] = value.includes(".")
        ? parseFloat(value)
        : parseInt(value, 10);
      continue;
    }

    // Tags: comma-separated (without brackets)
    if (key === "tags") {
      frontmatter[key] = value.includes(",")
        ? value.split(",").map((v) => v.trim()).filter(Boolean)
        : [value];
    } else {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: rest.trimStart() };
}

/* =========================================================================
 * Markdown-to-HTML
 * ========================================================================= */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Parse inline markdown elements (bold, italic, code, links, images).
 *
 * Order matters: inline code is processed first so that markdown syntax
 * inside code spans is not parsed.
 */
function parseInline(text: string): string {
  let result = escapeHtml(text);

  // Inline code (processed first to protect content inside backticks)
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Images ![alt](url) — before links to avoid matching image-inside-link patterns
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />',
  );

  // Links [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>',
  );

  return result;
}

/**
 * Convert markdown text to HTML.
 *
 * Handles:
 * - Fenced code blocks (```) with optional language tag
 * - h1, h2, h3 headings
 * - Unordered (`- `) and ordered (`1. `) lists
 * - Blockquotes (`> `)
 * - Horizontal rules (`---`)
 * - Paragraphs (consecutive non-blank lines)
 * - Inline elements via `parseInline`
 */
export function markdownToHtml(markdown: string): string {
  /* ---- First pass: extract fenced code blocks ---- */
  const codeBlocks: string[] = [];
  const processed = markdown.replace(
    /```(\w*)\s*\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const className = lang ? ` class="language-${lang}"` : "";
      const escaped = escapeHtml(code.trim());
      codeBlocks.push(`<pre><code${className}>${escaped}</code></pre>`);
      return `\x00CODEBLOCK${codeBlocks.length - 1}\x00`;
    },
  );

  /* ---- Second pass: block-level processing ---- */
  const lines = processed.split("\n");
  const result: string[] = [];
  let inParagraph = false;
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line — close any open block
    if (!trimmed) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      continue;
    }

    // Code block placeholder (restored from first pass)
    if (trimmed.startsWith("\x00CODEBLOCK")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      const idx = parseInt(
        trimmed.replace("\x00CODEBLOCK", "").replace("\x00", ""),
        10,
      );
      result.push(codeBlocks[idx] ?? "");
      continue;
    }

    // h3
    if (trimmed.startsWith("### ")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      result.push(`<h3>${parseInline(trimmed.slice(4))}</h3>`);
      continue;
    }

    // h2
    if (trimmed.startsWith("## ")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      result.push(`<h2>${parseInline(trimmed.slice(3))}</h2>`);
      continue;
    }

    // h1
    if (trimmed.startsWith("# ")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      result.push(`<h1>${parseInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    // Horizontal rule (3 or more dashes on their own line)
    if (/^-{3,}$/.test(trimmed)) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      result.push("<hr />");
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (inList) {
        result.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      result.push(
        `<blockquote><p>${parseInline(trimmed.slice(2))}</p></blockquote>`,
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (!inList || listType !== "ul") {
        if (inList) {
          result.push(`</${listType}>`);
        }
        result.push("<ul>");
        inList = true;
        listType = "ul";
      }
      const content = trimmed.startsWith("- ")
        ? trimmed.slice(2)
        : trimmed.slice(2);
      result.push(`<li>${parseInline(content)}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      if (!inList || listType !== "ol") {
        if (inList) {
          result.push(`</${listType}>`);
        }
        result.push("<ol>");
        inList = true;
        listType = "ol";
      }
      const content = trimmed.replace(/^\d+\.\s+/, "");
      result.push(`<li>${parseInline(content)}</li>`);
      continue;
    }

    // Regular paragraph text
    // Consecutive lines within a paragraph are joined with <br />
    if (!inParagraph) {
      result.push("<p>");
      inParagraph = true;
    } else {
      result.push("<br />");
    }
    result.push(parseInline(trimmed));
  }

  // Close any remaining open tags
  if (inParagraph) {
    result.push("</p>");
  }
  if (inList && listType) {
    result.push(`</${listType}>`);
  }

  return result.join("\n");
}

/* =========================================================================
 * Helpers
 * ========================================================================= */

/**
 * Format a date string for display using Indonesian locale.
 */
export function formatBlogDate(dateStr: string): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Extract the first `# Heading` from markdown content.
 * Used for articles without frontmatter.
 */
export function extractFirstHeading(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Derive a URL slug from a file path (basename without `.md` extension).
 */
export function slugFromPath(path: string): string {
  const parts = path.split("/");
  return (parts[parts.length - 1] ?? "").replace(/\.md$/, "");
}
