import React from 'react'
import { Plus, Play, BarChart3, Settings, Dumbbell, X, Zap, RotateCcw } from "lucide-react"
import IconWrapper from './icon-wrapper'

export const IconTest: React.FC = () => {
  const testIcons = [
    { icon: Plus, name: 'Plus', fallback: '+' },
    { icon: Play, name: 'Play', fallback: '▶' },
    { icon: BarChart3, name: 'BarChart3', fallback: '📊' },
    { icon: Settings, name: 'Settings', fallback: '⚙️' },
    { icon: Dumbbell, name: 'Dumbbell', fallback: '🏋️' },
    { icon: X, name: 'X', fallback: '✕' },
    { icon: Zap, name: 'Zap', fallback: '⚡' },
    { icon: RotateCcw, name: 'RotateCcw', fallback: '🔄' },
  ]

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Test Icone</h2>
      <div className="grid grid-cols-4 gap-4">
        {testIcons.map(({ icon, name, fallback }) => (
          <div key={name} className="text-center p-2 border rounded">
            <div className="mb-2">
              <IconWrapper icon={icon} className="w-8 h-8 mx-auto" fallback={fallback} />
            </div>
            <div className="text-xs text-gray-600">{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IconTest
