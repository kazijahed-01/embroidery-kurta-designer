import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import toast from 'react-hot-toast'

export function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required ✨'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required 📱'
    if (!formData.email.trim()) newErrors.email = 'Email is required 📧'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format 📧'
    if (!formData.password) newErrors.password = 'Password is required 🔒'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters 🔒'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match 🔒'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone)
      if (error) throw error
      toast.success('Account created! ✨ Check your email to verify.', { emoji: true })
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Something went wrong 😢', { emoji: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="embroidery-pattern fixed inset-0" />
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
            className="glass-card p-8"
          >
            <div className="text-center mb-8">
              <motion.span className="text-6xl inline-block animate-float">🌸</motion.span>
              <motion.h1 className="font-playfair text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent mt-4">
                Create Account
              </motion.h1>
              <motion.p className="font-poppins text-pink-500 mt-2">Join our embroidery community ✨</motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="input-label">Full Name 👤</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`input-field ${errors.phone ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  disabled={loading}
                />
                {errors.phone && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="input-label">Email 📧</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`input-field ${errors.email ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                />
                {errors.email && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="input-label">Password 🔒</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`input-field ${errors.password ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                  placeholder="Create password (min 6 chars)"
                  autoComplete="new-password"
                  disabled={loading}
                />
                {errors.password && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="input-label">Confirm Password 🔒</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`input-field ${errors.confirmPassword ? 'border-rose-400 focus:ring-rose-300' : ''}`}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-rose-500 font-poppins">{errors.confirmPassword}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account ✨'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-poppins text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-poppins font-semibold text-pink-600 hover:text-pink-700 underline">
                  Sign In 🌸
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {loading && <LoadingScreen message="Weaving your new account..." />}
    </div>
  )
}