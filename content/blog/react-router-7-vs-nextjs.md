---
title: "React Router 7: Udah Nggak Perlu Next.js Lagi?"
description: "React Router 7 udah berubah dari library routing biasa jadi full-stack framework. Apakah ini akhir dari dominasi Next.js? Opini jujur dari developer yang udah pindah."
published: 2026-07-23
tags: [react-router, nextjs, frontend, react, framework-comparison]
readingTime: 12
---

# React Router 7: Udah Nggak Perlu Next.js Lagi?

**Setelah React Router 7 rilis, gue nggak install Next.js lagi.**

Dramatis? Mungkin. Tapi ada alasannya.

Selama bertahun-tahun, kalau lo mau bikin React app dengan SSR (server-side rendering), pilihannya cuma dua: Next.js — atau Remix. Next.js punya ekosistem terbesar, Remix punya pendekatan web standard yang lebih bersih. Tapi sejak merger Remix ke React Router di awal 2025, lahirlah sesuatu yang bikin peta persaingan berubah total.

React Router 7 bukan lagi sekadar library routing biasa. Ini adalah full-stack framework dengan SSR, streaming, file-based routing, type safety, dan semua yang lo harapkan dari framework React modern — tanpa vendor lock-in, tanpa mental model "use client/use server", dan yang paling penting: **dibangun di atas Vite**.

Dan sebagai developer yang udah ngenalin React Router dari jaman versi 3 (ngaku, siapa yang masih inget `browserHistory`?), saya harus bilang: ini pertama kalinya saya merasa punya alasan serius buat mikir ulang sebelum auto-pilih Next.js.

---

## Dari Routing Library Jadi Framework: Evolusi React Router

Buat yang terakhir nyentuh React Router di versi 5 atau 6 awal, mungkin lo kaget lihat React Router 7 sekarang. Ini bukan library yang sama.

Tim Remix (yang diakuisisi Shopify) memutuskan untuk menggabungkan Remix — framework React full-stack yang udah mature — ke dalam React Router. Hasilnya? React Router 7 punya **dua mode**:

1. **Library mode** — tetap bisa dipake sebagai routing library biasa kayak dulu
2. **Framework mode** — full-stack SSR framework ala Remix, dengan `app/routes/`, `entry.server.tsx`, `entry.client.tsx`, loader, action, dan semua kelengkapannya

Yang menarik: mode manapun yang lo pake, semua dibangun di atas **Vite**. Bukan Webpack, bukan Turbopack. Vite.

Ini penting banget, dan kita bakal bahas nanti.

---

## React Router 7 vs Next.js: Perbandingan Langsung

Daripada basa-basi, mending langsung aja kita bandingin head-to-head.

### Routing: File-Based vs Config

Dua-duanya support file-based routing. Tapi pendekatannya beda.

**Next.js App Router** pake sistem folder dengan keywords kayak `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, dan `route.tsx`. Ini rapi dan predictable — tapi saklek. Mau nggak mau, lo harus ikutin struktur ini.

**React Router 7** ngasih lo fleksibilitas lebih. Lo bisa pake file-based routing (ala Remix) atau flat route config — atau kombinasi keduanya. Di Toolhub misalnya, saya pake flat config di `app/routes.ts` karena lebih eksplisit dan gampang dilacak:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dev/json", "routes/dev/json.tsx"),
  route("dev/uuid", "routes/dev/uuid.tsx"),
  route("design/memoji", "routes/design/memoji.tsx"),
];
```

Nggak ada magic folder naming. Lo tentuin path dan file mapping-nya sendiri. Buat project dengan struktur yang nggak standar, ini berkah banget.

**Winner: React Router 7** — lebih fleksibel, nggak强迫 lo ikut struktur folder tertentu.

### Data Loading: Loader/Action vs Server Components

Ini perbedaan filosofis terbesar antara dua framework.

**React Router 7** pake model **loader** dan **action** yang diwarisi dari Remix:

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  const data = await db.getPost(params.id);
  return data; // langsung, sederhana, nggak ribet
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const post = loaderData;
  return <h1>{post.title}</h1>;
}
```

Loader jalan di server, data otomatis terkirim ke komponen. Nggak ada `"use client"`, nggak ada `"use server"`, nggak ada mental model baru yang harus diurus.

**Next.js App Router** pake React Server Components (RSC). Lo harus ngerti mana komponen yang jalan di server, mana yang jalan di client, kapan pake `"use client"`, dan cara data synchronization antara keduanya. Untuk tim yang udah terbiasa, ini oke. Untuk yang baru belajar? Ini bisa jadi sumber frustrasi.

Saya suka analogi ini: **RR7 loader itu kayak `getServerSideProps` di Next.js Pages Router — cuma lebih baik.** Simpel, mudah dipahami, dan nggak perlu mikir client-server boundary setiap kali bikin komponen.

**Winner: React Router 7** — lebih sederhana, nggak perlu mental model baru.

### SSR dan Streaming

Keduanya support penuh **React 19 streaming SSR** dengan Suspense boundaries. Performa secara umum sebanding.

Di RR7, lo pake `defer()` buat streaming data yang lambat sambil nunggu shell-nya ke-render duluan. Di Next.js, lo pake `Suspense` di layout level dengan `loading.tsx`.

Implementasinya beda, tapi hasil akhirnya mirip — user bisa liat konten lebih cepet tanpa nunggu semua data selesai.

**Winner: Draw** — sama-sama capable.

### Deployment: Vendor Lock-in Adalah Musuh

Ini mungkin poin paling krusial buat banyak orang.

**Next.js** secara desain **tightly coupled dengan Vercel**. Iya, lo bisa deploy Next.js ke Cloudflare via OpenNext, atau ke server sendiri via `next start`. Tapi fitur-fitur kayak ISR, Middleware, Image Optimization, dan Incremental Cache — itu semua kerja optimalnya cuma di Vercel. Di platform lain? Ada aja yang kurang, ada aja yang mesti diakalin.

**React Router 7** dibangun dengan prinsip **deploy-anywhere**. Kode yang lo tulis bakal jalan identik di:

- **Cloudflare Workers** (pake Vite plugin Cloudflare)
- **Node.js** (server Express buatan sendiri)
- **Deno**
- **Netlify**
- **Vercel**
- **AWS Lambda** via adapter

Nggak ada "works best on X" asterisk. Bangun sekali, deploy di mana aja.

Di Toolhub, kita pake **Cloudflare Workers** (via `wrangler deploy`), dan setup-nya cuma:

```bash
npm create cloudflare@latest -- my-app --framework=react-router
```

Beres. Local development pake Workers runtime, production langsung di edge network Cloudflare. Nggak ada adaptasi khusus, nggak ada workaround.

**Winner: React Router 7** — fleksibelitas deployment juara.

### Build Speed: Vite vs Turbopack

Lo mungkin denger Next.js pake **Turbopack**, bundler Rust yang katanya 10x lebih cepet dari Webpack. Masalahnya? Turbopack masih **belum stabil untuk production** di beberapa area. Banyak yang akhirnya balik ke Webpack di Next.js karena Turbopack masih ada bug.

Sementara itu, **Vite** udah mature banget di 2026. Ekosistem plugin-nya luas, HMR-nya cepet, dan konfigurasinya sederhana. React Router 7 built on Vite dari awal — berarti lo dapet semua keuntungan Vite tanpa harus mikir workaround.

**Winner: React Router 7** — Vite lebih mature dan stabil.

### Complexity: Nggak Ada "use client" Mental Model

Next.js App Router punya learning curve yang curam. Untuk tim baru, sering muncul pertanyaan-pertanyaan kayak:

- "Kenapa komponen ini error pas di-render?"
- "Oh, lupa kasih 'use client'. Tapi kalo pake 'use client', bundle-nya gede."
- "Data yang di-load di server component, gimana caranya diakses di client component?"
- "Ini cached atau nggak?"

React Router 7 nggak punya masalah ini. **Semua komponen di RR7 jalan di client.** Data di-load via loader (di server), hasilnya dikirim ke client. Batasnya jelas: loader di server, komponen di client. Selesai.

Ini bukan berarti RR7 "lebih jelek" atau "kurang canggih" — ini pilihan desain yang sadar. Kadang, **kesederhanaan adalah fitur**.

**Winner: React Router 7** — learning curve lebih landai.

---

## Kapan Lo Tetep Pake Next.js (Harus Jujur)

Saya nggak akan bilang RR7 lebih baik dari Next.js di segala aspek. Itu nggak jujur. Ada skenario di mana Next.js tetap pilihan yang lebih tepat:

**1. Butuh image optimization built-in**

Next.js punya `<Image />` component dengan optimasi otomatis — WebP generation, responsive srcset, lazy loading, blur placeholder. Di RR7, lo harus setup sendiri pake `vite-imagetools` atau layanan kayak Cloudinary/Imgix. Bisa sih, tapi nggak built-in.

**2. Udah terlanjur invest di Vercel ecosystem**

Kadang, pilihan framework bukan cuma soal teknis. Tim lo udah nyaman dengan Vercel Analytics, Edge Config, Cron Jobs, dan fitur Vercel lainnya. Migrasi framework berarti migrasi tooling — dan itu cost yang nggak kecil.

**3. Tim udah nyaman dengan Server Components pattern**

RSC akan tetap relevan, terutama untuk aplikasi dengan interaktivitas rendah yang pengen bundle size minimal. Next.js punya implementasi RSC paling mature.

**4. Butuh ISR (Incremental Static Regeneration)**

Next.js punya ISR yang mature. RR7 approach-nya pake HTTP caching (CDN-level), yang sebenernya lebih "web standard" — tapi belum seasik ISR buat use case tertentu kayak e-commerce dengan catalog besar yang perlu invalidasi selektif.

**5. Butuh ecosystem terluas**

Jumlah plugin, library, template, tutorial, dan job market Next.js masih jauh di atas React Router. Ini realita. Buat startup yang butuh hire cepat, Next.js lebih aman.

---

## Kapan Lo Pilih React Router 7

Sebaliknya, ini saat yang tepat buat pilih RR7:

**1. Lo pengen kontrol penuh atas deployment target**

Lo punya infrastruktur sendiri di Cloudflare, AWS, atau server sendiri? RR7 ngasih lo kontrol penuh. Nggak ada yang maksa lo pake platform tertentu.

**2. Lo nggak suka magic**

"use client", "use server", caching yang implicit, suspense boundaries yang kadang confusing — kalau lo lebih suka kode yang eksplisit dan mudah diprediksi, RR7 bakal terasa kayak lega napas.

**3. Lo lebih suka Vite daripada Webpack/Turbopack**

Vite user? Lo udah di rumah. Plugin Vite apa pun kompatibel, konfigurasinya familiar, build time-nya cepet.

**4. Project lo nggak butuh semua fitur Next.js**

Banyak project — dashboard internal, landing page, tools web, API middleware — nggak butuh ISR, image optimization, atau Server Components. Buat use case kayak gini, RR7 lebih ringan dan lebih cepat di-setup.

**5. Lo bikin aplikasi form-heavy atau data-entry**

Ini di mana heritage Remix benar-benar bersinar. Form handling, optimistic UI, validation — RR7 punya approach yang lebih matang daripada Next.js karena dibangun dari dasar buat use case ini.

---

## Real Talk: Ini Bukan "Next.js Killer"

Oke, judulnya provokatif. Tapi saya harus clear: **React Router 7 bukan Next.js killer.** Dan saya nggak akan pernah bilang gitu.

Next.js punya 140k GitHub stars, 28M+ npm downloads per minggu, tim engineering dedicated di Vercel, dan ekosistem yang nggak ada bandingannya. React Router 7 adalah alternatif — alternatif yang legitimate, serius, dan matang — tapi tetap alternatif.

Yang berubah dengan hadirnya RR7 adalah: **lo punya pilihan sekarang. Pilihan yang sebelumnya nggak ada.**

Dulu, kalau lo butuh SSR di React, lo harus pilih: Next.js dengan Vercel lock-in dan complexity, atau Remix dengan komunitas lebih kecil dan dokumentasi yang kurang mature. Sekarang Remix udah merge ke React Router, dapet stabilitas dari base code yang udah mature, dukungan Shopify, dan komunitas React Router yang besar (54k GitHub stars + 32k Remix legacy).

Ini sweet spot yang sebelumnya nggak ada.

---

## Cerita dari Toolhub: RR7 di Production

Biar nggak cuma teori, saya cerita pengalaman pakai React Router 7 di Toolhub.

Toolhub adalah tool website yang dibangun dengan React Router 7 + Cloudflare Workers. Struktur routing-nya pake flat config (bisa lo liat di atas), SSR diaktifkan, dan deployment pake Wrangler.

**Yang berasa banget:**

- **HMR cepet banget.** Edit komponen, langsung keliatan. Nggak perlu nunggu build ulang.
- **Type safety end-to-end.** RR7 punya codegen yang otomatis generate tipe buat setiap route. Jadi `loaderData` di komponen udah auto-typed. Nggak perlu manual define interface buat response data.
- **Deployment simpel.** `npm run deploy` — selesai. Upload ke Cloudflare Workers dalam hitungan detik.
- **Middleware stabil.** Buat handle auth, redirect, atau inject data ke semua route.

**Yang agak kurang:**

- **Dokumentasi.** Setelah merger Remix, dokumentasi masih agak campur aduk. Kadang lo nemu referensi Remix yang udah deprecated, kadang tutorial mention fitur yang belum stabil.
- **Ekosistem third-party.** Beberapa library masih belum punya adapter resmi buat RR7 framework mode. Tapi ini makin membaik tiap bulan.

Secara keseluruhan, pengalaman production-nya **solid**. Nggak ada masalah berarti. Dan fleksibelitas deployment bikin kita tidur lebih nyenyak malam hari.

---

## Kesimpulan: Lo Punya Pilihan Sekarang

React Router 7 adalah framework React paling versatile yang pernah ada. Lo bisa pake sebagai library routing biasa, atau full-stack framework dengan SSR. Lo bisa deploy ke mana aja. Lo nggak perlu belajar mental model baru.

Tapi yang paling penting: **kompetisi itu sehat.**

Dulu, Next.js dominan karena nggak ada alternatif yang serius. Sekarang ada RR7 — dan persaingan ini bikin semua framework jadi lebih baik. Next.js harus terus inovasi. RR7 harus terus matangkan ekosistem. Dan kita, sebagai developer, diuntungkan.

Jadi, jawaban dari judul artikel ini: "Udah nggak perlu Next.js lagi?"

Nggak juga. Tapi sekarang lo punya pilihan. Dan punya pilihan — itu selalu lebih baik daripada nggak punya.

**Pilih framework berdasarkan kebutuhan project lo, bukan karena tekanan komunitas atau FOMO. Dan kalau lo penasaran sama React Router 7, coba aja bikin project kecil pake `npm create cloudflare@latest` — lo bakal lihat sendiri gimana rasanya.**

---

*Lo udah coba React Router 7? Atau masih setia sama Next.js? Share pengalaman lo di komentar atau kirim DM — gue penasaran banget denger cerita dari developer Indonesia yang udah cobain RR7 di production.*
