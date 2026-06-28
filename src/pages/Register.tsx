import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      navigate('/login')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-8">Create Account</h1>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="mb-5 text-left">
          <label htmlFor="name" className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-3 focus:ring-purple-300 dark:focus:ring-purple-500 box-border" />
        </div>
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
        <button type="submit" className="w-full py-3 bg-purple-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">Register</button>
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <GoogleSignInButton />
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-purple-500 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}
