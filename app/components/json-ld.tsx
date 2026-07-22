/**
 * JsonLd — renders a JSON-LD structured data script tag.
 *
 * Usage:
 *   <JsonLd data={webPageSchema("Title", "Desc", "/path")} />
 *   <JsonLd data={breadcrumbSchema([...])} />
 *   <JsonLd data={softwareAppSchema("Tool Name", "Desc", "/path")} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
