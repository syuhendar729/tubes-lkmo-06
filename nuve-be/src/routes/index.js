import express from 'express'
import productRoute from './productRoute.js'
import recommendationRoute from './recommendationRoute.js'

const router = express.Router()

// mount product routes and recommendation routes under /api
router.use(productRoute)
router.use(recommendationRoute)

export default router
