import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mainRouter from './routes/index.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API for Nuve - Fashion recommendation website' })
})

// mount api router (routes are defined under src/routes)
app.use('/api', mainRouter)

export default app
