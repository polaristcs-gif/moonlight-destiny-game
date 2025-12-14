"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sparkles } from "lucide-react" // Используем нормальные иконки вместо эмодзи
import { getSmartMove, getWinningLine } from "@/lib/game-ai"
import { soundManager } from "@/lib/sounds"

type Player = "moon" | "star" | null
type Board = Player[]

interface GameBoardProps {
  onWin: () => void
  onLose: () => void
  onDraw: () => void
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export function GameBoard({ onWin, onLose, onDraw }: GameBoardProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [gameFinished, setGameFinished] = useState(false) // Флаг, чтобы остановить ИИ

  // Единая функция проверки состояния игры
  const checkGameStatus = (currentBoard: Board, lastPlayer: "moon" | "star") => {
    // 1. Сначала ищем победную линию (ПРИОРИТЕТ 1)
    const line = getWinningLine(currentBoard)
    
    if (line) {
      setWinningLine(line)
      setGameFinished(true)
      
      if (lastPlayer === "moon") {
        setTimeout(() => {
          soundManager.play("win")
          vibrate([50, 100, 50])
          onWin()
        }, 500)
      } else {
        setTimeout(() => {
          // soundManager.play("lose") // Если есть звук проигрыша
          vibrate(200)
          onLose()
        }, 500)
      }
      return true // Игра окончена
    }

    // 2. Если победы нет, проверяем ничью (ПРИОРИТЕТ 2)
    const isFull = currentBoard.every((cell) => cell !== null)
    if (isFull) {
      setGameFinished(true)
      setTimeout(() => {
        vibrate(30)
        onDraw()
      }, 500)
      return true // Игра окончена
    }

    return false // Игра продолжается
  }

  const handleCellClick = (index: number) => {
    // Блокируем клик, если занято, не ход игрока или игра все
    if (board[index] || !isPlayerTurn || gameFinished) return

    vibrate(10)
    soundManager.play("tap")

    const newBoard = [...board]
    newBoard[index] = "moon"
    setBoard(newBoard)
    setIsPlayerTurn(false)

    // Проверяем результат сразу после хода игрока
    checkGameStatus(newBoard, "moon")
  }

  // Ход ИИ
  useEffect(() => {
    if (!isPlayerTurn && !gameFinished) {
      const timer = setTimeout(() => {
        // Защита: если пока ждали, игра закончилась
        if (gameFinished) return 

        const moveIndex = getSmartMove([...board])
        
        if (moveIndex !== -1) {
          const newBoard = [...board]
          newBoard[moveIndex] = "star"
          setBoard(newBoard)
          soundManager.play("tap")

          // Проверяем результат после хода ИИ
          const isOver = checkGameStatus(newBoard, "star")
          
          if (!isOver) {
            setIsPlayerTurn(true)
          }
        } else {
            // Если ходов нет, но игра не помечена как finished (редкий кейс)
            setIsPlayerTurn(true)
        }
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameFinished, board]) // Убрал onWin/onLose из зависимостей, чтобы не триггерить лишний раз

  return (
    <div className="space-y-6">
      <div className="text-center holographic-glass rounded-2xl py-4 px-6 border border-white/10">
        <p className="font-serif text-xl md:text-2xl text-purple-100 tracking-wide glow-text">
          {gameFinished 
            ? (winningLine ? "Destiny Awaits..." : "Balance Restored") 
            : (isPlayerTurn ? "Your turn" : "Stars aligning...")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 holographic-glass-bright p-4 md:p-6 rounded-3xl shadow-2xl relative z-20">
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index)

          return (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isPlayerTurn || cell !== null || gameFinished}
              initial={{ scale: 0, opacity: 0, rotateY: 180 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateY: 0,
                boxShadow: isWinningCell
                  ? [
                      "0 0 0px rgba(139, 92, 246, 0)",
                      "0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(168, 85, 247, 0.7)",
                      "0 0 0px rgba(139, 92, 246, 0)",
                    ]
                  : "0 0 0px rgba(0, 0, 0, 0)",
              }}
              transition={{
                delay: index * 0.08,
                rotateY: { duration: 0.5, ease: "easeOut" },
                boxShadow: { duration: 1.5, repeat: isWinningCell ? Number.POSITIVE_INFINITY : 0 },
              }}
              whileHover={!cell && isPlayerTurn ? { scale: 1.08, backgroundColor: "rgba(168,85,247,0.15)", borderColor: "rgba(168,85,247,0.5)" } : {}}
              whileTap={{ scale: 0.92 }}
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                isWinningCell 
                  ? "bg-purple-500/30 border-purple-300/70" 
                  : cell 
                    ? "bg-black/30 border-purple-500/30" 
                    : "bg-black/20 border-purple-500/20 hover:border-purple-400/50"
              }`}
            >
              {cell === "moon" && (
                <motion.div
                  initial={{ opacity: 0, rotateY: -180, scale: 0.3 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Moon className="w-10 h-10 md:w-12 md:h-12 text-purple-200 fill-purple-300/30 drop-shadow-[0_0_15px_rgba(216,180,254,0.9)]" />
                </motion.div>
              )}
              {cell === "star" && (
                <motion.div
                  initial={{ opacity: 0, rotateY: 180, scale: 0.3 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-200 fill-yellow-200/30 drop-shadow-[0_0_15px_rgba(255,237,74,0.9)]" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
