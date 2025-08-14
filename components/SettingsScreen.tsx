"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, Download, Trash2 } from "lucide-react"
import { useState } from "react"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

interface Program {
  id: string
  name: string
  description: string
  exercises: any[]
  createdAt: Date
  lastUsed?: Date
}

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

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void
  programs: Program[]
  completedWorkouts: CompletedWorkout[]
}

export default function SettingsScreen({ onNavigate, programs, completedWorkouts }: SettingsScreenProps) {
  const [showClearDataDialog, setShowClearDataDialog] = useState(false)

  const exportData = () => {
    const data = {
      programs,
      completedWorkouts,
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fitflow-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    // Clear all localStorage data
    Object.values({
      PROGRAMS: "fitflow_programs",
      SELECTED_PROGRAM: "fitflow_selected_program",
      COMPLETED_WORKOUTS: "fitflow_completed_workouts",
      EXERCISE_PROGRESS: "fitflow_exercise_progress",
      WORKOUT_SESSION: "fitflow_workout_session",
      USER_STATS: "fitflow_user_stats",
      ACHIEVEMENTS: "fitflow_achievements",
      USER_PREFERENCES: "fitflow_user_preferences",
    }).forEach((key) => {
      localStorage.removeItem(key)
    })

    setShowClearDataDialog(false)

    // Reload the page to reset the app state
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      <div className="text-center bg-gradient-to-r from-forest/10 to-gold/10 p-6 rounded-2xl border border-gold/20">
        <h2 className="font-serif font-bold text-3xl text-forest mb-2">Impostazioni</h2>
        <p className="text-charcoal/70">Gestisci i tuoi dati e preferenze</p>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <Card className="bg-white shadow-lg border border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-forest">Gestione Dati</CardTitle>
            <CardDescription>Esporta o cancella i tuoi dati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={exportData}
              className="w-full bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <Download className="w-5 h-5 mr-2" />
              Esporta Dati
            </Button>
            <Button
              onClick={() => setShowClearDataDialog(true)}
              variant="outline"
              className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300 active:scale-95"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Cancella Tutti i Dati
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-gradient-to-br from-white to-cream shadow-lg border border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-forest">Statistiche App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-charcoal/80">Programmi Creati</span>
              <span className="font-semibold text-forest">{programs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-charcoal/80">Allenamenti Completati</span>
              <span className="font-semibold text-forest">{completedWorkouts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-charcoal/80">Volume Totale</span>
              <span className="font-semibold text-forest">
                {Math.round(completedWorkouts.reduce((sum, w) => sum + w.totalVolume, 0))}kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-charcoal/80">Tempo Totale</span>
              <span className="font-semibold text-forest">
                {Math.round(completedWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60)}h
              </span>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-white shadow-lg border border-gold/20">
          <CardHeader>
            <CardTitle className="font-serif text-forest">Informazioni App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/80">Versione</span>
              <span className="font-medium text-forest">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/80">Sviluppato con</span>
              <span className="font-medium text-forest">Next.js & v0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-forest flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Conferma Cancellazione
            </DialogTitle>
            <DialogDescription>
              Questa azione cancellerà tutti i tuoi dati inclusi programmi, allenamenti e progressi. L'azione non può
              essere annullata.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button onClick={() => setShowClearDataDialog(false)} variant="outline" className="flex-1">
              Annulla
            </Button>
            <Button onClick={clearAllData} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              Cancella Tutto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
