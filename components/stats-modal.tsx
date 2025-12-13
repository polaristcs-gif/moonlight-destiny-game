"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, TrendingUp, Award, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analytics } from "@/lib/analytics"
import { useEffect, useState } from "react"

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    averageGameTime: 0,
    lastPlayedAt: "",
  })

  useEffect(() => {
    if (isOpen) {
      const gameStats = analytics.getStats()
      setStats(gameStats)
    }
  }, [isOpen])

  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            {/* DARK GLASS CONTAINER */}
            <div className="bg-[#120B1E]/90 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.2)] p-6 space-y-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                  <h2 className="font-serif text-2xl font-bold text-white tracking-wide">Your Journey</h2>
                </div>
                <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center space-y-2">
                  <Target className="w-6 h-6 mx-auto text-purple-400" />
                  <p className="text-3xl font-bold text-white">{stats.totalGames}</p>
                  <p className="text-xs text-white/50 font-serif uppercase tracking-widest">Games Played</p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center space-y-2">
                  <TrendingUp className="w-6 h-6 mx-auto text-purple-400" />
                  <p className="text-3xl font-bold text-white">{winRate}%</p>
                  <p className="text-xs text-white/50 font-serif uppercase tracking-widest">Win Rate</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 px-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌙</span>
                    <span className="font-serif text-white/80">Victories</span>
                  </div>
                  <span className="text-lg font-bold text-purple-200">{stats.wins}</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 px-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <span className="font-serif text-white/80">Lessons</span>
                  </div>
                  <span className="text-lg font-bold text-white/60">{stats.losses}</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 px-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span className="font-serif text-white/80">Balance</span>
                  </div>
                  <span className="text-lg font-bold text-white/60">{stats.draws}</span>
                </div>
              </div>

              {stats.totalGames > 0 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-purple-200/50 font-serif italic">
                    {winRate >= 60 && "The stars smile upon you"}
                    {winRate >= 40 && winRate < 60 && "Balance guides your path"}
                    {winRate < 40 && "Every loss teaches wisdom"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
