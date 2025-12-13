"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "info"

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

let toastCallbacks: ((toast: Omit<ToastMessage, "id">) => void)[] = []

export const toast = {
  show(message: string, type: ToastType = "info") {
    toastCallbacks.forEach((callback) => callback({ message, type }))
  },
  success(message: string) {
    this.show(message, "success")
  },
  error(message: string) {
    this.show(message, "error")
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const callback = (toast: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36)
      setToasts((prev) => [...prev, { ...toast, id }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
    toastCallbacks.push(callback)
    return () => {
      toastCallbacks = toastCallbacks.filter((cb) => cb !== callback)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl font-serif border border-white/10 ${
              toast.type === "success"
                ? "bg-emerald-900/90 text-emerald-100 shadow-emerald-900/20"
                : toast.type === "error"
                  ? "bg-rose-900/90 text-rose-100 shadow-rose-900/20"
                  : "bg-indigo-900/90 text-indigo-100 shadow-indigo-900/20"
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
