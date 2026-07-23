---
title: "Tailwind CSS v4: Apa yang Baru & Kenapa Harus Upgrade Sekarang"
description: "Panduan lengkap Tailwind CSS v4 — dari CSS-first configuration, built-in container queries, sampai step-by-step migrasi dari v3. Plus pengalaman kami pakai v4 di Toolhub."
pubDate: 2026-07-23
author: Dion Fananie
---

# Tailwind CSS v4: Apa yang Baru & Kenapa Harus Upgrade Sekarang

Pertengahan 2026 ini, Tailwind CSS v4 udah stabil dan jadi pilihan utama buat frontend developer — termasuk kami di Toolhub. Tapi banyak yang masih nahan. "Ah, v3 aja udah jalan, ngapain ribet migrasi?"

Jujur, saya juga skeptis awalnya. Tapi setelah make v4 dari awal di beberapa project (termasuk Toolhub sendiri), saya bisa bilang: **update ini layak banget kamu perhatiin**, apalagi kalau kamu developer yang ngurusin frontend tiap hari.

Artikel ini bukan cuma ngomongin fitur baru. Lo bakal dapet panduan migrasi step-by-step, hal-hal yang sering bikin jebol produksi, dan insight dari pengalaman kami sendiri pake v4 di project production. Siap? Gas.

---

## Yang Baru di Tailwind CSS v4

Tailwind v4 bukan sekadar minor bump. Ini adalah rewrite total dari framework-nya — dari JavaScript ke Rust (Oxide engine), dari `tailwind.config.js` ke CSS-first architecture. Ini highlight terbesarnya:

### 1. CSS-First Configuration

Ini perubahan paling fundamental. Dulu lo butuh file `tailwind.config.js` buat define theme, warna, breakpoint. Sekarang, semuanya ditulis langsung di CSS pake `@theme`:

```css
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
  --color-primary: oklch(0.55 0.25 350);
  --spacing-page: 2rem;
}
```

Setiap token yang lo definisikan otomatis jadi CSS custom properties di `:root`. Nggak perlu generate-config atau nunggu build ulang. Lo juga bisa akses token ini dari JavaScript biasa lewat `getComputedStyle()` kalau perlu.

**Konsekuensinya?** Lo bisa ngerjain styling tanpa keluar dari file CSS. Workflow jadi lebih mulus, apalagi kalau tim lo pake pendekatan design tokens.

### 2. Zero-Config Content Detection

Lo inget nggak betapa nyebelinnya lupa update `content` paths di config, trus utility class baru nggak kegenerate?

```js
// v3 — lo harus define manual
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
}
```

Di v4, Tailwind otomatis detect file mana yang perlu di-scan — pake heuristics yang ngikutin `.gitignore` dan skip binary files. Kalau ada path dari eksternal library (misalnya komponen dari package internal), lo bisa tambahin pake `@source`:

```css
@import "tailwindcss";
@source "../node_modules/@my-company/ui-lib";
```

Satu hal yang kurang diinget orang: **`safelist` nggak didukung** di v4. Kalau lo dynamic class yang harus selalu ada, pakai `@source inline()` sebagai gantinya.

### 3. CSS-Based `@variant` Directives

Buat yang sering pake custom variants, ini bakal ngubah cara lo nulis CSS. Darribut pake plugin atau masker-mikirin selector, lo tinggal tulis:

```css
@custom-variant dark (&:where(.dark, .dark *));

@utility btn-primary {
  background: var(--color-blue-500);
  color: white;
  @variant hover {
    background: var(--color-blue-600);
  }
}
```

Di v4.3 ke atas, stacked dan compound variant juga udah didukung:

```css
@variant hover:focus { /* stacked */ }
@variant hover, focus { /* compound — CSS yang sama buat dua kondisi */ }
```

### 4. Built-in Container Queries

Container queries sekarang jadi core utilities, bukan plugin. Tinggal pake `@container` di parent, trus `@sm:`, `@md:`, `@lg:` di child elements:

```html
<div class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-3 @lg:grid-cols-4">
    ...
  </div>
</div>
```

Butuh height-based container queries? Di v4.3 ada `@container-size`:

```html
<div class="@container-size">
  <div class="h-[50cqb]">...</div>
</div>
```

Ini ngebantu banget buat komponen yang perlu responsive terhadap container sendiri, bukan viewport. Ghost jaman lu masih make matchMedia listener.

### 5. Native CSS Cascade Layers Support

v4 dibangun di atas fitur CSS modern kayak `@layer`, `@property`, dan `color-mix()`. Hasilnya:

- **Priority control yang lebih rapi** — Tailwind otomatis naro utility class di layer yang bener.
- **Better performance** — build Rust-based (Oxide engine) bikin full build 3-4x lebih cepet.
- **Vendor prefixing otomatis** lewat Lightning CSS — nggak perlu `autoprefixer` lagi.
- **CSS custom properties registered** pake `@property` — mendukung animasi gradient, yang dulu susah banget.

Perbandingan build time:

| Metric | v3.4 | v4.0 |
|--------|------|------|
| Full build | 378ms | 100ms |
| Incremental (ada CSS baru) | 44ms | 5ms |
| Incremental (no new CSS) | 35ms | **192 microsecond** |

Ya, mikrodetik. Build yang nggak ngubah CSS apapun selesai dalam waktu yang nggak kasat mata.

### 6. Fitur Lain yang Nggak Kalah Keren

- **Dynamic spacing** — `p-13`, `mt-22` jalan tanpa definisi eksplisit.
- **3D transform utilities** — `rotate-x-45`, `perspective-distant`, `transform-3d`.
- **Scrollbar styling** (v4.3+) — `scrollbar-thin`, `scrollbar-thumb-sky-700`, `scrollbar-gutter-stable`.
- **Conic & radial gradients** — `bg-conic/[in_hsl_longer_hue] from-red-600...`.
- **`@starting-style` support** — enter/exit transitions tanpa JavaScript.
- **`zoom-*` dan `tab-*` utilities** — kontrol zoom dan tab-size langsung dari HTML.
- **`inert` variant** — styling elemen dengan attribute `inert`.
- **`not-*` variant** — negasi dari variant manapun.

---

## Migration: Step-by-Step dari v3 ke v4

Oke, teorinya udah cukup. Lo pasti mikir: "Gimana cara migrasi project gue?"

### Step 1: Upgrade Tool

Pertama, jalanin upgrade tool resmi dari Tailwind:

```bash
npx @tailwindcss/upgrade
```

Butuh **Node.js 20+**. Tool ini bakal:

- Update dependencies otomatis.
- Convert `tailwind.config.js` ke `@theme` block di CSS.
- Rename utility classes yang berubah.

**Saran saya: jalanin di branch baru, trus review diff-nya satu-satu.** Tool ini lumayan akurat, tapi tetep perlu dicek.

### Step 2: Update Build Setup

Pilih sesuai setup lo:

**PostCSS:**
```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Hapus `tailwindcss`, `postcss-import`, dan `autoprefixer` dari `package.json` — v4 handle ini semua otomatis lewat Lightning CSS.

**Vite (recommended):**
```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

**CLI:**
```bash
# v3
npx tailwindcss -i input.css -o output.css

# v4
npx @tailwindcss/cli -i input.css -o output.css
```

### Step 3: Update CSS Imports

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 — cukup satu baris */
@import "tailwindcss";
```

### Step 4: Migrasi Config ke CSS

```css
/* tailwind.config.js (OLD) */
module.exports = {
  theme: {
    extend: {
      colors: { primary: "#FF4B89" },
      fontFamily: { display: ["Satoshi", "sans-serif"] },
      screens: { "3xl": "1920px" },
    },
  },
};
```

Jadi:

```css
/* app.css (NEW) */
@import "tailwindcss";

@theme {
  --color-primary: #FF4B89;
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
}
```

### Step 5: Cari & Ganti Renamed Utilities

Ini yang paling sering bikin masalah. Hafalin atau bookmark tabel ini:

| v3 | v4 |
|----|----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` (3px) | `ring-3` (atau `ring` yang sekarang 1px) |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |

### Step 6: Breaking Changes yang Paling Sering Ngejebak

**Important modifier pindah posisi:**
```html
<!-- v3 -->
<div class="!flex hover:!bg-red-500"></div>
<!-- v4 -->
<div class="flex! hover:bg-red-500!"></div>
```

**Arbitrary values pake parentheses, bukan brackets:**
```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>
<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

**Border color default jadi `currentColor`** — kalau lo selama ini mengandalkan border gray bawaan, lo perlu tambahin `border-gray-200` secara eksplisit.

**`theme()` function nggak jalan** — ganti pake CSS variables:
```css
/* v3 */
background-color: theme(colors.red.500);

/* v4 */
background-color: var(--color-red-500);
```

**Dark mode config:**
```css
/* v3: tailwind.config.js */
darkMode: "class";

/* v4: CSS */
@custom-variant dark (&:where(.dark, .dark *));
```

**Variant stacking berubah arah** — v3 right-to-left, v4 left-to-right:
```html
<!-- v3 -->
<ul class="first:*:pt-0">
<!-- v4 -->
<ul class="*:first:pt-0">
```

---

## Yang Masih Sama

Biar lo nggak panik, ada banyak hal yang tetap identik:

- **Utility classes** — `flex`, `grid`, `p-4`, `text-lg`, `bg-red-500` semuanya masih sama.
- **Responsive prefix** — `sm:`, `md:`, `lg:`, `xl:`, `2xl:` masih berfungsi.
- **Dark mode** — class `dark:` tetap jalan (cuma config-nya pindah ke CSS).
- **State variants** — `hover:`, `focus:`, `active:`, `disabled:` tetap ada.
- **Group & peer** — `group-hover:`, `peer-checked:` masih jadi andalan.
- **Animations** — `animate-spin`, `animate-pulse`, `animate-bounce` tetap sama.

Jadi kalau lo cuma make utility class dasar, migrasinya bakal jauh lebih mulus.

---

## Verdict: Worth Upgrade Sekarang atau Tunggu?

Jujur, jawabannya tergantung project lo:

**Upgrade sekarang kalau:**
- Project baru — nggak ada alasan buat mulai pake v3 di 2026.
- Lo pake Vite — integrasi `@tailwindcss/vite` jauh lebih cepet.
- Target browser lo modern (Chrome 111+, Safari 16.4+, Firefox 128+).
- Lo pengen container queries, 3D transforms, atau scrollbar utilities tanpa plugin.
- Build speed mulai jadi masalah.

**Tahan dulu kalau:**
- Lo masih support browser lawas (IE11, Safari <16, Chrome <111) — v4 butuh modern CSS.
- Tim lo besar dan migrasi banyak component library butuh waktu berminggu-minggu.
- Lo masih make Sass/Less/Stylus sebagai preprocessor — v4 nggak support.
- Lo pake Webpack dan nggak bisa upgrade — meski udah ada `@tailwindcss/webpack`, performanya beda.

**Approach hybrid:** Lo bisa mulai pake v4 di project baru, sambil nunda migrasi project legacy sampai tim siap. Tailwind v3.4 tetep dapet security patches dan masih stabil dipake.

---

## Pengalaman Kami di Toolhub

Kami di Toolhub mulai pake Tailwind CSS v4 dari awal — bahkan sebelum release stabil. Dan honestly? Ini salah satu keputusan teknis terbaik yang kami buat.

Kenapa? Pertama, **CSS-first configuration** cocok banget sama workflow kami. Designer dan developer sama-sama bisa baca dan edit tokens di file CSS tanpa harus buka JavaScript config. Nggak ada lagi "eh primary colornya di definisikan di mana ya?"

Kedua, **build performance**. Project kami cukup besar — ratusan komponen, banyak halaman, dan styling yang kompleks. Dulu develop locally sometime ada delay pas hot reload. Sekarang? Nggak kerasa. Incremental build selesai di bawah 10ms.

Ketiga, **container queries** built-in. Banyak komponen card dan grid di Toolhub yang layoutnya harus berubah berdasarkan container, bukan viewport. Dulu kami make polyfill at 
ur CSS-in-JS approach. Sekarang tinggal pake `@container` dan selesai.

Yang perlu diakui: proses setup awal agak beda mindset. Butuh adaptasi dari `tailwind.config.js` ke `@theme`. Tapi begitu kebiasa, rasanya lebih natural. Lo nulis styling sambil define tokens tanpa ganti file. Satu file CSS buat semuanya.

Satu hal yang kami sesali? Nggak migrasi lebih awal di project lain. Tapi better late than never.

---

## Kesimpulan

Tailwind CSS v4 adalah lompatan besar — dari arsitektur yang JavaScript-centric ke CSS-native. Perubahannya signifikan, tapi kebanyakan ke arah yang lebih baik: **lebih cepet, lebih sederhana, dan lebih modern**.

Lo nggak harus migrasi semua project besok. Tapi kalau lo mulai project baru di 2026, pakai v3 itu sama aja kayak beli laptop baru tapi pake Windows 10 — works, tapi lo kehilangan banyak hal.

Mulai dari setup v4 di project kecil-kecilan dulu. Rasain sendiri beda build speed-nya. Coba CSS-first configuration. Container queries. Scrollbar utilities. Niscaya lo bakal susah balik.

Siap nyoba? Tinggal jalanin:

```bash
npm install tailwindcss @tailwindcss/vite
```

Happy coding, dan selamat tinggal `tailwind.config.js`.

---

*Toolhub sendiri dibangun dengan React Router 7 + Tailwind CSS v4 + Cloudflare Workers — kombinasi yang bikin developer experience dan user experience sama-sama optimal. Kalau lo penasaran, mampir ya.*
