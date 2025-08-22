"use client"

import { useState, useEffect } from "react"
import { Home, Dumbbell, BarChart3, Settings, Play } from "lucide-react"
import { useDeviceType } from "./use-mobile"
import { useSafeArea } from "./ios-optimizations"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

interface MobileNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  onStartWorkout: () => void
  hasSelectedProgram: boolean
}

export function MobileNavigation({
  currentScreen,
  onNavigate,
  onStartWorkout,
  hasSelectedProgram,
}: MobileNavigationProps) {
  const { isIPhone } = useDeviceType()
  const { safeAreaBottom } = useSafeArea()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navigationItems = [
    { id: "home" as Screen, icon: Home, label: "Home", color: "from-forest to-forest-light" },
    { id: "programs" as Screen, icon: Dumbbell, label: "Programmi", color: "from-gold to-gold/80" },
    { id: "progress" as Screen, icon: BarChart3, label: "Progressi", color: "from-forest-light to-forest" },
    { id: "settings" as Screen, icon: Settings, label: "Impostazioni", color: "from-charcoal to-charcoal/80" },
  ]

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        paddingBottom: isIPhone ? `calc(0.75rem + ${safeAreaBottom})` : '0.75rem'
      }}
    >
      {/* Background blur effect for iPhone */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/30" />
      
      <div className="relative px-4">
        {/* Quick Start Workout Button - Solo se c'è un programma selezionato */}
        {hasSelectedProgram && (
          <div className="mb-3 flex justify-center">
            <button
              onClick={onStartWorkout}
              className="bg-gradient-to-r from-forest to-forest-light text-white px-5 py-2.5 rounded-full shadow-md font-semibold text-sm hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Inizia Allenamento
            </button>
          </div>
        )}

        {/* Navigation Items - Layout più compatto */}
        <div className="flex justify-around items-center">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-md scale-105' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// Hook per gestire la navigazione mobile
export function useMobileNavigation() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  
  const navigate = (screen: Screen) => {
    setCurrentScreen(screen)
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return {
    currentScreen,
    navigate,
  }
}
