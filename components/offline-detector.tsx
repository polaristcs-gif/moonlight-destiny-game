"use client"

import { useEffect, useState } from "react"
import { WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial state
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-3 px-4 flex items-center justify-center gap-2 font-serif"
        >
          <WifiOff className="w-5 h-5" />
          <span>No internet connection</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
