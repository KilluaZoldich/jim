import { useState, useEffect } from 'react'
import { getSafeIcon, isValidIcon } from '@/lib/icon-config'

export function useIconLoader(iconName: keyof ReturnType<typeof getSafeIcon>) {
  const [icon, setIcon] = useState<{ component: any; fallback: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadIcon = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simula un caricamento asincrono per evitare problemi di rendering
        await new Promise(resolve => setTimeout(resolve, 0))

        if (isMounted) {
          const iconData = getSafeIcon(iconName)
          
          if (iconData && isValidIcon(iconData.component)) {
            setIcon(iconData)
          } else {
            setError(`Icona ${iconName} non valida`)
            setIcon({ component: null, fallback: "?" })
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(`Errore nel caricamento dell'icona: ${err}`)
          setIcon({ component: null, fallback: "?" })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadIcon()

    return () => {
      isMounted = false
    }
  }, [iconName])

  return { icon, isLoading, error }
}
