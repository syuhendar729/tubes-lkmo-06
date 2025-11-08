// import manFashion from '../manFashion.json' with { type: 'json' }
// import womanFashion from '../womanFashion.json' with { type: 'json' }
import admin from 'firebase-admin'

const COLL = 'products'

export function checkConnection(req, res) {
  if (admin.apps && admin.apps.length > 0) {
    return res.json({ ok: true, message: 'Firestore is initialized' })
  } else {
    return res.status(500).json({ ok: false, error: 'Firestore not initialized' })
  }
}

// const getAllProductsArray = () => {
//   return [
//     ...manFashion.top,
//     ...manFashion.down,
//     ...manFashion.footwear,
//     ...womanFashion.top,
//     ...womanFashion.down,
//     ...womanFashion.footwear,
//   ]
// }

function formatPriceTextFromNumber(n) {
  if (n == null) return ''
  const s = n.toString()
  return 'Rp ' + s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function docToLegacy(doc) {
  const d = doc.data()
  return {
    nama: d.name || d.nama || '',
    jenis: d.jenis || d.category || '',
    harga: d.price_text || (d.price ? formatPriceTextFromNumber(d.price) : ''),
    deskripsi: d.description || d.deskripsi || '',
    id: doc.id,
  }
}

async function fetchProductsGroupedByGenderFromFirestore(gender) {
  const db = admin.firestore()
  const snapshot = await db.collection(COLL).where('gender', '==', gender).get()
  const groups = { top: [], down: [], footwear: [] }
  snapshot.forEach((doc) => {
    const d = doc.data()
    const legacy = docToLegacy(doc)
    const cat = (d.category || d.kategori || '').toLowerCase()
    if (cat === 'top' || cat === 'down' || cat === 'footwear') {
      groups[cat].push(legacy)
    } else {
      // fallback: try to infer from existing fields
      groups.top.push(legacy)
    }
  })
  return groups
}

export async function listProducts(req, res) {
  const { gender } = req.query

  // if firestore is initialized, read from it
  if (admin.apps && admin.apps.length > 0) {
    try {
      if (gender === 'man') {
        const man = await fetchProductsGroupedByGenderFromFirestore('man')
        return res.json(man)
      } else if (gender === 'woman') {
        const woman = await fetchProductsGroupedByGenderFromFirestore('woman')
        return res.json(woman)
      } else {
        const man = await fetchProductsGroupedByGenderFromFirestore('man')
        const woman = await fetchProductsGroupedByGenderFromFirestore('woman')
        return res.json({ man, woman })
      }
    } catch (err) {
      console.error('Firestore read failed, falling back to static JSON', err)
      return res.status(404).json({ error: 'Gagal mengambil data products.' })
      // fallback to static
    }
  }

//   // fallback to static JSON
//   if (gender === 'man') {
//     return res.json(manFashion)
//   } else if (gender === 'woman') {
//     return res.json(womanFashion)
//   }
//   return res.json({ man: manFashion, woman: womanFashion })
}

export async function getProductById(req, res) {
  const { id } = req.params
  if (!id) return res.status(400).json({ error: 'Parameter "id" diperlukan' })

  if (admin.apps && admin.apps.length > 0) {
    try {
      const db = admin.firestore()
      const doc = await db.collection(COLL).doc(id).get()
      if (doc.exists) return res.json(docToLegacy(doc))
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    } catch (err) {
      console.error('Firestore get failed, falling back to static JSON', err)
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
      // fallback to static
    }
  }

  // const allProducts = getAllProductsArray()
  // const product = allProducts.find((p) => p.id && p.id.toLowerCase() === id.toLowerCase())
  // if (product) return res.json(product)

  // return res.status(404).json({ error: 'Produk tidak ditemukan' })
}

// ---------------- CRUD handlers ----------------

export async function createProduct(req, res) {
  try {
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })
    const db = admin.firestore()
    const payload = req.body || {}
    if (!payload.nama) return res.status(400).json({ error: 'Field "nama" is required' })

    // Determine category and gender for id generation
    const category = (payload.category || payload.jenis || '').toString().toLowerCase() || 'top'
    const gender = (payload.gender || 'man').toString().toLowerCase()

    let id
    if (payload.id) {
      id = payload.id.toString().toLowerCase()
    } else {
      // Compute prefix like 'mantop' or 'womanfootwear' (consistent with previous ids like 'mantop01')
      const prefix = `${gender}${category}`

      // Find existing docs with same gender & category and get max numeric suffix
      const snapshot = await db.collection(COLL)
        .where('gender', '==', gender)
        .where('category', '==', category)
        .get()

      let maxNum = 0
      const re = new RegExp(`^${prefix}(\\d+)$`)
      snapshot.forEach((d) => {
        const m = d.id.match(re)
        if (m && m[1]) {
          const n = parseInt(m[1], 10)
          if (!Number.isNaN(n) && n > maxNum) maxNum = n
        }
      })

      const next = maxNum + 1
      const numStr = String(next).padStart(2, '0')
      id = `${prefix}${numStr}`
    }

    const docRef = db.collection(COLL).doc(id)
    const data = {
      name: payload.nama,
      jenis: payload.jenis || payload.category || '',
      category: (payload.category || payload.jenis || '').toLowerCase(),
      description: payload.deskripsi || payload.description || '',
      // prefer numeric price -> formatted price_text; otherwise use provided harga/price_text
      price: payload.price || null,
      price_text: payload.price ? formatPriceTextFromNumber(payload.price) : (payload.harga || payload.price_text || ''),
      gender: payload.gender || 'man',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    await docRef.set(data)
    return res.status(201).json({ id, ...payload })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to create product' })
  }
}

export async function updateProduct(req, res) {
  try {
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })
    const { id } = req.params
    const payload = req.body || {}
    const db = admin.firestore()
    const docRef = db.collection(COLL).doc(id)
    const exists = (await docRef.get()).exists
    if (!exists) return res.status(404).json({ error: 'Product not found' })
    const updates = { ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() }
    // map legacy fields to stored fields
    if (updates.nama) {
      updates.name = updates.nama
      delete updates.nama
    }
    if (updates.deskripsi) {
      updates.description = updates.deskripsi
      delete updates.deskripsi
    }
    // if numeric price provided, update formatted text as well
    if (updates.price !== undefined && updates.price !== null) {
      updates.price_text = formatPriceTextFromNumber(updates.price)
    }
    await docRef.update(updates)
    return res.json({ message: 'Product updated' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to update product' })
  }
}

export async function deleteProduct(req, res) {
  try {
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })
    const { id } = req.params
    const db = admin.firestore()
    const docRef = db.collection(COLL).doc(id)
    const exists = (await docRef.get()).exists
    if (!exists) return res.status(404).json({ error: 'Product not found' })
    await docRef.delete()
    return res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete product' })
  }
}


