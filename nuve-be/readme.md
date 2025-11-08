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

```bash
npm start
```

Secara default server berjalan pada `PORT` dari `.env` atau `5000`.

## Ringkasan Endpoints

1. GET / — Health check
2. POST /api/rekomendasi-fashion — Minta rekomendasi fashion berbasis input pengguna
3. GET /api/products[?gender=man|woman] — Ambil daftar produk (opsional filter gender)
4. GET /api/product/detail?nama=<Nama%20Produk> — Ambil detail produk berdasarkan nama

## API Rekomendasi Fashion
Endpoint : POST /api/rekomendasi-fashion

API Public URL: https://nuve-be.vercel.app/api/rekomendasi-fashion

Request Body :

```json
{
    "umur":"28",
    "jenis_kelamin":"Wanita",
    "pekerjaan":"Marketing",
    "lokasi":"Bandung",
    "aktivitas":"Meeting dan event",
    "budget":"Rp 500.000 - Rp 1.500.000",
}
```

Response Body (Success) : 

```json
{
	"rekomendasi": "Paragraph text with the recommendation returned by Gemini"
}
```

Response Body (Failed) :

```json
{
    "error": "Gagal mendapatkan rekomendasi dari Gemini"
}
```

## API Get All Products
Endpoint : GET /api/products

API Public URL: https://nuve-be.vercel.app/api/products

Terdapat 2 gender sebagai input parameter:
- `man`
- `woman`

Terdapat 3 jenis pakaian yang menjadi respon dari API:
- `top`: Atasan
- `down`: Bawahan
- `footwear`: Alas kaki

Request Params :

```json
# All Products
https://nuve-be.vercel.app/api/products
```
```json
# All Man Products
https://nuve-be.vercel.app/api/products?gender=man
```
```json
# All Woman Products
https://nuve-be.vercel.app/api/products?gender=woman
```

Response Body (Success) : 
Contoh jika data top, down, dan footwear memiliki 1 product
```json

{
    "top": [
        {
            "nama": "Varsity Nova",
            "jenis": "Jaket",
            "harga": "Rp 189.000",
            "deskripsi": "Jaket varsity dengan bahan fleece lembut dan desain klasik bergaya retro.",
            "id": "mantop01"
        }
        ...
    ],
    "down": [
        {
            "nama": "Chill Track",
            "jenis": "Celana",
            "harga": "Rp 159.000",
            "deskripsi": "Celana jogger berbahan katun stretch yang fleksibel dan nyaman.",
            "id": "mandown01"
        }
        ...
    ],
    "footwear": [
        {
            "nama": "Black Edge",
            "jenis": "Sepatu",
            "harga": "Rp 189.000",
            "deskripsi": "Sepatu sneakers hitam dengan sol tebal dan desain sporty minimalis.",
            "id": "manfootwear01"
        }
        ...
    ]
}
```

Response Body (Failed) :
*Jika reqeust tidak valid maka API akan otomatis mengembalikan default API dengan semua data `man` dan `woman`
```json
{
    "man": {
        "top": [
            ...
        ],
        "down": [
            ...
        ],
        "footwear": [
            ...
        ]
    },
    "woman": {
        "top": [
            ...
        ],
        "down": [
            ...
        ],
        "footwear": [
            ...
        ]
    }
}
```

## API Detail Product
Endpoint : GET /api/product/{id}

API Public URL: https://nuve-be.vercel.app/api/product/{id}

Request Body :

```json
# Get Detail Product by ID
https://nuve-be.vercel.app/api/product/mantop01
```

Response Body (Success) : 

```json
{
    "nama": "Varsity Nova",
    "jenis": "Jaket",
    "harga": "Rp 189.000",
    "deskripsi": "Jaket varsity dengan bahan fleece lembut dan desain klasik bergaya retro.",
    "id": "mantop01"
}
```

Response Body (Failed) :

```json
{
    "error": "Produk tidak ditemukan"
}
```

## Debugging & catatan
- Jika mendapatkan error terkait Gemini, periksa variabel lingkungan `GEMINI_API_KEY` dan network access.
- Jika server tidak jalan, periksa port di `.env` dan pastikan tidak ada proses lain memakai port tersebut.

## Lisensi & kontribusi
- README ini disediakan untuk memudahkan penggunaan API. Tambahan fitur (endpoint pencarian, paging, autentikasi) bisa ditambahkan.

---
Dokumentasi ini dibuat berdasarkan implementasi pada `main.js` (endpoints dan nama file data). Jika Anda ingin contoh response yang lebih spesifik atau dokumentasi OpenAPI/Swagger, beri tahu saya dan saya akan tambahkan.


