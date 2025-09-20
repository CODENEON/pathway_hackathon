import React, { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../store'
import { Upload, Trash2, Eye, Search, Plus, X } from 'lucide-react'

interface Document {
  id: string
  originalName: string
  storedName: string
  fileSize: number
  fileType: string
  uploadDate: string
}

export const DocumentsPage: React.FC = () => {
  const { user } = useAuthStore()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const API_BASE = '/api' // Use relative URL since Vite will proxy to port 3001

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('text')) return '📝'
    if (fileType.includes('javascript')) return '⚡'
    if (fileType.includes('python')) return '🐍'
    if (fileType.includes('java')) return '☕'
    if (fileType.includes('word')) return '📘'
    return '📄'
  }

  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`${API_BASE}/documents/${user.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setDocuments(data.documents || [])
      } else {
        console.error('Failed to fetch documents:', data.error)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleFileUpload = async (files: FileList) => {
    if (!user?.id || files.length === 0) return

    setUploading(true)
    
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('userId', user.id)

      try {
        const response = await fetch(`${API_BASE}/documents/upload`, {
          method: 'POST',
          body: formData
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        return data.document
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        throw error
      }
    })

    try {
      const uploadedDocs = await Promise.all(uploadPromises)
      setDocuments(prev => [...uploadedDocs, ...prev])
      setShowUpload(false)
    } catch (error) {
      alert('Some files failed to upload. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`${API_BASE}/documents/${documentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      } else {
        throw new Error(data.error || 'Delete failed')
      }
    } catch (error) {
      console.error('Failed to delete document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const filteredDocuments = documents.filter(doc =>
    doc.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-fun font-bold text-gray-800">
            📚 My Documents
          </h1>
          <p className="text-gray-600 font-sans mt-1">
            Manage your learning materials and documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 hover:from-duolingo-cool-600 hover:to-duolingo-cool-800 text-white px-6 py-3 rounded-xl font-bold font-sans transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Documents</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-duolingo-cool-500 focus:border-duolingo-cool-500 font-sans"
        />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 font-sans">
                Upload Documents
              </h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragOver
                  ? 'border-duolingo-cool-500 bg-duolingo-cool-50'
                  : 'border-gray-300 hover:border-duolingo-cool-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-sans mb-4">
                Drag and drop files here or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload-modal"
                accept=".pdf,.txt,.md,.js,.py,.cpp,.java,.doc,.docx"
              />
              <label
                htmlFor="file-upload-modal"
                className="inline-block bg-duolingo-cool-500 hover:bg-duolingo-cool-600 text-white font-medium py-3 px-6 rounded-xl cursor-pointer transition-colors"
              >
                Choose Files
              </label>
            </div>
            
            {uploading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-duolingo-cool-500"></div>
                <p className="text-gray-600 font-sans mt-2">Uploading...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-duolingo-cool-500"></div>
          <p className="text-gray-600 font-sans mt-4">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-gray-800 font-sans mb-2">
            {documents.length === 0 ? 'No documents yet' : 'No documents found'}
          </h3>
          <p className="text-gray-600 font-sans mb-6">
            {documents.length === 0 
              ? 'Upload your first document to get started with personalized learning'
              : 'Try adjusting your search terms'
            }
          </p>
          {documents.length === 0 && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-duolingo-cool-500 to-duolingo-cool-700 hover:from-duolingo-cool-600 hover:to-duolingo-cool-800 text-white px-6 py-3 rounded-xl font-bold font-sans transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Upload Your First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="text-3xl flex-shrink-0">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 font-sans truncate">
                      {document.originalName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 font-sans mt-1">
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(document.uploadDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => window.open(`${API_BASE}/documents/${document.id}/content`, '_blank')}
                    className="p-2 text-gray-600 hover:text-duolingo-cool-600 hover:bg-duolingo-cool-50 rounded-lg transition-all duration-200"
                    title="Preview document"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete document"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 font-sans mb-4">
            📊 Document Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-duolingo-cool-600 font-sans">
                {documents.length}
              </div>
              <div className="text-sm text-gray-600 font-sans">
                Total Documents
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-duolingo-cool-600 font-sans">
                {formatFileSize(documents.reduce((total, doc) => total + doc.fileSize, 0))}
              </div>
              <div className="text-sm text-gray-600 font-sans">
                Total Size
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-duolingo-cool-600 font-sans">
                {new Set(documents.map(doc => doc.fileType)).size}
              </div>
              <div className="text-sm text-gray-600 font-sans">
                File Types
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}