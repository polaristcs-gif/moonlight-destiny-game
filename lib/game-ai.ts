type Player = "moon" | "star" | null
type Board = Player[]

const WINNING_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
]

export function checkWinner(board: Board): Player | "tie" | null {
  for (const pattern of WINNING_PATTERNS) {
    const [a, b, c] = pattern
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "tie"
  }

  return null
}

export function getWinningLine(board: Board): number[] | null {
  for (const pattern of WINNING_PATTERNS) {
    const [a, b, c] = pattern
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return pattern
    }
  }
  return null
}

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const winner = checkWinner(board)

  if (winner === "star") return 10 - depth
  if (winner === "moon") return depth - 10
  if (winner === "tie") return 0

  if (isMaximizing) {
    let bestScore = Number.NEGATIVE_INFINITY
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "star"
        const score = minimax(board, depth + 1, false)
        board[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Number.POSITIVE_INFINITY
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "moon"
        const score = minimax(board, depth + 1, true)
        board[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

export function getSmartMove(board: Board): number {
  const emptyCells = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null) as number[]

  if (emptyCells.length === 0) return -1

  if (Math.random() < 0.35) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)]
  }

  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove = emptyCells[0]

  for (const index of emptyCells) {
    board[index] = "star"
    const score = minimax(board, 0, false)
    board[index] = null

    if (score > bestScore) {
      bestScore = score
      bestMove = index
    }
  }

  return bestMove
}
