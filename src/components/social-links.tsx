import { Facebook, Instagram } from 'lucide-react';
import { socialLinks } from '@/lib/storefront';

function XGlyph({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}><path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.21 6.93 6.1-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z"/></svg>;
}

export function SocialLinks({ className = '' }: { className?: string }) {
  return <ul className={`social-links ${className}`} aria-label="Réseaux sociaux SESA">{socialLinks.map(link => {
    const Icon = link.name === 'Instagram' ? Instagram : link.name === 'Facebook' ? Facebook : XGlyph;
    return <li key={link.name}>{link.href ? <a className="social-profile" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`SESA sur ${link.name}`} title={link.name}><Icon className="social-icon"/></a> : <span className="social-profile" role="img" aria-label={link.name} title={link.name}><Icon className="social-icon"/></span>}</li>;
  })}</ul>;
}
