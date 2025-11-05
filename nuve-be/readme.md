# Backend — Nuve (Fashion recommendation API)

Ini adalah dokumentasi penggunaan untuk backend Node.js sederhana yang disertakan pada folder `nuve-be`.

## Isi repo
- `main.js` — server Express yang menyediakan endpoint rekomendasi dan produk
- `manFashion.json` / `womanFashion.json` — data produk statis yang digunakan oleh endpoint

## Persiapan & instalasi

1. Masuk ke folder backend:

```bash
cd nuve-be
```

2. Install dependensi:

```bash
npm install
```

3. Buat file `.env` di folder `nuve-be` dengan isi minimal:

```env
GEMINI_API_KEY=<api_key>
PORT=5000
```

Catatan: backend ini menggunakan Google Gemini via paket `@google/generative-ai`. Pastikan Anda memiliki API key yang valid.

## Menjalankan server

```bash
npm start
```

Secara default server berjalan pada `PORT` dari `.env` atau `5000`.

## Ringkasan Endpoints

1. GET / — Health check
2. POST /api/rekomendasi-fashion — Minta rekomendasi fashion berbasis input pengguna
3. GET /api/products[?gender=man|woman] — Ambil daftar produk (opsional filter gender)
4. GET /api/product/detail?nama=<Nama%20Produk> — Ambil detail produk berdasarkan nama

## Endpoint: GET /

Response (200):

```json
{ "message": "API for Nuve - Fashion recommendation website" }
```

## Endpoint: POST /api/rekomendasi-fashion

Deskripsi: Meminta rekomendasi fashion berbasis input pengguna. Server meneruskan prompt ke model Gemini.

Request (Content-Type: application/json) — contoh body:

```json
{
	"umur": "25",
	"jenis_kelamin": "Pria",
	"status": "Mahasiswa",
	"pekerjaan": "Magang",
	"lokasi": "Jakarta (tropis)",
	"aktivitas": "Kuliah dan hangout",
	"gaya_pribadi": "Casual, minimalis",
	"budget": "Rp 300.000 - Rp 800.000",
	"tujuan": "Tampil rapi namun santai"
}
```

Response (200) — contoh:

```json
{
	"rekomendasi": "Paragraph text with the recommendation returned by Gemini"
}
```

Errors:
- 500: Jika komunikasi dengan Gemini gagal. Response: `{ "error": "Gagal mendapatkan rekomendasi dari Gemini" }`

Catatan: Endpoint ini memanggil `model.generateContent(prompt)` — pastikan quota/limit API Anda mencukupi.

## Endpoint: GET /api/products

Deskripsi: Mengembalikan data produk. Dapat difilter menggunakan query `gender`.

Query params:
- `gender` (opsional) — `man` atau `woman`

Contoh-curl (semua):

```bash
curl -X GET "http://localhost:5000/api/products"
```

Contoh-curl (filter gender):

```bash
curl -X GET "http://localhost:5000/api/products?gender=man"
```

Response: JSON berisi array produk untuk gender tersebut, atau objek dengan dua properti `man` dan `woman` jika tidak ada filter.

## Endpoint: GET /api/product/detail

Deskripsi: Mengambil detail produk berdasarkan nama (case-insensitive).

Query params (required):
- `nama` — Nama produk (URL-encoded)

Contoh-curl:

```bash
curl -G "http://localhost:5000/api/product/detail" --data-urlencode "nama=Kaos Polos Putih"
```

Response (200) — contoh:

```json
{
	"nama": "Kaos Polos Putih",
	"kategori": "top",
	"warna": "putih",
	"harga": 120000,
	"deskripsi": "..."
}
```

Response errors:
- 400: `{ "error": "Query parameter \"nama\" diperlukan" }` jika `nama` tidak diberikan
- 404: `{ "error": "Produk tidak ditemukan" }` jika tidak ada produk yang cocok

## Struktur data produk

File `manFashion.json` dan `womanFashion.json` berisi struktur data yang dipakai server. `getAllProductsArray()` di `main.js` menggabungkan:
- `top`, `down`, `footwear` dari kedua file.

Gunakan `nama` dari tiap item untuk mencari detail lewat `/api/product/detail`.

## Contoh alur singkat

1. Dapatkan daftar produk pria:

```bash
curl -X GET "http://localhost:5000/api/products?gender=man"
```

2. Pilih sebuah produk, ambil detailnya (misal nama: "Sneakers Hitam"):

```bash
curl -G "http://localhost:5000/api/product/detail" --data-urlencode "nama=Sneakers Hitam"
```

3. Minta rekomendasi gaya berdasarkan profil user:

```bash
curl -X POST "http://localhost:5000/api/rekomendasi-fashion" \
	-H "Content-Type: application/json" \
	-d '{"umur":"28","jenis_kelamin":"Wanita","status":"Karyawan","pekerjaan":"Marketing","lokasi":"Bandung","aktivitas":"Meeting dan event","gaya_pribadi":"Formal-casual","budget":"Rp 500.000 - Rp 1.500.000","tujuan":"Tampil profesional namun stylish"}'
```

## Debugging & catatan
- Jika mendapatkan error terkait Gemini, periksa variabel lingkungan `GEMINI_API_KEY` dan network access.
- Jika server tidak jalan, periksa port di `.env` dan pastikan tidak ada proses lain memakai port tersebut.

## Lisensi & kontribusi
- README ini disediakan untuk memudahkan penggunaan API. Tambahan fitur (endpoint pencarian, paging, autentikasi) bisa ditambahkan.

---
Dokumentasi ini dibuat berdasarkan implementasi pada `main.js` (endpoints dan nama file data). Jika Anda ingin contoh response yang lebih spesifik atau dokumentasi OpenAPI/Swagger, beri tahu saya dan saya akan tambahkan.


