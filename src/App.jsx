import { useState } from 'react'
import { useLocalStorage } from './utils/storage'
import { createWarband } from './utils/defaults'
import WarbandList from './components/WarbandList'
import RosterSheet from './components/RosterSheet'
import BattleNotes from './components/BattleNotes'
import HouseRules from './components/HouseRules'

const DEFAULT_HOUSE_RULES = `The following house rules are in effect:

1) Two weapons fights have a -1 to hit on each attack, unless you have the weapon master skill.
2) Strength does not modify armour save at all. The only things that do are the explicit modifiers, such as the -1 you get from axes and gunpowder weapons, for example.
3) Skills cannot be repeated in a warband, and once they are lost, for example if the fighter dies, then they are lost for the duration of the campaign or until there are no other skills available.
4) Max 5 slings, slings are S2.

There may be more added as the campaign progresses.`

export default function App() {
  const [warbands, setWarbands] = useLocalStorage('mordheim-warbands', [])
  const [houseRules, setHouseRules] = useLocalStorage('mordheim-house-rules', DEFAULT_HOUSE_RULES)
  const [selectedId, setSelectedId] = useState(null)
  const [screen, setScreen] = useState('list') // 'list' | 'roster' | 'battles' | 'rules'

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
          houseRules={houseRules}
          onBack={() => setScreen('list')}
        />
      </div>
    )
  }

  if (screen === 'rules') {
    return (
      <div className="app">
        <HouseRules
          rules={houseRules}
          onChange={setHouseRules}
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
        onHouseRules={() => setScreen('rules')}
      />
    </div>
  )
}
