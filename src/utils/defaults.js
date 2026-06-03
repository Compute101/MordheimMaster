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

export function createWarband() {
  return {
    id: crypto.randomUUID(),
    name: 'New Warband',
    type: '',
    gold: 500,
    wyrdstone: 0,
    rating: 0,
    heroes: Array.from({ length: 6 }, createHero),
  }
}
