'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, ChevronDown, Upload, Copy, Trash2,
  PlayCircle, FileCode, CheckCheck, Sparkles
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { LANGUAGE_OPTIONS, SAMPLE_CODES, copyToClipboard, cn } from '@/lib/utils'
import type { Language, LoadingStep } from '@/lib/types'
import { LOADING_STEPS } from '@/lib/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorPanelProps {
  code: string
  language: Language
  loadingStep: LoadingStep
  onCodeChange: (code: string) => void
  onLanguageChange: (lang: Language) => void
  onAnalyze: () => void
}

export default function CodeEditorPanel({
  code,
  language,
  loadingStep,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
}: CodeEditorPanelProps) {
  const [langOpen, setLangOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const isLoading = loadingStep !== 'idle' && loadingStep !== 'done'

  const currentLang = LANGUAGE_OPTIONS.find(l => l.value === language)!

  const handleCopy = async () => {
    await copyToClipboard(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      onCodeChange(text)
    }
    reader.readAsText(file)
  }

  const handleLoadSample = () => {
    onCodeChange(SAMPLE_CODES[language])
  }

  const currentStep = LOADING_STEPS.findIndex(s => s.step === loadingStep)

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-secondary">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <Code2 size={14} className="text-accent-cyan" />
            <span className="text-sm font-mono text-slate-300">code_editor</span>
            <span className="text-xs text-slate-600">//</span>
            <span className="text-xs text-slate-500 font-mono">{code.split('\n').length} lines</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-bg-primary hover:border-accent-cyan/40 transition-all text-sm font-mono text-slate-300"
            >
              <FileCode size={12} className="text-accent-blue" />
              {currentLang.label}
              <ChevronDown size={12} className={cn('transition-transform', langOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-border-default bg-bg-card shadow-glass overflow-hidden"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onLanguageChange(opt.value)
                        setLangOpen(false)
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm font-mono transition-colors',
                        opt.value === language
                          ? 'bg-accent-cyan/10 text-accent-cyan'
                          : 'text-slate-400 hover:bg-border-subtle hover:text-white'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleLoadSample}
            title="Load sample code"
            className="p-1.5 rounded-lg text-slate-500 hover:text-accent-purple hover:bg-accent-purple/10 transition-all"
          >
            <Sparkles size={14} />
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            title="Upload file"
            className="p-1.5 rounded-lg text-slate-500 hover:text-accent-blue hover:bg-accent-blue/10 transition-all"
          >
            <Upload size={14} />
          </button>
          <input ref={fileRef} type="file" accept=".js,.ts,.py,.java,.go,.rs,.cpp,.c" className="hidden" onChange={handleFileUpload} />

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all"
          >
            {copied ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>

          <button
            onClick={() => onCodeChange('')}
            title="Clear code"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative overflow-hidden">
        <MonacoEditor
          height="100%"
          language={currentLang.monacoLang}
          value={code}
          onChange={(val) => onCodeChange(val || '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'expand',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            lineDecorationsWidth: 8,
            glyphMargin: false,
            folding: true,
            wordWrap: 'on',
            tabSize: 2,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('autofix-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'comment', foreground: '4a6580', fontStyle: 'italic' },
                { token: 'keyword', foreground: '00e5ff' },
                { token: 'string', foreground: '10b981' },
                { token: 'number', foreground: 'f59e0b' },
                { token: 'type', foreground: '8b5cf6' },
              ],
              colors: {
                'editor.background': '#0d1320',
                'editor.foreground': '#c9d1d9',
                'editor.lineHighlightBackground': '#162032',
                'editorLineNumber.foreground': '#2a4a6b',
                'editorLineNumber.activeForeground': '#00e5ff',
                'editor.selectionBackground': '#1f4068',
                'editorCursor.foreground': '#00e5ff',
                'editor.findMatchBackground': '#f59e0b33',
                'editorWidget.background': '#0d1320',
                'editorSuggestWidget.background': '#0d1320',
                'editorSuggestWidget.border': '#1f3044',
              },
            })
            monaco.editor.setTheme('autofix-dark')
          }}
        />

        {/* Empty state */}
        <AnimatePresence>
          {!code && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ background: 'rgba(13, 19, 32, 0.7)' }}
            >
              <div className="text-center space-y-3 pointer-events-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border border-accent-cyan/20 flex items-center justify-center mx-auto">
                  <Code2 size={28} className="text-accent-cyan/60" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Paste your code or</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={handleLoadSample}
                      className="text-accent-cyan text-sm hover:underline font-mono"
                    >
                      load a sample
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="text-accent-blue text-sm hover:underline font-mono"
                    >
                      upload a file
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze button */}
      <div className="p-4 border-t border-border-subtle bg-bg-secondary">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Progress steps */}
              <div className="flex justify-between">
                {LOADING_STEPS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.3 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all',
                        i < currentStep
                          ? 'bg-green-500/20 border border-green-500/40'
                          : i === currentStep
                          ? 'bg-accent-cyan/20 border border-accent-cyan/40 animate-pulse'
                          : 'bg-border-subtle border border-border-default'
                      )}
                    >
                      {i < currentStep ? '✓' : step.icon}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 hidden sm:block">{step.label.split(' ')[0]}</span>
                  </motion.div>
                ))}
              </div>

              {/* Current step label */}
              <div className="text-center">
                <span className="text-xs font-mono text-accent-cyan animate-pulse">
                  {LOADING_STEPS.find(s => s.step === loadingStep)?.label || 'Processing...'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full"
                  animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onAnalyze}
              disabled={!code.trim()}
              className={cn(
                'w-full py-3 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                code.trim()
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-primary hover:shadow-neon-cyan cursor-pointer'
                  : 'bg-border-subtle text-slate-600 cursor-not-allowed'
              )}
            >
              <PlayCircle size={16} />
              Analyze with AI
              {code.trim() && (
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.div>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
