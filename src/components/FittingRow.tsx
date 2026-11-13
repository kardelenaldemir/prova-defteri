import { ChevronRight } from 'lucide-react';
import type { Customer, Fitting } from '../lib/types';
import { initials } from '../lib/format';

export function FittingRow({ fitting, customer, selected, onOpen }: { fitting: Fitting; customer: Customer; selected?: boolean; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} className={`appointment-row ${selected ? 'selected' : ''}`} aria-label={`${customer.name}, ${fitting.time}, ${fitting.type}, detayları aç`}>
    <span className="appointment-time">{fitting.time}</span>
    <span className="customer-initials" aria-hidden="true">{initials(customer.name)}</span>
    <span className="appointment-person"><strong>{customer.name}</strong><span>{fitting.type} · {fitting.dress}</span></span>
    <span className={`status-badge ${fitting.status === 'Tamamlandı' ? 'completed' : fitting.status === 'İptal' ? 'cancelled' : ''}`}>{fitting.status}</span>
    <ChevronRight className="row-chevron" size={20} strokeWidth={1.7} />
  </button>;
}
