---
title: "UUID v4 vs v7: Mana yang Harus Kamu Pakai untuk Database?"
description: "Perbandingan lengkap UUID v4 dan v7 — dari performa database, indexing, collision risk, sampai panduan kapan harus pakai yang mana."
date: "2026-07-23"
tags: ["uuid", "database", "backend", "tutorial"]
---

# UUID v4 vs v7: Mana yang Harus Kamu Pakai untuk Database?

Pernah nggak sih kamu buka tabel database, terus lihat primary key berupa deretan angka kayak `550e8400-e29b-41d4-a716-446655440000`? Itulah UUID — atau *Universally Unique Identifier*. Fungsinya kayak KTP-nya data: setiap row punya identitas unik yang dijamin nggak bakal bentrok dengan row lain, bahkan di database yang berbeda.

Tapi masalahnya, nggak semua UUID diciptakan setara. Ada UUID v4 yang udah jadi standar sejak lama, dan ada UUID v7 yang baru naik daun. Mana yang lebih cocok buat project kamu? Yuk kita bedah.

## Apa Itu UUID?

UUID adalah standar identifikasi 128-bit yang biasanya ditulis dalam format heksadesimal `8-4-4-4-12`:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Angka `128-bit` ini artinya total ada 2^128 kemungkinan kombinasi. Sebagai gambaran, kalau kamu generate 1 triliun UUID per detik selama 100 tahun, kemungkinan collision-nya masih mendekati nol. Gila banget.

Dari sekian banyak versi UUID, tiga yang paling sering dipakai:

- **UUID v1**: Berdasarkan timestamp dan MAC address. Dulu populer, tapi sekarang mulai ditinggalkan karena MAC address bisa dipakai buat melacak perangkat.
- **UUID v4**: Random murni. Paling populer. Standar de facto di banyak aplikasi.
- **UUID v7**: Time-ordered based on timestamp. Relatif baru, tapi mulai banyak diadopsi karena ramah database.

Kita fokus ke v4 vs v7, karena ini yang paling relevan buat developer sekarang.

## UUID v4: Si Random yang Terpercaya

UUID v4 adalah jenis UUID yang nilai 128-bit-nya hampir seluruhnya diisi data random. Kalau kamu generate UUID v4 di bahasa pemrograman manapun, hasilnya bakal kelihatan seperti ini:

```
3a2d3c8e-f713-4f1f-9a5b-1e3c8e7f9a5b
6b8c5b8e-7f9a-4f1f-9a5b-1e3c8e7f9a5b
c7f9a5b1-e3c8-4f1f-9a5b-1e3c8e7f9a5b
```

Perhatikan polanya: benar-benar acak. Nggak ada hubungan antara satu UUID dengan UUID lainnya.

### Kelebihan UUID v4

**Simple dan universal.** Hampir semua bahasa pemrograman punya library bawaan buat generate UUID v4. Di Node.js tinggal panggil `crypto.randomUUID()`, di Python tinggal `uuid.uuid4()`. Nggak perlu install package tambahan.

**Collision probability sangat kecil.** Dengan 122 bit random, kemungkinan dua UUID v4 bentrok secara praktis nol. Cocok buat sistem terdistribusi di mana kamu butuh ID unik tanpa koordinasi pusat.

**Privasi lebih terjaga.** Nggak kayak UUID v1 yang pakai MAC address, UUID v4 nggak bocorin informasi apapun tentang perangkat atau waktu.

### Kekurangan UUID v4

**Nggak sortable.** Karena random, UUID v4 nggak bisa diurutkan berdasarkan waktu. Kamu nggak tahu mana data yang lebih baru cuma dengan sorting UUID.

**Index fragmentation di database.** Ini masalah yang paling krusial. Database kayak PostgreSQL atau MySQL pake B-tree buat indexing. Kalau primary key-nya UUID v4 yang random, setiap INSERT baru akan disisipkan di posisi acak di index tree. Akibatnya:

- **Page split** terjadi lebih sering
- **Cache hit ratio** turun karena data nggak berurutan
- **Write performance** melambat seiring bertambahnya data

Di tabel dengan jutaan row, perbedaan performa INSERT bisa 2-3 kali lebih lambat dibanding pakai auto-increment integer.

## UUID v7: Si Terurut yang Ramah Database

UUID v7 hadir sebagai solusi dari masalah di atas. Formatnya:

```
xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
```

Huruf `7` di posisi tertentu menandakan ini UUID v7. Tapi yang bikin beda adalah isinya: **48 bit pertama adalah Unix timestamp** (dalam milidetik), sisanya random.

Jadi kalau kamu generate UUID v7, hasilnya bakal mirip gini:

```
018f3a2d-3c8e-7f13-9a5b-1e3c8e7f9a5b
018f3a2d-3c8e-7f14-9a5b-1e3c8e7f9a5b
018f3a2d-3c8e-7f15-9a5b-1e3c8e7f9a5b
```

Lihat perbedaannya? Tiga UUID di atas punya prefix yang hampir sama karena di-generate dalam waktu berdekatan. Ini yang bikin UUID v7 **sortable by time**.

### Kelebihan UUID v7

**Sortable secara kronologis.** Kamu bisa sorting UUID v7 dan langsung tahu urutan data dari yang paling lama ke paling baru. Ini sangat berguna buat:

- Pagination berbasis cursor
- Log event system
- Timeline-based queries

**Ramah index database.** Karena nilainya monotonically increasing (bertambah seiring waktu), index B-tree bisa INSERT data di posisi yang berurutan. Hasilnya:

- Page split jauh lebih jarang
- Write throughput lebih tinggi
- Compact index size

**Masih unique di sistem terdistribusi.** Bagian timestamp hanya 48 bit; sisanya 74 bit tetap random. Jadi kamu tetap bisa generate ID unik di banyak server tanpa koordinasi.

### Kekurangan UUID v7

**Relatif baru.** UUID v7 baru distandarisasi di RFC 9562 pada Mei 2024. Meski sudah diadopsi cepat, beberapa library lama belum mendukungnya.

**Belum semua bahasa punya native support.** Di Python, kamu perlu library pihak ketiga kayak `uuid7`. Di Go, belum ada di standard library. Tapi hampir semua bahasa punya package komunitas yang mature.

**Timestamp bisa bocor.** Karena prefix-nya adalah timestamp, UUID v7 secara implisit ngasih tahu kira-kira kapan data itu dibuat. Buat aplikasi yang sangat sensitif terhadap privasi, ini bisa jadi pertimbangan.

## Head-to-Head: UUID v4 vs v7

Supaya lebih jelas, mari kita bandingkan langsung dalam beberapa aspek:

| Aspek | UUID v4 | UUID v7 |
|-------|---------|---------|
| **Dasar** | Random 122-bit | Timestamp + Random |
| **Sortable** | Tidak | Ya, berdasarkan waktu |
| **Index friendly** | Buruk (random INSERT) | Baik (sequential INSERT) |
| **Write performance** | Lebih lambat di scale | Lebih cepat di scale |
| **Collision risk** | Sangat rendah | Sama-sama sangat rendah |
| **Library support** | Universal | Masih terbatas |
| **Privasi** | Tidak bocor info | Bocor timestamp |

### Performa Database: Studi Kasus

Bayangkan kamu punya tabel `orders` dengan 10 juta row, primary key UUID, dan kamu INSERT 1000 order per detik.

**Pakai UUID v4**: Setiap INSERT baru harus nyari posisi random di index tree. Ini bikin index B-tree sering *rebalance*. CPU I/O naik, dan cache hit ratio bisa turun drastis. Di benchmark PostgreSQL, INSERT pakai UUID v4 bisa 30-50% lebih lambat daripada UUID v7 di skenario write-heavy.

**Pakai UUID v7**: Setiap INSERT baru masuk di *ujung kanan* index tree. Data baru selalu berurutan, jadi index tinggal nambah leaf node di paling kanan. No page split, no random seek. Write performance hampir menyamai auto-increment integer.

Ini bukan spekulasi — banyak tim engineering seperti di Shopify dan CockroachDB udah nulis tentang improvement performa setelah migrasi ke time-ordered UUID.

### Collision Risk

Ada mitos yang beredar: "UUID v7 lebih rentan collision karena pakai timestamp." Ini kurang tepat.

Di UUID v7, timestamp cuma 48 bit dari total 128 bit. Sisanya 74 bit tetap random. Jadi kemungkinan collision-nya tetap di level yang sama dengan UUID v4 — secara praktis nol untuk aplikasi sehari-hari. Kecuali kamu generate miliaran UUID dalam milidetik yang sama di mesin yang sama. Kalau itu terjadi, mungkin kamu punya masalah lain yang lebih besar.

### Readability

UUID v4: random total, nggak ada pola yang bisa dibaca manusia.

UUID v7: prefix-nya menunjukkan timestamp. Kalau kamu lihat UUID `018f3a2d-3c8e-7xxx-xxxx-xxxxxxxxxxxx`, kamu bisa decode prefix `018f3a2d-3c8e` jadi tanggal. Ini membantu waktu debugging — kamu bisa langsung kira-kira kapan data itu dibuat tanpa perlu SELECT kolom `created_at`.

## Kapan Pakai v4, Kapan Pakai v7?

Nggak ada jawaban universal, tapi ada panduan sederhana yang bisa kamu pakai:

### Pakai UUID v4 kalau:

- **Kamu butuh privasi maksimal.** Aplikasi yang sangat concerned dengan timestamp leakage.
- **Project kecil atau prototype.** Untuk aplikasi dengan volume data rendah, perbedaan performa nggak signifikan.
- **Library support jadi prioritas.** Kamu nggak mau ribet install package tambahan.
- **Data nggak perlu di-sort.** Misalnya, session token atau ID yang cuma dipakai buat lookup.

### Pakai UUID v7 kalau:

- **Aplikasi write-heavy.** Kamu expect jutaan row atau ribuan INSERT per detik.
- **Pagination pakai cursor.** UUID v7 bikin cursor-based pagination jadi sangat natural.
- **Kamu peduli sama performa database.** Terutama kalau pakai PostgreSQL sebagai primary database.
- **Membangun sistem terdistribusi.** Kamu butuh ID unik yang tetap sortable secara global.

## Demo Generate UUID Pakai Toolhub

Pengen coba bedanya langsung? Kamu bisa generate UUID v4 dan v7 secara instan pake **Toolhub UUID Generator**.

Cukup buka halaman [Toolhub UUID Generator](/uuid-generator), klik tombol generate, dan kamu bakal langsung lihat perbandingan hasilnya:

- UUID v4 muncul sebagai deretan karakter random tanpa pola
- UUID v7 muncul dengan prefix timestamp yang terurut

Toolhub juga support批量 generate — kamu bisa generate 10, 100, bahkan 1000 UUID sekaligus buat testing. Copy-paste langsung ke code kamu, nggak perlu buka terminal atau nulis script sendiri.

Fitur lain yang berguna:
- Pilih format: lowercase, UPPERCASE, atau tanpa hyphen
- Export ke CSV atau JSON
- Copy per UUID atau sekaligus

Cocok buat kamu yang lagi develop backend, setup seed data, atau cuma pengen lihat perbedaan visual antara v4 dan v7.

## Kesimpulan

UUID v4 dan v7 sama-sama punya tempatnya masing-masing. **UUID v4** adalah pilihan aman yang udah teruji selama bertahun-tahun — simple, universal, dan works everywhere. Tapi konsekuensinya, performa database bisa jadi korban di skala besar.

**UUID v7** adalah evolusi natural yang menjawab kelemahan utama v4: ketidakmampuan untuk diurutkan dan dampak negatifnya ke index database. Dengan sifat *time-ordered*-nya, UUID v7 jauh lebih ramah untuk sistem production dengan volume data besar.

Kalau kamu mulai project baru hari ini, saran saya: **mulai aja dengan UUID v7**. Kecuali kamu punya alasan spesifik untuk pakai v4 (privasi ekstrem atau library incompatibility), v7 adalah pilihan yang lebih future-proof. Library support akan terus bertambah, dan database kamu bakal berterima kasih nantinya.

Selamat mencoba, dan jangan lupa cobain langsung generate UUID v4 dan v7 di [Toolhub UUID Generator](/uuid-generator) biar makin paham bedanya!
