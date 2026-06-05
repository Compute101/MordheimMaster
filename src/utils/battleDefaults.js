export const SCENARIOS = [
  'Defend the Find', 'Skirmish', 'Wyrdstone Hunt', 'Breakthrough',
  'Street Fight', 'Occupy', 'Hidden Treasure', 'Chance Encounter', 'Surprise Attack',
]

export const ACTIONS = [
  { key: 'move',           label: 'Move',           needsTarget: false, needsOutcome: false },
  { key: 'run',            label: 'Run',            needsTarget: false, needsOutcome: false },
  { key: 'crawl',          label: 'Crawl Away',     needsTarget: false, needsOutcome: false },
  { key: 'standup',        label: 'Stand Up',       needsTarget: false, needsOutcome: false },
  { key: 'climb',          label: 'Climb / Vault',  needsTarget: false, needsOutcome: true  },
  { key: 'fall',           label: 'Fall',           needsTarget: false, needsOutcome: true  },
  { key: 'charge',         label: 'Charge',         needsTarget: true,  needsOutcome: true  },
  { key: 'diving-charge',  label: 'Diving Charge',  needsTarget: true,  needsOutcome: true  },
  { key: 'fight',          label: 'Fight',          needsTarget: true,  needsOutcome: true  },
  { key: 'shoot',          label: 'Shoot',          needsTarget: true,  needsOutcome: true  },
  { key: 'throw',          label: 'Throw',          needsTarget: true,  needsOutcome: true  },
  { key: 'cast',           label: 'Cast Spell',     needsTarget: true,  needsOutcome: true  },
  { key: 'goad',           label: 'Goad',           needsTarget: true,  needsOutcome: true  },
  { key: 'hide',           label: 'Hide',           needsTarget: false, needsOutcome: false },
  { key: 'flee',           label: 'Flee',           needsTarget: false, needsOutcome: false },
  { key: 'broken',         label: 'Broken',         needsTarget: false, needsOutcome: false },
  { key: 'rout',           label: 'Voluntary Rout', needsTarget: false, needsOutcome: false },
  { key: 'rally',          label: 'Rally',          needsTarget: false, needsOutcome: false },
  { key: 'explore',        label: 'Explore',        needsTarget: false, needsOutcome: false, isExplore: true },
  { key: 'other',          label: 'Other…',         needsTarget: false, needsOutcome: false, isOther: true },
]

export const OUTCOMES = {
  climb:  ['Climbed', 'Vault Failed', 'Fell — Fine', 'Fell — Stunned', 'Fell — OOA'],
  fall:   ['Fell — Fine', 'Fell — Stunned', 'Fell — OOA'],
  charge: ['Charged', 'Failed Charge'],
  'diving-charge': ['Diving Charged', 'Failed Dive — Fine', 'Failed Dive — Stunned', 'Failed Dive — OOA'],
  fight:  ['Miss', 'Flesh Wound', 'Knock Down', 'Stunned', 'Out of Action'],
  shoot:  ['Miss', 'Flesh Wound', 'Knock Down', 'Stunned', 'Out of Action'],
  throw:  ['Miss', 'Flesh Wound', 'Knock Down', 'Stunned', 'Out of Action'],
  cast:   ['Success', 'Miss / No Effect', 'Flesh Wound', 'Knock Down', 'Stunned', 'Out of Action', 'Miscast', 'Failed to Cast'],
  goad:   ['Goaded', 'Goad Failed'],
}

export const INJURY_RESULTS = [
  'Fine', 'Full Recovery', 'Dead', 'Misses Next Game',
  'Chest Wound', 'Arm Wound', 'Leg Wound', 'Blinded in One Eye',
  'Hand Injury', 'Old Battle Wound', 'Madness', 'Nervous Condition',
  'Horrible Scars', 'Robbed', 'Captured', 'Sold to the Pits',
]

export const CRITICAL_TABLES = {
  bladed: {
    label: 'Bladed',
    subtitle: 'Swords, axes, double-handed swords…',
    results: [
      { range: '1–2', name: 'Flesh Wound', effect: 'Hits unprotected area — no armour save' },
      { range: '3–4', name: 'Bladestorm', effect: '2 wounds · Armour saves taken separately' },
      { range: '5–6', name: 'Sliced!', effect: 'No armour save · 2 wounds · +2 to injury rolls' },
    ],
  },
  bludgeoning: {
    label: 'Bludgeoning',
    subtitle: 'Clubs, maces, hammers, flails, double-handed hammers…',
    results: [
      { range: '1–2', name: 'Hammered', effect: 'Target may not fight this turn (if not yet fought)' },
      { range: '3–4', name: 'Clubbed', effect: 'Ignores armour saves and helmets' },
      { range: '5',   name: 'Wild Sweep', effect: "Target's weapon knocked from hand" },
      { range: '6',   name: 'Bludgeoned', effect: 'Auto Out of Action if fails armour save' },
    ],
  },
  missile: {
    label: 'Missile',
    subtitle: 'Bows, crossbows, blackpowder, throwing knives…',
    results: [
      { range: '1–2', name: 'Hits a Weak Spot', effect: 'Ignore all armour saves' },
      { range: '3–4', name: 'Ricochet', effect: 'Closest enemy within 6" is also hit (roll to wound normally)' },
      { range: '5–6', name: 'Master Shot', effect: '2 wounds · No armour save' },
    ],
  },
  thrusting: {
    label: 'Thrusting',
    subtitle: 'Spears, halberds, lances…',
    results: [
      { range: '1–2', name: 'Stab', effect: '+1 to injury rolls · Normal armour saves' },
      { range: '3–4', name: 'Thrust', effect: 'Knocked down · Normal armour saves' },
      { range: '5–6', name: 'Kebab!', effect: 'No armour save · +2 to injury rolls · Knocked back D6"' },
    ],
  },
  unarmed: {
    label: 'Unarmed',
    subtitle: 'Wardogs, warhorses, zombies, possessed, animals…',
    results: [
      { range: '1–2', name: 'Body Blow', effect: 'Make one additional attack immediately' },
      { range: '3–4', name: 'Crushing Blow', effect: '+1 to injury roll if save failed' },
      { range: '5–6', name: 'Mighty Blow', effect: 'No armour save · +2 to injury rolls' },
    ],
  },
}

export function makeEventNote({ actorName, actionKey, targetName, outcome }) {
  const t = targetName ? ` ${targetName}` : ''
  switch (actionKey) {
    case 'move':   return `${actorName} moved`
    case 'run':    return `${actorName} ran`
    case 'charge':
      return outcome === 'Failed Charge'
        ? `${actorName} failed to charge${t}`
        : `${actorName} charged${t}`
    case 'diving-charge':
      if (outcome === 'Failed Dive — Fine')    return `${actorName} failed a diving charge on${t} — fell fine`
      if (outcome === 'Failed Dive — Stunned') return `${actorName} failed a diving charge on${t} — fell Stunned`
      if (outcome === 'Failed Dive — OOA')     return `${actorName} failed a diving charge on${t} — fell Out of Action`
      return outcome === 'Diving Charged'
        ? `${actorName} diving charged${t}`
        : `${actorName} failed a diving charge on${t}`
    case 'fight':  return `${actorName} attacked${t} — ${outcome}`
    case 'shoot':  return `${actorName} shot at${t} — ${outcome}`
    case 'throw':  return `${actorName} threw at${t} — ${outcome}`
    case 'cast':
      if (outcome === 'Failed to Cast') return `${actorName} failed to cast${t}`
      if (outcome === 'Miscast') return `${actorName} miscast!`
      return `${actorName} cast spell${t} — ${outcome}`
    case 'goad':
      return outcome === 'Goad Failed'
        ? `${actorName} failed to goad${t}`
        : `${actorName} goaded${t}`
    case 'crawl':  return `${actorName} crawled away`
    case 'standup': return `${actorName} stood up`
    case 'explore': return `${actorName} explored`
    case 'fall':
      if (outcome === 'Fell — Fine')    return `${actorName} fell — fine`
      if (outcome === 'Fell — Stunned') return `${actorName} fell — Stunned`
      if (outcome === 'Fell — OOA')     return `${actorName} fell — Out of Action`
      return `${actorName} fell — ${outcome}`
    case 'climb':
      if (outcome === 'Climbed') return `${actorName} climbed`
      if (outcome === 'Vault Failed') return `${actorName} failed to vault`
      if (outcome === 'Fell — Fine') return `${actorName} fell — fine`
      if (outcome === 'Fell — Stunned') return `${actorName} fell — Stunned`
      if (outcome === 'Fell — OOA') return `${actorName} fell — Out of Action`
      return `${actorName} climbed — ${outcome}`
    case 'hide':   return `${actorName} hid`
    case 'flee':   return `${actorName} fled`
    case 'broken': return `${actorName} broke and fled`
    case 'rout':   return `${actorName} voluntarily routed`
    case 'rally':  return `${actorName} rallied`
    default:       return outcome || `${actorName} acted`
  }
}

export function createBattle({ scenario, warband0, warband1, houseRules }) {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    scenario,
    houseRules: houseRules || '',
    warbands: [warband0, warband1],
    turns: [],
    currentTurn: 0,          // 0 = pre-game phase
    currentWarbandIndex: -1, // -1 = pre-game (no active warband)
    postBattle: {
      result: null,
      injuries: [],
      xpGains: [],
      skills: [],
      notes: '',
    },
    completed: false,
  }
}

export function generateBattleText(battle) {
  const lines = []
  lines.push(battle.scenario || 'Battle')
  lines.push('')

  const sitout = [
    ...battle.warbands[0].warriors.filter(w => w.sittingOut).map(w => w.name),
    ...battle.warbands[1].warriors.filter(w => w.sittingOut).map(w => w.name),
  ]
  if (sitout.length) {
    lines.push(`Sitting out: ${sitout.join(', ')}`)
    lines.push('')
  }

  const pregame = battle.turns.find(t => t.turnNumber === 0)
  const hasHouseRules = battle.houseRules?.trim()
  if (hasHouseRules || pregame?.events.length) {
    lines.push('Pre-game')
    if (hasHouseRules) {
      lines.push(battle.houseRules.trim())
      if (pregame?.events.length) lines.push('')
    }
    pregame?.events.forEach(e => lines.push(e.actorName === null ? `  [${e.note}]` : e.note))
    lines.push('')
  }

  const battleTurns = battle.turns.filter(t => t.turnNumber > 0)
  const maxTurn = battleTurns.length
    ? Math.max(...battleTurns.map(t => t.turnNumber))
    : 0

  for (let t = 1; t <= maxTurn; t++) {
    for (let w = 0; w <= 1; w++) {
      const turn = battle.turns.find(x => x.turnNumber === t && x.warbandIndex === w)
      if (!turn || turn.events.length === 0) continue
      lines.push(`${battle.warbands[w].name} turn ${t}`)
      turn.events.forEach(e => lines.push(e.actorName === null ? `  [${e.note}]` : e.note))
      lines.push('')
    }
  }

  const pb = battle.postBattle
  const hasPostBattle = pb.result || pb.injuries.length || pb.xpGains.length || pb.notes || pb.spendingNotes

  if (hasPostBattle) {
    lines.push('Post Battle')
    if (pb.result === 'warband0') lines.push(`${battle.warbands[0].name} won`)
    else if (pb.result === 'warband1') lines.push(`${battle.warbands[1].name} won`)
    else if (pb.result === 'draw') lines.push('Draw')

    pb.injuries.forEach(({ warriorName, result }) => {
      lines.push(`${warriorName} — ${result}`)
    })

    pb.xpGains.forEach(({ warriorName, amount }) => {
      if (!amount) return
      const skillEntry = pb.skills.find(s => s.warriorName === warriorName)
      let line = `${warriorName} +${amount} XP`
      if (skillEntry?.skill) line += `, ${skillEntry.skill}`
      lines.push(line)
    })

    if (pb.notes) {
      lines.push('')
      lines.push(pb.notes)
    }

    if (pb.spendingNotes) {
      lines.push('')
      lines.push(pb.spendingNotes)
    }
  }

  return lines.join('\n')
}
