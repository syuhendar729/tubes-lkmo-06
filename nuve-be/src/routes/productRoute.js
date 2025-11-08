import express from 'express'
import { listProducts, getProductById } from '../controllers/productController.js'

const router = express.Router()

router.get('/products', listProducts)
router.get('/product/:id', getProductById)

export default router
