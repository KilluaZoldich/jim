"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Plus, BarChart3, Award, TrendingUp, Trophy, Flame, Target, Star } from "lucide-react"
import { useDeviceType } from "@/components/ui/use-mobile"
import { useSafeArea } from "@/components/ui/ios-optimizations"

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
  const progressPercentage = (userStats.xp / userStats.xpToNextLevel) * 100
  const { isMobile, isIPhone } = useDeviceType()
  const { safeAreaTop, safeAreaBottom } = useSafeArea()

  return (
    <main 
      className="flex-1 max-w-md mx-auto"
      style={{ 
        paddingTop: isIPhone ? `calc(1rem + ${safeAreaTop})` : '1rem',
        paddingBottom: isIPhone ? `calc(5rem + ${safeAreaBottom})` : '5rem'
      }}
    >
      {/* Hero Section - Ridimensionato e più proporzionato */}
      <div className="px-4 mb-6">
        <div className="relative text-center py-6 px-6 bg-gradient-to-br from-forest via-forest-light to-gold/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-full shadow-md mb-3">
              <svg className="w-7 h-7 text-forest" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
              </svg>
            </div>
            <h2 className="font-serif font-bold text-2xl text-white mb-2 drop-shadow-md">Inizia il Tuo Percorso</h2>
            <p className="text-white/90 text-sm font-medium">Semplice, efficace, personalizzato</p>
          </div>
        </div>
      </div>

      {/* User Level & Progress - Card più compatta */}
      <div className="px-4 mb-5">
        <Card className="bg-gradient-to-br from-white to-cream shadow-md border border-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-sm">
                  <Trophy className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <div className="font-bold text-base text-forest">Livello {userStats.level}</div>
                  <div className="text-xs text-charcoal/70">
                    {userStats.xp}/{userStats.xpToNextLevel} XP
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-600 mb-1">
                  <Flame className="w-3 h-3" />
                  <span className="font-bold text-sm">{userStats.currentStreak}</span>
                </div>
                <div className="text-xs text-charcoal/70">giorni di fila</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-gradient-to-r from-forest to-forest-light h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-charcoal/70 text-center">
              {Math.round(progressPercentage)}% verso il prossimo livello
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats - Grid più compatto e proporzionato */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-white to-cream p-3 rounded-xl shadow-sm border border-gold/20">
            <div className="text-center">
              <div className="w-6 h-6 bg-gradient-to-br from-forest to-forest-light rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
              <div className="text-lg font-bold text-forest">{userStats.totalWorkouts}</div>
              <div className="text-xs text-charcoal/70">Allenamenti</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-cream p-3 rounded-xl shadow-sm border border-gold/20">
            <div className="text-center">
              <div className="w-6 h-6 bg-gradient-to-br from-gold to-gold/80 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-forest" />
              </div>
              <div className="text-lg font-bold text-forest">
                {Math.round((userStats.totalVolume / 1000) * 10) / 10}k
              </div>
              <div className="text-xs text-charcoal/70">Volume kg</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-cream p-3 rounded-xl shadow-sm border border-gold/20">
            <div className="text-center">
              <div className="w-6 h-6 bg-gradient-to-br from-forest-light to-forest rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div className="text-lg font-bold text-forest">
                {userStats.weeklyProgress}/{userStats.weeklyGoal}
              </div>
              <div className="text-xs text-charcoal/70">Settimana</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements - Solo se ci sono achievement sbloccati */}
      {unlockedAchievements.length > 0 && (
        <div className="px-4 mb-5">
          <Card className="bg-gradient-to-br from-white to-gold/5 shadow-md border border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-forest flex items-center gap-2 text-base">
                <Star className="w-4 h-4 text-gold" />
                Achievement Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {unlockedAchievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/10 p-2 rounded-lg border border-gold/30 min-w-[90px] text-center"
                  >
                    <div className="text-lg mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium text-forest">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Actions - Cards più compatte e ben spaziate */}
      <div className="px-4 space-y-3">
        {/* Primary Action - Allenamento Veloce */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gold/5 border border-gold/30 shadow-md hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-forest flex items-center gap-3 text-base">
              <div className="w-8 h-8 bg-gradient-to-br from-forest to-forest-light rounded-lg shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Play className="w-4 h-4 text-white" />
              </div>
              Allenamento Veloce
            </CardTitle>
            <CardDescription className="text-sm">
              {selectedProgram
                ? `${selectedProgram.name} - ${selectedProgram.exercises.length} esercizi`
                : "Seleziona un programma per iniziare"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onStartWorkout}
              disabled={!selectedProgram}
            >
              {selectedProgram ? "Inizia Ora" : "Seleziona Programma"}
            </Button>
          </CardContent>
        </Card>

        {/* Secondary Actions - Layout più compatto */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-cream shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-forest flex items-center gap-3 text-base">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold/80 rounded-lg shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Plus className="w-4 h-4 text-forest" />
                </div>
                Gestisci Programmi
              </CardTitle>
              <CardDescription className="text-sm">Crea, modifica o seleziona i tuoi programmi</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/90 text-forest font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                onClick={() => onNavigate("programs")}
              >
                Vai ai Programmi
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-forest/5 shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="font-serif text-forest flex items-center gap-3 text-base">
                <div className="w-8 h-8 bg-gradient-to-br from-forest-light to-forest rounded-lg shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                I Tuoi Progressi
              </CardTitle>
              <CardDescription className="text-sm">Monitora i tuoi miglioramenti nel tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border border-forest text-forest hover:bg-forest hover:text-white bg-transparent font-semibold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                onClick={() => onNavigate("progress")}
              >
                Visualizza Progressi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
