import React from 'react'
import { isValidIcon } from './icon-config'

interface IconRendererProps {
  icon: React.ComponentType<{ className?: string; size?: number }>
  className?: string
  size?: number
  fallback?: string
  retryCount?: number
}

export class IconRenderer extends React.Component<IconRendererProps, { hasError: boolean; retryCount: number }> {
  constructor(props: IconRendererProps) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Icon rendering error caught:', error, errorInfo)
    this.setState(prevState => ({ 
      hasError: true, 
      retryCount: prevState.retryCount + 1 
    }))
  }

  componentDidUpdate(prevProps: IconRendererProps) {
    if (prevProps.icon !== this.props.icon) {
      this.setState({ hasError: false, retryCount: 0 })
    }
  }

  render() {
    const { icon: Icon, className = "", size = 16, fallback = "?", retryCount = 0 } = this.props
    const { hasError, retryCount: currentRetryCount } = this.state

    // Se abbiamo avuto troppi errori, mostriamo il fallback
    if (hasError && currentRetryCount >= (retryCount || 2)) {
      return (
        <span 
          className={`inline-flex items-center justify-center ${className}`}
          style={{ 
            fontSize: `${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: 1
          }}
        >
          {fallback}
        </span>
      )
    }

    // Se l'icona non è valida, mostriamo il fallback
    if (!isValidIcon(Icon)) {
      console.warn('Invalid icon component provided to IconRenderer')
      return (
        <span 
          className={`inline-flex items-center justify-center ${className}`}
          style={{ 
            fontSize: `${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: 1
          }}
        >
          {fallback}
        </span>
      )
    }

    try {
      return (
        <Icon 
          className={className} 
          size={size}
        />
      )
    } catch (error) {
      console.warn('Icon rendering error:', error)
      this.setState(prevState => ({ 
        hasError: true, 
        retryCount: prevState.retryCount + 1 
      }))
      
      return (
        <span 
          className={`inline-flex items-center justify-center ${className}`}
          style={{ 
            fontSize: `${size}px`,
            width: `${size}px`,
            height: `${size}px`,
            lineHeight: 1
          }}
        >
          {fallback}
        </span>
      )
    }
  }
}

export default IconRenderer
