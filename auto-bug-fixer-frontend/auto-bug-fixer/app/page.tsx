'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import CodeEditorPanel from '@/components/editor/CodeEditorPanel'
import ResultsPanel from '@/components/results/ResultsPanel'
import HistoryPanel from '@/components/ui/HistoryPanel'
import type {
  Language, AnalysisResult, AnalysisTab, LoadingStep, HistoryEntry
} from '@/lib/types'
import { SAMPLE_CODES } from '@/lib/utils'

const LOADING_SEQUENCE: LoadingStep[] = ['scanning', 'detecting', 'fixing', 'optimizing', 'done']

export default function DashboardPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('idle')
  const [activeTab, setActiveTab] = useState<AnalysisTab>('bugs')
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return

    setError(null)
    setResult(null)

    // Step through loading states
    let stepIndex = 0
    setLoadingStep(LOADING_SEQUENCE[0])

    const stepInterval = setInterval(() => {
      stepIndex++
      if (stepIndex < LOADING_SEQUENCE.length - 1) {
        setLoadingStep(LOADING_SEQUENCE[stepIndex])
      } else {
        clearInterval(stepInterval)
      }
    }, 900)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Analysis failed')
      }

      const data: AnalysisResult = await response.json()

      setLoadingStep('done')
      setResult(data)
      setActiveTab('bugs')

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        code,
        language,
        result: data,
        title: `${language} · ${data.bugs.length} bug${data.bugs.length !== 1 ? 's' : ''}`,
      }
      setHistory(prev => [entry, ...prev].slice(0, 20))

    } catch (err: any) {
      clearInterval(stepInterval)
      setError(err.message || 'Something went wrong')
      setLoadingStep('idle')
    }

    // Reset loading step after short delay
    setTimeout(() => setLoadingStep('idle'), 300)
  }, [code, language])

  const handleHistorySelect = (entry: HistoryEntry) => {
    setCode(entry.code)
    setLanguage(entry.language as Language)
    setResult(entry.result)
    setActiveTab('bugs')
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen bg-bg-primary grid-bg relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #00e5ff, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-64 -right-64 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-3"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />
      </div>

      {/* Navbar */}
      <Navbar
        historyCount={history.length}
        onShowHistory={() => setShowHistory(!showHistory)}
      />

      {/* Main layout */}
      <div className="flex h-[calc(100vh-57px)] relative">
        {/* Left panel: Code Editor */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-[48%] border-r border-border-subtle flex flex-col"
          style={{ background: 'rgba(8, 12, 20, 0.97)' }}
        >
          <CodeEditorPanel
            code={code}
            language={language}
            loadingStep={loadingStep}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
          />
        </motion.div>

        {/* Right panel: Results */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 flex flex-col"
          style={{ background: 'rgba(10, 15, 25, 0.97)' }}
        >
          <ResultsPanel
            result={result}
            originalCode={code}
            language={language}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </motion.div>

        {/* History panel overlay */}
        <AnimatePresence>
          {showHistory && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setShowHistory(false)}
              />
              <HistoryPanel
                entries={history}
                onSelect={handleHistorySelect}
                onClose={() => setShowHistory(false)}
                onClear={() => setHistory([])}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/90 border border-red-500/30 shadow-glass backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-mono text-red-300">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-400 ml-2 text-xs font-mono"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API key hint for fresh installs */}
      <AnimatePresence>
        {!process.env.NEXT_PUBLIC_HIDE_API_HINT && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 2 }}
            className="fixed bottom-6 right-6 z-40 max-w-xs"
          >
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
