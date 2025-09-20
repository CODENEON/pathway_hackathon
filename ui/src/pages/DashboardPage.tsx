import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { Lock, BookOpen, Target } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const learningPaths = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Master the fundamentals of computer science',
      icon: '🧠',
      color: 'from-duolingo-cool-500 to-duolingo-cool-700',
      textColor: 'text-white',
      progress: 0,
      totalLessons: 24,
      completedLessons: 0,
      isLocked: false,
      difficulty: 'Intermediate',
      estimatedTime: '3-4 months'
    },
    {
      id: 'math',
      title: 'Mathematics',
      description: 'Mathematical foundations for programming',
      icon: '📐',
      color: 'from-gray-200 to-gray-300',
      textColor: 'text-gray-800',
      progress: 0,
      totalLessons: 32,
      completedLessons: 0,
      isLocked: true,
      difficulty: 'Beginner',
      estimatedTime: '2-3 months'
    },
    {
      id: 'ml',
      title: 'Machine Learning',
      description: 'Dive into artificial intelligence and ML',
      icon: '🤖',
      color: 'from-gray-200 to-gray-300',
      textColor: 'text-gray-800',
      progress: 0,
      totalLessons: 28,
      completedLessons: 0,
      isLocked: true,
      difficulty: 'Advanced',
      estimatedTime: '4-6 months'
    }
  ]

  const todayStats = {
    streak: 0,
    xp: 0,
    lessonsCompleted: 0,
    timeSpent: 0
  }

  // Check if user has started any learning path
  const hasStartedLearning = learningPaths.some(path => path.completedLessons > 0)

  const handleStartJourney = (pathId: string) => {
    navigate(`/setup/${pathId}`)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-fun font-bold text-gray-800">
          Welcome to LearnPro, {user?.name || 'Guest'}! 🎯
        </h1>
        <p className="mt-4 text-xl text-gray-700 font-sans">
          {hasStartedLearning 
            ? "Continue your learning journey and unlock new skills."
            : "Ready to start your coding journey? Choose a learning path below!"
          }
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200 shadow-sm">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-gray-800">{todayStats.streak}</div>
          <div className="text-sm text-gray-600 font-sans">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200 shadow-sm">
          <div className="text-2xl mb-1">💎</div>
          <div className="text-2xl font-bold text-gray-800">{todayStats.xp}</div>
          <div className="text-sm text-gray-600 font-sans">Total XP</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200 shadow-sm">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-2xl font-bold text-gray-800">{todayStats.lessonsCompleted}</div>
          <div className="text-sm text-gray-600 font-sans">{hasStartedLearning ? "Today's Lessons" : "Lessons Ready"}</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border-2 border-gray-200 shadow-sm">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-2xl font-bold text-gray-800">{todayStats.timeSpent}m</div>
          <div className="text-sm text-gray-600 font-sans">Time Studied</div>
        </div>
      </div>

      {/* Learning Paths Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-fun font-bold text-gray-800 text-center">
          Choose Your Learning Path 🚀
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 ${
                path.isLocked 
                  ? 'border-gray-300 opacity-75 cursor-not-allowed' 
                  : 'border-white hover:scale-105 hover:shadow-2xl cursor-pointer'
              }`}
            >
              {/* Header with gradient */}
              <div className={`p-6 bg-gradient-to-br ${path.color} text-center relative`}>
                <div className="text-4xl mb-3">{path.icon}</div>
                <h3 className={`text-xl font-bold ${path.isLocked ? 'text-gray-800' : 'text-white'} font-sans`} style={!path.isLocked ? {textShadow: '2px 2px 4px rgba(0,0,0,0.5)'} : {}}>
                  {path.title}
                </h3>
                <p className={`text-sm mt-2 ${path.isLocked ? 'text-gray-700' : 'text-white/95'} font-sans`} style={!path.isLocked ? {textShadow: '1px 1px 2px rgba(0,0,0,0.3)'} : {}}>
                  {path.description}
                </p>
                
                {path.isLocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Progress Bar */}
                {!path.isLocked && path.completedLessons > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-gray-700 font-semibold">Progress</span>
                      <span className="text-gray-600">{path.completedLessons}/{path.totalLessons} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-600 font-sans font-semibold">
                      {path.progress}% Complete
                    </div>
                  </div>
                )}

                {/* Get Started Message for new users */}
                {!path.isLocked && path.completedLessons === 0 && (
                  <div className="text-center py-3 px-4 bg-duolingo-cool-50 rounded-lg border border-duolingo-cool-200">
                    <p className="text-duolingo-cool-800 font-semibold font-sans">Ready to start your journey?</p>
                  </div>
                )}

                {/* Path Details */}
                <div className="flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800 font-semibold font-sans">{path.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700 font-sans">{path.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {path.isLocked ? (
                    <div className="w-full py-3 px-4 bg-gray-300 text-gray-800 rounded-xl text-center font-bold font-sans">
                      🔒 Coming Soon
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartJourney(path.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 hover:from-duolingo-cool-600 hover:to-duolingo-cool-800 text-white rounded-xl font-bold font-sans transition-all duration-200 hover:scale-105 shadow-lg" 
                      style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}
                    >
                      Start Journey →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
        <h3 className="text-2xl font-fun font-bold text-gray-800 mb-4 text-center">
          Quick Actions ⚡
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
            <div className="text-2xl mb-2">📊</div>
            <div className="font-bold font-sans">View Progress</div>
            <div className="text-sm text-blue-100 font-sans">Track your achievements</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold font-sans">Practice Mode</div>
            <div className="text-sm text-orange-100 font-sans">Review what you've learned</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-bold font-sans">Achievements</div>
            <div className="text-sm text-purple-100 font-sans">See your badges</div>
          </button>
        </div>
      </div>
    </div>
  )
}