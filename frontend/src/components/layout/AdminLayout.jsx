import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import {
  LayoutDashboard,
  Box,
  Scissors,
  Package,
  Users,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const adminNavItems = [
  {
    path: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    emoji: '📊',
  },
  {
    path: '/admin/products',
    label: 'Products',
    icon: Box,
    emoji: '👗',
  },
  {
    path: '/admin/embroidery',
    label: 'Embroidery',
    icon: Scissors,
    emoji: '🧵',
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    icon: Package,
    emoji: '📦',
  },
  {
    path: '/admin/users',
    label: 'Users',
    icon: Users,
    emoji: '👥',
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    emoji: '📈',
  },
]

export function AdminLayout() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('darkMode') === 'true'
    } catch {
      return false
    }
  })

  // Dark mode ko website par apply karna
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)

    try {
      localStorage.setItem('darkMode', String(darkMode))
    } catch {
      // Website localStorage ke bina bhi render ho sakti hai.
    }

    return () => {
      // Component unmount hone par dark mode ko remove nahi karna.
    }
  }, [darkMode])

  // Mobile menu khula ho to background scrolling rokna
  useEffect(() => {
    if (!sidebarOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [sidebarOpen])

  // Logout
  const handleLogout = async () => {
    try {
      await signOut()

      setSidebarOpen(false)

      toast.success('Logged out successfully!')

      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Admin logout error:', error)

      toast.error('Logout failed. Please try again.')
    }
  }

  // Admin access check
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-pink transition-colors duration-300">

      {/* Background decoration */}
      <div
        className="embroidery-pattern fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            aria-label="Close admin menu"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-[100dvh] w-[min(18rem,85vw)] flex-col
          overflow-hidden
          border-r border-pink-100
          bg-white/95 backdrop-blur-xl
          shadow-xl shadow-pink-100/30
          transition-transform duration-300 ease-in-out
          dark:border-gray-700 dark:bg-gray-800
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          md:w-72 md:translate-x-0 md:shadow-none
        `}
      >

        {/* Sidebar header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-pink-100 bg-gradient-to-r from-pink-50 to-pink-100/50 px-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">

          <div className="flex min-w-0 items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              👑
            </span>

            <div className="min-w-0">
              <h2 className="truncate font-playfair text-lg font-bold text-pink-800 dark:text-pink-200">
                Thread & Bloom
              </h2>

              <p className="text-xs text-pink-500 dark:text-pink-300">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-pink-600 transition hover:bg-pink-100 md:hidden"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-5"
          aria-label="Admin navigation"
        >
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-pink-400">
            Administration
          </p>

          <ul className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `
                      flex min-h-12 items-center gap-3
                      rounded-xl px-3 py-3
                      font-poppins text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-pink-100 text-pink-800 shadow-sm dark:bg-gray-700 dark:text-pink-200'
                          : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-pink-200'
                      }
                    `}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    <span aria-hidden="true" className="text-base">
                      {item.emoji}
                    </span>
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Admin information */}
          <div className="mt-7 rounded-2xl border border-pink-100 bg-pink-50/80 p-4 dark:border-gray-700 dark:bg-gray-700/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 shrink-0 text-pink-600 dark:text-pink-300" />

              <p className="font-poppins text-sm font-semibold text-pink-800 dark:text-pink-200">
                Admin Access
              </p>
            </div>

            <p className="mt-2 break-words font-poppins text-xs leading-5 text-gray-600 dark:text-gray-300">
              Manage products, embroidery designs, orders and users.
            </p>
          </div>
        </nav>

        {/* Admin profile and actions */}
        <div className="shrink-0 border-t border-pink-100 p-3 dark:border-gray-700">

          <div className="mb-3 flex min-w-0 items-center gap-3 rounded-xl bg-pink-50/70 p-3 dark:bg-gray-700/50">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-pink-dark font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-poppins text-sm font-semibold text-pink-800 dark:text-pink-200">
                {user?.name || 'Administrator'}
              </p>

              <p className="truncate font-poppins text-xs text-gray-500 dark:text-gray-300">
                {user?.email || 'Admin account'}
              </p>
            </div>
          </div>

          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 font-poppins text-sm font-medium text-pink-700 transition hover:bg-pink-50 dark:text-pink-200 dark:hover:bg-gray-700"
          >
            <Home className="h-5 w-5 shrink-0" />

            <span>Back to Website</span>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 font-poppins text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-gray-700"
          >
            <LogOut className="h-5 w-5 shrink-0" />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative z-10 min-h-screen min-w-0 md:ml-72">

        {/* Top header */}
        <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/90 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/95">

          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">

            {/* Mobile menu button and page title */}
            <div className="flex min-w-0 items-center gap-3">

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-100 bg-white text-pink-600 shadow-sm transition hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-700 dark:text-pink-200 md:hidden"
                aria-label="Open admin menu"
                aria-controls="admin-sidebar"
                aria-expanded={sidebarOpen}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate font-playfair text-lg font-bold text-pink-800 dark:text-pink-200 sm:text-2xl">
                  Admin Dashboard
                </h1>

                <p className="hidden text-xs text-gray-500 dark:text-gray-300 sm:block">
                  Welcome to Thread & Bloom
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              <span className="hidden items-center gap-1 rounded-full bg-pink-100 px-3 py-2 text-xs font-semibold text-pink-700 dark:bg-gray-700 dark:text-pink-200 sm:flex">
                <ShieldCheck className="h-4 w-4" />

                ADMIN
              </span>

              <button
                type="button"
                onClick={() => setDarkMode((previous) => !previous)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-white text-pink-600 transition hover:bg-pink-50 dark:border-gray-600 dark:bg-gray-700 dark:text-yellow-300"
                aria-label={
                  darkMode
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
                title={
                  darkMode
                    ? 'Light mode'
                    : 'Dark mode'
                }
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">

          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="min-w-0 w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  )
}