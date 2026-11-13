export const FITTING_TYPES = ['İlk prova', 'Ara prova', 'Son prova'] as const
export const FITTING_STATUSES = ['Planlandı', 'Tamamlandı', 'İptal'] as const

export type FittingType = (typeof FITTING_TYPES)[number]
export type FittingStatus = (typeof FITTING_STATUSES)[number]

export interface Customer {
  id: string
  name: string
  phone: string
  weddingDate?: string
  notes: string
}

export interface Adjustment {
  id: string
  label: string
  done: boolean
}

export interface Fitting {
  id: string
  customerId: string
  date: string
  time: string
  durationMinutes: number
  type: FittingType
  status: FittingStatus
  dress: string
  notes: string
  adjustments: Adjustment[]
}

export interface AppData {
  version: 1
  customers: Customer[]
  fittings: Fitting[]
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export type AppDataValidationResult =
  | { valid: true; errors: Record<string, string>; data: AppData }
  | { valid: false; errors: Record<string, string> }

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export type StorageResult = { ok: true } | { ok: false; error: string }
export type ImportResult = { ok: true; data: AppData } | { ok: false; error: string }
export type LoadResult =
  | { ok: true; data: AppData; source: 'storage' | 'seed' }
  | { ok: false; error: string; raw?: string }
