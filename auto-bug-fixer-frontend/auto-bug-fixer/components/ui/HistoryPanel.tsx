'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { History, X, Bug, Clock, Code2, ChevronRight, Trash2 } from 'lucide-react'
import { calculateOverallScore, getScoreColor, cn } from '@/lib/utils'
import type { HistoryEntry } from '@/lib/types'

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
  onClose: () => void
  onClear: () => void
}

export default function HistoryPanel({ entries, onSelect, onClose, onClear }: HistoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-0 top-0 bottom-0 w-80 z-50 border-l border-border-default bg-bg-secondary flex flex-col shadow-glass"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <History size={15} className="text-accent-cyan" />
          <span className="font-display font-semibold text-white text-sm">Analysis History</span>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-border-subtle text-slate-500">
            {entries.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {entries.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Clear history"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-border-subtle transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <History size={28} className="text-slate-700 mb-3" />
            <p className="text-sm font-mono text-slate-600">No history yet</p>
            <p className="text-xs text-slate-700 mt-1">Analyses will appear here</p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const overall = calculateOverallScore(entry.result.score)
            const scoreColor = getScoreColor(overall)
            const bugCount = entry.result.bugs.length
            const criticalCount = entry.result.bugs.filter(b => b.severity === 'critical').length

            return (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onSelect(entry)}
                className="w-full text-left p-3.5 rounded-xl border border-border-subtle hover:border-accent-cyan/30 hover:bg-accent-cyan/5 bg-bg-card transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Code2 size={12} className="text-accent-blue flex-shrink-0" />
                    <span className="text-xs font-mono text-white truncate">{entry.title}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-accent-cyan transition-colors flex-shrink-0 mt-0.5" />
                </div>

                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <Bug size={9} />
                    <span className={cn(criticalCount > 0 ? 'text-red-400' : '')}>
                      {bugCount} bug{bugCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: scoreColor }} />
                    <span style={{ color: scoreColor }}>{overall}%</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Clock size={9} />
                    <span>{entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="mt-2 h-0.5 bg-border-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${overall}%`, background: scoreColor }}
                  />
                </div>
              </motion.button>
            )
          })
        )}
      </div>
    </motion.div>
  )
}
