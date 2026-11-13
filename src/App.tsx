import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, Check, Database, Home, Plus, Scissors, Users } from 'lucide-react';
import type { AppData, Customer, Fitting, FittingStatus, LoadResult } from './lib/types';
import { createSeedData } from './lib/data';
import { localDateKey, sortFittings, validateCustomer, validateFitting } from './lib/domain';
import { readAppData, replaceAppData, resetAppData, writeAppData } from './lib/storage';
import { displayDate, downloadText } from './lib/format';
import { Overview } from './components/Overview';
import { FittingsView } from './components/FittingsView';
import { CustomersView } from './components/CustomersView';
import { FittingForm } from './components/FittingForm';
import { CustomerForm } from './components/CustomerForm';
import { FittingDetail } from './components/FittingDetail';
import { CustomerDetail } from './components/CustomerDetail';
import { DataManager } from './components/DataManager';
import { Dialog } from './components/Dialog';

type View = 'overview' | 'fittings' | 'customers';
type Modal = { kind: 'fitting-form'; initial?: Fitting; customerId?: string }
  | { kind: 'fitting'; id: string }
  | { kind: 'customer-form'; initial?: Customer }
  | { kind: 'customer'; id: string }
  | { kind: 'data' }
  | { kind: 'confirm'; entity: 'fitting' | 'customer'; id: string }
  | null;

export default function App({ initial }: { initial: LoadResult }) {
  const [data, setData] = useState<AppData>(() => initial.ok ? initial.data : createSeedData());
  const [storageError, setStorageError] = useState(initial.ok ? '' : initial.error);
  const [view, setView] = useState<View>('overview');
  const [modal, setModal] = useState<Modal>(null);
  const [today, setToday] = useState(localDateKey());
  const [noteId, setNoteId] = useState<string>();
  const [toast, setToast] = useState<{ text: string; error?: boolean }>();
  const close = useCallback(() => setModal(null), []);

  useEffect(() => { const timer = setInterval(() => setToday(localDateKey()), 60_000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(undefined), 5000); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    function onExternalChange(event: StorageEvent) {
      if (event.key !== 'prova-defteri:v1') return;
      const result = readAppData();
      if (result.ok) { setData(result.data); setStorageError(''); setToast({ text: 'Diğer sekmedeki değişiklikler yüklendi.' }); }
      else setStorageError(result.error);
    }
    window.addEventListener('storage', onExternalChange);
    return () => window.removeEventListener('storage', onExternalChange);
  }, []);

  function save(next: AppData, message: string, replace = false) {
    const result = replace ? replaceAppData(next) : writeAppData(next);
    if (!result.ok) { setStorageError(result.error); setToast({ text: result.error, error: true }); return false; }
    setData(next); setStorageError(''); setToast({ text: message }); return true;
  }
  function saveCustomer(customer: Customer) {
    const checked = validateCustomer(customer);
    if (!checked.valid) { setToast({ text: Object.values(checked.errors)[0], error: true }); return; }
    const exists = data.customers.some((item) => item.id === customer.id);
    const next = { ...data, customers: exists ? data.customers.map((item) => item.id === customer.id ? customer : item) : [...data.customers, customer] };
    if (save(next, exists ? 'Müşteri bilgileri güncellendi.' : 'Yeni müşteri deftere eklendi.')) close();
  }
  function saveFitting(fitting: Fitting) {
    const checked = validateFitting(fitting, data.customers, data.fittings);
    if (!checked.valid) { setToast({ text: Object.values(checked.errors)[0], error: true }); return; }
    const exists = data.fittings.some((item) => item.id === fitting.id);
    const next = { ...data, fittings: exists ? data.fittings.map((item) => item.id === fitting.id ? fitting : item) : [...data.fittings, fitting] };
    if (save(next, exists ? 'Prova bilgileri güncellendi.' : 'Yeni prova deftere eklendi.')) { setNoteId(fitting.id); close(); }
  }
  function openFitting(fitting: Fitting) { setNoteId(fitting.id); setModal({ kind: 'fitting', id: fitting.id }); }
  function toggleAdjustment(fittingId: string, adjustmentId: string) {
    const next = { ...data, fittings: data.fittings.map((fitting) => fitting.id === fittingId ? { ...fitting, adjustments: fitting.adjustments.map((adjustment) => adjustment.id === adjustmentId ? { ...adjustment, done: !adjustment.done } : adjustment) } : fitting) };
    save(next, 'Düzeltme listesi kaydedildi.');
  }
  function changeStatus(fitting: Fitting, status: FittingStatus) {
    const nextFitting = { ...fitting, status };
    const checked = validateFitting(nextFitting, data.customers, data.fittings);
    if (!checked.valid) { setToast({ text: Object.values(checked.errors)[0], error: true }); return; }
    save({ ...data, fittings: data.fittings.map((item) => item.id === fitting.id ? nextFitting : item) }, 'Prova durumu güncellendi.');
  }
  function deleteFitting(fitting: Fitting) {
    setModal({ kind: 'confirm', entity: 'fitting', id: fitting.id });
  }
  function deleteCustomer(customer: Customer) {
    setModal({ kind: 'confirm', entity: 'customer', id: customer.id });
  }
  function confirmDelete() {
    if (modal?.kind !== 'confirm') return;
    if (modal.entity === 'fitting') {
      if (!data.fittings.some((item) => item.id === modal.id)) {
        setToast({ text: 'Bu prova artık defterde bulunmuyor.', error: true });
        return;
      }
      if (save({ ...data, fittings: data.fittings.filter((item) => item.id !== modal.id) }, 'Prova silindi.')) close();
      return;
    }
    if (!data.customers.some((item) => item.id === modal.id)) {
      setToast({ text: 'Bu müşteri artık defterde bulunmuyor.', error: true });
      return;
    }
    if (save({ ...data, customers: data.customers.filter((item) => item.id !== modal.id), fittings: data.fittings.filter((item) => item.customerId !== modal.id) }, 'Müşteri kaydı silindi.')) close();
  }

  const fitting = modal?.kind === 'fitting' ? data.fittings.find((item) => item.id === modal.id) : undefined;
  const fittingCustomer = fitting && data.customers.find((item) => item.id === fitting.customerId);
  const customer = modal?.kind === 'customer' ? data.customers.find((item) => item.id === modal.id) : undefined;
  const deleteTargetFitting = modal?.kind === 'confirm' && modal.entity === 'fitting' ? data.fittings.find((item) => item.id === modal.id) : undefined;
  const deleteTargetCustomer = modal?.kind === 'confirm' && modal.entity === 'customer' ? data.customers.find((item) => item.id === modal.id) : undefined;
  const deleteCustomerFittingCount = deleteTargetCustomer ? data.fittings.filter((item) => item.customerId === deleteTargetCustomer.id).length : 0;
  const deleteTargetExists = Boolean(deleteTargetFitting || deleteTargetCustomer);
  const deleteDescription = deleteTargetFitting
    ? `${displayDate(deleteTargetFitting.date)} günü ${deleteTargetFitting.time} saatindeki prova ve düzeltme notları silinecek.`
    : deleteTargetCustomer
      ? `${deleteTargetCustomer.name} defterden silinecek.${deleteCustomerFittingCount ? ` Müşteriye bağlı ${deleteCustomerFittingCount} prova ve düzeltme notları da silinecek.` : ''} Dilersen önce Veri yönetimi bölümünden yedek indirebilirsin.`
      : `Bu ${modal?.kind === 'confirm' && modal.entity === 'customer' ? 'müşteri' : 'prova'} artık defterde bulunmuyor. Başka bir sekmede silinmiş olabilir.`;
  const navigation = [{ id: 'overview' as const, label: 'Genel bakış', icon: Home }, { id: 'fittings' as const, label: 'Provalar', icon: CalendarDays }, { id: 'customers' as const, label: 'Müşteriler', icon: Users }];
  const accessibleDate = `${displayDate(today, { day: 'numeric', month: 'long', year: 'numeric' })}, ${displayDate(today, { weekday: 'long' })}`;

  return <div className="app-shell">
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <aside className="sidebar"><button className="brand" onClick={() => setView('overview')} aria-label="Prova Defteri, genel bakış"><Scissors size={37} strokeWidth={1.25} /><span>Prova Defteri</span></button><nav aria-label="Ana menü">{navigation.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}><Icon size={23} strokeWidth={1.6} /><span>{label}</span></button>)}</nav><div className="sidebar-bottom"><button className="nav-item" onClick={() => setModal({ kind: 'data' })}><Database size={23} strokeWidth={1.6} /><span>Veri yönetimi</span></button><p>Kayıtlar bu tarayıcıda saklanır</p></div></aside>
    <main id="main" className="main-content" tabIndex={-1}>
      <header className="topbar"><p>{accessibleDate}</p><button className="button primary new-fitting" onClick={() => setModal({ kind: 'fitting-form' })}><Plus size={21} strokeWidth={1.6} /><span>Yeni prova</span></button></header>
      {storageError && <div className="storage-warning" role="alert"><AlertCircle size={21} /><div><strong>Kayıtlar kontrol edilmeli</strong><p>{storageError}</p>{!initial.ok && initial.raw && <button className="text-link" onClick={() => downloadText(initial.raw!, 'prova-defteri-okunamayan-kayit.txt', 'text/plain')}>Mevcut ham kaydı indir</button>}</div><button className="button secondary" onClick={() => setModal({ kind: 'data' })}>Veri yönetimi</button></div>}
      {view === 'overview' && <Overview data={data} today={today} noteId={noteId} onOpen={openFitting} onToggle={toggleAdjustment} onShowFittings={() => setView('fittings')} />}
      {view === 'fittings' && <FittingsView data={data} today={today} onOpen={openFitting} />}
      {view === 'customers' && <CustomersView data={data} onOpen={(item) => setModal({ kind: 'customer', id: item.id })} onNew={() => setModal({ kind: 'customer-form' })} />}
    </main>
    {modal?.kind === 'fitting-form' && <FittingForm key={modal.initial?.id ?? modal.customerId ?? 'new-fitting'} data={data} initial={modal.initial} initialCustomerId={modal.customerId} onSave={saveFitting} onClose={close} />}
    {modal?.kind === 'customer-form' && <CustomerForm key={modal.initial?.id ?? 'new-customer'} initial={modal.initial} onSave={saveCustomer} onClose={close} />}
    {fitting && fittingCustomer && <FittingDetail fitting={fitting} customer={fittingCustomer} onClose={close} onEdit={() => setModal({ kind: 'fitting-form', initial: fitting })} onDelete={() => deleteFitting(fitting)} onToggleAdjustment={(id) => toggleAdjustment(fitting.id, id)} onStatusChange={(status) => changeStatus(fitting, status)} />}
    {customer && <CustomerDetail customer={customer} data={data} onClose={close} onEdit={() => setModal({ kind: 'customer-form', initial: customer })} onDelete={() => deleteCustomer(customer)} onNewFitting={() => setModal({ kind: 'fitting-form', customerId: customer.id })} onOpenFitting={openFitting} />}
    {modal?.kind === 'data' && <DataManager data={data} storageError={storageError} onClose={close} onReplace={(next) => save(next, 'Yedek geri yüklendi.', true)} onReset={() => { const result = resetAppData(); if (result.ok) { setData(result.data); setStorageError(''); setNoteId(sortFittings(result.data.fittings)[0]?.id); setToast({ text: 'Örnek defter yüklendi.' }); return true; } setToast({ text: result.error, error: true }); return false; }} />}
    {modal?.kind === 'confirm' && <Dialog title={modal.entity === 'customer' ? 'Müşteri silinsin mi?' : 'Prova silinsin mi?'} onClose={close}><p className="confirmation-copy" role={deleteTargetExists ? undefined : 'status'}>{deleteDescription}</p><div className="form-actions"><button className="button secondary" onClick={close}>Vazgeç</button><button className="button danger" onClick={confirmDelete} disabled={!deleteTargetExists}>Sil</button></div></Dialog>}
    {toast && <div className={`toast ${toast.error ? 'toast-error' : ''}`} role={toast.error ? 'alert' : 'status'}>{toast.error ? <AlertCircle size={18} /> : <Check size={18} />}<span>{toast.text}</span></div>}
  </div>;
}
