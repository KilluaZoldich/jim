import type React from "react"
import type { Metadata, Viewport } from "next"
import { Crimson_Text, Work_Sans } from "next/font/google"
import "./globals.css"
import PWAInstallPrompt from "@/src/components/pwa-install-prompt"
import { IOSOptimizations } from "@/components/ui/ios-optimizations"
import ErrorBoundary from "@/components/ui/error-boundary"
import { configureReactForStability } from "@/lib/react-config"
import { applyAllFixes } from "@/lib/react-19-fixes"
import { applyAllConfigurations } from "@/lib/react-19-config"

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
  viewportFit: "cover",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FitnessApp" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/jim/icon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/jim/favicon.ico" />
        <link rel="manifest" href="/jim/manifest.json" />
      </head>
      <body className="font-sans antialiased bg-cream text-charcoal min-h-screen">
        <IOSOptimizations>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </IOSOptimizations>
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
                        __html: `
              // Applica la configurazione completa per React 19
              if (typeof window !== 'undefined') {
                // Configurazione per la gestione degli errori globali
                window.addEventListener('error', function(event) {
                  const error = event.error;
                  const message = error?.message || 'Unknown error';
                  
                  // Filtra gli errori di rendering delle icone
                  if (message.includes('SVG') || 
                      message.includes('icon') || 
                      message.includes('lucide') ||
                      message.includes('rendering')) {
                    event.preventDefault();
                    console.warn('Rendering error handled globally:', error);
                    return;
                  }
                  
                  // Filtra gli errori di idratazione
                  if (message.includes('Hydration') || 
                      message.includes('Text content did not match') ||
                      message.includes('Expected server HTML to contain')) {
                    event.preventDefault();
                    console.warn('Hydration error handled globally:', error);
                    return;
                  }
                });
                
                // Gestisce le promesse rifiutate non gestite
                window.addEventListener('unhandledrejection', function(event) {
                  const reason = event.reason;
                  const message = reason?.message || 'Unknown rejection';
                  
                  // Filtra i rifiuti relativi al rendering
                  if (message.includes('SVG') || 
                      message.includes('icon') || 
                      message.includes('lucide') ||
                      message.includes('rendering')) {
                    event.preventDefault();
                    console.warn('Unhandled rendering rejection handled:', reason);
                    return;
                  }
                });
                
                // Sopprime gli avvisi di sviluppo
                if (process.env.NODE_ENV === 'development') {
                  const originalConsoleError = console.error;
                  const originalConsoleWarn = console.warn;
                  
                  console.error = function(...args) {
                    const message = args[0];
                    
                    // Filtra gli avvisi di idratazione
                    if (typeof message === 'string' && (
                      message.includes('Hydration') ||
                      message.includes('Text content did not match') ||
                      message.includes('Expected server HTML to contain')
                    )) {
                      return;
                    }
                    
                    // Filtra gli avvisi di rendering
                    if (typeof message === 'string' && (
                      message.includes('SVG') ||
                      message.includes('icon') ||
                      message.includes('rendering')
                    )) {
                      return;
                    }
                    
                    originalConsoleError.apply(console, args);
                  };
                  
                  console.warn = function(...args) {
                    const message = args[0];
                    
                    // Filtra gli avvisi di rendering
                    if (typeof message === 'string' && (
                      message.includes('SVG') ||
                      message.includes('icon') ||
                      message.includes('rendering')
                    )) {
                      return;
                    }
                    
                    originalConsoleWarn.apply(console, args);
                  };
                }
              }
              
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
