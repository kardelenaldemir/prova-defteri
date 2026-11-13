import { useRef, useState } from 'react';
import { Download, FileJson, RotateCcw, Upload } from 'lucide-react';
import type { AppData } from '../lib/types';
import { exportAppData, importAppData } from '../lib/storage';
import { downloadText } from '../lib/format';
import { localDateKey } from '../lib/domain';
import { Dialog } from './Dialog';

export function DataManager({ data, storageError, onClose, onReplace, onReset }: { data: AppData; storageError?: string; onClose: () => void; onReplace: (data: AppData) => boolean; onReset: () => boolean }) {
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<AppData>();
  const [resetConfirm, setResetConfirm] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function onFile(file: File | undefined) {
    setError(''); setNotice('');
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Yedek dosyası 2 MB sınırını aşıyor.'); return; }
    try {
      const imported = importAppData(await file.text());
      if (!imported.ok) { setError(imported.error); return; }
      setPending(imported.data);
    } catch { setError('Dosya okunamadı. Başka bir dosya seçmeyi deneyin.'); }
    finally { if (input.current) input.current.value = ''; }
  }
  return <Dialog title="Veri yönetimi" description="Defterinin bir kopyası hep sende kalsın." onClose={onClose}>
    <p className="data-description">Kayıtlar bu tarayıcıda saklanır. Farklı bir cihazda görünmez. Tarayıcı verilerini silmeden önce bir yedek indir.</p>
    {storageError && <p className="form-error-summary" role="alert">{storageError}</p>}
    {error && <p className="form-error-summary" role="alert">{error}</p>}
    {notice && <p className="notice" role="status">{notice}</p>}
    {pending ? <section className="import-confirm"><FileJson size={28} /><h3>Yedek geri yüklensin mi?</h3><p>Dosyada {pending.customers.length} müşteri ve {pending.fittings.length} prova var. Mevcut defterin bu kayıtlarla değişecek.</p><div className="form-actions"><button className="button secondary" onClick={() => setPending(undefined)}>Vazgeç</button><button className="button primary" onClick={() => { if (onReplace(pending)) { setPending(undefined); setNotice('Yedek geri yüklendi.'); } }}>Yedeği geri yükle</button></div></section> : <>
      <div className="data-action"><div><h3>Yedek indir</h3><p>{data.customers.length} müşteri ve {data.fittings.length} prova, tek JSON dosyasında.</p></div><button className="button secondary" onClick={() => { try { downloadText(exportAppData(data), `prova-defteri-${localDateKey()}.json`); setNotice('Yedek dosyası indirildi.'); } catch { setError('Yedek oluşturulamadı.'); } }}><Download size={18} />İndir</button></div>
      <div className="data-action"><div><h3>Yedeği geri yükle</h3><p>Önceden indirdiğin Prova Defteri dosyasını seç.</p></div><button className="button secondary" onClick={() => input.current?.click()}><Upload size={18} />Dosya seç</button><input ref={input} type="file" accept="application/json,.json" aria-label="Yedek dosyası" className="visually-hidden" onChange={(event) => void onFile(event.target.files?.[0])} /></div>
      <div className="data-action reset-action"><div><h3>Örnek deftere dön</h3><p>Mevcut kayıtlar yerine ilk açılıştaki kurgu kayıtlar yüklenir.</p></div><button className="button ghost danger" onClick={() => setResetConfirm(true)}><RotateCcw size={18} />Sıfırla</button></div>
      {resetConfirm && <div className="reset-confirm"><p>Mevcut kayıtların değişecek. İhtiyacın varsa önce yedek indir.</p><div className="form-actions"><button className="button secondary" onClick={() => setResetConfirm(false)}>Vazgeç</button><button className="button danger" onClick={() => { if (onReset()) { setResetConfirm(false); setNotice('Örnek defter yüklendi.'); } }}>Örnek verileri yükle</button></div></div>}
    </>}
  </Dialog>;
}
