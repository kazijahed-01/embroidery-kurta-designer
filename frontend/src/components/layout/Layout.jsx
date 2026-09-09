import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useDesign } from '../../context/DesignContext'
import { 
  Home, Settings, User, Heart, ShoppingBag, LogOut, 
  Sparkles, Package, Grid, Bell, Moon, Sun
} from 'lucide-react'

import toast from 'react-hot-toast'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home, emoji: '🏠' },
  { path: '/design-studio', label: 'Design Studio', icon: Sparkles, emoji: '✨' },
  { path: '/shop', label: 'Explore', icon: Grid, emoji: '🛍️' },
  { path: '/my-collection', label: 'My Collection', icon: Heart, emoji: '❤️' },
  { path: '/cart', label: 'Cart', icon: ShoppingBag, emoji: '🛒' },
  { path: '/orders', label: 'Orders', icon: Package, emoji: '📦' },
  { path: '/profile', label: 'Profile', icon: User, emoji: '👤' },
  { path: '/settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
]

export function Layout() {
  const { user, signOut, isAdmin } = useAuth()
  const { getCartCount } = useCart()
  const { resetDesign } = useDesign()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const handleLogout = async () => {
    await signOut()
    resetDesign()
    toast.success('Logged out successfully! 👋', { emoji: true })
    navigate('/login')
  }

  const cartCount = getCartCount()

  return (
    <div className="min-h-screen bg-gradient-pink transition-colors duration-500">
      <div className="embroidery-pattern fixed inset-0 z-0 pointer-events-none" />
      
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-white/95 backdrop-blur-xl border-r border-pink-100 transition-all duration-500 ease-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        } md:w-72 md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-pink-100">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">🧵</span>
              <span className="font-playfair font-bold text-pink-700 text-lg hidden md:block">
                Thread & Bloom
              </span>
            </motion.div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-pink-500 hover:bg-pink-100"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 overflow-y-auto" role="navigation" aria-label="Main navigation">
            <ul className="space-y-1" role="list">
              {navItems.map((item, index) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-3 rounded-xl font-poppins font-medium transition-all duration-300
                      ${isActive 
                        ? 'text-pink-700 bg-gradient-to-r from-pink-100 to-pink-50/50 shadow-md shadow-pink-200/50' 
                        : 'text-gray-600 hover:text-pink-700 hover:bg-pink-50'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                    role="menuitem"
                  >
                    <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span className="hidden md:block whitespace-nowrap">{item.label}</span>
                    {item.path === '/cart' && cartCount > 0 && (
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5 }}
                        className="ml-auto w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-gradient-pink-dark rounded-full"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-pink-100"
              >
                <p className="px-3 text-xs font-poppins font-semibold text-pink-500 uppercase tracking-wider mb-3 hidden md:block">
                  Admin Panel
                </p>
                <NavLink
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl font-poppins font-medium text-pink-600 hover:bg-pink-50 transition-all duration-300"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-xl" role="img" aria-hidden="true">👑</span>
                  <span className="hidden md:block">Admin Dashboard</span>
                </NavLink>
              </motion.div>
            )}
          </nav>

          <div className="p-3 border-t border-pink-100">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block flex-1 min-w-0">
                <p className="font-poppins font-medium text-pink-700 truncate">{user?.name}</p>
                <p className="font-poppins text-xs text-pink-400 truncate">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-poppins font-medium text-rose-500 hover:bg-rose-50 transition-all duration-300"
            >
              <span className="text-lg" role="img" aria-hidden="true">👋</span>
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 md:hidden p-3 rounded-xl bg-white/90 backdrop-blur-xl shadow-lg shadow-pink-100/50 border border-pink-100"
        aria-label="Open menu"
      >
        <span className="text-xl">☰</span>
      </button>

      <main className="md:ml-72 min-h-screen transition-all duration-500">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-pink-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="font-playfair text-2xl font-bold text-pink-700 hidden sm:block">
                Thread & Bloom
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:bg-pink-50 transition-all duration-300"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-pink-500" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:bg-pink-50 transition-all duration-300"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-pink-600" />
                  {notifications.length > 0 && (
                    <span className="notification-dot" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-2xl border border-pink-100 shadow-xl shadow-pink-100/50 overflow-hidden"
                      role="menu"
                    >
                      <div className="px-4 py-3 border-b border-pink-100 flex items-center justify-between">
                        <h3 className="font-playfair font-bold text-pink-700">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={() => setNotifications([])}
                            className="text-xs font-poppins text-pink-500 hover:text-pink-700"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-pink-400">
                            <span className="text-4xl block mb-2">🔔</span>
                            <p className="font-poppins">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif, i) => (
                            <div
                              key={i}
                              className="px-4 py-3 border-b border-pink-50 hover:bg-pink-50 transition-colors"
                              role="menuitem"
                            >
                              <p className="font-poppins text-sm text-gray-700">{notif.message}</p>
                              <p className="font-poppins text-xs text-pink-400 mt-1">{notif.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <NavLink to="/cart" className="relative p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-pink-100 hover:bg-pink-50 transition-all duration-300">
                  <ShoppingBag className="w-5 h-5 text-pink-600" />
                  {cartCount > 0 && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-gradient-pink-dark rounded-full"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </NavLink>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </main>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}