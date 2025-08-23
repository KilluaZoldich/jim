"use client"

import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Target } from "lucide-react"

interface HeroSectionProps {
  title: string
  subtitle: string
  stats?: {
    value: string
    label: string
    icon: React.ReactNode
  }[]
}

export function HeroSection({ title, subtitle, stats }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fitness-primary via-fitness-secondary to-fitness-accent p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display mb-4 text-white"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-body-large mb-8 text-white/90 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        
        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mx-auto mb-3 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
            className="text-white/20"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.71,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
            className="text-white/30"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
            className="text-white/40"
          />
        </svg>
      </div>
    </div>
  )
}
