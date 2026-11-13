import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import type { AppData, Customer, Fitting } from '../lib/types';
import { sortFittings } from '../lib/domain';
import { displayDate } from '../lib/format';
import { Dialog } from './Dialog';

export function CustomerDetail({ customer, data, onClose, onEdit, onDelete, onNewFitting, onOpenFitting }: {
  customer: Customer; data: AppData; onClose: () => void; onEdit: () => void; onDelete: () => void;
  onNewFitting: () => void; onOpenFitting: (fitting: Fitting) => void;
}) {
  const fittings = sortFittings(data.fittings.filter((fitting) => fitting.customerId === customer.id));
  return <Dialog title={customer.name} onClose={onClose} kind="drawer" description="Müşteri defteri">
    <dl className="detail-meta"><div><dt>Telefon</dt><dd>{customer.phone || 'Eklenmedi'}</dd></div><div><dt>Düğün tarihi</dt><dd>{customer.weddingDate ? displayDate(customer.weddingDate, { day: 'numeric', month: 'long', year: 'numeric' }) : 'Eklenmedi'}</dd></div></dl>
    {customer.notes && <section className="detail-section"><h3 className="detail-title">Müşteri notu</h3><p className="detail-note">{customer.notes}</p></section>}
    <section className="detail-section"><div className="section-heading"><h3 className="detail-title">Prova geçmişi</h3><button className="text-link" onClick={onNewFitting}><Plus size={17} />Prova ekle</button></div><div className="customer-fitting-list">{fittings.map((fitting) => <button key={fitting.id} className="customer-fitting" onClick={() => onOpenFitting(fitting)}><CalendarDays size={19} /><span><strong>{displayDate(fitting.date)} · {fitting.time}</strong><small>{fitting.type} · {fitting.dress}</small></span><span className="status-badge">{fitting.status}</span></button>)}{!fittings.length && <p className="muted">Henüz prova kaydı bulunmuyor.</p>}</div></section>
    <div className="form-actions"><button className="button danger ghost" onClick={onDelete}><Trash2 size={17} />Müşteriyi sil</button><button className="button primary" onClick={onEdit}><Pencil size={17} />Düzenle</button></div>
  </Dialog>;
}
