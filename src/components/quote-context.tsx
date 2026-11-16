import { createContext, useContext, useState, type ReactNode } from 'react';
import { addQuoteItem, type QuoteItem } from '@/lib/catalog';
const QuoteContext = createContext<{ items: QuoteItem[]; add: (id: string) => void; setItems: (items: QuoteItem[]) => void; open: boolean; setOpen: (open: boolean) => void } | null>(null);
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [open, setOpen] = useState(false);
  return <QuoteContext.Provider value={{ items, setItems, open, setOpen, add: id => { setItems(previous => addQuoteItem(previous, id)); setOpen(true); } }}>{children}</QuoteContext.Provider>;
}
export function useQuote() { const context = useContext(QuoteContext); if (!context) throw new Error('QuoteProvider required'); return context; }