import React from 'react'
import { motion } from 'framer-motion'

export const InlineLoader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent-pink',
    white: 'border-white',
  }

  return (
    <div className="relative">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

export const ButtonLoader = () => (
  <div className="flex items-center justify-center">
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  </div>
)

export const AudioWaveLoader = ({ width = 120, height = 40 }) => (
  <div className="flex items-end justify-center space-x-1" style={{ width, height }}>
    {[...Array(16)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1.5 rounded-t bg-gradient-to-t from-primary to-accent-pink"
        animate={{
          height: [`${Math.random() * 30 + 10}%`, `${Math.random() * 60 + 30}%`, `${Math.random() * 30 + 10}%`],
        }}
        transition={{
          duration: 0.6 + Math.random() * 0.3,
          repeat: Infinity,
          delay: i * 0.05,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
)

export const ContentLoader = ({ lines = 3 }) => (
  <div className="space-y-3">
    {[...Array(lines)].map((_, i) => (
      <motion.div
        key={i}
        className="h-4 bg-white/10 rounded"
        initial={{ opacity: 0.3 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut"
        }}
        style={{ width: `${80 - i * 10}%` }}
      />
    ))}
  </div>
)

export const LogoLoader = () => (
  <motion.div
    className="relative"
    animate={{
      rotateY: 360,
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-accent-pink to-secondary flex items-center justify-center">
      <div className="text-white font-heading font-bold text-xl">L</div>
    </div>
    <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-ping" />
  </motion.div>
)