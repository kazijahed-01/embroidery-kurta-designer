import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, Image, Upload, Tag, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

const mockEmbroidery = [
  { id: 1, name: 'Floral Garden', category: 'Nature', price: 250, positions: ['neck', 'chest', 'sleeves', 'front', 'back', 'bottom'], image: '🌸', status: 'active', usage: 1245 },
  { id: 2, name: 'Royal Paisley', category: 'Traditional', price: 300, positions: ['neck', 'chest', 'front', 'back'], image: '🌿', status: 'active', usage: 892 },
  { id: 3, name: 'Modern Geometry', category: 'Modern', price: 200, positions: ['chest', 'sleeves', 'front', 'bottom'], image: '🔷', status: 'active', usage: 567 },
  { id: 4, name: 'Heritage Traditional', category: 'Heritage', price: 350, positions: ['neck', 'chest', 'front', 'back', 'sleeves'], image: '🏛️', status: 'active', usage: 445 },
  { id: 5, name: 'Minimal Line Art', category: 'Contemporary', price: 150, positions: ['neck', 'chest', 'sleeves', 'bottom'], image: '✨', status: 'active', usage: 789 },
  { id: 6, name: 'Bridal Splendor', category: 'Premium', price: 500, positions: ['neck', 'chest', 'front', 'back', 'sleeves', 'bottom'], image: '💎', status: 'active', usage: 234 },
  { id: 7, name: 'Peacock Majesty', category: 'Nature', price: 400, positions: ['back', 'front', 'chest'], image: '🦚', status: 'draft', usage: 0 },
  { id: 8, name: 'Butterfly Dreams', category: 'Nature', price: 300, positions: ['sleeves', 'chest', 'bottom'], image: '🦋', status: 'draft', usage: 0 },
  { id: 9, name: 'Mandala Magic', category: 'Spiritual', price: 350, positions: ['back', 'front', 'chest'], image: '🕉️', status: 'archived', usage: 156 },
  { id: 10, name: 'Zari Gold Work', category: 'Premium', price: 450, positions: ['neck', 'chest', 'sleeves', 'front', 'back'], image: '✨', status: 'active', usage: 312 },
]

const categories = ['Nature', 'Traditional', 'Modern', 'Heritage', 'Contemporary', 'Premium', 'Spiritual']
const allPositions = ['neck', 'chest', 'sleeves', 'front', 'back', 'bottom']
const positionLabels = { neck: 'Neck', chest: 'Chest', sleeves: 'Sleeves', front: 'Front', back: 'Back', bottom: 'Bottom' }

export function AdminEmbroidery() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingDesign, setEditingDesign] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    positions: [],
    description: '',
    tags: [],
    isActive: true,
    image: ''
  })

  const filteredDesigns = mockEmbroidery.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || design.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || design.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddDesign = () => {
    setEditingDesign(null)
    setFormData({
      name: '',
      category: '',
      price: '',
      positions: [],
      description: '',
      tags: [],
      isActive: true,
      image: ''
    })
    setShowModal(true)
  }

  const handleEdit = (design) => {
    setEditingDesign(design)
    setFormData({
      name: design.name,
      category: design.category,
      price: design.price,
      positions: [...design.positions],
      description: '',
      tags: [],
      isActive: design.status === 'active',
      image: design.image
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price || formData.positions.length === 0) {
      toast.error('Please fill all required fields 😢', { emoji: true })
      return
    }
    toast.success(editingDesign ? 'Design updated! ✨' : 'Design added! ✨', { emoji: true })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this embroidery design? 😢')) {
      toast.success('Design deleted 🗑️', { emoji: true })
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-100 text-green-700' }
      case 'draft': return { label: 'Draft', color: 'bg-yellow-100 text-yellow-700' }
      case 'archived': return { label: 'Archived', color: 'bg-gray-100 text-gray-700' }
      default: return { label: status, color: 'bg-gray-100 text-gray-700' }
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
            Embroidery Designs 🧵
          </h1>
          <p className="font-poppins text-pink-500 mt-1">Manage embroidery patterns and pricing ✨</p>
        </div>
        <button onClick={handleAddDesign} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Design
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
              placeholder="Search designs..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field max-w-[180px]">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field max-w-[150px]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredDesigns.map((design, i) => (
          <motion.article
            key={design.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="card-elevated overflow-hidden"
          >
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center relative">
              <span className="text-5xl">{design.image}</span>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-poppins ${getStatusConfig(design.status).color}`}>
                  {getStatusConfig(design.status).label}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-playfair font-bold text-pink-800 mb-1">{design.name}</h3>
              <p className="font-poppins text-sm text-pink-500 mb-2">{design.category}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {design.positions.map(pos => (
                  <span key={pos} className="badge badge-pink text-xs">{positionLabels[pos]}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-playfair font-bold text-pink-700">₹{design.price}</p>
                  <p className="font-poppins text-xs text-pink-400">{design.usage} uses</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(design)} className="p-2 rounded-lg text-pink-500 hover:bg-pink-100" aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(design.id)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-100" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
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
                <h2 className="font-playfair text-2xl font-bold text-pink-800">{editingDesign ? 'Edit Design' : 'Add New Embroidery Design'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-pink-500 hover:bg-pink-100">✕</button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Design Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="e.g., Floral Garden" required />
                  </div>
                  <div>
                    <label className="input-label">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} className="input-field" required>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Price (₹) *</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} className="input-field" placeholder="250" required min="0" />
                  </div>
                  <div>
                    <label className="input-label">Status</label>
                    <select value={formData.isActive ? 'active' : 'draft'} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))} className="input-field">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">Available Positions *</label>
                  <div className="flex flex-wrap gap-2">
                    {allPositions.map(pos => (
                      <label key={pos} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.positions.includes(pos)}
                          onChange={(e) => setFormData(prev => ({ ...prev, positions: e.target.checked ? [...prev.positions, pos] : prev.positions.filter(p => p !== pos) }))}
                          className="w-4 h-4 text-pink-500 rounded border-pink-300"
                        />
                        <span className="font-poppins text-sm text-pink-700 capitalize">{pos}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="input-field min-h-[100px] resize-y" placeholder="Describe this embroidery pattern..." />
                </div>

                <div>
                  <label className="input-label">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {['floral', 'traditional', 'modern', 'bridal', 'minimal', 'nature', 'geometric', 'premium'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.tags.includes(tag)} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.checked ? [...prev.tags, tag] : prev.tags.filter(t => t !== tag) }))} className="w-4 h-4 text-pink-500 rounded border-pink-300" />
                        <span className="font-poppins text-sm text-pink-700 capitalize">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Design Preview Image</label>
                  <div className="flex gap-3">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center text-pink-400">
                      <Image className="w-8 h-8 mb-1" />
                      <span className="text-xs">Upload</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </div>
                    <span className="font-poppins text-sm text-pink-500 self-center">SVG or PNG format recommended</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-pink-100">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingDesign ? 'Update Design' : 'Create Design'}
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