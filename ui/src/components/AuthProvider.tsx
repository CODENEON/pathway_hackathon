import React, { useEffect } from 'react'
import { useAuthStore } from '../store'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Debug logging to help troubleshoot auth issues
    console.log('Auth State:', { user, isAuthenticated })
  }, [user, isAuthenticated])

  return <>{children}</>
}