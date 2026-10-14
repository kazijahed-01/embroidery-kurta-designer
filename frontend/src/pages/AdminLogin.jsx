import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export function AdminLogin() {
  const {
    signIn,
    signOut,
    user,
    loading: authLoading,
    isAdmin,
  } = useAuth()

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [authLoading, user, isAdmin, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter your admin email and password.')
      return
    }

    setSubmitting(true)

    try {
      const { error } = await signIn(
        email.trim().toLowerCase(),
        password
      )

      if (error) {
        throw error
      }

      const {
        data: { user: signedInUser },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !signedInUser) {
        await signOut()
        throw new Error('Unable to verify your account.')
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', signedInUser.id)
        .maybeSingle()

      if (profileError || !profile) {
        await signOut()
        throw new Error(
          'Unable to verify your admin role. Please check your profile.'
        )
      }

      if (profile.role !== 'admin') {
        await signOut()
        throw new Error(
          'Access denied. This account is not an administrator.'
        )
      }

      toast.success('Admin login successful! 🌸')
      navigate('/admin', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Admin login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return <LoadingScreen />
  }

  if (user && isAdmin) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-pink-50 via-white to-rose-100">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧵</div>

            <h1 className="font-playfair text-3xl font-bold text-pink-800">
              Admin Login
            </h1>

            <p className="mt-2 text-pink-600">
              Thread & Bloom Administration 🛡️
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="input-label">
                Admin Email 📧
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input-field"
                placeholder="Enter admin email"
                autoComplete="username"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="input-label">
                Password 🔒
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  disabled={submitting}
                >
                  {showPassword ? '🙉' : '🙈'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-lg disabled:opacity-60"
            >
              {submitting
                ? 'Verifying Admin...'
                : 'Login to Admin Panel 🛡️'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-semibold text-pink-600 hover:text-pink-800 underline"
            >
              ← Back to User Login
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            Restricted access for authorized administrators only.
          </p>
        </div>
      </motion.div>
    </div>
  )
}