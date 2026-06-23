import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API = '/api/auth'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('authUser') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('authToken'))

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

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/register`, { name, email, password })
    return data
  }

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/login`, { email, password })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const forgotPassword = async (email) => {
    const { data } = await axios.post(`${API}/forgot-password`, { email })
    return data
  }

  const verifyOtp = async (email, otp) => {
    const { data } = await axios.post(`${API}/verify-otp`, { email, otp })
    return data
  }

  const resetPassword = async (email, otp, password) => {
    const { data } = await axios.post(`${API}/reset-password`, { email, otp, password })
    return data
  }

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, forgotPassword, verifyOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
