import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CalendarDaysIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Button3D from '../ui/Button3D'
import toast from 'react-hot-toast'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  packageType: yup.string().required('Please select a package'),
  date: yup.string().required('Please select a date'),
  timeSlot: yup.string().required('Please select a time slot'),
  duration: yup.number().min(1).max(8).required('Duration is required'),
  notes: yup.string(),
  equipmentRequested: yup.array().of(yup.string()),
})

const packages = [
  { id: 'mixing', name: 'Mixing', price: 150, description: 'Professional audio mixing services' },
  { id: 'mastering', name: 'Mastering', price: 100, description: 'Final track mastering' },
  { id: 'production', name: 'Full Production', price: 300, description: 'Complete music production' },
  { id: 'recording', name: 'Recording Session', price: 200, description: 'Studio recording time' },
  { id: 'consultation', name: 'Consultation', price: 80, description: 'Professional advice session' },
]

const equipmentOptions = [
  'Neumann U87 Microphone',
  'API 2500 Compressor',
  'SSL Console',
  'Genelec Monitors',
  'Moog Synthesizer',
  'Fender Rhodes',
  'Drum Kit',
  'Guitar Amps',
]

export default function BookingForm({ onSuccess }) {
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      duration: 2,
      equipmentRequested: [],
    },
  })

  const watchDate = watch('date')
  const watchPackageType = watch('packageType')
  const watchTimeSlot = watch('timeSlot')
  const watchEquipmentRequested = watch('equipmentRequested')

  // Set selected package when package type changes
  useEffect(() => {
    const pkg = packages.find(p => p.id === watchPackageType)
    setSelectedPackage(pkg)
  }, [watchPackageType])

  // Mock function to fetch available slots
  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock available slots
      const allSlots = ['9:00', '11:00', '14:00', '16:00', '19:00']
      const mockBookedSlots = ['11:00', '16:00'] // Mock booked slots
      const available = allSlots.filter(slot => !mockBookedSlots.includes(slot))
      
      setAvailableSlots(available)
    } catch (error) {
      toast.error('Failed to fetch available slots')
    } finally {
      setLoadingSlots(false)
    }
  }

  // Fetch slots when date changes
  useEffect(() => {
    if (watchDate) {
      fetchAvailableSlots(watchDate)
    }
  }, [watchDate])

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Booking data:', data)
      toast.success('Booking request submitted successfully!')
      if (onSuccess) onSuccess(data)
    } catch (error) {
      toast.error('Failed to submit booking')
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-3xl p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold mb-2">Book Your Session</h2>
          <p className="text-text-secondary">Fill in the details to reserve your studio time</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                {...register('name')}
                className="input-3d w-full"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                {...register('email')}
                type="email"
                className="input-3d w-full"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                {...register('phone')}
                className="input-3d w-full"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (hours) *</label>
              <select
                {...register('duration')}
                className="input-3d w-full"
              >
                {[1, 2, 4, 6, 8].map(hours => (
                  <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium mb-4">Select Package *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map(pkg => (
                <motion.label
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer ${
                    watchPackageType === pkg.id
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    {...register('packageType')}
                    value={pkg.id}
                    className="hidden"
                  />
                  <div className="glass-effect rounded-xl p-4 h-full hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{pkg.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{pkg.description}</p>
                      </div>
                      <MusicalNoteIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                      <span className="text-sm text-text-secondary">per session</span>
                    </div>
                  </div>
                </motion.label>
              ))}
            </div>
            {errors.packageType && (
              <p className="mt-2 text-sm text-red-400">{errors.packageType.message}</p>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                Select Date *
              </label>
              <input
                {...register('date')}
                type="date"
                min={today}
                max={maxDateStr}
                className="input-3d w-full"
                onChange={(e) => {
                  setValue('date', e.target.value)
                }}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <ClockIcon className="h-5 w-5 inline mr-2" />
                Select Time Slot *
              </label>
              {!watchDate ? (
                <div className="input-3d w-full text-text-secondary flex items-center justify-center h-12">
                  Select a date first
                </div>
              ) : loadingSlots ? (
                <div className="input-3d w-full flex items-center justify-center h-12">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="input-3d w-full text-red-400 flex items-center justify-center h-12">
                  No slots available for this date
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map(slot => (
                    <motion.label
                      key={slot}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <input
                        type="radio"
                        {...register('timeSlot')}
                        value={slot}
                        className="hidden"
                      />
                      <div className={`
                        glass-effect rounded-lg p-3 text-center transition-all
                        ${watchTimeSlot === slot
                          ? 'bg-primary/20 text-primary ring-1 ring-primary'
                          : 'hover:bg-white/5'
                        }
                      `}>
                        {slot}
                      </div>
                    </motion.label>
                  ))}
                </div>
              )}
              {errors.timeSlot && (
                <p className="mt-1 text-sm text-red-400">{errors.timeSlot.message}</p>
              )}
            </div>
          </div>

          {/* Equipment Request */}
          <div>
            <label className="block text-sm font-medium mb-3">Request Specific Equipment</label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(equipment => (
                <label key={equipment} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('equipmentRequested')}
                    value={equipment}
                    className="hidden"
                  />
                  <div className={`
                    glass-effect rounded-full px-4 py-2 text-sm cursor-pointer transition-all
                    ${watchEquipmentRequested?.includes(equipment)
                      ? 'bg-primary/20 text-primary ring-1 ring-primary'
                      : 'hover:bg-white/5'
                    }
                  `}>
                    {equipment}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes</label>
            <textarea
              {...register('notes')}
              rows={4}
              className="input-3d w-full"
              placeholder="Any special requests or notes for the engineer..."
            />
          </div>

          {/* Price Summary */}
          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-effect rounded-xl p-6"
            >
              <h3 className="font-heading text-xl font-bold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">{selectedPackage.name}</span>
                  <span className="font-semibold">${selectedPackage.price}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${selectedPackage.price}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  Payment will be processed after confirmation
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-6">
            <Button3D
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full md:w-auto px-12"
            >
              Submit Booking Request
            </Button3D>
            <p className="text-sm text-text-secondary mt-4">
              You'll receive a confirmation email within 24 hours
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}