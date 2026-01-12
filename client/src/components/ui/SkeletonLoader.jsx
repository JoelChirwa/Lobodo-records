import React from 'react'
import { motion } from 'framer-motion'

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="glass-effect rounded-2xl p-6"
  >
    <div className="space-y-4">
      {/* Image skeleton */}
      <div className="aspect-video rounded-xl bg-white/10" />
      
      {/* Title skeleton */}
      <div className="h-6 w-3/4 bg-white/10 rounded" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-white/10 rounded" />
        <div className="h-4 w-2/3 bg-white/10 rounded" />
      </div>
      
      {/* Button skeleton */}
      <div className="h-10 w-32 bg-white/10 rounded-lg" />
    </div>
  </motion.div>
)

export const SkeletonTrackItem = () => (
  <div className="flex items-center justify-between p-4 border-b border-white/10">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-lg bg-white/10" />
      <div className="space-y-2">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-3 w-24 bg-white/10 rounded" />
      </div>
    </div>
    <div className="h-8 w-20 bg-white/10 rounded" />
  </div>
)

export const SkeletonGrid = ({ cols = 3, count = 6 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)