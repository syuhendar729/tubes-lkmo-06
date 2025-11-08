import { GoogleGenerativeAI } from '@google/generative-ai'

// For tests we avoid calling external Gemini API. When running under NODE_ENV=test
// the controller returns a deterministic dummy response.
const isTest = process.env.NODE_ENV === 'test'
let genAI
let model
if (!isTest) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
}

export async function recommend(req, res) {
  try {
    const {
      umur,
      jenis_kelamin,
      pekerjaan,
      lokasi,
      aktivitas,
      budget,
      jenis_pakaian,
    } = req.body

    if (isTest) {
      // return deterministic content for unit tests
      return res.json({ rekomendasi: 'Rekomendasi dummy untuk testing' })
    }

    const prompt = `
      Kamu adalah seorang konsultan fashion profesional. 
      Berikan rekomendasi fashion yang cocok berdasarkan data berikut:
      - Umur: ${umur}
      - Jenis kelamin: ${jenis_kelamin}
      - Pekerjaan: ${pekerjaan}
      - Lokasi/iklim: ${lokasi}
      - Aktivitas harian: ${aktivitas}
      - Budget: ${budget}
      - Jenis pakaian yang dicari: ${jenis_pakaian}

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
    res.status(500).json({ error: 'Gagal mendapatkan rekomendasi dari Gemini' })
  }
}
