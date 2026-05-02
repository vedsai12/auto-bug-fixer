'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Bug, Code2, GitCompare, BarChart3, MessageSquare,
  Sparkles, AlertCircle, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisResult, AnalysisTab, Language } from '@/lib/types'
import BugList from './BugList'
import FixedCodePanel from './FixedCodePanel'
import ScorePanel from './ScorePanel'
import DiffViewerPanel from '@/components/diff/DiffViewerPanel'
import ChatPanel from '@/components/chat/ChatPanel'

interface ResultsPanelProps {
  result: AnalysisResult | null
  originalCode: string
  language: Language
  activeTab: AnalysisTab
  onTabChange: (tab: AnalysisTab) => void
}

const TABS: { id: AnalysisTab; label: string; icon: React.ElementType; badge?: (r: AnalysisResult) => string | number | null }[] = [
  {
    id: 'bugs',
    label: 'Bugs',
    icon: Bug,
    badge: (r) => r.bugs.length > 0 ? r.bugs.length : null,
  },
  {
    id: 'fixed',
    label: 'Fixed',
    icon: Code2,
  },
  {
    id: 'diff',
    label: 'Diff',
    icon: GitCompare,
  },
  {
    id: 'score',
    label: 'Score',
    icon: BarChart3,
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare,
  },
]

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/15 flex items-center justify-center mx-auto">
          <Sparkles size={36} className="text-accent-cyan/50" />
        </div>
        {/* Orbit dots */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent-cyan/30"
            style={{
              top: '50%',
              left: '50%',
              marginTop: -4,
              marginLeft: -4,
            }}
            animate={{
              x: Math.cos((i * 120 * Math.PI) / 180) * 50,
              y: Math.sin((i * 120 * Math.PI) / 180) * 50,
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-display font-semibold text-white text-lg mb-2">
          Ready to analyze
        </h3>
        <p className="text-sm text-slate-500 font-mono leading-relaxed max-w-xs">
          Paste your code in the editor and click{' '}
          <span className="text-accent-cyan">"Analyze with AI"</span> to detect bugs,
          get fixes, and view detailed insights.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 space-y-2 text-left w-full max-w-xs"
      >
        {[
          { icon: '🐛', label: 'Bug detection with severity ratings' },
          { icon: '🔧', label: 'AI-powered code fixes' },
          { icon: '📊', label: 'Code health scoring' },
          { icon: '🔍', label: 'Side-by-side diff viewer' },
          { icon: '💬', label: 'Interactive AI chat' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.07 }}
            className="flex items-center gap-2.5 text-xs font-mono text-slate-500"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ResultsPanel({
  result,
  originalCode,
  language,
  activeTab,
  onTabChange,
}: ResultsPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border-subtle bg-bg-secondary overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const badge = result && tab.badge ? tab.badge(result) : null
          const isDisabled = !result && tab.id !== 'chat'

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap',
                isActive
                  ? 'tab-active'
                  : isDisabled
                  ? 'text-slate-700 cursor-not-allowed'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-border-subtle'
              )}
            >
              <Icon size={12} />
              {tab.label}
              {badge !== null && (
                <span className={cn(
                  'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-red-500/30 text-red-400'
                    : 'bg-red-500/20 text-red-400'
                )}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {activeTab === 'chat' ? (
                <div className="h-full flex flex-col" style={{ minHeight: '400px' }}>
                  <ChatPanel code={originalCode} language={language} analysisResult={null} />
                </div>
              ) : (
                <EmptyState />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={cn(
                activeTab === 'chat' ? 'h-full flex flex-col' : 'p-4'
              )}
            >
              {activeTab === 'bugs' && (
                <BugList bugs={result.bugs} />
              )}

              {activeTab === 'fixed' && (
                <FixedCodePanel
                  fixedCode={result.fixedCode}
                  explanation={result.explanation}
                  suggestions={result.suggestions}
                  language={language}
                />
              )}

              {activeTab === 'diff' && (
                <DiffViewerPanel
                  originalCode={originalCode}
                  fixedCode={result.fixedCode}
                />
              )}

              {activeTab === 'score' && (
                <ScorePanel
                  score={result.score}
                  bugCount={result.bugs.length}
                  summary={result.summary}
                />
              )}

              {activeTab === 'chat' && (
                <div className="h-full flex flex-col" style={{ minHeight: '500px' }}>
                  <ChatPanel
                    code={originalCode}
                    language={language}
                    analysisResult={result}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
