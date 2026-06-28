import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import authRoutes from '../backend/routes/auth.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Access denied' })
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    res.json(user)
  })
})

export default app
