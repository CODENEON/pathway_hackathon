import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, TrainingSession } from '../lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

interface TrainingState {
  currentSession: TrainingSession | null
  isTraining: boolean
  currentLanguage: string
  startSession: (subject: string) => Promise<void>
  endSession: () => void
  setLanguage: (language: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Mock login - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          const mockUser: User = {
            id: '1',
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Extract name from email
            email,
            subjects: [
              { slug: 'dsa', name: 'Data Structures & Algorithms', enabled: true, proficiency: 'Beginner' }
            ],
            uploadedDocs: [],
            createdAt: new Date()
          }
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const mockUser: User = {
            id: '1',
            name,
            email,
            subjects: [],
            uploadedDocs: [],
            createdAt: new Date()
          }
          set({ user: mockUser, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export const useTrainingStore = create<TrainingState>((set) => ({
  currentSession: null,
  isTraining: false,
  currentLanguage: 'python',
  
  startSession: async (subject: string) => {
    const mockSession: TrainingSession = {
      id: 'session-' + Date.now(),
      subject,
      startedAt: new Date(),
      currentQuestionId: 'q1',
      topicQueue: [
        { id: 'q1', title: 'Arrays Basics', difficulty: 'Easy', slug: 'arrays' },
        { id: 'q2', title: 'Two Pointers', difficulty: 'Medium', slug: 'two-pointers' }
      ]
    }
    set({ currentSession: mockSession, isTraining: true })
  },
  
  endSession: () => {
    set({ currentSession: null, isTraining: false })
  },
  
  setLanguage: (language: string) => {
    set({ currentLanguage: language })
  }
}))