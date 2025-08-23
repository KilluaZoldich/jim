import React from 'react'

interface IconFallbackProps {
  fallback: string
  className?: string
  size?: number
}

export const IconFallback: React.FC<IconFallbackProps> = ({ 
  fallback, 
  className = "", 
  size = 16 
}) => {
  // Se il fallback è un emoji o un carattere speciale, lo renderizziamo come testo
  if (fallback.length === 1 || fallback.length === 2) {
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

  // Se il fallback è più lungo, lo renderizziamo come testo normale
  return (
    <span 
      className={`inline-flex items-center justify-center text-xs font-medium ${className}`}
      style={{ 
        fontSize: `${Math.max(size * 0.6, 10)}px`,
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {fallback}
    </span>
  )
}

export default IconFallback
