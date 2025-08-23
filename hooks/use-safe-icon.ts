import { useState, useEffect } from 'react'

export function useSafeIcon(iconComponent: any) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (iconComponent) {
      try {
        // Verifica che l'icona sia valida
        if (typeof iconComponent === 'function' || typeof iconComponent === 'object') {
          setIsLoaded(true)
          setHasError(false)
        } else {
          setHasError(true)
        }
      } catch (error) {
        console.warn('Icon validation error:', error)
        setHasError(true)
      }
    }
  }, [iconComponent])

  return { isLoaded, hasError }
}
