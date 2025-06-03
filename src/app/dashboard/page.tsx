'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import AddTaskModal from '@/components/AddTaskModal'
import UserProfileDropdown from '@/components/UserProfileDropdown'
import Mascot from '@/components/Mascot'
import Confetti from '@/components/Confetti'
import CategoryManager from '@/components/CategoryManager'
import { format } from 'date-fns'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

interface Task {
  id: number
  title: string
  description: string
  due_date: string
  status: 'pending' | 'completed' | 'snoozed'
  priority: 'low' | 'medium' | 'high'
  category: number
}

interface Category {
  id: number
  name: string
  color_hex: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all')
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks/')
      setTasks(response.data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/user/')
        setUser(response.data)
        
        // Fetch tasks and categories
        const [tasksResponse, categoriesResponse] = await Promise.all([
          api.get('/api/tasks/'),
          api.get('/api/categories/')
        ])
        
        setTasks(tasksResponse.data)
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleTaskComplete = async (taskId: number, completed: boolean) => {
    try {
      await api.post(`/api/tasks/${taskId}/complete/`)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      fetchTasks()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return task.status === 'pending'
    if (activeTab === 'completed') return task.status === 'completed'
    return true
  })

  const handleCategoryAdded = () => {
    fetchCategories()
  }

  const handleCategoryUpdated = () => {
    fetchCategories()
  }

  const handleCategoryDeleted = () => {
    fetchCategories()
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories/')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Confetti isActive={showConfetti} />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MyPlanJoy</h1>
            </div>
            <div className="flex items-center">
              {user && <UserProfileDropdown user={user} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Greeting Banner */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-4 w-full">
              <Mascot type="fox" mood="happy" />
              <div className="text-center sm:text-left w-full">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 leading-tight">
                  {getGreeting()}
                  {user?.first_name ? `, ${user.first_name}` : ''}! Ready to rock your day?
                </h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-full self-center sm:self-auto">
              <span className="text-orange-600 text-base">🔥</span>
              <span className="text-orange-600 font-medium text-xs sm:text-base">{streak}-day streak!</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryManager
              categories={categories}
              onCategoryAdded={handleCategoryAdded}
              onCategoryUpdated={handleCategoryUpdated}
              onCategoryDeleted={handleCategoryDeleted}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm">
              {/* Task Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex -mb-px">
                  {(['all', 'pending', 'completed'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task List */}
              <div className="p-6">
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleTaskComplete(task.id, task.status !== 'completed')}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.status === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div>
                          <h3 className={`text-sm font-medium ${
                            task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddTaskModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        categories={categories}
        onTaskAdded={fetchTasks}
      />
    </div>
  )
} 