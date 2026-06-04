import { useState } from 'react'
import { useLocalStorage } from './utils/storage'
import { createWarband } from './utils/defaults'
import WarbandList from './components/WarbandList'
import RosterSheet from './components/RosterSheet'
import BattleNotes from './components/BattleNotes'

export default function App() {
  const [warbands, setWarbands] = useLocalStorage('mordheim-warbands', [])
  const [selectedId, setSelectedId] = useState(null)
  const [screen, setScreen] = useState('list') // 'list' | 'roster' | 'battles'

  const handleCreate = () => {
    const wb = createWarband()
    setWarbands(prev => [...prev, wb])
    setSelectedId(wb.id)
    setScreen('roster')
  }

  const handleUpdate = (updated) => {
    setWarbands(prev => prev.map(wb => wb.id === updated.id ? updated : wb))
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this warband? This cannot be undone.')) {
      setWarbands(prev => prev.filter(wb => wb.id !== id))
      if (selectedId === id) setSelectedId(null)
    }
  }

  const handleSelect = (id) => {
    setSelectedId(id)
    setScreen('roster')
  }

  const selected = warbands.find(wb => wb.id === selectedId)

  if (screen === 'roster' && selected) {
    return (
      <div className="app">
        <RosterSheet
          warband={selected}
          onUpdate={handleUpdate}
          onBack={() => setScreen('list')}
        />
      </div>
    )
  }

  if (screen === 'battles') {
    return (
      <div className="app">
        <BattleNotes
          warbands={warbands}
          onBack={() => setScreen('list')}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <WarbandList
        warbands={warbands}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        onBattleNotes={() => setScreen('battles')}
      />
    </div>
  )
}
