---
title: "Cloudflare Workers: Deploy ke Edge, 5 Menit Jadi"
description: "Tutorial step-by-step deploy aplikasi React Router 7 ke Cloudflare Workers. Edge computing, latency rendah, dan 100k request gratis per hari."
date: 2026-07-23
tags: [cloudflare, react-router, edge-computing, tutorial, deployment]
---

# Cloudflare Workers: Deploy ke Edge, 5 Menit Jadi

Bayangin aplikasi lo jalan di 300+ data center di seluruh dunia — termasuk Jakarta, Singapura, dan Sydney. Seorang user dari Indonesia nge-request halaman, dan data nggak perlu bepergian ke Virginia atau Frankfurt buat diproses. Balikannya di bawah 100ms. Itu yang dinamain **edge computing**, dan Cloudflare Workers adalah salah satu cara termudah untuk mulai menggunakannya.

Di artikel ini, gua bakal nunjukin lo — dalam 5 menit — gimana cara deploy aplikasi React Router 7 ke Cloudflare Workers. Mulai dari setup sampai production. Siap? Gas.

---

## Apa Itu Edge Computing dan Kenapa Lo Peduli?

Coba inget-inget arsitektur web jaman dulu. Lo deploy aplikasi di satu server — entah di AWS us-east-1 (Virginia), atau Google Cloud di Oregon. User dari Indonesia harus nunggu data bolak-balik Jakarta-Virginia. RTT (Round Trip Time)-nya bisa 200-300ms, belum termasuk waktu render di server.

Edge computing ngubah paradigm ini. Daripada aplikasi lo jalan di satu data center, aplikasi lo jalan di **banyak data center sekaligus** — di "edge" network, sedekat mungkin dengan user.

<blockquote>
"Edge computing bukan soal di mana server lo berada. Ini soal seberapa dekat server lo dengan user lo."
</blockquote>

Manfaatnya jelas:
- **Latency lebih rendah** — response time bisa turun drastis, dari 300ms jadi di bawah 50ms buat user Indonesia.
- **Availability lebih tinggi** — kalau satu data center down, yang lain langsung ambil alih.
- **Scaling otomatis** — nggak perlu mikirin provisioning server.

---

## Apa Itu Cloudflare Workers?

Cloudflare Workers adalah platform **serverless functions** yang jalan di edge network Cloudflare. Bedanya sama serverless biasa (Lambda, Google Cloud Functions) ada di lapisan infrastruktur:

**Lambda dkk. = container-based.** Kalau cold start, perlu waktu beberapa detik buat spinning up container. **Workers = V8 isolates.** Ini bukan container. Ini isolated JavaScript environments yang jalan langsung di V8 engine — browser engine yang sama yang lo pake buat buka website.

Konsekuensinya?
- **Cold start nyaris nol.** Workers mulai dalam hitungan **sub-milidetik**. Nggak ada ceritanya fungsi lo lemot karena "server lagi angetin diri".
- **Startup cost rendah banget.** Karena V8 isolates jauh lebih ringan dari container.

### Ekosistem Cloudflare Workers

Ini yang bikin Workers makin powerful:

| Service | Fungsi | Analogi |
|---------|--------|---------|
| **Workers KV** | Key-value store global | Redis, tapi eventual consistent |
| **D1** | SQLite-based relational DB | Database relasional di edge |
| **R2** | Object storage | S3 tanpa egress fee |
| **Queues** | Message queue | SQS |
| **Durable Objects** | Stateful objects | State management di edge |

### Soal Harga

Ini bagian yang paling bikin senyum: **Free tier Cloudflare Workers dapet 100.000 request per hari.** Seratus ribu. Gratis. Buat side project, portfolio, atau aplikasi internal, itu lebih dari cukup. Kalau aplikasi lo mulai besar, Paid plan mulai dari $5/bulan.

---

## Tutorial: Deploy React Router 7 ke Cloudflare Workers

Sekarang kita mulai ngoding. Lo bakal kaget betapa gampangnya ini. Ikutin langkah-langkah di bawah.

### Prasyarat

Sebelum mulai, pastikan lo punya:

- **Node.js 18+** — [Download di sini](https://nodejs.org/) kalo belum punya
- **Cloudflare account** — [Daftar gratis](https://dash.cloudflare.com/sign-up)
- **GitHub account** — buat version control

### Step 1: Install Wrangler CLI dan Login

Wrangler adalah CLI resmi dari Cloudflare buat manage Workers. Install dan login sekali:

```bash
npx wrangler login
```

Perintah ini bakal ngebuka browser lo dan minta lo login ke Cloudflare. Klik "Allow", selesai. Wrangler sekarang terautentikasi di mesin lo.

Kalo lo penasaran udah login atau belum:

```bash
npx wrangler whoami
```

Harusnya muncul nama akun Cloudflare lo.

### Step 2: Buat Project React Router 7

Bikin project baru dengan template React Router 7. Lo bisa pilih template "cloudflare" yang udah include adapter Cloudflare Workers:

```bash
npx create-react-router@latest my-app --template cloudflare-workers
cd my-app
npm install
```

Kalau proses ini kelar, struktur folder lo bakal kira-kira begini:

```
my-app/
├── app/
│   ├── routes/
│   │   └── _index.tsx
│   ├── root.tsx
│   └── routes.ts
├── public/
├── workers/
│   └── index.ts
├── react-router.config.ts
├── wrangler.jsonc
└── package.json
```

### Step 3: Pahami `wrangler.jsonc` dan Konfigurasi

Buka file `wrangler.jsonc` di project lo. Ini konfigurasi utama Workers:

```jsonc
{
  "name": "my-app",
  "compatibility_date": "2026-07-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./build/client",
  "main": "./build/server/index.js"
}
```

Poin penting:
- `compatibility_flags` — flag `nodejs_compat` enable polyfill buat beberapa Node.js built-in modules yang nggak native di Workers.
- `pages_build_output_dir` — ini output buat static assets (client-side).
- `main` — entry point server-side yang bakal di-run di edge.

### Step 4: Deploy ke Cloudflare Workers

Ini bagian yang paling seru. Satu perintah doang:

```bash
npx wrangler deploy
```

Wrangler bakal:
1. Build project lo (`react-router build`)
2. Upload server-side code ke Cloudflare Workers
3. Upload client-side assets ke Cloudflare Pages
4. Return URL production

Kalau sukses, lo bakal liat output mirip gini:

```
✨ Success! Workers deployment complete
📋 Your project is deployed at: https://my-app.<your-subdomain>.workers.dev
```

Buka URL itu di browser. Aplikasi React Router 7 lo sekarang jalan di edge network Cloudflare. Lo bisa test dari mana aja — latency-nya bakal kerasa beda.

### Step 5: Setup Custom Domain (Production)

URL `*.workers.dev` oke buat staging, tapi buat production lo pasti mau pake domain sendiri. Caranya:

```bash
npx wrangler pages project create
```

Terus di Cloudflare Dashboard:
1. Buka **Workers & Pages** > pilih project lo
2. Masuk ke tab **Custom domains**
3. Klik **Set up a custom domain**
4. Masukin domain lo (misal: `app.domainlo.com`)

Kalau DNS lo udah di Cloudflare, ini tinggal jalan. SSL certificate diurus otomatis sama Cloudflare — gratis, valid, dan auto-renew.

---

## Tips Production

Deploy kelar? Mantap. Tapi biar aplikasi lo beneran siap production, ada beberapa hal yang perlu lo perhatiin.

### Environment Variables & Secrets

Jangan pernah hardcode API key di kode lo. Pake secrets:

```bash
echo "YOUR_API_KEY" | npx wrangler secret put API_KEY
```

Di kode, akses lewat `env.API_KEY` (di handler function):

```typescript
export default {
  async fetch(request, env, ctx) {
    const apiKey = env.API_KEY;
    // ...
  },
};
```

### Monitoring dengan `wrangler tail`

Production app pasti sometime error. Buat debug real-time, lo bisa tail log:

```bash
npx wrangler tail
```

Ini bakal streaming semua request, log, dan error dari Worker lo langsung ke terminal. Sangat berguna pas baru deploy dan pengen mastiin semuanya jalan.

### KV Caching buat API Calls

Workers KV cocok banget buat caching API response yang nggak perlu real-time banget. Contoh:

```typescript
// Cache API response di Workers KV
async function getCachedData(env, key) {
  const cached = await env.KV_NAMESPACE.get(key, "json");
  if (cached) return cached;

  const fresh = await fetch("https://api.example.com/data").then(r => r.json());
  await env.KV_NAMESPACE.put(key, JSON.stringify(fresh), { expirationTtl: 3600 });
  return fresh;
}
```

Ini potong latency response dari ratusan milidetik jadi satuan milidetik.

---

## Kenapa Toolhub Pakai Cloudflare Workers?

Biar cerita dikit: Toolhub awalnya dibangun pake Vercel. Oke sih, tapi waktu traffic mulai naik, kami sadar sebagian besar user datang dari Indonesia dan Asia Tenggara. Response time-nya masih di 200-400ms karena server di Amerika atau Eropa.

Kami migrasi ke Cloudflare Workers dan dua hal langsung berubah:
- **Response time turun ke rata-rata 40-80ms** buat user Indonesia
- **Biaya turun drastis** — dari puluhan dolar per bulan jadi hampir gratis

Apalagi dengan adanya React Router 7 yang first-class support Cloudflare Workers, deployment jadi semulus sutra. Build, `npx wrangler deploy`, selesai. CD pipeline tinggal nambahin satu step.

---

## Keterbatasan (Jujur-Jujuran)

Gua nggak mau jual Workers sebagai silver bullet. Ada beberapa hal yang perlu lo tau:

- **CPU time: 30ms per request (Free), 30 detik (Paid).** Buat aplikasi berat komputasi kayak image processing, ini bisa jadi bottleneck.
- **Nggak semua package kompatibel.** Beberapa library Node.js yang rely on native modules (`fs`, `net`, `child_process`) nggak akan jalan di Workers. Lo perlu cari alternatif yang pure JavaScript atau WASM.
- **Workers KV eventual consistent.** Ada delay kecil (sampai 60 detik) antara nulis dan baca data. Buat aplikasi yang butuh strong consistency, pake D1 atau Durable Objects.
- **Local development.** Wrangler `dev` udah bagus, tapi beberapa edge case cuma muncul di production. Pastiin lo testing di staging dulu.

Tapi jujur, buat 90% use case — API endpoints, SSR React, middleware, static site — keterbatasan ini jarang jadi masalah.

---

## Kesimpulan

Edge computing bukan masa depan lagi — ini **sekarang**. Dan Cloudflare Workers adalah cara paling gampang untuk mulai. Gratis, cepat, dan ekosistemnya makin matang setiap bulan.

Yang lo dapet:
- Aplikasi yang jalan di 300+ lokasi di seluruh dunia
- Cold start sub-milidetik
- Free tier 100k request/hari
- Integrasi seamless sama React Router 7, Next.js, Astro, atau framework apapun

Lo nggak perlu jadi DevOps senior atau arsitek cloud buat mulai. `npx wrangler deploy` — itu doang.

Coba aja sekarang. Bikin project React Router 7 lo, deploy ke Workers, dan rasain bedanya. Lo bakal mikir, "Kenapa nggak dari dulu?"

---

*Punya pertanyaan atau pengalaman deploy ke Cloudflare Workers? Tulis di komentar atau mention Twitter. Diskusi seru selalu ditunggu.*
