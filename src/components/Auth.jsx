import React, { useState } from 'react'
import { supabase } from '../SupaBaseClient'
import './Auth.css'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' atau 'error'

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        // Proses Registrasi
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        setMessage('✅ Pendaftaran berhasil! Cek email Anda untuk verifikasi.')
        setMessageType('success')
        setEmail('')
        setPassword('')
        setIsSignUp(false)
      } else {
        // Proses Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setMessage('✅ Login berhasil! Selamat datang.')
        setMessageType('success')
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
      setMessageType('error')
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🔐 Catatan Aman</h1>
          <p>Simpan catatan Anda dengan aman di cloud</p>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? '⏳ Loading...' : isSignUp ? '📝 Daftar' : '🔓 Login'}
          </button>
        </form>

        <div className="auth-toggle">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setMessage('')
              setEmail('')
              setPassword('')
            }}
            className="toggle-button"
          >
            {isSignUp ? (
              <>Sudah punya akun? <strong>Login di sini</strong></>
            ) : (
              <>Belum punya akun? <strong>Daftar di sini</strong></>
            )}
          </button>
        </div>

        <div className="auth-footer">
          <p>💡 Tip: Gunakan password minimal 6 karakter</p>
          <p>🔒 Data Anda dienkripsi dan aman di cloud</p>
        </div>
      </div>
    </div>
  )
}