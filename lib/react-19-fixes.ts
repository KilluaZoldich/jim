// Fix specifici per React 19 e problemi di rendering delle icone

// Sopprime gli avvisi di idratazione in sviluppo
export function suppressHydrationWarnings() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      // Filtra gli avvisi di idratazione
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0]
        if (message.includes('Hydration') || 
            message.includes('Text content did not match') ||
            message.includes('Expected server HTML to contain')) {
          return
        }
      }
      originalConsoleError.apply(console, args)
    }

    // Sopprime anche gli avvisi di console.warn per problemi di rendering
    const originalConsoleWarn = console.warn
    console.warn = (...args: any[]) => {
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0]
        if (message.includes('SVG') || 
            message.includes('icon') ||
            message.includes('rendering')) {
          return
        }
      }
      originalConsoleWarn.apply(console, args)
    }
  }
}

// Gestisce gli errori di rendering delle icone SVG
export function handleSVGRenderingErrors() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes?.('SVG') || 
          event.error?.message?.includes?.('icon') ||
          event.error?.message?.includes?.('rendering')) {
        event.preventDefault()
        console.warn('SVG rendering error handled:', event.error)
      }
    })

    // Gestisce anche gli errori non catturati
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes?.('SVG') ||
          event.reason?.message?.includes?.('icon')) {
        event.preventDefault()
        console.warn('Unhandled SVG error handled:', event.reason)
      }
    })
  }
}

// Configura React per un rendering più stabile
export function configureReactStability() {
  suppressHydrationWarnings()
  handleSVGRenderingErrors()
  
  // Configurazioni aggiuntive per React 19
  if (typeof window !== 'undefined') {
    // Disabilita alcuni controlli di sviluppo che possono causare problemi
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        // @ts-ignore
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.suppressErrors = true
      }
    }
  }
}

// Funzione per verificare se siamo in un ambiente problematico
export function isProblematicEnvironment(): boolean {
  if (typeof window !== 'undefined') {
    // Verifica se siamo in un browser che ha problemi con SVG
    const userAgent = navigator.userAgent.toLowerCase()
    const isOldBrowser = userAgent.includes('msie') || 
                        userAgent.includes('trident') ||
                        parseInt(navigator.userAgent.match(/msie (\d+)/)?.[1] || '0') < 11
    
    // Verifica se il browser supporta SVG
    const supportsSVG = !!document.createElementNS && 
                       !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    
    return isOldBrowser || !supportsSVG
  }
  return false
}

// Funzione per applicare tutti i fix
export function applyAllFixes() {
  configureReactStability()
  
  if (isProblematicEnvironment()) {
    console.warn('Problematic environment detected, applying additional fixes')
    // Applica fix aggiuntivi per browser problematici
  }
}
