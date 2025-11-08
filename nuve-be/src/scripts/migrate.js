// migrate.js
// Usage: node ./scripts/migrate.js
// Make sure you have valid FIREBASE_* env vars in nuve-be/.env (or your environment) before running.

import dotenv from 'dotenv'
import admin from 'firebase-admin'
import { writeFile } from 'fs/promises'

// Import JSON product sources (ESM JSON import syntax)
import manFashion from '../manFashion.json' with { type: 'json' }
import womanFashion from '../../womanFashion.json' with { type: 'json' }

dotenv.config()

function initFirebaseFromEnv(){
  if (admin.apps.length) return admin.app()

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY not found in env')

  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    })
  })

  return admin.app()
}

function parsePrice(priceText){
  if(!priceText) return null
  const digits = priceText.replace(/[^0-9]/g,'')
  return digits ? parseInt(digits, 10) : null
}

function slugify(name){
  return name.toString().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'')
}

async function migrateObject(obj, gender, db, options = { batchCommitSize: 450 }){
  const categories = ['top','down','footwear']
  let batch = db.batch()
  let ops = 0
  let total = 0
  const mapping = []

  for(const category of categories){
    const arr = obj[category] || []
    for(const item of arr){
      const docId = (item.id || slugify(item.nama)).toLowerCase()
      const ref = db.collection('products').doc(docId)

      const doc = {
        id: docId,
        name: item.nama || '',
        category,
        gender,
        description: item.deskripsi || item.description || '',
        price: parsePrice(item.harga),
        price_text: item.harga || '',
        tags: item.tags || [],
        images: item.images || [],
        stock: item.stock ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }

      batch.set(ref, doc, { merge: true })
      mapping.push({ sourceId: item.id || null, docId, name: item.nama })
      ops++
      total++

      if(ops >= options.batchCommitSize){
        await batch.commit()
        console.log(`Committed batch of ${ops} writes...`)
        batch = db.batch()
        ops = 0
      }
    }
  }

  if(ops > 0){
    await batch.commit()
    console.log(`Committed final batch of ${ops} writes.`)
  }

  return { total, mapping }
}

async function run(){
  try{
    initFirebaseFromEnv()
    const db = admin.firestore()

    console.log('Starting migration: manFashion')
    const manResult = await migrateObject(manFashion, 'man', db)
    console.log(`manFashion -> wrote ${manResult.total} documents`)

    console.log('Starting migration: womanFashion')
    const womanResult = await migrateObject(womanFashion, 'woman', db)
    console.log(`womanFashion -> wrote ${womanResult.total} documents`)

    // write mapping file locally for audit
    const audit = {
      timestamp: new Date().toISOString(),
      man: manResult.mapping,
      woman: womanResult.mapping
    }
    await writeFile('./migration-mapping.json', JSON.stringify(audit, null, 2), 'utf8')
    console.log('Wrote migration-mapping.json')

    console.log('Migration completed successfully')
    process.exit(0)
  }catch(err){
    console.error('Migration failed:', err)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.env.RUN_MIGRATE === '1'){
  run()
}

export { run }
