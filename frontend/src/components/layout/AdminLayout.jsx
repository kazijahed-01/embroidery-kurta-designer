import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, Box, Scissors, Package, Users, 
  BarChart3, LogOut, Home, Settings
} from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, emoji: '📊' },
  { path: '/admin/products', label: 'Products', icon: Box, emoji: '👗' },
  { path: '/admin/embroidery', label: 'Embroidery', icon: Scissors, emoji: '🧵' },
  { path: '/admin/orders', label: 'Orders', icon: Package, emoji: '📦' },
  { path: '/admin/users', label: 'Users', icon: Users, emoji: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, emoji: '📈' },
]

export function AdminLayout() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setDarkMode(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = async () => {
    await signOut()
    toast.success('Admin logged out! 👑')
    navigate('/login')
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-pink transition-colors duration-500">
      <div className="embroidery-pattern fixed inset-0 z-0 pointer-events-none" />
      
      <aside
        className={`fixed left-0 top-0 z-40 h-full bg-white/95 backdrop-blur-xl border-r border-pink-100 transition-all duration-500 ease-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        } md:w-72 md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-pink-100/50">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">👑</span>
              <span className="font-playfair font-bold text-pink-800 text-lg hidden md:block">
                Admin Panel
              </span>
            </motion.div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-pink-500 hover:bg-pink-100"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 overflow-y-auto" role="navigation" aria-label="Admin navigation">
            <ul className="space-y-1" role="list">
              {adminNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
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
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-3 border-t border-pink-100">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-3 rounded-xl font-poppins font-medium text-pink-600 hover:bg-pink-50 transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-xl" role="img" aria-hidden="true">🌸</span>
              <span className="hidden md:block">Back to User View</span>
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-poppins font-medium text-rose-500 hover:bg-rose-50 transition-all duration-300 mt-2"
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
        aria-label="Open admin menu"
      >
        <span className="text-xl">☰</span>
      </button>

      <main className="md:ml-72 min-h-screen transition-all duration-500">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-pink-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="font-playfair text-2xl font-bold text-pink-800">
                Thread & Bloom Admin
              </h1>
              <span className="px-3 py-1 bg-gradient-pink-dark text-white text-xs font-poppins font-medium rounded-full">
                ADMIN MODE
              </span>
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