import whatsappIcon from '@/assets/whatsapp-icon.png.asset.json';

export function WhatsAppIcon({ className }: { className?: string }) {
  return <img src={whatsappIcon.url} alt="" aria-hidden="true" className={className ?? 'whatsapp-icon'} />;
}
