import express from 'express'
import { getCategories } from '../controllers/categoriesController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, getCategories)

export default router