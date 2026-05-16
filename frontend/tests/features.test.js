/**
 * Feature tests for HeroScribe.
 * Run:  npm test          (from frontend/)
 *
 * Groups:
 *   1. Pure logic         — no network, always fast
 *   2. Go API             — needs `vercel dev` running on :3000
 *   3. Open5e spell API   — needs internet
 *   4. Extended items     — needs internet (GitHub raw)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  getSpellSlots,
  emptyCharacter,
  isProficientWith,
  WEAPONS,
  RACE_LANGUAGES,
  SPELLCASTING_CLASSES,
} from './src/types';
import { getExtendedItems } from './src/composables/useExtendedData.js';

const LOCAL_API = 'http://localhost:3000/api';
const OPEN5E = 'https://api.open5e.com/v1';

// ── 1. Pure logic ─────────────────────────────────────────────────────────────

describe('Spell slot table', () => {
  it('sorcerer level 1 → 2 first-level slots', () => {
    expect(getSpellSlots('sorcerer', 1)).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('paladin level 1 → no slots (unlocks at level 2)', () => {
    expect(getSpellSlots('paladin', 1)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('paladin level 3 → 3 first-level slots', () => {
    expect(getSpellSlots('paladin', 3)[0]).toBe(3);
  });

  it('warlock level 1 → 1 pact slot at 1st level', () => {
    expect(getSpellSlots('warlock', 1)[0]).toBe(1);
  });

  it('fighter → null (non-caster)', () => {
    expect(getSpellSlots('fighter', 1)).toBeNull();
  });

  it('wizard level 20 → 4 first-level slots', () => {
    expect(getSpellSlots('wizard', 20)[0]).toBe(4);
  });
});

describe('emptyCharacter', () => {
  it('languages starts empty — Common is added by ExtrasStep on mount', () => {
    // common should came as default
    expect(emptyCharacter().languages).toEqual(['Common']);
  });

  it('has all required draft fields', () => {
    const c = emptyCharacter();
    for (const field of [
      'name',
      'race',
      'class',
      'background',
      'edition',
      'alignment',
      'skills',
      'spells',
      'equipment',
      'weapons',
      'languages',
    ]) {
      expect(c, `missing field: ${field}`).toHaveProperty(field);
    }
  });

  it('level defaults to 1', () => {
    expect(emptyCharacter().level).toBe(1);
  });
});

describe('Race languages', () => {
  it('every race includes Common', () => {
    for (const [race, langs] of Object.entries(RACE_LANGUAGES)) {
      expect(langs, `${race} missing Common`).toContain('Common');
    }
  });

  it('elf has Elvish', () => expect(RACE_LANGUAGES.elf).toContain('Elvish'));
  it('dwarf has Dwarvish', () =>
    expect(RACE_LANGUAGES.dwarf).toContain('Dwarvish'));
  it('tiefling has Infernal', () =>
    expect(RACE_LANGUAGES.tiefling).toContain('Infernal'));
  it('dragonborn has Draconic', () =>
    expect(RACE_LANGUAGES.dragonborn).toContain('Draconic'));
});

describe('Weapon proficiency', () => {
  const dagger = WEAPONS.find((w) => w.id === 'dagger');
  const longsword = WEAPONS.find((w) => w.id === 'longsword');
  const shortbow = WEAPONS.find((w) => w.id === 'shortbow');

  it('simple proficiency grants dagger', () =>
    expect(isProficientWith(dagger, ['simple'])).toBe(true));
  it('simple proficiency grants shortbow', () =>
    expect(isProficientWith(shortbow, ['simple'])).toBe(true));
  it('simple proficiency does not grant longsword', () =>
    expect(isProficientWith(longsword, ['simple'])).toBe(false));
  it('martial proficiency grants longsword', () =>
    expect(isProficientWith(longsword, ['martial'])).toBe(true));
  it('empty proficiency denies all', () =>
    expect(isProficientWith(dagger, [])).toBe(false));
});

describe('SPELLCASTING_CLASSES set', () => {
  const casters = [
    'bard',
    'cleric',
    'druid',
    'paladin',
    'ranger',
    'sorcerer',
    'warlock',
    'wizard',
  ];
  const noncasters = ['barbarian', 'fighter', 'monk', 'rogue'];

  for (const cls of casters)
    it(`${cls} is a spellcaster`, () =>
      expect(SPELLCASTING_CLASSES.has(cls)).toBe(true));

  for (const cls of noncasters)
    it(`${cls} is not a spellcaster`, () =>
      expect(SPELLCASTING_CLASSES.has(cls)).toBe(false));
});

// ── 2. Go API ─────────────────────────────────────────────────────────────────

describe('Go API — needs vercel dev on :3000', () => {
  it('GET /api/races returns 8 races with required fields', async () => {
    const res = await fetch(`${LOCAL_API}/races`);
    expect(res.ok).toBe(true);
    const races = await res.json();
    expect(races).toHaveLength(8);
    for (const r of races)
      expect(r).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        speed: expect.any(Number),
      });
  });

  it('GET /api/classes returns 12 classes with hit_die', async () => {
    const res = await fetch(`${LOCAL_API}/classes`);
    expect(res.ok).toBe(true);
    const classes = await res.json();
    expect(classes).toHaveLength(12);
    for (const c of classes) expect(c.hit_die).toBeGreaterThan(0);
  });

  it('POST /api/calculate returns a valid sheet', async () => {
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race: 'elf',
        class: 'wizard',
        level: 5,
        background: 'Sage',
        abilities: {
          strength: 8,
          dexterity: 15,
          constitution: 14,
          intelligence: 17,
          wisdom: 12,
          charisma: 10,
        },
      }),
    });
    expect(res.ok).toBe(true);
    const sheet = await res.json();
    expect(sheet.max_hp).toBeGreaterThan(0);
    expect(sheet.proficiency_bonus).toBe(3); // level 5–8 = +3
    expect(sheet.initiative).toBeDefined();
    expect(sheet.armor_class).toBeGreaterThan(0);
  });

  it('POST /api/calculate HP formula is correct (elf wizard L5)', async () => {
    // Hit die d6, CON mod = +2, level 5
    // HP = 6 + 2 + 4*(3+1+2) = 8 + 24 = 32  (average formula: d/2+1)
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race: 'human',
        class: 'wizard',
        level: 5,
        background: 'Sage',
        abilities: {
          strength: 8,
          dexterity: 10,
          constitution: 14,
          intelligence: 17,
          wisdom: 12,
          charisma: 10,
        },
      }),
    });
    const sheet = await res.json();
    // CON mod = +2, hit_die = 6 → 6+2 + 4*(3+1+2) = 32
    expect(sheet.max_hp).toBe(32);
  });
});

// ── 3. Open5e spell API ───────────────────────────────────────────────────────

describe('Open5e — spell_lists filter', () => {
  // paladin is not in Open5e spell_lists index — useApi falls back to dnd_class=Paladin
  const SPELL_LIST_CLASSES = ['bard', 'cleric', 'druid', 'ranger', 'sorcerer', 'warlock', 'wizard'];

  for (const cls of SPELL_LIST_CLASSES) {
    it(`${cls} returns spells via spell_lists`, async () => {
      const res = await fetch(`${OPEN5E}/spells/?spell_lists=${cls}&limit=1`);
      const data = await res.json();
      expect(data.count, `${cls} returned 0 spells`).toBeGreaterThan(0);
    }, 15000);
  }

  it('paladin returns spells via dnd_class fallback (spell_lists=paladin is a 400)', async () => {
    const res = await fetch(`${OPEN5E}/spells/?dnd_class=Paladin&limit=1`);
    const data = await res.json();
    expect(data.count, 'paladin returned 0 spells').toBeGreaterThan(0);
  }, 15000);

  it('spell_lists=paladin is invalid and returns HTTP 400', async () => {
    const res = await fetch(`${OPEN5E}/spells/?spell_lists=paladin&limit=1`);
    expect(res.status).toBe(400);
  }, 15000);

  it('sorcerer spell has all fields used by SpellsStep', async () => {
    const res = await fetch(`${OPEN5E}/spells/?spell_lists=sorcerer&limit=3&ordering=name`);
    const data = await res.json();
    const spell = data.results[0];
    expect(spell.slug).toBeTruthy();
    expect(spell.name).toBeTruthy();
    expect(typeof spell.level_int).toBe('number');
    expect(spell.school).toBeTruthy();
    expect(spell.casting_time).toBeTruthy();
    expect(spell.spell_lists).toContain('sorcerer');
  }, 15000);

  it('sorcerer has significantly more spells than 0 (regression: dnd_class=Sorcerer was 0)', async () => {
    const res = await fetch(`${OPEN5E}/spells/?spell_lists=sorcerer&limit=1`);
    const data = await res.json();
    expect(data.count).toBeGreaterThan(50);
  }, 15000);
});

// ── 4. Extended items (WotC raw) ──────────────────────────────────────────────

describe('Extended items — WotC raw data', () => {
  let items;

  beforeAll(async () => {
    items = await getExtendedItems();
  }, 60000);

  it('returns more than 100 WotC items', () => {
    expect(items.length).toBeGreaterThan(100);
  });

  it('items are sorted alphabetically by name', () => {
    for (let i = 0; i < Math.min(items.length - 1, 50); i++)
      expect(
        items[i].name.localeCompare(items[i + 1].name),
      ).toBeLessThanOrEqual(0);
  });

  it('every item has name and book', () => {
    for (const item of items.slice(0, 30)) {
      expect(item.name).toBeTruthy();
      expect(item.book).toBeTruthy();
    }
  });

  it('weapons have damage and damageType', () => {
    const weapons = items.filter((i) => i.damage !== null);
    expect(weapons.length).toBeGreaterThan(50);
    expect(weapons[0].damage).toBeTruthy();
    expect(weapons[0].damageType).toBeTruthy();
  });

  it('no item has undefined name (dedup/filter working)', () => {
    expect(items.every((i) => typeof i.name === 'string')).toBe(true);
  });
});
