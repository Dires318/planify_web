import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/axios'

interface Category {
  id: number
  name: string
  color_hex: string
}

interface CategoryManagerProps {
  categories: Category[]
  onCategoryAdded: () => void
  onCategoryUpdated: () => void
  onCategoryDeleted: () => void
}

const COLOR_OPTIONS = [
  '#FFB74D', // Orange
  '#4FC3F7', // Blue
  '#81C784', // Green
  '#FF8A65', // Coral
  '#BA68C8', // Purple
  '#FFD54F', // Yellow
  '#4DD0E1', // Cyan
  '#FF8A80', // Red
]

export default function CategoryManager({
  categories,
  onCategoryAdded,
  onCategoryUpdated,
  onCategoryDeleted,
}: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_OPTIONS[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory.id}/`, {
          name,
          color_hex: color,
        })
        onCategoryUpdated()
      } else {
        await api.post('/api/categories/', {
          name,
          color_hex: color,
        })
        onCategoryAdded()
      }
      handleClose()
    } catch (error) {
      console.error('Failed to save category:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setColor(category.color_hex)
    setIsModalOpen(true)
  }

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/api/categories/${categoryId}/`)
        onCategoryDeleted()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setName('')
    setColor(COLOR_OPTIONS[0])
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map(category => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color_hex }}
              />
              <span className="text-gray-700">{category.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1 text-gray-500 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_OPTIONS.map((colorOption) => (
                        <button
                          key={colorOption}
                          type="button"
                          onClick={() => setColor(colorOption)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            color === colorOption
                              ? 'border-blue-500 scale-110'
                              : 'border-transparent hover:scale-110'
                          }`}
                          style={{ backgroundColor: colorOption }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {editingCategory ? 'Save Changes' : 'Add Category'}
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