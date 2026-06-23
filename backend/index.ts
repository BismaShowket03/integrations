import 'dotenv/config'
import express, { Request } from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import { authenticateToken } from './middleware/auth.js'

declare module 'express' {
  interface Request {
    user?: { id: string; name: string; email: string }
  }
}

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/auth/me', authenticateToken, (req: Request, res) => {
  res.json(req.user)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
