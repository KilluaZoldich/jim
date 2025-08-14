"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Plus, BarChart3, Award, TrendingUp, Trophy, Flame, Target, Star } from "lucide-react"

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

  return (
    <main className="flex-1 p-6 max-w-md mx-auto pb-24">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative text-center py-12 px-6 bg-gradient-to-br from-forest via-forest-light to-gold/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold/80 rounded-full shadow-lg mb-6">
              <svg className="w-10 h-10 text-forest" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
              </svg>
            </div>
            <h2 className="font-serif font-bold text-4xl text-white mb-3 drop-shadow-lg">Inizia il Tuo Percorso</h2>
            <p className="text-white/90 text-lg font-medium">Semplice, efficace, personalizzato</p>
          </div>
        </div>

        {/* User Level & Progress */}
        <Card className="bg-gradient-to-br from-white to-cream shadow-xl border border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <div className="font-bold text-xl text-forest">Livello {userStats.level}</div>
                  <div className="text-sm text-charcoal/70">
                    {userStats.xp}/{userStats.xpToNextLevel} XP
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-600 mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold">{userStats.currentStreak}</span>
                </div>
                <div className="text-xs text-charcoal/70">giorni di fila</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-forest to-forest-light h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-charcoal/70 text-center">
              {Math.round(progressPercentage)}% verso il prossimo livello
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white to-cream p-4 rounded-2xl shadow-lg border border-gold/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-forest to-forest-light rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-forest">{userStats.totalWorkouts}</div>
              <div className="text-xs text-charcoal/70">Allenamenti</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-cream p-4 rounded-2xl shadow-lg border border-gold/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold/80 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-forest" />
              </div>
              <div className="text-2xl font-bold text-forest">
                {Math.round((userStats.totalVolume / 1000) * 10) / 10}k
              </div>
              <div className="text-xs text-charcoal/70">Volume kg</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-cream p-4 rounded-2xl shadow-lg border border-gold/20">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-light to-forest rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-forest">
                {userStats.weeklyProgress}/{userStats.weeklyGoal}
              </div>
              <div className="text-xs text-charcoal/70">Settimana</div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <Card className="bg-gradient-to-br from-white to-gold/5 shadow-xl border border-gold/30">
            <CardHeader>
              <CardTitle className="font-serif text-forest flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" />
                Achievement Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {unlockedAchievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/10 p-3 rounded-xl border border-gold/30 min-w-[120px] text-center"
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium text-forest">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Actions */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gold/5 border-2 border-gold/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="font-serif text-forest flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-forest to-forest-light rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-white" />
                </div>
                Allenamento Veloce
              </CardTitle>
              <CardDescription className="text-base">
                {selectedProgram
                  ? `${selectedProgram.name} - ${selectedProgram.exercises.length} esercizi`
                  : "Seleziona un programma per iniziare"}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onStartWorkout}
                disabled={!selectedProgram}
              >
                {selectedProgram ? "Inizia Ora" : "Seleziona Programma"}
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-cream shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="font-serif text-forest flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-forest" />
                </div>
                Gestisci Programmi
              </CardTitle>
              <CardDescription className="text-base">Crea, modifica o seleziona i tuoi programmi</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                className="w-full bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/90 text-forest font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                onClick={() => onNavigate("programs")}
              >
                Vai ai Programmi
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-forest/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="font-serif text-forest flex items-center gap-3 text-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-forest-light to-forest rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                I Tuoi Progressi
              </CardTitle>
              <CardDescription className="text-base">Monitora i tuoi miglioramenti nel tempo</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button
                variant="outline"
                className="w-full border-2 border-forest text-forest hover:bg-forest hover:text-white bg-transparent font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
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
