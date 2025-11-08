// import manFashion from '../manFashion.json' with { type: 'json' }
// import womanFashion from '../womanFashion.json' with { type: 'json' }
import admin from 'firebase-admin'
import { initFirebase } from '../firebase.js'

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

}

// ---------------- CRUD handlers ----------------

export async function createProduct(req, res) {
  try {
    // // Ensure Firebase is initialized (helpful for serverless envs where import-time init may be skipped)
    // if (!(admin.apps && admin.apps.length > 0)) {
    //   try {
    //     initFirebase()
    //   } catch (e) {
    //     // ignore, will error below if still not initialized
    //   }
    // }
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })
    const db = admin.firestore()

    // When using multer, fields from FormData come as strings in req.body
    const payload = req.body || {}
    const file = req.file // optional file buffer from multer (memoryStorage)
    // If image will be uploaded later, we record minimal metadata for now
    if (!payload.nama) return res.status(400).json({ error: 'Field "nama" is required' })

    // Determine category and gender for id generation
    // Frontend (ProductForm.jsx) sends: nama, jenis, harga, deskripsi, kategori, gender
    const category = (payload.kategori || payload.category || payload.jenis || '').toString().toLowerCase() || 'top'
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
    // Parse numeric price from `harga` (e.g. "Rp 1.234.000") if present
    function parsePriceFromString(h) {
      if (h === undefined || h === null) return null
      if (typeof h === 'number') return h
      const digits = String(h).replace(/[^0-9]/g, '')
      if (!digits) return null
      return Number(digits)
    }

    // Prefer the frontend `harga` field
    const parsedPrice = parsePriceFromString(payload.harga ?? payload.price ?? payload.harga_text)

    const data = {
      name: payload.nama,
      jenis: payload.jenis || '',
      category: category,
      description: payload.deskripsi || payload.description || '',
      // numeric price (nullable) and formatted price_text
      price: parsedPrice,
  price_text: parsedPrice ? formatPriceTextFromNumber(parsedPrice) : (payload.harga || payload.price_text || ''),
      gender: gender,
      // basic image metadata; will upload to Cloud Storage if file provided
      image: file ? { originalname: file.originalname, mimetype: file.mimetype, size: file.size } : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    // If there's an image buffer, upload to Firebase Storage and store public URL
  if (file && file.buffer) {
      try {
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.appspot.com` : null)
        if (bucketName) {
          const bucket = admin.storage().bucket(bucketName)
          const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
          const remotePath = `products/${id}/${Date.now()}_${safeName}`
          const remoteFile = bucket.file(remotePath)
          await remoteFile.save(file.buffer, { metadata: { contentType: file.mimetype } })
          // Make public so we can return a stable static URL. Alternative: generate signed URL.
          try {
            await remoteFile.makePublic()
          } catch (e) {
            // makePublic can fail depending on bucket IAM settings; fallback to signed URL later if needed
            console.warn('makePublic failed for', remotePath, e && e.message ? e.message : e)
          }
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(remotePath)}`
          data.image_url = publicUrl
          data.image = { ...data.image, remotePath, publicUrl }
        } else {
          console.warn('No FIREBASE_STORAGE_BUCKET defined; skipping image upload')
        }
      } catch (e) {
        console.error('Image upload failed', e)
        // continue without blocking creation; image metadata remains
      }
    }

    await docRef.set(data)
    // return created product info in legacy shape
    return res.status(201).json({ id, nama: data.name, jenis: data.jenis, harga: data.price_text, deskripsi: data.description, image_url: data.image_url || null })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to create product' })
  }
}

export async function updateProduct(req, res) {
  try {
    // Ensure Firebase initialized
    if (!(admin.apps && admin.apps.length > 0)) {
      try { initFirebase() } catch (e) { /* ignore */ }
    }
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })

    const { id } = req.params
    const payload = req.body || {}
    const file = req.file
    const db = admin.firestore()
    const docRef = db.collection(COLL).doc(id)
    const docSnap = await docRef.get()
    if (!docSnap.exists) return res.status(404).json({ error: 'Product not found' })

    const updates = {}
    // map frontend field names to stored fields
    if (payload.nama) updates.name = payload.nama
    if (payload.deskripsi) updates.description = payload.deskripsi
    if (payload.jenis) updates.jenis = payload.jenis
    // category mapping (frontend sends kategori)
    if (payload.kategori) updates.category = payload.kategori.toString().toLowerCase()
    if (payload.gender) updates.gender = payload.gender

    // Parse harga if provided (frontend sends `harga`)
    function parsePriceFromString(h) {
      if (h === undefined || h === null) return null
      if (typeof h === 'number') return h
      const digits = String(h).replace(/[^0-9]/g, '')
      if (!digits) return null
      return Number(digits)
    }
    if (payload.harga !== undefined) {
      const p = parsePriceFromString(payload.harga ?? payload.price ?? payload.harga_text)
      updates.price = p
      if (p !== null) updates.price_text = formatPriceTextFromNumber(p)
    }

    // Handle image upload if present
    if (file && file.buffer) {
      try {
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.appspot.com` : null)
        if (bucketName) {
          const bucket = admin.storage().bucket(bucketName)
          const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
          const remotePath = `products/${id}/${Date.now()}_${safeName}`
          const remoteFile = bucket.file(remotePath)
          await remoteFile.save(file.buffer, { metadata: { contentType: file.mimetype } })
          try { await remoteFile.makePublic() } catch (e) { console.warn('makePublic failed', e && e.message ? e.message : e) }
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(remotePath)}`
          updates.image_url = publicUrl
          updates.image = { originalname: file.originalname, mimetype: file.mimetype, size: file.size, remotePath, publicUrl }
        } else {
          console.warn('No FIREBASE_STORAGE_BUCKET defined; skipping image upload')
        }
      } catch (e) {
        console.error('Image upload failed', e)
      }
    }

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp()
    await docRef.update(updates)
    return res.json({ message: 'Product updated', id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to update product' })
  }
}

export async function deleteProduct(req, res) {
  try {
    // Ensure Firebase initialized (helpful for serverless envs)
    if (!(admin.apps && admin.apps.length > 0)) {
      try { initFirebase() } catch (e) { /* ignore */ }
    }
    if (!(admin.apps && admin.apps.length > 0)) return res.status(500).json({ error: 'Firestore not initialized' })

    const { id } = req.params
    const db = admin.firestore()
    const docRef = db.collection(COLL).doc(id)
    const docSnap = await docRef.get()
    if (!docSnap.exists) return res.status(404).json({ error: 'Product not found' })

    const docData = docSnap.data() || {}
    // Try to delete image from storage if present (best-effort)
    try {
      const bucketName = process.env.FIREBASE_STORAGE_BUCKET || (process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID}.appspot.com` : null)
      if (bucketName) {
        const bucket = admin.storage().bucket(bucketName)
        let remotePath = null
        if (docData.image && docData.image.remotePath) {
          remotePath = docData.image.remotePath
        } else if (docData.image_url) {
          // try to parse remotePath from common public URL formats
          const url = docData.image_url
          const gsMatch = String(url).match(/^gs:\/\/[^\/]+\/(.+)$/)
          const httpsMatch = String(url).match(/^https?:\/\/storage.googleapis.com\/[^\/]+\/(.+)$/)
          if (gsMatch && gsMatch[1]) remotePath = gsMatch[1]
          else if (httpsMatch && httpsMatch[1]) remotePath = decodeURIComponent(httpsMatch[1])
        }

        if (remotePath) {
          try {
            await bucket.file(remotePath).delete()
            console.log('Deleted storage object:', remotePath)
          } catch (e) {
            console.warn('Failed to delete storage object', remotePath, e && e.message ? e.message : e)
          }
        }
      }
    } catch (e) {
      console.warn('Error while attempting to delete product image from storage:', e && e.message ? e.message : e)
    }

    // Finally remove the Firestore document
    await docRef.delete()
    return res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to delete product' })
  }
}


