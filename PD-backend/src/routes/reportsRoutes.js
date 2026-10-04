import express from 'express'
import { getArchives, downloadArchive } from '../controllers/reportsController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticate, requireRole('super_admin'), getArchives)
router.get('/:id/download', authenticate, requireRole('super_admin'), downloadArchive)

export default router