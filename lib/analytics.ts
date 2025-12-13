type GameEvent = "game_started" | "game_won" | "game_lost" | "game_draw" | "promo_claimed" | "share_clicked"

interface GameAnalytics {
  totalGames: number
  wins: number
  losses: number
  draws: number
  averageGameTime: number
  lastPlayedAt: string
}

export const analytics = {
  track(event: GameEvent, data?: Record<string, any>) {
    if (typeof window === "undefined") return

    const timestamp = new Date().toISOString()
    const eventData = {
      event,
      timestamp,
      ...data,
    }

    // Store locally for user stats
    const events = this.getEvents()
    events.push(eventData)
    localStorage.setItem("moonlight_events", JSON.stringify(events.slice(-100))) // Keep last 100 events

    // Send to backend if available
    this.sendToBackend(eventData)
  },

  getEvents() {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("moonlight_events") || "[]")
    } catch {
      return []
    }
  },

  getStats(): GameAnalytics {
    const events = this.getEvents()
    const games = events.filter((e: any) => e.event === "game_started")
    const wins = events.filter((e: any) => e.event === "game_won")
    const losses = events.filter((e: any) => e.event === "game_lost")
    const draws = events.filter((e: any) => e.event === "game_draw")

    return {
      totalGames: games.length,
      wins: wins.length,
      losses: losses.length,
      draws: draws.length,
      averageGameTime: 0,
      lastPlayedAt: games[games.length - 1]?.timestamp || "",
    }
  },

  async sendToBackend(eventData: any) {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
    } catch (error) {
      console.log("Analytics tracking failed (non-critical)")
    }
  },
}
