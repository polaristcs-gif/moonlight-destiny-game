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
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: isWinningCell
                  ? [
                      "0 0 0px rgba(139, 92, 246, 0)",
                      "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(168, 85, 247, 0.6)",
                      "0 0 0px rgba(139, 92, 246, 0)",
                    ]
                  : "0 0 0px rgba(0, 0, 0, 0)",
              }}
              transition={{
                delay: index * 0.05,
                boxShadow: { duration: 1.5, repeat: isWinningCell ? Number.POSITIVE_INFINITY : 0 },
              }}
              whileHover={!cell && isPlayerTurn ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square holographic-glass rounded-xl flex items-center justify-center transition-all duration-300 ${
                isWinningCell ? "bg-white/20 border-white/50" : "hover:bg-white/5"
              }`}
            >
              {cell === "moon" && (
                <motion.div
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* ЯВНО ЗАДАЕМ ЦВЕТ И РАЗМЕР ИКОНКИ */}
                  <Moon className="w-8 h-8 md:w-10 md:h-10 text-purple-200 fill-purple-200/20 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]" />
                </motion.div>
              )}
              {cell === "star" && (
                <motion.div
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {/* ИКОНКА ИИ - БЕЛАЯ/ЗОЛОТАЯ С ГЛОУ */}
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-100 fill-yellow-100/20 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
