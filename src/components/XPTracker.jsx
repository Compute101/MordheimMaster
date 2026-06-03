import { XP_THRESHOLDS, MAX_XP_BOXES } from '../utils/defaults'

export default function XPTracker({ xp, onChange }) {
  const handleClick = (index) => {
    // Click filled box at the end → unfill it; click empty → fill up to it
    if (index + 1 === xp) {
      onChange(index)
    } else {
      onChange(index + 1)
    }
  }

  return (
    <div className="xp-tracker">
      <div className="xp-boxes">
        {Array.from({ length: MAX_XP_BOXES }, (_, i) => {
          const isThreshold = XP_THRESHOLDS.includes(i + 1)
          return (
            <div
              key={i}
              className={[
                'xp-box',
                i < xp ? 'filled' : '',
                isThreshold ? 'threshold' : '',
              ].join(' ')}
              onClick={() => handleClick(i)}
              title={isThreshold ? `${i + 1} XP — roll for advance!` : `${i + 1} XP`}
            />
          )
        })}
      </div>
      <span className="xp-total">{xp} XP</span>
    </div>
  )
}
