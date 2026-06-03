import { useState } from 'react'
import { useLocalStorage } from './utils/storage'
import { createWarband } from './utils/defaults'
import WarbandList from './components/WarbandList'
import RosterSheet from './components/RosterSheet'

export default function App() {
  const [warbands, setWarbands] = useLocalStorage('mordheim-warbands', [])
  const [selectedId, setSelectedId] = useState(null)

  const handleCreate = () => {
    const wb = createWarband()
    setWarbands(prev => [...prev, wb])
    setSelectedId(wb.id)
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

  const selected = warbands.find(wb => wb.id === selectedId)

  if (selected) {
    return (
      <div className="app">
        <RosterSheet
          warband={selected}
          onUpdate={handleUpdate}
          onBack={() => setSelectedId(null)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <WarbandList
        warbands={warbands}
        onSelect={setSelectedId}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    </div>
  )
}
