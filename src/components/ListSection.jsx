import { useState } from 'react'

export default function ListSection({ title, items, onItemsChange, placeholder }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onItemsChange([...items, trimmed])
      setDraft('')
    }
  }

  const remove = (index) => {
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <div className="list-section">
      <div className="list-section-title">{title}</div>
      <ul className="list-items">
        {items.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
            <button className="remove-btn" onClick={() => remove(i)} title="Remove">×</button>
          </li>
        ))}
      </ul>
      <div className="list-add-row">
        <input
          className="list-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder || `Add ${title.toLowerCase()}…`}
        />
        <button className="add-btn" onClick={add}>+</button>
      </div>
    </div>
  )
}
