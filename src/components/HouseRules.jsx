export default function HouseRules({ rules, onChange, onBack }) {
  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="bn-topbar-title">House Rules</div>
      </div>
      <div className="bn-content">
        <p className="hr-info">
          These rules are automatically included in the pre-game section of every new battle record. Changes here do not affect battles already saved.
        </p>
        <textarea
          className="hr-textarea"
          value={rules}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter your house rules here…"
        />
      </div>
    </div>
  )
}
