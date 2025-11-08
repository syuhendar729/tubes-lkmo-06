import express from 'express'
import { recommend } from '../controllers/recommendationController.js'

const router = express.Router()

router.post('/rekomendasi-fashion', recommend)

export default router
