import express from 'express'
// import cors from "cors";
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()
const app = express()
app.use(express.json())
// app.use(cors());

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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`))
