import { MAX_MODELS } from '../utils/defaults'

export default function ModelTracker({ models, onChange }) {
  const handleClick = (index) => {
    if (index < models) {
      onChange(models - 1)     // any filled box removes one model
    } else {
      onChange(index + 1)      // any empty box fills up to that slot
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
