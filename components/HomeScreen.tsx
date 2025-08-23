"use client"
import { useDeviceType } from "@/components/ui/use-mobile"
import { useSafeArea } from "@/components/ui/ios-optimizations"
import { HeroSection } from "@/components/ui/hero-section"
import { StatsGrid, fitnessStats } from "@/components/ui/stats-grid"
import { QuickStartCard, ManageProgramsCard, ProgressCard } from "@/components/ui/action-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

interface Program {
  id: string
  name: string
  description: string
  exercises: any[]
  createdAt: Date
  lastUsed?: Date
}

interface UserStats {
  currentStreak: number
  longestStreak: number
  totalWorkouts: number
  totalVolume: number
  weeklyGoal: number
  weeklyProgress: number
  level: number
  xp: number
  xpToNextLevel: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  selectedProgram: Program | null
  onStartWorkout: () => void
  userStats: UserStats
  achievements: Achievement[]
}

export default function HomeScreen({
  onNavigate,
  selectedProgram,
  onStartWorkout,
  userStats,
  achievements,
}: HomeScreenProps) {
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const { isIPhone } = useDeviceType()
  const { safeAreaTop, safeAreaBottom } = useSafeArea()

  // Prepare stats for the hero section
  const heroStats = [
    {
      value: userStats.level.toString(),
      label: "Livello",
      icon: <div className="w-6 h-6">🏆</div>
    },
    {
      value: userStats.currentStreak.toString(),
      label: "Giorni di fila",
      icon: <div className="w-6 h-6">🔥</div>
    },
    {
      value: userStats.totalWorkouts.toString(),
      label: "Allenamenti",
      icon: <div className="w-6 h-6">💪</div>
    }
  ]

  // Prepare stats for the stats grid
  const statsItems = [
    fitnessStats.level(userStats.level, userStats.xp, userStats.xpToNextLevel),
    fitnessStats.streak(userStats.currentStreak, userStats.longestStreak),
    fitnessStats.workouts(userStats.totalWorkouts, userStats.weeklyProgress),
    fitnessStats.volume(userStats.totalVolume),
    fitnessStats.progress(userStats.weeklyProgress, userStats.weeklyGoal),
    fitnessStats.energy(Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100))
  ]

  return (
    <main 
      className="flex-1 max-w-md mx-auto"
      style={{ 
        paddingTop: isIPhone ? `calc(1rem + ${safeAreaTop})` : '1rem',
        paddingBottom: isIPhone ? `calc(5rem + ${safeAreaBottom})` : '5rem'
      }}
    >
      {/* Hero Section */}
      <div className="px-4 mb-6">
        <HeroSection
          title="Inizia il Tuo Percorso"
          subtitle="Semplice, efficace, personalizzato. Raggiungi i tuoi obiettivi fitness con la nostra app intelligente."
          stats={heroStats}
        />
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-6">
        <StatsGrid stats={statsItems} columns={3} />
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="px-4 mb-6">
          <Card className="card-modern">
            <CardHeader className="pb-4">
              <CardTitle className="text-heading-3 text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-fitness-accent" />
                Achievement Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {unlockedAchievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex-shrink-0 bg-gradient-to-br from-fitness-accent/20 to-fitness-warning/20 p-3 rounded-xl border border-fitness-accent/30 min-w-[100px] text-center"
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-medium text-foreground">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Cards */}
      <div className="px-4 space-y-4">
        <QuickStartCard
          programName={selectedProgram?.name}
          exerciseCount={selectedProgram?.exercises.length}
          onStart={onStartWorkout}
          disabled={!selectedProgram}
        />
        
        <ManageProgramsCard onNavigate={() => onNavigate("programs")} />
        
        <ProgressCard onNavigate={() => onNavigate("progress")} />
      </div>
    </main>
  )
}
