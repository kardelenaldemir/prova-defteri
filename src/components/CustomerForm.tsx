import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { validateCustomer } from '../lib/domain'
import type { Customer } from '../lib/types'
import { Dialog } from './Dialog'

export interface CustomerFormProps {
  initial?: Customer
  onSave: (customer: Customer) => void
  onClose: () => void
}

export function CustomerForm({ initial, onSave, onClose }: CustomerFormProps) {
  const prefix = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [customer, setCustomer] = useState<Customer>(() => initial
    ? { ...initial }
    : { id: crypto.randomUUID(), name: '', phone: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: 'name' | 'phone' | 'weddingDate' | 'notes', value: string) {
    setCustomer((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized: Customer = {
      ...customer,
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      notes: customer.notes.trim(),
    }
    if (customer.weddingDate) normalized.weddingDate = customer.weddingDate
    else delete normalized.weddingDate
    const result = validateCustomer(normalized)
    setErrors(result.errors)
    if (!result.valid) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    onSave(normalized)
  }

  return (
    <Dialog
      title={initial ? 'Müşteriyi düzenle' : 'Yeni müşteri'}
      description="İletişim bilgileri ve atölye notları bir arada."
      kind="drawer"
      onClose={onClose}
    >
      <form ref={formRef} onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor={`${prefix}-name`}>Ad soyad <span aria-hidden="true">*</span></label>
            <input
              id={`${prefix}-name`}
              data-autofocus
              name="name"
              autoComplete="name"
              value={customer.name}
              onChange={(event) => update('name', event.target.value)}
              maxLength={80}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${prefix}-name-error` : undefined}
              placeholder="Örn. Deniz Arslan"
            />
            {errors.name ? <p className="field-error" id={`${prefix}-name-error`}>{errors.name}</p> : null}
          </div>

          <div className="field">
            <label htmlFor={`${prefix}-phone`}>Telefon <span className="muted">(isteğe bağlı)</span></label>
            <input
              id={`${prefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="05xx xxx xx xx"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${prefix}-phone-error` : undefined}
            />
            {errors.phone ? <p className="field-error" id={`${prefix}-phone-error`}>{errors.phone}</p> : null}
          </div>

          <div className="field">
            <label htmlFor={`${prefix}-wedding`}>Düğün tarihi <span className="muted">(isteğe bağlı)</span></label>
            <input
              id={`${prefix}-wedding`}
              name="weddingDate"
              type="date"
              value={customer.weddingDate ?? ''}
              onChange={(event) => update('weddingDate', event.target.value)}
              aria-invalid={Boolean(errors.weddingDate)}
              aria-describedby={errors.weddingDate ? `${prefix}-wedding-error` : undefined}
            />
            {errors.weddingDate ? <p className="field-error" id={`${prefix}-wedding-error`}>{errors.weddingDate}</p> : null}
          </div>

          <div className="field full">
            <label htmlFor={`${prefix}-notes`}>Müşteri notu <span className="muted">(isteğe bağlı)</span></label>
            <textarea
              className="textarea"
              id={`${prefix}-notes`}
              name="notes"
              rows={4}
              value={customer.notes}
              onChange={(event) => update('notes', event.target.value)}
              placeholder="Model tercihleri, iletişim veya prova notları…"
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={errors.notes ? `${prefix}-notes-error` : undefined}
            />
            {errors.notes ? <p className="field-error" id={`${prefix}-notes-error`}>{errors.notes}</p> : null}
          </div>
        </div>
        <div className="form-actions">
          <button className="button secondary" type="button" onClick={onClose}>Vazgeç</button>
          <button className="button primary" type="submit">{initial ? 'Değişiklikleri kaydet' : 'Müşteriyi kaydet'}</button>
        </div>
      </form>
    </Dialog>
  )
}
