import express from 'express'
import { getPublicProductList } from '../controllers/publicController.js'

const router = express.Router()


router.get('/list', getPublicProductList)

export default router