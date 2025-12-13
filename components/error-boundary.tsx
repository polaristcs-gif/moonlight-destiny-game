"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Game error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <div className="text-6xl">🌙✨</div>
            <h2 className="font-serif text-3xl font-bold text-[#5B4B66]">Cosmic Interference</h2>
            <p className="text-[#8B7B8E]">The stars have shifted unexpectedly. Let's realign...</p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="w-full bg-[#C9B5D9] hover:bg-[#B8A3CC] text-white font-serif"
            >
              Reset the Universe
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
