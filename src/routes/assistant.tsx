import { createFileRoute } from '@tanstack/react-router';
import { SesaAssistant } from '@/components/sesa-assistant';
import { pageHead } from '@/lib/page-head';
export const Route = createFileRoute('/assistant')({ component: SesaAssistant, head: () => pageHead('Conseiller SESA · Questions et avis clients', 'Posez vos questions sur les services SESA et les avis publiés. Une conversation privée enregistrée dans votre compte, avec des réponses fondées sur les informations du site.') });