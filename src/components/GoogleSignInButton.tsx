import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleSignInButton() {
  const [error, setError] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)
  const { googleLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = initGSI
      document.body.appendChild(script)
    } else {
      initGSI()
    }

    function initGSI() {
      if (!window.google || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            setError('')
            await googleLogin(response.credential)
            navigate('/dashboard')
          } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } }; message?: string }
            const msg = axiosErr.response?.data?.error || axiosErr.message || 'Google sign-in failed'
            console.error('Google sign-in error:', err)
            setError(msg)
          }
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
      })
    }
  }, [googleLogin, navigate])

  return (
    <div>
      {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
      <div ref={buttonRef} className="w-full flex justify-center"></div>
    </div>
  )
}
