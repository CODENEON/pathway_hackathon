import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { TrainingPage } from './pages/TrainingPage'
import { LearningSetupPage } from './pages/LearningSetupPage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AuthProvider } from './components/AuthProvider'
import { useAuthStore } from './store'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  
  return <>{children}</>
}

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/setup/:pathId"
            element={
              <ProtectedRoute>
                <LearningSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="training" element={<TrainingPage />} />
            <Route 
              path="progress" 
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-4 font-hand">📈 Progress Tracking</h2>
                  <p className="text-charcoal-600 font-sketch">Coming soon! Track your learning progress here.</p>
                </div>
              } 
            />
            <Route 
              path="documents" 
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-4 font-hand">📚 Document Management</h2>
                  <p className="text-charcoal-600 font-sketch">Coming soon! Upload and manage your learning materials here.</p>
                </div>
              } 
            />
            <Route 
              path="settings" 
              element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-4 font-hand">⚙️ Settings</h2>
                  <p className="text-charcoal-600 font-sketch">Coming soon! Customize your learning experience here.</p>
                </div>
              } 
            />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}