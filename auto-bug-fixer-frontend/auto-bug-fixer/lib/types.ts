export interface Bug {
  id: number
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  line: string
  category: string
}

export interface AnalysisScore {
  performance: number
  readability: number
  security: number
  maintainability: number
}

export interface AnalysisResult {
  bugs: Bug[]
  fixedCode: string
  explanation: string
  suggestions: string[]
  score: AnalysisScore
  summary: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface HistoryEntry {
  id: string
  timestamp: Date
  code: string
  language: string
  result: AnalysisResult
  title: string
}

export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'go' | 'rust' | 'cpp'

export type AnalysisTab = 'bugs' | 'fixed' | 'diff' | 'score' | 'chat'

export type LoadingStep = 'idle' | 'scanning' | 'detecting' | 'fixing' | 'optimizing' | 'done'
