import { useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { localDateKey, validateFitting } from '../lib/domain'
import { FITTING_STATUSES, FITTING_TYPES } from '../lib/types'
import type { AppData, Fitting } from '../lib/types'
import { Dialog } from './Dialog'

export interface FittingFormProps {
  data: AppData
  initial?: Fitting
  initialCustomerId?: string
  onSave: (fitting: Fitting) => void
  onClose: () => void
}

const DURATIONS = [30, 45, 60, 90, 120, 180]
const weddingDateFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

export function FittingForm({ data, initial, initialCustomerId, onSave, onClose }: FittingFormProps) {
  const prefix = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [fitting, setFitting] = useState<Fitting>(() => initial
    ? { ...initial, adjustments: initial.adjustments.map((item) => ({ ...item })) }
    : {
      id: crypto.randomUUID(), customerId: initialCustomerId ?? '',
      date: localDateKey(), time: '10:00', durationMinutes: 60,
      type: 'İlk prova', status: 'Planlandı', dress: '', notes: '', adjustments: [],
    })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newAdjustment, setNewAdjustment] = useState('')
  const customer = data.customers.find((item) => item.id === fitting.customerId)
  const durations = DURATIONS.includes(fitting.durationMinutes)
    ? DURATIONS
    : [...DURATIONS, fitting.durationMinutes].sort((a, b) => a - b)

  function update<K extends keyof Fitting>(field: K, value: Fitting[K]) {
    setFitting((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      if (field === 'date' || field === 'time' || field === 'durationMinutes' || field === 'status') delete next.conflict
      return next
    })
  }

  function addAdjustment() {
    const label = newAdjustment.trim()
    if (!label) return
    const adjustment = { id: crypto.randomUUID(), label, done: false }
    setFitting((current) => ({ ...current, adjustments: [...current.adjustments, adjustment] }))
    setNewAdjustment('')
  }

  function adjustmentKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addAdjustment()
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const label = newAdjustment.trim()
    const candidate: Fitting = {
      ...fitting,
      dress: fitting.dress.trim(),
      notes: fitting.notes.trim(),
      adjustments: label
        ? [...fitting.adjustments, { id: crypto.randomUUID(), label, done: false }]
        : fitting.adjustments,
    }
    const result = validateFitting(candidate, data.customers, data.fittings)
    setErrors(result.errors)
    if (!result.valid) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setFitting(candidate)
    setNewAdjustment('')
    onSave(candidate)
  }

  return (
    <Dialog
      title={initial ? 'Provayı düzenle' : 'Yeni prova'}
      description="Prova saatini ve birlikte kontrol edilecek detayları kaydedin."
      kind="drawer"
      wide
      onClose={onClose}
    >
      <form ref={formRef} onSubmit={submit} noValidate>
        {data.customers.length === 0 ? (
          <div className="empty-state">
            <h3>Önce bir müşteri ekleyin</h3>
            <p>Müşteriler bölümünden müşteri kaydı oluşturduktan sonra bu ekrandan prova planlayabilirsiniz.</p>
          </div>
        ) : (
          <div className="form-grid">
            <div className="field full">
              <label htmlFor={`${prefix}-customer`}>Müşteri <span aria-hidden="true">*</span></label>
              <select
                id={`${prefix}-customer`} name="customerId" value={fitting.customerId}
                data-autofocus
                onChange={(event) => update('customerId', event.target.value)} required
                aria-invalid={Boolean(errors.customerId)}
                aria-describedby={errors.customerId ? `${prefix}-customer-error` : customer ? `${prefix}-customer-preview` : undefined}
              >
                <option value="">Bir müşteri seçin</option>
                {data.customers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              {errors.customerId ? <p className="field-error" id={`${prefix}-customer-error`}>{errors.customerId}</p> : null}
              {customer ? (
                <p className="customer-preview field-hint" id={`${prefix}-customer-preview`}>
                  {customer.weddingDate
                    ? `Düğün: ${weddingDateFormat.format(new Date(`${customer.weddingDate}T12:00:00`))}`
                    : 'Düğün tarihi henüz eklenmemiş.'}
                  {customer.phone ? ` · ${customer.phone}` : ''}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label htmlFor={`${prefix}-date`}>Prova tarihi <span aria-hidden="true">*</span></label>
              <input id={`${prefix}-date`} name="date" type="date" value={fitting.date}
                onChange={(event) => update('date', event.target.value)} required
                aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? `${prefix}-date-error` : undefined} />
              {errors.date ? <p className="field-error" id={`${prefix}-date-error`}>{errors.date}</p> : null}
            </div>
            <div className="field">
              <label htmlFor={`${prefix}-time`}>Saat <span aria-hidden="true">*</span></label>
              <input id={`${prefix}-time`} name="time" type="time" value={fitting.time} step={60}
                onChange={(event) => update('time', event.target.value)} required
                aria-invalid={Boolean(errors.time || errors.conflict)}
                aria-describedby={errors.time ? `${prefix}-time-error` : errors.conflict ? `${prefix}-conflict` : undefined} />
              {errors.time ? <p className="field-error" id={`${prefix}-time-error`}>{errors.time}</p> : null}
            </div>
            <div className="field">
              <label htmlFor={`${prefix}-duration`}>Süre</label>
              <select id={`${prefix}-duration`} name="durationMinutes" value={fitting.durationMinutes}
                onChange={(event) => update('durationMinutes', Number(event.target.value))}
                aria-invalid={Boolean(errors.durationMinutes)} aria-describedby={errors.durationMinutes ? `${prefix}-duration-error` : undefined}>
                {durations.map((minutes) => <option value={minutes} key={minutes}>{minutes} dakika</option>)}
              </select>
              {errors.durationMinutes ? <p className="field-error" id={`${prefix}-duration-error`}>{errors.durationMinutes}</p> : null}
            </div>
            <div className="field">
              <label htmlFor={`${prefix}-type`}>Prova türü</label>
              <select id={`${prefix}-type`} name="type" value={fitting.type}
                onChange={(event) => update('type', event.target.value as Fitting['type'])}
                aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? `${prefix}-type-error` : undefined}>
                {FITTING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.type ? <p className="field-error" id={`${prefix}-type-error`}>{errors.type}</p> : null}
            </div>
            <div className="field full">
              <label htmlFor={`${prefix}-dress`}>Gelinlik / model <span aria-hidden="true">*</span></label>
              <input id={`${prefix}-dress`} name="dress" value={fitting.dress}
                onChange={(event) => update('dress', event.target.value)} placeholder="Örn. İpek saten, düz kesim" required
                aria-invalid={Boolean(errors.dress)} aria-describedby={errors.dress ? `${prefix}-dress-error` : undefined} />
              {errors.dress ? <p className="field-error" id={`${prefix}-dress-error`}>{errors.dress}</p> : null}
            </div>
            <div className="field full">
              <label htmlFor={`${prefix}-status`}>Durum</label>
              <select id={`${prefix}-status`} name="status" value={fitting.status}
                onChange={(event) => update('status', event.target.value as Fitting['status'])}
                aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? `${prefix}-status-error` : undefined}>
                {FITTING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              {errors.status ? <p className="field-error" id={`${prefix}-status-error`}>{errors.status}</p> : null}
            </div>
            {errors.conflict ? (
              <div className="field full">
                <p className="field-error form-error-summary" id={`${prefix}-conflict`} role="alert">{errors.conflict}</p>
              </div>
            ) : null}

            <div className="field full">
              <label htmlFor={`${prefix}-adjustment`}>Düzeltmeler <span className="muted">(isteğe bağlı)</span></label>
              <div className="adjustment-add">
                <input id={`${prefix}-adjustment`} value={newAdjustment}
                  onChange={(event) => setNewAdjustment(event.target.value)} onKeyDown={adjustmentKeyDown}
                  placeholder="Örn. Etek boyu işaretlenecek" />
                <button className="button secondary" type="button" onClick={addAdjustment} disabled={!newAdjustment.trim()}>
                  <Plus size={17} strokeWidth={1.6} aria-hidden="true" /> Ekle
                </button>
              </div>
              {fitting.adjustments.length ? (
                <div className="adjustment-editor">
                  {fitting.adjustments.map((item) => (
                    <div className="adjustment-item" key={item.id}>
                      <label className="check-row">
                        <input type="checkbox" checked={item.done} onChange={() => {
                          setFitting((current) => ({ ...current, adjustments: current.adjustments.map((adjustment) => adjustment.id === item.id ? { ...adjustment, done: !adjustment.done } : adjustment) }))
                        }} />
                        <span>{item.label}</span>
                      </label>
                      <button className="icon-button" type="button" aria-label={`${item.label} düzeltmesini sil`}
                        onClick={() => setFitting((current) => ({ ...current, adjustments: current.adjustments.filter((adjustment) => adjustment.id !== item.id) }))}>
                        <Trash2 size={17} strokeWidth={1.6} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : <p className="field-hint">Düzeltmeleri prova sırasında işaretleyebilirsiniz.</p>}
            </div>

            <div className="field full">
              <label htmlFor={`${prefix}-notes`}>Prova notu <span className="muted">(isteğe bağlı)</span></label>
              <textarea className="textarea" id={`${prefix}-notes`} name="notes" rows={3} value={fitting.notes}
                onChange={(event) => update('notes', event.target.value)} placeholder="Provada hatırlamak istediğiniz detaylar…"
                aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? `${prefix}-notes-error` : undefined} />
              {errors.notes ? <p className="field-error" id={`${prefix}-notes-error`}>{errors.notes}</p> : null}
            </div>
          </div>
        )}
        <div className="form-actions">
          <button className="button secondary" type="button" onClick={onClose}>Vazgeç</button>
          <button className="button primary" type="submit" disabled={data.customers.length === 0}>
            {initial ? 'Değişiklikleri kaydet' : 'Provayı kaydet'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
