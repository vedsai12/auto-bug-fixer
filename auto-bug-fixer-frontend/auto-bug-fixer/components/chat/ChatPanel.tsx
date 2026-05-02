'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, RotateCcw, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage, AnalysisResult, Language } from '@/lib/types'

interface ChatPanelProps {
  code: string
  language: Language
  analysisResult: AnalysisResult | null
}

const QUICK_PROMPTS = [
  "Explain the most critical bug",
  "How can I prevent these issues?",
  "Suggest a better architecture",
  "What design patterns apply here?",
]

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
        isUser
          ? 'bg-gradient-to-br from-accent-blue to-accent-purple'
          : 'bg-gradient-to-br from-accent-cyan/30 to-accent-blue/30 border border-accent-cyan/30'
      )}>
        {isUser ? <User size={13} className="text-white" /> : <Bot size={13} className="text-accent-cyan" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[85%] rounded-xl px-3.5 py-2.5',
        isUser ? 'chat-user rounded-tr-sm' : 'chat-ai rounded-tl-sm'
      )}>
        <div className="text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div className={cn(
          'text-[10px] font-mono mt-1 opacity-40',
          isUser ? 'text-right text-slate-300' : 'text-slate-500'
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-blue/30 border border-accent-cyan/30 flex items-center justify-center flex-shrink-0">
        <Bot size={13} className="text-accent-cyan" />
      </div>
      <div className="chat-ai rounded-xl rounded-tl-sm px-3.5 py-3">
        <div className="loading-dots flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block" />
        </div>
      </div>
    </div>
  )
}

export default function ChatPanel({ code, language, analysisResult }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: analysisResult
        ? `I've analyzed your ${language} code and found ${analysisResult.bugs.length} issue${analysisResult.bugs.length !== 1 ? 's' : ''}. Ask me anything about the bugs, fixes, or how to improve your code!`
        : `Hi! I'm AutoFix AI. Paste your code and run an analysis, then ask me anything about the results — bugs, fixes, best practices, or architecture advice.`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (text?: string) => {
    const content = text || input.trim()
    if (!content || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          codeContext: code,
          analysisContext: analysisResult,
        }),
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.error || 'Sorry, I encountered an error.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Connection error. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Chat cleared. Ask me anything about your code!',
      timestamp: new Date(),
    }])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-secondary">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-xs font-mono text-slate-400">AI Assistant</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
            claude-opus-4
          </span>
        </div>
        <button
          onClick={handleClear}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-border-subtle transition-all"
          title="Clear chat"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3">
          <p className="text-[10px] font-mono text-slate-600 mb-2 uppercase tracking-wider">Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-border-default text-slate-400 hover:text-accent-cyan hover:border-accent-cyan/40 hover:bg-accent-cyan/5 transition-all disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border-subtle bg-bg-secondary">
        <div className="flex items-end gap-2 p-2 rounded-xl border border-border-default bg-bg-primary focus-within:border-accent-cyan/40 focus-within:shadow-neon-cyan transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about bugs, fixes, patterns..."
            rows={1}
            disabled={isTyping}
            style={{ resize: 'none', minHeight: '36px', maxHeight: '120px' }}
            className="flex-1 bg-transparent text-sm font-mono text-slate-200 placeholder-slate-600 outline-none resize-none disabled:opacity-40"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              'p-2 rounded-lg transition-all flex-shrink-0',
              input.trim() && !isTyping
                ? 'bg-accent-cyan text-bg-primary hover:bg-cyan-300'
                : 'bg-border-subtle text-slate-600 cursor-not-allowed'
            )}
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p className="text-[10px] font-mono text-slate-700 mt-1.5 text-center">
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  )
}
