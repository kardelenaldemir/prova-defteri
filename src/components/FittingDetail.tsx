import { useId } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { FITTING_STATUSES } from '../lib/types'
import type { Customer, Fitting, FittingStatus } from '../lib/types'
import { Dialog } from './Dialog'

export interface FittingDetailProps {
  fitting: Fitting
  customer: Customer
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleAdjustment: (id: string) => void
  onStatusChange: (status: FittingStatus) => void
}

const dateFormat = new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

function readableDate(value: string) {
  return dateFormat.format(new Date(`${value}T12:00:00`))
}

function endTime(fitting: Fitting) {
  const [hour, minute] = fitting.time.split(':').map(Number)
  const end = hour * 60 + minute + fitting.durationMinutes
  return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`
}

export function FittingDetail({ fitting, customer, onClose, onEdit, onDelete, onToggleAdjustment, onStatusChange }: FittingDetailProps) {
  const prefix = useId()
  const completed = fitting.adjustments.reduce((total, item) => total + Number(item.done), 0)
  const progress = fitting.adjustments.length ? completed / fitting.adjustments.length * 100 : 0

  return (
    <Dialog title={customer.name} description="Prova detayı" kind="drawer" wide onClose={onClose}>
      <section className="detail-section" aria-labelledby={`${prefix}-appointment`}>
        <h3 className="detail-title" id={`${prefix}-appointment`}>{fitting.type}</h3>
        <dl className="detail-meta">
          <div><dt>Tarih</dt><dd>{readableDate(fitting.date)}</dd></div>
          <div><dt>Saat</dt><dd>{fitting.time} – {endTime(fitting)} <span className="muted">({fitting.durationMinutes} dakika)</span></dd></div>
          <div><dt>Gelinlik / model</dt><dd>{fitting.dress}</dd></div>
          {customer.phone ? <div><dt>Telefon</dt><dd><a href={`tel:${customer.phone.replace(/[^\d+]/g, '')}`}>{customer.phone}</a></dd></div> : null}
          {customer.weddingDate ? <div><dt>Düğün tarihi</dt><dd>{readableDate(customer.weddingDate)}</dd></div> : null}
        </dl>
        <div className="field">
          <label htmlFor={`${prefix}-status`}>Prova durumu</label>
          <select id={`${prefix}-status`} value={fitting.status} onChange={(event) => onStatusChange(event.target.value as FittingStatus)}>
            {FITTING_STATUSES.map((status) => <option value={status} key={status}>{status}</option>)}
          </select>
        </div>
      </section>

      <section className="detail-section" aria-labelledby={`${prefix}-adjustments`}>
        <h3 className="detail-title" id={`${prefix}-adjustments`}>Düzeltmeler</h3>
        {fitting.adjustments.length ? (
          <>
            <div className="adjustment-editor">
              {fitting.adjustments.map((item) => (
                <label className="check-row" key={item.id}>
                  <input type="checkbox" checked={item.done} onChange={() => onToggleAdjustment(item.id)} />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
            <div className="detail-progress">
              <div className="progress-track" role="progressbar" aria-label="Tamamlanan düzeltmeler" aria-valuemin={0}
                aria-valuemax={fitting.adjustments.length} aria-valuenow={completed} aria-valuetext={`${fitting.adjustments.length} düzeltmeden ${completed} tanesi tamamlandı`}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <span className="muted">{completed} / {fitting.adjustments.length} tamamlandı</span>
            </div>
          </>
        ) : <p className="muted">Bu prova için henüz düzeltme notu eklenmemiş.</p>}
      </section>

      <section className="detail-section" aria-labelledby={`${prefix}-notes`}>
        <h3 className="detail-title" id={`${prefix}-notes`}>Prova notu</h3>
        <p className={fitting.notes ? 'detail-note' : 'muted'}>{fitting.notes || 'Bu prova için not eklenmemiş.'}</p>
      </section>
      {customer.notes ? (
        <section className="detail-section" aria-labelledby={`${prefix}-customer-notes`}>
          <h3 className="detail-title" id={`${prefix}-customer-notes`}>Müşteri notu</h3>
          <p className="detail-note">{customer.notes}</p>
        </section>
      ) : null}

      <div className="form-actions">
        <button className="button danger" type="button" onClick={onDelete}><Trash2 size={17} strokeWidth={1.6} aria-hidden="true" /> Provayı sil</button>
        <button className="button primary" type="button" onClick={onEdit}><Pencil size={17} strokeWidth={1.6} aria-hidden="true" /> Düzenle</button>
      </div>
    </Dialog>
  )
}
