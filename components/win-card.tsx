"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Moon, Star, Instagram, Facebook, Twitter, MessageCircle, Copy, Check } from "lucide-react"
import { useState } from "react"
import { getRandomMessage } from "@/lib/mystical-messages"
import { socialShare } from "@/lib/social-share"
import { analytics } from "@/lib/analytics"
import { toast } from "@/components/toast"

interface WinCardProps {
  code: string
  onReset: () => void
}

// Конфиг твоего бота (убедись, что имя совпадает с page.tsx)
const BOT_USERNAME = "MoonlightDestinyBot";

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(40)].map((_, i) => {
        const angle = (i / 40) * Math.PI * 2
        const radius = 60 + (i % 3) * 40
        // Палитра частиц: Фиолетовый, Золотой, Белый
        const colors = ["#a855f7", "#fbbf24", "#ffffff"]
        const color = colors[i % colors.length]

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: "50%", top: "50%" }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * radius * (Math.random() + 0.5),
              y: Math.sin(angle) * radius * (Math.random() + 0.5),
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: i * 0.05,
              ease: "easeOut",
            }}
          >
            {/* Вместо эмодзи рендерим маленькие SVG */}
            {i % 3 === 0 ? (
              <Sparkles size={12} color={color} />
            ) : i % 3 === 1 ? (
              <Moon size={10} color={color} fill={color} />
            ) : (
              <Star size={8} color={color} fill={color} />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export function WinCard({ code, onReset }: WinCardProps) {
  // Формируем ссылку динамически
  const telegramLink = `https://t.me/${BOT_USERNAME}?start=${code}`
  
  // Безопасное получение сообщения (если файла нет, будет дефолт)
  const [mysticalMessage] = useState(() => {
    try {
      return getRandomMessage()
    } catch (e) {
      return "The stars align in your favor"
    }
  })

  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Copy failed", e)
    }
  }

  const handleSocialShare = (platform: "instagram" | "facebook" | "twitter" | "whatsapp") => {
    analytics.track("share_clicked", { platform })
    // Заглушка, если либа socialShare не настроена
    try {
        switch (platform) {
        case "instagram":
            // Копируем код в буфер
            navigator.clipboard.writeText(code);
            toast.success("Code copied for Instagram!");
            break
        case "facebook":
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
            break
        case "twitter":
            window.open(`https://twitter.com/intent/tweet?text=I%20won%20a%20mystical%20code%3A%20${code}&url=${encodeURIComponent(window.location.href)}`, '_blank');
            break
        case "whatsapp":
            window.open(`https://wa.me/?text=I%20won%20a%20mystical%20code%3A%20${code}`, '_blank');
            break
        }
    } catch (e) {
        console.warn("Share error", e);
    }
  }

  const handleClaim = () => {
    analytics.track("promo_claimed", { code })
    window.open(telegramLink, "_blank")
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Particles />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full"
      >
        <div className="bg-[#120B1E]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] p-8 space-y-8 border border-white/20">
          
          {/* HEADER */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 1 }}
              className="flex justify-center gap-4 mb-2"
            >
              <Moon className="w-16 h-16 text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
              <Sparkles className="w-16 h-16 text-yellow-200 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
            </motion.div>

            <h2 className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white tracking-wide drop-shadow-sm">
              Destiny Aligned!
            </h2>

            <div className="flex items-center justify-center gap-2 text-purple-200/80">
              <Sparkles className="w-3 h-3" />
              <p className="font-serif text-sm italic tracking-widest uppercase">{mysticalMessage}</p>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* CODE BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 rounded-2xl p-6 text-center border border-purple-500/30 relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <p className="font-serif text-xs text-purple-300 mb-3 tracking-[0.3em] uppercase">Your Mystical Code</p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-mono text-4xl md:text-5xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] select-all">
                  {code}
              </p>
              <button
                onClick={handleCopyCode}
                className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/30 transition-all"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-300" />
                )}
              </button>
            </div>
          </motion.div>

          {/* ACTIONS */}
          <div className="space-y-4">
            <Button
              onClick={handleClaim}
              className="w-full h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-serif text-lg rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-3 border border-white/10 group"
            >
              <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              <span className="tracking-widest uppercase">Claim in Telegram</span>
            </Button>

            <div className="pt-2">
              <p className="text-center text-xs text-white/40 font-serif mb-3 tracking-widest uppercase">Share your victory</p>
              <div className="flex justify-center gap-3">
                {[
                    { icon: Instagram, id: "instagram" },
                    { icon: Facebook, id: "facebook" },
                    { icon: Twitter, id: "twitter" },
                    { icon: MessageCircle, id: "whatsapp" }
                ].map((item) => (
                    <Button
                    key={item.id}
                    onClick={() => handleSocialShare(item.id as any)}
                    variant="outline"
                    size="icon"
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-purple-200 rounded-xl w-10 h-10 transition-colors"
                    >
                    <item.icon className="w-4 h-4" />
                    </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={onReset}
              variant="ghost"
              className="w-full text-white/30 hover:text-white font-serif tracking-widest text-xs uppercase hover:bg-transparent"
            >
              Play Again
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
