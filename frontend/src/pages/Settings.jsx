import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Palette,
  Trash2,
  Download,
  Key
} from 'lucide-react'
import toast from 'react-hot-toast'

const defaultPreferences = {
  darkMode: false,
  accentColor: '#ec4899',
  language: 'en',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    email: true,
    push: true,
    orders: true,
    promotions: false,
    designUpdates: true,
    weeklyDigest: false
  },
  privacy: {
    profileVisibility: true,
    designSharing: false,
    analytics: true,
    marketing: false
  }
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' }
]

function Toggle({ enabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-gradient-pink-dark' : 'bg-pink-200'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
      />
    </button>
  )
}

function PreferenceRow({ title, description, icon: Icon, enabled, onClick }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-pink-50 rounded-xl">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <Icon className="w-5 h-5 text-pink-500" />
          </div>
        )}

        <div>
          <p className="font-playfair font-medium text-pink-800">{title}</p>
          <p className="font-poppins text-sm text-pink-500">{description}</p>
        </div>
      </div>

      <Toggle enabled={enabled} onClick={onClick} />
    </div>
  )
}

export function Settings() {
  const { user } = useAuth()

  const [preferences, setPreferences] = useState(defaultPreferences)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const applyAppearance = (darkMode, accentColor) => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.style.setProperty('--user-accent-color', accentColor)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }

  const loadPreferences = async () => {
    const localDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false')

    if (!user) {
      const localPreferences = {
        ...defaultPreferences,
        darkMode: localDarkMode
      }

      setPreferences(localPreferences)
      applyAppearance(
        localPreferences.darkMode,
        localPreferences.accentColor
      )
      return
    }

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'preferences')
      .maybeSingle()

    if (error) {
      console.error('Could not load preferences:', error)
    }

    const saved = data?.value || {}

    const loadedPreferences = {
      ...defaultPreferences,
      ...saved,
      darkMode:
        typeof saved.darkMode === 'boolean'
          ? saved.darkMode
          : localDarkMode,
      notifications: {
        ...defaultPreferences.notifications,
        ...(saved.notifications || {})
      },
      privacy: {
        ...defaultPreferences.privacy,
        ...(saved.privacy || {})
      }
    }

    setPreferences(loadedPreferences)
    applyAppearance(
      loadedPreferences.darkMode,
      loadedPreferences.accentColor
    )
  }

  useEffect(() => {
    loadPreferences()
  }, [user])

  const savePreferences = async (nextPreferences) => {
    setPreferences(nextPreferences)

    applyAppearance(
      nextPreferences.darkMode,
      nextPreferences.accentColor
    )

    if (!user) return

    const { error } = await supabase
      .from('settings')
      .upsert(
        {
          user_id: user.id,
          key: 'preferences',
          value: nextPreferences
        },
        {
          onConflict: 'user_id,key'
        }
      )

    if (error) {
      console.error('Could not save preferences:', error)
      toast.error('Could not save setting 😢', { emoji: true })
    }
  }

  const toggleDarkMode = () => {
    const nextPreferences = {
      ...preferences,
      darkMode: !preferences.darkMode
    }

    savePreferences(nextPreferences)
    toast.success(
      `${nextPreferences.darkMode ? 'Dark' : 'Light'} mode enabled ✨`,
      { emoji: true }
    )
  }

  const changeAccentColor = (accentColor) => {
    savePreferences({
      ...preferences,
      accentColor
    })

    toast.success('Accent color saved! 🎨', { emoji: true })
  }

  const toggleNotification = (key) => {
    const enabled = !preferences.notifications[key]

    savePreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: enabled
      }
    })

    toast.success(
      `${key.replace(/([A-Z])/g, ' $1')} notifications ${
        enabled ? 'enabled' : 'disabled'
      } ✨`,
      { emoji: true }
    )
  }

  const togglePrivacy = (key) => {
    const enabled = !preferences.privacy[key]

    savePreferences({
      ...preferences,
      privacy: {
        ...preferences.privacy,
        [key]: enabled
      }
    })

    toast.success('Privacy preference saved! 🔒', { emoji: true })
  }

  const updateSimplePreference = (key, value) => {
    savePreferences({
      ...preferences,
      [key]: value
    })

    toast.success('Preference saved! ✨', { emoji: true })
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()

    if (!user?.email) {
      toast.error('Your email address is not available 😢', { emoji: true })
      return
    }

    if (!passwordData.current) {
      toast.error('Enter your current password 🔒', { emoji: true })
      return
    }

    if (passwordData.new.length < 6) {
      toast.error('Password must be at least 6 characters 🔒', {
        emoji: true
      })
      return
    }

    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match 🔒', { emoji: true })
      return
    }

    const { error: verificationError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.current
      })

    if (verificationError) {
      toast.error('Your current password is incorrect 🔒', { emoji: true })
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.new
    })

    if (error) {
      console.error(error)
      toast.error('Could not update password 😢', { emoji: true })
      return
    }

    setPasswordData({
      current: '',
      new: '',
      confirm: ''
    })

    toast.success('Password updated successfully! 🔒', { emoji: true })
  }

  const handleExportData = async (format) => {
    if (!user) return

    const [designsResult, ordersResult, addressesResult] = await Promise.all([
      supabase.from('user_designs').select('*').eq('user_id', user.id),
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id),
      supabase.from('addresses').select('*').eq('user_id', user.id)
    ])

    const error =
      designsResult.error || ordersResult.error || addressesResult.error

    if (error) {
      console.error(error)
      toast.error('Could not export your data 😢', { emoji: true })
      return
    }

    const designs = designsResult.data || []
    const orders = ordersResult.data || []
    const addresses = addressesResult.data || []

    let content
    let type
    let filename

    if (format === 'json') {
      content = JSON.stringify(
        {
          exported_at: new Date().toISOString(),
          profile: {
            id: user.id,
            email: user.email
          },
          preferences,
          designs,
          orders,
          addresses
        },
        null,
        2
      )

      type = 'application/json'
      filename = 'thread-and-bloom-data.json'
    } else {
      const escapeCsv = (value) =>
        `"${String(value ?? '').replace(/"/g, '""')}"`

      const rows = [
        ['Type', 'Name / Order Number', 'Details', 'Date'],
        ...designs.map((design) => [
          'Design',
          design.name,
          `${design.kurta_style} - ${design.fabric}`,
          design.created_at
        ]),
        ...orders.map((order) => [
          'Order',
          order.order_number,
          `₹${order.total} - ${order.status}`,
          order.created_at
        ]),
        ...addresses.map((address) => [
          'Address',
          address.label,
          `${address.city}, ${address.state} - ${address.pincode}`,
          address.created_at
        ])
      ]

      content = rows.map((row) => row.map(escapeCsv).join(',')).join('\n')
      type = 'text/csv'
      filename = 'thread-and-bloom-data.csv'
    }

    const file = new Blob([content], { type })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)

    toast.success('Your data download has started! 📥', { emoji: true })
  }

  const handleDeleteAccount = () => {
    toast.error(
      'Account deletion needs a secure backend function. We will add it later.',
      { emoji: true }
    )
  }

  const notificationDetails = [
    ['email', 'Email', 'Receive email notifications'],
    ['push', 'Push', 'Receive push notifications'],
    ['orders', 'Order Updates', 'Updates about your orders'],
    ['promotions', 'Promotions', 'Special offers and discounts'],
    ['designUpdates', 'Design Updates', 'New embroidery designs'],
    ['weeklyDigest', 'Weekly Digest', 'Weekly activity summary']
  ]

  const privacyDetails = [
    [
      'profileVisibility',
      'Profile Visibility',
      'Allow others to see your profile'
    ],
    [
      'designSharing',
      'Design Sharing',
      'Allow your designs to be featured'
    ],
    ['analytics', 'Analytics', 'Help improve the app with usage data'],
    ['marketing', 'Marketing Emails', 'Receive promotional emails']
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
        <p className="font-poppins text-pink-500 mt-1">
          Customize your Thread & Bloom experience ✨
        </p>
      </motion.div>

      <div className="space-y-6">
        <section className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-pink-800">
                Appearance
              </h2>
              <p className="font-poppins text-sm text-pink-500">
                Customize how Thread & Bloom looks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <PreferenceRow
              title="Dark Mode"
              description="Switch between light and dark theme"
              icon={preferences.darkMode ? Moon : Sun}
              enabled={preferences.darkMode}
              onClick={toggleDarkMode}
            />

            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="font-playfair font-medium text-pink-800 mb-3">
                Accent Color
              </p>

              <div className="flex flex-wrap gap-3">
                {['#ec4899', '#f43f5e', '#9333ea', '#0d9488', '#f59e0b'].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => changeAccentColor(color)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        preferences.accentColor === color
                          ? 'ring-4 ring-pink-300 scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set accent color ${color}`}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-pink-800">
                Notifications
              </h2>
              <p className="font-poppins text-sm text-pink-500">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notificationDetails.map(([key, title, description]) => (
              <PreferenceRow
                key={key}
                title={title}
                description={description}
                icon={Bell}
                enabled={preferences.notifications[key]}
                onClick={() => toggleNotification(key)}
              />
            ))}
          </div>
        </section>

        <section className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-pink-800">
                Privacy & Security
              </h2>
              <p className="font-poppins text-sm text-pink-500">
                Control your data and account security
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="font-playfair font-bold text-pink-800 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Change Password
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                ['current', 'Current Password'],
                ['new', 'New Password'],
                ['confirm', 'Confirm New Password']
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword[key] ? 'text' : 'password'}
                      value={passwordData[key]}
                      onChange={(event) =>
                        setPasswordData({
                          ...passwordData,
                          [key]: event.target.value
                        })
                      }
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [key]: !showPassword[key]
                        })
                      }
                      className="absolute right-3 top-2.5 text-pink-400"
                    >
                      {showPassword[key] ? '👁️' : '🔒'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary">
              <Key className="w-4 h-4 mr-2" />
              Update Password
            </button>
          </form>

          <div className="border-t border-pink-100 mt-6 pt-6 space-y-3">
            <h3 className="font-playfair font-bold text-pink-800">
              Privacy Preferences
            </h3>

            {privacyDetails.map(([key, title, description]) => (
              <PreferenceRow
                key={key}
                title={title}
                description={description}
                icon={Shield}
                enabled={preferences.privacy[key]}
                onClick={() => togglePrivacy(key)}
              />
            ))}
          </div>
        </section>

        <section className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-pink-800">
                Language & Region
              </h2>
              <p className="font-poppins text-sm text-pink-500">
                Set your preferred language and region
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-pink-50 rounded-xl">
              <label className="input-label">Preferred Language</label>
              <select
                value={preferences.language}
                onChange={(event) =>
                  updateSimplePreference('language', event.target.value)
                }
                className="input-field"
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.flag} {language.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-pink-50 rounded-xl">
              <label className="input-label">Currency</label>
              <select
                value={preferences.currency}
                onChange={(event) =>
                  updateSimplePreference('currency', event.target.value)
                }
                className="input-field"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
              </select>
            </div>

            <div className="p-4 bg-pink-50 rounded-xl">
              <label className="input-label">Date Format</label>
              <select
                value={preferences.dateFormat}
                onChange={(event) =>
                  updateSimplePreference('dateFormat', event.target.value)
                }
                className="input-field"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </section>

        <section className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-pink-dark flex items-center justify-center text-white">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-pink-800">
                Data & Storage
              </h2>
              <p className="font-poppins text-sm text-pink-500">
                Download a copy of your saved data
              </p>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-xl">
            <p className="font-poppins text-pink-600 mb-4">
              Export your designs, orders, saved addresses, and preferences.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExportData('json')}
                className="btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </button>

              <button
                onClick={() => handleExportData('csv')}
                className="btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
            <h3 className="font-playfair font-bold text-rose-800 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="font-poppins text-sm text-rose-600 mb-4">
              Account deletion needs a secure backend function, so it is not
              enabled from the frontend yet.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="btn-secondary text-rose-500 border-rose-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}