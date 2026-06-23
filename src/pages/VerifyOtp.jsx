import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = localStorage.getItem('resetEmail')
    if (!email) {
      navigate('/forgot-password')
      return
    }
    try {
      await verifyOtp(email, otp)
      localStorage.setItem('resetOtp', otp)
      navigate('/reset-password')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">Verify OTP</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="mb-5 text-left">
          <label htmlFor="otp" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">OTP</label>
          <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border text-center text-2xl tracking-widest" />
        </div>
        <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">Verify OTP</button>
      </form>
    </div>
  )
}
