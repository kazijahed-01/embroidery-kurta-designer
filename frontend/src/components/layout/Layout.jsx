import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useDesign } from '../../context/DesignContext'

import {
  Home,
  Settings,
  User,
  Heart,
  ShoppingBag,
  Sparkles,
  Package,
  Grid,
  Bell,
  Moon,
  Sun,
  X,
  Menu,
  LogOut,
} from 'lucide-react'

import toast from 'react-hot-toast'

const navItems = [
  {
    path: '/dashboard',
    label: 'Home',
    icon: Home,
    emoji: '🏠',
  },
  {
    path: '/design-studio',
    label: 'Design Studio',
    icon: Sparkles,
    emoji: '✨',
  },
  {
    path: '/shop',
    label: 'Explore',
    icon: Grid,
    emoji: '🛍️',
  },
  {
    path: '/my-collection',
    label: 'My Collection',
    icon: Heart,
    emoji: '❤️',
  },
  {
    path: '/cart',
    label: 'Cart',
    icon: ShoppingBag,
    emoji: '🛒',
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: Package,
    emoji: '📦',
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
    emoji: '👤',
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    emoji: '⚙️',
  },
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

  // Restore saved theme.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      setDarkMode(saved === 'true')
    } catch (error) {
      console.error('Unable to load theme:', error)
    }
  }, [])

  // Apply theme.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)

    try {
      localStorage.setItem('darkMode', String(darkMode))
    } catch (error) {
      console.error('Unable to save theme:', error)
    }
  }, [darkMode])

  // Close mobile menu when navigating to another route.
  useEffect(() => {
    setSidebarOpen(false)
    setShowNotifications(false)
  }, [navigate])

  const handleLogout = async () => {
    try {
      await signOut()
      resetDesign()

      toast.success('Logged out successfully! 👋')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Unable to log out. Please try again.')
    }
  }

  const cartCount = getCartCount()

  const sidebarLinkClass = ({ isActive }) =>
    [
      'flex w-full items-center gap-3 rounded-xl px-3 py-3',
      'font-poppins font-medium transition-all duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400',
      isActive
        ? 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 shadow-md shadow-pink-200/50'
        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700',
    ].join(' ')

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gradient-pink transition-colors duration-300">
      {/* Decorative background */}
      <div
        className="embroidery-pattern pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="user-sidebar"
        className={[
          'fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-72 max-w-[85vw]',
          'flex-col border-r border-pink-100 bg-white/95 shadow-xl',
          'backdrop-blur-xl transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:w-72 md:max-w-none md:translate-x-0 md:shadow-none',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* Sidebar header */}
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-pink-100 px-4">
          <NavLink
            to="/dashboard"
            className="flex min-w-0 items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="text-2xl" aria-hidden="true">
              🧵
            </span>

            <span className="truncate font-playfair text-lg font-bold text-pink-700">
              Thread & Bloom
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-pink-600 hover:bg-pink-100 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={sidebarLinkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex-shrink-0 text-xl" aria-hidden="true">
                      {item.emoji}
                    </span>

                    <Icon className="h-5 w-5 flex-shrink-0" />

                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    {item.path === '/cart' && cartCount > 0 && (
                      <span className="flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-pink-dark px-1 text-xs font-bold text-white">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Admin link */}
          {isAdmin && (
            <div className="mt-6 border-t border-pink-100 pt-5">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-pink-500">
                Admin Panel
              </p>

              <NavLink
                to="/admin"
                className={sidebarLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl" aria-hidden="true">
                  👑
                </span>

                <span className="flex-1">Admin Dashboard</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* User details and logout */}
        <div className="flex-shrink-0 border-t border-pink-100 p-3">
          <div className="mb-2 flex min-w-0 items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-pink-dark font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-poppins text-sm font-semibold text-pink-700">
                {user?.name || 'User'}
              </p>

              <p className="truncate text-xs text-pink-400">
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 font-poppins font-medium text-rose-500 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main application */}
      <div className="relative z-10 min-h-screen min-w-0 md:ml-72">
        {/* Top header */}
        <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-3 sm:px-5 md:px-6">
            {/* Menu button and title */}
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex-shrink-0 rounded-xl border border-pink-100 bg-white p-2.5 text-pink-600 shadow-sm hover:bg-pink-50 md:hidden"
                aria-label="Open navigation menu"
                aria-controls="user-sidebar"
                aria-expanded={sidebarOpen}
              >
                <Menu className="h-5 w-5" />
              </button>

              <NavLink
                to="/dashboard"
                className="truncate font-playfair text-lg font-bold text-pink-700 sm:text-xl md:text-2xl"
              >
                Thread & Bloom
              </NavLink>
            </div>

            {/* Header actions */}
            <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={() => setDarkMode((previous) => !previous)}
                className="rounded-xl border border-pink-100 bg-white/80 p-2.5 transition-colors hover:bg-pink-50"
                aria-label={
                  darkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-pink-500" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications((previous) => !previous)}
                  className="relative rounded-xl border border-pink-100 bg-white/80 p-2.5 transition-colors hover:bg-pink-50"
                  aria-label="Notifications"
                  aria-expanded={showNotifications}
                >
                  <Bell className="h-5 w-5 text-pink-600" />

                  {notifications.length > 0 && (
                    <span className="notification-dot" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-pink-100 px-4 py-3">
                        <h3 className="font-playfair font-bold text-pink-700">
                          Notifications
                        </h3>

                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setNotifications([])}
                            className="text-xs text-pink-500 hover:text-pink-700"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-pink-300" />

                            <p className="text-sm text-pink-500">
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification, index) => (
                            <div
                              key={`${notification.time}-${index}`}
                              className="border-b border-pink-50 px-4 py-3"
                            >
                              <p className="text-sm text-gray-700">
                                {notification.message}
                              </p>

                              <p className="mt-1 text-xs text-pink-400">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <NavLink
                to="/cart"
                className="relative rounded-xl border border-pink-100 bg-white/80 p-2.5 transition-colors hover:bg-pink-50"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingBag className="h-5 w-5 text-pink-600" />

                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-pink-dark px-1 text-xs font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 p-3 sm:p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-pink-100/70 px-4 py-5 text-center text-xs text-pink-500 sm:text-sm">
          © {new Date().getFullYear()} Thread & Bloom. Made with 🩷
        </footer>
      </div>
    </div>
  )
}

export default Layout