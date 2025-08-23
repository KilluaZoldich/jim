"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Play, BarChart3, Settings, Dumbbell, X, Zap, RotateCcw } from "lucide-react"
import IconWrapper from "@/components/ui/icon-wrapper"
import { useState, useEffect, useCallback } from "react"
import ProgramsScreen from "@/components/ProgramsScreen"
import WorkoutScreen from "@/components/WorkoutScreen"
import ProgressScreen from "@/components/ProgressScreen"
import SettingsScreen from "@/components/SettingsScreen"
import HomeScreen from "@/components/HomeScreen"
import { MobileNavigation, useMobileNavigation } from "@/components/ui/mobile-navigation"
import { useDeviceType } from "@/components/ui/use-mobile"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

type Theme = "default" | "dark" | "vibrant" | "minimal"
type FontSize = "small" | "medium" | "large"
type LayoutStyle = "compact" | "comfortable" | "spacious"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
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

interface UserPreferences {
  theme: Theme
  fontSize: FontSize
  layoutStyle: LayoutStyle
  enableHapticFeedback: boolean
  enableQuickActions: boolean
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  restTime: number // in seconds
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

interface CompletedWorkout {
  id: string
  programId: string
  programName: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  completedSets: WorkoutSet[]
  totalVolume: number // weight * reps for all sets
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

const STORAGE_KEYS = {
  PROGRAMS: "fitflow_programs",
  SELECTED_PROGRAM: "fitflow_selected_program",
  COMPLETED_WORKOUTS: "fitflow_completed_workouts",
  EXERCISE_PROGRESS: "fitflow_exercise_progress",
  WORKOUT_SESSION: "fitflow_workout_session",
  USER_STATS: "fitflow_user_stats",
  ACHIEVEMENTS: "fitflow_achievements",
  USER_PREFERENCES: "fitflow_user_preferences",
}

// Added utility functions for localStorage with error handling
const storage = {
  get: (key: string, defaultValue: any): any => {
    try {
      if (typeof window === "undefined") return defaultValue
      const item = localStorage.getItem(key)
      return item
        ? JSON.parse(item, (key, value) => {
            // Parse dates
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              return new Date(value)
            }
            return value
          })
        : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  set: (key: string, value: any): void => {
    try {
      if (typeof window === "undefined") return
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  },
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_workout",
    name: "Primo Passo",
    description: "Completa il tuo primo allenamento",
    icon: "🎯",
    unlocked: false,
  },
  { id: "streak_3", name: "Costanza", description: "Allenati per 3 giorni consecutivi", icon: "🔥", unlocked: false },
  {
    id: "streak_7",
    name: "Settimana Perfetta",
    description: "Allenati per 7 giorni consecutivi",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "volume_1000",
    name: "Forza Bruta",
    description: "Solleva 1000kg di volume totale",
    icon: "💪",
    unlocked: false,
  },
  { id: "workouts_10", name: "Veterano", description: "Completa 10 allenamenti", icon: "🏆", unlocked: false },
  { id: "workouts_50", name: "Campione", description: "Completa 50 allenamenti", icon: "👑", unlocked: false },
]

export default function FitnessApp() {
  const { currentScreen, navigate } = useMobileNavigation()
  const { isMobile, isIPhone } = useDeviceType()
  const [isLoading, setIsLoading] = useState(true)
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null)
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([])
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([])

  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    totalVolume: 0,
    weeklyGoal: 3,
    weeklyProgress: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  })
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: "default",
    fontSize: "medium",
    layoutStyle: "comfortable",
    enableHapticFeedback: true,
    enableQuickActions: true,
  })
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedPrograms = storage.get(STORAGE_KEYS.PROGRAMS, [
      {
        id: "1",
        name: "Push Day",
        description: "Allenamento per petto, spalle e tricipiti",
        exercises: [
          { id: "1", name: "Panca Piana", sets: 4, reps: 8, weight: 80, restTime: 180 },
          { id: "2", name: "Spinte Manubri", sets: 3, reps: 10, weight: 30, restTime: 120 },
          { id: "3", name: "Dips", sets: 3, reps: 12, weight: 0, restTime: 90 },
        ],
        createdAt: new Date(),
        lastUsed: new Date(),
      },
    ])

    const loadedSelectedProgram = storage.get(STORAGE_KEYS.SELECTED_PROGRAM, loadedPrograms[0] || null)
    const loadedCompletedWorkouts = storage.get(STORAGE_KEYS.COMPLETED_WORKOUTS, [])
    const loadedExerciseProgress = storage.get(STORAGE_KEYS.EXERCISE_PROGRESS, [])
    const loadedWorkoutSession = storage.get(STORAGE_KEYS.WORKOUT_SESSION, null)

    setPrograms(loadedPrograms)
    setSelectedProgram(loadedSelectedProgram)
    setCompletedWorkouts(loadedCompletedWorkouts)
    setExerciseProgress(loadedExerciseProgress)
    setWorkoutSession(loadedWorkoutSession)

    const loadedUserStats = storage.get(STORAGE_KEYS.USER_STATS, userStats)
    const loadedAchievements = storage.get(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS)
    const loadedUserPreferences = storage.get(STORAGE_KEYS.USER_PREFERENCES, userPreferences)

    setUserStats(loadedUserStats)
    setAchievements(loadedAchievements)
    setUserPreferences(loadedUserPreferences)
    setIsLoading(false)
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.PROGRAMS, programs)
    }
  }, [programs, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.SELECTED_PROGRAM, selectedProgram)
    }
  }, [selectedProgram, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.COMPLETED_WORKOUTS, completedWorkouts)
    }
  }, [completedWorkouts, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.EXERCISE_PROGRESS, exerciseProgress)
    }
  }, [exerciseProgress, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.WORKOUT_SESSION, workoutSession)
    }
  }, [workoutSession, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.USER_STATS, userStats)
    }
  }, [userStats, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievements)
    }
  }, [achievements, isLoading])

  useEffect(() => {
    if (!isLoading) {
      storage.set(STORAGE_KEYS.USER_PREFERENCES, userPreferences)
    }
  }, [userPreferences, isLoading])

  const checkAchievements = useCallback(
    (stats: UserStats) => {
      const newUnlocked: Achievement[] = []

      setAchievements((prev) =>
        prev.map((achievement) => {
          if (achievement.unlocked) return achievement

          let shouldUnlock = false
          switch (achievement.id) {
            case "first_workout":
              shouldUnlock = stats.totalWorkouts >= 1
              break
            case "streak_3":
              shouldUnlock = stats.currentStreak >= 3
              break
            case "streak_7":
              shouldUnlock = stats.currentStreak >= 7
              break
            case "volume_1000":
              shouldUnlock = stats.totalVolume >= 1000
              break
            case "workouts_10":
              shouldUnlock = stats.totalWorkouts >= 10
              break
            case "workouts_50":
              shouldUnlock = stats.totalWorkouts >= 50
              break
          }

          if (shouldUnlock) {
            const unlockedAchievement = { ...achievement, unlocked: true, unlockedAt: new Date() }
            newUnlocked.push(unlockedAchievement)
            return unlockedAchievement
          }

          return achievement
        }),
      )

      if (newUnlocked.length > 0) {
        setNewAchievements(newUnlocked)
        if (userPreferences.enableHapticFeedback && navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200])
        }
      }
    },
    [userPreferences.enableHapticFeedback],
  )

  const startWorkout = useCallback(() => {
    if (!selectedProgram) return

    const newSession: WorkoutSession = {
      programId: selectedProgram.id,
      startTime: new Date(),
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      completedSets: [],
      isActive: true,
      isPaused: false,
    }
    setWorkoutSession(newSession)
    navigate("workout")
  }, [selectedProgram, navigate])

  const completeWorkout = useCallback(
    (session: WorkoutSession) => {
      if (!selectedProgram) return

      const endTime = new Date()
      const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
      const totalVolume = session.completedSets.reduce((sum, set) => sum + set.actualWeight * set.actualReps, 0)

      const completedWorkout: CompletedWorkout = {
        id: Date.now().toString(),
        programId: session.programId,
        programName: selectedProgram.name,
        startTime: session.startTime,
        endTime,
        duration,
        completedSets: session.completedSets,
        totalVolume,
      }

      setCompletedWorkouts((prev) => [completedWorkout, ...prev])

      setUserStats((prevStats) => {
        const newStats = {
          ...prevStats,
          totalWorkouts: prevStats.totalWorkouts + 1,
          totalVolume: prevStats.totalVolume + totalVolume,
          xp: prevStats.xp + 50 + Math.floor(totalVolume / 10), // Base XP + volume bonus
        }

        // Calculate streak
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
        const lastWorkout = completedWorkouts[0]?.endTime

        if (lastWorkout) {
          const lastWorkoutDate = new Date(lastWorkout).toDateString()
          if (lastWorkoutDate === yesterday) {
            newStats.currentStreak = prevStats.currentStreak + 1
          } else if (lastWorkoutDate !== today) {
            newStats.currentStreak = 1
          }
        } else {
          newStats.currentStreak = 1
        }

        newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak)

        // Level up logic
        while (newStats.xp >= newStats.xpToNextLevel) {
          newStats.xp -= newStats.xpToNextLevel
          newStats.level += 1
          newStats.xpToNextLevel = newStats.level * 100
        }

        // Calculate weekly progress
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekWorkouts = completedWorkouts.filter((w) => new Date(w.endTime) >= weekStart).length + 1
        newStats.weeklyProgress = Math.min(weekWorkouts, newStats.weeklyGoal)

        checkAchievements(newStats)
        return newStats
      })

      // Update exercise progress
      const exerciseMap = new Map<string, Exercise>()
      selectedProgram.exercises.forEach((ex) => exerciseMap.set(ex.id, ex))

      const progressUpdates = new Map<string, ExerciseProgress>()

      session.completedSets.forEach((set) => {
        const exercise = exerciseMap.get(set.exerciseId)
        if (!exercise) return

        const key = set.exerciseId
        if (!progressUpdates.has(key)) {
          const existing = exerciseProgress.find((ep) => ep.exerciseId === set.exerciseId)
          progressUpdates.set(key, {
            exerciseId: set.exerciseId,
            exerciseName: exercise.name,
            maxWeight: existing?.maxWeight || 0,
            totalVolume: existing?.totalVolume || 0,
            totalSets: existing?.totalSets || 0,
            averageReps: existing?.averageReps || 0,
            lastPerformed: endTime,
          })
        }

        const progress = progressUpdates.get(key)!
        progress.maxWeight = Math.max(progress.maxWeight, set.actualWeight)
        progress.totalVolume += set.actualWeight * set.actualReps
        progress.totalSets += 1
        progress.lastPerformed = endTime
      })

      // Calculate average reps
      progressUpdates.forEach((progress) => {
        const setsForExercise = session.completedSets.filter((set) => set.exerciseId === progress.exerciseId)
        const totalReps = setsForExercise.reduce((sum, set) => sum + set.actualReps, 0)
        progress.averageReps = Math.round(totalReps / setsForExercise.length)
      })

      setExerciseProgress((prev) => {
        const updated = [...prev]
        progressUpdates.forEach((newProgress) => {
          const existingIndex = updated.findIndex((ep) => ep.exerciseId === newProgress.exerciseId)
          if (existingIndex >= 0) {
            updated[existingIndex] = newProgress
          } else {
            updated.push(newProgress)
          }
        })
        return updated
      })

      setWorkoutSession(null)
    },
    [selectedProgram, exerciseProgress, completedWorkouts, checkAchievements],
  )

  const quickRestartLastWorkout = useCallback(() => {
    if (completedWorkouts.length > 0) {
      const lastWorkout = completedWorkouts[0]
      const program = programs.find((p) => p.id === lastWorkout.programId)
      if (program) {
        setSelectedProgram(program)
        startWorkout()
      }
    }
  }, [completedWorkouts, programs, startWorkout])

  const getThemeClasses = () => {
    const base =
      userPreferences.fontSize === "small" ? "text-sm" : userPreferences.fontSize === "large" ? "text-lg" : ""

    switch (userPreferences.theme) {
      case "dark":
        return `${base} bg-gray-900 text-white`
      case "vibrant":
        return `${base} bg-gradient-to-br from-purple-50 to-pink-50`
      case "minimal":
        return `${base} bg-gray-50`
      default:
        return base
    }
  }

  // Added loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 text-forest mx-auto mb-4 animate-pulse" />
          <h2 className="font-serif font-bold text-xl text-forest">Caricamento FitFlow...</h2>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigate={navigate}
            selectedProgram={selectedProgram}
            onStartWorkout={startWorkout}
            userStats={userStats}
            achievements={achievements}
          />
        )
      case "programs":
        return (
          <ProgramsScreen
            onNavigate={navigate}
            programs={programs}
            setPrograms={setPrograms}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
          />
        )
      case "workout":
        return (
          <WorkoutScreen
            onNavigate={navigate}
            selectedProgram={selectedProgram}
            workoutSession={workoutSession}
            setWorkoutSession={setWorkoutSession}
            onStartWorkout={startWorkout}
            onCompleteWorkout={completeWorkout}
          />
        )
      case "progress":
        return (
          <ProgressScreen
            onNavigate={navigate}
            completedWorkouts={completedWorkouts}
            exerciseProgress={exerciseProgress}
          />
        )
      case "settings":
        return (
          <SettingsScreen onNavigate={navigate} programs={programs} completedWorkouts={completedWorkouts} />
        )
      default:
        return (
          <HomeScreen
            onNavigate={navigate}
            selectedProgram={selectedProgram}
            onStartWorkout={startWorkout}
            userStats={userStats}
            achievements={achievements}
          />
        )
    }
  }

  return (
    <div className={`min-h-screen bg-cream ${getThemeClasses()}`}>
      {newAchievements.length > 0 && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-500">
          {newAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className="mb-2 bg-gradient-to-r from-gold to-gold/80 border-2 border-gold shadow-2xl"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-bold text-forest">Achievement Sbloccato!</div>
                    <div className="text-sm text-forest/80">
                      {achievement.name}: {achievement.description}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setNewAchievements([])} className="ml-auto">
                    <IconWrapper icon={X} className="w-4 h-4" fallback="✕" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {userPreferences.enableQuickActions && currentScreen === "home" && !isMobile && (
        <div className="fixed bottom-24 right-4 z-40">
          <div
            className={`transition-all duration-300 ${showQuickActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
          >
            <div className="flex flex-col gap-2 mb-2">
              {selectedProgram && (
                <Button
                  size="sm"
                  className="bg-forest hover:bg-forest-light text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  onClick={startWorkout}
                >
                  <IconWrapper icon={Play} className="w-4 h-4 mr-1" fallback="▶" />
                  Start
                </Button>
              )}
              {completedWorkouts.length > 0 && (
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold/80 text-forest rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  onClick={quickRestartLastWorkout}
                  >
                  <IconWrapper icon={RotateCcw} className="w-4 h-4 mr-1" fallback="🔄" />
                  Repeat
                </Button>
              )}
            </div>
          </div>
          <Button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            <IconWrapper icon={Zap} className="w-6 h-6" fallback="⚡" />
          </Button>
        </div>
      )}

      <header className="bg-gradient-to-r from-forest via-forest-light to-forest text-cream p-4 shadow-2xl sticky top-0 z-50 border-b border-gold/20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="font-serif font-bold text-2xl drop-shadow-lg">FitFlow</h1>
          <div className="flex items-center gap-3">
            {workoutSession?.isActive && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold/90 text-forest px-3 py-2 rounded-full text-sm font-semibold shadow-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                In Allenamento
              </div>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center shadow-lg">
              <IconWrapper icon={Dumbbell} className="w-5 h-5 text-forest" fallback="🏋️" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pb-16">
        {currentScreen === "home" && (
          <HomeScreen
            onNavigate={navigate}
            selectedProgram={selectedProgram}
            onStartWorkout={startWorkout}
            userStats={userStats}
            achievements={achievements}
          />
        )}
        {currentScreen !== "home" && <main className="flex-1 p-4 max-w-md mx-auto pb-20">{renderScreen()}</main>}
      </div>

      {/* Mobile Navigation - Only show on mobile devices */}
      {isMobile && (
        <MobileNavigation
          currentScreen={currentScreen}
          onNavigate={navigate}
          onStartWorkout={startWorkout}
          hasSelectedProgram={!!selectedProgram}
        />
      )}

      {/* Desktop Navigation - Only show on desktop */}
      {!isMobile && (
        <nav className="bg-gradient-to-r from-forest via-forest-light to-forest text-cream p-4 fixed bottom-0 left-0 right-0 z-50 border-t border-gold/20 shadow-2xl">
          <div className="flex justify-around max-w-md mx-auto">
            {[
              { screen: "home", icon: "home", label: "Home" },
              { screen: "programs", icon: "plus", label: "Programmi" },
              { screen: "progress", icon: "chart", label: "Progressi" },
              { screen: "settings", icon: "settings", label: "Impostazioni" },
            ].map(({ screen, icon, label }) => (
              <button
                key={screen}
                onClick={() => navigate(screen as Screen)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 ${
                  currentScreen === screen
                    ? "bg-gradient-to-br from-gold to-gold/80 text-forest shadow-lg scale-110"
                    : "text-cream/80 hover:text-cream hover:bg-white/10"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {icon === "home" && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  )}
                  {icon === "plus" && <IconWrapper icon={Plus} className="w-5 h-5" fallback="+" />}
                  {icon === "chart" && <IconWrapper icon={BarChart3} className="w-5 h-5" fallback="📊" />}
                  {icon === "settings" && <IconWrapper icon={Settings} className="w-5 h-5" fallback="⚙️" />}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
