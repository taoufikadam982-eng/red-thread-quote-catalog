import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, FileText, Headphones, MapPin, MessageCircle, Minus, Plus, ShieldCheck, Building2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { assignedCategories, hasCategory } from '@/lib/product-categories';
import { ProductGallery } from './product-gallery';
import { ProductCard } from './product-card';
import { useProducts } from './catalog-context';
import { useQuote } from './quote-context';
import { addQuoteItem, priceLabel } from '@/lib/catalog';
import { clearanceLabel, isClearance } from '@/lib/product-offers';
import { isPrintProduct, printerQuickSpecs, scannerQuickSpecs, publishedSpecGroups, sameCategoryProducts } from '@/lib/product-detail';
import { whatsappHref } from '@/lib/storefront';
import { useWhatsapp } from './settings-context';
import { ProductRecommendations } from './product-recommendations';
import { readSpecGroups, sheetQuickSpecs } from '@/lib/product-sheet';
import { monitorQuickSpecs } from '@/lib/product-monitor';

const questions = [
  ['Les prix affichés incluent-ils la TVA ?', 'Oui. Les prix du catalogue SESA sont exprimés en dirhams marocains (MAD) TTC. Votre devis confirme le tarif et la disponibilité.'],
  ['Comment obtenir un devis officiel ou traiter un Bon de Commande (BC) ?', 'Ajoutez les références souhaitées à votre liste de devis ou demandez un devis immédiat. SESA prépare votre offre proforma avec un objectif de réponse sous 24h, pour entreprises et administrations.'],
  ['Puis-je voir et retirer le matériel directement en magasin ?', 'Oui. Notre showroom au Boulevard Al Alaouiyine 30, Hassan, Rabat vous accueille pour conseil et achat direct. Contactez-nous pour confirmer la disponibilité du modèle et les possibilités de démonstration. Aucun paiement en ligne.'],
  ['Le matériel bénéficie-t-il d’une garantie officielle ?', 'Le matériel commercialisé par SESA est neuf, d’origine officielle et couvert par la garantie constructeur. La durée et les modalités propres à chaque référence sont confirmées sur devis.'],
];
export function ProductPage({ id }: { id: string }) {
  const products = useProducts();
  const product = products.find(item => item.id === id && !item.hidden);
  const quote = useQuote();
  const whatsapp = useWhatsapp();
  const [quantity, setQuantity] = useState(1);
  if (!product) return <main className="site-width py-14"><p className="eyebrow">CATALOGUE SESA</p><h1 className="section-title mt-4">Référence indisponible</h1><p className="my-6 text-muted-foreground">Cette référence n’est pas actuellement visible au catalogue.</p><Button asChild><Link to="/boutique">Retour à la boutique<ArrowRight/></Link></Button></main>;
  const sheet = readSpecGroups(product.spec_groups);
  const scanner = hasCategory(product, 'Scanners');
  const monitor = hasCategory(product, 'Écrans');
  const groups = sheet.length ? sheet.map(group => ({ title: group.title.toUpperCase(), rows: group.rows })) : publishedSpecGroups(product);
  const specifications = groups.flatMap(group => group.rows);
  const labeled = specifications.filter(item => item.label !== 'Caractéristique');
  const sheetQuick = sheetQuickSpecs(sheet, hasCategory(product, 'Ordinateurs de bureau') && !hasCategory(product, 'Ordinateurs portables'));
  const fallbackQuick = labeled.length ? labeled : specifications;
  const quickSpecs = scanner ? scannerQuickSpecs(specifications) : monitor ? monitorQuickSpecs(specifications) : sheetQuick.length >= 2 ? sheetQuick : (isPrintProduct(product) ? printerQuickSpecs(fallbackQuick) : fallbackQuick.slice(0, 4));
  const computer = hasCategory(product, 'Ordinateurs portables') || hasCategory(product, 'Ordinateurs de bureau') || hasCategory(product, 'Workstations');
  const highlights = computer ? [] : (product.highlights ?? []).filter(Boolean);
  const hasStory = Boolean(product.intro || highlights.length || product.use_cases);
  const similar = sameCategoryProducts(product, products);
  const advisorUrl = whatsapp ? whatsappHref(whatsapp, `Bonjour SESA, je souhaite un conseil sur ${product.name} (réf. ${product.reference}).`) : '';
  const add = () => { let next = quote.items; for (let i = 0; i < quantity; i++) next = addQuoteItem(next, product.id, products); quote.setItems(next); quote.setOpen(true); };
  const immediate = () => { quote.setInitialMessage(`Bonjour SESA, je souhaite un devis pour ${quantity} × ${product.name} (réf. ${product.reference}).`); add(); };
  return <main className={`product-detail-page${scanner ? ' product-scanner-page' : ''}${monitor ? ' product-monitor-page' : ''}`}>
    <nav aria-label="Fil d’Ariane" className="site-width product-breadcrumb"><Link to="/">Accueil</Link><ChevronRight/><Link to="/boutique">Boutique</Link><ChevronRight/><Link to="/boutique" search={{ category: product.category }}>{product.category}</Link><ChevronRight/><span>{product.name}</span></nav>
    <section className="site-width product-overview">
      <div><ProductGallery product={product}/><ul className="product-assurances"><li><ShieldCheck/><span>Produit neuf<small>Garantie constructeur</small></span></li><li><MapPin/><span>Retrait & Livraison<small>Rabat & Maroc · Sur devis</small></span></li><li><Headphones/><span>Accompagnement B2B<small>Conseil & SAV dédié</small></span></li></ul></div>
      <div className="product-summary">{isClearance(product) && <span className="product-clearance-label">{clearanceLabel(product)}</span>}<div className="product-labels"><span>{product.brand}</span>{assignedCategories(product).map(category => <span key={category}>{category}</span>)}</div><h1>{product.name}</h1><p className="product-reference">Référence : <strong>{product.reference}</strong></p>{product.intro && <p className="product-intro-short">{product.intro.split(/(?<=\.)\s/).slice(0, 2).join(' ')}</p>}<h2 className="product-small-heading">Configuration en bref</h2><div className="product-quick-specs">{quickSpecs.map((item, index) => <div key={index}><small>{item.label === 'Caractéristique' ? `Détail ${index + 1}` : item.label}</small><strong>{item.value}</strong></div>)}</div>
      <div className="product-quote-tool"><div className="product-price-header"><p className={`product-detail-price ${isClearance(product) ? 'is-clearance' : ''}`}>{product.old_price && product.old_price > product.price ? <del>{priceLabel(product.old_price)} DH</del> : null}<strong>{product.price > 0 ? <>{priceLabel(product.price)} <span>MAD TTC</span></> : 'Prix sur devis'}</strong></p><span className="product-store-pill"><MapPin/>Disponibilité magasin à confirmer<small>Bd Al Alaouiyine, Rabat</small></span></div><p className="product-price-note">Prix indicatif TTC · Tarifs dégressifs pour entreprises et marchés, sur devis.</p><div className="product-quote-row"><div className="product-quantity"><Button variant="ghost" size="icon" aria-label="Diminuer la quantité" disabled={quantity <= 1} onClick={() => setQuantity(value => value-1)}><Minus/></Button><input aria-label="Quantité" type="number" min={1} value={quantity} onChange={event => setQuantity(Math.max(1, Math.floor(Number(event.target.value) || 1)))}/><Button variant="ghost" size="icon" aria-label="Augmenter la quantité" onClick={() => setQuantity(value => value+1)}><Plus/></Button></div><Button onClick={add}><FileText/>Ajouter à ma liste de devis</Button></div><Button variant="dark" className="product-immediate" onClick={immediate}>Demander un devis immédiat<ArrowRight/></Button><p className="product-price-note">Aucun paiement en ligne · Vente et paiement au showroom</p></div>
      {advisorUrl && <Button variant="outline" className="product-advisor" asChild><a href={advisorUrl} target="_blank" rel="noopener noreferrer"><MessageCircle/><span>Une question sur ce produit ?<strong>Échanger avec un conseiller</strong></span><ArrowRight/></a></Button>}</div>
    </section>
    {hasStory && <section className="site-width product-story">{product.intro && <div><h2>Présentation du produit</h2><p>{product.intro}</p></div>}{highlights.length>0 && <div><h2>Points forts</h2><ul>{highlights.map(item => <li key={item}><Check/>{item}</li>)}</ul></div>}{product.use_cases && <div><h2>Utilisation recommandée</h2><p>{product.use_cases}</p></div>}</section>}
    <section className="product-specifications site-width"><div><p className="eyebrow">INFORMATIONS PRODUIT</p><div className="product-spec-heading"><h2 className="section-title">Fiche technique complète</h2><span>{specifications.length} caractéristiques</span></div><div className="product-spec-table"><h3>IDENTITÉ DU PRODUIT</h3><dl>{[['Marque',product.brand],['Référence constructeur',product.reference],['Catégories',assignedCategories(product).join(' · ')]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{groups.map(group => <div key={group.title}><h3>{group.title}</h3><dl>{group.rows.map((row, index) => <div key={index}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></div>)}{product.usage && <><h3>USAGE CONSEILLÉ</h3><dl><div><dt>Application</dt><dd>{product.usage}</dd></div></dl></>}</div>{product.extra_info && <div className="product-extra"><h3>INFORMATIONS COMPLÉMENTAIRES</h3><p>{product.extra_info}</p></div>}<p className="product-spec-note">Caractéristiques issues du catalogue publié par SESA. La configuration exacte, la disponibilité et les modalités de garantie sont confirmées dans votre devis.</p></div><aside className="product-help"><article className="product-help-dark"><p className="eyebrow">BESOIN D’AIDE ?</p><h3>Un doute sur cette configuration ?</h3><p>Décrivez-nous votre usage. Nos experts à Rabat vérifient si ce modèle correspond réellement à votre besoin.</p>{advisorUrl && <Button variant="nav" asChild><a href={advisorUrl} target="_blank" rel="noopener noreferrer">Parler à un conseiller<ArrowRight/></a></Button>}</article><article><Building2/><h3>Achat professionnel & Marchés</h3><p>Devis proforma avec un objectif sous 24h, facturation, bons de commande et tarifs sur volume pour entreprises et administrations.</p><Button variant="link" onClick={immediate}>Obtenir un devis<ArrowRight/></Button></article><article><h3>Pourquoi choisir SESA Informatique ?</h3><ul>{['Prix clair et TTC', product.availability === 'En stock' ? 'En stock · Retrait à confirmer au showroom' : 'Disponibilité confirmée avant achat', 'Garantie constructeur officielle', 'Accompagnement technique & SAV'].map(text => <li key={text}><Check/>{text}</li>)}</ul></article></aside></section>
    {similar.length>0 && <section className="site-width product-related"><p className="eyebrow">POURSUIVRE VOTRE EXPLORATION</p><h2 className="section-title">Produits similaires</h2><div>{similar.map(item => <ProductCard key={item.id} product={item}/>)}</div></section>}
    <ProductRecommendations key={product.id} product={product} products={products}/>
    <section className="product-faq"><div className="site-width"><div><p className="eyebrow">AVANT DE COMMANDER</p><h2 className="section-title">Les réponses utiles.</h2><p>Prix, devis, showroom et garantie : préparez votre demande en toute confiance.</p></div><div>{questions.map(([question,answer]) => <details key={question}><summary>{question}<Plus/></summary><p>{answer}</p></details>)}</div></div></section>
  </main>;
}
