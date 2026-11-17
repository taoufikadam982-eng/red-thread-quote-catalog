import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

afterEach(cleanup);

it('renders Slot-based controls and opens the quote sheet without a hook dispatcher error', () => {
  render(<><Toaster/><Sheet><SheetTrigger asChild><Button>Ma liste de devis</Button></SheetTrigger><SheetContent><SheetTitle>Demande de devis</SheetTitle><SheetDescription>Votre sélection</SheetDescription><Button asChild><a href="/catalogue">Catalogue</a></Button></SheetContent></Sheet></>);
  fireEvent.click(screen.getByRole('button', { name: 'Ma liste de devis' }));
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Catalogue' })).toHaveAttribute('href', '/catalogue');
});

it('opens and dismisses the catalogue popover beside other shared React consumers', () => {
  render(<><Toaster/><Sheet><SheetTrigger asChild><Button>Devis</Button></SheetTrigger><SheetContent><SheetTitle>Devis SESA</SheetTitle><SheetDescription>Votre demande</SheetDescription></SheetContent></Sheet><Popover><PopoverTrigger asChild><Button>Catalogue</Button></PopoverTrigger><PopoverContent aria-label="Catégories du catalogue"><Button asChild><a href="/boutique?brand=Dell">Dell</a></Button></PopoverContent></Popover></>);
  fireEvent.click(screen.getByRole('button', { name: 'Catalogue' }));
  expect(screen.getByRole('dialog', { name: 'Catégories du catalogue' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Dell' })).toHaveAttribute('href', '/boutique?brand=Dell');
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});