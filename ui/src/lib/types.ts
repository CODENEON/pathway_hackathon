export interface User {
  id: string
  name: string
  email: string
  subjects: Subject[]
  uploadedDocs: Document[]
  createdAt: Date
}

export interface Subject {
  slug: string
  name: string
  enabled: boolean
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  progress?: number
}

export interface Document {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploadedAt: Date
  tags?: string[]
}

export interface Question {
  id: string
  title: string
  bodyMarkdown: string
  constraints: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  starterCode: {
    python: string
    cpp: string
    javascript: string
  }
  tags: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export interface TrainingSession {
  id: string
  subject: string
  startedAt: Date
  currentQuestionId: string
  topicQueue: Array<{
    id: string
    title: string
    difficulty: string
    slug: string
  }>
  targetCompletionDays?: number
}

export interface SubmissionResult {
  verdict: 'correct' | 'incorrect' | 'partial'
  score: number
  tests: Array<{
    name: string
    passed: boolean
    details: string
  }>
  feedbackText: string
  suggestedResources: Array<{
    type: string
    title: string
    url: string
  }>
}

export interface ApiConfig {
  baseUrl: string
  authHeaderName: string
  ragEndpoints: {
    submit: string
    question: string
    chat: string
  }
  eventEndpoint: string
}