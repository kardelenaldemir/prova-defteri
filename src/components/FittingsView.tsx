import { useState } from 'react';
import { CalendarDays, Search, SlidersHorizontal } from 'lucide-react';
import type { AppData, Fitting } from '../lib/types';
import { FITTING_STATUSES } from '../lib/types';
import { sortFittings } from '../lib/domain';
import { displayDate, searchText } from '../lib/format';
import { FittingRow } from './FittingRow';

export function FittingsView({ data, today, onOpen }: { data: AppData; today: string; onOpen: (fitting: Fitting) => void }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Tümü');
  const [period, setPeriod] = useState('Tüm tarihler');
  const customers = new Map(data.customers.map((customer) => [customer.id, customer]));
  const visible = sortFittings(data.fittings).filter((fitting) => {
    const customer = customers.get(fitting.customerId);
    if (!customer) return false;
    return (status === 'Tümü' || fitting.status === status)
      && (period === 'Tüm tarihler' || (period === 'Bugün' && fitting.date === today) || (period === 'Yaklaşan' && fitting.date >= today) || (period === 'Geçmiş' && fitting.date < today))
      && searchText(`${customer.name} ${customer.phone} ${fitting.dress}`).includes(searchText(query));
  });
  const groups = [...new Set(visible.map((fitting) => fitting.date))];
  const clearFilters = () => { setQuery(''); setStatus('Tümü'); setPeriod('Tüm tarihler'); };
  return <>
    <div className="page-heading"><h1>Provalar</h1><p>Her randevu, her detay yerli yerinde.</p></div>
    <div className="list-toolbar"><label className="search-field"><Search size={19} /><input aria-label="Provalarda ara" placeholder="İsim, telefon veya model ara" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="filter-field"><SlidersHorizontal size={17} /><select aria-label="Prova durumu filtresi" value={status} onChange={(event) => setStatus(event.target.value)}><option>Tümü</option>{FITTING_STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label><label className="filter-field"><CalendarDays size={17} /><select aria-label="Prova tarih filtresi" value={period} onChange={(event) => setPeriod(event.target.value)}>{['Tüm tarihler', 'Bugün', 'Yaklaşan', 'Geçmiş'].map((value) => <option key={value}>{value}</option>)}</select></label></div>
    <p className="result-count" role="status">{visible.length} prova gösteriliyor</p>
    {groups.map((date) => <section className="fitting-group" key={date}><h2>{displayDate(date, { day: 'numeric', month: 'long', weekday: 'long' })}{date === today && <span className="today-label">Bugün</span>}</h2><div className="appointment-list">{visible.filter((fitting) => fitting.date === date).map((fitting) => <FittingRow key={fitting.id} fitting={fitting} customer={customers.get(fitting.customerId)!} onOpen={() => onOpen(fitting)} />)}</div></section>)}
    {!visible.length && <div className="empty-state large"><CalendarDays size={38} /><h2>Bu filtrelerde prova bulunamadı</h2><p>Farklı bir isim, durum veya tarih aralığı deneyebilirsin.</p><button className="button secondary" onClick={clearFilters}>Filtreleri temizle</button></div>}
  </>;
}
