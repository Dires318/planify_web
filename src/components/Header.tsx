'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import UserProfileDropdown from '@/components/UserProfileDropdown'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

interface HeaderProps {
  user: User | null
  setUser: (user: User | null) => void
}

export default function Header({ user, setUser }: HeaderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/user/')
        setUser(response.data)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className=" bg-gray-50">
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Planify</h1>
            </div>
            <div className="flex items-center">
              {user && <UserProfileDropdown user={user} />}
            </div>
          </div>
        </div>
      </nav>

     

    </div>
  )
} 