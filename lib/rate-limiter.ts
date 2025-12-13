export const rateLimiter = {
  canGeneratePromo(): { allowed: boolean; timeLeft?: number } {
    // DEV MODE: Всегда разрешаем генерацию для проверки тестового
    // В реальном продакшене тут была бы проверка (код ниже закомментирован)
    return { allowed: true };

    /* 
    if (typeof window === "undefined") return { allowed: true }

    const lastPromo = localStorage.getItem("last_promo_time")
    if (!lastPromo) return { allowed: true }

    const lastTime = Number.parseInt(lastPromo)
    const now = Date.now()
    const cooldown = 5 * 60 * 1000 // Reduced to 5 mins for soft prod

    if (now - lastTime < cooldown) {
      const timeLeft = Math.ceil((cooldown - (now - lastTime)) / 1000 / 60)
      return { allowed: false, timeLeft }
    }

    return { allowed: true }
    */
  },

  recordPromo() {
    if (typeof window === "undefined") return
    // Мы обновляем таймер, но проверка выше (canGeneratePromo) его игнорирует
    localStorage.setItem("last_promo_time", Date.now().toString())
    console.log("Promo recorded (Dev Mode active)");
  },

  reset() {
    if (typeof window === "undefined") return
    localStorage.removeItem("last_promo_time")
  },
}
