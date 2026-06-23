import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Logged in as {user.email}</p>
        <button onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-lg text-base cursor-pointer hover:opacity-90 transition-opacity">
          Logout
        </button>
      </div>
    </div>
  )
}
