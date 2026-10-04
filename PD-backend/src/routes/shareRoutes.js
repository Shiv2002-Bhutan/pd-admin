import express from 'express'
import { getProductShare } from '../controllers/shareController.js'

const router = express.Router()

// deliberately public — WhatsApp's crawler can't authenticate
router.get('/product/:id', getProductShare)

export default router