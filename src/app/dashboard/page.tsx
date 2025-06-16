'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Mascot from '@/components/Mascot'
import Confetti from '@/components/Confetti'
import { format } from 'date-fns'
import TaskList from '@/components/TaskList'
import Header, { User } from '@/components/Header'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
 
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

 

  useEffect(() => {
    const checkAuth = async () => {
      try {
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])


  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
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
     <Header user={user} setUser={setUser} />

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
      <TaskList />
    </div>
  )
} 