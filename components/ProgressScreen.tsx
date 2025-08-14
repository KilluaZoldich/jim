"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Calendar, Award, BarChart3 } from "lucide-react"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

interface CompletedWorkout {
  id: string
  programId: string
  programName: string
  startTime: Date
  endTime: Date
  duration: number
  completedSets: any[]
  totalVolume: number
}

interface ExerciseProgress {
  exerciseId: string
  exerciseName: string
  maxWeight: number
  totalVolume: number
  totalSets: number
  averageReps: number
  lastPerformed: Date
}

interface ProgressScreenProps {
  onNavigate: (screen: Screen) => void
  completedWorkouts: CompletedWorkout[]
  exerciseProgress: ExerciseProgress[]
}

export default function ProgressScreen({ onNavigate, completedWorkouts, exerciseProgress }: ProgressScreenProps) {
  const totalWorkouts = completedWorkouts.length
  const totalVolume = completedWorkouts.reduce((sum, workout) => sum + workout.totalVolume, 0)
  const averageDuration =
    totalWorkouts > 0
      ? Math.round(completedWorkouts.reduce((sum, workout) => sum + workout.duration, 0) / totalWorkouts)
      : 0

  // Calculate weekly frequency
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weeklyWorkouts = completedWorkouts.filter((w) => new Date(w.endTime) >= weekAgo).length

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-forest/10 to-gold/10 p-6 rounded-2xl border border-gold/20">
        <h2 className="font-serif font-bold text-3xl text-forest mb-2">I Tuoi Progressi</h2>
        <p className="text-charcoal/70">Monitora i tuoi miglioramenti nel tempo</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-cream border border-gold/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-forest data-[state=active]:text-white">
            Panoramica
          </TabsTrigger>
          <TabsTrigger value="exercises" className="data-[state=active]:bg-forest data-[state=active]:text-white">
            Esercizi
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-forest data-[state=active]:text-white">
            Cronologia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-white to-cream shadow-lg border border-gold/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-forest to-forest-light rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-forest mb-1">{totalWorkouts}</div>
                <div className="text-sm text-charcoal/70">Allenamenti Totali</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-cream shadow-lg border border-gold/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-forest" />
                </div>
                <div className="text-3xl font-bold text-forest mb-1">{Math.round((totalVolume / 1000) * 10) / 10}k</div>
                <div className="text-sm text-charcoal/70">Volume Totale (kg)</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-cream shadow-lg border border-gold/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-forest-light to-forest rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-forest mb-1">{averageDuration}m</div>
                <div className="text-sm text-charcoal/70">Durata Media</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-cream shadow-lg border border-gold/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-forest mb-1">{weeklyWorkouts}</div>
                <div className="text-sm text-charcoal/70">Questa Settimana</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-forest">Attività Recente</CardTitle>
              <CardDescription>Ultimi 7 giorni</CardDescription>
            </CardHeader>
            <CardContent>
              {completedWorkouts.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {completedWorkouts.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                      <div>
                        <div className="font-medium text-charcoal">{workout.programName}</div>
                        <div className="text-sm text-charcoal/70">
                          {new Date(workout.endTime).toLocaleDateString()} • {workout.duration}min
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-forest">{Math.round(workout.totalVolume)}kg</div>
                        <div className="text-xs text-charcoal/70">{workout.completedSets.length} serie</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-charcoal/60">
                  <p>Nessun allenamento completato ancora</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-forest">Progressi per Esercizio</CardTitle>
              <CardDescription>Statistiche dettagliate per ogni esercizio</CardDescription>
            </CardHeader>
            <CardContent>
              {exerciseProgress.length > 0 ? (
                <div className="space-y-4">
                  {exerciseProgress.map((progress) => (
                    <div
                      key={progress.exerciseId}
                      className="p-4 bg-gradient-to-r from-cream to-gold/10 rounded-lg border border-gold/20"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-forest">{progress.exerciseName}</h4>
                        <div className="text-right">
                          <div className="font-bold text-forest">{progress.maxWeight}kg</div>
                          <div className="text-xs text-charcoal/70">Peso Max</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-charcoal">{Math.round(progress.totalVolume)}kg</div>
                          <div className="text-charcoal/70">Volume Totale</div>
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{progress.totalSets}</div>
                          <div className="text-charcoal/70">Serie Totali</div>
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{progress.averageReps}</div>
                          <div className="text-charcoal/70">Rip. Medie</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-charcoal/60">
                  <p>Nessun dato disponibile</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-forest">Cronologia Allenamenti</CardTitle>
              <CardDescription>Tutti i tuoi allenamenti completati</CardDescription>
            </CardHeader>
            <CardContent>
              {completedWorkouts.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {completedWorkouts.map((workout) => (
                    <div key={workout.id} className="p-4 bg-cream rounded-lg border border-gold/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-forest">{workout.programName}</h4>
                          <div className="text-sm text-charcoal/70">
                            {new Date(workout.startTime).toLocaleDateString()} alle{" "}
                            {new Date(workout.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-forest">{workout.duration}min</div>
                          <div className="text-sm text-charcoal/70">{Math.round(workout.totalVolume)}kg</div>
                        </div>
                      </div>
                      <div className="text-sm text-charcoal/80">{workout.completedSets.length} serie completate</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-charcoal/60">
                  <p>Nessun allenamento nella cronologia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
