import { z } from 'zod';

export const enterpriseIntakeSchema = z.object({
  ice: z.string().trim().regex(/^\d{15}$/, 'L’ICE doit contenir 15 chiffres.'),
  contact: z.string().trim().min(2, 'Indiquez le nom et la fonction du contact.').max(150),
  procedure: z.enum(['Bon de commande', 'Consultation', 'Appel d’offres', 'Devis volume']),
});
export function enterpriseRequestType(procedure: z.infer<typeof enterpriseIntakeSchema>['procedure']) {
  return procedure === 'Bon de commande' ? 'Bon de commande' : procedure === 'Devis volume' ? 'Devis' : 'Marché';
}
export function enterpriseIntakeMessage(message: string, intake?: z.infer<typeof enterpriseIntakeSchema>) {
  return intake ? `ICE : ${intake.ice}\nContact / Fonction : ${intake.contact}\nProcédure : ${intake.procedure}\n\n${message}` : message;
}