import admin from 'firebase-admin'

/**
 * Initialize firebase-admin using environment variables.
 * Call this after dotenv.config() has run in the importing module.
 */
export function initFirebase() {
  if (admin.apps && admin.apps.length > 0) {
    return admin
  }

  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

  return admin
}

/**
 * Test connection to Firestore by listing root collections (fast, read-only).
 * Returns an object { ok: boolean, detail?: string, error?: string }
 */
export async function testConnection(timeoutMs = 5000) {
  try {
    const adminInstance = initFirebase()
    const db = adminInstance.firestore()

    const collections = await Promise.race([
      db.listCollections(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs))
    ])

    return { ok: true, detail: `Found ${collections.length} collections` }
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) }
  }
}

export default {
  initFirebase,
  testConnection
}
