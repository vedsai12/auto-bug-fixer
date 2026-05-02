'use client'

import { motion } from 'framer-motion'
import { Zap, Github, Settings, Moon, BookOpen } from 'lucide-react'

interface NavbarProps {
  historyCount: number
  onShowHistory: () => void
}

export default function Navbar({ historyCount, onShowHistory }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative z-50 flex items-center justify-between px-6 py-3 border-b border-border-subtle"
      style={{
        background: 'rgba(8, 12, 20, 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-neon-cyan">
            <Zap size={16} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-bg-primary animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-white text-lg tracking-tight">AutoFix</span>
            <span className="gradient-text font-bold text-lg">AI</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono -mt-0.5 tracking-wider">INTELLIGENT CODE REPAIR</div>
        </div>
      </div>

      {/* Center status */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-subtle bg-bg-secondary">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-slate-400 font-mono">claude-opus-4 · ready</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onShowHistory}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-border-subtle transition-all text-sm font-mono"
        >
          <BookOpen size={14} />
          <span className="hidden sm:block">History</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-cyan text-bg-primary text-[9px] font-bold flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-border-subtle transition-all text-sm"
        >
          <Github size={14} />
          <span className="hidden sm:block text-sm">GitHub</span>
        </a>

        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-border-subtle transition-all">
          <Settings size={14} />
        </button>
      </div>
    </motion.nav>
  )
}
