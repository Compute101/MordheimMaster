export default function WarbandList({ warbands, onSelect, onCreate, onDelete }) {
  return (
    <div className="warband-list-page">
      <div className="list-title">
        <div className="list-title-main">Mordheim Master</div>
        <div className="list-title-sub">Campaign Roster Manager</div>
      </div>

      {warbands.length === 0 ? (
        <div className="empty-state">
          <p>No warbands yet. Begin your campaign!</p>
        </div>
      ) : (
        <div className="warband-cards">
          {warbands.map(wb => (
            <div key={wb.id} className="warband-card" onClick={() => onSelect(wb.id)}>
              <div className="warband-card-name">{wb.name || 'Unnamed Warband'}</div>
              <div className="warband-card-type">{wb.type || '—'}</div>
              <div className="warband-card-stats">
                <span>Rating: {wb.rating}</span>
                <span>Gold: {wb.gold}</span>
                <span>Heroes: {wb.heroes.filter(h => h.name).length}/{wb.heroes.length}</span>
              </div>
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); onDelete(wb.id) }}
                title="Delete warband"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="create-btn" onClick={onCreate}>
        + New Warband
      </button>
    </div>
  )
}
