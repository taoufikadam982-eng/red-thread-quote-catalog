import { z } from 'zod';
import { enterpriseIntakeSchema } from './enterprise-intake';
export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom ou société.').max(150),
  email: z.string().trim().email('Indiquez une adresse email valide.').max(254),
  phone: z.string().trim().min(8, 'Indiquez un téléphone valide.').max(30),
  request_type: z.enum(['Devis', 'Bon de commande', 'Marché', 'Magasin']),
  message: z.string().trim().min(5, 'Précisez votre besoin.').max(5000),
  items: z.array(z.object({ id: z.string().max(60), quantity: z.number().int().min(1).max(1000) })).max(50),
  website: z.string().max(0).optional(),
  enterprise: enterpriseIntakeSchema.optional(),
});