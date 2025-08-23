import { 
  Plus, 
  Play, 
  BarChart3, 
  Settings, 
  Dumbbell, 
  X, 
  Zap, 
  RotateCcw,
  Edit,
  Trash2
} from "lucide-react"

// Configurazione delle icone con fallback
export const iconConfig = {
  plus: { component: Plus, fallback: "+" },
  play: { component: Play, fallback: "▶" },
  chart: { component: BarChart3, fallback: "📊" },
  settings: { component: Settings, fallback: "⚙️" },
  dumbbell: { component: Dumbbell, fallback: "🏋️" },
  x: { component: X, fallback: "✕" },
  zap: { component: Zap, fallback: "⚡" },
  rotateCcw: { component: RotateCcw, fallback: "🔄" },
  edit: { component: Edit, fallback: "✏️" },
  trash: { component: Trash2, fallback: "🗑️" }
}

// Funzione per ottenere un'icona in modo sicuro
export function getSafeIcon(iconName: keyof typeof iconConfig) {
  try {
    return iconConfig[iconName]
  } catch (error) {
    console.warn(`Icon ${iconName} not found, using fallback`)
    return { component: null, fallback: "?" }
  }
}

// Funzione per verificare se un'icona è valida
export function isValidIcon(icon: any): boolean {
  return icon && (typeof icon === 'function' || typeof icon === 'object')
}
