import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

interface UserProfileDropdownProps {
  user: User
}

export default function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
          {user.first_name?.[0]}{user.last_name?.[0]}
        </div>
        <span className="text-gray-700">
          {user.first_name} {user.last_name}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <p className="font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 