"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Play, Check, X, Dumbbell, Calendar } from "lucide-react"
import { useState } from "react"

type Screen = "home" | "programs" | "workout" | "progress" | "settings"

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

interface ProgramsScreenProps {
  onNavigate: (screen: Screen) => void
  programs: Program[]
  setPrograms: (programs: Program[]) => void
  selectedProgram: Program | null
  setSelectedProgram: (program: Program | null) => void
}

export default function ProgramsScreen({
  onNavigate,
  programs,
  setPrograms,
  selectedProgram,
  setSelectedProgram,
}: ProgramsScreenProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null)

  // Form states
  const [programName, setProgramName] = useState("")
  const [programDescription, setProgramDescription] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  // Exercise form states
  const [exerciseName, setExerciseName] = useState("")
  const [exerciseSets, setExerciseSets] = useState(3)
  const [exerciseReps, setExerciseReps] = useState(10)
  const [exerciseWeight, setExerciseWeight] = useState(0)
  const [exerciseRestTime, setExerciseRestTime] = useState(120)

  const resetForm = () => {
    setProgramName("")
    setProgramDescription("")
    setExercises([])
    setShowExerciseForm(false)
    setEditingExercise(null)
  }

  const resetExerciseForm = () => {
    setExerciseName("")
    setExerciseSets(3)
    setExerciseReps(10)
    setExerciseWeight(0)
    setExerciseRestTime(120)
    setEditingExercise(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setShowCreateDialog(true)
  }

  const openEditDialog = (program: Program) => {
    setProgramName(program.name)
    setProgramDescription(program.description)
    setExercises([...program.exercises])
    setEditingProgram(program)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (program: Program) => {
    setDeletingProgram(program)
    setShowDeleteDialog(true)
  }

  const saveProgram = () => {
    if (!programName.trim() || exercises.length === 0) return

    const newProgram: Program = {
      id: editingProgram?.id || Date.now().toString(),
      name: programName.trim(),
      description: programDescription.trim(),
      exercises: [...exercises],
      createdAt: editingProgram?.createdAt || new Date(),
      lastUsed: editingProgram?.lastUsed,
    }

    if (editingProgram) {
      // Update existing program
      setPrograms(programs.map((p) => (p.id === editingProgram.id ? newProgram : p)))
      // Update selected program if it's the one being edited
      if (selectedProgram?.id === editingProgram.id) {
        setSelectedProgram(newProgram)
      }
    } else {
      // Create new program
      setPrograms([...programs, newProgram])
    }

    setShowCreateDialog(false)
    setShowEditDialog(false)
    setEditingProgram(null)
    resetForm()
  }

  const deleteProgram = () => {
    if (!deletingProgram) return

    setPrograms(programs.filter((p) => p.id !== deletingProgram.id))

    // If deleting the selected program, clear selection
    if (selectedProgram?.id === deletingProgram.id) {
      setSelectedProgram(null)
    }

    setShowDeleteDialog(false)
    setDeletingProgram(null)
  }

  const selectProgram = (program: Program) => {
    const updatedProgram = { ...program, lastUsed: new Date() }
    setSelectedProgram(updatedProgram)

    // Update the program in the list
    setPrograms(programs.map((p) => (p.id === program.id ? updatedProgram : p)))
  }

  const addOrUpdateExercise = () => {
    if (!exerciseName.trim()) return

    const exercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: exerciseName.trim(),
      sets: exerciseSets,
      reps: exerciseReps,
      weight: exerciseWeight,
      restTime: exerciseRestTime,
    }

    if (editingExercise) {
      setExercises(exercises.map((ex) => (ex.id === editingExercise.id ? exercise : ex)))
    } else {
      setExercises([...exercises, exercise])
    }

    setShowExerciseForm(false)
    resetExerciseForm()
  }

  const editExercise = (exercise: Exercise) => {
    setExerciseName(exercise.name)
    setExerciseSets(exercise.sets)
    setExerciseReps(exercise.reps)
    setExerciseWeight(exercise.weight)
    setExerciseRestTime(exercise.restTime)
    setEditingExercise(exercise)
    setShowExerciseForm(true)
  }

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId))
  }

  const formatRestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-forest/10 to-gold/10 p-6 rounded-2xl border border-gold/20">
        <h2 className="font-serif font-bold text-3xl text-forest">I Tuoi Programmi</h2>
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuovo
        </Button>
      </div>

      <div className="space-y-6">
        {programs.length === 0 ? (
          <Card className="bg-gradient-to-br from-white to-cream shadow-2xl border border-gold/20 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Plus className="w-10 h-10 text-forest" />
              </div>
              <h3 className="font-serif font-bold text-xl text-forest mb-2">Inizia il Tuo Percorso</h3>
              <p className="text-charcoal/70 mb-6">Crea il tuo primo programma personalizzato</p>
              <Button
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              >
                Crea il Tuo Primo Programma
              </Button>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card
              key={program.id}
              className={`relative overflow-hidden bg-gradient-to-br from-white via-white to-cream shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group ${
                selectedProgram?.id === program.id
                  ? "border-2 border-forest shadow-2xl ring-4 ring-forest/20"
                  : "border border-gray-200"
              }`}
            >
              {selectedProgram?.id === program.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-forest/5 via-transparent to-gold/5"></div>
              )}

              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="font-serif text-forest flex items-center gap-3 text-xl">
                      <div
                        className={`w-10 h-10 rounded-xl shadow-lg flex items-center justify-center ${
                          selectedProgram?.id === program.id
                            ? "bg-gradient-to-br from-forest to-forest-light"
                            : "bg-gradient-to-br from-gold to-gold/80"
                        }`}
                      >
                        {selectedProgram?.id === program.id ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Dumbbell className="w-5 h-5 text-forest" />
                        )}
                      </div>
                      {program.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {program.description || "Nessuna descrizione"}
                    </CardDescription>
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-2 text-sm text-charcoal/80">
                        <div className="w-2 h-2 bg-forest rounded-full"></div>
                        <span className="font-medium">{program.exercises.length} esercizi</span>
                      </div>
                      {program.lastUsed && (
                        <div className="flex items-center gap-2 text-sm text-charcoal/80">
                          <Calendar className="w-3 h-3" />
                          <span>Ultimo uso: {program.lastUsed.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(program)}
                      className="text-charcoal hover:text-forest hover:bg-forest/10 rounded-lg p-2 transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(program)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  {program.exercises.slice(0, 3).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex justify-between items-center bg-gradient-to-r from-cream to-gold/10 p-4 rounded-xl border border-gold/20"
                    >
                      <span className="font-semibold text-charcoal">{exercise.name}</span>
                      <span className="text-charcoal/80 font-medium">
                        {exercise.sets} × {exercise.reps} {exercise.weight > 0 && `× ${exercise.weight}kg`}
                      </span>
                    </div>
                  ))}
                  {program.exercises.length > 3 && (
                    <div className="text-sm text-charcoal/60 text-center py-2 bg-gradient-to-r from-transparent via-gold/5 to-transparent rounded-lg">
                      +{program.exercises.length - 3} altri esercizi
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => selectProgram(program)}
                  className={`w-full font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 ${
                    selectedProgram?.id === program.id
                      ? "bg-gradient-to-r from-gold to-gold/90 hover:from-gold/90 hover:to-gold text-forest"
                      : "bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white"
                  }`}
                >
                  {selectedProgram?.id === program.id ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Programma Selezionato
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Seleziona Programma
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Program Dialog */}
      <Dialog
        open={showCreateDialog || showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false)
            setShowEditDialog(false)
            setEditingProgram(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-forest">
              {editingProgram ? "Modifica Programma" : "Nuovo Programma"}
            </DialogTitle>
            <DialogDescription>
              {editingProgram
                ? "Modifica il tuo programma di allenamento"
                : "Crea un nuovo programma di allenamento personalizzato"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Program Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="program-name">Nome Programma</Label>
                <Input
                  id="program-name"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="es. Push Day, Full Body..."
                />
              </div>
              <div>
                <Label htmlFor="program-description">Descrizione (opzionale)</Label>
                <Textarea
                  id="program-description"
                  value={programDescription}
                  onChange={(e) => setProgramDescription(e.target.value)}
                  placeholder="Breve descrizione del programma..."
                  rows={2}
                />
              </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-forest">Esercizi</h4>
                <Button
                  onClick={() => setShowExerciseForm(true)}
                  size="sm"
                  className="btn-secondary transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Aggiungi
                </Button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-4 text-charcoal opacity-60">
                  <p className="text-sm">Nessun esercizio aggiunto</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-charcoal">{exercise.name}</div>
                        <div className="text-sm text-charcoal opacity-80">
                          {exercise.sets} serie × {exercise.reps} rip
                          {exercise.weight > 0 && ` × ${exercise.weight}kg`}
                          {" • "}
                          {formatRestTime(exercise.restTime)} riposo
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editExercise(exercise)}
                          className="text-charcoal hover:text-forest p-1 h-auto"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-600 hover:text-red-700 p-1 h-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exercise Form */}
            {showExerciseForm && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-forest">
                    {editingExercise ? "Modifica Esercizio" : "Nuovo Esercizio"}
                  </h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowExerciseForm(false)
                      resetExerciseForm()
                    }}
                    className="text-charcoal hover:text-red-600 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="exercise-name">Nome Esercizio</Label>
                  <Input
                    id="exercise-name"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    placeholder="es. Panca Piana, Squat..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-sets">Serie</Label>
                    <Input
                      id="exercise-sets"
                      type="number"
                      min="1"
                      max="10"
                      value={exerciseSets}
                      onChange={(e) => setExerciseSets(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercise-reps">Ripetizioni</Label>
                    <Input
                      id="exercise-reps"
                      type="number"
                      min="1"
                      max="50"
                      value={exerciseReps}
                      onChange={(e) => setExerciseReps(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise-weight">Peso (kg)</Label>
                    <Input
                      id="exercise-weight"
                      type="number"
                      min="0"
                      step="0.5"
                      value={exerciseWeight}
                      onChange={(e) => setExerciseWeight(Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exercise-rest">Riposo (sec)</Label>
                    <Input
                      id="exercise-rest"
                      type="number"
                      min="30"
                      max="600"
                      step="30"
                      value={exerciseRestTime}
                      onChange={(e) => setExerciseRestTime(Number.parseInt(e.target.value) || 120)}
                    />
                  </div>
                </div>

                <Button
                  onClick={addOrUpdateExercise}
                  className="btn-primary w-full transition-all duration-200 active:scale-95"
                  disabled={!exerciseName.trim()}
                >
                  {editingExercise ? "Aggiorna Esercizio" : "Aggiungi Esercizio"}
                </Button>
              </div>
            )}

            {/* Save Program Button */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  setShowEditDialog(false)
                  setEditingProgram(null)
                  resetForm()
                }}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                onClick={saveProgram}
                className="btn-primary flex-1 transition-all duration-200 active:scale-95"
                disabled={!programName.trim() || exercises.length === 0}
              >
                {editingProgram ? "Salva Modifiche" : "Crea Programma"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-forest">Elimina Programma</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare "{deletingProgram?.name}"? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
              Annulla
            </Button>
            <Button
              onClick={deleteProgram}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white transition-all duration-200 active:scale-95"
            >
              Elimina
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
