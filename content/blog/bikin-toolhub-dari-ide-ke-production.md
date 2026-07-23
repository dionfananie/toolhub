---
title: "Bikin Toolhub: Perjalanan dari Ide ke Production dalam 6 Minggu"
description: "6 minggu, 25+ tools, 1 developer. Cerita di balik layar membangun Toolhub — tool site cinematic yang cepat, privat, dan tanpa backend."
published: 2026-07-23
tags: [toolhub, case-study, indie-hacker, react-router, cloudflare, web-development]
readingTime: 12
---

# Bikin Toolhub: Perjalanan dari Ide ke Production dalam 6 Minggu

**6 minggu, 25+ tools aktif, dan 1 developer.**

Kedengerannya mustahil? Jujur, saya juga kaget ternyata bisa. Tapi ini bukan cerita soal crunch atau lembur tiap malam. Ini cerita soal gimana tools modern dan keputusan arsitektur yang tepat bisa bikin 1 orang ngirim apa yang biasanya dikerjain tim 3-4 orang.

Ini cerita di balik layar Toolhub — dari secangkir kopi dan rasa frustrasi, sampai live di production dengan deploy ke edge network Cloudflare.

---

## Kenapa Saya Bikin Toolhub

Semuanya dimulai dari frustrasi. Coba buka tool site populer — iklan dimana-mana, pop-up nutupin konten, loading lambat, UI stuck di 2010. Mau convert JSON? Siap-siap lihat 3 iklan dulu.

Saya mikir: _Kenapa nggak ada tool site yang bikin pengalaman premium? Kayak Apple bikin calculator — simple, cantik, langsung berfungsi._

Toolhub lahir dari visi sederhana: **tool site yang cinematic, cepat, dan premium.** Kayak indie cinema — gelap, dramatis, semuanya intentional. Bukan website tool biasa yang penuh banner palsu.

Prinsipnya:
- Nol iklan.
- Semua proses client-side. Data lo nggak kemana-mana.
- Dark theme sebagai pengalaman inti.
- Responsif di HP dan desktop.

---

## Tech Stack: Kenapa Pilih Ini (dan Nggak Pilih Itu)

Dari awal saya tahu ingin pakai pendekatan **edge-first, serverless, dan React modern**. Tapi framework mana?

### React 19 + React Router 7 (Bukan Next.js)

Saya pakai **React 19** dengan **React Router 7** dalam framework mode. Kenapa bukan Next.js?

Alasannya simpel: Saya nggak butuh App Router, server actions, atau `"use client"` di tiap file. React Router 7 memberikan SSR yang bersih, routing yang intuitive, dan — ini yang paling penting — **100% inline dengan standar web**. Nggak ada magic, nggak ada layer abstraksi yang bikin lo bingung pas debugging.

Plus, integrasinya dengan Vite seamless banget. Dev experience-nya bikin saya pengen nulis kode tiap hari.

### Tailwind CSS v4

Tailwind v4 hadir dengan paradigma baru — CSS-first configuration via `@theme`. Saya bisa definisikan **design tokens sebagai CSS custom properties** dan Tailwind tinggal nge-map utility class-nya. Ini kombinasi yang powerful banget buat maintain design system di skala 25+ halaman.

### Cloudflare Workers

Saya deploy ke **Cloudflare Workers** — dan ini keputusan arsitektur yang paling berdampak.

Dengan Workers:
- Cold start nyaris nol. Request pertama dan ke-sejuta sama cepatnya.
- Edge deployment artinya user dari Indonesia, Malaysia, atau Singapura dapet response < 50ms.
- 100.000 request per hari gratis. Buat tool site tahap awal, ini lebih dari cukup.

### Kenapa Nggak Pakai Database?

Ini pertanyaan yang sering muncul: "Toolhub pake database apa?"

Jawabannya: **Nggak ada.**

90% tools di Toolhub murni client-side. Lo format JSON, generate UUID, encode base64, atau convert case — semuanya terjadi di browser lo. Data lo nggak pernah dikirim ke server. Ini bukan cuma soal privacy, tapi juga soal **arsitektur yang lebih simpel dan scalable tanpa provisioning database**.

Satu-satunya yang fetch data eksternal itu tool currency (ambil kurs dari API) dan gold price tracker — itupun dari endpoint yang diproxy via Cloudflare.

---

## Proses Development: Minggu ke Minggu

Saya nggak ngerjain ini full-time — ada kerjaan lain, ada hidup. Tapi karena tech stack yang tepat dan foundation yang solid, progress tetap jalan. Ini breakdown-nya:

### Minggu 1-2: Foundation

Dua minggu pertama habis buat bikin **pondasi** yang bener. Bukan langsung bikin tool satu-satu.

Yang dikerjain:
- **Setup routing** — React Router 7 framework mode, struktur direktori `app/routes/` dengan kategori (financial, dev, text, design, convert)
- **Theme system** — CSS custom properties untuk surface hierarchy, brand colors, text colors. Sistem dark/light yang smooth dengan FOUC prevention via inline script
- **Design tokens** — Tailwind `@theme` mapping ke CSS custom properties, radius tokens, font family (Inter + Space Grotesk), animasi
- **GlassNav** — Navigasi bawah dengan glassmorphism effect. Ini yang paling seru: pill-shaped floating bar dengan backdrop-blur, icon SVG 24x24, dan efek neon pink di item aktif
- **Header** — Minimal, fixed, dengan gradient fade di bawahnya

Ini fase paling penting. Kalau design foundation-nya jelek, 25 tools bakal kelihatan seperti 25 halaman terpisah tanpa identitas.

### Minggu 3-4: Financial Tools

Setelah foundation siap, waktunya nulis tool beneran. Saya mulai dari **financial tools** karena ini yang paling gue pengen pake sendiri:

- **Currency Converter** — 170+ mata uang, live rates, proxy via Cloudflare
- **Gold Price Tracker** — harga emas real-time berdasarkan berat dan kemurnian
- **Tax Calculator (PPh)** — PPh 21 Indonesia dengan progressive brackets
- **Loan Calculator** — cicilan, bunga, amortisasi
- **CAGR Calculator** — compound annual growth rate

Setiap tool punya struktur page yang konsisten: ikon di atas, judul, deskripsi, JSON-LD structured data, dan breadcrumb di schema.

### Minggu 5-6: Developer & Design Tools

**Developer tools** adalah kategori paling seru. Pure logic, nggak perlu API:

- JSON Formatter & Validator, UUID Generator (v4 + v7), Base64 Encode/Decode
- JWT Debugger, Regex Tester, Cron Expression Editor

Yang bikin seru: masing-masing adalah **komponen React mandiri** dengan state via `useState`. Nggak perlu Redux atau query library. Logika tool cukup 50-100 baris.

**Design tools** — yang paling unexpected:

- **Memoji Downloader** — 800+ sprite-based emoji dari Figma Community. 14 karakter, 29 emosi, 2 skin tone. Teknisnya: sprite sheet WebP 9145x7952 pixel, tiap emoji 256x256. Background-position math + sprite sheet slicing. User bisa download sebagai PNG, JPG, atau SVG.

### Minggu 7-8: Text & Converter Tools

Nambahin text tools dan converter: Word Counter, Diff Checker, Case Converter, Markdown Preview, Slug Generator, JSON to CSV, PDF Scanner (client-side pake Web Assembly!), Roman to Decimal.

PDF Scanner menarik — lo scan PDF dan hasilnya nggak pernah meninggalkan device lo. Ini level privacy yang saya kejar.

### Minggu 9-11: Polish, SEO & Performance

Fase terakhir — **meningkatkan kualitas** yang udah ada tanpa nambah tool baru:

- **SEO** — Setiap halaman punya title unik, description relevan, Open Graph, dan JSON-LD dengan schema WebPage, SoftwareApplication, CollectionPage, BreadcrumbList
- **Sitemap & robots.txt** — XML sitemap biar Google crawl semua halaman
- **Bot detection di SSR** — Kalau request dari bot, server tunggu semua konten selesai dirender sebelum ngirim response (krusial buat SEO)
- **Performance** — Font preconnect, CSS purging, sprite sheets untuk emoji

---

## Technical Highlights

### 1. Design System dengan CSS Custom Properties + Tailwind Theme

Ini kombinasi yang jarang dibahas. Warna saya define di CSS custom properties (`--tk-surface`, `--tk-primary`, dll), lalu Tailwind `@theme` nge-map itu ke utility classes. Hasilnya: **satu source of truth** untuk semua warna di aplikasi. Ganti satu nilai? Semua berubah. Dark mode tinggal toggle class di `<html>`.

### 2. Glassmorphism yang Cinematic

Bukan glassmorphism biasa. Saya bikin utility `glass` dan `glass-strong` pake `color-mix()`, `backdrop-filter: blur(24px)`, dan `neon-glow` buat aksen. Inspirasi dari indie cinema — bayangin adegan malam di _Drive_ (2011) atau _Blade Runner 2049_: gelap, minimalis, tapi setiap elemen terang terasa intentional.

### 3. Client-Side Processing = Privacy + Speed

**Semua processing di browser.** JSON, UUID, regex, text conversion — nggak ada data dikirim ke server. Efeknya: jalan meski internet lemot, nol biaya server buat processing, dan privacy terjamin.

### 4. SEO dengan SSR + JSON-LD

React Router 7 ngasih SSR out of the box. Saya kombinasikan dengan JSON-LD di setiap halaman — `SoftwareApplication` buat tool, `CollectionPage` buat kategori, `BreadcrumbList` buat navigasi. Google bisa memahami struktur konten dengan jelas.

---

## Metrik & Target

Toolhub masih awal, tapi beberapa angka yang saya kejar:

- **Target tools**: 30+ tools dalam 5 kategori (financial, dev, text, design, convert)
- **Page load target**: < 1 detik di semua halaman, berkat edge deployment dan rendering yang efisien
- **SEO target**: Setiap tool page punya meta tags unik, JSON-LD, dan sitemap entry
- **Bounce rate target**: Di bawah 40% — dengan UX yang premium dan nol iklan, saya optimis orang bakal stay lebih lama

Ini bukan soal metrics dulu. Ini soal **bikin tool site yang lo sendiri bangga pake**.

---

## Lessons Learned

### "Ship fast, polish later" — Tapi Desain Foundation Harus Solid

Saya percaya "ship fast, polish later" — dengan satu syarat: **foundation harus bener dari awal**. Design tokens, theme system, routing structure — ini yang nggak bisa asal-asalan. Kalau udah solid, nambah tool baru tinggal copy template dan isi logika.

### Client-Side Tools Itu Sederhana

Banyak developer overthink. "Butuh backend, butuh API, butuh database..." Padahal 90% tool paling berguna — JSON formatter, UUID generator, regex tester — **cuma operasi string** yang bisa dijalanin di browser. Kalau lo bisa nulis `JSON.parse()`, lo bisa bikin tool site.

### SEO SSR Itu Penting

Tool site yang bagus tapi nggak ketemu di Google percuma. React Router 7 SSR + JSON-LD structured data adalah **duo maut** buat SEO. Pasang meta tags yang proper dari tool pertama.

### Nggak Perlu Backend untuk 90% Use Case

Ini problem yang saya lihat di banyak indie hacker: mereka langsung mikirin stack kompleks sebelum ngerti apa yang mereka bangun. Toolhub membuktikan bahwa dengan **React + Cloudflare Workers**, lo bisa bikin tool site powerful tanpa backend satupun.

---

## What's Next?

Toolhub nggak berhenti di sini. Roadmap ke depan:

1. **Lebih banyak tools** — Saya target 40+ tools dengan kategori baru (Math, Unit Conversion, Color Tools)
2. **PWA** — Installable di HP, offline mode buat tool-tool yang pure client-side
3. **User accounts** (maybe) — Kalo ada permintaan, mungkin saya tambahin fitur favorite tools, history, atau custom shortcuts
4. **Open source** — Saya lagi mikir buat open source bagian-bagian tertentu

Tapi prioritas utama tetap: **bikin tool yang berguna, cepat, dan enak dipake.**

---

## Kesimpulan

Bangun tool site di 2026 itu rewarding banget — dan nggak seribet yang lo kira.

Tools modern kaya React Router 7, Tailwind CSS v4, dan Cloudflare Workers udah nyediain fondasi yang kuat. Lo tinggal fokus ke: **apa yang pengen lo bangun, dan gimana caranya bikin itu luar biasa**.

Toolhub adalah bukti bahwa 1 orang dengan tools yang tepat bisa ngirim apa yang biasanya dikerjain tim. Nggak perlu jadi superhero. Cuma perlu bikin keputusan arsitektur yang tepat, dan konsisten nulis kode tiap hari.

Kalo lo lagi mikir, "Gue pengen bikin tool site juga tapi bingung mulai dari mana" — jawabannya: mulai aja. Dari tool yang paling lo butuhin sendiri. Dari JSON formatter yang lo pake tiap hari, atau currency converter yang lo buka pas mau traveling.

Karena di akhir hari, tool site terbaik adalah tool yang lo buat untuk diri lo sendiri — dan ternyata orang lain juga butuh.

---

Ada tools yang pengen liat di Toolhub? Kritik atau saran? Mention aja. Saya baca semua feedback, karena saya bikin ini untuk komunitas developer Indonesia.
