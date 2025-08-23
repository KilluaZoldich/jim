import React from 'react'
import { isValidIcon } from '@/lib/icon-config'
import IconFallback from './icon-fallback'
import { useSafeIconLoading, handleIconRenderingError } from '@/lib/react-19-icon-fixes'

interface IconWrapperProps {
  icon: React.ComponentType<{ className?: string; size?: number }>
  className?: string
  size?: number
  fallback?: string
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon: Icon, 
  className = "", 
  size = 16,
  fallback = "?" 
}) => {
  const { isLoaded, hasError, retryCount } = useSafeIconLoading(Icon, fallback)
  const [renderError, setRenderError] = React.useState(false)

  // Verifica se l'icona è valida prima del rendering
  if (!isValidIcon(Icon)) {
    console.warn('Invalid icon component provided to IconWrapper')
    return <IconFallback fallback={fallback} className={className} size={size} />
  }

  // Se c'è un errore di caricamento o rendering, mostriamo il fallback
  if (hasError || renderError) {
    return <IconFallback fallback={fallback} className={className} size={size} />
  }

  // Se l'icona non è ancora caricata, mostriamo un placeholder
  if (!isLoaded) {
    return <IconFallback fallback="..." className={className} size={size} />
  }

  try {
    return (
      <Icon 
        className={className} 
        size={size}
        onError={(error) => {
          console.warn('Icon onError triggered:', error)
          setRenderError(true)
          handleIconRenderingError(error, Icon.displayName || 'Unknown')
        }}
      />
    )
  } catch (error) {
    console.warn('Icon rendering error:', error)
    setRenderError(true)
    handleIconRenderingError(error as Error, Icon.displayName || 'Unknown')
    return <IconFallback fallback={fallback} className={className} size={size} />
  }
}

export default IconWrapper
