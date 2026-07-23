import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // SEO routes
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),

  // Financial category
  route("financial", "routes/financial/home.tsx"),
  route("financial/currency", "routes/financial/currency.tsx"),
  route("financial/gold", "routes/financial/gold.tsx"),
  // route("financial/tax", "routes/financial/tax.tsx"),
  // route("financial/loan", "routes/financial/loan.tsx"),
  // route("financial/cagr", "routes/financial/cagr.tsx"),

  // Developer category
  route("dev", "routes/dev/home.tsx"),
  route("dev/json", "routes/dev/json.tsx"),
  route("dev/uuid", "routes/dev/uuid.tsx"),
  route("dev/base64", "routes/dev/base64.tsx"),
  route("dev/regex", "routes/dev/regex.tsx"),
  route("dev/cron", "routes/dev/cron.tsx"),
  route("dev/jwt", "routes/dev/jwt.tsx"),
  route("dev/countdown", "routes/dev/countdown.tsx"),
  route("dev/intersect", "routes/dev/intersect.tsx"),

  // Text & Data category
  route("text", "routes/text/home.tsx"),
  route("text/word-count", "routes/text/word-count.tsx"),
  route("text/diff", "routes/text/diff.tsx"),
  route("text/case-convert", "routes/text/case-convert.tsx"),
  route("text/slug", "routes/text/slug.tsx"),
  route("text/markdown", "routes/text/markdown.tsx"),

  // Converter category
  route("convert", "routes/convert/home.tsx"),
  route("convert/pdf-scanner", "routes/convert/pdf-scanner.tsx"),
  route("convert/json-to-csv", "routes/convert/json-to-csv.tsx"),
  route("convert/roman-to-decimal", "routes/convert/roman-to-decimal.tsx"),
  // route("convert/unit", "routes/convert/unit.tsx"),
  // route("convert/timezone", "routes/convert/timezone.tsx"),
  // route("convert/base", "routes/convert/base.tsx"),

  // Design Assets category
  route("design", "routes/design/home.tsx"),
  route("design/memoji", "routes/design/memoji.tsx"),
] satisfies RouteConfig;
