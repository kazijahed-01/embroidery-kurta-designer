import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Eye, Image, Download, Upload, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const mockProducts = [
  { id: 1, name: 'Floral Dream Anarkali', style: 'Anarkali', fabric: 'Silk', price: 1299, embroideryPrice: 250, status: 'active', image: '🌸', sales: 156, createdAt: '2024-01-10' },
  { id: 2, name: 'Royal Paisley Straight', style: 'Straight Kurta', fabric: 'Chanderi', price: 1499, embroideryPrice: 300, status: 'active', image: '🌿', sales: 98, createdAt: '2024-01-08' },
  { id: 3, name: 'Minimalist Chic Western', style: 'Western Kurti', fabric: 'Cotton', price: 899, embroideryPrice: 150, status: 'active', image: '✨', sales: 124, createdAt: '2024-01-12' },
  { id: 4, name: 'Bridal Bloom Long Kurta', style: 'Long Kurta', fabric: 'Silk', price: 2199, embroideryPrice: 500, status: 'active', image: '💎', sales: 67, createdAt: '2024-01-05' },
  { id: 5, name: 'Cotton Comfort Straight', style: 'Straight Kurta', fabric: 'Cotton', price: 799, embroideryPrice: 250, status: 'draft', image: '🌿', sales: 234, createdAt: '2023-12-28' },
  { id: 6, name: 'Silk Elegance A-Line', style: 'A-Line', fabric: 'Silk', price: 1299, embroideryPrice: 200, status: 'active', image: '✨', sales: 89, createdAt: '2024-01-15' },
  { id: 7, name: 'Linen Breeze Short', style: 'Short Kurti', fabric: 'Linen', price: 899, embroideryPrice: 150, status: 'archived', image: '🌊', sales: 112, createdAt: '2023-11-20' },
  { id: 8, name: 'Chanderi Grace Long', style: 'Long Kurta', fabric: 'Chanderi', price: 1199, embroideryPrice: 350, status: 'active', image: '👑', sales: 76, createdAt: '2024-01-03' },
]

const styles = ['Straight Kurta', 'Anarkali', 'A-Line', 'Short Kurti', 'Long Kurta', 'Western Kurti']
const fabrics = ['Cotton', 'Silk', 'Linen', 'Chanderi', 'Rayon']
const statuses = ['active', 'draft', 'archived']

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [styleFilter, setStyleFilter] = useState('all')
  const [fabricFilter, setFabricFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    style: '',
    fabric: '',
    basePrice: '',
    embroideryPrice: '',
    description: '',
    colors: [],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isActive: true,
    images: []
  })

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.style.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesStyle = styleFilter === 'all' || product.style === styleFilter
    const matchesFabric = fabricFilter === 'all' || product.fabric === fabricFilter
    return matchesSearch && matchesStatus && matchesStyle && matchesFabric
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      style: '',
      fabric: '',
      basePrice: '',
      embroideryPrice: '',
      description: '',
      colors: [],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      isActive: true,
      images: []
    })
    setShowModal(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      style: product.style,
      fabric: product.fabric,
      basePrice: product.price,
      embroideryPrice: product.embroideryPrice,
      description: '',
      colors: [],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      isActive: product.status === 'active',
      images: []
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.style || !formData.fabric || !formData.basePrice) {
      toast.error('Please fill all required fields 😢', { emoji: true })
      return
    }
    toast.success(editingProduct ? 'Product updated! ✨' : 'Product added! ✨', { emoji: true })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this product? 😢')) {
      toast.success('Product deleted 🗑️', { emoji: true })
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-100 text-green-700', icon: '✅' }
      case 'draft': return { label: 'Draft', color: 'bg-yellow-100 text-yellow-700', icon: '📝' }
      case 'archived': return { label: 'Archived', color: 'bg-gray-100 text-gray-700', icon: '📦' }
      default: return { label: status, color: 'bg-gray-100 text-gray-700', icon: '❓' }
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
            Products 👗
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Manage your kurta catalog ✨</p>
        </div>
        <button onClick={handleAddProduct} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
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
              placeholder="Search products..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-[150px]">
              <option value="all">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} className="input-field max-w-[180px]">
              <option value="all">All Styles</option>
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={fabricFilter} onChange={(e) => setFabricFilter(e.target.value)} className="input-field max-w-[150px]">
              <option value="all">All Fabrics</option>
              {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="flex gap-2 ml-auto">
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
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
                <th>Product</th>
                <th>Style</th>
                <th>Fabric</th>
                <th>Base Price</th>
                <th>Embroidery</th>
                <th>Status</th>
                <th>Sales</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <p className="font-playfair font-bold text-pink-800">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-poppins text-pink-700">{product.style}</td>
                  <td className="font-poppins text-pink-700">{product.fabric}</td>
                  <td className="font-playfair font-bold text-pink-700">₹{product.price}</td>
                  <td className="font-poppins text-pink-600">+₹{product.embroideryPrice}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${getStatusConfig(product.status).color}`}>
                      {getStatusConfig(product.status).icon} {getStatusConfig(product.status).label}
                    </span>
                  </td>
                  <td className="font-poppins text-gray-600">{product.sales}</td>
                  <td className="font-poppins text-sm text-pink-500">{product.createdAt}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-pink-500 hover:bg-pink-100" aria-label="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-100" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="font-poppins text-pink-500">No products found</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-pink-100 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold text-pink-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-pink-500 hover:bg-pink-100">✕</button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Product Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="e.g., Floral Dream Anarkali" required />
                  </div>
                  <div>
                    <label className="input-label">Style *</label>
                    <select value={formData.style} onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))} className="input-field" required>
                      <option value="">Select style</option>
                      {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Fabric *</label>
                    <select value={formData.fabric} onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))} className="input-field" required>
                      <option value="">Select fabric</option>
                      {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select value={formData.isActive ? 'active' : 'draft'} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))} className="input-field">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Base Price (₹) *</label>
                    <input type="number" value={formData.basePrice} onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))} className="input-field" placeholder="799" required min="0" />
                  </div>
                  <div>
                    <label className="input-label">Embroidery Price (₹) *</label>
                    <input type="number" value={formData.embroideryPrice} onChange={(e) => setFormData(prev => ({ ...prev, embroideryPrice: e.target.value }))} className="input-field" placeholder="250" required min="0" />
                  </div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="input-field min-h-[100px] resize-y" placeholder="Describe this kurta design..." />
                </div>

                <div>
                  <label className="input-label">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((size) => (
                      <label key={size} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.sizes.includes(size)} onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.checked ? [...prev.sizes, size] : prev.sizes.filter(s => s !== size) }))} className="w-4 h-4 text-pink-500 rounded border-pink-300" />
                        <span className="font-poppins text-sm text-pink-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Product Images</label>
                  <div className="flex gap-3">
                    <div className="w-24 h-32 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center text-pink-400">
                      <Upload className="w-8 h-8 mb-1" />
                      <span className="text-xs">Add Image</span>
                      <input type="file" accept="image/*" multiple className="hidden" />
                    </div>
                    <span className="font-poppins text-sm text-pink-500 self-center">Upload multiple images for 360° view</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-pink-100">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}