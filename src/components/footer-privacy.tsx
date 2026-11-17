import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { needsAnswer, onConsentChange, readChoice } from '@/lib/consent';
import { privacyAnswered, savePrivacyChoice } from '@/lib/privacy-preferences';
import { store } from '@/lib/storefront';

const legalText = {
  'Mentions légales': ['Éditeur : SESA Informatique. RC Rabat · Patente 25125060.', `Showroom : ${store.address}. Contact : ${store.email}. Téléphones : ${store.phones.join(' / ')}.`],
  CGV: ['Le site permet de demander un devis ; aucune commande ni aucun paiement ne sont effectués en ligne.', 'Les prix sont présentés en dirhams TTC. Les configurations, disponibilités, garanties et conditions commerciales sont confirmées dans le devis. La vente et le paiement ont lieu au showroom.'],
  Retours: ['Pour une demande de retour ou de service après-vente, contactez SESA avec la référence, le numéro de série et le justificatif d’achat.', 'La prise en charge et les conditions applicables sont confirmées après examen de votre demande. Aucune durée ni condition de remboursement supplémentaire n’est annoncée sur ce site.'],
  Confidentialité: ['Vos coordonnées servent à répondre à vos demandes. Les devis et inscriptions à la newsletter sont accessibles uniquement aux administrateurs autorisés.', 'Nous comptons les visites sans cookies et sans identifier les visiteurs. Les données de navigation comprennent les pages visitées, le temps passé, les performances et les erreurs. Votre choix est transmis aux outils de mesure.', `Pour exercer vos droits ou vous désinscrire de la newsletter, écrivez à ${store.email}. Google Maps et WhatsApp sont des services externes avec leurs propres politiques.`],
  Cookies: ['Votre préférence est conservée dans votre navigateur. Vous pouvez la modifier à tout moment avec « Gérer les cookies ».', 'La mesure des visites utilise aucun cookie. Les visites, le temps passé, les performances et les erreurs continuent à être comptés sans identifier les visiteurs. Le refus limite les mesures facultatives.', 'Les données nécessaires à la connexion administrateur restent distinctes. Aucun historique de produits consultés ni système de favoris persistant n’est actuellement enregistré par la boutique.'],
};
type LegalTopic = keyof typeof legalText;

export function FooterPrivacy() {
  const [topic, setTopic] = useState<LegalTopic | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const [gpc, setGpc] = useState(false);
  useEffect(() => {
    let live = true;
    setGpc((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
    void needsAnswer(['analytics']).then(required => { if (live) setVisible(required || !privacyAnswered()); });
    const unsubscribe = onConsentChange(() => { setAnalytics(readChoice('analytics') === 'granted'); if (privacyAnswered()) setVisible(false); });
    return () => { live = false; unsubscribe(); };
  }, []);
  useEffect(() => { if (visible) panel.current?.focus({ preventScroll: true }); }, [visible]);
  const open = () => { setAnalytics(readChoice('analytics') === 'granted'); setSettings(false); setClosing(false); setVisible(true); };
  const save = (accepted: boolean) => {
    setClosing(true);
    window.setTimeout(() => { savePrivacyChoice(accepted && !gpc ? 'granted' : 'denied'); setVisible(false); setClosing(false); }, 180);
  };
  return <>
    <div className="footer-bottom"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 footer-bottom-inner"><p>© 2026 SESA Informatique · Prix en dirhams TTC</p><nav aria-label="Informations légales">{(Object.keys(legalText) as LegalTopic[]).map(label => <Button variant="nav" key={label} onClick={() => setTopic(label)}>{label}</Button>)}<Button variant="nav" className="cookie-manage" onClick={open}>Gérer les cookies</Button></nav></div></div>
    {visible && <section ref={panel} tabIndex={-1} className={`privacy-panel ${closing ? 'is-closing' : ''}`} aria-label="Préférences de confidentialité"><div className="privacy-copy"><p><strong>Pas de publicité sur ce site.</strong> Nous comptons les visites sans cookies.</p><p>Votre choix concerne les mesures facultatives de navigation. <Button variant="link" onClick={() => setTopic('Confidentialité')}>En savoir plus</Button></p>{settings && <div className="privacy-settings"><p><strong>Nécessaires</strong> — toujours actifs pour le fonctionnement du site.</p>{gpc && <p>Le signal de confidentialité de votre navigateur s’applique.</p>}<label><input type="checkbox" role="switch" checked={analytics && !gpc} disabled={gpc} onChange={e => setAnalytics(e.target.checked)}/>Mesure d’audience, fournie par Lovable</label><Button variant="outline" onClick={() => save(analytics)}>Enregistrer mes préférences</Button></div>}</div><div className="privacy-actions"><div><Button variant="outline" onClick={() => save(false)}>Refuser</Button><Button variant="outline" disabled={gpc} onClick={() => save(true)}>Accepter</Button></div><Button variant="link" onClick={() => { setAnalytics(readChoice('analytics') === 'granted'); setSettings(!settings); }}>Paramètres des cookies</Button></div></section>}
    <Dialog open={topic !== null} onOpenChange={open => { if (!open) setTopic(null); }}><DialogContent className="legal-info-modal"><DialogTitle>{topic} · SESA Informatique</DialogTitle><DialogDescription>RC Rabat · Patente 25125060<br/>Boulevard Al Alaouiyine 30, Hassan, Rabat</DialogDescription><div className="legal-info-copy">{topic && legalText[topic].map(text => <p key={text}>{text}</p>)}</div>{topic === 'Cookies' && <Button variant="outline" onClick={() => { setTopic(null); open(); }}>Gérer les cookies</Button>}</DialogContent></Dialog>
  </>;
}