// Configurazione per React 19 e gestione errori di rendering
export const reactConfig = {
  // Configurazione per il rendering sicuro delle icone
  safeIconRendering: {
    enableErrorBoundary: true,
    enableFallback: true,
    enableAsyncLoading: true,
    retryAttempts: 3,
    retryDelay: 100,
  },
  
  // Configurazione per la gestione degli errori
  errorHandling: {
    enableConsoleLogging: true,
    enableErrorReporting: false,
    suppressHydrationWarnings: true,
  },
  
  // Configurazione per il rendering delle icone SVG
  svgRendering: {
    enableOptimization: true,
    enableFallbackToText: true,
    maxRetries: 2,
  }
}

// Funzione per configurare React per un rendering più stabile
export function configureReactForStability() {
  if (typeof window !== 'undefined') {
    // Sopprime gli avvisi di idratazione in sviluppo
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error
      console.error = (...args) => {
        if (args[0]?.includes?.('Hydration')) {
          return
        }
        originalConsoleError.apply(console, args)
      }
    }
    
    // Gestione migliore degli errori di rendering
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes?.('SVG')) {
        event.preventDefault()
        console.warn('SVG rendering error caught and handled:', event.error)
      }
    })
  }
}

// Funzione per verificare la compatibilità del browser
export function checkBrowserCompatibility() {
  if (typeof window !== 'undefined') {
    const supportsSVG = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    
    if (!supportsSVG) {
      console.warn('Browser does not support SVG, falling back to text icons')
      return false
    }
    
    return true
  }
  return true
}
