import express from 'express'
import cors from "cors";
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

// --- Impor JSON dengan sintaksis 'with' yang benar ---
import manFashion from './manFashion.json' with { type: 'json' }
import womanFashion from './womanFashion.json' with { type: 'json' }

dotenv.config()
const app = express()
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

app.get('/', (req, res) => {
    res.json({ message: 'API for Nuve - Fashion recommendation website' })
})

app.post('/api/rekomendasi-fashion', async (req, res) => {
    try {
        const {
            umur,
            jenis_kelamin,
            status,
            pekerjaan,
            lokasi,
            aktivitas,
            gaya_pribadi,
            budget,
            tujuan,
        } = req.body

        const prompt = 
		`
			Kamu adalah seorang konsultan fashion profesional. 
			Berikan rekomendasi fashion yang cocok berdasarkan data berikut:
			- Umur: ${umur}
			- Jenis kelamin: ${jenis_kelamin}
			- Status: ${status}
			- Pekerjaan: ${pekerjaan}
			- Lokasi/iklim: ${lokasi}
			- Aktivitas harian: ${aktivitas}
			- Preferensi gaya pribadi: ${gaya_pribadi}
			- Budget: ${budget}
			- Tujuan fashion: ${tujuan}

			Berikan rekomendasi dalam format:
			1. Gaya berpakaian utama
			2. Warna dominan
			3. Jenis pakaian utama
			4. Aksesori tambahan (jika perlu)
			5. Rekomendasi merek atau kisaran harga (opsional)
			6. Penjelasan singkat mengapa gaya ini cocok
			Buatkan saja dalam 1 paragraf singkat.
    	`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        res.json({ rekomendasi: text })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'Gagal mendapatkan rekomendasi dari Gemini',
        })
    }
})

// --- API BARU ANDA ADA DI SINI ---

// API UNTUK GET PRODUCTS (DENGAN FILTER GENDER)
app.get('/api/products', (req, res) => {
    const { gender } = req.query // Mengambil query ?gender=

    if (gender === 'man') {
        res.json(manFashion)
    } else if (gender === 'woman') {
        res.json(womanFashion)
    } else {
        // Jika tidak ada filter, kembalikan semua
        const allProducts = {
            man: manFashion,
            woman: womanFashion
        }
        res.json(allProducts)
    }
})

// FUNGSI BANTU UNTUK MENGGABUNGKAN SEMUA PRODUK
const getAllProductsArray = () => {
    const allProducts = [
        ...manFashion.top,
        ...manFashion.down,
        ...manFashion.footwear,
        ...womanFashion.top,
        ...womanFashion.down,
        ...womanFashion.footwear
    ]
    return allProducts
}

// API UNTUK GET PRODUCT DETAIL (BERDASARKAN NAMA)
app.get('/api/product/detail', (req, res) => {
    const { nama } = req.query // Mengambil query ?nama=Nama%20Produk

    if (!nama) {
        return res.status(400).json({ error: 'Query parameter "nama" diperlukan' })
    }

    const allProducts = getAllProductsArray()
    
    // Cari produk berdasarkan nama (tidak case-sensitive)
    const product = allProducts.find(p => p.nama.toLowerCase() === nama.toLowerCase())

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({ error: 'Produk tidak ditemukan' })
    }
})

// ----------------------------------------------------

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`))