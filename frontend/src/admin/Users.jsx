import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, User, Mail, Phone, MapPin, Shield, Ban, Edit, Trash2, Eye, MoreVertical, Download, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const mockUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', avatar: '👩', orders: 5, totalSpent: 8500, status: 'active', role: 'user', joined: '2023-06-15', lastActive: '2024-01-23', addresses: 2 },
  { id: 2, name: 'Anjali Patel', email: 'anjali@email.com', phone: '+91 87654 32109', avatar: '👩‍🦱', orders: 3, totalSpent: 4200, status: 'active', role: 'user', joined: '2023-08-22', lastActive: '2024-01-22', addresses: 1 },
  { id: 3, name: 'Kavya Reddy', email: 'kavya@email.com', phone: '+91 76543 21098', avatar: '👩', orders: 8, totalSpent: 15600, status: 'active', role: 'vip', joined: '2023-03-10', lastActive: '2024-01-23', addresses: 3 },
  { id: 4, name: 'Meera Singh', email: 'meera@email.com', phone: '+91 65432 10987', avatar: '👩‍🦰', orders: 1, totalSpent: 1299, status: 'active', role: 'user', joined: '2024-01-10', lastActive: '2024-01-20', addresses: 1 },
  { id: 5, name: 'Riya Gupta', email: 'riya@email.com', phone: '+91 54321 09876', avatar: '👩‍🦳', orders: 2, totalSpent: 3400, status: 'inactive', role: 'user', joined: '2023-11-05', lastActive: '2023-12-15', addresses: 1 },
  { id: 6, name: 'Sneha Kumar', email: 'sneha@email.com', phone: '+91 43210 98765', avatar: '👩', orders: 0, totalSpent: 0, status: 'new', role: 'user', joined: '2024-01-20', lastActive: '2024-01-20', addresses: 0 },
  { id: 7, name: 'Admin User', email: 'admin@threadbloom.com', phone: '+91 99999 99999', avatar: '👑', orders: 0, totalSpent: 0, status: 'active', role: 'admin', joined: '2023-01-01', lastActive: '2024-01-23', addresses: 0 },
]

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortBy, setSortBy] = useState('joined')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'orders': return b.orders - a.orders
      case 'spent': return b.totalSpent - a.totalSpent
      case 'joined': return new Date(b.joined) - new Date(a.joined)
      case 'active': return new Date(b.lastActive) - new Date(a.lastActive)
      default: return 0
    }
  })

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-100 text-green-700', icon: '🟢' }
      case 'inactive': return { label: 'Inactive', color: 'bg-gray-100 text-gray-700', icon: '⚪' }
      case 'new': return { label: 'New', color: 'bg-blue-100 text-blue-700', icon: '🔵' }
      case 'banned': return { label: 'Banned', color: 'bg-red-100 text-red-700', icon: '🔴' }
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: '⚪' }
    }
  }

  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin': return { label: 'Admin', color: 'bg-purple-100 text-purple-700', icon: '👑' }
      case 'vip': return { label: 'VIP', color: 'bg-amber-100 text-amber-700', icon: '⭐' }
      case 'user': return { label: 'User', color: 'bg-pink-100 text-pink-700', icon: '👤' }
      default: return { label: role, color: 'bg-gray-100 text-gray-700', icon: '❓' }
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-pink-dark bg-clip-text text-transparent">
            User Management 👥
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Manage customer accounts and roles ✨</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="card-elevated p-6 text-center bg-pink-50"
        >
          <p className="font-poppins text-sm text-pink-500">Total Users</p>
          <p className="font-playfair text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent mt-1">
            {mockUsers.filter(u => u.role !== 'admin').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="card-elevated p-6 text-center bg-green-50"
        >
          <p className="font-poppins text-sm text-green-600">Active Users</p>
          <p className="font-playfair text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mt-1">
            {mockUsers.filter(u => u.status === 'active').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="card-elevated p-6 text-center bg-amber-50"
        >
          <p className="font-poppins text-sm text-amber-600">VIP Customers</p>
          <p className="font-playfair text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mt-1">
            {mockUsers.filter(u => u.role === 'vip').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="card-elevated p-6 text-center bg-blue-50"
        >
          <p className="font-poppins text-sm text-blue-600">New This Month</p>
          <p className="font-playfair text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mt-1">
            {mockUsers.filter(u => new Date(u.joined) > new Date('2024-01-01')).length}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card-elevated p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-[150px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="new">New</option>
              <option value="banned">Banned</option>
            </select>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field max-w-[150px]">
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="vip">VIP</option>
              <option value="admin">Admin</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field max-w-[180px]">
              <option value="joined">Joined Date</option>
              <option value="name">Name</option>
              <option value="orders">Orders (High to Low)</option>
              <option value="spent">Total Spent (High to Low)</option>
              <option value="active">Last Active</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="card-elevated overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <p className="font-playfair font-bold text-pink-800">{user.name}</p>
                        <p className="font-poppins text-xs text-pink-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <p className="font-poppins text-sm text-pink-700">{user.email}</p>
                      <p className="font-poppins text-xs text-pink-500">{user.phone}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-poppins ${getRoleConfig(user.role).color}`}>
                      {getRoleConfig(user.role).icon} {getRoleConfig(user.role).label}
                    </span>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${getStatusConfig(user.status).color}`}>
                      {getStatusConfig(user.status).icon} {getStatusConfig(user.status).label}
                    </span>
                  </td>
                  <td className="font-poppins text-gray-600">{user.orders}</td>
                  <td className="font-playfair font-bold text-pink-700">₹{user.totalSpent.toLocaleString()}</td>
                  <td className="font-poppins text-sm text-pink-500">{user.joined}</td>
                  <td className="font-poppins text-sm text-pink-500">{user.lastActive}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg text-pink-500 hover:bg-pink-100" aria-label="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-pink-500 hover:bg-pink-100" aria-label="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button className="p-2 rounded-lg text-rose-500 hover:bg-rose-100" aria-label="Ban user">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedUsers.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="font-poppins text-pink-500">No users found</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">User Details - {selectedUser.name}</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 rounded-xl text-pink-500 hover:bg-pink-100">✕</button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <span className="text-6xl">{selectedUser.avatar}</span>
                  <div>
                    <h3 className="font-playfair text-2xl font-bold text-pink-800">{selectedUser.name}</h3>
                    <p className="font-poppins text-pink-500">{selectedUser.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins ${getRoleConfig(selectedUser.role).color}`}>
                        {getRoleConfig(selectedUser.role).icon} {getRoleConfig(selectedUser.role).label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-poppins ${getStatusConfig(selectedUser.status).color}`}>
                        {getStatusConfig(selectedUser.status).icon} {getStatusConfig(selectedUser.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-4 bg-pink-50 rounded-xl">
                  <div className="text-center">
                    <p className="font-poppins text-sm text-pink-500">Total Orders</p>
                    <p className="font-playfair text-2xl font-bold text-pink-700">{selectedUser.orders}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-poppins text-sm text-pink-500">Total Spent</p>
                    <p className="font-playfair text-2xl font-bold text-pink-700">₹{selectedUser.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-poppins text-sm text-pink-500">Avg Order Value</p>
                    <p className="font-playfair text-2xl font-bold text-pink-700">
                      ₹{selectedUser.orders > 0 ? Math.round(selectedUser.totalSpent / selectedUser.orders) : 0}
                    </p>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Account Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Member Since</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{new Date(selectedUser.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Last Active</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{new Date(selectedUser.lastActive).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Saved Addresses</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedUser.addresses}</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <p className="font-poppins text-sm text-pink-500">Phone</p>
                      <p className="font-playfair font-medium text-pink-800 mt-1">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h3 className="font-playfair text-lg font-bold text-pink-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Placed order', details: 'ORD-2024-001 - ₹2,198', time: '2 hours ago' },
                      { action: 'Added to cart', details: 'Floral Dream Anarkali', time: '1 day ago' },
                      { action: 'Saved design', details: 'My Custom Kurta', time: '3 days ago' },
                      { action: 'Updated profile', details: 'Changed phone number', time: '1 week ago' },
                    ].map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between p-3 bg-pink-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-pink-500" />
                          </div>
                          <div>
                            <p className="font-poppins font-medium text-pink-800">{activity.action}</p>
                            <p className="font-poppins text-sm text-pink-500">{activity.details}</p>
                          </div>
                        </div>
                        <p className="font-poppins text-xs text-pink-400">{activity.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}