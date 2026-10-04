import express from 'express'
import {
    getSummary,
    getSalesWithItems
} from '../controllers/analyticsController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/summary', authenticate, requireRole('super_admin'), getSummary)
router.get('/sales', authenticate, requireRole('super_admin'), getSalesWithItems)

export default router