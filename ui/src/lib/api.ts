import axios from 'axios'
import type { ApiConfig } from './types'

// Default configuration - can be overridden
const defaultConfig: ApiConfig = {
  baseUrl: 'http://localhost:8008', // Your Pathway backend port
  authHeaderName: 'Authorization',
  ragEndpoints: {
    submit: '/v2/answer',
    question: '/v2/question',
    chat: '/v2/chat'
  },
  eventEndpoint: '/v2/events'
}

// Create axios instance
export const api = axios.create({
  baseURL: defaultConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock API for development
export const mockApi = {
  // Auth endpoints
  async login(email: string, password: string) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: { id: '1', name: 'John Doe', email, subjects: [], uploadedDocs: [], createdAt: new Date() },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh'
    }
  },

  async register(name: string, email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: { id: '1', name, email, subjects: [], uploadedDocs: [], createdAt: new Date() },
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh'
    }
  },

  // Training endpoints
  async startSession(subject: string, proficiency?: string) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      sessionId: 'session-123',
      startAt: new Date(),
      topicQueue: [
        { id: 'q1', title: 'Arrays Basics', difficulty: 'Easy', slug: 'arrays-basics' },
        { id: 'q2', title: 'Two Pointers', difficulty: 'Medium', slug: 'two-pointers' }
      ],
      currentQuestionId: 'q1'
    }
  },

  async getQuestion(questionId: string) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: questionId,
      title: 'Two Sum',
      bodyMarkdown: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      starterCode: {
        python: 'def twoSum(nums, target):\n    # Your code here\n    pass',
        cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}',
        javascript: 'function twoSum(nums, target) {\n    // Your code here\n}'
      },
      tags: ['array', 'hash-table'],
      difficulty: 'Easy' as const
    }
  },

  async submitSolution(sessionId: string, questionId: string, language: string, code: string) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const isCorrect = Math.random() > 0.3 // 70% chance of correct
    
    return {
      verdict: isCorrect ? 'correct' : 'incorrect' as const,
      score: isCorrect ? 100 : 40,
      tests: [
        { name: 'Example 1', passed: true, details: 'Output matched expected.' },
        { name: 'Edge case', passed: isCorrect, details: isCorrect ? 'Passed' : 'Index out of range at line 3.' }
      ],
      feedbackText: isCorrect 
        ? 'Great job! Your solution is efficient and handles all test cases.'
        : 'Close! Check your boundary conditions and try handling edge cases.',
      suggestedResources: [
        { type: 'doc', title: 'Hash Table Patterns', url: '#' },
        { type: 'video', title: 'Two Sum Explanation', url: '#' }
      ]
    }
  },

  // RAG integration with your Pathway backend
  async askRAG(prompt: string, context?: any) {
    try {
      const response = await api.post(defaultConfig.ragEndpoints.submit, {
        prompt,
        ...context
      })
      return response.data
    } catch (error) {
      console.error('RAG API Error:', error)
      // Fallback to mock response
      return {
        answer: `Here's a helpful response about: "${prompt}". This is using the Pathway RAG backend to provide personalized learning content based on your uploaded documents and current progress.`,
        sources: [
          { title: 'Your uploaded document', url: '#' }
        ]
      }
    }
  }
}

export { defaultConfig as apiConfig }