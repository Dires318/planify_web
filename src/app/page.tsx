'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-4">
          Welcome to MyPlanJoy
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Your friendly planner that cheers you on
        </p>
        <div className="space-y-4">
          <Link
            href="/signup"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Get Started
          </Link>
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">
            Emotional Design
          </h3>
          <p className="text-gray-600">
            Experience a warm, supportive interface that motivates you to achieve your goals.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">
            Simple & Intuitive
          </h3>
          <p className="text-gray-600">
            Clean, minimalist design that makes planning your day a joy, not a chore.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">
            Share & Collaborate
          </h3>
          <p className="text-gray-600">
            Work together with friends and family on shared plans and goals.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 