export const socialShare = {
  instagram(code: string) {
    // Instagram doesn't support direct web linking, copy to clipboard with instructions
    const text = `I won at Moonlight Destiny! 🌙✨\nMy code: ${code}\n${window.location.href}`
    navigator.clipboard.writeText(text)
    return {
      success: true,
      message: "Copied! Open Instagram and paste in your story or post.",
    }
  },

  facebook(code: string) {
    const url = encodeURIComponent(window.location.href)
    const quote = encodeURIComponent(`I won at Moonlight Destiny! 🌙✨ My mystical code: ${code}`)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, "_blank")
  },

  twitter(code: string) {
    const text = encodeURIComponent(`I won at Moonlight Destiny! 🌙✨ My mystical code: ${code}`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=MoonlightDestiny`, "_blank")
  },

  whatsapp(code: string) {
    const text = encodeURIComponent(`I won at Moonlight Destiny! 🌙✨ My code: ${code}\n${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, "_blank")
  },

  copyToClipboard(code: string) {
    const text = `I won at Moonlight Destiny! 🌙✨ My code: ${code}\n${window.location.href}`
    navigator.clipboard.writeText(text)
  },
}
