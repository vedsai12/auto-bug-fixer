'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, GitBranch, Columns, AlignLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const ReactDiffViewer = dynamic(() => import('react-diff-viewer-continued'), { ssr: false })

interface DiffViewerPanelProps {
  originalCode: string
  fixedCode: string
}

export default function DiffViewerPanel({ originalCode, fixedCode }: DiffViewerPanelProps) {
  const [splitView, setSplitView] = useState(true)

  const originalLines = originalCode.split('\n').length
  const fixedLines = fixedCode.split('\n').length
  const lineDiff = fixedLines - originalLines

  return (
    <div className="space-y-4">
      {/* Diff stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <GitBranch size={13} className="text-accent-cyan" />
            <span className="text-xs font-mono text-slate-400">Code comparison</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">{originalLines} lines</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-400">{fixedLines} lines</span>
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px]',
              lineDiff > 0
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : lineDiff < 0
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'bg-border-subtle text-slate-500 border border-border-subtle'
            )}>
              {lineDiff > 0 ? `+${lineDiff}` : lineDiff === 0 ? '±0' : lineDiff} lines
            </span>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-bg-secondary border border-border-subtle">
          <button
            onClick={() => setSplitView(true)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all',
              splitView ? 'bg-border-default text-white' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <Columns size={11} /> Split
          </button>
          <button
            onClick={() => setSplitView(false)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all',
              !splitView ? 'bg-border-default text-white' : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <AlignLeft size={11} /> Unified
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" />
          <span className="text-slate-500">Removed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/40" />
          <span className="text-slate-500">Added</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-border-subtle border border-border-default" />
          <span className="text-slate-500">Unchanged</span>
        </div>
      </div>

      {/* Diff viewer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border-default overflow-hidden"
        style={{ maxHeight: '500px', overflowY: 'auto' }}
      >
        <div
          style={{
            '--diff-bg': '#0a1220',
            '--diff-added-bg': 'rgba(16, 185, 129, 0.12)',
            '--diff-removed-bg': 'rgba(239, 68, 68, 0.12)',
          } as React.CSSProperties}
        >
          <ReactDiffViewer
            oldValue={originalCode}
            newValue={fixedCode}
            splitView={splitView}
            useDarkTheme={true}
            hideLineNumbers={false}
            showDiffOnly={false}
            leftTitle={splitView ? '⬤ Original' : undefined}
            rightTitle={splitView ? '⬤ Fixed' : undefined}
            styles={{
              variables: {
                dark: {
                  diffViewerBackground: '#0a1220',
                  diffViewerColor: '#c9d1d9',
                  addedBackground: 'rgba(16, 185, 129, 0.1)',
                  addedColor: '#c9d1d9',
                  removedBackground: 'rgba(239, 68, 68, 0.1)',
                  removedColor: '#c9d1d9',
                  wordAddedBackground: 'rgba(16, 185, 129, 0.3)',
                  wordRemovedBackground: 'rgba(239, 68, 68, 0.3)',
                  addedGutterBackground: 'rgba(16, 185, 129, 0.15)',
                  removedGutterBackground: 'rgba(239, 68, 68, 0.15)',
                  gutterBackground: '#0d1320',
                  gutterBackgroundDark: '#0a1018',
                  highlightBackground: '#1f3044',
                  highlightGutterBackground: '#1a2840',
                  codeFoldGutterBackground: '#0d1320',
                  codeFoldBackground: '#0d1320',
                  emptyLineBackground: '#0d1320',
                  gutterColor: '#2a4a6b',
                  addedGutterColor: '#10b981',
                  removedGutterColor: '#ef4444',
                  codeFoldContentColor: '#4a6580',
                  diffViewerTitleBackground: '#0d1320',
                  diffViewerTitleColor: '#8892a4',
                  diffViewerTitleBorderColor: '#1e2d3d',
                },
              },
              line: {
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
              },
              gutter: {
                minWidth: '40px',
                padding: '0 8px',
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
