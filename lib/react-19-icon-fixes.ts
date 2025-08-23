// Fix specifici per i problemi di rendering delle icone in React 19

import { useEffect, useState } from 'react'

// Hook per gestire il caricamento sicuro delle icone
export function useSafeIconLoading(iconComponent: any, fallback: string = "?") {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadIcon = async () => {
      try {
        if (!iconComponent) {
          setHasError(true)
          return
        }

        // Verifica se l'icona è valida
        if (typeof iconComponent === 'function' || typeof iconComponent === 'object') {
          // Simula un caricamento asincrono per evitare problemi di rendering
          await new Promise(resolve => setTimeout(resolve, 0))
          
          if (isMounted) {
            setIsLoaded(true)
            setHasError(false)
          }
        } else {
          setHasError(true)
        }
      } catch (error) {
        if (isMounted) {
          console.warn('Icon loading error:', error)
          setHasError(true)
        }
      }
    }

    loadIcon()

    return () => {
      isMounted = false
    }
  }, [iconComponent])

  const retry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      setHasError(false)
      setIsLoaded(false)
    }
  }

  return { isLoaded, hasError, retryCount, retry }
}

// Funzione per verificare se un'icona è valida
export function isValidIconComponent(icon: any): boolean {
  try {
    return icon && (
      typeof icon === 'function' || 
      typeof icon === 'object' ||
      React.isValidElement(icon)
    )
  } catch {
    return false
  }
}

// Funzione per creare un'icona di fallback
export function createFallbackIcon(fallback: string, className: string = "", size: number = 16) {
  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ 
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {fallback}
    </span>
  )
}

// Funzione per gestire gli errori di rendering delle icone
export function handleIconRenderingError(error: Error, iconName: string) {
  console.warn(`Icon rendering error for ${iconName}:`, error)
  
  // In produzione, potremmo voler inviare l'errore a un servizio di monitoraggio
  if (process.env.NODE_ENV === 'production') {
    // Qui potremmo inviare l'errore a un servizio come Sentry
    console.warn('Production error logged for icon:', iconName)
  }
}

// Configurazione per la gestione delle icone
export const iconConfig = {
  maxRetries: 3,
  retryDelay: 100,
  enableFallback: true,
  enableErrorBoundary: true,
  suppressWarnings: process.env.NODE_ENV === 'development',
}

// Funzione per applicare tutti i fix per le icone
export function applyIconFixes() {
  if (typeof window !== 'undefined') {
    // Gestisce gli errori di rendering delle icone SVG
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes?.('SVG') || 
          event.error?.message?.includes?.('icon') ||
          event.error?.message?.includes?.('lucide')) {
        event.preventDefault()
        console.warn('Icon rendering error handled:', event.error)
      }
    })

    // Gestisce anche gli errori non catturati
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes?.('SVG') ||
          event.reason?.message?.includes?.('icon') ||
          event.reason?.message?.includes?.('lucide')) {
        event.preventDefault()
        console.warn('Unhandled icon error handled:', event.reason)
      }
    })
  }
}
