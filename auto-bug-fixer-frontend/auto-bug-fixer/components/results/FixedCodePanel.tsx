'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, CheckCheck, Code2, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { copyToClipboard, downloadCode } from '@/lib/utils'
import type { Language } from '@/lib/types'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface FixedCodePanelProps {
  fixedCode: string
  explanation: string
  suggestions: string[]
  language: Language
}

export default function FixedCodePanel({
  fixedCode,
  explanation,
  suggestions,
  language,
}: FixedCodePanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(fixedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    downloadCode(fixedCode, language)
  }

  return (
    <div className="space-y-4">
      {/* Fixed code editor */}
      <div className="rounded-xl border border-border-default overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Code2 size={13} className="text-green-400" />
            <span className="text-xs font-mono text-slate-400">fixed_code.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'typescript' ? 'ts' : 'js'}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-500/15 border border-green-500/30 text-green-400">
              ✓ fixed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-border-subtle transition-all"
            >
              {copied ? (
                <><CheckCheck size={12} className="text-green-400" /> Copied!</>
              ) : (
                <><Copy size={12} /> Copy</>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all"
            >
              <Download size={12} /> Download
            </motion.button>
          </div>
        </div>
        <div style={{ height: '280px' }}>
          <MonacoEditor
            height="280px"
            language={language === 'cpp' ? 'cpp' : language}
            value={fixedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              lineNumbers: 'on',
              wordWrap: 'on',
              folding: false,
              glyphMargin: false,
              lineDecorationsWidth: 4,
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('autofix-dark-fixed', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                  { token: 'comment', foreground: '4a6580', fontStyle: 'italic' },
                  { token: 'keyword', foreground: '00e5ff' },
                  { token: 'string', foreground: '10b981' },
                  { token: 'number', foreground: 'f59e0b' },
                ],
                colors: {
                  'editor.background': '#0a1628',
                  'editor.foreground': '#c9d1d9',
                  'editor.lineHighlightBackground': '#0f2040',
                  'editorLineNumber.foreground': '#2a4a6b',
                  'editorLineNumber.activeForeground': '#10b981',
                  'editor.selectionBackground': '#1f4068',
                  'editorCursor.foreground': '#10b981',
                },
              })
              monaco.editor.setTheme('autofix-dark-fixed')
            }}
          />
        </div>
      </div>

      {/* AI Explanation */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border-default bg-bg-secondary p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-accent-purple" />
            <span className="text-xs font-mono font-semibold text-accent-purple uppercase tracking-wider">AI Explanation</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-mono">{explanation}</p>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border-default bg-bg-secondary p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-accent-amber uppercase tracking-wider">💡 Optimization Suggestions</span>
          </div>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-2 text-sm text-slate-400 font-mono"
              >
                <span className="text-accent-amber mt-0.5 flex-shrink-0">→</span>
                <span>{s}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
