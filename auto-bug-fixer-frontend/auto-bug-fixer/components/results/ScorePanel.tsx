'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Shield, Eye, Wrench, Star } from 'lucide-react'
import { getScoreColor, getScoreLabel, calculateOverallScore, cn } from '@/lib/utils'
import type { AnalysisScore } from '@/lib/types'

interface ScorePanelProps {
  score: AnalysisScore
  bugCount: number
  summary?: string
}

function CircleScore({ value, color }: { value: number; color: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width="90" height="90" className="-rotate-90">
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#1e2d3d" strokeWidth="6" />
      <motion.circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
      />
    </svg>
  )
}

function ScoreBar({
  label,
  value,
  icon,
  delay,
}: {
  label: string
  value: number
  icon: React.ReactNode
  delay: number
}) {
  const color = getScoreColor(value)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-slate-500">{icon}</div>
          <span className="text-xs font-mono text-slate-400">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-semibold" style={{ color }}>
            {value}%
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{
            background: `${color}18`,
            color,
            border: `1px solid ${color}30`
          }}>
            {getScoreLabel(value)}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default function ScorePanel({ score, bugCount, summary }: ScorePanelProps) {
  const overall = calculateOverallScore(score)
  const overallColor = getScoreColor(overall)

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-6 p-5 rounded-2xl border border-border-default bg-bg-secondary"
      >
        <div className="relative">
          <CircleScore value={overall} color={overallColor} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-bold" style={{ color: overallColor }}>
              {overall}
            </span>
            <span className="text-[9px] font-mono text-slate-500">SCORE</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} style={{ color: overallColor }} />
            <span className="font-display font-semibold text-white">
              {getScoreLabel(overall)}
            </span>
          </div>
          {summary && (
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{summary}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-mono text-slate-500">{bugCount} bug{bugCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border-subtle" />
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider px-2">Breakdown</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <div className="space-y-4">
          <ScoreBar
            label="Performance"
            value={score.performance}
            icon={<TrendingUp size={12} />}
            delay={0.1}
          />
          <ScoreBar
            label="Readability"
            value={score.readability}
            icon={<Eye size={12} />}
            delay={0.2}
          />
          <ScoreBar
            label="Security"
            value={score.security}
            icon={<Shield size={12} />}
            delay={0.3}
          />
          <ScoreBar
            label="Maintainability"
            value={score.maintainability}
            icon={<Wrench size={12} />}
            delay={0.4}
          />
        </div>
      </div>

      {/* Score legend */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { label: '80–100', desc: 'Excellent', color: '#10b981' },
          { label: '60–79', desc: 'Good/Fair', color: '#f59e0b' },
          { label: '0–59', desc: 'Needs Work', color: '#ef4444' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center p-2 rounded-lg border border-border-subtle bg-bg-secondary text-center"
          >
            <span className="text-[10px] font-mono font-semibold" style={{ color: item.color }}>
              {item.label}
            </span>
            <span className="text-[9px] font-mono text-slate-600 mt-0.5">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
