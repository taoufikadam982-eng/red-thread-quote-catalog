import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';

afterEach(cleanup);

it('renders Slot-based controls and opens the quote sheet without a hook dispatcher error', () => {
  render(<><Toaster/><Sheet><SheetTrigger asChild><Button>Ma liste de devis</Button></SheetTrigger><SheetContent><SheetTitle>Demande de devis</SheetTitle><SheetDescription>Votre sélection</SheetDescription><Button asChild><a href="/catalogue">Catalogue</a></Button></SheetContent></Sheet></>);
  fireEvent.click(screen.getByRole('button', { name: 'Ma liste de devis' }));
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Catalogue' })).toHaveAttribute('href', '/catalogue');
});