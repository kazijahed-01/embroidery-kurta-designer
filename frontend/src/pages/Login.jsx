import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import toast from 'react-hot-toast'

const loginEmojis = [
  '🌸', '🧵', '👗', '✨', '💎',
  '🦚', '🦋', '🌿', '💖', '🧚'
]

export function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  // Validate the form
  const validateForm = () => {
    const newErrors = {}

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required ✨'
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required 📱'
      } else if (!/^[+\d\s()-]{7,20}$/.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number 📱'
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required 📧'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = 'Invalid email format 📧'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required 🔒'
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters 🔒'
    }

    if (
      !isLogin &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match 🔒'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // Login and signup
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(
          formData.email.trim().toLowerCase(),
          formData.password
        )

        if (error) throw error

        toast.success('Welcome back! 🌸')

        navigate('/dashboard', { replace: true })

        return
      }

      const { error } = await signUp(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.name.trim(),
        formData.phone.trim()
      )

      if (error) throw error

      toast.success(
        'Account created! Check your email to verify it. ✨'
      )

      setIsLogin(true)
      setErrors({})

      setFormData({
        name: '',
        email: formData.email,
        password: '',
        confirmPassword: '',
        phone: ''
      })

      setShowPassword(false)
      setShowConfirmPassword(false)
    } catch (error) {
      toast.error(error.message || 'Something went wrong 😢')
    } finally {
      setLoading(false)
    }
  }

  // Switch between login and signup
  const toggleMode = () => {
    setIsLogin((previous) => !previous)

    setErrors({})

    setFormData((previous) => ({
      ...previous,
      name: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }))

    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // Floating embroidery emojis
  const addFloatingEmoji = () => {
    const emoji =
      loginEmojis[Math.floor(Math.random() * loginEmojis.length)]

    const id = Date.now() + Math.random()

    setFloatingEmojis((previous) => [
      ...previous,
      {
        id,
        emoji,
        x: Math.random() * 90,
        delay: Math.random() * 0.5
      }
    ])

    setTimeout(() => {
      setFloatingEmojis((previous) =>
        previous.filter((item) => item.id !== id)
      )
    }, 6500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background pattern */}
      <div className="embroidery-pattern fixed inset-0" />

      {/* Floating emojis */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <AnimatePresence>
          {floatingEmojis.map(({ id, emoji, x, delay }) => (
            <motion.span
              key={id}
              initial={{
                opacity: 0,
                y: 100,
                scale: 0,
                rotate: -180
              }}
              animate={{
                opacity: 1,
                y: -120,
                scale: 1,
                rotate: 180
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 6,
                delay,
                ease: 'linear'
              }}
              className="absolute text-3xl"
              style={{ left: `${x}%`, bottom: 0 }}
            >
              {emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center p-4 z-10"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="relative"
          >
            {/* Brand heading */}
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
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
                Thread &amp; Bloom
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-poppins text-pink-500 mt-2"
              >
                {isLogin
                  ? 'Welcome back, beautiful! 💖'
                  : 'Join our creative community ✨'}
              </motion.p>
            </div>

            {/* Login and signup card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{
                  opacity: 0,
                  x: isLogin ? -20 : 20,
                  scale: 0.95
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  x: isLogin ? 20 : -20,
                  scale: 0.95
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="glass-card p-8 rounded-3xl"
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* Name and phone for signup */}
                  {!isLogin && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label
                          htmlFor="name"
                          className="input-label"
                        >
                          Full Name 👤
                        </label>

                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              name: event.target.value
                            }))
                          }
                          className={`input-field ${
                            errors.name
                              ? 'border-rose-400 focus:ring-rose-300'
                              : ''
                          }`}
                          placeholder="Enter your name"
                          autoComplete="name"
                          disabled={loading}
                        />

                        {errors.name && (
                          <p className="mt-1 text-sm text-rose-500">
                            {errors.name}
                          </p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label
                          htmlFor="phone"
                          className="input-label"
                        >
                          Phone 📱
                        </label>

                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              phone: event.target.value
                            }))
                          }
                          className={`input-field ${
                            errors.phone
                              ? 'border-rose-400 focus:ring-rose-300'
                              : ''
                          }`}
                          placeholder="Enter phone number"
                          autoComplete="tel"
                          disabled={loading}
                        />

                        {errors.phone && (
                          <p className="mt-1 text-sm text-rose-500">
                            {errors.phone}
                          </p>
                        )}
                      </motion.div>
                    </>
                  )}

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label
                      htmlFor="email"
                      className="input-label"
                    >
                      Email 📧
                    </label>

                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          email: event.target.value
                        }))
                      }
                      className={`input-field ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-300'
                          : ''
                      }`}
                      placeholder="Enter your email"
                      autoComplete="email"
                      disabled={loading}
                    />

                    {errors.email && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.email}
                      </p>
                    )}
                  </motion.div>

                  {/* Password with monkey toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label
                      htmlFor="password"
                      className="input-label"
                    >
                      Password 🔒
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            password: event.target.value
                          }))
                        }
                        className={`input-field pr-12 ${
                          errors.password
                            ? 'border-rose-400 focus:ring-rose-300'
                            : ''
                        }`}
                        placeholder="Enter password"
                        autoComplete={
                          isLogin
                            ? 'current-password'
                            : 'new-password'
                        }
                        disabled={loading}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        disabled={loading}
                      >
                        {showPassword ? '🙉' : '🙈'}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.password}
                      </p>
                    )}
                  </motion.div>

                  {/* Confirm password */}
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label
                        htmlFor="confirmPassword"
                        className="input-label"
                      >
                        Confirm Password 🔒
                      </label>

                      <div className="relative">
                        <input
                          type={
                            showConfirmPassword ? 'text' : 'password'
                          }
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              confirmPassword: event.target.value
                            }))
                          }
                          className={`input-field pr-12 ${
                            errors.confirmPassword
                              ? 'border-rose-400 focus:ring-rose-300'
                              : ''
                          }`}
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          disabled={loading}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (previous) => !previous
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                          aria-label={
                            showConfirmPassword
                              ? 'Hide confirm password'
                              : 'Show confirm password'
                          }
                          disabled={loading}
                        >
                          {showConfirmPassword ? '🙉' : '🙈'}
                        </button>
                      </div>

                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-rose-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addFloatingEmoji}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                        {isLogin
                          ? 'Signing in...'
                          : 'Creating account...'}
                      </span>
                    ) : isLogin ? (
                      'Sign In 🌸'
                    ) : (
                      'Create Account ✨'
                    )}
                  </motion.button>
                </form>

                {/* Signup / signin toggle */}
                <div className="mt-6 text-center">
                  <p className="font-poppins text-gray-600">
                    {isLogin
                      ? "Don't have an account? "
                      : 'Already have an account? '}

                    <button
                      type="button"
                      onClick={toggleMode}
                      disabled={loading}
                      className="font-poppins font-semibold text-pink-600 hover:text-pink-700 underline"
                    >
                      {isLogin ? 'Sign Up ✨' : 'Sign In 🌸'}
                    </button>
                  </p>
                </div>

                {/* Separate admin login option */}
                {isLogin && (
                  <div className="mt-5 border-t border-pink-200 pt-5 text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Are you an administrator?
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate('/admin/login')}
                      disabled={loading}
                      className="w-full rounded-xl border-2 border-pink-300 px-4 py-3 font-semibold text-pink-700 transition duration-200 hover:bg-pink-50 hover:border-pink-500 disabled:opacity-60"
                    >
                      🛡️ Admin Login
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center text-pink-300 text-sm font-poppins"
            >
              <p>
                Crafted with 💖 for every woman who loves embroidery
              </p>

              <div className="flex justify-center gap-1 mt-2">
                {['🌸', '🧵', '👗', '✨', '💖'].map(
                  (emoji, index) => (
                    <motion.span
                      key={index}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      {emoji}
                    </motion.span>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading overlay */}
      {loading && (
        <LoadingScreen message="Stitching your session..." />
      )}
    </div>
  )
}