import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text, Work_Sans } from "next/font/google"
import "./globals.css"

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-crimson",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-work-sans",
})

export const metadata: Metadata = {
  title: "FitFlow - Your Personal Trainer",
  description: "Simple and beautiful fitness app for iPhone",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased bg-cream text-charcoal min-h-screen">{children}</body>
    </html>
  )
}
