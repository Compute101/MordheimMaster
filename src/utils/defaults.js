export const STATS = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'Ld']

// XP thresholds at which heroes roll for an advance
export const XP_THRESHOLDS = [2, 4, 6, 9, 12, 16, 20, 25, 30, 36, 42, 50]

export const MAX_XP_BOXES = 50

export function createHero() {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: '',
    stats: Object.fromEntries(
      STATS.map(s => [s, { base: '', current: '' }])
    ),
    xp: 0,
    equipment: [],
    skills: [],
    spells: [],
    injuries: [],
    advances: [],
  }
}

// Henchmen advance as a group; thresholds differ from heroes
export const HENCHMAN_XP_THRESHOLDS = [2, 4, 6, 8]
export const MAX_HENCHMAN_XP_BOXES = 8
export const MAX_MODELS = 10

export function createHenchmanGroup() {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: '',
    models: 1,       // current number alive in group
    stats: Object.fromEntries(STATS.map(s => [s, ''])),
    xp: 0,
    equipment: [],
    skills: [],
    injuries: [],
  }
}

export function createWarband() {
  return {
    id: crypto.randomUUID(),
    name: 'New Warband',
    type: '',
    gold: 500,
    wyrdstone: 0,
    rating: 0,
    heroes: Array.from({ length: 6 }, createHero),
    henchmen: Array.from({ length: 4 }, createHenchmanGroup),
  }
}
