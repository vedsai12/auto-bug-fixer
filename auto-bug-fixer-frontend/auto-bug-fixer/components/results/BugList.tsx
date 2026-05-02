'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Bug, ChevronDown, ChevronRight, Shield, Zap, Code2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Bug as BugType } from '@/lib/types'

interface BugListProps {
  bugs: BugType[]
}

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    className: 'badge-critical',
    icon: '💀',
    borderColor: 'border-red-500/20',
    bgColor: 'bg-red-500/5',
    dotColor: 'bg-red-500',
    textColor: 'text-red-400',
  },
  high: {
    label: 'High',
    className: 'badge-high',
    icon: '⚠️',
    borderColor: 'border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-400',
  },
  medium: {
    label: 'Medium',
    className: 'badge-medium',
    icon: '🔶',
    borderColor: 'border-blue-500/20',
    bgColor: 'bg-blue-500/5',
    dotColor: 'bg-blue-400',
    textColor: 'text-blue-400',
  },
  low: {
    label: 'Low',
    className: 'badge-low',
    icon: '💡',
    borderColor: 'border-green-500/20',
    bgColor: 'bg-green-500/5',
    dotColor: 'bg-green-500',
    textColor: 'text-green-400',
  },
}

function BugCard({ bug, index }: { bug: BugType; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const config = SEVERITY_CONFIG[bug.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={cn(
        'rounded-xl border overflow-hidden cursor-pointer group transition-all',
        config.borderColor,
        config.bgColor,
        expanded ? 'shadow-lg' : 'hover:border-opacity-50'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-3.5">
        <div className={cn('w-1.5 rounded-full self-stretch min-h-[20px] mt-1', config.dotColor)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-medium text-white">{bug.title}</span>
                <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded-md', config.className)}>
                  {config.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-border-subtle text-slate-500 border border-border-subtle">
                  {bug.category}
                </span>
              </div>
              {bug.line && (
                <span className="text-[10px] font-mono text-slate-600 mt-0.5 block">
                  Line {bug.line}
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-600 mt-0.5 flex-shrink-0"
            >
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/5">
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {bug.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function BugList({ bugs }: BugListProps) {
  const counts = {
    critical: bugs.filter(b => b.severity === 'critical').length,
    high: bugs.filter(b => b.severity === 'high').length,
    medium: bugs.filter(b => b.severity === 'medium').length,
    low: bugs.filter(b => b.severity === 'low').length,
  }

  if (bugs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
          <Shield size={28} className="text-green-400" />
        </div>
        <p className="text-green-400 font-mono font-medium">No bugs detected!</p>
        <p className="text-slate-500 text-sm mt-1">Your code looks clean</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(counts) as [keyof typeof counts, number][]).map(([sev, count]) => {
          const config = SEVERITY_CONFIG[sev]
          return (
            <motion.div
              key={sev}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'flex flex-col items-center justify-center py-2.5 rounded-xl border',
                config.borderColor,
                config.bgColor
              )}
            >
              <span className={cn('text-2xl font-display font-bold', config.textColor)}>
                {count}
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-0.5">{config.label}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Bugs by severity */}
      <div className="space-y-2">
        {(['critical', 'high', 'medium', 'low'] as const).map(severity => {
          const severityBugs = bugs.filter(b => b.severity === severity)
          if (severityBugs.length === 0) return null
          return severityBugs.map((bug, i) => (
            <BugCard key={bug.id} bug={bug} index={i} />
          ))
        })}
      </div>
    </div>
  )
}
