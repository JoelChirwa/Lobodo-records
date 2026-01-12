import { useState, useCallback } from 'react'

export const useLoader = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  const startLoading = useCallback((message = 'Loading...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingMessage('Loading...')
  }, [])

  const withLoader = useCallback(async (callback, message = 'Loading...') => {
    try {
      startLoading(message)
      const result = await callback()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoader,
  }
}