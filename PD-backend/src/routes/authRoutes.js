import express from 'express'
import { login, changePassword } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.put('/change-password', authenticate, changePassword)

export default router