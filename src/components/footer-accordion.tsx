import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/** One collapsible footer column: collapsed on first load, toggled by a full-width header button. */
export function FooterAccordionRow({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `footer-panel-${id}`;
  return (
    <div className="footer-accordion-row">
      <h3 className="footer-accordion-heading">
        <button type="button" className="footer-accordion-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>
          <span>{title}</span>
          <ChevronDown aria-hidden="true" className={open ? 'is-open' : undefined} />
        </button>
      </h3>
      <div id={panelId} className="footer-accordion-panel" data-open={open || undefined} inert={!open}>
        <div className="footer-accordion-panel-inner">{children}</div>
      </div>
    </div>
  );
}
