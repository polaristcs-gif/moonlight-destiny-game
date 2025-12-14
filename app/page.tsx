"use client"

import { useState, useEffect } from "react"
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
  const [stars, setStars] = useState<Array<{id: number, size: number, top: number, left: number, opacity: number}>>([])

  // Генерируем звёзды только на клиенте
  useEffect(() => {
    const generatedStars = [...Array(25)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3
    }))
    setStars(generatedStars)
  }, [])

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#08050d] text-white font-sans">
      
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* ФОН - ГЛУБОКИЙ КОСМОС + ЯРКИЕ ТУМАННОСТИ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Базовый градиент - очень темный */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08050f] via-[#0d0818] via-[#100a1a] to-[#08050d]" />
        
        {/* Яркие туманности на темном фоне */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.75, 0.5], x: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-25%] left-[-20%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-purple-500/60 blur-[100px] sm:blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1.3, 0.9, 1.3], opacity: [0.4, 0.65, 0.4], y: [0, -50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[5%] right-[-25%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full bg-fuchsia-400/50 blur-[90px] sm:blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.45, 0.7, 0.45], x: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[-20%] left-[0%] w-[420px] h-[420px] sm:w-[600px] sm:h-[600px] rounded-full bg-violet-400/55 blur-[95px] sm:blur-[130px]" 
        />
        <motion.div 
          animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          className="absolute top-[45%] right-[5%] w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] rounded-full bg-pink-400/40 blur-[70px] sm:blur-[100px]" 
        />
        
        {/* Центральное свечение - ярче */}
        <motion.div 
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-purple-400/25 blur-[100px]" 
        />
        
        {/* Сетка киберпанк */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* ЗВЕЗДЫ - статичные для производительности */}
      {stars.length > 0 && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{ 
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.5)`
              }}
            />
          ))}
        </div>
      )}

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
            <div className="text-center w-full flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[28px] xs:text-[36px] sm:text-[50px] md:text-[65px] font-serif font-bold pointer-events-none select-none mb-2"
                style={{ 
                  letterSpacing: '0.15em',
                  color: 'transparent',
                  background: 'linear-gradient(180deg, rgba(192,132,252,0.9) 0%, rgba(139,92,246,0.5) 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  textShadow: '0 0 60px rgba(168, 85, 247, 1), 0 0 100px rgba(139, 92, 246, 0.6)'
                }}
              >
                MOONLIGHT
              </motion.div>
              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-[0.15em] sm:tracking-[0.2em]"
                style={{ 
                  textShadow: '0 0 50px rgba(168, 85, 247, 1), 0 0 100px rgba(217, 70, 239, 0.6), 0 4px 8px rgba(0,0,0,0.8)',
                  background: 'linear-gradient(180deg, #f5d0fe 0%, #ffffff 30%, #e9d5ff 60%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                DESTINY
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-4 text-sm text-purple-200/80 italic tracking-[0.3em] uppercase"
                style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
              >
                Align Your Stars
              </motion.p>
            </div>

            <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-300 rounded-full"
                     style={{ boxShadow: '0 0 15px #a855f7, 0 0 30px #a855f7' }} />
              </motion.div>
              <div className="relative z-10 flex gap-4">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                  <Moon className="w-12 h-12 text-purple-100" style={{ filter: 'drop-shadow(0 0 20px rgba(216, 180, 254, 0.9)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.5))' }} />
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                  <Sparkles className="w-11 h-11 text-yellow-200" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 237, 74, 0.9)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.5))' }} />
                </motion.div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <Button
                onClick={startGame}
                disabled={isLoading}
                className="w-full h-14 sm:h-16 relative overflow-hidden border-2 border-purple-400/60 rounded-2xl bg-transparent shadow-xl shadow-purple-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-500 via-fuchsia-500 to-violet-600 opacity-90 hover:opacity-100 transition-opacity"
                     style={{ backgroundSize: "300% auto", animation: "gradient-x 4s ease infinite" }} />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <span className="text-lg font-bold tracking-[0.15em] drop-shadow-lg">BEGIN DESTINY</span>
                      <Play className="w-5 h-5 fill-current" />
                    </>
                  )}
                </div>
              </Button>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={showRules}
                  className="group relative flex items-center justify-center gap-2 py-4 rounded-xl bg-black/40 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-900/30 transition-all duration-300 overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/20 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <HelpCircle className="w-5 h-5 text-purple-300" />
                  <span className="text-sm font-semibold tracking-wider text-purple-100">RULES</span>
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className="group relative flex items-center justify-center gap-2 py-4 rounded-xl bg-black/40 border-2 border-fuchsia-500/50 hover:border-fuchsia-400 hover:bg-fuchsia-900/30 transition-all duration-300 overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(217, 70, 239, 0.3), inset 0 0 20px rgba(217, 70, 239, 0.1)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/0 via-fuchsia-500/20 to-fuchsia-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <BarChart3 className="w-5 h-5 text-fuchsia-300" />
                  <span className="text-sm font-semibold tracking-wider text-fuchsia-100">STATS</span>
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
