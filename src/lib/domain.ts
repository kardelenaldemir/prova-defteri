import { FITTING_STATUSES, FITTING_TYPES } from './types'
import type { AppData, AppDataValidationResult, Customer, Fitting, ValidationResult } from './types'

/** Calendar keys use local dates, never toISOString's UTC date. */
export function localDateKey(date = new Date()): string {
  if (!Number.isFinite(date.getTime())) throw new Error('Geçerli bir tarih gerekli.')
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || month < 1 || month > 12 || day < 1) return false
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
}

export function isValidTime(value: unknown): value is string {
  return typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function addDays(dateKey: string, days: number): string {
  if (!isValidDateKey(dateKey) || !Number.isInteger(days)) throw new Error('Geçerli tarih ve tam gün sayısı gerekli.')
  const [year, month, day] = dateKey.split('-').map(Number)
  // setFullYear also handles years 0001-0099 without Date's 1900 offset.
  const date = new Date(0)
  date.setHours(12, 0, 0, 0)
  date.setFullYear(year, month - 1, day)
  date.setDate(date.getDate() + days)
  const result = localDateKey(date)
  if (!isValidDateKey(result)) throw new Error('Tarih desteklenen takvim aralığının dışında.')
  return result
}

export function fittingStartMinutes(fitting: Pick<Fitting, 'time'>): number {
  if (!isValidTime(fitting.time)) return Number.NaN
  const [hour, minute] = fitting.time.split(':').map(Number)
  return hour * 60 + minute
}

export function compareFittings(a: Fitting, b: Fitting): number {
  return a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.id.localeCompare(b.id)
}

export function sortFittings(fittings: readonly Fitting[]): Fitting[] {
  return [...fittings].sort(compareFittings)
}

/** The atelier has one fitting room. Adjacent intervals are allowed. */
export function getFittingConflicts(candidate: Fitting, fittings: readonly Fitting[]): Fitting[] {
  if (candidate.status === 'İptal' || !isValidDateKey(candidate.date)) return []
  const start = fittingStartMinutes(candidate)
  const end = start + candidate.durationMinutes
  if (!Number.isFinite(start) || !Number.isFinite(end) || candidate.durationMinutes <= 0) return []
  return sortFittings(fittings.filter((other) => {
    if (other.id === candidate.id || other.date !== candidate.date || other.status === 'İptal') return false
    const otherStart = fittingStartMinutes(other)
    const otherEnd = otherStart + other.durationMinutes
    return Number.isFinite(otherStart) && other.durationMinutes > 0 && start < otherEnd && otherStart < end
  }))
}

export function validateCustomer(customer: Customer): ValidationResult {
  const errors: Record<string, string> = {}
  const name = typeof customer.name === 'string' ? customer.name.trim() : ''
  if (name.length < 2 || name.length > 80) errors.name = 'Ad soyad 2 ile 80 karakter arasında olmalı.'
  if (typeof customer.phone !== 'string') errors.phone = 'Telefon metin olarak girilmeli.'
  else if (customer.phone.trim()) {
    const phone = customer.phone.trim()
    const digits = phone.replace(/\D/g, '')
    if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Telefon 7-15 rakam içermeli; +, boşluk, parantez ve tire kullanılabilir.'
    }
  }
  if (customer.weddingDate !== undefined && customer.weddingDate !== '' && !isValidDateKey(customer.weddingDate)) {
    errors.weddingDate = 'Geçerli bir düğün tarihi seçin.'
  }
  if (typeof customer.notes !== 'string') errors.notes = 'Not metin olmalı.'
  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateFitting(fitting: Fitting, customers: readonly Customer[], fittings: readonly Fitting[] = []): ValidationResult {
  const errors: Record<string, string> = {}
  if (!customers.some((customer) => customer.id === fitting.customerId)) errors.customerId = 'Kayıtlı bir müşteri seçin.'
  if (!isValidDateKey(fitting.date)) errors.date = 'Geçerli bir prova tarihi seçin.'
  if (!isValidTime(fitting.time)) errors.time = 'Saati SS:DD biçiminde girin.'
  if (!Number.isInteger(fitting.durationMinutes) || fitting.durationMinutes <= 0) errors.durationMinutes = 'Süre pozitif bir tam dakika olmalı.'
  else if (isValidTime(fitting.time) && fittingStartMinutes(fitting) + fitting.durationMinutes > 24 * 60) {
    errors.durationMinutes = 'Prova aynı takvim günü içinde bitmeli.'
  }
  if (!FITTING_TYPES.includes(fitting.type)) errors.type = 'Geçerli bir prova türü seçin.'
  if (!FITTING_STATUSES.includes(fitting.status)) errors.status = 'Geçerli bir durum seçin.'
  if (typeof fitting.dress !== 'string' || !fitting.dress.trim()) errors.dress = 'Gelinlik veya model bilgisini girin.'
  if (typeof fitting.notes !== 'string') errors.notes = 'Not metin olmalı.'
  if (!errors.date && !errors.time && !errors.durationMinutes) {
    const conflicts = getFittingConflicts(fitting, fittings)
    if (conflicts.length) errors.conflict = `${conflicts[0].time} saatindeki prova ile çakışıyor. Başka bir saat seçin.`
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasId(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Imported backups must be complete, internally linked and conflict free. */
export function validateAppData(value: unknown): AppDataValidationResult {
  const errors: Record<string, string> = {}
  if (!isRecord(value)) return { valid: false, errors: { data: 'Yedek bir JSON nesnesi olmalı.' } }
  if (value.version !== 1) errors.version = 'Bu yedek sürümü desteklenmiyor; sürüm 1 gerekli.'
  if (!Array.isArray(value.customers)) errors.customers = 'Müşteri listesi eksik veya geçersiz.'
  if (!Array.isArray(value.fittings)) errors.fittings = 'Prova listesi eksik veya geçersiz.'
  if (Object.keys(errors).length) return { valid: false, errors }

  const customerIds = new Set<string>()
  const fittingIds = new Set<string>()
  const customers: Customer[] = []
  const fittings: Fitting[] = []
  for (const [index, item] of (value.customers as unknown[]).entries()) {
    const key = `customers[${index}]`
    if (!isRecord(item) || !hasId(item.id) || typeof item.name !== 'string' || typeof item.phone !== 'string' ||
      typeof item.notes !== 'string' || (item.weddingDate !== undefined && typeof item.weddingDate !== 'string')) {
      errors[key] = 'Müşteri alanları eksik veya yanlış türde.'
      continue
    }
    if (customerIds.has(item.id)) errors[`${key}.id`] = 'Müşteri kimlikleri benzersiz olmalı.'
    customerIds.add(item.id)
    const customer: Customer = { id: item.id, name: item.name, phone: item.phone, notes: item.notes }
    if (item.weddingDate !== undefined && item.weddingDate !== '') customer.weddingDate = item.weddingDate
    for (const [field, message] of Object.entries(validateCustomer(customer).errors)) errors[`${key}.${field}`] = message
    customers.push(customer)
  }
  for (const [index, item] of (value.fittings as unknown[]).entries()) {
    const key = `fittings[${index}]`
    if (!isRecord(item) || !hasId(item.id) || typeof item.customerId !== 'string' || typeof item.date !== 'string' ||
      typeof item.time !== 'string' || typeof item.durationMinutes !== 'number' || typeof item.type !== 'string' ||
      typeof item.status !== 'string' || typeof item.dress !== 'string' || typeof item.notes !== 'string' || !Array.isArray(item.adjustments)) {
      errors[key] = 'Prova alanları eksik veya yanlış türde.'
      continue
    }
    if (fittingIds.has(item.id)) errors[`${key}.id`] = 'Prova kimlikleri benzersiz olmalı.'
    fittingIds.add(item.id)
    const adjustmentIds = new Set<string>()
    const adjustments: Fitting['adjustments'] = []
    for (const [adjustmentIndex, adjustment] of item.adjustments.entries()) {
      if (!isRecord(adjustment) || !hasId(adjustment.id) || typeof adjustment.label !== 'string' || !adjustment.label.trim() || typeof adjustment.done !== 'boolean') {
        errors[`${key}.adjustments[${adjustmentIndex}]`] = 'Düzeltme kimliği, açıklaması ve tamamlanma durumu gerekli.'
        continue
      }
      if (adjustmentIds.has(adjustment.id)) errors[`${key}.adjustments[${adjustmentIndex}].id`] = 'Bir provadaki düzeltme kimlikleri benzersiz olmalı.'
      adjustmentIds.add(adjustment.id)
      adjustments.push({ id: adjustment.id, label: adjustment.label, done: adjustment.done })
    }
    const fitting: Fitting = {
      id: item.id, customerId: item.customerId, date: item.date, time: item.time,
      durationMinutes: item.durationMinutes, type: item.type as Fitting['type'], status: item.status as Fitting['status'],
      dress: item.dress, notes: item.notes, adjustments,
    }
    for (const [field, message] of Object.entries(validateFitting(fitting, customers).errors)) errors[`${key}.${field}`] = message
    fittings.push(fitting)
  }
  for (const [index, fitting] of fittings.entries()) {
    if (getFittingConflicts(fitting, fittings).length) errors[`fittings[${index}].conflict`] = 'Yedekte aynı atölye için çakışan provalar var.'
  }
  if (Object.keys(errors).length) return { valid: false, errors }
  const data: AppData = { version: 1, customers, fittings }
  return { valid: true, errors: {}, data }
}
