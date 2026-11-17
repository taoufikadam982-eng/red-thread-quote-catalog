import { expect, it } from 'vitest';
import { enterpriseIntakeMessage, enterpriseIntakeSchema, enterpriseRequestType } from '@/lib/enterprise-intake';
import { quoteSchema } from '@/lib/quote-schema';

it('requires a 15-digit ICE and a contact for enterprise requests', () => {
  expect(enterpriseIntakeSchema.safeParse({ ice: '123456789012345', contact: 'Amina, responsable achats', procedure: 'Bon de commande' }).success).toBe(true);
  expect(enterpriseIntakeSchema.safeParse({ ice: '1234', contact: 'Amina', procedure: 'Bon de commande' }).success).toBe(false);
  expect(enterpriseIntakeSchema.safeParse({ ice: '123456789012345', contact: '', procedure: 'Bon de commande' }).success).toBe(false);
});
it('maps the four requested procedures into the existing inbox types', () => {
  expect(enterpriseRequestType('Bon de commande')).toBe('Bon de commande');
  expect(enterpriseRequestType('Consultation')).toBe('Marché');
  expect(enterpriseRequestType('Appel d’offres')).toBe('Marché');
  expect(enterpriseRequestType('Devis volume')).toBe('Devis');
});
it('preserves ICE, contact and procedure with the references in the saved message', () => {
  expect(enterpriseIntakeMessage('10 PC HP', { ice: '123456789012345', contact: 'Amina, achats', procedure: 'Consultation' })).toBe('ICE : 123456789012345\nContact / Fonction : Amina, achats\nProcédure : Consultation\n\n10 PC HP');
});
it('validates enterprise details on the shared quote schema without changing ordinary intake', () => {
  const data = { name: 'Organisme', email: 'test@example.com', phone: '0537765777', request_type: 'Marché', message: '10 PC HP', items: [] };
  expect(quoteSchema.safeParse(data).success).toBe(true);
  expect(quoteSchema.safeParse({ ...data, enterprise: { ice: '<script>', contact: 'Amina', procedure: 'Consultation' } }).success).toBe(false);
});