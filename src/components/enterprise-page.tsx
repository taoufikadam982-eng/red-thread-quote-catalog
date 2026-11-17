import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Building2, Users, GraduationCap, HeartPulse, Factory, Landmark, Laptop, Monitor, Mouse, Cpu, HardDrive, Network, Printer, ScanLine, ShieldCheck, FileCheck2, Headphones, SlidersHorizontal, Store, Check, FileText, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { QuoteForm } from './quote-form';
import { useQuote } from './quote-context';
import { Brands } from './sesa-site';
import { formatEnterpriseBrief, type EnterpriseBrief } from '@/lib/enterprise-brief';
import enterpriseScene from '@/assets/sesa-enterprise-scene.jpg';
import workstationScene from '@/assets/sesa-workstation-feature.jpg';

const sectors = [
  { name: 'PME & ETI', icon: Building2, text: 'Des postes adaptés au quotidien de vos équipes.' },
  { name: 'Grands comptes', icon: Users, text: 'Une sélection cohérente pour vos besoins en volume.' },
  { name: 'Éducation', icon: GraduationCap, text: 'Du matériel pour les salles et les équipes pédagogiques.' },
  { name: 'Santé', icon: HeartPulse, text: 'Postes de travail, écrans et solutions d’impression.' },
  { name: 'Industrie', icon: Factory, text: 'Des configurations adaptées à vos applications métier.' },
  { name: 'Secteur public', icon: Landmark, text: 'Devis, bons de commande et accompagnement des marchés.' },
];
const equipment = [
  { name: 'Ordinateurs', icon: Laptop }, { name: 'Écrans', icon: Monitor },
  { name: 'Périphériques', icon: Mouse }, { name: 'Workstations', icon: Cpu },
  { name: 'Stockage', icon: HardDrive }, { name: 'Réseau & serveurs', icon: Network },
  { name: 'Impression', icon: Printer }, { name: 'Scanners', icon: ScanLine },
];
const benefits = [
  { title: 'Présence à Rabat', text: 'Un showroom et une équipe à votre écoute.', icon: Store },
  { title: 'Matériel neuf', text: 'Garantie constructeur, confirmée sur devis.', icon: ShieldCheck },
  { title: 'Devis sous 24h', text: 'Notre objectif pour votre demande officielle.', icon: FileCheck2 },
  { title: 'Accompagnement B2B', text: 'Conseil, bons de commande et marchés.', icon: Headphones },
];

export function EnterprisePage() {
  const { setOpen } = useQuote();
  const briefRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step > 0 && window.matchMedia('(max-width: 767px)').matches) {
      stepHeadingRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [step]);
  const [brief, setBrief] = useState<EnterpriseBrief>({ equipment: [], sector: '', details: '', timing: '', requestType: 'Devis' });
  const startBrief = (sector?: string) => {
    if (sector) setBrief(previous => ({ ...previous, sector }));
    briefRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  };
  const canContinue = step === 0 ? brief.equipment.length > 0 : step === 1 ? brief.details.trim().length >= 5 : true;
  const titles = ['Quels équipements recherchez-vous ?', 'Quel est votre projet ?', 'Comment préparer votre demande ?', 'À qui adresser le devis ?'];
  const asideTitles = ['Commençons par le matériel.', 'Précisons votre besoin.', 'Devis, BC ou marché ?', 'Votre demande est prête.'];
  return <main className="enterprise-page">
    <section className="enterprise-hero" aria-labelledby="enterprise-title">
      <img src={enterpriseScene} alt="Illustration de matériel professionnel : ordinateur portable, tour et équipements de bureau" width={1920} height={960} className="enterprise-hero-image"/>
      <div className="site-width enterprise-hero-copy">
        <p className="enterprise-brand">SESA Informatique</p>
        <p className="eyebrow">VOTRE PARTENAIRE IT · ENTREPRISES & ADMINISTRATIONS</p>
        <h1 id="enterprise-title">Solutions IT pour Entreprises, Administrations & Marchés Publics<span>.</span></h1>
        <p className="enterprise-hero-description">Postes de travail, workstations et solutions d’impression. De la PME aux administrations, un matériel adapté à vos équipes et à vos projets.</p>
        <div className="enterprise-actions"><Button onClick={() => startBrief()}><FileText/>Demander un devis<ArrowRight/></Button><Button asChild variant="dark"><a href="tel:+212537765777"><Phone/>Parler à notre équipe</a></Button></div>
        <div className="enterprise-trust"><span><ShieldCheck/>Garantie constructeur</span><span><FileCheck2/>Devis officiel sous 24h</span><span><Headphones/>Conseil B2B</span><span><Store/>Showroom à Rabat</span></div>
      </div>
    </section>
    <Brands/>
    <section className="site-width b2b-advantages"><h2 className="section-title">Un partenaire pour vos achats professionnels</h2><div>{[{ title: "Réponse aux Appels d’Offres & Consultations", text: "Une réponse structurée à vos références et cahiers des charges.", icon: Landmark }, { title: "Traitement rapide des Bons de Commande", text: "Un suivi de votre BC, des références aux disponibilités.", icon: FileCheck2 }, { title: "Tarifs dégressifs & Proforma sous 24h", text: "Une offre adaptée aux volumes de votre organisation.", icon: Building2 }, { title: "Dossier administratif & Garantie officielle", text: "Documents administratifs complets et garantie constructeur.", icon: ShieldCheck }].map(item => <article key={item.title}><item.icon/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="enterprise-solutions"><div className="site-width">
      <div className="enterprise-section-heading"><h2 className="section-title">Des solutions adaptées à votre activité</h2><Button variant="ghost" onClick={() => startBrief()}>Votre projet<ArrowRight/></Button></div>
      <div className="enterprise-sectors">{sectors.map(sector => <Button key={sector.name} variant="outline" className="enterprise-sector" onClick={() => startBrief(sector.name)}><sector.icon aria-hidden="true"/><h3>{sector.name}</h3><p>{sector.text}</p><ArrowRight className="enterprise-sector-arrow"/></Button>)}</div>
      <div className="enterprise-offerings">
        <article className="enterprise-workstation"><img src={workstationScene} alt="Illustration d’une workstation avec tour et écran, aux couleurs SESA" width={1536} height={640} loading="lazy"/><div><p className="eyebrow">PERFORMANCE & MÉTIERS</p><h2>La puissance pour<br/>vos projets.</h2><p>Workstations, PC et écrans pour la création, la modélisation et vos applications professionnelles.</p><Button asChild><Link to="/catalogue" search={{ category: 'Workstations' }}>Découvrir la sélection<ArrowRight/></Link></Button></div></article>
        <section className="enterprise-services" aria-labelledby="enterprise-services-title"><h2 id="enterprise-services-title" className="section-title">L’accompagnement SESA</h2><ul>{[{ icon: SlidersHorizontal, text: 'Conseil en configuration' }, { icon: FileCheck2, text: 'Devis officiels & bons de commande' }, { icon: Landmark, text: 'Marchés publics & privés' }, { icon: Headphones, text: 'Garantie constructeur & suivi SAV' }].map(service => <li key={service.text}><service.icon/>{service.text}</li>)}</ul><Button variant="ghost" onClick={() => startBrief()}>Parlons de votre besoin<ArrowRight/></Button></section>
      </div>
    </div></section>
    <section ref={briefRef} id="projet-entreprise" className="enterprise-brief"><div className="site-width">
      <div className="enterprise-brief-heading"><div><p className="eyebrow">VOTRE DEMANDE PROFESSIONNELLE</p><h2>Décrivez votre besoin.<br/><span>Construisons votre solution.</span></h2></div><p>Matériel, quantités, références ou cahier des charges : préparons une demande adaptée à votre organisation.</p></div>
      <div className="enterprise-brief-panel">
        <div className="enterprise-brief-main"><div className="enterprise-step-label"><span>ÉTAPE {step + 1} SUR 4</span><strong>{(step + 1) * 25} %</strong></div><progress value={step + 1} max={4} aria-label="Progression de la demande"/><h3 ref={stepHeadingRef} tabIndex={-1}>{titles[step]}</h3>
          {step === 0 && <><div className="enterprise-equipment">{equipment.map(item => { const selected = brief.equipment.includes(item.name); return <Button key={item.name} variant="outline" aria-pressed={selected} className="enterprise-equipment-option" onClick={() => setBrief(previous => ({ ...previous, equipment: selected ? previous.equipment.filter(name => name !== item.name) : [...previous.equipment, item.name] }))}><item.icon/><span>{item.name}</span><span className="enterprise-selection-mark">{selected && <Check/>}</span></Button>; })}</div><p className="enterprise-selected" role="status">{brief.equipment.length ? brief.equipment.join(' · ') : 'Aucun équipement sélectionné'}</p></>}
          {step === 1 && <div className="contact-form space-y-5"><div><label htmlFor="enterprise-sector">Votre secteur</label><select id="enterprise-sector" value={brief.sector} onChange={event => setBrief({ ...brief, sector: event.target.value })}><option value="">À préciser</option>{sectors.map(sector => <option key={sector.name}>{sector.name}</option>)}<option>Autre</option></select></div><div><label htmlFor="enterprise-details">Références, quantités et besoins *</label><textarea id="enterprise-details" rows={5} maxLength={3500} value={brief.details} onChange={event => setBrief({ ...brief, details: event.target.value })} placeholder="Ex. 10 PC portables pour notre équipe, 16 Go de RAM, 2 écrans…"/></div></div>}
          {step === 2 && <div className="contact-form space-y-5"><div><label htmlFor="enterprise-request-type">Type de demande</label><select id="enterprise-request-type" value={brief.requestType} onChange={event => { const value = event.target.value; if (value === 'Devis' || value === 'Bon de commande' || value === 'Marché') setBrief({ ...brief, requestType: value }); }}><option>Devis</option><option>Bon de commande</option><option>Marché</option></select></div><div><label htmlFor="enterprise-timing">Échéance souhaitée</label><input id="enterprise-timing" value={brief.timing} maxLength={150} onChange={event => setBrief({ ...brief, timing: event.target.value })} placeholder="Ex. fin du mois, selon disponibilité…"/></div><p className="text-sm leading-7 text-muted-foreground">Cahiers des charges et pièces complémentaires : <a href="mailto:sesa@menara.ma" className="font-bold text-primary">sesa@menara.ma</a>.</p></div>}
          {step === 3 && <QuoteForm initialMessage={formatEnterpriseBrief(brief)} initialRequestType={brief.requestType}/>}
          <div className="enterprise-step-actions"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(previous => previous - 1)}><ArrowLeft/>Précédent</Button>{step < 3 && <Button disabled={!canContinue} onClick={() => setStep(previous => previous + 1)}>Continuer<ArrowRight/></Button>}</div>
        </div>
        <aside className="enterprise-brief-aside"><div className="enterprise-aside-label"><span>VOTRE PROJET SESA</span><strong>0{step + 1}</strong></div><div className="enterprise-brief-symbol"><FileText/></div><h3>{asideTitles[step]}</h3>{brief.sector && <p className="enterprise-aside-sector">{brief.sector}</p>}<ul>{brief.equipment.map(name => <li key={name}><Check/>{name}</li>)}</ul><p className="enterprise-aside-note">Devis officiel · Aucun paiement en ligne.<br/>La vente et le paiement s’effectuent au showroom de Rabat.</p></aside>
      </div>
    </div></section>
    <section className="site-width b2b-intake"><div><p className="eyebrow">BC · CONSULTATIONS · APPELS D’OFFRES</p><h2 className="section-title">Soumettre un Bon de Commande / Appel d’Offres</h2><p>Transmettez les éléments de votre procédure à l’équipe SESA.</p></div><QuoteForm enterprise/></section>
    <section className="enterprise-benefits"><div className="site-width"><h2>Pourquoi choisir<br/><span>SESA ?</span></h2><ul>{benefits.map(benefit => <li key={benefit.title}><benefit.icon/><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></li>)}</ul></div></section>
    <section className="enterprise-final"><div className="site-width"><Building2/><div><h2>Un projet d’équipement ou un appel d’offres ?</h2><p>Échangeons sur vos besoins et préparons votre demande.</p></div><Button onClick={() => setOpen(true)}><FileText/>Demander un devis<ArrowRight/></Button><Button asChild variant="outline"><a href="mailto:sesa@menara.ma"><Headphones/>Contacter SESA</a></Button></div></section>
  </main>;
}