import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AdminDeleteProduct } from '@/components/admin-delete-product';

const { remove } = vi.hoisted(() => ({ remove: vi.fn() }));
vi.mock('@tanstack/react-start', () => ({ useServerFn: () => remove }));
vi.mock('@/lib/admin.functions', () => ({ deleteProduct: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const product = { id: 'delete-test', name: 'Produit temporaire', reference: 'DELETE-TEST' };
beforeEach(() => { remove.mockReset(); });
afterEach(cleanup);
it('requires confirmation and cancellation never deletes a product', () => {
  render(<AdminDeleteProduct product={product} disabled={false} onBusy={vi.fn()} onDeleted={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button', { name: 'Supprimer DELETE-TEST' }));
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));
  expect(remove).not.toHaveBeenCalled();
});
it('deletes only the confirmed product and prevents duplicate submissions', async () => {
  let resolve: ((value: { id: string }) => void) | undefined;
  remove.mockImplementation(() => new Promise(done => { resolve = done; }));
  const onDeleted = vi.fn().mockResolvedValue(undefined);
  render(<AdminDeleteProduct product={product} disabled={false} onBusy={vi.fn()} onDeleted={onDeleted}/>);
  fireEvent.click(screen.getByRole('button', { name: 'Supprimer DELETE-TEST' }));
  fireEvent.click(screen.getByRole('button', { name: 'Supprimer le produit' }));
  fireEvent.click(screen.getByRole('button', { name: 'Suppression…' }));
  expect(remove).toHaveBeenCalledExactlyOnceWith({ data: 'delete-test' });
  resolve?.({ id: product.id });
  await waitFor(() => expect(onDeleted).toHaveBeenCalledExactlyOnceWith('delete-test'));
});
it('does not remove a row when the server rejects deletion', async () => {
  remove.mockRejectedValue(new Error('Accès réservé aux administrateurs.'));
  const onDeleted = vi.fn();
  render(<AdminDeleteProduct product={product} disabled={false} onBusy={vi.fn()} onDeleted={onDeleted}/>);
  fireEvent.click(screen.getByRole('button', { name: 'Supprimer DELETE-TEST' }));
  fireEvent.click(screen.getByRole('button', { name: 'Supprimer le produit' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Supprimer le produit' })).toBeEnabled());
  expect(onDeleted).not.toHaveBeenCalled();
});