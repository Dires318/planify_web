import { motion } from 'framer-motion'

interface MascotProps {
  type?: 'fox' | 'robot' | 'owl'
  mood?: 'happy' | 'concerned' | 'excited'
}

export default function Mascot({ type = 'fox', mood = 'happy' }: MascotProps) {
  const getMascotEmoji = () => {
    switch (type) {
      case 'fox':
        return mood === 'happy' ? '🦊' : mood === 'concerned' ? '🦊' : '🦊'
      case 'robot':
        return mood === 'happy' ? '🤖' : mood === 'concerned' ? '🤖' : '🤖'
      case 'owl':
        return mood === 'happy' ? '🦉' : mood === 'concerned' ? '🦉' : '🦉'
      default:
        return '🦊'
    }
  }

  const getAnimation = () => {
    switch (mood) {
      case 'happy':
        return {
          initial: { rotate: 0 },
          animate: { rotate: [0, -10, 10, -10, 0] },
          transition: { duration: 1, repeat: Infinity, repeatDelay: 2 }
        }
      case 'excited':
        return {
          initial: { y: 0 },
          animate: { y: [0, -5, 0] },
          transition: { duration: 0.5, repeat: Infinity }
        }
      case 'concerned':
        return {
          initial: { rotate: 0 },
          animate: { rotate: [0, 5, -5, 0] },
          transition: { duration: 1, repeat: Infinity, repeatDelay: 1 }
        }
      default:
        return {}
    }
  }

  return (
    <motion.div
      className="text-4xl"
      {...getAnimation()}
    >
      {getMascotEmoji()}
    </motion.div>
  )
} 