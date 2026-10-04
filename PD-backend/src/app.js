import express from 'express'
import cors from 'cors'
import path from 'path'

import authRoutes from './routes/authRoutes.js'
import itemsRoutes from './routes/itemsRoutes.js'
import salesRoutes from './routes/salesRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import imagesRoutes from './routes/imagesRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import shareRoutes from './routes/shareRoutes.js'
import reportsRoutes from './routes/reportsRoutes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
)

app.use('/api/auth', authRoutes)

app.use('/api/items', itemsRoutes)

app.use('/api/sales', salesRoutes)

app.use('/api/analytics', analyticsRoutes)

app.use('/api/categories', categoriesRoutes)

app.use('/api/users', usersRoutes)

app.use('/api/images', imagesRoutes)

app.use('/api/product', publicRoutes)

app.use('/share', shareRoutes)

/* REPORTS */
app.use('/api/reports', reportsRoutes)

export default app