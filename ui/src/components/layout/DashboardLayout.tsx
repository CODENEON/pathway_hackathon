import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store'
import { Button } from '../ui/Button'

const navigation = [
  { name: 'Learn', path: '/dashboard', icon: '🏠', color: 'duolingo-blue' },
  { name: 'Training', path: '/training', icon: '🎯', color: 'duolingo-orange' },
  { name: 'Progress Tracking', path: '/progress', icon: '📊', color: 'duolingo-purple' },
  { name: 'Documents', path: '/documents', icon: '📚', color: 'duolingo-red' },
  { name: 'Settings', path: '/settings', icon: '⚙️', color: 'duolingo-green' },
]

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 bg-gradient-duolingo">
          <h1 className="text-white text-2xl font-fun font-bold tracking-wide">🧠 LearnPro</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105'
                  }`}
                  style={isActive ? {textShadow: '1px 1px 2px rgba(0,0,0,0.3)'} : {}}
                >
                  <span className="text-xl mr-4">{item.icon}</span>
                  <span className="font-sans font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-duolingo-green to-duolingo-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ring-2 ring-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 font-sans truncate">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-duolingo-green lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="streak-badge">
                🔥 <span className="font-bold">7</span> day streak
              </div>
              <div className="xp-badge">
                💎 <span className="font-bold">1,250</span> XP
              </div>
              <h2 className="text-lg font-semibold text-gray-800 font-sans">Welcome back, {user?.name || 'Guest'}! ✨</h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}