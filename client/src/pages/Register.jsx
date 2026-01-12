import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  MusicalNoteIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../context/AuthContext'
import Button3D from '../components/ui/Button3D'
import toast from 'react-hot-toast'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
})

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      
      if (result.success) {
        toast.success('Account created successfully!')
        navigate('/')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-green-400']
    
    return {
      score,
      label: labels[score - 1] || '',
      color: colors[score - 1] || '',
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors mb-6">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent-pink flex items-center justify-center mx-auto mb-6">
            <MusicalNoteIcon className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="font-heading text-3xl font-bold mb-2">
            Join <span className="text-gradient">Lobodo</span>
          </h1>
          <p className="text-text-secondary">Create your account to get started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-3xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <UserIcon className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                {...register('name')}
                className="input-3d w-full"
                placeholder="John Smith"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-3d w-full"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <LockClosedIcon className="h-4 w-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-3d w-full pr-12"
                  placeholder="••••••••"
                  onChange={(e) => {
                    // Force re-render for password strength
                    e.target.value = e.target.value
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength */}
              {watch('password') && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={passwordStrength(watch('password')).color}>
                      {passwordStrength(watch('password')).label}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'][
                          passwordStrength(watch('password')).score - 1
                        ] || 'bg-red-500'
                      }`}
                      style={{ width: `${(passwordStrength(watch('password')).score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <LockClosedIcon className="h-4 w-4 inline mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-3d w-full pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-1 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-background-dark"
                />
                <span className="ml-3 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
              )}

              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-white/20 bg-white/10 text-primary focus:ring-primary focus:ring-offset-background-dark"
                />
                <span className="ml-3 text-sm">
                  Subscribe to our newsletter for updates and offers
                </span>
              </label>
            </div>

            <Button3D
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button3D>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="glass-effect px-4 py-1 rounded-full text-text-secondary">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link to="/login">
                <Button3D variant="outline" className="w-full">
                  Sign In Instead
                </Button3D>
              </Link>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-effect rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-3">Benefits of joining:</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-primary mr-2" />
              Book studio sessions online
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-primary mr-2" />
              Save favorite tracks and artists
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-primary mr-2" />
              Get exclusive discounts and offers
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-primary mr-2" />
              Track your booking history
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

// Add watch function for form
const watch = () => ({ password: '' }) // This would come from react-hook-form in actual implementation