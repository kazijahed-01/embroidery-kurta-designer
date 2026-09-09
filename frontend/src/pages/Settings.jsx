import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Moon, Sun, Bell, Shield, Globe, Palette, Trash2, Download, Key, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function Settings() {
  const { user, updateProfile } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    orders: true,
    promotions: false,
    designUpdates: true,
    weeklyDigest: false,
  })
  const [language, setLanguage] = useState('en')
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false })

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) {
      const parsed = JSON.parse(saved)
      setDarkMode(parsed)
      if (parsed) document.documentElement.classList.add('dark')
    }
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

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success(`${key} notifications ${!notifications[key] ? 'enabled' : 'disabled'} ✨`, { emoji: true })
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match 🔒', { emoji: true })
      return
    }
    if (passwordData.new.length < 6) {
      toast.error('Password must be at least 6 characters 🔒', { emoji: true })
      return
    }
    // In real app, call update password API
    toast.success('Password updated successfully! 🔒', { emoji: true })
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone. 😢')) {
      if (confirm('This will permanently delete all your designs, orders, and data. Continue?')) {
        toast.success('Account deletion requested. We\'ll miss you! 👋', { emoji: true })
        // In real app, call delete account API
      }
    }
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  ]

  const sections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize how Thread & Bloom looks'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and account security'
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: Globe,
      description: 'Set your preferred language'
    },
    {
      id: 'data',
      title: 'Data & Storage',
      icon: Download,
      description: 'Manage your data and account'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
          Settings ⚙️
        </h1>
        <p className="font-poppins text-pink-500 mt-1">Customize your Thread & Bloom experience ✨</p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold text-pink-800">{section.title}</h2>
                <p className="font-poppins text-sm text-pink-500">{section.description}</p>
              </div>
            </div>

            {section.id === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-playfair font-medium text-pink-800">Dark Mode</p>
                      <p className="font-poppins text-sm text-pink-500">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-gradient-pink-dark' : 'bg-pink-200'
                    }`}
                    role="switch"
                    aria-checked={darkMode}
                  >
                    <motion.div
                      animate={{ x: darkMode ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
                    >
                      {darkMode ? <Moon className="w-4 h-4 text-pink-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                    </motion.div>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h3 className="font-playfair font-medium text-pink-800 mb-3">Theme Preview</h3>
                    <div className={`rounded-lg p-4 text-center transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <p className={`font-poppins ${darkMode ? 'text-white' : 'text-gray-800'}`}>This is how content looks</p>
                      <div className={`mt-2 px-4 py-2 rounded-full text-sm font-poppins font-medium ${darkMode ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'}`}>
                        Sample Button
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h3 className="font-playfair font-medium text-pink-800 mb-3">Accent Color</h3>
                    <div className="flex gap-2">
                      {['#ec4899', '#f43f5e', '#9333ea', '#0d9488', '#f59e0b'].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-3 transition-all ${color === '#ec4899' ? 'border-white ring-2 ring-pink-400' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: color }}
                          aria-label={`Accent color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section.id === 'notifications' && (
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <Bell className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <p className="font-playfair font-medium text-pink-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="font-poppins text-sm text-pink-500">
                          {key === 'email' && 'Receive email notifications'}
                          {key === 'push' && 'Receive push notifications'}
                          {key === 'orders' && 'Updates on your orders'}
                          {key === 'promotions' && 'Special offers and discounts'}
                          {key === 'designUpdates' && 'New embroidery designs added'}
                          {key === 'weeklyDigest' && 'Weekly summary of activity'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                        value ? 'bg-gradient-pink-dark' : 'bg-pink-200'
                      }`}
                      role="switch"
                      aria-checked={value}
                    >
                      <motion.div
                        animate={{ x: value ? 24 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {section.id === 'privacy' && (
              <div className="space-y-4">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="font-playfair font-bold text-pink-800 mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Change Password
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="input-label">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.current ? 'text' : 'password'}
                          value={passwordData.current}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                          className="input-field pr-10"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-9 text-pink-400 hover:text-pink-600"
                        >
                          {showPassword.current ? '👁️' : '🔒'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="input-label">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          className="input-field pr-10"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-9 text-pink-400 hover:text-pink-600"
                        >
                          {showPassword.new ? '👁️' : '🔒'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          className="input-field pr-10"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-9 text-pink-400 hover:text-pink-600"
                        >
                          {showPassword.confirm ? '👁️' : '🔒'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    <Key className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                </form>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair font-bold text-pink-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'profileVisibility', label: 'Profile Visibility', desc: 'Allow others to see your profile', default: true },
                      { key: 'designSharing', label: 'Design Sharing', desc: 'Allow your designs to be featured', default: false },
                      { key: 'analytics', label: 'Analytics', desc: 'Help improve Thread & Bloom with usage data', default: true },
                      { key: 'marketing', label: 'Marketing Emails', desc: 'Receive promotional emails', default: false },
                    ].map((item) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-pink-50 rounded-xl"
                      >
                        <div>
                          <p className="font-playfair font-medium text-pink-800">{item.label}</p>
                          <p className="font-poppins text-sm text-pink-500">{item.desc}</p>
                        </div>
                        <button
                          className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${item.default ? 'bg-gradient-pink-dark' : 'bg-pink-200'}`}
                          role="switch"
                          aria-checked={item.default}
                        >
                          <motion.div
                            animate={{ x: item.default ? 24 : 3 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
                          />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section.id === 'language' && (
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 rounded-xl">
                  <label className="input-label">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field max-w-xs"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h3 className="font-playfair font-medium text-pink-800 mb-3">Currency</h3>
                    <select className="input-field max-w-xs">
                      <option value="INR">₹ Indian Rupee (INR)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                      <option value="GBP">£ British Pound (GBP)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <h3 className="font-playfair font-medium text-pink-800 mb-3">Date Format</h3>
                    <select className="input-field max-w-xs">
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {section.id === 'data' && (
              <div className="space-y-6">
                <div className="p-4 bg-pink-50 rounded-xl">
                  <h3 className="font-playfair font-bold text-pink-800 mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Your Data
                  </h3>
                  <p className="font-poppins text-pink-600 mb-4">Download a copy of all your data including designs, orders, and preferences.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data (JSON)
                    </button>
                    <button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data (CSV)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <h3 className="font-playfair font-bold text-rose-800 mb-3 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="font-poppins text-rose-600 mb-4">Once you delete your account, there is no going back. All your designs, orders, and data will be permanently removed.</p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn-secondary text-rose-500 border-rose-200 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete My Account
                  </button>
                </div>

                <div className="p-4 bg-pink-50 rounded-xl">
                  <h3 className="font-playfair font-bold text-pink-800 mb-3">App Version</h3>
                  <p className="font-poppins text-pink-600">Thread & Bloom v1.0.0</p>
                  <p className="font-poppins text-xs text-pink-400 mt-1">Built with 💖 for embroidery lovers</p>
                </div>
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </div>
  )
}