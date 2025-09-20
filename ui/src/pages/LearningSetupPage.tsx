import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import { ArrowLeft, Upload, File, X, CheckCircle } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file?: File // Keep the File object for upload
}

export const LearningSetupPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [proficiency, setProficiency] = useState('')
  const [timeline, setTimeline] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const proficiencyLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to programming and data structures',
      icon: '🌱',
      color: 'from-duolingo-cool-400 to-duolingo-cool-600'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Some programming experience, basic DSA knowledge',
      icon: '🌿',
      color: 'from-duolingo-purple-400 to-duolingo-purple-600'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Strong programming background, want to master DSA',
      icon: '🌳',
      color: 'from-duolingo-cyan-400 to-duolingo-cyan-600'
    }
  ]

  const timelineOptions = [
    {
      id: '1-month',
      title: '1 Month',
      description: 'Intensive learning (2-3 hours/day)',
      icon: '⚡',
      intensity: 'High'
    },
    {
      id: '3-months',
      title: '3 Months',
      description: 'Balanced approach (1-2 hours/day)',
      icon: '⭐',
      intensity: 'Medium'
    },
    {
      id: '6-months',
      title: '6 Months',
      description: 'Relaxed pace (30-60 min/day)',
      icon: '🌙',
      intensity: 'Low'
    },
    {
      id: 'flexible',
      title: 'Flexible',
      description: 'Learn at my own pace',
      icon: '🎯',
      intensity: 'Variable'
    }
  ]

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file // Store the actual File object
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartLearning = async () => {
    // Upload files to the API if any were selected
    if (uploadedFiles.length > 0 && user?.id) {
      try {
        const uploadPromises = uploadedFiles
          .filter(file => file.file) // Only upload files that have the File object
          .map(async (uploadedFile) => {
            const formData = new FormData()
            formData.append('document', uploadedFile.file!)
            formData.append('userId', user.id)

            const response = await fetch('/api/documents/upload', {
              method: 'POST',
              body: formData
            })

            if (!response.ok) {
              throw new Error(`Failed to upload ${uploadedFile.name}`)
            }

            return response.json()
          })

        await Promise.all(uploadPromises)
        console.log('All files uploaded successfully')
      } catch (error) {
        console.error('Error uploading files:', error)
        alert('Some files failed to upload. You can upload them later from the Documents section.')
      }
    }

    // Save setup data and navigate to training
    console.log('Setup complete:', { proficiency, timeline, uploadedFiles: uploadedFiles.length })
    navigate('/training')
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'What\'s your proficiency level?'
      case 2: return 'How quickly do you want to learn?'
      case 3: return 'Upload your learning materials'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-duolingo-cool-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? 'bg-duolingo-cool-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fun font-bold text-gray-800 mb-4">
            {getStepTitle()}
          </h1>
          <p className="text-lg text-gray-600 font-sans">
            Let's customize your Data Structures & Algorithms learning journey
          </p>
        </div>

        {/* Step 1: Proficiency Level */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {proficiencyLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setProficiency(level.id)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                  proficiency === level.id
                    ? 'border-duolingo-cool-500 bg-duolingo-cool-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-duolingo-cool-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`text-4xl mr-6 p-4 rounded-xl bg-gradient-to-r ${level.color} text-white shadow-lg`}>
                    {level.icon}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-xl font-bold text-gray-800 font-sans mb-2">
                      {level.title}
                    </h3>
                    <p className="text-gray-600 font-sans">
                      {level.description}
                    </p>
                  </div>
                  {proficiency === level.id && (
                    <CheckCircle className="w-6 h-6 text-duolingo-cool-500 ml-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Timeline */}
        {currentStep === 2 && (
          <div className="grid md:grid-cols-2 gap-4">
            {timelineOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeline(option.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                  timeline === option.id
                    ? 'border-duolingo-cool-500 bg-duolingo-cool-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-duolingo-cool-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 font-sans mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 font-sans mb-3">
                    {option.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    option.intensity === 'High' ? 'bg-red-100 text-red-800' :
                    option.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    option.intensity === 'Low' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {option.intensity} Intensity
                  </span>
                  {timeline === option.id && (
                    <div className="mt-3">
                      <CheckCircle className="w-6 h-6 text-duolingo-cool-500 mx-auto" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-duolingo-cool-500 bg-duolingo-cool-50'
                  : 'border-gray-300 hover:border-duolingo-cool-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 font-sans mb-2">
                Upload Learning Materials
              </h3>
              <p className="text-gray-600 font-sans mb-4">
                Drag and drop your PDFs, notes, or code files here
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                accept=".pdf,.txt,.md,.js,.py,.cpp,.java,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-duolingo-cool-500 hover:bg-duolingo-cool-600 text-white font-medium py-3 px-6 rounded-xl cursor-pointer transition-colors"
              >
                Choose Files
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: PDF, TXT, MD, code files, Word documents
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 font-sans mb-4">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <File className="w-5 h-5 text-duolingo-cool-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800 font-sans">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !proficiency) ||
                (currentStep === 2 && !timeline)
              }
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 ${
                (currentStep === 1 && !proficiency) ||
                (currentStep === 2 && !timeline)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 hover:from-duolingo-cool-600 hover:to-duolingo-cool-800 text-white shadow-lg hover:scale-105'
              }`}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleStartLearning}
              className="px-8 py-3 bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 hover:from-duolingo-cool-600 hover:to-duolingo-cool-800 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Start Learning Journey! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  )
}