import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const USERS_FILE = process.env.VERCEL
  ? '/tmp/users.json'
  : join(__dirname, '..', 'data', 'users.json')
const router = Router()

async function getUsers() {
  try {
    const data = await readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveUsers(users) {
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

async function createTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })
  }
  const testAccount = await nodemailer.createTestAccount()
  console.log('--- Ethereal Test Email Account ---')
  console.log('  User:', testAccount.user)
  console.log('  Pass:', testAccount.pass)
  console.log('  Web:  https://ethereal.email/login')
  console.log('-----------------------------------')
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
}

let transporter
;(async () => {
  transporter = await createTransporter()
})()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const users = await getUsers()
    if (users.find((u) => u.email === email)) {
      res.status(400).json({ error: 'Email already registered' })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({ id: Date.now().toString(), name, email, password: hashedPassword })
    await saveUsers(users)
    res.status(201).json({ message: 'Account created successfully' })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const users = await getUsers()
    const user = users.find((u) => u.email === email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const users = await getUsers()
    const user = users.find((u) => u.email === email)
    if (!user) {
      res.status(404).json({ error: 'No account found with this email' })
      return
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetOtp = otp
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000
    await saveUsers(users)

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || '"Test" <test@ethereal.email>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
    })

    const isDev = !process.env.EMAIL_USER
    if (isDev) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
    }

    res.json({
      message: 'OTP sent to your email',
      ...(isDev && { devOtp: otp, previewUrl: nodemailer.getTestMessageUrl(info) }),
    })
  } catch (err) {
    console.error('Send OTP error:', err)
    res.status(500).json({ error: 'Failed to send OTP. Check server console for details.' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    const users = await getUsers()
    const user = users.find((u) => u.email === email)
    if (!user || user.resetOtp !== otp || Date.now() > (user.resetOtpExpiry || 0)) {
      res.status(400).json({ error: 'Invalid or expired OTP' })
      return
    }
    res.json({ message: 'OTP verified' })
  } catch (err) {
    console.error('Verify OTP error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body
    const users = await getUsers()
    const user = users.find((u) => u.email === email)
    if (!user || user.resetOtp !== otp || Date.now() > (user.resetOtpExpiry || 0)) {
      res.status(400).json({ error: 'Invalid or expired OTP' })
      return
    }
    user.password = await bcrypt.hash(password, 10)
    delete user.resetOtp
    delete user.resetOtpExpiry
    await saveUsers(users)
    res.json({ message: 'Password reset successful' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
