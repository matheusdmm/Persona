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
  getMaxCantrips,
  getMaxSpells,
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
      'name', 'race', 'class', 'background', 'edition', 'alignment',
      'skills', 'spells', 'equipment', 'weapons', 'languages', 'armor', 'shield',
    ]) {
      expect(c, `missing field: ${field}`).toHaveProperty(field);
    }
  });

  it('level defaults to 1', () => {
    expect(emptyCharacter().level).toBe(1);
  });

  it('armor defaults to empty string (unarmored)', () => {
    expect(emptyCharacter().armor).toBe('');
  });

  it('shield defaults to false', () => {
    expect(emptyCharacter().shield).toBe(false);
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

// ── 1b. Spell limits — cantrips ───────────────────────────────────────────────

describe('getMaxCantrips — 5e', () => {
  it('bard → 2',     () => expect(getMaxCantrips('bard',     '5e')).toBe(2));
  it('cleric → 3',   () => expect(getMaxCantrips('cleric',   '5e')).toBe(3));
  it('druid → 2',    () => expect(getMaxCantrips('druid',    '5e')).toBe(2));
  it('sorcerer → 4', () => expect(getMaxCantrips('sorcerer', '5e')).toBe(4));
  it('warlock → 2',  () => expect(getMaxCantrips('warlock',  '5e')).toBe(2));
  it('wizard → 3',   () => expect(getMaxCantrips('wizard',   '5e')).toBe(3));
  it('paladin → 0',  () => expect(getMaxCantrips('paladin',  '5e')).toBe(0));
  it('ranger → 0 (no cantrips in 5e)', () => expect(getMaxCantrips('ranger', '5e')).toBe(0));
  it('fighter → 0 (non-caster)',        () => expect(getMaxCantrips('fighter', '5e')).toBe(0));
});

describe('getMaxCantrips — 5.5e', () => {
  it('ranger → 2 (gains cantrips in 5.5e)', () => expect(getMaxCantrips('ranger', '5.5e')).toBe(2));
  it('bard unchanged at 2',   () => expect(getMaxCantrips('bard',   '5.5e')).toBe(2));
  it('wizard unchanged at 3', () => expect(getMaxCantrips('wizard', '5.5e')).toBe(3));
});

// ── 1c. Spell limits — spells known / prepared ────────────────────────────────

describe('getMaxSpells — known casters (fixed)', () => {
  it('bard L1 → 4',     () => expect(getMaxSpells('bard',     1, 0, 0)).toBe(4));
  it('ranger L1 → 2',   () => expect(getMaxSpells('ranger',   1, 0, 0)).toBe(2));
  it('sorcerer L1 → 2', () => expect(getMaxSpells('sorcerer', 1, 0, 0)).toBe(2));
  it('warlock L1 → 2',  () => expect(getMaxSpells('warlock',  1, 0, 0)).toBe(2));
  it('wizard L1 → 6 (spellbook, simplified)', () => expect(getMaxSpells('wizard', 1, 0, 0)).toBe(6));
  it('fighter → 0 (non-caster)', () => expect(getMaxSpells('fighter', 1, 0, 0)).toBe(0));
});

describe('getMaxSpells — cleric/druid (WIS mod + level, min 1)', () => {
  it('cleric L1 WIS mod +2 → 3', () => expect(getMaxSpells('cleric', 1, 2, 0)).toBe(3));
  it('cleric L1 WIS mod +0 → 1', () => expect(getMaxSpells('cleric', 1, 0, 0)).toBe(1));
  it('cleric L1 WIS mod -1 → 1 (min 1)', () => expect(getMaxSpells('cleric', 1, -1, 0)).toBe(1));
  it('cleric L1 WIS mod -2 → 1 (min 1 even with negative mod)', () => expect(getMaxSpells('cleric', 1, -2, 0)).toBe(1));
  it('druid L1 WIS mod +3 → 4',  () => expect(getMaxSpells('druid', 1, 3, 0)).toBe(4));
  it('druid L1 WIS mod +0 → 1',  () => expect(getMaxSpells('druid', 1, 0, 0)).toBe(1));
});

describe('getMaxSpells — paladin (CHA mod + half level, min 1)', () => {
  it('paladin L1 CHA mod +2 → 2 (half of 1 rounds to 0)', () => expect(getMaxSpells('paladin', 1, 0, 2)).toBe(2));
  it('paladin L1 CHA mod +0 → 1 (min 1)',                 () => expect(getMaxSpells('paladin', 1, 0, 0)).toBe(1));
  it('paladin L1 CHA mod -1 → 1 (min 1)',                 () => expect(getMaxSpells('paladin', 1, 0, -1)).toBe(1));
  it('paladin L2 CHA mod +2 → 3 (half of 2 = 1)',        () => expect(getMaxSpells('paladin', 2, 0, 2)).toBe(3));
  it('paladin L3 CHA mod +1 → 2 (1 + floor(3/2)=1)',     () => expect(getMaxSpells('paladin', 3, 0, 1)).toBe(2));
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

// ── 2b. Go API — /api/armor ───────────────────────────────────────────────────

describe('Go API — GET /api/armor', () => {
  it('returns 12 armor items', async () => {
    const res = await fetch(`${LOCAL_API}/armor`);
    expect(res.ok).toBe(true);
    const armor = await res.json();
    expect(armor).toHaveLength(12);
  });

  it('every item has id, name, type, base, and proficiency', async () => {
    const armor = await fetch(`${LOCAL_API}/armor`).then(r => r.json());
    for (const a of armor)
      expect(a).toMatchObject({
        id:          expect.any(String),
        name:        expect.any(String),
        type:        expect.any(String),
        base:        expect.any(Number),
        proficiency: expect.any(String),
      });
  });

  it('has 3 light, 5 medium, 4 heavy armor items', async () => {
    const armor = await fetch(`${LOCAL_API}/armor`).then(r => r.json());
    const byType = armor.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {});
    expect(byType.light).toBe(3);
    expect(byType.medium).toBe(5);
    expect(byType.heavy).toBe(4);
  });

  it('plate has base AC 18', async () => {
    const armor = await fetch(`${LOCAL_API}/armor`).then(r => r.json());
    const plate = armor.find(a => a.id === 'plate');
    expect(plate.base).toBe(18);
  });

  it('chain_mail has base AC 16 and heavy type', async () => {
    const armor = await fetch(`${LOCAL_API}/armor`).then(r => r.json());
    const chain = armor.find(a => a.id === 'chain_mail');
    expect(chain.base).toBe(16);
    expect(chain.type).toBe('heavy');
  });
});

// ── 2c. Go API — AC calculation ───────────────────────────────────────────────

describe('Go API — AC calculation', () => {
  // Base payload — human gives +1 to all abilities (accounted for in expected values)
  async function calcAC(overrides) {
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race: 'human', class: 'fighter', level: 1, background: 'Soldier',
        abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
        armor: '', shield: false,
        ...overrides,
      }),
    });
    return res.json();
  }

  // ── Unarmored ──
  it('unarmored: AC = 10 + DEX mod (human DEX 12 → final 13 → +1 → AC 11)', async () => {
    const sheet = await calcAC({ abilities: { strength: 10, dexterity: 12, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 } });
    expect(sheet.armor_class).toBe(11); // 10 + 1
  });

  it('unarmored: negative DEX mod reduces AC below 10', async () => {
    // human DEX 6 → final 7 → mod -2 → AC 8
    const sheet = await calcAC({ abilities: { strength: 10, dexterity: 6, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 } });
    expect(sheet.armor_class).toBe(8);
  });

  // ── Light armor ──
  it('leather (11): adds full DEX mod with no cap', async () => {
    // human DEX 14 → final 15 → mod +2 → AC 13
    const sheet = await calcAC({
      armor: 'leather',
      abilities: { strength: 10, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(13);
  });

  it('studded leather (12): adds full DEX mod', async () => {
    // human DEX 14 → final 15 → mod +2 → AC 14
    const sheet = await calcAC({
      armor: 'studded',
      abilities: { strength: 10, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(14);
  });

  it('light armor: high DEX (mod +5) is NOT capped', async () => {
    // human DEX 19 → final 20 → mod +5 → leather AC 11+5=16
    const sheet = await calcAC({
      armor: 'leather',
      abilities: { strength: 10, dexterity: 19, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(16);
  });

  // ── Medium armor ──
  it('scale mail (14): adds DEX mod when DEX mod ≤ 2', async () => {
    // human DEX 12 → final 13 → mod +1 → AC 15
    const sheet = await calcAC({
      armor: 'scale_mail',
      abilities: { strength: 10, dexterity: 12, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(15);
  });

  it('medium armor: DEX mod capped at +2 even with DEX 18', async () => {
    // human DEX 17 → final 18 → mod +4, capped → scale mail AC 14+2=16
    const sheet = await calcAC({
      armor: 'scale_mail',
      abilities: { strength: 10, dexterity: 17, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(16);
  });

  it('medium armor: negative DEX mod still applies (no floor)', async () => {
    // human DEX 6 → final 7 → mod -2 → hide AC 12+(-2)=10
    const sheet = await calcAC({
      armor: 'hide',
      abilities: { strength: 10, dexterity: 6, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(10);
  });

  // ── Heavy armor ──
  it('plate (18): ignores DEX entirely', async () => {
    // human DEX 19 → final 20 → mod +5, ignored → AC 18
    const sheet = await calcAC({
      armor: 'plate',
      abilities: { strength: 10, dexterity: 19, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(18);
  });

  it('chain mail (16): same AC regardless of DEX', async () => {
    const [low, high] = await Promise.all([
      calcAC({ armor: 'chain_mail', abilities: { strength: 10, dexterity: 6,  constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 } }),
      calcAC({ armor: 'chain_mail', abilities: { strength: 10, dexterity: 19, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 } }),
    ]);
    expect(low.armor_class).toBe(16);
    expect(high.armor_class).toBe(16);
  });

  // ── Shield ──
  it('shield adds +2 to unarmored AC', async () => {
    // human DEX 10 → final 11 → mod 0 → AC 10+2=12
    const sheet = await calcAC({ shield: true });
    expect(sheet.armor_class).toBe(12);
  });

  it('shield adds +2 to light armor AC', async () => {
    // leather 11 + DEX mod 0 + shield 2 = 13
    const sheet = await calcAC({ armor: 'leather', shield: true });
    expect(sheet.armor_class).toBe(13);
  });

  it('shield adds +2 to heavy armor AC', async () => {
    // plate 18 + shield 2 = 20
    const sheet = await calcAC({ armor: 'plate', shield: true });
    expect(sheet.armor_class).toBe(20);
  });

  // ── Unarmored defense ──
  it('barbarian unarmored defense: 10 + DEX + CON', async () => {
    // human barbarian DEX 14→15 mod+2, CON 14→15 mod+2 → AC 14
    const sheet = await calcAC({
      class: 'barbarian', armor: '',
      abilities: { strength: 10, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(14);
  });

  it('barbarian unarmored defense + shield', async () => {
    // 10 + DEX mod 2 + CON mod 2 + shield 2 = 16
    const sheet = await calcAC({
      class: 'barbarian', armor: '', shield: true,
      abilities: { strength: 10, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(16);
  });

  it('barbarian wearing armor does NOT use unarmored defense', async () => {
    // scale mail (14) + DEX mod 0, not 10+DEX+CON
    const sheet = await calcAC({
      class: 'barbarian', armor: 'scale_mail',
      abilities: { strength: 10, dexterity: 10, constitution: 14, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(14); // scale mail base, DEX mod 0
  });

  it('monk unarmored defense: 10 + DEX + WIS', async () => {
    // human monk DEX 14→15 mod+2, WIS 12→13 mod+1 → AC 13
    const sheet = await calcAC({
      class: 'monk', armor: '',
      abilities: { strength: 10, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 12, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(13);
  });

  // ── Fallback ──
  it('unknown armor id falls back to 10 + DEX mod', async () => {
    // human DEX 12 → final 13 → mod +1 → AC 11
    const sheet = await calcAC({
      armor: 'definitely_not_real_armor',
      abilities: { strength: 10, dexterity: 12, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    });
    expect(sheet.armor_class).toBe(11);
  });

  it('missing armor/shield fields defaults gracefully (no 500)', async () => {
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race: 'human', class: 'fighter', level: 1, background: 'Soldier',
        abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      }),
    });
    expect(res.ok).toBe(true);
    const sheet = await res.json();
    expect(sheet.armor_class).toBe(10); // 10 + DEX mod 0 (human +1 DEX → 11, mod 0)
  });
});

// ── 2d. Go API — race ability bonuses ─────────────────────────────────────────

describe('Go API — race ability bonuses', () => {
  async function calcRace(race, abilityOverrides = {}) {
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race, class: 'fighter', level: 1, background: 'Soldier',
        abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10, ...abilityOverrides },
        armor: '', shield: false,
      }),
    });
    return res.json();
  }

  it('elf +2 DEX is reflected in modifiers.dexterity', async () => {
    // base DEX 10 + elf +2 = 12 → mod +1
    const sheet = await calcRace('elf');
    expect(sheet.modifiers.dexterity).toBe(1);
  });

  it('elf +2 DEX increases initiative', async () => {
    const [elf, human] = await Promise.all([calcRace('elf'), calcRace('human')]);
    expect(elf.initiative).toBeGreaterThan(human.initiative);
  });

  it('elf +2 DEX is reflected in input.abilities in response', async () => {
    const sheet = await calcRace('elf');
    expect(sheet.input.abilities.dexterity).toBe(12);
  });

  it('dwarf +2 CON increases max HP vs same stats with human', async () => {
    const [dwarf, human] = await Promise.all([calcRace('dwarf'), calcRace('human')]);
    expect(dwarf.max_hp).toBeGreaterThan(human.max_hp);
  });

  it('dwarf CON 14 → final 16 → mod +3 → fighter L1 HP 13', async () => {
    // d10 + 3 = 13
    const sheet = await calcRace('dwarf', { constitution: 14 });
    expect(sheet.max_hp).toBe(13);
  });

  it('human +1 all stats: returned abilities are all 11', async () => {
    const sheet = await calcRace('human');
    const { strength, dexterity, constitution, intelligence, wisdom, charisma } = sheet.input.abilities;
    expect([strength, dexterity, constitution, intelligence, wisdom, charisma]).toEqual([11, 11, 11, 11, 11, 11]);
  });

  it('half-elf +2 CHA is reflected in modifiers.charisma', async () => {
    // base CHA 10 + half-elf +2 = 12 → mod +1
    const sheet = await calcRace('half-elf');
    expect(sheet.modifiers.charisma).toBe(1);
  });

  it('tiefling +2 CHA +1 INT reflected in modifiers', async () => {
    // CHA 10+2=12 → +1, INT 10+1=11 → 0
    const sheet = await calcRace('tiefling');
    expect(sheet.modifiers.charisma).toBe(1);
    expect(sheet.modifiers.intelligence).toBe(0);
    expect(sheet.input.abilities.charisma).toBe(12);
    expect(sheet.input.abilities.intelligence).toBe(11);
  });

  it('dragonborn +2 STR +1 CHA reflected in modifiers', async () => {
    // STR 10+2=12 → +1, CHA 10+1=11 → 0
    const sheet = await calcRace('dragonborn');
    expect(sheet.modifiers.strength).toBe(1);
    expect(sheet.modifiers.charisma).toBe(0);
  });

  it('gnome +2 INT reflected in modifiers.intelligence', async () => {
    // INT 10+2=12 → +1
    const sheet = await calcRace('gnome');
    expect(sheet.modifiers.intelligence).toBe(1);
  });

  it('unknown race: no crash, returns a valid sheet', async () => {
    const res = await fetch(`${LOCAL_API}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        race: 'klingon', class: 'fighter', level: 1, background: 'Soldier',
        abilities: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
        armor: '', shield: false,
      }),
    });
    expect(res.ok).toBe(true);
    const sheet = await res.json();
    // No race bonus: all modifiers should be 0
    expect(sheet.modifiers.strength).toBe(0);
    expect(sheet.modifiers.dexterity).toBe(0);
  });

  it('CON race bonus (dwarf) improves HP compared to no bonus', async () => {
    // dwarf CON 10 → final 12 → mod +1 → fighter L1 HP 11
    // human CON 10 → final 11 → mod +0 → fighter L1 HP 10
    const [dwarf, human] = await Promise.all([
      calcRace('dwarf', { constitution: 10 }),
      calcRace('human', { constitution: 10 }),
    ]);
    expect(dwarf.max_hp).toBeGreaterThan(human.max_hp);
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
