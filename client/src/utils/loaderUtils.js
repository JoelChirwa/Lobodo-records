export const getRandomLoadingMessage = () => {
  const messages = [
    'Tuning the instruments...',
    'Mixing the sounds...',
    'Setting up the studio...',
    'Loading the tracks...',
    'Warming up the amplifiers...',
    'Calibrating audio levels...',
    'Preparing the experience...',
    'Connecting to the studio...',
    'Loading your music library...',
    'Getting the vibe right...',
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export const simulateProgress = (duration = 3000, onProgress) => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      
      if (onProgress) onProgress(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        resolve()
      }
    }, 50)
  })
}

export const createLoaderController = () => {
  let loaders = new Set()
  
  return {
    addLoader: (id) => {
      loaders.add(id)
      return loaders.size > 0
    },
    removeLoader: (id) => {
      loaders.delete(id)
      return loaders.size > 0
    },
    isLoading: () => loaders.size > 0,
    clearAll: () => {
      loaders.clear()
      return false
    }
  }
}