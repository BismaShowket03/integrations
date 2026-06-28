import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import { authenticateToken } from './middleware/auth.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user)
})

export default app
