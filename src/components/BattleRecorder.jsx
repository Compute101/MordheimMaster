import { useState } from 'react'
import { ACTIONS, OUTCOMES, CRITICAL_TABLES, makeEventNote } from '../utils/battleDefaults'

const INITIAL_ACTION = { phase: null, actor: null, actionKey: null, target: null, otherText: '', critTable: null }
const CRIT_FIGHT_TABLES = ['bladed', 'bludgeoning', 'thrusting', 'unarmed']

function addEventToTurn(battle, event) {
  const { currentTurn, currentWarbandIndex } = battle
  const idx = battle.turns.findIndex(
    t => t.turnNumber === currentTurn && t.warbandIndex === currentWarbandIndex
  )
  if (idx >= 0) {
    const turns = battle.turns.map((t, i) =>
      i === idx ? { ...t, events: [...t.events, event] } : t
    )
    return { ...battle, turns }
  }
  const newTurn = {
    id: crypto.randomUUID(),
    turnNumber: currentTurn,
    warbandIndex: currentWarbandIndex,
    events: [event],
  }
  return { ...battle, turns: [...battle.turns, newTurn] }
}

export default function BattleRecorder({ battle, onChange, onEndBattle }) {
  const [as, setAs] = useState(INITIAL_ACTION)
  const [logOpen, setLogOpen] = useState(false)
  const [turnNote, setTurnNote] = useState('')
  const [turnNoteOpen, setTurnNoteOpen] = useState(false)

  const wb0 = battle.warbands[0]
  const wb1 = battle.warbands[1]
  const isPregame = battle.currentTurn === 0
  const activeWbName = isPregame ? null : battle.warbands[battle.currentWarbandIndex]?.name

  const selectWarrior = (name, wbIdx) => {
    setAs({ ...INITIAL_ACTION, phase: 'action', actor: { name, wbIdx } })
  }

  const selectAction = (action) => {
    if (action.isOther) {
      setAs(prev => ({ ...prev, phase: 'other', actionKey: 'other', otherText: '' }))
      return
    }
    if (action.isExplore) {
      setAs(prev => ({ ...prev, phase: 'explore', actionKey: 'explore', otherText: '' }))
      return
    }
    if (!action.needsTarget && !action.needsOutcome) {
      commitEvent({ actionKey: action.key, target: null, outcome: null })
      return
    }
    if (action.needsTarget) {
      setAs(prev => ({ ...prev, phase: 'target', actionKey: action.key }))
      return
    }
    // needsOutcome but no target (e.g. Climb/Vault) — skip straight to outcome
    if (action.needsOutcome) {
      setAs(prev => ({ ...prev, phase: 'outcome', actionKey: action.key, target: null }))
    }
  }

  const selectTarget = (name, wbIdx) => {
    const action = ACTIONS.find(a => a.key === as.actionKey)
    if (action?.needsOutcome) {
      setAs(prev => ({ ...prev, phase: 'outcome', target: { name, wbIdx } }))
    } else {
      commitEvent({ actionKey: as.actionKey, target: { name, wbIdx }, outcome: null })
    }
  }

  const skipTarget = () => {
    const action = ACTIONS.find(a => a.key === as.actionKey)
    if (action?.needsOutcome) {
      setAs(prev => ({ ...prev, phase: 'outcome', target: null }))
    } else {
      commitEvent({ actionKey: as.actionKey, target: null, outcome: null })
    }
  }

  const selectOutcome = (outcome) => {
    commitEvent({ actionKey: as.actionKey, target: as.target, outcome })
  }

  const commitOther = () => {
    if (!as.otherText.trim()) return
    const event = {
      id: crypto.randomUUID(),
      actorName: as.actor.name,
      actorWbIdx: as.actor.wbIdx,
      actionKey: 'other',
      targetName: null,
      outcome: null,
      note: `${as.actor.name}: ${as.otherText.trim()}`,
    }
    onChange(addEventToTurn(battle, event))
    setAs(INITIAL_ACTION)
  }

  const commitExplore = () => {
    const loc = as.otherText.trim()
    const event = {
      id: crypto.randomUUID(),
      actorName: as.actor.name,
      actorWbIdx: as.actor.wbIdx,
      actionKey: 'explore',
      targetName: null,
      outcome: null,
      note: loc ? `${as.actor.name} explored ${loc}` : `${as.actor.name} explored`,
    }
    onChange(addEventToTurn(battle, event))
    setAs(INITIAL_ACTION)
  }

  const commitCrit = (result) => {
    const targetText = as.target ? ` on ${as.target.name}` : ''
    const note = `${as.actor.name} crit${targetText} — ${result.name}: ${result.effect}`
    const event = {
      id: crypto.randomUUID(),
      actorName: as.actor.name,
      actorWbIdx: as.actor.wbIdx,
      actionKey: as.actionKey,
      targetName: as.target?.name || null,
      outcome: `Crit: ${result.name}`,
      note,
    }
    onChange(addEventToTurn(battle, event))
    setAs(INITIAL_ACTION)
  }

  const commitEvent = ({ actionKey, target, outcome }) => {
    const note = makeEventNote({
      actorName: as.actor.name,
      actionKey,
      targetName: target?.name || null,
      outcome,
    })
    const event = {
      id: crypto.randomUUID(),
      actorName: as.actor.name,
      actorWbIdx: as.actor.wbIdx,
      actionKey,
      targetName: target?.name || null,
      outcome,
      note,
    }
    onChange(addEventToTurn(battle, event))
    setAs(INITIAL_ACTION)
  }

  const commitTurnNote = () => {
    if (!turnNote.trim()) return
    const event = {
      id: crypto.randomUUID(),
      actorName: null,
      actorWbIdx: null,
      actionKey: 'turn-note',
      targetName: null,
      outcome: null,
      note: turnNote.trim(),
    }
    onChange(addEventToTurn(battle, event))
    setTurnNote('')
    setTurnNoteOpen(false)
  }

  const handleEndTurn = () => {
    setAs(INITIAL_ACTION)
    setTurnNoteOpen(false)
    setTurnNote('')
    if (isPregame) {
      onChange({ ...battle, currentTurn: 1, currentWarbandIndex: 0 })
    } else {
      const nextWbIdx = battle.currentWarbandIndex === 0 ? 1 : 0
      const nextTurn = battle.currentWarbandIndex === 1 ? battle.currentTurn + 1 : battle.currentTurn
      onChange({ ...battle, currentWarbandIndex: nextWbIdx, currentTurn: nextTurn })
    }
  }

  const totalEvents = battle.turns.reduce((n, t) => n + t.events.length, 0)

  const renderWarriorCol = (wb, wbIdx) => {
    const isActive = battle.currentWarbandIndex === wbIdx
    const playing = wb.warriors.filter(w => !w.sittingOut)
    const sitout = wb.warriors.filter(w => w.sittingOut)
    return (
      <div className={`rec-warband-col${isActive ? ' is-active' : ''}`}>
        <div className="rec-col-title">
          {isActive && <span className="rec-active-dot" />}
          {wb.name}
        </div>
        <div className="rec-warrior-btns">
          {playing.length === 0 && (
            <span className="rec-no-warriors">No warriors</span>
          )}
          {playing.map((w, i) => (
            <button
              key={i}
              className={`rec-warrior-btn${as.actor?.name === w.name && as.actor?.wbIdx === wbIdx ? ' selected' : ''}`}
              onClick={() => selectWarrior(w.name, wbIdx)}
            >
              {w.name}
            </button>
          ))}
          {sitout.length > 0 && (
            <div className="rec-sitout">
              Sitting out: {sitout.map(w => w.name).join(', ')}
            </div>
          )}
        </div>
      </div>
    )
  }

  const otherWbWarriors = as.actor
    ? (as.actor.wbIdx === 0 ? wb1.warriors : wb0.warriors).filter(w => !w.sittingOut)
    : []
  const bothWbWarriors = as.actor
    ? [
        ...wb0.warriors.filter(w => !w.sittingOut).map(w => ({ ...w, wbIdx: 0 })),
        ...wb1.warriors.filter(w => !w.sittingOut).map(w => ({ ...w, wbIdx: 1 })),
      ]
    : []

  return (
    <div className="bn-page">
      <div className="rec-header">
        <div className="rec-turn-info">
          {isPregame ? (
            <span className="rec-turn-num rec-turn-pregame">Pre-game</span>
          ) : (
            <>
              <span className="rec-turn-num">Turn {battle.currentTurn}</span>
              <span className="rec-turn-sep">—</span>
              <span className="rec-turn-wb">{activeWbName}</span>
            </>
          )}
        </div>
        <div className="rec-header-btns">
          <button
            className={`rec-btn rec-btn--note${turnNoteOpen ? ' active' : ''}`}
            onClick={() => { setTurnNoteOpen(o => !o); setAs(INITIAL_ACTION) }}
            title="Add a note for this phase"
          >
            📝
          </button>
          <button className="rec-btn rec-btn--turn" onClick={handleEndTurn}>
            {isPregame ? 'Begin Turn 1 →' : 'End Turn →'}
          </button>
          {!isPregame && (
            <button className="rec-btn rec-btn--end" onClick={onEndBattle}>
              End Battle
            </button>
          )}
        </div>
      </div>

      <div className="rec-warriors-grid">
        {renderWarriorCol(wb0, 0)}
        <div className="rec-col-divider" />
        {renderWarriorCol(wb1, 1)}
      </div>

      {turnNoteOpen && (
        <div className="rec-action-panel rec-turn-note-panel">
          <div className="rec-ap-actor">
            <span className="rec-ap-acting">Turn note</span>
            <span className="rec-ap-wb">
              {isPregame ? '— Pre-game' : `— ${activeWbName} turn ${battle.currentTurn}`}
            </span>
            <button className="rec-ap-cancel" onClick={() => { setTurnNoteOpen(false); setTurnNote('') }}>✕</button>
          </div>
          <div className="rec-ap-section">
            <div className="rec-ap-other-row">
              <input
                className="rec-ap-other-input"
                placeholder="Flavour, context, anything that happened…"
                value={turnNote}
                autoFocus
                onChange={e => setTurnNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && commitTurnNote()}
              />
              <button className="rec-ap-btn" onClick={commitTurnNote}>Log</button>
            </div>
          </div>
        </div>
      )}

      {!turnNoteOpen && as.phase && (
        <div className="rec-action-panel">
          <div className="rec-ap-actor">
            <span className="rec-ap-acting">Acting:</span>
            <strong>{as.actor.name}</strong>
            <span className="rec-ap-wb">{battle.warbands[as.actor.wbIdx].name}</span>
            <button className="rec-ap-cancel" onClick={() => setAs(INITIAL_ACTION)}>✕</button>
          </div>

          {as.phase === 'action' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">Choose action:</div>
              <div className="rec-ap-btns">
                {ACTIONS.map(a => (
                  <button key={a.key} className="rec-ap-btn" onClick={() => selectAction(a)}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {as.phase === 'target' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">
                {as.actionKey === 'goad' ? 'Goad target:' : 'Target:'}
              </div>
              <div className="rec-ap-btns">
                {(as.actionKey === 'goad' ? bothWbWarriors : otherWbWarriors.map(w => ({ ...w, wbIdx: as.actor.wbIdx === 0 ? 1 : 0 }))).map((w, i) => (
                  <button key={i} className="rec-ap-btn" onClick={() => selectTarget(w.name, w.wbIdx)}>
                    {w.name}
                  </button>
                ))}
                <button className="rec-ap-btn rec-ap-btn--skip" onClick={skipTarget}>
                  Skip
                </button>
              </div>
            </div>
          )}

          {as.phase === 'outcome' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">
                {as.target ? `vs ${as.target.name} —` : ''} Outcome:
              </div>
              <div className="rec-ap-btns">
                {(OUTCOMES[as.actionKey] || []).map(o => (
                  <button key={o} className="rec-ap-btn" onClick={() => selectOutcome(o)}>
                    {o}
                  </button>
                ))}
                {['fight', 'diving-charge', 'shoot', 'throw'].includes(as.actionKey) && (
                  <button
                    className="rec-ap-btn rec-ap-btn--crit"
                    onClick={() => {
                      const autoTable = (as.actionKey === 'shoot' || as.actionKey === 'throw') ? 'missile' : null
                      setAs(prev => ({ ...prev, phase: autoTable ? 'crit-result' : 'crit-table', critTable: autoTable }))
                    }}
                  >
                    Critical Hit →
                  </button>
                )}
              </div>
            </div>
          )}

          {as.phase === 'crit-table' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">Critical hit — weapon type:</div>
              <div className="rec-ap-btns">
                {CRIT_FIGHT_TABLES.map(key => {
                  const table = CRITICAL_TABLES[key]
                  return (
                    <button
                      key={key}
                      className="rec-ap-btn rec-ap-btn--table"
                      onClick={() => setAs(prev => ({ ...prev, phase: 'crit-result', critTable: key }))}
                    >
                      <span className="rec-btn-table-label">{table.label}</span>
                      <span className="rec-btn-table-sub">{table.subtitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {as.phase === 'crit-result' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">
                {CRITICAL_TABLES[as.critTable]?.label} critical — roll result:
                {CRIT_FIGHT_TABLES.includes(as.critTable) && (
                  <button
                    className="rec-ap-back-link"
                    onClick={() => setAs(prev => ({ ...prev, phase: 'crit-table', critTable: null }))}
                  >
                    ← change
                  </button>
                )}
              </div>
              <div className="rec-ap-crit-results">
                {(CRITICAL_TABLES[as.critTable]?.results || []).map(r => (
                  <button
                    key={r.name}
                    className="rec-ap-btn--crit-result"
                    onClick={() => commitCrit(r)}
                  >
                    <span className="rec-crit-range">{r.range}</span>
                    <div className="rec-crit-info">
                      <span className="rec-crit-name">{r.name}</span>
                      <span className="rec-crit-effect">{r.effect}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {as.phase === 'other' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">Custom note:</div>
              <div className="rec-ap-other-row">
                <input
                  className="rec-ap-other-input"
                  placeholder="What happened…"
                  value={as.otherText}
                  autoFocus
                  onChange={e => setAs(prev => ({ ...prev, otherText: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && commitOther()}
                />
                <button className="rec-ap-btn" onClick={commitOther}>Log</button>
              </div>
            </div>
          )}

          {as.phase === 'explore' && (
            <div className="rec-ap-section">
              <div className="rec-ap-label">What / where explored:</div>
              <div className="rec-ap-other-row">
                <input
                  className="rec-ap-other-input"
                  placeholder="e.g. Brewery, Rocky Hill, Tower, Boyar's house…"
                  value={as.otherText}
                  autoFocus
                  onChange={e => setAs(prev => ({ ...prev, otherText: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && commitExplore()}
                />
                <button className="rec-ap-btn" onClick={commitExplore}>Log</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rec-log">
        <button className="rec-log-toggle" onClick={() => setLogOpen(o => !o)}>
          {logOpen ? '▲' : '▼'} Battle Log ({totalEvents} event{totalEvents !== 1 ? 's' : ''})
        </button>
        {logOpen && (
          <div className="rec-log-content">
            {battle.turns.length === 0 && (
              <div className="rec-log-empty">No events yet.</div>
            )}
            {[...battle.turns]
              .sort((a, b) => a.turnNumber - b.turnNumber || a.warbandIndex - b.warbandIndex)
              .map(turn => (
                <div key={turn.id} className="rec-turn-group">
                  <div className="rec-turn-group-title">
                    {turn.turnNumber === 0
                      ? 'Pre-game'
                      : `Turn ${turn.turnNumber} — ${battle.warbands[turn.warbandIndex]?.name || ''}`}
                  </div>
                  {turn.events.map(e => (
                    <div key={e.id} className={`rec-log-event${e.actorName === null ? ' rec-log-event--note' : ''}`}>
                      {e.note}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
