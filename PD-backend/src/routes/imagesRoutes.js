import express from 'express'
import upload from '../middleware/upload.js'
import { uploadImage } from '../controllers/imagesController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, upload.single('image'), uploadImage)

export default router