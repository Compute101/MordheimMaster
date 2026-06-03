import HeroCard from './HeroCard'

export default function RosterSheet({ warband, onUpdate, onBack }) {
  const set = (field, value) => onUpdate({ ...warband, [field]: value })

  const updateHero = (index, updatedHero) => {
    const heroes = warband.heroes.map((h, i) => i === index ? updatedHero : h)
    onUpdate({ ...warband, heroes })
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
      <div className="section-banner">Heroes</div>
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

      {/* ── Footer ── */}
      <div className="sheet-footer">
        <button className="back-btn" onClick={onBack}>← Back to Warbands</button>
      </div>
    </div>
  )
}
