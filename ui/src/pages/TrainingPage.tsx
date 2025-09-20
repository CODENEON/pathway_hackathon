import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '../components/ui/Button'
import { mockApi } from '../lib/api'

interface Question {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: string
  starterCode: string
  testCases: {
    input: string
    expectedOutput: string
  }[]
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    language: 'python',
    starterCode: `def two_sum(nums, target):
    """
    Find two numbers in the array that add up to target
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        List of two indices
    """
    # Your code here
    pass`,
    testCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]'
      }
    ]
  },
  {
    id: '2',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    difficulty: 'Easy',
    language: 'javascript',
    starterCode: `function reverseString(s) {
    /**
     * Reverse the input array of characters in-place
     * @param {character[]} s
     * @return {void} Do not return anything, modify s in-place instead.
     */
    // Your code here
}`,
    testCases: [
      {
        input: 's = ["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]'
      }
    ]
  }
]

export const TrainingPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0])
  const [code, setCode] = useState(currentQuestion.starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [hint, setHint] = useState('')
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOutput(`✅ Code executed successfully!\n\nTest Case 1: PASSED\nTest Case 2: PASSED\n\nExecution time: 0.023s\nMemory usage: 14.2 MB`)
    } catch (error) {
      setOutput(`❌ Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const getHint = async () => {
    setIsLoadingHint(true)
    setHint('')
    
    try {
      const response = await mockApi.askRAG(
        `I'm working on this coding problem: "${currentQuestion.title}". ${currentQuestion.description} 
        
        My current code is:
        ${code}
        
        Can you give me a helpful hint without giving away the complete solution?`
      )
      setHint(response.answer)
    } catch (error) {
      setHint('Sorry, I couldn\'t generate a hint at this time. Try reviewing the problem description again.')
    } finally {
      setIsLoadingHint(false)
    }
  }

  const switchQuestion = (question: Question) => {
    setCurrentQuestion(question)
    setCode(question.starterCode)
    setOutput('')
    setHint('')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-duolingo-cool-100 text-duolingo-cool-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="h-full max-h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Problem List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Training Problems</h2>
          </div>
          <div className="p-4 space-y-3">
            {sampleQuestions.map((question) => (
              <div
                key={question.id}
                onClick={() => switchQuestion(question)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  currentQuestion.id === question.id
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-gray-900">{question.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getDifficultyColor(question.difficulty)
                  }`}>
                    {question.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 uppercase">{question.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Description */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentQuestion.title}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  getDifficultyColor(currentQuestion.difficulty)
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <Button
                onClick={getHint}
                variant="outline"
                isLoading={isLoadingHint}
                disabled={isLoadingHint}
              >
                💡 Get Hint
              </Button>
            </div>
            <p className="mt-4 text-gray-700">{currentQuestion.description}</p>
            
            {/* Test Cases */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Example Test Cases:</h3>
              <div className="space-y-2">
                {currentQuestion.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div><span className="font-medium">Input:</span> {testCase.input}</div>
                    <div><span className="font-medium">Output:</span> {testCase.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Hint */}
            {hint && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 AI Hint:</h3>
                <p className="text-sm text-blue-800">{hint}</p>
              </div>
            )}
          </div>

          {/* Code Editor and Output */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Code Editor</span>
                  <Button
                    onClick={runCode}
                    variant="primary"
                    size="sm"
                    isLoading={isRunning}
                    disabled={isRunning}
                  >
                    {isRunning ? 'Running...' : '▶️ Run Code'}
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={currentQuestion.language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Output</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {output ? (
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Click "Run Code" to see the output here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}