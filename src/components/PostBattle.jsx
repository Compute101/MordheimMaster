import { useState } from 'react'
import { INJURY_RESULTS } from '../utils/battleDefaults'

const XP_AMOUNTS = [1, 2, 3, 4, 5]

function WarriorRow({ warrior, wbIdx, wbName, injuries, xpGains, skills, onChange }) {
  const [showAllInjuries, setShowAllInjuries] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const existing = injuries.find(x => x.warriorName === warrior.name && x.warbandIndex === wbIdx)
  const existingXp = xpGains.find(x => x.warriorName === warrior.name && x.warbandIndex === wbIdx)
  const existingSkill = skills.find(x => x.warriorName === warrior.name && x.warbandIndex === wbIdx)

  const setInjury = (result) => {
    const filtered = injuries.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === wbIdx))
    onChange({
      injuries: existing?.result === result ? filtered : [...filtered, { warriorName: warrior.name, warbandIndex: wbIdx, result }],
    })
  }

  const setXp = (amount) => {
    const filtered = xpGains.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === wbIdx))
    onChange({
      xpGains: existingXp?.amount === amount ? filtered : [...filtered, { warriorName: warrior.name, warbandIndex: wbIdx, amount }],
    })
  }

  const addSkill = () => {
    if (!skillInput.trim()) return
    const filtered = skills.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === wbIdx))
    onChange({ skills: [...filtered, { warriorName: warrior.name, warbandIndex: wbIdx, skill: skillInput.trim() }] })
    setSkillInput('')
  }

  const quickInjuries = ['Fine', 'Full Recovery', 'Dead', 'Misses Next Game']
  const shownInjuries = showAllInjuries ? INJURY_RESULTS : quickInjuries

  return (
    <div className="pb-warrior-row">
      <div className="pb-warrior-header">
        <span className="pb-warrior-name">{warrior.name}</span>
        <span className="pb-warrior-wb">{wbName}</span>
      </div>

      <div className="pb-row-section">
        <div className="pb-row-label">Injury:</div>
        <div className="pb-injury-btns">
          {shownInjuries.map(r => (
            <button
              key={r}
              className={`pb-injury-btn${existing?.result === r ? ' active' : ''}`}
              onClick={() => setInjury(r)}
            >
              {r}
            </button>
          ))}
          <button
            className="pb-injury-btn pb-injury-btn--more"
            onClick={() => setShowAllInjuries(v => !v)}
          >
            {showAllInjuries ? 'Less…' : 'More…'}
          </button>
        </div>
      </div>

      <div className="pb-row-section pb-xp-skill-row">
        <div className="pb-xp-part">
          <div className="pb-row-label">XP gain:</div>
          <div className="pb-xp-btns">
            {XP_AMOUNTS.map(n => (
              <button
                key={n}
                className={`pb-xp-btn${existingXp?.amount === n ? ' active' : ''}`}
                onClick={() => setXp(n)}
              >
                +{n}
              </button>
            ))}
          </div>
        </div>
        <div className="pb-skill-part">
          <div className="pb-row-label">Skill:</div>
          <div className="pb-skill-row">
            {existingSkill && (
              <span className="pb-skill-tag">{existingSkill.skill}</span>
            )}
            <input
              className="pb-skill-input"
              placeholder="Skill name…"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
            />
            <button className="pb-add-skill-btn" onClick={addSkill}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PostBattle({ battle, onChange, onSave }) {
  const { warbands, postBattle: pb } = battle

  const updatePb = (updates) => {
    onChange({ ...battle, postBattle: { ...pb, ...updates } })
  }

  const allWarriors = [
    ...warbands[0].warriors.map(w => ({ ...w, wbIdx: 0 })),
    ...warbands[1].warriors.map(w => ({ ...w, wbIdx: 1 })),
  ]

  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <div className="bn-topbar-title">Post Battle — {battle.scenario}</div>
      </div>

      <div className="bn-content">
        <div className="bn-section">
          <div className="bn-section-title">Result</div>
          <div className="pb-result-btns">
            {['warband0', 'draw', 'warband1'].map((r) => {
              const label = r === 'warband0' ? `${warbands[0].name} Won`
                : r === 'warband1' ? `${warbands[1].name} Won`
                : 'Draw'
              return (
                <button
                  key={r}
                  className={`pb-result-btn${pb.result === r ? ' active' : ''}`}
                  onClick={() => updatePb({ result: pb.result === r ? null : r })}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {allWarriors.length > 0 && (
          <div className="bn-section">
            <div className="bn-section-title">Warriors</div>
            <div className="pb-warrior-list">
              {allWarriors.map((w, i) => (
                <WarriorRow
                  key={i}
                  warrior={w}
                  wbIdx={w.wbIdx}
                  wbName={warbands[w.wbIdx].name}
                  injuries={pb.injuries}
                  xpGains={pb.xpGains}
                  skills={pb.skills}
                  onChange={updatePb}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bn-section">
          <div className="bn-section-title">Notes</div>
          <textarea
            className="pb-notes-area"
            placeholder="Loot found, purchases, campaign events, anything else…"
            value={pb.notes}
            onChange={e => updatePb({ notes: e.target.value })}
          />
        </div>

        <div className="bn-begin-row">
          <button className="bn-begin-btn" onClick={onSave}>
            Save Battle
          </button>
        </div>
      </div>
    </div>
  )
}
