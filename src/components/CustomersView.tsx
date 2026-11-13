import { useState } from 'react';
import { ArrowUpRight, Plus, Search, Users } from 'lucide-react';
import type { AppData, Customer } from '../lib/types';
import { displayDate, initials, searchText } from '../lib/format';

export function CustomersView({ data, onOpen, onNew }: { data: AppData; onOpen: (customer: Customer) => void; onNew: () => void }) {
  const [query, setQuery] = useState('');
  const customers = [...data.customers].sort((a, b) => a.name.localeCompare(b.name, 'tr')).filter((customer) => searchText(`${customer.name} ${customer.phone}`).includes(searchText(query)));
  return <>
    <div className="page-heading heading-with-action"><div><h1>Müşteriler</h1><p>Herkesin hikâyesi, kendi sayfasında.</p></div><button className="button secondary" onClick={onNew}><Plus size={18} />Yeni müşteri</button></div>
    <div className="list-toolbar"><label className="search-field"><Search size={19} /><input aria-label="Müşterilerde ara" placeholder="İsim veya telefon ara" value={query} onChange={(event) => setQuery(event.target.value)} /></label><p className="muted">{customers.length} müşteri</p></div>
    <div className="customer-list"><div className="customer-list-labels" aria-hidden="true"><span>Müşteri</span><span>Düğün tarihi</span><span>Provalar</span><span /></div>{customers.map((customer) => {
      const fittings = data.fittings.filter((fitting) => fitting.customerId === customer.id);
      return <button className="customer-row" key={customer.id} onClick={() => onOpen(customer)} aria-label={`${customer.name} müşteri detayını aç`}><span className="customer-identity"><span className="avatar" aria-hidden="true">{initials(customer.name)}</span><span><strong>{customer.name}</strong><small>{customer.phone || 'Telefon eklenmedi'}</small></span></span><span className="customer-wedding">{customer.weddingDate ? displayDate(customer.weddingDate, { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih eklenmedi'}</span><span className="customer-fitting-count">{fittings.length} prova</span><ArrowUpRight size={20} strokeWidth={1.6} /></button>;
    })}</div>
    {!customers.length && <div className="empty-state large"><Users size={38} /><h2>{query ? 'Aradığın müşteri bulunamadı' : 'İlk müşterini ekle'}</h2><p>{query ? 'İsim veya telefon bilgisini kontrol edebilirsin.' : 'Müşteri kaydı oluşturduktan sonra ilk provasını planlayabilirsin.'}</p><button className="button secondary" onClick={query ? () => setQuery('') : onNew}>{query ? 'Aramayı temizle' : 'Yeni müşteri'}</button></div>}
  </>;
}
