import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

const API = '/api/auth'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  register: (name: string, email: string, password: string) => Promise<{ message: string }>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  googleLogin: (credential: string) => Promise<void>
  forgotPassword: (email: string) => Promise<{ message: string; devOtp?: string; previewUrl?: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ message: string }>
  resetPassword: (email: string, otp: string, password: string) => Promise<{ message: string }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('authUser') || 'null'))
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [user, token])

  const register = async (name: string, email: string, password: string) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password })
    return data
  }

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${API}/login`, { email, password })
    setToken(data.token)
    setUser(data.user)
  }

  const googleLogin = async (credential: string) => {
    const { data } = await axios.post(`${API}/google`, { credential })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const forgotPassword = async (email: string) => {
    const { data } = await axios.post(`${API}/forgot-password`, { email })
    return data
  }

  const verifyOtp = async (email: string, otp: string) => {
    const { data } = await axios.post(`${API}/verify-otp`, { email, otp })
    return data
  }

  const resetPassword = async (email: string, otp: string, password: string) => {
    const { data } = await axios.post(`${API}/reset-password`, { email, otp, password })
    return data
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, googleLogin, logout, forgotPassword, verifyOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
