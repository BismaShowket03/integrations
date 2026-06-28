import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">Login</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="mb-5 text-left">
          <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
        <div className="mb-5 text-left">
          <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
        <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">Sign In</button>
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <GoogleSignInButton />
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/forgot-password" className="text-purple-500 hover:underline">Forgot password?</Link>
        </div>
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account? <Link to="/register" className="text-purple-500 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}
