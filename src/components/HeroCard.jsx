import { STATS } from '../utils/defaults'
import XPTracker from './XPTracker'
import ListSection from './ListSection'

export default function HeroCard({ hero, heroNumber, onUpdate }) {
  const set = (field, value) => onUpdate({ ...hero, [field]: value })

  const setStat = (stat, row, value) => {
    onUpdate({
      ...hero,
      stats: {
        ...hero.stats,
        [stat]: { ...hero.stats[stat], [row]: value },
      },
    })
  }

  return (
    <div className="hero-card">
      {/* ── Header ── */}
      <div className="hero-header">
        <div className="hero-number">Hero {heroNumber}</div>
        <div className="hero-fields">
          <div className="field-group">
            <label>Name</label>
            <input
              className="field-underline"
              value={hero.name}
              onChange={e => set('name', e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="field-group">
            <label>Type / Title</label>
            <input
              className="field-underline"
              value={hero.type}
              onChange={e => set('type', e.target.value)}
              placeholder="—"
            />
          </div>
        </div>
      </div>

      {/* ── Stats Table ── */}
      <div className="stats-section">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="stat-row-label"></th>
              {STATS.map(s => <th key={s}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="stat-row-label">Start</td>
              {STATS.map(s => (
                <td key={s}>
                  <input
                    className="stat-input"
                    value={hero.stats[s].base}
                    onChange={e => setStat(s, 'base', e.target.value)}
                    placeholder="–"
                    maxLength={3}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="stat-row-label">Now</td>
              {STATS.map(s => (
                <td key={s}>
                  <input
                    className="stat-input"
                    value={hero.stats[s].current}
                    onChange={e => setStat(s, 'current', e.target.value)}
                    placeholder="–"
                    maxLength={3}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── XP Tracker ── */}
      <div className="xp-section">
        <div className="section-label">Experience</div>
        <XPTracker xp={hero.xp} onChange={xp => set('xp', xp)} />
      </div>

      {/* ── Advances ── */}
      <ListSection
        title="Advances"
        items={hero.advances}
        onItemsChange={v => set('advances', v)}
        placeholder="e.g. +1 WS, New Skill…"
      />

      {/* ── Equipment ── */}
      <ListSection
        title="Equipment"
        items={hero.equipment}
        onItemsChange={v => set('equipment', v)}
        placeholder="e.g. Sword, Shield…"
      />

      {/* ── Skills & Spells ── */}
      <ListSection
        title="Skills"
        items={hero.skills}
        onItemsChange={v => set('skills', v)}
        placeholder="e.g. Dodge, Step Aside…"
      />
      <ListSection
        title="Spells / Prayers"
        items={hero.spells}
        onItemsChange={v => set('spells', v)}
        placeholder="e.g. The Word of Pain…"
      />

      {/* ── Injuries ── */}
      <ListSection
        title="Injuries"
        items={hero.injuries}
        onItemsChange={v => set('injuries', v)}
        placeholder="e.g. Old Battle Wound…"
      />
    </div>
  )
}
