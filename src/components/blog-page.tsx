import { useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import workstation from '@/assets/sesa-workstation-feature.jpg';
import printer from '@/assets/printer.jpg';
import enterprise from '@/assets/sesa-enterprise-scene.jpg';

const articles = [
  { title: 'PC portable professionnel ou workstation HP Z : choisir selon vos logiciels', topic: 'Équipement', image: workstation, duration: '4 min', intro: 'Mobilité, calcul, création : partez des usages réels de votre équipe.', sections: [
    ['Commencer par le métier, pas par la fiche technique', 'Bureautique, visioconférence et gestion ne sollicitent pas le matériel comme le rendu 3D ou la simulation. Listez les logiciels utilisés, leurs recommandations et le nombre d’applications ouvertes simultanément.'],
    ['Le portable professionnel pour la mobilité', 'Un portable professionnel convient aux collaborateurs qui alternent bureau et déplacements. Comparez le poids, la connectique, la capacité mémoire et les possibilités de raccordement à un écran. L’autonomie dépend de la configuration et de l’usage.'],
    ['Une workstation pour les charges exigeantes', 'Une station HP Z est à envisager pour la CAO, la modélisation et les applications de création. Vérifiez les certifications recommandées par l’éditeur du logiciel, le processeur, la mémoire et la carte graphique de la référence exacte.'],
    ['Préparer votre demande', 'Transmettez à SESA les logiciels, les quantités, le besoin de mobilité et le budget indicatif. La configuration et la garantie constructeur seront précisées sur le devis.'],
  ] },
  { title: 'Un parc d’impression mieux dimensionné avec HP LaserJet', topic: 'Impression', image: printer, duration: '3 min', intro: 'Volumes, réseau et consommables : les points à comparer avant de renouveler vos imprimantes.', sections: [
    ['Mesurer le volume réel', 'Relevez les pages imprimées par mois et par service. Séparez les documents monochromes des impressions couleur, et identifiez les besoins de numérisation. Une seule imprimante ne répond pas nécessairement à tous les usages.'],
    ['Comparer le coût d’utilisation', 'Le prix d’achat ne suffit pas. Comparez le rendement des consommables de la référence exacte, le recto verso, les bacs papier et le volume mensuel recommandé par le fabricant.'],
    ['Préparer le raccordement au réseau', 'Vérifiez la compatibilité avec les postes et les fonctions réseau nécessaires. Pour les documents sensibles, étudiez les options de sécurité réellement proposées par le modèle et les procédures internes de votre organisation.'],
    ['Une sélection cohérente', 'Communiquez les volumes, le nombre d’utilisateurs et les équipements existants. SESA peut préparer une sélection LaserJet adaptée, avec disponibilité et consommables à confirmer.'],
  ] },
  { title: 'Cahier des charges informatique : les éléments à préciser', topic: 'Entreprises & marchés', image: enterprise, duration: '4 min', intro: 'Une expression de besoin claire facilite la comparaison des offres et la réception du matériel.', sections: [
    ['Décrire les usages et quantités', 'Précisez les catégories de matériel, les logiciels, les quantités par site et les périphériques nécessaires. Distinguez les exigences indispensables des options souhaitées.'],
    ['Rendre les critères vérifiables', 'Indiquez les caractéristiques minimales utiles, la connectique, les accessoires et les conditions de garantie attendues. Évitez les formulations ambiguës ; demandez une fiche technique correspondant à chaque référence proposée.'],
    ['Organiser la réponse et la réception', 'Définissez les documents demandés, l’échéance, le lieu de livraison ou de retrait et les critères de réception. Les exigences administratives doivent être vérifiées selon la procédure applicable et par les responsables compétents.'],
    ['Transmettre le dossier à SESA', 'Votre organisme, ICE, contact et liste des besoins permettent de préparer la consultation. Le formulaire Entreprises & Marchés centralise ces éléments ; les pièces complémentaires peuvent être adressées à sesa@menara.ma.'],
  ] },
];
export function BlogPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const article = selected === null ? undefined : articles[selected];
  return <main className="site-width editorial-page"><p className="eyebrow">LES CONSEILS SESA</p><h1>Blog · Conseils & Guides IT</h1><p className="editorial-intro">Des repères concrets pour les responsables IT, les équipes et les acheteurs professionnels.</p><div className="editorial-grid">{articles.map((item, index) => <article key={item.title} className="editorial-card"><img src={item.image} alt="Matériel informatique professionnel — illustration" width={600} height={300}/><div><p className="eyebrow">{item.topic}</p><h2>{item.title}</h2><p>{item.intro}</p><span><Clock/>{item.duration} de lecture</span><Button variant="ghost" onClick={() => setSelected(index)}>Lire le guide<ArrowRight/></Button></div></article>)}</div><Dialog open={article !== undefined} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="article-reader">{article && <><DialogTitle>{article.title}</DialogTitle><DialogDescription>{article.topic} · {article.duration} de lecture</DialogDescription><img src={article.image} alt="Matériel professionnel — illustration" width={600} height={300}/>{article.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}</>}</DialogContent></Dialog></main>;
}