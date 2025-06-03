import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyPlanJoy - Your Friendly Planning Companion',
  description: 'A warm, supportive planning app that helps you accomplish your goals with joy.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  )
} 