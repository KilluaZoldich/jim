"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Check, Timer, Play } from "lucide-react"
import { useState, useEffect } from "react"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  restTime: number
}

interface Program {
  id: string
  name: string
  description: string
  exercises: Exercise[]
  createdAt: Date
  lastUsed?: Date
}

interface WorkoutSet {
  exerciseId: string
  setNumber: number
  actualWeight: number
  actualReps: number
  completed: boolean
}

interface WorkoutSession {
  programId: string
  startTime: Date
  currentExerciseIndex: number
  currentSetIndex: number
  completedSets: WorkoutSet[]
  isActive: boolean
  isPaused: boolean
}

interface WorkoutScreenProps {
  onNavigate: (screen: Screen) => void
  selectedProgram: Program | null
  workoutSession: WorkoutSession | null
  setWorkoutSession: (session: WorkoutSession | null) => void
  onStartWorkout: () => void
  onCompleteWorkout: (session: WorkoutSession) => void
}

export default function WorkoutScreen({
  onNavigate,
  selectedProgram,
  workoutSession,
  setWorkoutSession,
  onStartWorkout,
  onCompleteWorkout,
}: WorkoutScreenProps) {
  const [restTimer, setRestTimer] = useState<number>(0)
  const [isResting, setIsResting] = useState(false)
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [currentReps, setCurrentReps] = useState<number>(0)
  const [isCompletingSet, setIsCompletingSet] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false)
            // Simulate haptic feedback when rest is complete
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isResting, restTimer])

  // Initialize current weight and reps when exercise changes
  useEffect(() => {
    if (workoutSession && selectedProgram) {
      const currentExercise = selectedProgram.exercises[workoutSession.currentExerciseIndex]
      if (currentExercise) {
        setCurrentWeight(currentExercise.weight)
        setCurrentReps(currentExercise.reps)
      }
    }
  }, [workoutSession, selectedProgram])

  if (!selectedProgram) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="font-serif font-bold text-2xl text-forest mb-4">Nessun Programma Selezionato</h2>
          <p className="text-charcoal opacity-80 mb-6">Seleziona un programma per iniziare l'allenamento</p>
          <Button onClick={() => onNavigate("programs")} className="btn-primary">
            Vai ai Programmi
          </Button>
        </div>
      </div>
    )
  }

  if (!workoutSession) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white to-cream shadow-2xl border border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-forest text-2xl">Pronto per l'Allenamento?</CardTitle>
            <CardDescription className="text-base">
              Programma: {selectedProgram.name} • {selectedProgram.exercises.length} esercizi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-forest/10 to-gold/10 p-4 rounded-xl">
                <h4 className="font-semibold text-forest mb-2">Anteprima Esercizi:</h4>
                <div className="space-y-2">
                  {selectedProgram.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={exercise.id} className="flex justify-between text-sm">
                      <span>{exercise.name}</span>
                      <span className="text-charcoal/70">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  ))}
                  {selectedProgram.exercises.length > 3 && (
                    <div className="text-xs text-charcoal/60">+{selectedProgram.exercises.length - 3} altri...</div>
                  )}
                </div>
              </div>
              <Button onClick={onStartWorkout} className="w-full btn-primary text-lg py-4">
                <Play className="w-5 h-5 mr-2" />
                Inizia Allenamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = selectedProgram.exercises[workoutSession.currentExerciseIndex]
  const totalSets = selectedProgram.exercises.reduce((sum, ex) => sum + ex.sets, 0)
  const completedSetsCount = workoutSession.completedSets.length
  const progressPercentage = (completedSetsCount / totalSets) * 100

  const completeSet = async () => {
    if (!currentExercise || isCompletingSet) return

    setIsCompletingSet(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newSet: WorkoutSet = {
      exerciseId: currentExercise.id,
      setNumber: workoutSession.currentSetIndex + 1,
      actualWeight: currentWeight,
      actualReps: currentReps,
      completed: true,
    }

    const updatedSession = {
      ...workoutSession,
      completedSets: [...workoutSession.completedSets, newSet],
    }

    // Check if current exercise is complete
    const setsForCurrentExercise = updatedSession.completedSets.filter(
      (set) => set.exerciseId === currentExercise.id,
    ).length

    if (setsForCurrentExercise >= currentExercise.sets) {
      // Move to next exercise
      if (workoutSession.currentExerciseIndex < selectedProgram.exercises.length - 1) {
        updatedSession.currentExerciseIndex += 1
        updatedSession.currentSetIndex = 0
      } else {
        // Workout complete
        onCompleteWorkout(updatedSession)
        setIsCompletingSet(false)
        return
      }
    } else {
      // Move to next set
      updatedSession.currentSetIndex += 1
    }

    setWorkoutSession(updatedSession)

    // Start rest timer
    setRestTimer(currentExercise.restTime)
    setIsResting(true)
    setIsCompletingSet(false)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100])
    }
  }

  const skipRest = () => {
    setIsResting(false)
    setRestTimer(0)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-forest to-forest-light text-white shadow-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-serif font-bold text-xl">{selectedProgram.name}</h2>
              <p className="text-white/80">
                Esercizio {workoutSession.currentExerciseIndex + 1} di {selectedProgram.exercises.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-white/80">Completato</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </CardContent>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-2xl animate-pulse">
          <CardContent className="p-6 text-center">
            <Timer className="w-12 h-12 mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">{formatTime(restTimer)}</div>
            <p className="text-white/90 mb-4">Tempo di riposo</p>
            <Button
              onClick={skipRest}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Salta Riposo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise */}
      <Card className="bg-gradient-to-br from-white to-cream shadow-2xl border border-gold/20">
        <CardHeader>
          <CardTitle className="font-serif text-forest text-2xl flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-forest to-forest-light rounded-xl flex items-center justify-center text-white font-bold">
              {workoutSession.currentSetIndex + 1}
            </div>
            {currentExercise.name}
          </CardTitle>
          <CardDescription className="text-base">
            Serie {workoutSession.currentSetIndex + 1} di {currentExercise.sets} •{currentExercise.reps} ripetizioni •{" "}
            {currentExercise.weight}kg
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Input for actual values */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="actual-weight">Peso Effettivo (kg)</Label>
                <Input
                  id="actual-weight"
                  type="number"
                  step="0.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number.parseFloat(e.target.value) || 0)}
                  className="text-center font-semibold text-lg"
                  disabled={isResting || isCompletingSet}
                />
              </div>
              <div>
                <Label htmlFor="actual-reps">Ripetizioni Effettive</Label>
                <Input
                  id="actual-reps"
                  type="number"
                  value={currentReps}
                  onChange={(e) => setCurrentReps(Number.parseInt(e.target.value) || 0)}
                  className="text-center font-semibold text-lg"
                  disabled={isResting || isCompletingSet}
                />
              </div>
            </div>

            <Button
              onClick={completeSet}
              className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              disabled={isResting || isCompletingSet}
            >
              {isCompletingSet ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin"></div>
                  Completando...
                </div>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Completa Serie
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="font-serif text-forest">Esercizi Rimanenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedProgram.exercises.map((exercise, index) => {
              const isCurrentExercise = index === workoutSession.currentExerciseIndex
              const isCompleted = index < workoutSession.currentExerciseIndex
              const completedSetsForExercise = workoutSession.completedSets.filter(
                (set) => set.exerciseId === exercise.id,
              ).length

              return (
                <div
                  key={exercise.id}
                  className={`flex justify-between items-center p-3 rounded-lg transition-all duration-200 ${
                    isCurrentExercise
                      ? "bg-forest text-cream shadow-md"
                      : isCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-50 text-charcoal"
                  }`}
                >
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm opacity-80">
                      {exercise.sets} serie × {exercise.reps} rip
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <div className="text-sm">
                        {completedSetsForExercise}/{exercise.sets}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
