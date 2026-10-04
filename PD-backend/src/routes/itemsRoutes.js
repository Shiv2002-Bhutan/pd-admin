import express from 'express'
import {
    getItems,
    getLowStockItems,
    createItem,
    updateItem,
    addStock
} from '../controllers/itemsController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, getItems)
router.get('/low-stock', authenticate, getLowStockItems)
router.post('/', authenticate, createItem)
router.put('/:id', authenticate, updateItem)
router.post('/:id/stock', authenticate, addStock)

export default router