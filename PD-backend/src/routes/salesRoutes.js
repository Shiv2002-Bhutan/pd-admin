import express from 'express'
import {
    createSale,
    getSales,
    getSaleById
} from '../controllers/salesController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, createSale)
router.get('/', authenticate, getSales)
router.get('/:id', authenticate, getSaleById)

export default router