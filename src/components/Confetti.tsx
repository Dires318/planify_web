import { motion } from 'framer-motion'

interface ConfettiProps {
  isActive: boolean
}

export default function Confetti({ isActive }: ConfettiProps) {
  if (!isActive) return null

  const confettiColors = ['#FFB74D', '#4FC3F7', '#81C784', '#FF8A65', '#BA68C8']

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
        const startX = Math.random() * window.innerWidth
        const startY = -20
        const endX = startX + (Math.random() - 0.5) * 200
        const endY = window.innerHeight + 20
        const rotation = Math.random() * 360
        const duration = 1 + Math.random() * 2

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              backgroundColor: color,
              left: startX,
              top: startY,
            }}
            initial={{ opacity: 1, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: [0, endX - startX],
              y: [0, endY - startY],
              rotate: rotation,
            }}
            transition={{
              duration,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
} 