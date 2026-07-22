# Product Requirements Document: Toolhub

| Metadata | |
|---|---|
| **Product** | Toolhub |
| **Status** | Draft v1.0 |
| **Date** | 2026-07-22 |
| **Tech Stack** | React 19, React Router 7, Tailwind CSS v4, Cloudflare Workers |
| **Design Language** | "Cinematic Discovery Language" (see `.claude/design/DESIGN.md`) |

---

## 1. Executive Summary

Toolhub is a single-page application that aggregates utility tools across multiple domains — finance, developer tooling, data conversion, text processing, and more — into one cohesive, curated experience. Rather than hunting for calculators, converters, or code utilities across dozens of browser tabs, users come to Toolhub to find the right tool quickly, use it without friction, and leave with the result.

The product is differentiated by its design: a cinematic, ambient-dark interface inspired by indie cinema and high-contrast neon aesthetics. Tools are not thrown onto a utilitarian grid; they are discovered through an editorial, card-based browsing experience, making the mundane act of converting a currency or formatting JSON feel deliberate and premium.

---

## 2. Product Vision

> **"Your pocket utility belt — designed for speed, built with soul."**

Toolhub aims to be the definitive destination for quick, reliable utility tools. The vision is not to build the most tools, but the **most carefully crafted experience** around each tool — zero clutter, instant results, and a visual language that makes even a tax calculator feel enjoyable.

### 2.1 Goals

| Goal | Description |
|---|---|
| **Speed** | Every tool loads in under 1 second. Results update as the user types — no "Convert" button needed. |
| **Coverage** | Ship 25+ tools across 5+ categories by v1.0. |
| **Design** | Maintain a cohesive, premium visual identity that sets Toolhub apart from generic tool sites. |
| **Reliability** | All financial tools use live, verified data sources with clear exchange rate timestamps. |
| **Delight** | Micro-interactions (glassmorphic cards, neon pulse on active input, smooth transitions) make the experience feel crafted. |

### 2.2 Non-Goals

- Not a SaaS platform — no user accounts, auth, or billing (v1.0).
- Not a search engine — tools are browsed/categorized, not indexed.
- Not a native mobile app (progressive enhancement via PWA in a future phase).
- Not a marketplace — all tools are first-party.

---

## 3. Target Audience & User Personas

### Persona A: The Freelancer / Solopreneur (Primary)
**"Maya"** — 32, runs her own design consultancy. She invoices international clients, tracks project budgets, and occasionally needs to format data for proposals.

- **Needs:** Currency conversion with live rates, tax calculations across brackets, text formatting, image resizing.
- **Behavior:** Opens Toolhub on desktop during work hours. Wants results instantly. Will return daily if it saves her 2–3 minutes per task.
- **Pain point:** Current tool sites are cluttered with ads, slow, and visually unappealing.

### Persona B: The Junior Developer (Secondary)
**"Alex"** — 24, first engineering job. Works across a terminal, a browser, and VS Code all day.

- **Needs:** UUID generation, JSON formatting/minifying, base64 encode/decode, diff viewer, regex tester, cron expression builder.
- **Behavior:** Keeps Toolhub open in a pinned tab. Expects keyboard-first interaction and dark mode.
- **Pain point:** Wants a tool that looks as premium as the rest of their dev setup.

### Persona C: The Casual User (Tertiary)
**"Ravi"** — 45, occasional tech user. Needs a one-off tax calculation or gold price check.

- **Needs:** Simple, self-explanatory forms. No sign-up. Reads "last updated" timestamps for trust.
- **Behavior:** Lands via search, uses the tool, leaves. Might bookmark if impressed.
- **Pain point:** Does not trust random tool sites with financial calculations.

### Persona D: The Content Creator / Designer (Secondary)
**"Sari"** — 28, social media content creator and aspiring UI designer. Makes Instagram stories, TikTok thumbnails, and presentation decks.

- **Needs:** High-quality emoticons/stickers (memojis) for social media posts, branding assets, presentation accents.
- **Behavior:** Works on mobile and desktop interchangeably. Browses memojis visually, downloads individual items as PNG/SVG. Will browse the library frequently for fresh content.
- **Pain point:** Most emoji sites are low-quality, ad-ridden, or require subscriptions for downloadable assets.

---

## 4. Feature Requirements

### 4.1 Category Structure (v1.0)

| Category | Tools | Priority | Notes |
|---|---|---|---|
| **💰 Financial** | Currency Converter, Gold Price Tracker, Tax Calculator (PPh), Loan Calculator, CAGR Calculator | P0 | Must use live data with clear timestamps |
| **🎨 Design Assets** | Memoji Downloader, Icon Previewer (future), Color Palette Extractor (future) | P3 | Memoji library sourced from Figma; assets are downloadable per item |
| **🛠️ Developer** | Border radius preview, Lorem Ipsum Generator, CSV to JSON, Pomodoro Clock, Countdown, Stopwatch, Word Frequency, Random Number Generator, Binary to Decimal, Roman to Decimal | P0 |
| **🔤 Text & Data** | Word Counter, Character Counter, Diff Checker, Case Converter, Slug Generator, Markdown Preview | P1 | |
| **📐 Converter** | Unit Converter (length, mass, volume, temperature), Time Zone Converter, Number Base Converter | P1 | |
| **🧮 Math & Stats** | Percentage Calculator, Tip Calculator, Random Number Generator, Statistical Summary | P2 | |

### 4.2 P0 Feature Specs

#### 4.2.1 Currency Converter
- **Inputs:** Amount (numeric input), From currency (dropdown/searchable), To currency (dropdown/searchable).
- **Behavior:**
  - Results update as user types (debounced 150ms).
  - Auto-detect user's locale currency via `Intl.NumberFormat` (fallback: USD).
  - Swap button between From/To currencies.
  - Show last-updated timestamp from the exchange rate API.
  - Display both the converted amount and the exchange rate.
- **Data source:** Free tier of exchangerate-api.com or exchangerate.host. Cache rate responses in Cloudflare KV for up to 1 hour to reduce API calls.
- **Edge cases:** Handle extremely large numbers (>1T), zero amounts, identical currencies (instant result, no API call), network failure (show stale cached data with a warning badge).

#### 4.2.2 Gold Price Tracker
- **Inputs:** Weight (grams/oz/tola), Purity (24K, 22K, 21K, 18K, 14K), Currency display.
- **Behavior:**
  - Show current gold price per gram/oz for selected purity.
  - Auto-calculate total value as weight changes.
  - Show price trend (daily change percentage).
  - Display "last updated" from the source API.
- **Data source:** Gold API (gold-api.com) or metals-api.com. Cache in KV for 5 minutes.
- **Edge cases:** Market closed (show last available), API unavailable (cache with stale indicator).

#### 4.2.3 Tax Calculator (PPh Indonesia)
- **Inputs:** Annual income (IDR), marital status (TK/K/*), number of dependents, employment type (employee/freelancer).
- **Behavior:**
  - Calculate PPh 21 using Indonesian progressive tax brackets (layer 0–5).
  - Show breakdown per layer in a visual table.
  - Display effective tax rate, monthly withholding, annual tax due.
  - Include PTKP deduction calculation based on marital status and dependents.
- **Data source:** Hardcoded tax law rules (updated per year, configurable via JSON). No API needed.
- **Edge cases:** Income below PTKP (zero tax), very high income (all layers), mid-year calculation.

#### 4.2.4 JSON Formatter / Validator
- **Inputs:** Textarea for raw JSON input. Paste or type.
- **Behavior:**
  - Auto-format (pretty-print) with syntax highlighting.
  - Real-time validation — red error indicator on the gutter or overlay.
  - Collapsible tree view for large objects.
  - Copy formatted output button.
  - Toggle between 2-space and 4-space indentation.
  - Minify button (strip whitespace).
- **Edge cases:** Extremely large payloads (>1MB — warn and truncate display), trailing commas (auto-fix and note), deeply nested objects (collapse by default after depth 5).

#### 4.2.5 UUID Generator
- **Inputs:** Version selector (v4, v7), count (1–100), output format (standard, no-dashes, uppercase, base64).
- **Behavior:**
  - Generate UUIDs in-browser using `crypto.randomUUID()` (v4) or manual implementation (v7).
  - One-click copy per UUID, or "Copy All" button.
  - Bulk generation with progress for large counts.
- **Edge cases:** Browser without `crypto.randomUUID()` (use fallback).

#### 4.2.6 Memoji Downloader

- **Overview:** A browsable, searchable library of custom-designed emoticons / stickers ("memojis") that users can preview and download individually. Memoji assets are designed in Figma and synced into the app via the Figma MCP. Each memoji is a unique graphic: expressive faces, objects, icons, and decorative elements in the product's neon-cinematic art style.

- **Inputs / UI:**
  - **Visual grid gallery** — masonry or uniform grid of memoji thumbnails with lazy loading.
  - **Category filters** — tab-style horizontal scroll: All, Faces, Objects, Symbols, Decorations, Seasonal.
  - **Search bar** — keyword search across memoji names and tags.
  - **View toggle** — grid (\# columns) vs. list view.

- **Behavior:**
  - Clicking a memoji opens a **lightbox preview** with:
    - Large rendered preview.
    - Memoji name, tags, category badge.
    - Download button → triggers download as PNG/SVG.
    - "Copy to clipboard" button for quick paste into designs.
  - Close lightbox via backdrop click, Esc key, or X button.
  - Download triggers the browser's native download mechanism with the memoji's filename (e.g., `sparkle-heart.png`).
  - Downloads happen entirely client-side — assets are pre-sourced from Figma at build time or fetched on first visit and cached.

- **Data source:**
  - Memoji designs live in Figma (`get_design_context` / `download_assets` via Figma MCP).
  - On first deploy: a script (`workers/scripts/sync-memojis.ts`) reads the Figma file, downloads each asset, and uploads them to Cloudflare R2 or bundles them as static assets.
  - An asset manifest JSON (`public/memojis/manifest.json`) maps memoji ID → filename, tags, category, and dimensions.
  - The manifest is generated by a build step and can be updated independently of app deploys.

- **Edge cases:**
  - Zero results from search — show "No memojis found" with suggestions to try different keywords.
  - Download failure — show a retry button and fallback "right-click to save" instruction.
  - Large library (>100 memojis) — implement virtual scrolling for the grid; lazy-load images with a skeleton shimmer placeholder.
  - Slow network — thumbnails load progressively (blurhash or low-res placeholder first).
  - Lightbox open + browser resize — responsive positioning, max-dimension clamping.

- **Future enhancements (post-v1):**
  - Bulk download (select multiple memojis and download as ZIP).
  - Custom color variant generator (recolor a memoji via HSL sliders).
  - "Copy as SVG" for direct use in design tools.
  - Upload user-designed memojis (moderation queue).

### 4.3 P1 Feature Highlights (Brief)

| Tool | Key Behavior |
|---|---|
| **Base64 Tool** | Encode/decode with live preview. Detect input type (text/file) and switch modes. |
| **Regex Tester** | Input pattern + test string. Highlight all matches in real-time. Show match groups. |
| **Cron Builder** | Visual form → cron expression. Presets (every hour, daily at 9am, weekdays). |
| **Diff Checker** | Side-by-side or inline mode. Character-level diff. |
| **Unit Converter** | Grouped categories with fast switching. Type-ahead search for units. |
| **Markdown Preview** | Split-pane editor/preview. Live render with GitHub-flavored markdown. |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|---|---|
| **Time to Interactive** | < 1.5s on desktop, < 3s on mobile (3G) |
| **First Input Delay** | < 50ms |
| **Largest Contentful Paint** | < 1.5s |
| **Cumulative Layout Shift** | < 0.05 |
| **Bundle size (initial)** | < 100 KB gzipped |
| **Each tool page** | Lazy-loaded; no tool code in the initial bundle unless it's the landing page |

### 5.2 Availability & Data Freshness

| Source | Refresh | Degradation |
|---|---|---|
| Exchange rates | Cache 1h in KV | Show stale data with "may be delayed" badge |
| Gold prices | Cache 5 min in KV | Show stale data with "last updated: X" |
| Tax rules | Static (updated via deploy) | N/A |
| Memoji assets | Manifest cached 24h in KV; images via R2/CDN | Show cached thumbnails, hide download until fresh |
| Developer tools (JSON, UUID, etc.) | 100% client-side | Fully offline-capable |

### 5.3 Browser Support

| Browser | Support | Notes |
|---|---|---|
| Chrome / Edge (latest 2) | ✅ Full | Primary target |
| Firefox (latest 2) | ✅ Full | |
| Safari (latest 2) | ✅ Full | Test `crypto.randomUUID()` |
| Mobile Chrome/Safari | ✅ Responsive | All tools usable on < 400px width |

### 5.4 Accessibility

- WCAG 2.1 AA minimum. Aim for AAA where practical (high contrast mode, enough).
- All interactive elements reachable and operable via keyboard.
- Form inputs have associated `<label>` elements.
- Real-time validation results announced via `aria-live="polite"`.
- Color is never the sole indicator of state (also use text/icons).

### 5.5 Security

- All financial tools run user-side calculation or via Cloudflare Worker (no third-party backend).
- User input is never persisted, logged, or transmitted beyond the tool's immediate function.
- Content Security Policy headers set via `wrangler.json` or response headers middleware.
- External API keys stored as Cloudflare Workers secrets, never in client-side code.

---

## 6. User Experience & Design

### 6.1 Design Language

The UI follows the **Cinematic Discovery Language** defined in `.claude/design/DESIGN.md`. Key tenets:

- **Dark-first:** `surface-dim` (#131313) background with layered surface elevations for depth.
- **Neon accents:** `primary` (#ffb1c3) and `primary-container` (#ff4b89) gradient for CTAs.
- **No borders:** Content sections separated by background shifts, never strokes.
- **Glassmorphism:** Floating elements use `backdrop-blur-[24px]` with translucent backgrounds.
- **Typography:** Space Grotesk (display/headlines) + Inter (body/labels).
- **Roundedness:** Pill-shaped buttons and inputs, `rounded-2xl` cards.

### 6.2 Page Structure

```
Homepage (Tool Discovery)
├── Hero section — "Toolhub" branding + tagline
├── Category gallery — glassmorphic category cards with icon + count
├── Featured tools row — curated "picks"
├── Tool grid — searchable, filterable, sorted by category
└── Footer — minimal, links to about/contact
```

```
Tool Page (individual)
├── Tool header — name, description, category breadcrumb
├── Tool body — the interactive tool (form + results)
├── Usage tips — collapsible "How to use" section
└── Related tools — "You might also need…"
```

### 6.3 Interaction Patterns

- **Instant results:** Tools compute on input change (debounced 150ms for API calls, synchronous for client-side).
- **Copy-to-clipboard:** On every output field, with a brief "Copied!" toast animation.
- **Keyboard shortcuts:** `Cmd+K` / `Ctrl+K` opens tool search overlay. Tab through form fields naturally.
- **Persistent state:** While on a tool page, inputs survive soft navigation (browser history state). Wiped on hard navigation away.
- **Empty states:** Each tool shows a helpful placeholder before the user inputs anything.

---

## 7. Architecture & Data Flow

### 7.1 Stack Diagram

```
Browser (React 19 SPA)
    ↕ React Router 7 (framework mode — SSR on first load)
Cloudflare Workers (Edge SSR)
    ↕ Vite plugin @cloudflare/vite-plugin
Cloudflare KV (cache for external API responses)
External APIs (Exchange rate, Gold price)
```

### 7.2 Route Map

| Route | Page | Loader | Notes |
|---|---|---|---|
| `/` | Homepage — tool discovery grid | Static | SSR |
| `/financial/currency` | Currency Converter | None (client-side) | Fetches rates from Worker `/api/rates` |
| `/financial/gold` | Gold Price Tracker | None (client-side) | Fetches prices from Worker `/api/gold` |
| `/financial/tax` | Tax Calculator (PPh) | None (client-side) | Pure computation |
| `/financial/loan` | Loan Calculator | None (client-side) | Pure computation |
| `/financial/cagr` | CAGR Calculator | None (client-side) | Pure computation |
| `/dev/json` | JSON Formatter/Validator | None (client-side) | Pure computation |
| `/dev/uuid` | UUID Generator | None (client-side) | Pure computation |
| `/dev/base64` | Base64 Encode/Decode | None (client-side) | Pure computation |
| `/dev/regex` | Regex Tester | None (client-side) | Pure computation |
| `/dev/cron` | Cron Expression Builder | None (client-side) | Pure computation |
| `/dev/jwt` | JWT Decoder | None (client-side) | Pure computation |
| `/design/memoji` | Memoji Downloader — gallery & lightbox | Manifest fetch | Assets from Figma via R2 |
| `/design/memoji/:id` | Memoji detail / lightbox deep-link | None (client-side) | Deep-link to specific memoji |
| `/text/word-count` | Word/Character Counter | None (client-side) | Pure computation |
| `/text/diff` | Diff Checker | None (client-side) | Pure computation |
| `/text/case-convert` | Case Converter | None (client-side) | Pure computation |
| `/text/slug` | Slug Generator | None (client-side) | Pure computation |
| `/text/markdown` | Markdown Preview | None (client-side) | Pure computation |
| `/convert/unit` | Unit Converter | None (client-side) | Pure computation |
| `/convert/timezone` | Time Zone Converter | None (client-side) | Pure computation |
| `/convert/base` | Number Base Converter | None (client-side) | Pure computation |
| `/api/rates` | Worker — proxy to exchange rate API | KV caching | JSON response |
| `/api/gold` | Worker — proxy to gold price API | KV caching | JSON response |

### 7.3 Data Flow for Financial Tools

```
User Input (form)
    ↓
Client-side state (useState / useActionState)
    ↓
┌─ Pure computation? ──→ Compute locally → Display result
└─ Needs external data?
         ↓
    fetch(/api/rates)
         ↓
    Cloudflare Worker
         ↓
    Check KV cache → Hit? → Return cached
         ↓ (miss)
    Fetch external API → Store in KV → Return
         ↓
    Display result with timestamp
```

---

## 8. Phasing & Milestones

### Phase 1: Foundation (Week 1–2)
- [ ] Scaffold project layout (header, footer, navigation, category page)
- [ ] Implement Tailwind v4 theme tokens matching DESIGN.md
- [ ] Build homepage with tool grid and category cards
- [ ] Set up generic tool page layout (shared shell)
- [ ] Configure Cloudflare Workers API proxy route for external APIs
- [ ] Set up Cloudflare KV namespace for cache

### Phase 2: Financial Tools (Week 3–4)
- [ ] Currency Converter (with live API integration)
- [ ] Gold Price Tracker (with live API integration)
- [ ] Tax Calculator PPh (pure computation)
- [ ] Loan Calculator (pure computation)
- [ ] CAGR Calculator (pure computation)

### Phase 3: Design Assets — Memoji (Week 5–6)
- [ ] Design 40–60 memoji assets in Figma (faces, objects, symbols, seasonal)
- [ ] Build Figma MCP sync script → R2 bucket + manifest JSON
- [ ] Memoji gallery page — visual grid with lazy loading
- [ ] Category filter tabs and keyword search
- [ ] Lightbox preview with download (PNG) and "Copy to clipboard"
- [ ] Virtual scrolling for large libraries
- [ ] Skeleton loading states and empty/error states

### Phase 4: Developer Tools (Week 7–8)
- [ ] JSON Formatter/Validator (with syntax highlighting)
- [ ] UUID Generator
- [ ] Base64 Encoder/Decoder
- [ ] Regex Tester
- [ ] Cron Expression Builder
- [ ] JWT Decoder

### Phase 5: Text & Converter Tools (Week 9–10)
- [ ] Word/Character Counter
- [ ] Diff Checker
- [ ] Case Converter
- [ ] Slug Generator
- [ ] Markdown Preview
- [ ] Unit Converter
- [ ] Time Zone Converter
- [ ] Number Base Converter

### Phase 6: Polish & Launch (Week 11)
- [ ] Performance audit (Lighthouse, bundle analysis)
- [ ] Accessibility audit (axe-core, keyboard testing)
- [ ] Mobile responsive QA pass
- [ ] Error tracking setup
- [ ] Deployment pipeline (wrangler)
- [ ] Documentation

---

## 9. Out of Scope (v1.0)

| Feature | Rationale |
|---|---|
| **User accounts / auth** | No benefit for a tool directory. Would add complexity for logins, sessions, databases. |
| **History / favorites** | Possible future addition but not core to v1.0. |
| **API documentation** | The proxy Worker is an internal detail; not a public API. |
| **i18n / localization** | v1.0 is English + Indonesian (for tax tool). Full i18n is future work. |
| **PWA / offline support** | Service worker scaffolding possible but full offline mode is post-v1. |
| **Third-party tool integrations** | All tools are first-party. Embedding third-party tools raises security and UX concerns. |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| **Time on page (tool pages)** | > 2 min average | Analytics |
| **Bounce rate** | < 40% | Analytics |
| **Conversion (tool usage)** | > 3 tools used per session | Analytics event per tool interaction |
| **API reliability** | 99.5% uptime for currency/gold APIs | Worker observability |
| **Lighthouse score** | > 90 across all categories | Automated CI check |
| **Error rate** | < 0.5% of tool interactions | Error tracking |

---

## 11. Open Questions & Risks

| Risk | Mitigation |
|---|---|
| **Exchange rate API free tier rate limits** | KV caching with 1h TTL; queue requests if limits hit; show stale data with clear indicator |
| **Tax law changes** | Store tax brackets as JSON config in repo; document the update process; add a "tax year" selector |
| **Gold price API goes down** | Multiple provider fallback; graceful degradation with last-cached price |
| **Safari compatibility** | Test early; `crypto.randomUUID()` and `Intl.NumberFormat` have good Safari support, but `backdrop-filter` needs `-webkit-` prefixed initially |
| **SEO for individual tool pages** | React Router SSR ensures each tool route has its own meta tags; generate descriptive `meta()` for every route |

---

*This PRD is a living document. Requirements will evolve through implementation. Each tool should be designed with composability in mind — a shared hook, form pattern, or result display component should be extractable for the next tool.*
