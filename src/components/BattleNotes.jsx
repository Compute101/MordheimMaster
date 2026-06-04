import { useState } from 'react'
import { useLocalStorage } from '../utils/storage'
import { generateBattleText } from '../utils/battleDefaults'
import BattleSetup from './BattleSetup'
import BattleRecorder from './BattleRecorder'
import PostBattle from './PostBattle'

function BattleView({ battle, onBack }) {
  const [copied, setCopied] = useState(false)
  const text = generateBattleText(battle)
  const date = new Date(battle.date).toLocaleDateString()

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="bn-topbar-title">{battle.scenario}</div>
        <button className="bn-copy-btn" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
      <div className="bn-content">
        <div className="bn-battle-meta">
          <span>{date}</span>
          <span>{battle.warbands[0].name} vs {battle.warbands[1].name}</span>
          {battle.postBattle.result === 'warband0' && <span className="bn-winner">{battle.warbands[0].name} won</span>}
          {battle.postBattle.result === 'warband1' && <span className="bn-winner">{battle.warbands[1].name} won</span>}
          {battle.postBattle.result === 'draw' && <span className="bn-winner">Draw</span>}
        </div>
        <pre className="bn-battle-text">{text}</pre>
      </div>
    </div>
  )
}

function BattleHistory({ battles, onNew, onView, onDelete, onBack }) {
  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <button className="back-btn" onClick={onBack}>← Rosters</button>
        <div className="bn-topbar-title">Battle Notes</div>
      </div>
      <div className="bn-content">
        {battles.length === 0 ? (
          <div className="empty-state bn-empty">No battles recorded yet. Begin a new battle!</div>
        ) : (
          <div className="bn-history-list">
            {[...battles].reverse().map(b => {
              const date = new Date(b.date).toLocaleDateString()
              const turns = b.turns.length ? Math.max(...b.turns.map(t => t.turnNumber)) : 0
              const events = b.turns.reduce((n, t) => n + t.events.length, 0)
              const resultLabel = b.postBattle.result === 'warband0' ? `${b.warbands[0].name} won`
                : b.postBattle.result === 'warband1' ? `${b.warbands[1].name} won`
                : b.postBattle.result === 'draw' ? 'Draw'
                : ''
              return (
                <div key={b.id} className="bn-history-item" onClick={() => onView(b.id)}>
                  <div className="bn-history-scenario">{b.scenario}</div>
                  <div className="bn-history-matchup">
                    {b.warbands[0].name} <span className="bn-vs">vs</span> {b.warbands[1].name}
                  </div>
                  <div className="bn-history-meta">
                    <span>{date}</span>
                    {resultLabel && <span className="bn-winner-tag">{resultLabel}</span>}
                    <span>{turns} turn{turns !== 1 ? 's' : ''}</span>
                    <span>{events} event{events !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={e => { e.stopPropagation(); onDelete(b.id) }}
                    title="Delete battle record"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <button className="create-btn bn-new-battle-btn" onClick={onNew}>
          ⚔ New Battle
        </button>
      </div>
    </div>
  )
}

export default function BattleNotes({ warbands, onBack }) {
  const [battles, setBattles] = useLocalStorage('mordheim-battles', [])
  const [phase, setPhase] = useState('history')
  const [activeBattle, setActiveBattle] = useState(null)
  const [viewId, setViewId] = useState(null)

  const handleBegin = (battle) => {
    setActiveBattle(battle)
    setPhase('battle')
  }

  const handleBattleChange = (updated) => {
    setActiveBattle(updated)
  }

  const handleEndBattle = () => {
    setPhase('post-battle')
  }

  const handleSave = () => {
    const completed = { ...activeBattle, completed: true }
    setBattles(prev => [...prev, completed])
    setActiveBattle(null)
    setPhase('history')
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this battle record?')) {
      setBattles(prev => prev.filter(b => b.id !== id))
    }
  }

  if (phase === 'history') {
    const viewBattle = battles.find(b => b.id === viewId)
    if (viewId && viewBattle) {
      return <BattleView battle={viewBattle} onBack={() => setViewId(null)} />
    }
    return (
      <BattleHistory
        battles={battles}
        onNew={() => setPhase('setup')}
        onView={id => setViewId(id)}
        onDelete={handleDelete}
        onBack={onBack}
      />
    )
  }

  if (phase === 'setup') {
    return (
      <BattleSetup
        warbands={warbands}
        onBegin={handleBegin}
        onBack={() => setPhase('history')}
      />
    )
  }

  if (phase === 'battle') {
    return (
      <BattleRecorder
        battle={activeBattle}
        onChange={handleBattleChange}
        onEndBattle={handleEndBattle}
      />
    )
  }

  if (phase === 'post-battle') {
    return (
      <PostBattle
        battle={activeBattle}
        onChange={handleBattleChange}
        onSave={handleSave}
      />
    )
  }

  return null
}
