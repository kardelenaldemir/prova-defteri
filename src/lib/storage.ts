import { createSeedData } from './data'
import { localDateKey, validateAppData } from './domain'
import type { AppData, ImportResult, LoadResult, StorageLike, StorageResult } from './types'

export const STORAGE_KEY = 'prova-defteri:v1'

function resolveStorage(storage?: StorageLike): StorageLike {
  if (storage) return storage
  if (typeof globalThis.localStorage === 'undefined') throw new Error('Bu ortamda yerel depolama kullanılamıyor.')
  return globalThis.localStorage
}

function detail(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function validationError(errors: Record<string, string>): string {
  return Object.entries(errors).map(([field, message]) => `${field}: ${message}`).join(' ')
}

/** Parse and validate before the caller decides whether to replace current data. */
export function importAppData(json: string): ImportResult {
  let value: unknown
  try { value = JSON.parse(json) as unknown } catch {
    return { ok: false, error: 'Yedek okunamadı. Geçerli bir JSON dosyası seçin.' }
  }
  const validation = validateAppData(value)
  return validation.valid ? { ok: true, data: validation.data } : { ok: false, error: validationError(validation.errors) }
}

export function exportAppData(data: AppData): string {
  const validation = validateAppData(data)
  if (!validation.valid) throw new Error(`Yedek oluşturulamadı. ${validationError(validation.errors)}`)
  return JSON.stringify(validation.data, null, 2)
}

/** Ordinary saves preserve corrupt data until an explicit reset or restore. */
export function writeAppData(data: AppData, storage?: StorageLike): StorageResult {
  const validation = validateAppData(data)
  if (!validation.valid) return { ok: false, error: `Kayıtlar geçersiz. ${validationError(validation.errors)}` }
  try {
    const target = resolveStorage(storage)
    const current = target.getItem(STORAGE_KEY)
    if (current !== null && !importAppData(current).ok) {
      return { ok: false, error: 'Kaydedilmiş veriler okunamıyor. Üzerine yazılmadı; devam etmek için örnek verileri sıfırlayın.' }
    }
    target.setItem(STORAGE_KEY, JSON.stringify(validation.data))
    return { ok: true }
  } catch (error) {
    return { ok: false, error: `Kayıtlar bu tarayıcıya kaydedilemedi. ${detail(error)}` }
  }
}

/** Only call after the user explicitly approves restoring this backup. */
export function replaceAppData(data: AppData, storage?: StorageLike): StorageResult {
  const validation = validateAppData(data)
  if (!validation.valid) return { ok: false, error: `Yedek geri yüklenemedi. ${validationError(validation.errors)}` }
  try {
    // One atomic localStorage write; never erase current records first.
    resolveStorage(storage).setItem(STORAGE_KEY, JSON.stringify(validation.data))
    return { ok: true }
  } catch (error) {
    return { ok: false, error: `Yedek bu tarayıcıya geri yüklenemedi. ${detail(error)}` }
  }
}

export function readAppData(storage?: StorageLike): LoadResult {
  let target: StorageLike
  let raw: string | null
  try {
    target = resolveStorage(storage)
    raw = target.getItem(STORAGE_KEY)
  } catch (error) {
    return { ok: false, error: `Kaydedilmiş veriler okunamadı. ${detail(error)}` }
  }
  if (raw === null) {
    const data = createSeedData()
    const saved = writeAppData(data, target)
    return saved.ok ? { ok: true, data, source: 'seed' } : saved
  }
  const imported = importAppData(raw)
  return imported.ok
    ? { ok: true, data: imported.data, source: 'storage' }
    : { ok: false, error: `Kaydedilmiş veriler korunuyor. ${imported.error}`, raw }
}

/** Explicitly replace saved data with fresh demo records. */
export function resetAppData(storage?: StorageLike, today = localDateKey()): LoadResult {
  const data = createSeedData(today)
  try {
    resolveStorage(storage).setItem(STORAGE_KEY, JSON.stringify(data))
    return { ok: true, data, source: 'seed' }
  } catch (error) {
    return { ok: false, error: `Örnek veriler kaydedilemedi. ${detail(error)}` }
  }
}
