import { useContext, useState, type ReactNode } from 'react';
import { addQuoteItem, type QuoteItem } from '@/lib/catalog';
import { useProducts } from './catalog-context';
import { QuoteContext } from './quote-store';
export function QuoteProvider({ children }: { children: ReactNode }) {
  const products = useProducts();
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [open, setOpen] = useState(false);
  return <QuoteContext.Provider value={{ items, setItems, open, setOpen, add: id => { setItems(previous => addQuoteItem(previous, id, products)); setOpen(true); } }}>{children}</QuoteContext.Provider>;
}
export function useQuote() { const context = useContext(QuoteContext); if (!context) throw new Error('QuoteProvider required'); return context; }