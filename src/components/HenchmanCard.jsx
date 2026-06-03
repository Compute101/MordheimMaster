import { STATS, HENCHMAN_XP_THRESHOLDS, MAX_HENCHMAN_XP_BOXES } from '../utils/defaults'
import ModelTracker from './ModelTracker'
import ListSection from './ListSection'

function HenchmanXP({ xp, onChange }) {
  const handleClick = (index) => {
    if (index + 1 === xp) onChange(index)
    else onChange(index + 1)
  }

  return (
    <div className="xp-tracker">
      <div className="xp-boxes">
        {Array.from({ length: MAX_HENCHMAN_XP_BOXES }, (_, i) => {
          const isThreshold = HENCHMAN_XP_THRESHOLDS.includes(i + 1)
          return (
            <div
              key={i}
              className={[
                'xp-box',
                i < xp ? 'filled' : '',
                isThreshold ? 'threshold' : '',
              ].join(' ')}
              onClick={() => handleClick(i)}
              title={isThreshold ? `${i + 1} XP — advance roll!` : `${i + 1} XP`}
            />
          )
        })}
      </div>
      <span className="xp-total">{xp} XP</span>
    </div>
  )
}

export default function HenchmanCard({ group, groupNumber, onUpdate, onRemove }) {
  const set = (field, value) => onUpdate({ ...group, [field]: value })

  const setStat = (stat, value) =>
    onUpdate({ ...group, stats: { ...group.stats, [stat]: value } })

  return (
    <div className="hero-card henchman-card">
      {/* ── Header ── */}
      <div className="hero-header henchman-header">
        <div className="henchman-header-top">
          <div className="hero-number">Henchmen Group {groupNumber}</div>
          <button className="remove-group-btn" onClick={onRemove} title="Remove group">×</button>
        </div>
        <div className="hero-fields">
          <div className="field-group">
            <label>Group Name</label>
            <input
              className="field-underline"
              value={group.name}
              onChange={e => set('name', e.target.value)}
              placeholder="—"
            />
          </div>
          <div className="field-group">
            <label>Type</label>
            <input
              className="field-underline"
              value={group.type}
              onChange={e => set('type', e.target.value)}
              placeholder="—"
            />
          </div>
        </div>
      </div>

      {/* ── Model count ── */}
      <div className="xp-section">
        <div className="section-label">Models in Group</div>
        <ModelTracker models={group.models} onChange={v => set('models', v)} />
      </div>

      {/* ── Stats Table ── */}
      <div className="stats-section">
        <table className="stats-table">
          <thead>
            <tr>
              {STATS.map(s => <th key={s}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {STATS.map(s => (
                <td key={s}>
                  <input
                    className="stat-input"
                    value={group.stats[s]}
                    onChange={e => setStat(s, e.target.value)}
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
        <HenchmanXP xp={group.xp} onChange={xp => set('xp', xp)} />
      </div>

      {/* ── Lists ── */}
      <ListSection
        title="Equipment"
        items={group.equipment}
        onItemsChange={v => set('equipment', v)}
        placeholder="e.g. Sword, Bow…"
      />
      <ListSection
        title="Skills"
        items={group.skills}
        onItemsChange={v => set('skills', v)}
        placeholder="e.g. Marksman…"
      />
      <ListSection
        title="Injuries"
        items={group.injuries}
        onItemsChange={v => set('injuries', v)}
        placeholder="e.g. Lad's Got Talent…"
      />
    </div>
  )
}
