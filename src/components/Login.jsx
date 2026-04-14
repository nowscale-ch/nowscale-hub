import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Login fehlgeschlagen. Überprüfe deine Zugangsdaten.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F8F8F6' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}>
            NOWSCALE
          </h1>
          <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FF4D00', color: '#FFFFFF' }}>
            Hub
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid #E5E5E3' }}>
          <h2 className="text-lg font-semibold mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#1A1A1A' }}>
            Anmelden
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="simon@nowscale.ch"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#F8F8F6',
                  border: '1px solid #E5E5E3',
                  color: '#1A1A1A',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF4D00'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E3'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A1A' }}>
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#F8F8F6',
                  border: '1px solid #E5E5E3',
                  color: '#1A1A1A',
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF4D00'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E3'}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: '#FF4D00' }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#E64500')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#FF4D00')}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#999' }}>
          © 2026 NOWSCALE™ · Interne Tools
        </p>
      </div>
    </div>
  )
}
