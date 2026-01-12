import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user')
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        _id: '1',
        name: 'Demo User',
        email: email,
        role: email === 'admin@lobodo.com' ? 'admin' : 'user',
        avatar: '',
        favorites: [],
        bookings: [],
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      
      return { success: true, user: mockUser }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      // Mock registration - replace with actual API call
      const mockUser = {
        _id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        avatar: '',
        favorites: [],
        bookings: [],
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      
      return { success: true, user: mockUser }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    // Navigation will be handled by components that call logout
    return true
  }

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      return { success: true, user: updatedUser }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Update failed' 
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Create a wrapper hook for components that need navigation
export const useAuthWithNavigate = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  const logoutWithNavigate = () => {
    auth.logout()
    navigate('/login')
  }

  return {
    ...auth,
    logout: logoutWithNavigate,
  }
}