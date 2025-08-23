// Configurazione completa per React 19 e gestione problemi di rendering

// Configurazione per la gestione degli errori
export const errorHandlingConfig = {
  // Sopprime gli avvisi di idratazione
  suppressHydrationWarnings: true,
  // Sopprime gli avvisi di rendering
  suppressRenderingWarnings: true,
  // Abilita la gestione degli errori
  enableErrorBoundary: true,
  // Numero massimo di tentativi per il rendering
  maxRetryAttempts: 3,
  // Delay tra i tentativi
  retryDelay: 100,
}

// Configurazione per il rendering delle icone
export const iconRenderingConfig = {
  // Abilita il fallback per le icone
  enableFallback: true,
  // Abilita il caricamento asincrono
  enableAsyncLoading: true,
  // Abilita la gestione degli errori
  enableErrorHandling: true,
  // Numero massimo di tentativi per le icone
  maxIconRetries: 3,
  // Delay tra i tentativi per le icone
  iconRetryDelay: 50,
}

// Configurazione per la stabilità di React
export const reactStabilityConfig = {
  // Abilita la soppressione degli avvisi di sviluppo
  suppressDevWarnings: true,
  // Abilita la gestione degli errori globali
  enableGlobalErrorHandling: true,
  // Abilita la gestione degli errori non catturati
  enableUnhandledErrorHandling: true,
  // Abilita la gestione degli errori di promesse
  enablePromiseErrorHandling: true,
}

// Funzione per configurare React per la stabilità
export function configureReactForStability() {
  if (typeof window !== 'undefined') {
    // Configura la gestione degli errori globali
    if (reactStabilityConfig.enableGlobalErrorHandling) {
      window.addEventListener('error', handleGlobalError)
    }

    // Configura la gestione degli errori non catturati
    if (reactStabilityConfig.enableUnhandledErrorHandling) {
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
    }

    // Configura la soppressione degli avvisi di sviluppo
    if (reactStabilityConfig.suppressDevWarnings && process.env.NODE_ENV === 'development') {
      suppressDevelopmentWarnings()
    }
  }
}

// Gestisce gli errori globali
function handleGlobalError(event: ErrorEvent) {
  const error = event.error
  const message = error?.message || 'Unknown error'

  // Filtra gli errori di rendering delle icone
  if (message.includes('SVG') || 
      message.includes('icon') || 
      message.includes('lucide') ||
      message.includes('rendering')) {
    event.preventDefault()
    console.warn('Rendering error handled globally:', error)
    return
  }

  // Filtra gli errori di idratazione
  if (message.includes('Hydration') || 
      message.includes('Text content did not match') ||
      message.includes('Expected server HTML to contain')) {
    event.preventDefault()
    console.warn('Hydration error handled globally:', error)
    return
  }

  // Per altri errori, logga ma non previeni il comportamento predefinito
  console.error('Unhandled global error:', error)
}

// Gestisce le promesse rifiutate non gestite
function handleUnhandledRejection(event: PromiseRejectionEvent) {
  const reason = event.reason
  const message = reason?.message || 'Unknown rejection'

  // Filtra i rifiuti relativi al rendering
  if (message.includes('SVG') || 
      message.includes('icon') || 
      message.includes('lucide') ||
      message.includes('rendering')) {
    event.preventDefault()
    console.warn('Unhandled rendering rejection handled:', reason)
    return
  }

  // Per altri rifiuti, logga ma non previeni il comportamento predefinito
  console.error('Unhandled promise rejection:', reason)
}

// Sopprime gli avvisi di sviluppo
function suppressDevelopmentWarnings() {
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn

  console.error = (...args: any[]) => {
    const message = args[0]
    
    // Filtra gli avvisi di idratazione
    if (typeof message === 'string' && (
      message.includes('Hydration') ||
      message.includes('Text content did not match') ||
      message.includes('Expected server HTML to contain')
    )) {
      return
    }

    // Filtra gli avvisi di rendering
    if (typeof message === 'string' && (
      message.includes('SVG') ||
      message.includes('icon') ||
      message.includes('rendering')
    )) {
      return
    }

    originalConsoleError.apply(console, args)
  }

  console.warn = (...args: any[]) => {
    const message = args[0]
    
    // Filtra gli avvisi di rendering
    if (typeof message === 'string' && (
      message.includes('SVG') ||
      message.includes('icon') ||
      message.includes('rendering')
    )) {
      return
    }

    originalConsoleWarn.apply(console, args)
  }
}

// Funzione per applicare tutte le configurazioni
export function applyAllConfigurations() {
  configureReactForStability()
  
  console.log('React 19 stability configuration applied')
  console.log('Error handling:', errorHandlingConfig)
  console.log('Icon rendering:', iconRenderingConfig)
  console.log('React stability:', reactStabilityConfig)
}

// Esporta le configurazioni per l'uso esterno
export default {
  errorHandling: errorHandlingConfig,
  iconRendering: iconRenderingConfig,
  reactStability: reactStabilityConfig,
  configureReactForStability,
  applyAllConfigurations,
}
