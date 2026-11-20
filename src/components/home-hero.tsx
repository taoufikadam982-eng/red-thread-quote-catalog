import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Pause, Play, FileCheck2 } from 'lucide-react';
import { Button } from './ui/button';
import { useQuote } from './quote-context';
import enterprise from '@/assets/sesa-enterprise-scene.jpg';
import creation from '@/assets/sesa-creation-scene.jpg';
import infrastructure from '@/assets/sesa-infrastructure-scene.jpg';
import mobileEnterprise from '@/assets/sesa-mobile-enterprise.jpg.asset.json';
import mobileCreation from '@/assets/sesa-mobile-creation.jpg.asset.json';
import mobileInfrastructure from '@/assets/sesa-mobile-infrastructure.jpg.asset.json';

const slides = [
  { image: enterprise, mobileImage: mobileEnterprise.url, alt: 'Illustration : portable, tour et casque dans un bureau à Rabat', label: 'ÉQUIPEMENT · ENTREPRISE', title: 'Le bon matériel.\nPour toute votre équipe.', description: 'Portables, ordinateurs de bureau et accessoires : une sélection professionnelle pour vos journées de travail.', action: 'Découvrir le catalogue', category: '' },
  { image: creation, mobileImage: mobileCreation.url, alt: 'Illustration : workstation et deux écrans de conception architecturale', label: 'CRÉATION · INGÉNIERIE', title: 'Vos idées méritent\nune grande puissance.', description: 'Workstations et écrans professionnels pour vos projets de conception, de création et d’ingénierie.', action: 'Explorer les workstations', category: 'Workstations' },
  { image: infrastructure, mobileImage: mobileInfrastructure.url, alt: 'Illustration : baie serveur, réseau et ordinateur portable', label: 'RÉSEAU · SERVEURS', title: 'Une base solide.\nPour vos projets IT.', description: 'Serveurs, réseau et stockage : préparons ensemble l’équipement adapté aux besoins de votre organisation.', action: 'Découvrir les solutions B2B', category: null },
];

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { setOpen } = useQuote();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (paused || interacting || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, interacting, reducedMotion, active]);
  const select = (index: number) => setActive((index + slides.length) % slides.length);
  return <section className="sesa-hero" aria-label="Sélections SESA Informatique" aria-roledescription="carrousel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    {slides.map((slide, index) => <div key={slide.label} className={`sesa-hero-slide ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index} inert={active !== index} role="group" aria-roledescription="diapositive" aria-label={`${index + 1} sur 3`}>
      <img src={slide.image} alt={slide.alt} width={1920} height={960} className="sesa-hero-image hidden md:block" fetchPriority={index === 0 ? 'high' : 'auto'}/>
      <img src={slide.mobileImage} alt={slide.alt} width={768} height={1376} className="sesa-hero-image sesa-hero-mobile-image md:hidden" fetchPriority={index === 0 ? 'high' : 'auto'}/>
      <div className="site-width sesa-hero-content"><p className="sesa-hero-brand">SESA Informatique</p><p className="eyebrow">{slide.label}</p><h1>{slide.title}</h1><p className="sesa-hero-description">{slide.description}</p><div className="sesa-hero-actions"><Button asChild>{slide.category === null ? <Link to="/solutions">{slide.action}<ArrowRight/></Link> : slide.category === '' ? <Link to="/boutique">{slide.action}<ArrowRight/></Link> : <Link to="/catalogue" search={{ category: slide.category }}>{slide.action}<ArrowRight/></Link>}</Button><Button variant="nav" onClick={() => setOpen(true)}><FileCheck2/>Demander un devis</Button></div></div>
    </div>)}
    <div className="sesa-hero-controls"><Button variant="nav" size="icon" aria-label="Image précédente" title="Image précédente" onClick={() => select(active - 1)}><ArrowLeft/></Button><div className="sesa-hero-dots">{slides.map((slide, index) => <Button key={slide.label} variant="nav" size="icon" className="sesa-hero-dot" aria-label={`Afficher l’image ${index + 1}`} aria-pressed={active === index} onClick={() => select(index)}><span/></Button>)}</div><Button variant="nav" size="icon" aria-label="Image suivante" title="Image suivante" onClick={() => select(active + 1)}><ArrowRight/></Button><Button variant="nav" size="icon" aria-label={paused || reducedMotion ? 'Démarrer le défilement' : 'Mettre le défilement en pause'} title={paused || reducedMotion ? 'Démarrer le défilement' : 'Mettre le défilement en pause'} onClick={() => { setPaused(!(paused || reducedMotion)); setReducedMotion(false); }}>{paused || reducedMotion ? <Play/> : <Pause/>}</Button></div>
  </section>;
}