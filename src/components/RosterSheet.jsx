import { useState } from 'react'
import HeroCard from './HeroCard'
import HenchmanCard from './HenchmanCard'
import { createHenchmanGroup } from '../utils/defaults'

export default function RosterSheet({ warband, onUpdate, onBack }) {
  const [heroesCollapsed, setHeroesCollapsed] = useState(false)
  const set = (field, value) => onUpdate({ ...warband, [field]: value })

  const updateHero = (index, updated) => {
    const heroes = warband.heroes.map((h, i) => i === index ? updated : h)
    onUpdate({ ...warband, heroes })
  }

  const updateHenchman = (index, updated) => {
    const henchmen = warband.henchmen.map((g, i) => i === index ? updated : g)
    onUpdate({ ...warband, henchmen })
  }

  const addHenchmanGroup = () => {
    onUpdate({ ...warband, henchmen: [...warband.henchmen, createHenchmanGroup()] })
  }

  const removeHenchmanGroup = (index) => {
    onUpdate({ ...warband, henchmen: warband.henchmen.filter((_, i) => i !== index) })
  }

  return (
    <div className="roster-sheet">
      {/* ── Sheet Title ── */}
      <div className="sheet-title">
        <div className="sheet-title-main">Mordheim</div>
        <div className="sheet-title-sub">Warband Roster Sheet</div>
      </div>

      {/* ── Warband Info ── */}
      <div className="warband-info">
        <div className="warband-field-row">
          <div className="warband-field">
            <label>Warband Name</label>
            <input
              className="field-underline wide"
              value={warband.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>
          <div className="warband-field">
            <label>Warband Type</label>
            <input
              className="field-underline wide"
              value={warband.type}
              onChange={e => set('type', e.target.value)}
              placeholder="e.g. Reiklanders"
            />
          </div>
          <div className="warband-field narrow">
            <label>Rating</label>
            <input
              className="field-underline"
              type="number"
              value={warband.rating}
              onChange={e => set('rating', +e.target.value)}
            />
          </div>
        </div>
        <div className="warband-field-row">
          <div className="warband-field narrow">
            <label>Gold Crowns</label>
            <input
              className="field-underline"
              type="number"
              value={warband.gold}
              onChange={e => set('gold', +e.target.value)}
            />
          </div>
          <div className="warband-field narrow">
            <label>Wyrdstone Shards</label>
            <input
              className="field-underline"
              type="number"
              value={warband.wyrdstone}
              onChange={e => set('wyrdstone', +e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Heroes Section ── */}
      <button
        className={`section-banner section-banner--collapsible${heroesCollapsed ? ' section-banner--collapsed' : ''}`}
        onClick={() => setHeroesCollapsed(c => !c)}
        aria-expanded={!heroesCollapsed}
      >
        Heroes
        <span className="section-banner__chevron" aria-hidden="true" />
      </button>
      {!heroesCollapsed && (
        <div className="heroes-grid">
          {warband.heroes.map((hero, i) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              heroNumber={i + 1}
              onUpdate={updated => updateHero(i, updated)}
            />
          ))}
        </div>
      )}

      {/* ── Henchmen Section ── */}
      <div className="section-banner">Henchmen</div>
      <div className="heroes-grid henchmen-grid">
        {warband.henchmen.map((group, i) => (
          <HenchmanCard
            key={group.id}
            group={group}
            groupNumber={i + 1}
            onUpdate={updated => updateHenchman(i, updated)}
            onRemove={() => removeHenchmanGroup(i)}
          />
        ))}
      </div>
      <div className="add-group-row">
        <button className="add-group-btn" onClick={addHenchmanGroup}>
          + Add Henchman Group
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="sheet-footer">
        <button className="back-btn" onClick={onBack}>← Back to Warbands</button>
      </div>
    </div>
  )
}
