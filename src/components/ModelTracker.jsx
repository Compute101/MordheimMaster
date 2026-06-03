import { MAX_MODELS } from '../utils/defaults'

export default function ModelTracker({ models, onChange }) {
  const handleClick = (index) => {
    if (index + 1 === models) {
      onChange(index)          // shrink group by 1
    } else if (index >= models) {
      onChange(index + 1)      // grow group to this slot
    }
  }

  return (
    <div className="model-tracker">
      <div className="xp-boxes">
        {Array.from({ length: MAX_MODELS }, (_, i) => (
          <div
            key={i}
            className={['xp-box model-box', i < models ? 'filled' : ''].join(' ')}
            onClick={() => handleClick(i)}
            title={i < models ? `Model ${i + 1} — click to remove` : `Add model ${i + 1}`}
          />
        ))}
      </div>
      <span className="xp-total">{models} model{models !== 1 ? 's' : ''}</span>
    </div>
  )
}
