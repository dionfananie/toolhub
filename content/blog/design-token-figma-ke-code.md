---
title: Design Token: Dari Figma ke Code, Satu Workflow Aja
description: "Panduan praktis setup design tokens dari Figma ke code base React + Tailwind. Satu source of truth buat designer dan developer."
pubDate: 2026-07-23
author: Dion Fananie
---

# Design Token: Dari Figma ke Code, Satu Workflow Aja

"Warna primary-nya `#FF4B89` apa `#FF4B8A` ya?"

Kalau lo pernah denger pertanyaan kayak gini — entah dari designer yang bingung sama file Figma terbaru, atau dari developer yang lagi inspect elemen — selamat datang di klub. Masalah ini kecil, tapi dampaknya besar. Satu pixel warna yang beda bisa bikin tombol di halaman A keliatan beda sama tombol di halaman B. Produk terasa "murahan," dan yang paling parah: lo kehilangan waktu yang nggak perlu setiap sprint.

Solusinya? **Design tokens.**

Bukan konsep baru, tapi masih banyak tim yang ngerasa ribet buat implementasi. Padahal, setelah lo lihat workflow yang benar, lo bakal nyesel kenapa nggak dari dulu. Artikel ini bakal nunjukin caranya — dari Figma ke code — dalam satu workflow yang clean dan praktis.

---

## Apa Itu Design Tokens?

Bayangin design tokens sebagai **variabel buat desain**. Sama kayak lo bikin `const primaryColor = "#FF4B89"` di kode, design tokens ngelakuin hal yang sama di level desain.

Semua keputusan visual yang lo buat — warna, tipografi, spacing, border-radius, shadow — bisa diubah jadi token. Contohnya:

| Token | Value |
|-------|-------|
| `color.primary.500` | `#FF4B89` |
| `spacing.md` | `16px` |
| `font.size.body` | `16px` |
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.1)` |

Di Figma, ini diwujudin lewat **Variables** (dulu dikenal sebagai local styles atau design tokens via plugin). Di kode, diwujudin lewat CSS Custom Properties, Tailwind theme config, atau constant object di JavaScript.

Kuncinya satu: **satu definisi, dipakai di mana-mana.**

---

## Kenapa Lo Wajib Pakai Design Tokens (Bukan Sekadar Style Guide)

Beberapa alasan kenapa ini bukan sekadar "nice to have":

### 1. Single Source of Truth

Designer dan developer lihat angka yang sama. Nggak ada lagi "di Figma sih warna-nya lebih terang" atau "di staging kok beda?" karena keduanya ngacu ke token yang identik.

### 2. Konsistensi Visual di Seluruh Produk

Tim lo bisa punya 10 orang designer dan 15 developer, tapi kalau semua make token yang sama, tombol login di web dan tombol checkout di mobile tetap konsisten. Scaling visual consistency tanpa harus nge-micromanage tiap komponen.

### 3. Dark Mode Jadi Trivial

Ini salah satu superpower design tokens. Dark mode bukan lagi "desain ulang semua halaman," tapi cukup swap value dari token:

```css
:root {
  --color-bg: #FFFFFF;
  --color-text: #1A1A2E;
  --color-primary: #FF4B89;
}

[data-theme="dark"] {
  --color-bg: #1A1A2E;
  --color-text: #E8E8E8;
  --color-primary: #FF8DB5;
}
```

Semua komponen yang make `var(--color-bg)` otomatis berubah. Zero effort, maximum impact. Lo cuma perlu define ulang nilai token di theme block, dan seluruh UI nyusaikin diri.

### 4. Rebranding dalam Hitungan Jam, Bukan Minggu

Startup lagi pivot? Merger dan butuh nyatuin dua brand? Ganti value token di satu file, deploy, selesai. Nggak perlu nge-track tiap komponen satu-satu.

---

## Workflow Figma ke Code: Step-by-Step

Ini dia inti dari artikel ini. Workflow yang gw pake sendiri di beberapa project dan udah terbukti reliable.

### Step 1: Setup Tokens di Figma

Di Figma, lo punya dua opsi utama: **Local Variables** (built-in sejak 2023) atau **Tokens Studio plugin**. Gw saranin pake Tokens Studio karena support ekspor ke format W3C Design Token langsung.

Cara pakenya: lo bikin satu set variable di Figma, namain dengan sistem hierarki (misal `color/primary/500`), lalu binding variable itu ke properti fill, stroke, atau effect di elemen lo. Begitu variable berubah, semua layer yang terikat otomatis kebawa.

Di Tokens Studio, lo bikin grup token seperti ini:

```
color/
  primary/
    50: #FFF0F5
    100: #FFD6E4
    500: #FF4B89
    900: #8C0044
  neutral/
    0: #FFFFFF
    50: #F8F9FA
    900: #1A1A2E
spacing/
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
font/
  size/
    body: 16px
    h1: 32px
    caption: 12px
```

Simpen ini sebagai satu file JSON atau via Tokens Studio sync ke GitHub. Lo tinggal atur token di Figma, dan apply ke komponen lo pake variable binding — bukan hardcode hex value.

### Step 2: Ekspor ke Format W3C Design Token

Setelah token jadi, ekspor ke format **W3C Design Token Format**. Ini format standar internasional yang mulai diadopsi banyak tools.

Struktur output JSON-nya kurang lebih gini:

```json
{
  "color": {
    "primary": {
      "500": {
        "$type": "color",
        "$value": "#FF4B89"
      }
    }
  },
  "spacing": {
    "md": {
      "$type": "dimension",
      "$value": "16px"
    }
  }
}
```

Dari Figma, lo bisa ekspor manual lewat Tokens Studio. Tapi lebih baik setup **auto-sync via GitHub** — setiap ada perubahan di Figma, file token otomatis di-push ke repo.

### Step 3: Generate CSS Custom Properties atau Tailwind Theme

Ini bagian yang paling seru. Dengan file W3C token tadi, lo bisa generate apapun. Tool paling populer buat ini: **Style Dictionary** dari Amazon.

Buat folder `tokens/` di project lo, masukin file JSON token, terus pake config Style Dictionary:

```json
// style-dictionary.config.json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "src/styles/",
      "files": [{
        "destination": "tokens.css",
        "format": "css/variables"
      }]
    },
    "tailwind": {
      "transformGroup": "js",
      "buildPath": "src/tokens/",
      "files": [{
        "destination": "tailwind-theme.json",
        "format": "json/nested"
      }]
    }
  }
}
```

Jalankan `npx style-dictionary build`, dan lo dapet dua file:

- `src/styles/tokens.css` — CSS Custom Properties siap pakai
- `src/tokens/tailwind-theme.json` — JSON buat Tailwind config

### Step 4: Implementasi di React + Tailwind

Di project React lo, tinggal import file CSS yang udah di-generate:

```tsx
// root layout
import "../styles/tokens.css";

// component
function Button({ variant, children }) {
  return (
    <button
-      style={{ backgroundColor: "#FF4B89" }}
+      className="bg-primary-500 px-md py-sm rounded-md"
    >
      {children}
    </button>
  );
}
```

Kalau lo make Tailwind, inject theme JSON-nya:

```ts
// tailwind.config.ts
import tailwindTheme from "./src/tokens/tailwind-theme.json";

export default {
  theme: {
    extend: {
      colors: tailwindTheme.color,
      spacing: tailwindTheme.spacing,
    },
  },
};
```

Mulai dari sini, designer tinggal ganti value di Figma, push, lo `git pull` + `npm run build:tokens`, dan UI lo sinkron otomatis. **Nggak ada lagi copy-paste hex color dari Figma.**

---

## Tools yang Bikin Hidup Lo Lebih Mudah

Beberapa tools yang patut lo coba:

**Style Dictionary** — Wajib. Ini standar industri buat generate token dari JSON ke berbagai format (CSS, SCSS, JS, Swift, Kotlin). Udah mature dan dokumentasinya bagus.

**Tokens Studio for Figma** — Plugin Figma paling powerfull buat design tokens. Support multi-theme, ekspor W3C format, dan sync ke GitHub.

**CVA (Class Variance Authority)** — Kalau lo udah di level komponen, CVA bikin varian komponen jadi lebih terstruktur. Cocok dipasangin sama token-based system. Lo bisa define varian button berdasarkan token sizing dan color, dan CVA yang handle logika kombinasinya.

```tsx
import { cva } from "class-variance-authority";

const button = cva("rounded-md font-medium", {
  variants: {
    size: {
      sm: "px-sm py-xs text-caption",
      md: "px-md py-sm text-body",
      lg: "px-lg py-md text-h1",
    },
    intent: {
      primary: "bg-primary-500 text-neutral-0",
      secondary: "bg-neutral-50 text-neutral-900",
    },
  },
});
```

**Theo** — Alternatif Style Dictionary dari Salesforce. Lebih simpel setup-nya tapi sayangnya kurang fleksibel untuk scale yang besar. Cocok buat tim kecil atau project yang token-set-nya nggak terlalu kompleks.

**Penyimpanan Token** — Jangan simpan token cuma di Figma. Simpen juga di GitHub sebagai file JSON, jadi ada version history-nya. Tim bisa nge-track kapan `color.primary.500` berubah dari `#FF4B89` ke `#E8437A`, dan siapa yang ngubah. Ini penting banget buat audit dan rollback kalau ada yang salah.

---

## Demo: Dari Token ke Komponen Nyata

Biar lebih konkret, bayangin lo lagi bikin komponen `Card` yang punya beberapa varian — default, elevated, dan bordered. Dengan design tokens, lo tinggal mapping properti visual ke token:

```tsx
// components/Card.tsx
interface CardProps {
  variant?: "default" | "elevated" | "bordered";
}

function Card({ variant = "default" }: CardProps) {
  const styles = {
    default: "bg-neutral-0 border border-neutral-50",
    elevated: "bg-neutral-0 shadow-md",
    bordered: "bg-neutral-0 border-2 border-primary-500",
  };

  return <div className={`rounded-md p-md ${styles[variant]}`}>...</div>;
}
```

Waktu designer mutusin border radius default berubah dari `8px` ke `12px`, lo tinggal ganti satu token (`border-radius.md`) di Figma, sync token, build, dan semua Card di seluruh aplikasi lo otomatis ngikut. Nggak perlu manual update tiap instance.

---

## Pitfall: Jangan Over-Engineer dari Awal

Godaan terbesar pas mulai pake design tokens: lo pengen semuanya jadi token. Spacing 12px, spacing 13px, font weight 470... stop.

Mulai dari **10-15 token** aja. Gw sarankan:

1. 2-3 warna utama (primary, neutral, accent)
2. 4-5 spacing scale
3. 3-4 font size
4. 1-2 shadow level
5. 2 border radius

Pasang dulu di komponen inti (Button, Card, Input). Setelah workflow-nya lancar, lo bisa expand. Lebih baik mulai kecil dan konsisten daripada langsung 100 token tapi nggak kepake setengahnya.

Juga inget: **design tokens bukan pengganti design system.** Token adalah fondasi, component library adalah bangunannya. Dua-duanya perlu, tapi jangan nunggu component library selesai buat mulai pake token.

Satu lagi: **komunikasi tim itu wajib.** Lo bisa punya token tercanggih di dunia, tapi kalau designer masih manual input hex di Figma, atau developer masih hardcode warna di komponen, token itu cuma file JSON yang dikoleksi doang. Pastiin ada ritual sync rutin — misal tiap habis sprint planning, designer push update token dan developer pull + build bareng-bareng.

---

## Kesimpulan

Design tokens adalah salah satu investasi termahal — dalam arti **return on time**-nya gede banget dibanding effort setup-nya.

Dengan satu jam bikin token di Figma, nyambungin ke Style Dictionary, dan generate CSS variables, lo ngemat:

- **Puluhan jam** debugging warna yang beda antara Figma dan browser
- **Ratusan jam** revisi UI pas rebranding atau bikin dark mode
- **Energi mental** dari komunikasi bolak-balik "ini warna apa sih sebenernya?"

Mulai dari kecil. Pilih 10 token esensial lo, setup Tokens Studio dan Style Dictionary, dan pastiin tiap anggota tim — designer dan developer — ngerti alurnya.

Setelah workflow ini jalan, pertanyaan "Warna primary-nya `#FF4B89` apa `#FF4B8A` ya?" bakal jadi kenangan. Dan lo bisa fokus ngerjain hal yang lebih penting: bikin produk yang bener-bener beda.

---

*Punya pertanyaan atau pengalaman sendiri soal design tokens? Tulis di kolom komentar atau reach out langsung. Kalau lo pengen diskusi lebih lanjut tentang setup token di project spesifik lo, gw buka kok — tim yang pake token selalu lebih produktif, dan makin banyak yang pake, makin bagus buat ekosistem kita.*
