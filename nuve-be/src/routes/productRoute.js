import express from 'express'
import multer from 'multer'
import {
	listProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	checkConnection
} from '../controllers/productController.js'

const router = express.Router()

// multer to parse multipart/form-data (image uploads). Use memory storage for now;
// actual upload to Cloud Storage will be implemented later.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.get('/check', checkConnection)

router.get('/products', listProducts)
router.get('/product/:id', getProductById)

// CRUD
// Accept FormData with optional `image` file
router.post('/product', upload.single('image'), createProduct)
// PATCH /product/:id (update) is currently disabled — edit feature removed from frontend
// router.patch('/product/:id', upload.single('image'), updateProduct)
router.delete('/product/:id', deleteProduct)

export default router

