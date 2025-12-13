class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled = true

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.warn("[v0] Audio not supported")
      }
    }
  }

  private playTone(frequency: number, duration: number, volume = 0.1) {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  play(sound: "tap" | "win") {
    if (sound === "tap") {
      // Soft magical tap sound
      this.playTone(800, 0.1, 0.05)
    } else if (sound === "win") {
      // Magical win chime sequence
      this.playTone(523.25, 0.15, 0.08) // C5
      setTimeout(() => this.playTone(659.25, 0.15, 0.08), 100) // E5
      setTimeout(() => this.playTone(783.99, 0.3, 0.1), 200) // G5
    }
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }
}

export const soundManager = new SoundManager()
