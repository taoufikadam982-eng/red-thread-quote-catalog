import { createFileRoute } from '@tanstack/react-router';
import { handleAssistant } from '@/lib/assistant/chat.server';
export const Route = createFileRoute('/api/public/assistant')({ server: { handlers: { GET: ({ request }) => handleAssistant(request), POST: ({ request }) => handleAssistant(request) } } });