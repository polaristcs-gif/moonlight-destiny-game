"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GameBoard } from "@/components/game-board"
import { WinCard } from "@/components/win-card"
import { HelpCircle, Sparkles, BarChart3, Moon, Play } from "lucide-react"
import { rateLimiter } from "@/lib/rate-limiter"
import { analytics } from "@/lib/analytics"
import { toast } from "@/components/toast"
import { StatsModal } from "@/components/stats-modal"

type GameState = "start" | "playing" | "win" | "lose" | "draw" | "rules"

export default function MoonlightDestiny() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [winCode, setWinCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // --- НАСТРОЙКИ ТЕЛЕГРАМА ---
  const TG_BOT_TOKEN = "8352828151:AAF-LMBxlvy1N3sBcY_qhm-D386g5WuqYzQ"; 
  const TG_ADMIN_ID = "ТВОЙ_ID_ЦИФРАМИ"; 
  // ---------------------------

  const startGame = () => {
    setIsLoading(true)
    analytics.track("game_started")
    setTimeout(() => {
      setIsLoading(false)
      setGameState("playing")
    }, 1000)
  }

  const showRules = () => setGameState("rules")

  // Отчет админу
  const notifyAdmin = async (code: string, result: "WIN" | "LOSE") => {
    if (TG_ADMIN_ID === "ТВОЙ_ID_ЦИФРАМИ") return;

    const text = result === "WIN" 
      ? `🏆 *JACKPOT!* Юзер выиграл промокод: \`${code}\``
      : `💀 Юзер проиграл.`;

    try {
      await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_ADMIN_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.error("TG Error:", e);
    }
  }

  const handleWin = () => {
    // ГЕНЕРАЦИЯ 5 СИМВОЛОВ (По ТЗ)
    const generateCode = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    const randomCode = generateCode()
    setWinCode(randomCode)
    
    rateLimiter.recordPromo()
    analytics.track("game_won", { code: randomCode })
    notifyAdmin(randomCode, "WIN");
    setGameState("win")
  }

  const handleLose = () => {
    analytics.track("game_lost")
    notifyAdmin("", "LOSE");
    setGameState("lose")
  }

  const handleDraw = () => {
    analytics.track("game_draw")
    setGameState("draw")
  }

  const resetGame = () => setGameState("start")

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0514] text-white font-sans">
      
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* ФОН */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black opacity-90" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-900/30 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full bg-violet-900/25 blur-[130px]" 
        />
      </div>

      {/* ЗВЕЗДЫ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 2.5 + 1
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ 
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: `0 0 ${size * 4}px rgba(255, 255, 255, 0.7)`
              }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* START SCREEN */}
        {gameState === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center space-y-10 max-w-lg w-full px-6"
          >
            <div className="text-center relative w-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 1 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 text-[70px] sm:text-[90px] md:text-[110px] font-serif font-bold text-white pointer-events-none whitespace-nowrap"
                style={{ letterSpacing: '0.1em' }}
              >
                MOONLIGHT
              </motion.div>
              <motion.h1
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative pt-16 text-6xl sm:text-7xl md:text-8xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-purple-100 via-white to-purple-300"
                style={{ filter: 'drop-shadow(0 0 25px rgba(192, 132, 252, 0.5))' }}
              >
                DESTINY
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 text-sm text-purple-200/70 italic tracking-widest"
              >
                ALIGN YOUR STARS
              </motion.p>
            </div>

            <div className="relative h-32 w-32 flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"
                     style={{ boxShadow: '0 0 12px #a855f7' }} />
              </motion.div>
              <div className="relative z-10 flex gap-4">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                  <Moon className="w-11 h-11 text-purple-200" style={{ filter: 'drop-shadow(0 0 12px rgba(216, 180, 254, 0.7))' }} />
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Sparkles className="w-10 h-10 text-yellow-100" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 237, 74, 0.7))' }} />
                </motion.div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <Button
                onClick={startGame}
                disabled={isLoading}
                className="w-full h-14 relative overflow-hidden border border-purple-500/30 rounded-xl bg-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-80 hover:opacity-100 transition-opacity"
                     style={{ backgroundSize: "200% auto", animation: "gradient-x 3s linear infinite" }} />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <span className="text-base font-semibold tracking-wider">BEGIN DESTINY</span>
                      <Play className="w-4 h-4 fill-current" />
                    </>
                  )}
                </div>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={showRules}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm">Rules</span>
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Stats</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* RULES */}
        {gameState === "rules" && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
              Cosmic Laws
            </h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Moon className="w-6 h-6 text-purple-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">You are the Moon</h3>
                  <p className="text-xs text-purple-200/60">Align three moons to unlock the code</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-yellow-100" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Against the Stars</h3>
                  <p className="text-xs text-purple-200/60">The universe will try to block you</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button onClick={resetGame} className="flex-1 bg-transparent border border-white/20 hover:bg-white/5">Back</Button>
              <Button onClick={startGame} className="flex-1 bg-purple-600 hover:bg-purple-500">Play Now</Button>
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-lg px-4 flex flex-col items-center"
          >
            <div className="w-full min-h-[450px] flex items-center justify-center">
              <div className="w-full max-w-[480px]">
                <GameBoard onWin={handleWin} onLose={handleLose} onDraw={handleDraw} />
              </div>
            </div>
            <button onClick={resetGame} className="mt-8 text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-white/30">
              Abort Mission
            </button>
          </motion.div>
        )}

        {/* WIN */}
        {gameState === "win" && (
          <motion.div
            key="win"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* ТЕПЕРЬ ТОЛЬКО WINCARD. Дубль удален. */}
            <WinCard code={winCode} onReset={resetGame} />
          </motion.div>
        )}

        {/* LOSE / DRAW */}
        {(gameState === "lose" || gameState === "draw") && (
          <motion.div 
            key="end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center"
          >
            <div className="mb-6">
              {gameState === "lose" ? (
                <div className="relative inline-block opacity-50">
                  <Moon className="w-20 h-20 text-gray-600" />
                  <span className="absolute inset-0 flex items-center justify-center text-3xl">❌</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 opacity-70">
                  <Moon className="w-10 h-10 text-purple-300" />
                  <div className="w-px h-10 bg-white/20" />
                  <Sparkles className="w-10 h-10 text-yellow-200" />
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-3">{gameState === "lose" ? "Almost There" : "Cosmic Balance"}</h2>
            <p className="text-purple-100/60 italic mb-8">{gameState === "lose" ? "The stars aligned against you. Try again!" : "Neither force prevailed. Perfect equilibrium."}</p>
            <Button onClick={resetGame} className="w-full py-6 text-lg tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
              {gameState === "lose" ? "TRY AGAIN" : "REALIGN STARS"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
    </div>
  )
}
