import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { initFirebase, testConnection } from './firebase.js'
import mainRouter from './routes/index.js'

dotenv.config()

// Create app
const app = express()
app.use(cors())
app.use(express.json())

// Try to initialize Firebase on module import when env is present.
// In serverless / Vercel deployments the file may be imported without
// executing the direct-run `startServer()` path, so initFirebase must
// run during import to ensure admin.apps is populated.
try {
    if (process.env.FIREBASE_PROJECT_ID) {
        // initFirebase is safe to call multiple times (it returns early if already inited)
        initFirebase()
        console.log('initFirebase: called at import (FIREBASE_PROJECT_ID present)')
    } else {
        console.warn('initFirebase: FIREBASE_PROJECT_ID not set — skipping init at import')
    }
} catch (err) {
    console.error('initFirebase failed during module import:', err && err.message ? err.message : err)
}

app.get('/', (req, res) => {
    res.json({ message: 'API for Nuve - Fashion recommendation website' })
})

// mount api router (routes are defined under src/routes)
app.use('/api', mainRouter)

// Start server when file executed directly (node src/main.js)
async function startServer() {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, async () => {
        console.log(`Server berjalan di port ${PORT}`)

        // Inisialisasi Firebase dan cek koneksi
        try {
            initFirebase() // initialize credential from env (won't re-init if already initialized)
            const result = await testConnection(5000)
            if (result.ok) {
                console.log('Firebase connection: OK -', result.detail)
            } else {
                console.error('Firebase connection: FAILED -', result.error)
            }
        } catch (err) {
            console.error('Firebase connection: ERROR -', err)
        }
    })
}

if (import.meta.url === `file://${process.argv[1]}`) {
    startServer()
}

export default app