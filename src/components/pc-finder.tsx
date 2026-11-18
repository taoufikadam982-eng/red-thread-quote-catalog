import { BriefcaseBusiness, GraduationCap, Palette, Code2, Users, Laptop, Gamepad2, RefreshCw, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Button } from './ui/button';
import { recommendProducts, priceLabel } from '@/lib/catalog';
import { useQuote } from './quote-context';
import { useProducts } from './catalog-context';
import { getFinderDiagnostic } from '@/lib/finder-diagnostic';
import { useFinderFlow } from '@/hooks/use-finder-flow';
const diagnosticMessages = {
  initial: 'Décrivez votre usage. Nos experts ciblent le bon matériel.',
  productivity: 'Profil identifié : productivité & gestion quotidienne.',
  performance: 'Besoin haute performance : puissance de calcul et stabilité requises.',
  enterprise: 'Déploiement entreprise : sélection calibrée pour votre parc informatique.',
};
const questions = [
  { title: 'Qu’aimeriez-vous faire confortablement ?', options: ['Travailler et gérer mon activité', 'Étudier et faire des recherches', 'Créer des visuels ou des vidéos', 'Développer et utiliser des outils techniques', 'Jouer', 'Travailler en déplacement', 'Équiper plusieurs collaborateurs', 'Remplacer un ordinateur devenu trop lent'] },
  { title: 'Où travaillerez-vous le plus souvent ?', options: ['Au bureau', 'En déplacement', 'À la maison', 'Un peu partout'] },
  { title: 'Quel format vous convient ?', options: ['Un ordinateur portable', 'Un ordinateur de bureau', 'Une workstation', 'Je suis ouvert aux suggestions'] },
  { title: 'Quelles applications utilisez-vous ?', options: ['Office, email et navigateur', 'Création et montage vidéo', 'Développement et outils techniques', 'Applications 3D exigeantes'] },
  { title: 'Combien de personnes faut-il équiper ?', options: ['Une personne', '2 à 5 collaborateurs', '6 à 20 collaborateurs', 'Plus de 20 collaborateurs'] },
  { title: 'Quel budget indicatif par ordinateur ?', options: ['Moins de 10 000 DH', '10 000 à 15 000 DH', '15 000 à 25 000 DH', 'À définir selon les besoins'] },
  { title: 'Quelle est votre priorité ?', options: ['La mobilité', 'La performance', 'Le confort au bureau', 'Le meilleur équilibre'] },
  { title: 'Comment souhaitez-vous concrétiser votre projet ?', options: ['Demande de devis', 'Bon de commande', 'Marché public ou privé', 'Achat au showroom de Rabat'] },
];
const icons = [BriefcaseBusiness, GraduationCap, Palette, Code2, Gamepad2, Laptop, Users, RefreshCw];
export function PcFinder() {
  const products = useProducts();
  const { answers, step, selected, isTransitioning, choose, back, restart } = useFinderFlow(questions.length);
  const { add, setOpen, setInitialMessage } = useQuote();
  const question = questions[step];
  const diagnostic = getFinderDiagnostic(answers, step, selected);
  const progress = Math.min(step + 1 + (isTransitioning ? 1 : 0), questions.length);
  const recommendations = recommendProducts(answers, products);
  function requestQuote() { setInitialMessage(`Bonjour SESA, voici les critères de mon diagnostic : ${answers.join(' · ')}.`); setOpen(true); }
  return <section className="finder-section" id="finder" aria-labelledby="finder-title"><div className="site-width"><div className="finder-heading"><div><p className="eyebrow mb-3">Le conseil SESA</p><h2 id="finder-title">Votre usage d’abord.<br/>Le bon ordinateur ensuite.</h2></div><p className="finder-intro">Votre quotidien, vos exigences, votre budget.<br/>Une sélection adaptée à votre façon de travailler.</p></div>
    <div className="quiz-panel"><div className="p-6 md:p-9"><div key={step} className="finder-step-content">{question ? <><div className="mb-4 flex justify-between text-[10px] font-bold uppercase text-muted-foreground"><span>Question {step + 1} sur 8</span><span>{Math.round(progress / 8 * 100)} %</span></div><progress className="mb-7 h-1.5 w-full accent-primary" value={progress} max={8}/><h3 className="mb-2 text-xl font-extrabold">{question.title}</h3><p className="mb-6 text-xs text-muted-foreground">{step === 0 ? 'Choisissez l’usage qui occupe le plus votre quotidien.' : 'Choisissez la réponse qui vous correspond.'}</p><div className="quiz-options">{question.options.map((option, i) => { const Icon = icons[i] ?? BriefcaseBusiness; return <Button key={option} variant={selected === option ? 'secondary' : 'outline'} className="quiz-option" aria-pressed={selected === option} disabled={isTransitioning} onClick={() => choose(option)}><Icon/><span>{option}</span>{selected === option && <Check className="absolute sr-only"/>}</Button>; })}</div><div className="mt-6 flex justify-between"><Button variant="ghost" disabled={step === 0} onClick={back}><ArrowLeft/>Précédent</Button></div></> : <><p className="eyebrow mb-3">Votre sélection personnalisée</p><h3 className="mb-5 text-2xl font-extrabold">Le matériel adapté à votre projet.</h3><div className="grid gap-4 sm:grid-cols-2">{recommendations.map(p => <div key={p.id}><img src={p.image} alt={p.name} className="h-32 w-full object-contain" loading="lazy" width={384} height={512}/><h4 className="mt-3 text-sm font-bold">{p.name}</h4><p className="finder-results-specs">{p.detail}</p><p className="my-2 text-sm font-bold">{priceLabel(p.price)} DH TTC</p><Button size="sm" onClick={() => add(p.id)}>Ajouter au devis<ArrowRight/></Button></div>)}</div>{recommendations.length === 0 && <p className="finder-results-specs">Aucune référence publiée ne correspond actuellement à ces critères. SESA peut rechercher une configuration sur commande.</p>}<div className="finder-results-actions"><Button onClick={requestQuote}>Demander un devis<ArrowRight/></Button><Button variant="ghost" onClick={back}><ArrowLeft/>Précédent</Button><Button variant="link" onClick={restart}><RefreshCw/>Recommencer le diagnostic</Button></div></>}</div></div>
    <aside className="quiz-aside" aria-label="Diagnostic SESA"><div className="finder-diagnostic-label"><span>DIAGNOSTIC SESA</span><strong>{diagnostic.counter}</strong></div><div className="finder-radar" aria-hidden="true"><div className="finder-profile-mark"><Sparkles/></div></div><div aria-live="polite" aria-atomic="true"><h3 className="finder-diagnostic-title">{diagnosticMessages[diagnostic.profile]}</h3><p className="finder-diagnostic-intro">Répondez à quelques questions simples pour identifier les configurations adaptées à votre activité.</p><ul className="finder-diagnostic-tags" aria-label="Vos critères sélectionnés">{diagnostic.choices.map((choice, index) => <li key={`${index}-${choice}`}>{choice}</li>)}</ul></div><p className="finder-privacy">Ces critères permettent à SESA Informatique de filtrer les références les plus pertinentes pour votre devis.</p></aside></div></div>
  </section>;
}