import express from 'express'
import {
	listProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/productController.js'

const router = express.Router()

router.get('/products', listProducts)
router.get('/product/:id', getProductById)

// CRUD
router.post('/product', createProduct)
router.patch('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router

