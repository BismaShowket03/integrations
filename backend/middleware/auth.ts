import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

interface JwtPayload {
  id: string
  name: string
  email: string
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Access denied' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid token' })
      return
    }
    ;(req as Request & { user?: JwtPayload }).user = decoded as JwtPayload
    next()
  })
}
