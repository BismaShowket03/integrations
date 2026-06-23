import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [devInfo, setDevInfo] = useState<{ otp: string; url: string } | null>(null)
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setDevInfo(null)
    try {
      const res = await forgotPassword(email)
      localStorage.setItem('resetEmail', email)
      if (res.devOtp) {
        setDevInfo({ otp: res.devOtp, url: res.previewUrl! })
      } else {
        setSuccess('OTP sent to your email!')
        setTimeout(() => navigate('/verify-otp'), 1500)
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Failed to send OTP')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">Forgot Password</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
        {devInfo && (
          <div className="mb-5 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">Dev Mode — OTP sent via Ethereal</p>
            <p className="text-yellow-700 dark:text-yellow-300">OTP: <span className="font-mono font-bold text-lg">{devInfo.otp}</span></p>
            <button type="button" onClick={() => navigate('/verify-otp')}
              className="mt-3 w-full py-2 bg-purple-500 text-white rounded-lg text-sm cursor-pointer hover:opacity-90 transition-opacity">
              I have the OTP — Verify
            </button>
          </div>
        )}
        <div className="mb-5 text-left">
          <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Enter your registered email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
        <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">Send OTP</button>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-purple-500 hover:underline">Back to Login</Link>
        </p>
      </form>
    </div>
  )
}
