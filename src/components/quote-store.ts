import { createContext } from 'react';
import type { QuoteItem } from '@/lib/catalog';

// Keep the context identity outside the Fast Refresh component boundary.
export const QuoteContext = createContext<{
  items: QuoteItem[];
  add: (id: string) => void;
  setItems: (items: QuoteItem[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialMessage: string;
  setInitialMessage: (message: string) => void;
} | null>(null);