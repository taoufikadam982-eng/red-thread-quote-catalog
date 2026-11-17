import { z } from 'zod';

// A login default is not authorization; server middleware and RLS own access.
export const adminLoginEmail = 'taoufik@sesa.ma';
export const adminInvitationEmailSchema = z.string().trim().email().max(254)
  .refine(email => email.toLowerCase() !== 'sesa@menara.ma', {
    message: 'Cette adresse est réservée au contact commercial, sans accès administrateur.',
  });