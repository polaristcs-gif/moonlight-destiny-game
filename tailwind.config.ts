import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(268, 20%, 22%)",
        input: "hsl(268, 20%, 22%)",
        ring: "hsl(268, 40%, 62%)",
        background: "hsl(268, 75%, 5%)",
        foreground: "hsl(0, 0%, 98%)",
        primary: {
          DEFAULT: "hsl(268, 40%, 62%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(268, 20%, 22%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 62%, 55%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(268, 20%, 15%)",
          foreground: "hsl(268, 10%, 65%)",
        },
        accent: {
          DEFAULT: "hsl(268, 40%, 62%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        popover: {
          DEFAULT: "hsl(268, 75%, 5%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        card: {
          DEFAULT: "hsl(268, 75%, 5%)",
          foreground: "hsl(0, 0%, 98%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}

export default config
