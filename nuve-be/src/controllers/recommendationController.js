import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazily initialize Gemini client so we can return a clear error when the key is missing
let genAI = null
let model = null
function ensureModel() {
  if (model) return model
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY not configured')
  }
  genAI = new GoogleGenerativeAI(key)
  model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
  return model
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

    // Ensure model is available and build prompt
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

Berikut adalah katalog produk fashion pria (Man Fashion):

Kategori TOP (Atasan):
1. Varsity Nova — Jaket, Rp 189.000. Jaket varsity dengan bahan fleece lembut dan desain klasik bergaya retro. (ID: mantop01)
2. Street Core — Hoodie, Rp 175.000. Hoodie kasual dengan sablon simple, nyaman dipakai harian. (ID: mantop02)
3. Linen Breze — Kemeja, Rp 169.000. Kemeja linen ringan, cocok untuk tampilan santai tapi tetap rapi. (ID: mantop03)
4. Urban Layer — Kemeja, Rp 179.000. Kemeja hitam slim fit dengan gaya minimalis dan modern. (ID: mantop04)
5. Basic Cream Tee — Kaos, Rp 99.000. Kaos cotton premium berwarna krem, adem dan ringan. (ID: mantop05)

Kategori DOWN (Bawahan):
1. Chill Track — Celana, Rp 159.000. Celana jogger berbahan katun stretch yang fleksibel dan nyaman. (ID: mandown01)
2. Soft Linen Pants — Celana, Rp 169.000. Celana panjang linen warna netral untuk tampilan casual clean. (ID: mandown02)
3. Cargo Flex — Celana, Rp 189.000. Celana cargo dengan kantong samping, stylish untuk aktivitas luar. (ID: mandown03)
4. Dark Taper — Celana, Rp 179.000. Celana slim fit hitam dengan potongan modern dan nyaman dipakai. (ID: mandown04)
5. Denim Raw — Celana, Rp 195.000. Jeans biru klasik berbahan denim ringan dan tidak kaku. (ID: mandown05)

Kategori FOOTWEAR (Alas Kaki):
1. Black Edge — Sepatu, Rp 189.000. Sepatu sneakers hitam dengan sol tebal dan desain sporty minimalis. (ID: manfootwear01)
2. White Dash — Sepatu, Rp 179.000. Sneakers putih klasik dengan detail lubang udara untuk kenyamanan ekstra. (ID: manfootwear02)
3. Urban Trek — Sepatu, Rp 199.000. Sepatu boots coklat muda dengan bahan kulit sintetis tahan lama. (ID: manfootwear03)
4. High Rise — Sepatu, Rp 189.000. Sepatu high-top bergaya streetwear dengan detail tali kontras. (ID: manfootwear04)
5. Sport Flex — Sepatu, Rp 169.000. Sepatu running ringan dengan sol empuk dan desain breathable. (ID: manfootwear05)


Berikut adalah katalog produk fashion wanita (Woman Fashion):

Kategori TOP (Atasan):
1. MiuMui — Sweater, Rp 179.000. Sweater rajut abu muda dengan motif garis lembut, tampil cozy. (ID: womantop01)
2. Soft Layer — Blouse, Rp 149.000. Blouse crop hitam dengan bahan halus dan potongan modern. (ID: womantop02)
3. Wine Knit — Cardigan, Rp 189.000. Cardigan maroon rajut halus dengan kancing depan yang manis. (ID: womantop03)
4. Pastel Bloom — Outer, Rp 179.000. Outer pink lembut, ringan dan cocok untuk outfit harian. (ID: womantop04)
5. Sand Tank — Tank Top, Rp 99.000. Tank top warna beige, simpel dan mudah dipadukan. (ID: womantop05)

Kategori DOWN (Bawahan):
1. Pleat Cream — Rok, Rp 169.000. Rok mini lipit warna krem dengan tampilan feminin. (ID: womandown01)
2. Cotton Flow — Dress, Rp 189.000. Rok berbahan katun ringan, nyaman untuk aktivitas santai. (ID: womandown02)
3. Linen Ivory — Celana, Rp 179.000. Celana panjang ivory dari bahan linen yang sejuk dan ringan. (ID: womandown03)
4. Cloudy Skirt — Celana, Rp 189.000. Celana panjang A-line bahan satin lembut, cocok untuk acara kasual. (ID: womandown04)
5. Noir Flow — Jeans, Rp 199.000. Jeans hitam longgar dengan bahan jatuh yang nyaman. (ID: womandown05)

Kategori FOOTWEAR (Alas Kaki):
1. Cloud Step — Sepatu, Rp 179.000. Sepatu slip-on putih dengan bahan lembut dan ringan untuk aktivitas harian. (ID: womanfootwear01)
2. Sunny Heels — Sepatu, Rp 189.000. Sandal heels krem dengan tali halus, cocok untuk tampilan kasual manis. (ID: womanfootwear02)
3. Air White — Sepatu, Rp 179.000. Sneakers putih tinggi dengan sol karet fleksibel dan gaya clean. (ID: womanfootwear03)
4. Ivory Chic — Sepatu, Rp 199.000. Sepatu heels putih elegan dengan hak pendek yang nyaman dipakai lama. (ID: womanfootwear04)
5. Noir Point — Sepatu, Rp 189.000. Sepatu heels hitam berujung runcing dengan bahan glossy modern. (ID: womanfootwear05)


      Berikan rekomendasi dalam format:
      1. Gaya berpakaian utama
      2. Warna dominan
      3. Jenis pakaian utama
      4. Aksesori tambahan (jika perlu)
      5. Rekomendasi merek atau kisaran harga (opsional)
      6. Penjelasan singkat mengapa gaya ini cocok
      Buatkan saja dalam 1 paragraf singkat.

      Setelah penjelasan paragraf berikan juga rekomendasi produk spesifik dari katalog di atas yang sesuai dengan gaya tersebut, sebutkan ID produk, nama produk, dan harganya.
    `

    let usedModel
    try {
      usedModel = ensureModel()
    } catch (e) {
      console.error('Gemini model not available:', e && e.message ? e.message : e)
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' })
    }

    const result = await usedModel.generateContent(prompt)
    const text = result.response.text()
    res.json({ rekomendasi: text })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Gagal mendapatkan rekomendasi dari Gemini' })
  }
}
