"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  onClick: () => void
  variant?: "primary" | "secondary" | "accent"
  disabled?: boolean
  className?: string
}

export function ActionCard({
  title,
  description,
  icon,
  buttonText,
  onClick,
  variant = "primary",
  disabled = false,
  className = ""
}: ActionCardProps) {
  const variants = {
    primary: {
      gradient: "from-fitness-primary to-fitness-secondary",
      buttonClass: "bg-gradient-to-r from-fitness-primary to-fitness-secondary hover:from-fitness-secondary hover:to-fitness-primary"
    },
    secondary: {
      gradient: "from-fitness-secondary to-fitness-success",
      buttonClass: "bg-gradient-to-r from-fitness-secondary to-fitness-success hover:from-fitness-success hover:to-fitness-secondary"
    },
    accent: {
      gradient: "from-fitness-accent to-fitness-warning",
      buttonClass: "bg-gradient-to-r from-fitness-accent to-fitness-warning hover:from-fitness-warning hover:to-fitness-accent"
    }
  }

  const selectedVariant = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="card-elevated group cursor-pointer" onClick={onClick}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div className={`w-14 h-14 bg-gradient-to-br ${selectedVariant.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <CardTitle className="text-heading-3 text-foreground mb-2">
                {title}
              </CardTitle>
              <CardDescription className="text-body text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Button
            className={`w-full ${selectedVariant.buttonClass} text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Specialized action cards for common use cases
export function QuickStartCard({
  programName,
  exerciseCount,
  onStart,
  disabled = false
}: {
  programName?: string
  exerciseCount?: number
  onStart: () => void
  disabled?: boolean
}) {
  return (
    <ActionCard
      title="Allenamento Veloce"
      description={programName 
        ? `${programName} - ${exerciseCount} esercizi`
        : "Seleziona un programma per iniziare"
      }
      icon={<div className="w-6 h-6">🏃‍♂️</div>}
      buttonText={programName ? "Inizia Ora" : "Seleziona Programma"}
      onClick={onStart}
      variant="primary"
      disabled={disabled}
      className="border-2 border-fitness-primary/20"
    />
  )
}

export function ManageProgramsCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ActionCard
      title="Gestisci Programmi"
      description="Crea, modifica o seleziona i tuoi programmi personalizzati"
      icon={<div className="w-6 h-6">📋</div>}
      buttonText="Vai ai Programmi"
      onClick={onNavigate}
      variant="secondary"
    />
  )
}

export function ProgressCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ActionCard
      title="I Tuoi Progressi"
      description="Monitora i tuoi miglioramenti e raggiungi i tuoi obiettivi"
      icon={<div className="w-6 h-6">📊</div>}
      buttonText="Visualizza Progressi"
      onClick={onNavigate}
      variant="accent"
    />
  )
}
