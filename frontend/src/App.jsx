import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { DesignStudio } from './pages/DesignStudio'
import { MyCollection } from './pages/MyCollection'
import { Shop } from './pages/Shop'
import { Cart } from './pages/Cart'
import { Orders } from './pages/Orders'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import { AdminDashboard } from './admin/Dashboard'
import { AdminProducts } from './admin/Products'
import { AdminEmbroidery } from './admin/Embroidery'
import { AdminOrders } from './admin/Orders'
import { AdminUsers } from './admin/Users'
import { AdminAnalytics } from './admin/Analytics'
import { Preview3D } from './pages/Preview3D'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  
  return children
}

function AdminRoute({ children }) {
  return <ProtectedRoute adminOnly>{children}</ProtectedRoute>
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/design-studio" element={<ProtectedRoute><DesignStudio /></ProtectedRoute>} />
        <Route path="/preview-3d" element={<ProtectedRoute><Preview3D /></ProtectedRoute>} />
        <Route path="/my-collection" element={<ProtectedRoute><MyCollection /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/embroidery" element={<AdminRoute><AdminEmbroidery /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}