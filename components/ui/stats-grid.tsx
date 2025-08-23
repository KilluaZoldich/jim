"use client"

import { motion } from "framer-motion"
import { Award, TrendingUp, Target, Flame, Trophy, Zap } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
}

export function StatsGrid({ stats, columns = 3 }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group relative"
        >
          <div className="card-modern p-4 text-center hover:scale-105 transition-transform duration-200">
            {/* Icon Container */}
            <div className={`w-12 h-12 ${stat.color} rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              {stat.icon}
            </div>
            
            {/* Value */}
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            
            {/* Label */}
            <div className="text-sm text-muted-foreground mb-2">
              {stat.label}
            </div>
            
            {/* Trend Indicator */}
            {stat.trend && (
              <div className={`flex items-center justify-center gap-1 text-xs ${
                stat.trend.isPositive ? 'text-fitness-success' : 'text-fitness-error'
              }`}>
                {stat.trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3 rotate-180" />
                )}
                <span>{Math.abs(stat.trend.value)}%</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Predefined stat items for common use cases
export const fitnessStats = {
  level: (level: number, xp: number, xpToNext: number): StatItem => ({
    icon: <Trophy className="w-5 h-5 text-white" />,
    value: level,
    label: "Livello",
    color: "bg-gradient-to-br from-fitness-accent to-fitness-warning",
    trend: {
      value: Math.round((xp / xpToNext) * 100),
      isPositive: true
    }
  }),
  
  streak: (current: number, longest: number): StatItem => ({
    icon: <Flame className="w-5 h-5 text-white" />,
    value: current,
    label: "Giorni di fila",
    color: "bg-gradient-to-br from-fitness-error to-fitness-warning"
  }),
  
  workouts: (total: number, weekly: number): StatItem => ({
    icon: <Award className="w-5 h-5 text-white" />,
    value: total,
    label: "Allenamenti",
    color: "bg-gradient-to-br from-fitness-primary to-fitness-secondary"
  }),
  
  volume: (total: number): StatItem => ({
    icon: <TrendingUp className="w-5 h-5 text-white" />,
    value: `${Math.round(total / 1000 * 10) / 10}k`,
    label: "Volume kg",
    color: "bg-gradient-to-br from-fitness-secondary to-fitness-success"
  }),
  
  progress: (current: number, goal: number): StatItem => ({
    icon: <Target className="w-5 h-5 text-white" />,
    value: `${current}/${goal}`,
    label: "Settimana",
    color: "bg-gradient-to-br from-fitness-success to-fitness-secondary"
  }),
  
  energy: (value: number): StatItem => ({
    icon: <Zap className="w-5 h-5 text-white" />,
    value: value,
    label: "Energia",
    color: "bg-gradient-to-br from-fitness-warning to-fitness-accent"
  })
}
