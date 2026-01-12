import React from 'react'
import { motion } from 'framer-motion'

const Button3D = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = 'btn-3d font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group'
  
  const variants = {
    primary: 'btn-3d-primary focus:ring-primary',
    secondary: 'btn-3d-secondary focus:ring-secondary',
    outline: 'glass-effect border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/10 focus:ring-primary',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/10 border border-transparent',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      <span className={`flex items-center justify-center ${loading ? 'invisible' : 'visible'}`}>
        {children}
      </span>
      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute top-0 left-[-100%] h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700" />
      </span>
    </motion.button>
  )
}

export default Button3D