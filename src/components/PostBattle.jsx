import { useState } from 'react'
import { INJURY_RESULTS } from '../utils/battleDefaults'

const XP_AMOUNTS = [1, 2, 3, 4, 5]
const QUICK_INJURIES = ['Fine', 'Full Recovery', 'Dead', 'Misses Next Game']

function SectionHead({ num, title, sub }) {
  return (
    <div className="pb-section-head">
      <span className="pb-section-num">{num}</span>
      <div className="pb-section-titles">
        <div className="pb-section-title">{title}</div>
        {sub && <div className="pb-section-sub">{sub}</div>}
      </div>
    </div>
  )
}

function InjuryRow({ warrior, wbName, injuries, onChange }) {
  const [showAll, setShowAll] = useState(false)
  const existing = injuries.find(x => x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx)
  const shown = showAll ? INJURY_RESULTS : QUICK_INJURIES

  const set = (result) => {
    const rest = injuries.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx))
    onChange({ injuries: existing?.result === result ? rest : [...rest, { warriorName: warrior.name, warbandIndex: warrior.wbIdx, result }] })
  }

  return (
    <div className="pb-row">
      <div className="pb-row-name">
        <span className="pb-warrior-name">{warrior.name}</span>
        <span className="pb-warrior-wb">{wbName}</span>
      </div>
      <div className="pb-btns-wrap">
        {shown.map(r => (
          <button key={r} className={`pb-btn${existing?.result === r ? ' active' : ''}`} onClick={() => set(r)}>{r}</button>
        ))}
        <button className="pb-btn pb-btn--more" onClick={() => setShowAll(v => !v)}>
          {showAll ? 'Less' : 'More…'}
        </button>
      </div>
    </div>
  )
}

function XpRow({ warrior, wbName, xpGains, onChange }) {
  const existing = xpGains.find(x => x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx)

  const set = (amount) => {
    const rest = xpGains.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx))
    onChange({ xpGains: existing?.amount === amount ? rest : [...rest, { warriorName: warrior.name, warbandIndex: warrior.wbIdx, amount }] })
  }

  return (
    <div className="pb-row">
      <div className="pb-row-name">
        <span className="pb-warrior-name">{warrior.name}</span>
        <span className="pb-warrior-wb">{wbName}</span>
      </div>
      <div className="pb-btns-wrap pb-btns-wrap--xp">
        {XP_AMOUNTS.map(n => (
          <button key={n} className={`pb-btn pb-btn--xp${existing?.amount === n ? ' active' : ''}`} onClick={() => set(n)}>+{n}</button>
        ))}
        {existing && <span className="pb-xp-badge">{existing.amount} XP</span>}
      </div>
    </div>
  )
}

function AdvanceRow({ warrior, wbName, skills, onChange }) {
  const [input, setInput] = useState('')
  const existing = skills.find(x => x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx)

  const add = () => {
    if (!input.trim()) return
    const rest = skills.filter(x => !(x.warriorName === warrior.name && x.warbandIndex === warrior.wbIdx))
    onChange({ skills: [...rest, { warriorName: warrior.name, warbandIndex: warrior.wbIdx, skill: input.trim() }] })
    setInput('')
  }

  return (
    <div className="pb-row">
      <div className="pb-row-name">
        <span className="pb-warrior-name">{warrior.name}</span>
        <span className="pb-warrior-wb">{wbName}</span>
      </div>
      <div className="pb-advance-wrap">
        {existing && <span className="pb-skill-tag">{existing.skill}</span>}
        <input
          className="pb-skill-input"
          placeholder="Skill or stat advance…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="pb-add-btn" onClick={add}>+</button>
      </div>
    </div>
  )
}

export default function PostBattle({ battle, onChange, onSave }) {
  const { warbands, postBattle: pb } = battle

  const allWarriors = [
    ...warbands[0].warriors.map(w => ({ ...w, wbIdx: 0 })),
    ...warbands[1].warriors.map(w => ({ ...w, wbIdx: 1 })),
  ]

  const updatePb = (updates) => {
    onChange({ ...battle, postBattle: { ...pb, ...updates } })
  }

  return (
    <div className="bn-page">
      <div className="bn-topbar">
        <div className="bn-topbar-title">Post Battle — {battle.scenario}</div>
      </div>

      <div className="bn-content">

        <div className="pb-section">
          <SectionHead num="①" title="Result" sub="Who won the battle?" />
          <div className="pb-result-btns">
            {['warband0', 'draw', 'warband1'].map(r => {
              const label = r === 'warband0' ? `${warbands[0].name} Won`
                : r === 'warband1' ? `${warbands[1].name} Won` : 'Draw'
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
          <div className="pb-section">
            <SectionHead num="②" title="Injuries" sub="Roll for each model taken Out of Action" />
            <div className="pb-row-list">
              {allWarriors.map((w, i) => (
                <InjuryRow key={i} warrior={w} wbName={warbands[w.wbIdx].name} injuries={pb.injuries} onChange={updatePb} />
              ))}
            </div>
          </div>
        )}

        {allWarriors.length > 0 && (
          <div className="pb-section">
            <SectionHead num="③" title="Experience" sub="Award XP to each hero and henchman group" />
            <div className="pb-row-list">
              {allWarriors.map((w, i) => (
                <XpRow key={i} warrior={w} wbName={warbands[w.wbIdx].name} xpGains={pb.xpGains} onChange={updatePb} />
              ))}
            </div>
          </div>
        )}

        {allWarriors.length > 0 && (
          <div className="pb-section">
            <SectionHead num="④" title="Advances" sub="Record skills and stat increases for heroes that levelled up" />
            <div className="pb-row-list">
              {allWarriors.map((w, i) => (
                <AdvanceRow key={i} warrior={w} wbName={warbands[w.wbIdx].name} skills={pb.skills} onChange={updatePb} />
              ))}
            </div>
          </div>
        )}

        <div className="pb-section">
          <SectionHead num="⑤" title="Exploration & Loot" sub="Roll your dice — record wyrdstone shards, items found, special events" />
          <textarea
            className="pb-notes-area"
            placeholder="e.g. Roll 3,3 — 4 precious gems and an axe. Sell 3 stones for 70gc…"
            value={pb.notes}
            onChange={e => updatePb({ notes: e.target.value })}
          />
        </div>

        <div className="pb-section">
          <SectionHead num="⑥" title="Income & Spending" sub="Sell items, recruit warriors, buy equipment, update treasury" />
          <textarea
            className="pb-notes-area"
            placeholder="e.g. Sell wyrdstone 90gc. Buy shields 10gc. Recruit clansmen 50gc. Treasury 35gc…"
            value={pb.spendingNotes || ''}
            onChange={e => updatePb({ spendingNotes: e.target.value })}
          />
        </div>

        <div className="bn-begin-row">
          <button className="bn-begin-btn" onClick={onSave}>Save Battle</button>
        </div>

      </div>
    </div>
  )
}
