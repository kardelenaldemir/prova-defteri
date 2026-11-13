import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  kind?: 'modal' | 'drawer';
}

export function Dialog({ title, description, children, onClose, wide, kind = 'modal' }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]') ?? []).filter((element) => element.getClientRects().length > 0);
    const timer = window.setTimeout(() => {
      (ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? focusable()[0] ?? ref.current)?.focus();
    }, 0);
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); ref.current?.focus(); return; }
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [onClose]);
  return <div className={`dialog-backdrop ${kind === 'drawer' ? 'drawer-backdrop' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} className={`dialog ${wide ? 'dialog-wide' : ''} ${kind === 'drawer' ? 'dialog-drawer' : ''}`}>
      <header className="dialog-header"><div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId} className="muted">{description}</p>}</div><button type="button" className="icon-button" aria-label="Pencereyi kapat" onClick={onClose}><X size={22} /></button></header>
      <div className="dialog-content">{children}</div>
    </section>
  </div>;
}
