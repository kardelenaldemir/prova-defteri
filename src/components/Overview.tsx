import { useState } from 'react';
import { ArrowRight, CalendarDays, Check } from 'lucide-react';
import type { AppData, Fitting } from '../lib/types';
import { sortFittings } from '../lib/domain';
import { displayDate } from '../lib/format';
import { FittingRow } from './FittingRow';

interface Props {
  data: AppData; today: string; noteId?: string;
  onOpen: (fitting: Fitting) => void;
  onToggle: (fittingId: string, adjustmentId: string) => void;
  onShowFittings: () => void;
}

export function Overview({ data, today, noteId, onOpen, onToggle, onShowFittings }: Props) {
  const [date, setDate] = useState(today);
  const fittings = sortFittings(data.fittings);
  const todayFittings = fittings.filter((fitting) => fitting.date === today && fitting.status !== 'İptal');
  const upcoming = fittings.filter((fitting) => fitting.date > today && fitting.status === 'Planlandı');
  const visible = fittings.filter((fitting) => fitting.date === date && fitting.status !== 'İptal');
  const pending = fittings.filter((fitting) => fitting.status === 'Planlandı').reduce((total, fitting) => total + fitting.adjustments.filter((item) => !item.done).length, 0);
  const note = fittings.find((fitting) => fitting.id === noteId) ?? todayFittings.find((fitting) => fitting.status === 'Planlandı') ?? upcoming[0] ?? todayFittings[0];
  const customerMap = new Map(data.customers.map((customer) => [customer.id, customer]));
  const noteCustomer = note && customerMap.get(note.customerId);
  const completed = note?.adjustments.filter((item) => item.done).length ?? 0;
  return <>
    <div className="page-heading"><h1>Atölyede bugün</h1><p>Provalar, notlar ve küçük detaylar bir arada.</p></div>
    <dl className="metrics-strip">
      <div><dt>Bugünkü provalar</dt><dd>{todayFittings.length}</dd></div>
      <div><dt>Yaklaşan provalar</dt><dd>{upcoming.length}</dd></div>
      <div><dt>Bekleyen düzeltmeler</dt><dd>{pending}</dd></div>
    </dl>
    <div className="overview-columns">
      <section className="flow-section" aria-labelledby="flow-heading">
        <div className="section-heading"><h2 id="flow-heading">{date === today ? 'Bugünün akışı' : 'Prova akışı'}</h2><label className="date-control"><CalendarDays size={19} /><span>{displayDate(date)}</span><input type="date" aria-label="Akış tarihi" value={date} onChange={(event) => { if (event.target.value) setDate(event.target.value); }} /></label></div>
        <div className="appointment-list">
          {visible.map((fitting) => { const customer = customerMap.get(fitting.customerId); return customer ? <FittingRow key={fitting.id} fitting={fitting} customer={customer} selected={fitting.id === note?.id} onOpen={() => onOpen(fitting)} /> : null; })}
          {!visible.length && <div className="empty-state"><CalendarDays size={30} /><h3>Bu gün için prova yok</h3><p>Yeni bir prova ekleyebilir ya da farklı bir tarih seçebilirsin.</p>{date !== today && <button className="button secondary" onClick={() => setDate(today)}>Bugüne dön</button>}</div>}
        </div>
        <button className="text-link" onClick={onShowFittings}>Tüm provaları gör <ArrowRight size={18} /></button>
      </section>
      <aside className="note-panel" aria-labelledby="note-heading">
        <h2 id="note-heading">Prova notları</h2>
        {note && noteCustomer ? <>
          <h3>{noteCustomer.name}</h3><p className="note-subtitle">{note.type} · {note.time}</p>
          <div className="notes-checklist">{note.adjustments.map((adjustment) => <label className={`check-row ${adjustment.done ? 'is-done' : ''}`} key={adjustment.id}><input type="checkbox" checked={adjustment.done} onChange={() => onToggle(note.id, adjustment.id)} /><span className="custom-check" aria-hidden="true">{adjustment.done && <Check size={15} />}</span><span>{adjustment.label}</span></label>)}{!note.adjustments.length && <p className="muted">Henüz düzeltme maddesi eklenmedi.</p>}</div>
          <div className="detail-progress"><div className="progress-track"><span style={{ width: `${note.adjustments.length ? completed / note.adjustments.length * 100 : 0}%` }} /></div><span>{completed} / {note.adjustments.length} tamamlandı</span></div>
          <button className="button outline" onClick={() => onOpen(note)}>Prova detayını aç</button>
        </> : <div className="empty-state"><p>Yeni bir prova eklediğinde notlarını burada görebilirsin.</p></div>}
      </aside>
    </div>
    <section className="upcoming-section" aria-labelledby="upcoming-heading"><h2 id="upcoming-heading">Sıradaki günler</h2><div className="upcoming-list">{upcoming.slice(0, 3).map((fitting) => <button key={fitting.id} onClick={() => onOpen(fitting)}><span>{displayDate(fitting.date)}</span><span className="muted"> · {customerMap.get(fitting.customerId)?.name}</span></button>)}{!upcoming.length && <p className="muted">Henüz yaklaşan prova bulunmuyor.</p>}</div></section>
    <p className="page-footnote">Örnek kayıtlarla hazırlanmış atölye defteri</p>
  </>;
}
