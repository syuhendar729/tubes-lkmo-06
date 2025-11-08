import dotenv from 'dotenv'
import app from './app.js'
import { initFirebase, testConnection } from './firebase.js'

dotenv.config()

// ----------------------------------------------------

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

export default app