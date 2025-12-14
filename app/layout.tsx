import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastContainer } from "@/components/toast"
import { OfflineDetector } from "@/components/offline-detector"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Moonlight Destiny - Mystical Tic-Tac-Toe Game",
  description:
    "Align your stars in this enchanting tic-tac-toe experience. Play against destiny, win mystical promo codes, and embrace the cosmic journey.",
  keywords: ["tic-tac-toe", "mystical game", "moon and stars", "destiny game", "mobile game"],
  authors: [{ name: "Igor Polaris" }],
  creator: "Igor Polaris",
  generator: "v0.app",
  metadataBase: new URL("https://moonlight-destiny.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moonlight-destiny.vercel.app",
    title: "Moonlight Destiny - Mystical Tic-Tac-Toe Game",
    description:
      "Align your stars in this enchanting tic-tac-toe experience. Play against destiny and win mystical promo codes.",
    siteName: "Moonlight Destiny",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moonlight Destiny - Mystical Tic-Tac-Toe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonlight Destiny - Mystical Tic-Tac-Toe",
    description: "Align your stars in this enchanting tic-tac-toe experience.",
    images: ["/og-image.png"],
    creator: "@igorpolaris",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <OfflineDetector />
          {children}
          <ToastContainer />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
