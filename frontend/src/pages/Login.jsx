import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import toast from 'react-hot-toast'

const loginEmojis = ['🌸', '🧵', '👗', '✨', '💎', '🦚', '🦋', '🌿', '💖', '🧚']

export function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [floatingEmojis, setFloatingEmojis] = useState([])

  const validateForm = () => {
    const newErrors = {}

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Name is required ✨'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required 📱'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required 📧'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format 📧'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required 🔒'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters 🔒'
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match 🔒'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password)
        if (error) throw error

        toast.success('Welcome back! 🌸')
        navigate('/dashboard')
        return
      }

      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      )
      if (error) throw error

      toast.success('Account created! Check your email to verify it. ✨')
      setIsLogin(true)
      setErrors({})
      setFormData((previous) => ({
        ...previous,
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast.error(error.message || 'Something went wrong 😢')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin((previous) => !previous)
    setErrors({})
    setFormData((previous) => ({
      ...previous,
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }))
  }

  const addFloatingEmoji = () => {
    const emoji = loginEmojis[Math.floor(Math.random() * loginEmojis.length)]
    const id = Date.now()

    setFloatingEmojis((previous) => [
      ...previous,
      { id, emoji, x: Math.random() * 100, delay: Math.random() * 2 }
    ])

    setTimeout(() => {
      setFloatingEmojis((previous) => previous.filter((item) => item.id !== id))
    }, 6000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="embroidery-pattern fixed inset-0" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {floatingEmojis.map(({ id, emoji, x, delay }) => (
          <motion.span
            key={id}
            initial={{ opacity: 0, y: 100, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, y: -120, scale: 1, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, delay, ease: 'linear' }}
            className="absolute text-3xl"
            style={{ left: `${x}%` }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-10"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-4"
              >
                <span className="text-6xl">🧵</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="font-playfair text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent"
              >
                Thread & Bloom
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-poppins text-pink-500 mt-2"
              >
                {isLogin ? 'Welcome back, beautiful! 💖' : 'Join our creative community ✨'}
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card p-8"
              >
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className={!isLogin ? 'grid grid-cols-2 gap-4' : ''}
                  >
                    {!isLogin && (
                      <>
                        <div>
                          <label htmlFor="name" className="input-label">Full Name 👤</label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                            className={`input-field ${errors.name ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                            placeholder="Enter your name"
                            autoComplete="name"
                            disabled={loading}
                          />
                          {errors.name && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="input-label">Phone 📱</label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(event) => setFormData((previous) => ({ ...previous, phone: event.target.value }))}
                            className={`input-field ${errors.phone ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                            placeholder="Enter phone number"
                            autoComplete="tel"
                            disabled={loading}
                          />
                          {errors.phone && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.phone}</p>}
                        </div>
                      </>
                    )}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
                    <label htmlFor="email" className="input-label">Email 📧</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                      className={`input-field ${errors.email ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={loading}
                    />
                    {errors.email && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.email}</p>}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
                    <label htmlFor="password" className="input-label">Password 🔒</label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))}
                      className={`input-field ${errors.password ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                      placeholder="Enter password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      disabled={loading}
                    />
                    {errors.password && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.password}</p>}
                  </motion.div>

                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }}>
                      <label htmlFor="confirmPassword" className="input-label">Confirm Password 🔒</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(event) => setFormData((previous) => ({ ...previous, confirmPassword: event.target.value }))}
                        className={`input-field ${errors.confirmPassword ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.confirmPassword}</p>}
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addFloatingEmoji}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </span>
                    ) : (
                      isLogin ? 'Sign In 🌸' : 'Create Account ✨'
                    )}
                  </motion.button>
                </form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="mt-6 text-center"
                >
                  <p className="font-poppins text-gray-600">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="font-poppins font-semibold text-pink-600 hover:text-pink-700 underline"
                    >
                      {isLogin ? 'Sign Up ✨' : 'Sign In 🌸'}
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-6 text-center text-pink-300 text-sm font-poppins"
            >
              <p>Crafted with 💖 for every woman who loves embroidery</p>
              <div className="flex justify-center gap-1 mt-2">
                {['🌸', '🧵', '👗', '✨', '💖'].map((emoji, index) => (
                  <motion.span
                    key={index}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {loading && <LoadingScreen message="Stitching your session..." />}
    </div>
  )
}
