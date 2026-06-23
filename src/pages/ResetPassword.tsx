import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    const email = localStorage.getItem('resetEmail')
    const otp = localStorage.getItem('resetOtp')
    if (!email || !otp) {
      navigate('/forgot-password')
      return
    }
    try {
      await resetPassword(email, otp, password)
      localStorage.removeItem('resetEmail')
      localStorage.removeItem('resetOtp')
      alert('Password reset successful!')
      navigate('/login')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Reset failed')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">Reset Password</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="mb-5 text-left">
          <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">New Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
        <div className="mb-5 text-left">
          <label htmlFor="confirm" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Confirm Password</label>
          <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
        <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">Reset Password</button>
      </form>
    </div>
  )
}
