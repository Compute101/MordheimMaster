import { useState } from 'react'
import { SCENARIOS, createBattle } from '../utils/battleDefaults'

function WarbandSlot({ index, warbands, slot, onChange }) {
  const [addWarriorInput, setAddWarriorInput] = useState('')
  const [customMode, setCustomMode] = useState(!slot.rosterId)

  const selectRoster = (wb) => {
    const warriors = [
      ...wb.heroes.filter(h => h.name).map(h => ({ name: h.name, type: 'hero' })),
      ...wb.henchmen.filter(g => g.name).map(g => ({ name: g.name, type: 'henchman' })),
    ]
    setCustomMode(false)
    onChange({ rosterId: wb.id, name: wb.name, warriors })
  }

  const switchToCustom = () => {
    setCustomMode(true)
    onChange({ rosterId: null, name: slot.name, warriors: slot.warriors })
  }

  const addWarrior = () => {
    const name = addWarriorInput.trim()
    if (!name) return
    onChange({ ...slot, warriors: [...slot.warriors, { name, type: 'hero' }] })
    setAddWarriorInput('')
  }

  const removeWarrior = (i) => {
    onChange({ ...slot, warriors: slot.warriors.filter((_, idx) => idx !== i) })
  }

  const toggleSittingOut = (i) => {
    onChange({
      ...slot,
      warriors: slot.warriors.map((w, idx) =>
        idx === i ? { ...w, sittingOut: !w.sittingOut } : w
      ),
    })
  }

  const label = index === 0 ? 'Warband 1' : 'Warband 2'

  return (
    <div className="bn-warband-slot">
      <div className="bn-slot-header">
        <span className="bn-slot-label">{label}</span>
        {!customMode && (
          <button className="bn-link-btn" onClick={switchToCustom}>Custom name</button>
        )}
      </div>

      {customMode ? (
        <input
          className="bn-name-input"
          placeholder="Warband name…"
          value={slot.name}
          onChange={e => onChange({ ...slot, name: e.target.value })}
        />
      ) : (
        <div className="bn-selected-roster">
          <span className="bn-selected-name">{slot.name}</span>
          <button className="bn-link-btn" onClick={switchToCustom}>Change</button>
        </div>
      )}

      {warbands.length > 0 && (
        <div className="bn-roster-pick">
          <div className="bn-pick-label">From saved roster:</div>
          <div className="bn-roster-chips">
            {warbands.map(wb => (
              <button
                key={wb.id}
                className={`bn-roster-chip${slot.rosterId === wb.id ? ' active' : ''}`}
                onClick={() => selectRoster(wb)}
              >
                {wb.name || 'Unnamed'} <span className="bn-chip-type">{wb.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bn-warriors-list">
        <div className="bn-pick-label">
          Warriors:
          {slot.warriors.length > 0 && (
            <span className="bn-pick-hint"> — tap name to mark sitting out</span>
          )}
        </div>
        {slot.warriors.length === 0 && (
          <div className="bn-no-warriors">No warriors added yet</div>
        )}
        <div className="bn-warrior-chips">
          {slot.warriors.map((w, i) => (
            <span key={i} className={`bn-warrior-tag${w.sittingOut ? ' is-sitout' : ''}`}>
              <button
                className="bn-warrior-sitout-toggle"
                onClick={() => toggleSittingOut(i)}
                title={w.sittingOut ? 'Sitting out — tap to include' : 'Tap to mark sitting out'}
              >
                {w.sittingOut && <span className="bn-sitout-badge">out</span>}
                {w.name}
              </button>
              <button className="bn-warrior-remove" onClick={() => removeWarrior(i)}>×</button>
            </span>
          ))}
        </div>
        <div className="bn-add-warrior-row">
          <input
            className="bn-warrior-input"
            placeholder="Add warrior name…"
            value={addWarriorInput}
            onChange={e => setAddWarriorInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addWarrior()}
          />
          <button className="bn-add-warrior-btn" onClick={addWarrior}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default function BattleSetup({ warbands, houseRules, onBegin, onBack }) {
  const [scenario, setScenario] = useState('')
  const [customScenario, setCustomScenario] = useState('')
  const [slots, setSlots] = useState([
    { rosterId: null, name: '', warriors: [] },
    { rosterId: null, name: '', warriors: [] },
  ])

  const updateSlot = (idx, updates) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...updates } : s))
  }

  const effectiveScenario = scenario === '__custom__' ? customScenario : scenario
  const canBegin = slots[0].name.trim() && slots[1].name.trim() && effectiveScenario.trim()

  const handleBegin = () => {
    const battle = createBattle({
      scenario: effectiveScenario,
      warband0: slots[0],
      warband1: slots[1],
      houseRules: houseRules || '',
    })
    onBegin(battle)
  }

  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="bn-topbar-title">New Battle</div>
      </div>

      <div className="bn-content">
        <div className="bn-section">
          <div className="bn-section-title">Scenario</div>
          <div className="bn-scenario-btns">
            {SCENARIOS.map(s => (
              <button
                key={s}
                className={`bn-scenario-btn${scenario === s ? ' active' : ''}`}
                onClick={() => setScenario(s)}
              >
                {s}
              </button>
            ))}
            <button
              className={`bn-scenario-btn${scenario === '__custom__' ? ' active' : ''}`}
              onClick={() => setScenario('__custom__')}
            >
              Custom…
            </button>
          </div>
          {scenario === '__custom__' && (
            <input
              className="bn-name-input"
              placeholder="Scenario name…"
              value={customScenario}
              onChange={e => setCustomScenario(e.target.value)}
            />
          )}
        </div>

        <div className="bn-slots-row">
          <WarbandSlot index={0} warbands={warbands} slot={slots[0]} onChange={s => updateSlot(0, s)} />
          <WarbandSlot index={1} warbands={warbands} slot={slots[1]} onChange={s => updateSlot(1, s)} />
        </div>

        <div className="bn-begin-row">
          <button
            className="bn-begin-btn"
            disabled={!canBegin}
            onClick={handleBegin}
          >
            Begin Battle
          </button>
        </div>
      </div>
    </div>
  )
}
