import assert from 'node:assert/strict'
import test from 'node:test'
import { createSeedData } from './data'
import {
  addDays, getFittingConflicts, isValidDateKey, isValidTime, localDateKey,
  sortFittings, validateAppData, validateCustomer, validateFitting,
} from './domain'
import { exportAppData, importAppData, readAppData, replaceAppData, resetAppData, STORAGE_KEY, writeAppData } from './storage'
import type { Fitting, StorageLike } from './types'

const today = '2026-11-13'
const seed = createSeedData(today)
const candidate = (changes: Partial<Fitting> = {}): Fitting => ({
  ...seed.fittings[0], id: 'new-fitting', date: today, time: '10:00', durationMinutes: 60,
  adjustments: [], ...changes,
})

class MemoryStorage implements StorageLike {
  value: string | null
  writes = 0
  constructor(value: string | null = null) { this.value = value }
  getItem(key: string) { assert.equal(key, STORAGE_KEY); return this.value }
  setItem(key: string, value: string) { assert.equal(key, STORAGE_KEY); this.value = value; this.writes += 1 }
}

test('calendar dates reject rollover and respect leap-century rules', () => {
  for (const date of ['2026-02-30', '2026-02-29', '1900-02-29', '2026-04-31', '2026-13-01', '0000-01-01', '2026-1-01']) {
    assert.equal(isValidDateKey(date), false, date)
  }
  assert.equal(isValidDateKey('2024-02-29'), true)
  assert.equal(isValidDateKey('2000-02-29'), true)
  assert.equal(isValidTime('23:59'), true)
  for (const time of ['24:00', '12:60', '9:00', '10:00:00']) assert.equal(isValidTime(time), false)
})

test('local date keys and day arithmetic preserve the local calendar', () => {
  assert.equal(localDateKey(new Date(2026, 10, 13, 0, 15)), today)
  assert.equal(addDays('2026-12-31', 1), '2027-01-01')
  assert.equal(addDays('2024-02-28', 1), '2024-02-29')
  assert.equal(addDays('2026-03-01', -1), '2026-02-28')
  assert.equal(addDays('0099-12-31', 1), '0100-01-01')
  assert.throws(() => addDays('2026-02-30', 1))
  assert.throws(() => addDays(today, 1.5))
})

test('seed is fictional, internally valid, relative to today and independent per call', () => {
  assert.equal(seed.customers.length, 8)
  assert.equal(seed.fittings.length, 8)
  assert.equal(seed.customers.every((customer) => customer.phone === ''), true)
  assert.equal(seed.fittings.filter((fitting) => fitting.date === today).length, 3)
  assert.equal(validateAppData(seed).valid, true)
  const second = createSeedData(today)
  second.fittings[0].adjustments[1].done = true
  assert.equal(seed.fittings[0].adjustments[1].done, false)
  assert.equal(seed.fittings.filter((fitting) => fitting.date > today && fitting.status === 'Planlandı').length, 5)
  assert.equal(seed.fittings.flatMap((fitting) => fitting.adjustments).filter((adjustment) => !adjustment.done).length, 11)
})

test('sorting is chronological and does not mutate source arrays', () => {
  const source = [candidate({ id: 'late', time: '14:00' }), candidate({ id: 'tomorrow', date: addDays(today, 1) }), candidate({ id: 'early', time: '09:00' })]
  assert.deepEqual(sortFittings(source).map((fitting) => fitting.id), ['early', 'late', 'tomorrow'])
  assert.equal(source[0].id, 'late')
})

test('atelier intervals detect overlap, allow adjacency and ignore cancellations or self edits', () => {
  const original = candidate({ id: 'existing' })
  assert.equal(getFittingConflicts(candidate({ time: '10:30' }), [original]).length, 1)
  assert.equal(getFittingConflicts(candidate({ time: '09:30', durationMinutes: 120 }), [original]).length, 1)
  assert.equal(getFittingConflicts(candidate({ time: '11:00' }), [original]).length, 0)
  assert.equal(getFittingConflicts(candidate({ time: '09:00' }), [original]).length, 0)
  assert.equal(getFittingConflicts(candidate({ date: addDays(today, 1) }), [original]).length, 0)
  assert.equal(getFittingConflicts(candidate(), [{ ...original, status: 'İptal' }]).length, 0)
  assert.equal(getFittingConflicts(candidate({ status: 'İptal' }), [original]).length, 0)
  assert.equal(getFittingConflicts({ ...original, time: '10:15' }, [original]).length, 0)
  assert.equal(getFittingConflicts(candidate(), [{ ...original, status: 'Tamamlandı' }]).length, 1)
})

test('customer validation handles optional contact and real calendar dates', () => {
  const customer = seed.customers[0]
  assert.equal(validateCustomer({ ...customer, phone: '' }).valid, true)
  assert.equal(validateCustomer({ ...customer, name: ' A ' }).valid, false)
  assert.equal(validateCustomer({ ...customer, name: 'x'.repeat(81) }).valid, false)
  assert.equal(validateCustomer({ ...customer, phone: 'bir telefon' }).valid, false)
  assert.equal(validateCustomer({ ...customer, phone: '+90 (5xx) 123' }).valid, false)
  assert.equal(validateCustomer({ ...customer, weddingDate: '2026-02-30' }).valid, false)
})

test('fitting validation enforces known customers, positive intervals and conflicts', () => {
  assert.equal(validateFitting(candidate(), seed.customers).valid, true)
  assert.equal(validateFitting(candidate({ customerId: 'unknown' }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ date: '2026-02-30' }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ time: '24:00' }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ durationMinutes: 0 }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ durationMinutes: 45.5 }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ time: '23:30', durationMinutes: 60 }), seed.customers).valid, false)
  assert.equal(validateFitting(candidate({ time: '23:30', durationMinutes: 30 }), seed.customers).valid, true)
  assert.equal(validateFitting(candidate({ dress: ' ' }), seed.customers).valid, false)
  assert.equal(Boolean(validateFitting(candidate(), seed.customers, seed.fittings).errors.conflict), true)
})

test('backup validation rejects version, missing fields, duplicate identities and broken references', () => {
  assert.equal(validateAppData({ ...seed, version: 2 }).valid, false)
  assert.equal(validateAppData({ version: 1, customers: [], fittings: null }).valid, false)
  assert.equal(validateAppData({ ...seed, customers: [...seed.customers, seed.customers[0]] }).valid, false)
  assert.equal(validateAppData({ ...seed, fittings: [...seed.fittings, seed.fittings[0]] }).valid, false)
  assert.equal(validateAppData({ ...seed, fittings: [{ ...seed.fittings[0], customerId: 'absent' }] }).valid, false)
  assert.equal(validateAppData({ ...seed, customers: [{ ...seed.customers[0], phone: null }] }).valid, false)
  assert.equal(validateAppData({ ...seed, fittings: [{ ...seed.fittings[0], adjustments: [{ id: 'a', label: 'Düzeltme', done: 'yes' }] }] }).valid, false)
  assert.equal(validateAppData({ ...seed, fittings: [candidate({ id: 'a' }), candidate({ id: 'b', time: '10:30' })] }).valid, false)
})

test('JSON export/import round trip keeps complete structured records', () => {
  const result = importAppData(exportAppData(seed))
  assert.equal(result.ok, true)
  if (result.ok) assert.deepEqual(result.data, seed)
  assert.equal(importAppData('{broken').ok, false)
  assert.equal(importAppData('null').ok, false)
  assert.equal(importAppData('[]').ok, false)
})

test('first use seeds once; a valid empty workspace never reseeds', () => {
  const storage = new MemoryStorage()
  const first = readAppData(storage)
  assert.equal(first.ok && first.source, 'seed')
  assert.equal(storage.writes, 1)
  const second = readAppData(storage)
  assert.equal(second.ok && second.source, 'storage')
  assert.equal(storage.writes, 1)
  const empty = { version: 1 as const, customers: [], fittings: [] }
  assert.equal(writeAppData(empty, storage).ok, true)
  const loaded = readAppData(storage)
  assert.equal(loaded.ok && loaded.data.customers.length, 0)
  assert.equal(loaded.ok && loaded.data.fittings.length, 0)
})

test('malformed saved data stays untouched until an explicit reset', () => {
  for (const raw of ['', '{broken', JSON.stringify({ ...seed, version: 99 })]) {
    const storage = new MemoryStorage(raw)
    const read = readAppData(storage)
    assert.equal(read.ok, false)
    if (!read.ok) assert.equal(read.raw, raw)
    assert.equal(writeAppData(seed, storage).ok, false)
    assert.equal(storage.value, raw)
    assert.equal(storage.writes, 0)
    assert.equal(resetAppData(storage, today).ok, true)
    assert.equal(storage.writes, 1)
    assert.equal(readAppData(storage).ok, true)
  }
})

test('read errors and quota failures are returned instead of silent success', () => {
  const unavailable: StorageLike = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
  assert.equal(readAppData(unavailable).ok, false)
  assert.equal(writeAppData(seed, unavailable).ok, false)
  assert.equal(resetAppData(unavailable, today).ok, false)
  const quota: StorageLike = { getItem() { return null }, setItem() { throw new Error('quota exceeded') } }
  const result = readAppData(quota)
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /quota exceeded/)
})

test('explicit backup restore replaces corrupt data in one write without reading or resetting', () => {
  let value = '{broken'
  let writes = 0
  const storage: StorageLike = {
    getItem() { throw new Error('Restore must not read the current payload.') },
    setItem(key, nextValue) { assert.equal(key, STORAGE_KEY); value = nextValue; writes += 1 },
  }
  assert.equal(replaceAppData(seed, storage).ok, true)
  assert.equal(writes, 1)
  const restored = importAppData(value)
  assert.equal(restored.ok, true)
  if (restored.ok) assert.deepEqual(restored.data, seed)

  const invalid = { ...seed, customers: [{ ...seed.customers[0], name: '' }] }
  assert.equal(replaceAppData(invalid, storage).ok, false)
  assert.equal(writes, 1)
})

test('failed explicit restore reports the write failure and leaves the previous payload intact', () => {
  const previous = '{broken'
  let value = previous
  let attempts = 0
  const storage: StorageLike = {
    getItem() { return value },
    setItem() { attempts += 1; throw new Error('quota exceeded') },
  }
  const result = replaceAppData(seed, storage)
  assert.equal(result.ok, false)
  if (!result.ok) assert.match(result.error, /quota exceeded/)
  assert.equal(attempts, 1)
  assert.equal(value, previous)
})
