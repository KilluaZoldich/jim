"use client"

import { useEffect } from "react"
import { useIsIPhone, useIsIOS } from "./use-mobile"

interface IOSOptimizationsProps {
  children: React.ReactNode
}

export function IOSOptimizations({ children }: IOSOptimizationsProps) {
  const isIPhone = useIsIPhone()
  const isIOS = useIsIOS()

  useEffect(() => {
    if (isIOS) {
      // Ottimizzazioni per iOS
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)')
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)')
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)')
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)')
      
      // Prevenire zoom su input su iOS
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault()
        }
      }
      
      document.addEventListener('touchstart', preventZoom, { passive: false })
      
      // Ottimizzazioni per iPhone specifiche
      if (isIPhone) {
        // Migliorare la performance del touch
        document.body.style.setProperty('-webkit-touch-callout', 'none')
        document.body.style.setProperty('-webkit-user-select', 'none')
        document.body.style.setProperty('-webkit-tap-highlight-color', 'transparent')
        
        // Ottimizzare per notch e Dynamic Island
        const meta = document.createElement('meta')
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        document.head.appendChild(meta)
      }
      
      return () => {
        document.removeEventListener('touchstart', preventZoom)
      }
    }
  }, [isIPhone, isIOS])

  return <>{children}</>
}

// Hook per gestire il safe area su iOS
export function useSafeArea() {
  const isIOS = useIsIOS()
  
  return {
    safeAreaTop: isIOS ? 'env(safe-area-inset-top)' : '0px',
    safeAreaBottom: isIOS ? 'env(safe-area-inset-bottom)' : '0px',
    safeAreaLeft: isIOS ? 'env(safe-area-inset-left)' : '0px',
    safeAreaRight: isIOS ? 'env(safe-area-inset-right)' : '0px',
  }
}

// Hook per gestire il comportamento del touch su iOS
export function useTouchOptimizations() {
  const isIPhone = useIsIPhone()
  
  return {
    touchAction: isIPhone ? 'manipulation' : 'auto',
    userSelect: isIPhone ? 'none' : 'auto',
    webkitUserSelect: isIPhone ? 'none' : 'auto',
    webkitTouchCallout: isIPhone ? 'none' : 'auto',
    webkitTapHighlightColor: isIPhone ? 'transparent' : 'auto',
  }
}
