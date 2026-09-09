import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import embroideryRoutes from './routes/embroidery.js'
import orderRoutes from './routes/orders.js'
import userRoutes from './routes/users.js'
import analyticsRoutes from './routes/analytics.js'
import designRoutes from './routes/designs.js'
import cartRoutes from './routes/cart.js'

import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Thread & Bloom API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/embroidery', embroideryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/designs', designRoutes)
app.use('/api/cart', cartRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

const server = createServer(app)

server.listen(PORT, () => {
  console.log(`🧵 Thread & Bloom API running on port ${PORT}`)
  console.log(`🌸 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app