import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MusicalNoteIcon } from '@heroicons/react/24/outline'

const LobodoLoader = ({ fullScreen = true, size = 'lg', message = 'Loading...' }) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }

  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      {/* Main 3D Sphere */}
      <div className="relative mb-8">
        {/* Outer Sphere */}
        <div className={`${sizeClasses[size]} rounded-full relative`}>
          {/* Pulsing outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-accent-pink/40"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner sphere with gradient */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary via-accent-pink to-secondary">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Musical note icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MusicalNoteIcon className="h-1/2 w-1/2 text-white" />
              </div>
              
              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${50 + 40 * Math.cos((i * 45 * Math.PI) / 180)}%`,
                    top: `${50 + 40 * Math.sin((i * 45 * Math.PI) / 180)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Orbiting elements */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-0.5rem',
                marginTop: '-0.5rem',
              }}
              animate={{
                rotate: 360,
                x: size === 'lg' ? 60 : size === 'xl' ? 90 : 40,
                y: 0,
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        {/* Audio wave visualization */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-48">
          <div className="flex items-end justify-center space-x-1 h-12">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-t bg-gradient-to-t from-primary to-accent-pink"
                animate={{
                  height: [`${Math.random() * 20 + 10}%`, `${Math.random() * 40 + 30}%`, `${Math.random() * 20 + 10}%`],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 mb-4">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Loading</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent-pink to-secondary"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>

      {/* Loading message with typing effect */}
      <div className="text-center">
        <div className="text-lg font-medium mb-2 text-text-primary">
          {message}
        </div>
        <div className="flex justify-center space-x-2">
          {['L', 'O', 'B', 'O', 'D', 'O'].map((letter, i) => (
            <motion.span
              key={i}
              className="text-gradient font-heading text-xl font-bold"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Subtle floating particles in background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark"
      >
        {loaderContent}
        
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-accent-pink/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative"
    >
      {loaderContent}
    </motion.div>
  )
}

export default LobodoLoader