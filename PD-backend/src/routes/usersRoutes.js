import express from 'express'
import { getUsers, createUser,deleteUser } from '../controllers/usersController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, requireRole('super_admin'), getUsers)
router.post('/', authenticate, requireRole('super_admin'), createUser)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteUser)

export default router