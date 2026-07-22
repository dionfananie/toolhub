/**
 * SEO utilities for Toolhub.
 *
 * Provides structured data helpers and default meta tags shared across routes.
 */

import type { Location } from "react-router";

/** Base URL for canonical links and OG tags. */
export const SITE_URL = "https://toolhub.app";
export const SITE_NAME = "Toolhub";

/**
 * Generate default meta tags shared by all pages.
 * Each route should spread these and override `title` / `description`.
 */
export function defaultMeta(location: Location) {
  const path = location.pathname;
  return [
    { tagName: "link", rel: "canonical", href: `${SITE_URL}${path}` },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${SITE_URL}${path}` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@toolhub" },
  ];
}

/**
 * Generate Open Graph meta tags for a page.
 */
export function ogMeta(title: string, description: string, path: string) {
  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

/**
 * JSON-LD WebSite schema (used on the homepage).
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Your pocket utility belt — curated tools for finance, development, text, design assets, and conversions. Fast, private, and browser-based.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * JSON-LD Organization schema (used on the homepage).
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Toolhub is a curated collection of online tools for finance, development, text processing, design assets, and conversions.",
  };
}

/**
 * JSON-LD BreadcrumbList schema.
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * JSON-LD WebPage schema.
 */
export function webPageSchema(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
    },
  };
}

/**
 * JSON-LD SoftwareApplication schema for tool pages.
 */
export function softwareAppSchema(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    browserRequirements: "Modern browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * JSON-LD CollectionPage schema for category pages.
 */
export function collectionPageSchema(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
    },
  };
}
