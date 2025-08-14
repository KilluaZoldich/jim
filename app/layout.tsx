import type React from "react"
import type { Metadata, Viewport } from "next"
import { Crimson_Text, Work_Sans } from "next/font/google"
import "./globals.css"
import PWAInstallPrompt from "@/src/components/pwa-install-prompt"

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
  title: "Fitness Tracker App",
  description: "A modern fitness tracking application for workout management and progress tracking",
  generator: "Next.js",
  manifest: "/jim/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FitnessApp",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Fitness Tracker App",
    title: "Fitness Tracker App",
    description: "A modern fitness tracking application for workout management and progress tracking",
  },
  twitter: {
    card: "summary",
    title: "Fitness Tracker App",
    description: "A modern fitness tracking application for workout management and progress tracking",
  },
}

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${crimsonText.variable} ${workSans.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FitnessApp" />
        <link rel="apple-touch-icon" href="/jim/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/jim/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-cream text-charcoal min-h-screen">
        {children}
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/jim/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
