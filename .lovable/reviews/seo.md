# Audit SEO + GEO — SESA Informatique

**23 novembre 2026 · Audit préalable, sans modification du site ni publication**

Site contrôlé : https://red-thread-quote-catalog.lovable.app/

## 1. Synthèse

La base est exploitable : les pages commerciales répondent, le contenu du catalogue est rendu côté serveur, les produits possèdent des caractéristiques et la navigation mobile fonctionne dans les parcours vérifiés. Il n’est pas nécessaire de reconstruire le site.

Les premières corrections doivent porter sur les URL canoniques dirigées prématurément vers `sesa.ma`, les références inexistantes qui répondent encore 200, le sitemap absent et l’absence d’URL individuelle pour les articles. Ensuite viennent les catégories et marques, le balisage produit, les contenus fiables et les images.

**Aucun classement, volume de trafic ni citation par une IA n’est garanti.** Les positions Google et l’indexation effective n’ont pas été mesurées.

## 2. Périmètre et preuves

- Lecture des routes, du fonctionnement du catalogue, des filtres, des fiches, du blog, des contacts, des règles de lecture publiques et de l’administration.
- Contrôles HTTP sur le site publié et l’aperçu : pages commerciales, pages privées, paramètres Boutique, robots, sitemap et URL inexistantes.
- **39 fiches produits publiées contrôlées : 39 réponses 200, titres présents et tableaux techniques présents.**
- Données actuelles : **39 produits visibles, aucun masqué ; 7 articles publiés**. Aucun produit visible sans texte technique ni image personnalisée.
- Catégories principales des produits : 20 portables, 1 ordinateur de bureau, 9 écrans, 7 imprimantes, 2 scanners. Les affectations secondaires peuvent compléter ces chiffres ; les dix catégories officielles doivent rester distinctes.
- Marques effectivement présentes dans les produits visibles : HP 29, Dell 5, Lenovo 3, ASUS 1, Epson 1. Une présence dans le menu ne constitue pas une preuve de stock.
- Parcours navigateur à **1280 × 1800, 390 × 844 et 976 × 720** : accueil, Boutique ASUS, blog, magasin, contact, solutions, catalogue, configurateur. Aucun débordement horizontal, aucune image cassée dans l’état contrôlé, aucune erreur JavaScript relevée.
- ASUS : ouverture du produit et ajout à la liste de devis vérifiés sur les trois formats. Lecture d’un article vérifiée ; elle ouvre une fenêtre sans changer l’URL `/blog`.
- **187 tests existants réussis, 27 fichiers de tests.** Aucun déploiement ni nouvelle compilation de production effectué pour cet audit.
- Aucune donnée commerciale, aucun compte ni paramètre de production modifié ; aucune demande de devis ou inscription test envoyée.

### Limites

Pas de contrôle authentifié de Google Search Console, Google Analytics ou Google Business Profile ; aucune affirmation sur leur configuration, trafic ou indexation. La gestion admin a été examinée dans le code et les règles existantes, sans créer, supprimer ou publier un article ou un produit. Ce n’est pas un audit de sécurité exhaustif.

Les mesures locales du navigateur ne sont **pas des Core Web Vitals terrain** : ni appareil lent, ni réseau mobile simulé, ni données CrUX. Il reste à mesurer les performances publiques dans ces conditions. Une tentative HTTPS vers `sesa.ma` a échoué sur la vérification du certificat dans cet environnement : cela ne démontre pas à lui seul l’état global du domaine. Les URL communiquées pour le projet n’indiquent pas de domaine personnalisé actif.

## 3. Contrôle SEO automatique récent

**1 constat failing parmi les scanners current ; 8 constats passing.** Les noms et états ci-dessous sont reproduits tels quels. Les contrôles de contenu et de données structurées du 21 novembre sont anciens : ils ne constituent pas une validation actuelle ; leurs sujets ont été recoupés manuellement.

| Finding | Level | State |
|---|---|---|
| Add a sitemap | low | failing |
| Home page is reachable | low | passing |
| AI assistants can see your site as markdown | low | passing |
| Search engines see your fully-rendered pages | low | passing |
| Crawler rules look good | low | passing |
| Page basics are set | low | passing |
| Site icon is set up for search | low | passing |
| Home page search metadata is set | low | passing |
| Social preview basics are set | low | passing |

Un contrôle « passing » des métadonnées de base ne valide pas la destination commerciale d’un canonical, la fiabilité d’un avis ni la richesse du contenu.

## 4. Plan d’action : critique

| ID | Problème constaté et pages | Correction recommandée | Impact attendu | Risque / validation |
|---|---|---|---|---|
| C1 | Accueil et 39 fiches : canonical et og:url visent `https://sesa.ma`, pas l’origine publique actuelle. Le JSON-LD du magasin utilise aussi ce domaine et son image. | Utiliser l’origine publique actuelle et la page elle-même ; préparer ensuite une migration coordonnée vers sesa.ma après connexion et validation explicites. | Éviter d’envoyer les signaux d’identité vers une autre origine non validée. | Ne pas connecter de domaine, supprimer d’URL ou déployer sans accord. Aucun constat de désindexation effective. |
| C2 | `/produit/seo-audit-inexistant` répond 200 avec « Référence indisponible » et un canonical ; aucune indication noindex. | Renvoyer un vrai 404 pour une référence définitivement absente/masquée ; distinguer cette absence d’une panne du catalogue, qui ne doit pas faire disparaître un produit réel. | Réduire les soft 404 et les URL inutiles. | Ne jamais masquer ou noindexer une fiche commerciale existante. Tester aussi les pannes temporaires. |

Il n’a été constaté **ni blocage global par robots.txt, ni panne générale du site**. La route inexistante ordinaire répond bien 404.

## 5. Plan d’action : prioritaire

| ID | Problème constaté et pages | Correction recommandée | Impact attendu | Risque / validation |
|---|---|---|---|---|
| P1 | `/sitemap.xml` répond 404 ; aucun sitemap référencé dans robots.txt. | Installer un sitemap comprenant uniquement les pages publiques canoniques et les produits visibles, puis les articles/pages catégories approuvés. Respecter les exclusions des comptes, admin, API et recherches. | Faciliter la découverte et le suivi dans Search Console. | Ne pas inclure produits masqués ou pages privées ; ne pas inventer de dates lastmod. Sitemap ≠ indexation garantie. |
| P2 | Les pages commerciales autres que l’accueil/produits n’ont pas de canonical explicite ni og:url. Boutique avec brand/category/search conserve le même titre et H1. | Définir les canoniques par page et une politique séparée pour recherche interne, filtres techniques et sélections éditoriales utiles. | Réduire les ambiguïtés et la multiplication de variantes sans valeur. | Ne pas appliquer un noindex global à Boutique, catalogue, marques ou catégories. |
| P3 | Les catégories et marques sont principalement des sélections paramétrées ; pas de page descriptive individuelle. Accueil : cartes catégories sous forme de boutons. | Proposer des destinations stables par catégorie, puis par marque réellement représentée, avec contenu distinct, produits, fil d’Ariane et vrais liens. Conserver le filtrage/scroll demandé et les anciennes URL. | Répondre aux recherches de catégorie sans dupliquer la Boutique. | Création de pages et adaptation des liens à valider séparément ; aucune suppression de catégorie ni page locale artificielle. |
| P4 | Sept articles : ouverture en fenêtre, pas d’URL individuelle. Corps des articles non présent comme contenu principal HTML dans la page blog initiale. | Ajouter des pages `/blog/{slug}` rendues côté serveur, liées depuis le blog, avec métadonnées et BlogPosting/BreadcrumbList. Stabiliser le slug : actuellement l’enregistrement le recalcule depuis le titre. | Rendre chaque guide consultable, partageable et découvrable individuellement. | Préserver les articles et leur lecture ; conserver les URL publiées après création. |
| P5 | Accueil : trois H1 dans le HTML du carrousel, un seul actif visible. `/catalogue` et `/configurateur` : aucun H1. Magasin : H1 « Notre Magasin SESA ». | Un H1 descriptif stable par page ; autres titres du carrousel à niveau inférieur ; titres spécifiques au catalogue, configurateur et showroom de Hassan, Rabat. | Clarifier la hiérarchie et l’objet de chaque page. | Ce n’est pas un blocage d’indexation ; préserver le dessin du carrousel et le texte commercial utile. L’ancien diagnostic de deux blocs hero simultanés est inexact pour l’accueil actuel. |
| P6 | Accueil : AggregateRating 4.6/15 encore dans ComputerStore alors que le badge/avis ont été retirés du contenu visible. Aucune donnée structurée Product sur les 39 fiches. | Retirer uniquement la note non étayée du JSON-LD ; compléter ComputerStore avec les horaires confirmés, puis Product et BreadcrumbList factuels. Offer uniquement si applicable et confirmé. | Aligner le balisage avec la réalité publiée. | Ne pas réintroduire les avis supprimés ; ne pas transformer un prix indicatif en offre ferme ni inventer stock, garantie, avis ou livraison. |
| P7 | Exemple ASUS UX481F : titre « HDD 1 To » mais carte Stockage « SSD PCIe x2 de 512 Go … titre contradictoire ». Plusieurs textes contiennent des réserves « selon configuration ». | Faire confirmer la référence exacte et les champs divergents par SESA / une fiche constructeur correspondante ; corriger seulement les données validées. | Améliorer confiance, cohérence et compréhension du produit. | **Aucune caractéristique ou référence à modifier automatiquement.** Les tableaux techniques déjà utiles sont conservés. |
| P8 | Articles récents : affirmations « stock permanent », « autonomie d’une journée », workstation « certifiée … 24h/24 », recto verso « divise immédiatement … par deux ». Le guide local cite Apple, MSI, Samsung sans produits visibles de ces marques. | Réviser les formulations après validation commerciale ; sourcer les affirmations fabricant et rendre les conseils conditionnels au modèle/usage. | Réduire les promesses non justifiées et renforcer la valeur SEO/GEO. | Catalogue vide ne signifie pas marque non distribuée : demander confirmation, ne pas supprimer de marque arbitrairement. |
| P9 | Images produit échantillonnées : jusqu’à 1 581 134 octets pour un PNG ; cache public max-age=60. Carrousel : deux images par slide, mobile et bureau, toutes sans chargement différé. | Renditions adaptées WebP/AVIF, tailles responsives, précharger seulement l’image active, différer les autres ; cache compatible avec renouvellement/suppression et permissions privées. | Diminuer transfert et temps d’affichage sur mobile. | Préserver qualité inspectable, galeries, règles de confidentialité et accès aux images ; ne pas rendre le bucket public. |
| P10 | Catalogue interrogé toutes les 3 secondes ; specs complètes et galeries transportées sur les pages. Accueil HTML reçu : environ 384 Ko avant compression. | Mesurer réseau réel, puis alléger le transport initial et choisir une actualisation proportionnée avec invalidation lors des modifications. | Réduire trafic répétitif et travail du navigateur. | Conserver synchronisation admin, récupération après panne et liste de devis. |

## 6. Plan d’action : secondaire

| ID | Constat / point à vérifier | Correction recommandée | Impact attendu | Risque |
|---|---|---|---|---|
| S1 | `/catalogue` et `/boutique` servent deux expériences proches, avec intentions concurrentes. | Boutique = sélection commerciale filtrée ; Catalogue = panorama des gammes et navigation. Rédiger des introductions distinctes. | Moins de concurrence interne entre pages. | Aucune fusion ou redirection sans autorisation explicite. |
| S2 | Boutique affiche 12 produits initialement puis « Voir plus » sans URL de page. Les 39 fiches restent liées dans l’accueil/catalogue. | Prévoir une pagination navigable et rendue serveur si le catalogue augmente, avec ordre stable. | Découverte plus robuste à grande échelle. | Ce n’est pas une preuve de produits orphelins aujourd’hui : les 39 liens existent. |
| S3 | Toutes les descriptions SEO produits dépassent 200 caractères, avec coupe du texte brut à 150 caractères puis ajout de phrases. Exemple ASUS finit au milieu d’une valeur. | Composer un résumé court de marque/référence et caractéristiques réellement publiées, sans fragment interrompu. | Résumés plus lisibles et distincts. | La longueur n’est pas une erreur bloquante ; Google peut réécrire les extraits. |
| S4 | Même image de partage injectée par l’hébergement sur les pages testées ; fiches sans photo spécifique dans leurs métadonnées. Image commune : environ 694 Ko. | Photo de produit réellement affichée pour chaque fiche, rendition de partage dimensionnée, URL absolue dans les métadonnées de cette fiche. | Partage plus pertinent WhatsApp/LinkedIn. | Vérification réelle des aperçus après publication ; aucune nouvelle image marketing inventée. |
| S5 | `/admin` sans métadonnées/noindex dans sa réponse HTML initiale car layout rendu côté client ; `/auth` et reset-password ont noindex. Assistant lié au compte, sans noindex. | Exclure admin et surfaces personnelles du sitemap ; vérifier réponse SSR et en-têtes adaptés sans changer les permissions. | Limiter les pages inutiles dans la recherche. | Le contenu privé n’a pas été exposé par ce contrôle ; ne pas confondre indexation et autorisation. |
| S6 | Absence de repère main sur plusieurs pages contrôlées ; rendu 404 et certains textes de fenêtre en anglais. | Améliorer repères, noms accessibles, langue et ordre de focus sans changer le design. | Navigation plus cohérente et accessible. | Audit complet de contrastes/clavier restant à faire. |
| S7 | Horaires visibles cohérents : Lun–Ven 8h30–16h30 ; pas d’horaires JSON-LD. | Réutiliser les mêmes coordonnées et horaires confirmés partout ; vérifier la fiche Google Business Profile avec le propriétaire. | Cohérence locale. | Pas d’accès ni modification à Google Business Profile dans cet audit. |

## 7. Recherche de mots-clés — Maroc

Source : Semrush, base `ma`, interrogée le 23 novembre 2026. Estimations pour **les expressions exactes**, pas pour toutes leurs variantes ; couverture locale limitée. La difficulté 0 fournie par l’outil ne garantit pas une concurrence réelle faible ni un classement.

| Expression exacte | Volume mensuel estimé | Difficulté estimée | Usage envisagé |
|---|---:|---:|---|
| matériel informatique Maroc | 20 | 0/100 | Accueil, avec qualification professionnelle |
| ordinateur portable Maroc | 140 | 0/100 | Catégorie portables ; ne pas confondre grand public et B2B |
| imprimante Maroc | 260 | 0/100 | Catégorie imprimantes et guide de choix |
| informatique Rabat | 30 | 0/100 | Showroom/contact ; intention large |
| matériel informatique professionnel Maroc | inconnue | inconnue | Positionnement métier pertinent, demande non quantifiée |
| fournisseur informatique Rabat | inconnue | inconnue | Intention commerciale locale pertinente, demande non quantifiée |

Aucune donnée Semrush disponible pour `sesa.ma` dans cette base : **trafic et classement inconnus**, pas nuls.

### Paysage concurrentiel observé

Une recherche web sur les fournisseurs professionnels Rabat/Maroc montre des pages centrées sur les usages, les gammes et le devis : [MICROMAD](https://micromad.ma/solutions-entreprises/), [Threecomp](https://threecomp.ma/solutions/materiel-informatique/), [Microfast](https://www.microfast.ma/). Il s’agit d’exemples trouvés, pas d’un relevé certifié des positions Google au Maroc. Ne pas copier leurs services, stock, chiffres ou zones géographiques.

SESA peut se distinguer par ses éléments confirmés : showroom Hassan, choix par usage, références exactes, devis, bons de commande et accompagnement des marchés. Les références longues marque + modèle + référence doivent être ciblées sur la fiche exacte, pas par des pages artificielles.

## 8. Cartographie des intentions : pages existantes

Ces titres, H1 et descriptions sont des **propositions non appliquées**. Les métadonnées et titres actuellement observés figurent dans l’annexe.

| Page | Intention / principal | Secondaires | Title proposé / H1 proposé | Description proposée | H2/H3 et liens prioritaires |
|---|---|---|---|---|---|
| `/` | Fournisseur matériel informatique professionnel Maroc | Entreprises, Rabat, devis | SESA Informatique — Matériel informatique professionnel au Maroc / SESA Informatique — Matériel informatique professionnel pour entreprises au Maroc | Équipez vos équipes en PC, écrans, imprimantes et scanners. SESA vous accompagne sur devis depuis son showroom de Hassan, Rabat. | Catégories, offres, usages, showroom ; Boutique, marques, solutions, contact |
| `/boutique` | Achat/sélection matériel professionnel | Marques, références, prix TTC | Boutique de matériel informatique professionnel — SESA Rabat / Boutique de matériel informatique professionnel | Comparez les références du catalogue SESA par catégorie et marque. Prix indicatifs TTC et disponibilité confirmée sur devis à Rabat. | Catégories, sélection ; produits, catégories, devis |
| `/catalogue` | Panorama des gammes | Catalogue informatique entreprise Maroc | Catalogue informatique pour entreprises — SESA / Catalogue informatique professionnel SESA | Découvrez les dix catégories de matériel SESA et accédez aux références publiées pour préparer votre demande de devis. | Nos catégories, catalogue ; catégories, Boutique |
| `/offres` | Offres/déstockage informatique | Matériel professionnel remisé Rabat | Offres & Déstockage informatique — SESA Rabat / Offres & Déstockage Pro | Consultez les offres actives du catalogue SESA. Matériel neuf, prix indicatifs TTC et conditions confirmées sur devis. | Sélection des offres ; produits, garantie, devis |
| `/marques` | Marques informatique SESA | HP, Dell, Lenovo, ASUS, Epson | Marques informatiques professionnelles — SESA Rabat / Nos marques informatiques | Retrouvez les marques présentées par SESA et leurs références publiées. Disponibilités et gammes sur demande à Rabat. | Un H2 par marque ; sélections et produits, pas de stock inventé |
| `/solutions` | Fournisseur informatique entreprise | PME, administrations, projet matériel | Matériel informatique pour entreprises au Maroc — SESA / Solutions IT pour entreprises et administrations | Décrivez vos usages et quantités. SESA prépare votre sélection et accompagne vos devis, bons de commande et marchés depuis Rabat. | Usages, accompagnement, projet ; catégories, marchés, contact |
| `/marches` | Achat informatique BC/appel d’offres | Proforma, cahier des charges | Devis, bons de commande & marchés informatiques — SESA / Bons de commande & marchés informatiques | Préparez votre demande avec les références, quantités et documents utiles. SESA accompagne votre procédure et confirme son offre sur devis. | Pièces, conformité, réception ; solutions, guide cahier des charges, contact |
| `/configurateur` | Choix PC selon usage | Portable professionnel, workstation | Choisir votre PC professionnel — Conseiller SESA / Quel PC pour votre usage professionnel ? | Précisez vos usages et contraintes pour découvrir une sélection issue du catalogue SESA et préparer votre devis. | Questionnaire, résultats ; catégories et produits réellement recommandés |
| `/conseils` | Conseil achat professionnel | Portable ou tour, workstation | Conseils pour choisir votre matériel informatique — SESA / Bien choisir votre matériel professionnel | Comparez mobilité, poste fixe et performances selon les logiciels et usages de votre équipe, avec les conseils SESA. | Choix par usage ; guides individuels, configurateur |
| `/blog` | Guides achats IT professionnels | Maroc, imprimantes, cahier des charges | Guides d’achat informatique pour professionnels — SESA / Guides et conseils IT SESA | Des guides pour choisir vos postes, dimensionner l’impression et préparer un projet d’équipement informatique professionnel. | Guides par sujet ; chaque article, puis catégories pertinentes |
| `/a-propos` | Identité SESA | Entreprise informatique Rabat | SESA Informatique à Rabat — Qui sommes-nous ? / SESA Informatique, votre partenaire à Rabat | Découvrez SESA, son showroom de Hassan et son accompagnement des entreprises et administrations dans leurs achats informatiques. | Activité, clientèle, devis ; magasin, solutions, contact |
| `/magasin` | Magasin informatique professionnel Rabat | Hassan, adresse, horaires | Showroom SESA Informatique à Hassan, Rabat / Showroom SESA Informatique à Hassan, Rabat | Adresse, horaires Lun–Ven 8h30–16h30 et itinéraire du showroom SESA, Boulevard Al Alaouiyine 30 à Rabat. | Adresse, horaires, venir ; contact, Boutique |
| `/contact` | Contact/devis fournisseur Rabat | Téléphone SESA, demande de devis | Contacter SESA Informatique à Rabat — Devis / Contacter SESA pour votre projet informatique | Contactez SESA par téléphone, e-mail ou demande de devis. Retrouvez les coordonnées du showroom de Hassan, Rabat. | Coordonnées, projet ; magasin, solutions |
| `/garantie` | SAV/garantie matériel SESA | Garantie constructeur | Garantie constructeur & SAV — SESA Informatique / Garantie constructeur et service après-vente | Préparez votre demande SAV avec référence, numéro de série et justificatif d’achat. Modalités propres au produit confirmées par SESA. | Préparer une demande, contact ; produits, contact |
| `/mentions-legales` | Identité légale | Éditeur, coordonnées | Mentions légales — SESA Informatique / Mentions légales | Informations sur l’éditeur SESA Informatique, les coordonnées et le fonctionnement du site de demandes de devis. | Éditeur et conditions ; contact, confidentialité |
| `/confidentialite` | Protection des données | Devis, consentement | Confidentialité et données personnelles — SESA / Politique de confidentialité | Utilisation des coordonnées et demandes de devis, consentements et exercice de vos droits auprès de SESA Informatique. | Données, choix, droits ; contact |

### Surfaces non commerciales

`/auth`, `/reset-password`, `/admin` : exclues du sitemap ; conserver/protéger leur noindex et leurs accès. `/assistant` : page d’accès à une conversation personnelle ; décider l’exclusion de l’espace de conversation, sans modifier l’accès au service. API et images servies : pas de pages éditoriales à inclure au sitemap.

### Fiches produits : règle pour chacune des 39 références

- Principal : **marque + modèle + référence constructeur exacte** ; secondaires : catégorie et usage uniquement justifiés par les données.
- Title proposé : `{nom exact} ({référence}) — SESA Informatique` lorsque la référence n’est pas déjà dans le nom.
- H1 : nom exact publié, inchangé tant qu’une contradiction n’a pas été validée.
- Description : résumé lisible avec marque/référence et deux éléments confirmés ; devis SESA Rabat en conclusion, sans promesse de stock ou délai.
- H2 : configuration en bref, fiche technique complète, produits pertinents, questions utiles. H3 : groupes techniques publiés par catégorie.
- Liens : catégorie, marque, produits connexes et devis. La marque est actuellement une étiquette, pas un lien dans la fiche.
- Garder les sections supprimées à votre demande absentes ; ne pas réintroduire « Présentation », « Utilisation recommandée » ou « Points forts » sur les ordinateurs.
- Images : alt existant avec nom/photo ; ajouter la référence si utile, pas de répétition artificielle de mots-clés.

## 9. Catégories : destinations proposées après validation

Aujourd’hui les sélections existent, mais pas ces pages individuelles. Une seule page par catégorie officielle, dans l’ordre établi ; aucun fusionnement des quatre dernières catégories.

| Catégorie / URL proposée | Principal et secondaires | Title / H1 proposé | Angle original, H2 et liens |
|---|---|---|---|
| Ordinateurs portables · `/categorie/ordinateurs-portables` | Portable professionnel Maroc ; mobilité entreprise | Ordinateurs portables professionnels au Maroc — SESA / Ordinateurs portables professionnels | Mobilité, raccordement écran, mémoire et logiciels ; liens fiches, marques, guide portable/workstation |
| Ordinateurs de bureau · `/categorie/ordinateurs-de-bureau` | PC bureau professionnel Maroc ; postes fixes | Ordinateurs de bureau professionnels — SESA Maroc / Ordinateurs de bureau professionnels | Poste fixe, évolutivité vérifiée, connectique ; fiche disponible, écrans, périphériques |
| Workstations · `/categorie/workstations` | Workstation professionnelle Maroc ; CAO | Workstations professionnelles — SESA Maroc / Workstations pour les usages exigeants | Logiciel réel, CPU/GPU/mémoire, certifications du modèle à vérifier ; fiches affectées, configurateur |
| Imprimantes · `/categorie/imprimantes` | Imprimante professionnelle Maroc ; laser bureau | Imprimantes professionnelles — SESA Maroc / Imprimantes pour entreprises et bureaux | Volume, monochrome/couleur, consommables et réseau ; fiches, guide coût total |
| Scanners · `/categorie/scanners` | Scanner professionnel Maroc ; documents | Scanners professionnels — SESA Maroc / Scanners professionnels | À plat/chargeur, formats, recto verso et compatibilité ; deux fiches, imprimantes |
| Écrans · `/categorie/ecrans` | Écran professionnel Maroc ; écran bureau | Écrans professionnels — SESA Maroc / Écrans pour les postes professionnels | Taille/définition, connectique et ergonomie ; neuf fiches, PC et périphériques |
| Réseau & Serveurs · `/categorie/reseau-serveurs` | Serveur informatique Maroc ; réseau entreprise | Réseau & Serveurs professionnels — SESA / Réseau & Serveurs | Recueillir nombre de postes, architecture, interfaces et contraintes ; devis/solutions, produits si présents |
| Onduleurs Eaton · `/categorie/onduleurs-eaton` | Onduleur professionnel Maroc ; Eaton | Onduleurs Eaton pour professionnels — SESA / Onduleurs Eaton | Charge, autonomie demandée et compatibilité à confirmer ; devis, réseau, fiches disponibles |
| Périphériques · `/categorie/peripheriques` | Périphériques informatique entreprise | Périphériques pour postes professionnels — SESA / Périphériques informatiques | Connecteurs, ergonomie et compatibilité ; PC, écrans, demande de devis |
| Logiciels · `/categorie/logiciels` | Logiciels professionnels Maroc | Logiciels professionnels sur demande — SESA / Logiciels professionnels | Besoin, postes, versions et licences à confirmer ; solutions/devis, aucune licence inventée |

Descriptions proposées : résumer pour chaque catégorie **son angle ci-dessus** et la demande de devis, sans copier un paragraphe commun. Exemple imprimantes : « Choisissez une imprimante selon le volume, la couleur et les fonctions réseau de votre bureau. Consultez les références SESA et préparez votre devis. » Pour les catégories sans référence : « Sur demande », pas de disponibilité inventée.

## 10. Blog, fiabilité et plan éditorial

Priorité : valoriser les sept articles existants avant de publier de nouveaux contenus.

| Article existant | Intention | Action et liens recommandés |
|---|---|---|
| Où acheter du matériel neuf et garanti à Rabat ? | Recherche locale showroom | Adresse/horaires confirmés ; valider les marques et livraison annoncées ; magasin, contact, Boutique |
| Imprimante Laser ou Jet d’encre professionnel | Coût et choix impression | Comparaison réellement équilibrée laser/jet d’encre ; corriger les généralisations duplex/stock après validation ; imprimantes et fiches pertinentes |
| PC Portable Professionnel ou Workstation | Choix par métier | Sourcer les exigences et éviter autonomie/certification universelles ; portables, workstations, configurateur |
| Achats sur Bon de Commande et Appels d’Offres | Achat institutionnel | Vérifier promesses administratives et délais ; marchés, solutions, guide cahier des charges |
| Cahier des charges informatique | Préparer une consultation | Checklist factuelle et exemples vérifiables ; marchés, devis |
| Parc d’impression HP LaserJet | Dimensionner l’impression | Différencier du guide comparatif général ; produits HP adaptés selon données et imprimantes |
| Portable ou workstation HP Z | Choix d’une gamme | Différencier du guide multimarque : références HP présentes et sources officielles ; fiches HP, workstations |

Pour chaque futur article : title = sujet précis + SESA ; description = question répondue en une phrase ; H1 = titre éditorial ; H2 = décision, critères, vérification, demande ; H3 = critères spécifiques. Aucun article ne possède aujourd’hui ses propres métadonnées de page faute d’URL individuelle.

### Sujets proposés, non publiés et demande exacte encore à mesurer

1. **Préparer l’équipement d’une PME** : inventaire par poste, logiciels, quantités, interfaces ; compléter `/solutions`, puis guide seulement si réellement distinct.
2. **PC de bureau ou portable pour une équipe** : enrichir `/conseils` avec critères décisionnels, sans refaire les deux guides workstation.
3. **Choisir un scanner documentaire** : comparer uniquement fonctions publiées des références ; compléter la catégorie Scanners avant une nouvelle page.
4. **Préparer sa demande de devis** : intégrer une réponse claire à `/contact` et `/marches`, pas une page supplémentaire quasi identique.

Validation explicite de chaque article avant publication ; pas de production de contenu en masse.

## 11. GEO et référencement local

- Les coordonnées visibles sont cohérentes avec les informations fournies : SESA Informatique, Boulevard Al Alaouiyine 30, 10020 Hassan, Rabat, sesa@menara.ma, téléphones 05 37 76 57 77 / 78.
- Horaires : **lundi à vendredi 8h30–16h30 ; showroom fermé le samedi**. Ne pas ajouter d’ouverture le week-end.
- Répondre sur la page pertinente : où acheter → magasin ; comment demander un devis → contact/marchés ; quel PC → conseils/configurateur ; quelle imprimante → catégorie/guide impression.
- Réponses courtes suivies de critères, tableaux réels et liens vers fiches. Sources officielles par référence lorsque nécessaires et disponibles, jamais une fiche d’une autre configuration.
- robots.txt laisse l’exploration ouverte. Le scanner confirme une version Markdown servie aux assistants par l’hébergement ; pas de preuve de citation, ingestion ou classement dans ChatGPT/Gemini/Perplexity.
- Aucun llms.txt n’a été créé : il n’est ni une obligation ni une garantie de référencement IA.
- Google Business Profile : recommander au propriétaire de contrôler nom, adresse, téléphones, horaires, catégorie réelle, lien du site après migration, photos authentiques et informations pratiques. Ne pas créer d’établissement supplémentaire, de faux avis ou de zone de livraison.

## 12. Ordre de réalisation et validation proposée

**Lot A — Technique sans changement commercial :** C1/C2, P1/P2, P5/P6 et cohérence des métadonnées ; contrôle des pages privées. Pas de nouveau domaine, suppression de page ou noindex commercial.

**Lot B — Structure éditoriale à approuver :** P3/P4 et stratégie Boutique/Catalogue ; nouvelles destinations canoniques liées au site, anciens liens conservés.

**Lot C — Données et performances :** validation humaine P7/P8, puis renditions/cache/transport P9/P10 après mesures ; améliorations secondaires proportionnées.

Avant une future publication : tester HTTP/404, canoniques, sitemap/exclusions, JSON-LD, lecture d’articles, filtres et pagination, devis, images et responsive. Comparer les prix, références, stocks et caractéristiques avant/après pour garantir leur conservation. Une publication, connexion de domaine ou modification de production nécessite votre accord explicite séparé.

**Cet audit n’autorise aucune correction à lui seul.** L’approbation des corrections techniques ne vaudra pas approbation de nouvelles pages, de modifications commerciales ou de publication.

## Annexe A — Métadonnées et titres actuellement observés

Source : HTML public reçu sans exécution JavaScript. Les H1 du carrousel incluent les diapositives inactives ; les H2/H3 comprennent aussi le pied de page partagé. Toutes les pages commerciales listées ci-dessous ont répondu 200.

### `/`

- **Title actuel :** SESA Informatique Rabat — Matériel informatique professionnel au Maroc
- **Description actuelle :** PC portables, ordinateurs de bureau, workstations, imprimantes et écrans pour entreprises et administrations. Devis B2B, bons de commande et marchés publics — showroom à Hassan, Rabat.
- **H1 :** Le bon matériel.
Pour toute votre équipe. ; Vos idées méritent
une grande puissance. ; Une base solide.
Pour vos projets IT.
- **H2 :** Nos marques partenaires ; Nos catégories ; Offres Spéciales & Déstockage Showroom ; Vos projets. Sans compromis. ; Votre bureau. Partout avec vous. ; Des solutions pour chaque besoin ; Notre catalogue matériel ; Votre usage d’abord. Le bon ordinateur ensuite. ; Pourquoi choisir SESA ? ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Écran HP Series 7 Pro 724pf ; HP OFFICEJET PRO 9720 WF AIO ; ECRAN HP S3 Pro 322pv FHD ; ECRAN HP P22 G5 FHD MONITOR ; HP ScanJet Pro 2500 f1 ; Scanner Epson Perfection V19 ; DELL 24 Monitor -P2418HT (23,8") TACTILE ; Imprimante HP Color Laser 6700dn SFP resaux couleur ; HP 250 G8 i5-1035 4Gb RAM 1T HDD Dos ; IMPRIMANTE HP M552DN Imprimantes Laser couleur Pro A4 ; HP Color LaserJet Enterprise M555dn ; Écran 24" Full HD HP S3 Pro 324pv ; LENOVO LOQ 15IAX9E i5 12450HX 15,6"FHD 16 Go 512 Go SSD RTX2050_B_4GB Win 11 Hom ; IMPRIMANTE HP M211DW MONO ; HP LaserJet Enterprise M506dn ; DELL latitude 3410 13-10110U 14" 4gb 1TB FreeDos ; Asus ZenBook UX481F Duo 14" Core i7 1,8 GHz - HDD 1 To - 16 Go ; DELL LATITUDE 3500 I3-8145U 15" 4GO 1TO FRD ; ECRAN HP P22 G4 FHD MONITOR ; ECRAN HP 527pq Monitor 27" ; LENOVO Thinkbook 14 G6 IRL i5-1335U 14'' 1920x1200 8Go 512Go SSD Free Dos Grey 12 Mois ; DELL 22 Monitor -P2222H (21,5") ; LENOVO S27i-30 27" IPS panel 1920x1080 VGA-HDMI ; Imprimante Laser Couleur HP LaserJet Pro 3203dw (499N4A) ; Administrations & Marchés ; PME & Bureautique ; Ingénierie & Workstations ; Impression & Numérisation ; HP ProBook 4 G1iR 14 ; HP Zbook 8G1i ; HP ProBook 4 G1iR ; HP EliteBook 8 G1i ; HP EliteBook 6 G1i ; HP Zbook G1i ; HP ProBook 4 G1i ; Ordinateur de bureau Dell Pro Tour ; Qu’aimeriez-vous faire confortablement ? ; Décrivez votre usage. Nos experts ciblent le bon matériel. ; Solutions sur mesure ; Matériel neuf & garanti ; Showroom à Rabat ; Conseil & accompagnement ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** https://sesa.ma/

### `/boutique`

- **Title actuel :** Boutique informatique à Rabat — SESA Informatique
- **Description actuelle :** Sélectionnez votre matériel informatique SESA : recherche, filtres par budget, marque et caractéristiques, prix indicatifs TTC et demande de devis.
- **H1 :** Boutique informatique
- **H2 :** Votre sélection. ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Ordinateur de bureau Dell Pro Tour ; Scanner Epson Perfection V19 ; ECRAN HP P22 G4 FHD MONITOR ; ECRAN HP S3 Pro 322pv FHD ; DELL 22 Monitor -P2222H (21,5") ; ECRAN HP P22 G5 FHD MONITOR ; LENOVO S27i-30 27" IPS panel 1920x1080 VGA-HDMI ; Écran 24" Full HD HP S3 Pro 324pv ; IMPRIMANTE HP M211DW MONO ; HP OFFICEJET PRO 9720 WF AIO ; Écran HP Series 7 Pro 724pf ; DELL LATITUDE 3500 I3-8145U 15" 4GO 1TO FRD ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/catalogue`

- **Title actuel :** Catalogue professionnel — SESA Informatique
- **Description actuelle :** Découvrez le matériel professionnel SESA : portables, tours, workstations, imprimantes et écrans. Prix indicatifs TTC et demandes de devis.
- **H1 :** absent
- **H2 :** Nos catégories ; Notre catalogue matériel ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Écran HP Series 7 Pro 724pf ; HP ProBook 4 G1iR 14 ; HP Zbook 8G1i ; HP ProBook 4 G1iR ; HP EliteBook 8 G1i ; HP EliteBook 6 G1i ; HP Zbook G1i ; HP ProBook 4 G1i ; HP OFFICEJET PRO 9720 WF AIO ; ECRAN HP S3 Pro 322pv FHD ; ECRAN HP P22 G5 FHD MONITOR ; HP ScanJet Pro 2500 f1 ; Scanner Epson Perfection V19 ; DELL 24 Monitor -P2418HT (23,8") TACTILE ; Imprimante HP Color Laser 6700dn SFP resaux couleur ; HP 250 G8 i5-1035 4Gb RAM 1T HDD Dos ; IMPRIMANTE HP M552DN Imprimantes Laser couleur Pro A4 ; HP Color LaserJet Enterprise M555dn ; Écran 24" Full HD HP S3 Pro 324pv ; LENOVO LOQ 15IAX9E i5 12450HX 15,6"FHD 16 Go 512 Go SSD RTX2050_B_4GB Win 11 Hom ; IMPRIMANTE HP M211DW MONO ; HP LaserJet Enterprise M506dn ; DELL latitude 3410 13-10110U 14" 4gb 1TB FreeDos ; Asus ZenBook UX481F Duo 14" Core i7 1,8 GHz - HDD 1 To - 16 Go ; DELL LATITUDE 3500 I3-8145U 15" 4GO 1TO FRD ; ECRAN HP P22 G4 FHD MONITOR ; ECRAN HP 527pq Monitor 27" ; LENOVO Thinkbook 14 G6 IRL i5-1335U 14'' 1920x1200 8Go 512Go SSD Free Dos Grey 12 Mois ; DELL 22 Monitor -P2222H (21,5") ; LENOVO S27i-30 27" IPS panel 1920x1080 VGA-HDMI ; Imprimante Laser Couleur HP LaserJet Pro 3203dw (499N4A) ; Ordinateur de bureau Dell Pro Tour ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/offres`

- **Title actuel :** Offres & Déstockage Pro — SESA Informatique Rabat
- **Description actuelle :** Les offres spéciales et fins de série du showroom SESA à Rabat : matériel professionnel neuf sous garantie constructeur, sur devis.
- **H1 :** Offres & Déstockage Pro
- **H2 :** Votre sélection. ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Scanner Epson Perfection V19 ; ECRAN HP P22 G4 FHD MONITOR ; ECRAN HP S3 Pro 322pv FHD ; DELL 22 Monitor -P2222H (21,5") ; ECRAN HP P22 G5 FHD MONITOR ; LENOVO S27i-30 27" IPS panel 1920x1080 VGA-HDMI ; Écran 24" Full HD HP S3 Pro 324pv ; IMPRIMANTE HP M211DW MONO ; HP OFFICEJET PRO 9720 WF AIO ; Écran HP Series 7 Pro 724pf ; DELL LATITUDE 3500 I3-8145U 15" 4GO 1TO FRD ; HP ScanJet Pro 2500 f1 ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/marques`

- **Title actuel :** Nos Marques — SESA Informatique
- **Description actuelle :** Les gammes HP, Dell, Lenovo, ASUS, Epson, Eaton et ADATA chez SESA à Rabat. Découvrez les équipements et demandez un devis.
- **H1 :** Nos Marques
- **H2 :** HP ; Dell ; Lenovo ; ASUS ; Epson ; Eaton ; ADATA ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/solutions`

- **Title actuel :** Solutions B2B & Marchés — SESA Informatique
- **Description actuelle :** Solutions IT pour les PME, grands comptes et administrations. Accompagnement des marchés publics et privés et bons de commande.
- **H1 :** Solutions IT pour Entreprises, Administrations & Marchés Publics .
- **H2 :** Nos marques partenaires ; Un partenaire pour vos achats professionnels ; Des solutions adaptées à votre activité ; La puissance pour vos projets. ; L’accompagnement SESA ; Décrivez votre besoin. Construisons votre solution. ; Soumettre un Bon de Commande / Appel d’Offres ; Pourquoi choisir SESA ? ; Un projet d’équipement ou un appel d’offres ? ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Réponse aux Appels d’Offres & Consultations ; Traitement rapide des Bons de Commande ; Tarifs dégressifs & Proforma sous 24h ; Dossier administratif & Garantie officielle ; PME & ETI ; Grands comptes ; Éducation ; Santé ; Industrie ; Secteur public ; Quels équipements recherchez-vous ? ; Commençons par le matériel. ; Présence à Rabat ; Matériel neuf ; Devis sous 24h ; Accompagnement B2B ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/marches`

- **Title actuel :** Bons de commande & Marchés — SESA Informatique
- **Description actuelle :** Procédure de devis et accompagnement des bons de commande et marchés IT à Rabat.
- **H1 :** Bons de commande & Marchés
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/configurateur`

- **Title actuel :** Trouvez votre PC professionnel — SESA Informatique
- **Description actuelle :** Répondez à huit questions sur vos usages et découvrez une sélection de PC professionnels adaptée à votre projet.
- **H1 :** absent
- **H2 :** Votre usage d’abord. Le bon ordinateur ensuite. ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Qu’aimeriez-vous faire confortablement ? ; Décrivez votre usage. Nos experts ciblent le bon matériel. ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/conseils`

- **Title actuel :** Conseils & Guides IT — SESA Informatique
- **Description actuelle :** Choisissez le matériel adapté à vos usages professionnels avec les conseils SESA et notre questionnaire personnalisé.
- **H1 :** Bien choisir votre matériel professionnel
- **H2 :** Portable ou ordinateur de bureau ? ; Quand choisir une workstation ? ; Équiper plusieurs collaborateurs ; Votre usage d’abord. Le bon ordinateur ensuite. ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Qu’aimeriez-vous faire confortablement ? ; Décrivez votre usage. Nos experts ciblent le bon matériel. ; Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/blog`

- **Title actuel :** Blog · Conseils & Guides IT — SESA Informatique
- **Description actuelle :** Conseils SESA pour choisir vos postes professionnels, optimiser l’impression et préparer un cahier des charges informatique.
- **H1 :** Blog · Conseils & Guides IT
- **H2 :** Où acheter du matériel informatique neuf et garanti à Rabat ? Découvrez le showroom SESA Informatique à Hassan ; Imprimante Laser ou Jet d’encre professionnel : Comment optimiser vos coûts d’impression en entreprise ? ; PC Portable Professionnel ou Workstation : Quel ordinateur choisir pour votre activité à Rabat ? ; Comment réussir vos achats informatiques sur Bon de Commande (BC) et Appels d’Offres au Maroc ? ; Cahier des charges informatique : les éléments à préciser ; Un parc d’impression mieux dimensionné avec HP LaserJet ; PC portable professionnel ou workstation HP Z : choisir selon vos logiciels ; Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/a-propos`

- **Title actuel :** À propos de SESA Informatique — Rabat
- **Description actuelle :** Votre partenaire en matériel informatique neuf et professionnel à Hassan, Rabat.
- **H1 :** SESA Informatique, votre partenaire à Rabat
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/magasin`

- **Title actuel :** Notre Magasin à Hassan, Rabat — SESA Informatique
- **Description actuelle :** Retrouvez SESA Informatique au Boulevard Al Alaouiyine 30, Hassan, Rabat. Adresse, horaires, itinéraire et conseil pour votre matériel.
- **H1 :** Notre Magasin SESA
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/contact`

- **Title actuel :** Contacter SESA Informatique — Conseil & Devis
- **Description actuelle :** Contactez SESA à Rabat pour un devis, une disponibilité ou votre projet informatique.
- **H1 :** Parlons de votre projet informatique
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/garantie`

- **Title actuel :** Garantie constructeur & SAV — SESA Informatique
- **Description actuelle :** Contactez SESA pour la garantie constructeur et le suivi de votre matériel professionnel.
- **H1 :** Garantie constructeur & SAV
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/mentions-legales`

- **Title actuel :** Mentions légales — SESA Informatique
- **Description actuelle :** Informations légales, coordonnées et conditions de présentation des prix SESA.
- **H1 :** Mentions légales
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

### `/confidentialite`

- **Title actuel :** Protection des données personnelles — SESA Informatique
- **Description actuelle :** Utilisation des coordonnées, demandes de devis et inscriptions aux offres SESA.
- **H1 :** Politique de confidentialité
- **H2 :** Votre équipement IT. Notre équipe à vos côtés.
- **H3 :** Retrouvez-nous au showroom ; INSCRIVEZ-VOUS À NOTRE NEWSLETTER ; CATALOGUE ; ENTREPRISES & SERVICES ; SESA INFORMATIQUE
- **Canonical :** absent

## Annexe B — Inventaire des 39 fiches publiques

Toutes répondent 200, comportent un titre et des lignes techniques. Toutes les URL canoniques visent actuellement sesa.ma ; aucune ne contient Product/BreadcrumbList JSON-LD. Les noms ci-dessous sont ceux observés, sans correction de données. Les descriptions SEO actuelles font toutes plus de 200 caractères.

| URL existante | H1 actuel | Lignes techniques |
|---|---|---:|
| `/produit/01c105e1-d7fe-4649-9542-9f1de25505a0` | HP Zbook G1i | 14 |
| `/produit/0d1011df-e9f6-4146-95fc-d6e975da3706` | ECRAN HP 527pq Monitor 27" | 11 |
| `/produit/12fda69a-9257-4557-8235-a25ef9e7a3e2` | HP ProBook 4 G1i | 27 |
| `/produit/2916997e-998c-4c87-955c-51103caf70c0` | Ordinateur de bureau Dell Pro Tour | 37 |
| `/produit/3a20e510-3bc1-44cc-9592-7c074a067c7a` | HP Zbook 8G1i | 14 |
| `/produit/413c1b8b-a3d6-4ae6-99cc-dcf7790fac9a` | HP ProBook 4 G1i | 13 |
| `/produit/4ae99efc-71ce-48ed-901f-1808ce74683d` | HP EliteBook 8 G1i | 16 |
| `/produit/55d24e31-15b9-4eac-96a7-cf2c144d887d` | Écran 24" Full HD HP S3 Pro 324pv | 30 |
| `/produit/59b0a22d-0895-4917-8459-289a2fb0560f` | DELL 22 Monitor -P2222H (21,5") | 10 |
| `/produit/5f082dfa-c185-4a43-9ec5-8fb0d4db934a` | IMPRIMANTE HP M552DN Imprimantes Laser couleur Pro A4 | 46 |
| `/produit/63e4a845-c2ba-4f6a-8f81-a53dff5527a4` | HP LaserJet Enterprise M506dn | 36 |
| `/produit/65d1f2f5-44db-4dec-a74a-3cfdbe469b9a` | HP ProBook 4 G1iR | 13 |
| `/produit/66ff972a-0b6c-412e-be1d-d49a2b2ae337` | HP ProBook 4 G1iR | 27 |
| `/produit/6ef3b8e9-6011-4f22-8734-b0d0d4daff9d` | HP ProBook 4 G1i | 27 |
| `/produit/79ba7674-e6a6-4387-849a-c71f7f140f0e` | HP ScanJet Pro 2500 f1 | 37 |
| `/produit/79fe07e6-daae-442f-9bd5-53ef4df0fdeb` | ECRAN HP S3 Pro 322pv FHD | 10 |
| `/produit/7fccefe1-c033-4604-9456-c7f90ad2ddb9` | HP EliteBook 8 G1i | 15 |
| `/produit/83c01b24-18ef-4d07-b9a5-989020f0861e` | HP EliteBook 6 G1i | 15 |
| `/produit/9b176059-c81f-44bc-a6c0-870f6d01d9fb` | HP EliteBook 8 G1i | 15 |
| `/produit/a167d42c-2d64-4dac-90a3-8621954501bb` | LENOVO S27i-30 27" IPS panel 1920x1080 VGA-HDMI | 9 |
| `/produit/a3dcaf60-f41f-4c51-a6e1-07561e3d0fd6` | HP OFFICEJET PRO 9720 WF AIO | 15 |
| `/produit/abaaedf6-cc83-4552-a86a-f16133287ae3` | DELL latitude 3410 13-10110U 14" 4gb 1TB FreeDos | 16 |
| `/produit/b7b877f1-3615-402e-bff6-4340424bdcb4` | Imprimante Laser Couleur HP LaserJet Pro 3203dw (499N4A) | 69 |
| `/produit/b8689612-13fa-4777-8de1-5c5767303c8b` | ECRAN HP P22 G5 FHD MONITOR | 41 |
| `/produit/b949d82c-d7c7-4ec7-8b14-f5a0bf55a1d0` | DELL LATITUDE 3500 I3-8145U 15" 4GO 1TO FRD | 15 |
| `/produit/ba60d58e-0e72-4b78-ab3d-b9e62a076dab` | Scanner Epson Perfection V19 | 38 |
| `/produit/c292dea9-61f2-44ec-946c-fdd191e9c16b` | IMPRIMANTE HP M211DW MONO | 49 |
| `/produit/c6515dd5-1cad-4107-8e65-c0beee112bf7` | LENOVO LOQ 15IAX9E i5 12450HX 15,6"FHD 16 Go 512 Go SSD RTX2050_B_4GB Win 11 Hom | 35 |
| `/produit/c84ecd7c-e034-4ab1-b314-c8e41a3b5c4e` | ECRAN HP P22 G4 FHD MONITOR | 49 |
| `/produit/c8fa1fc5-9c65-4502-a953-f8df16c3aefc` | HP ProBook 4 G1iR | 13 |
| `/produit/d0f8997d-eccb-4871-a5a6-97d08a6b09b2` | LENOVO Thinkbook 14 G6 IRL i5-1335U 14'' 1920x1200 8Go 512Go SSD Free Dos Grey 12 Mois | 24 |
| `/produit/d1c4d0cd-7646-4cce-b9cf-ae6d1c2a214b` | Imprimante HP Color Laser 6700dn SFP resaux couleur | 90 |
| `/produit/d1fb167a-c726-455f-9836-c3d03fc2ae5e` | HP Color LaserJet Enterprise M555dn | 33 |
| `/produit/e23cda94-94b1-4e4b-8632-1d441981a993` | HP 250 G8 i5-1035 4Gb RAM 1T HDD Dos | 29 |
| `/produit/e36a1b40-c79e-4a1f-a808-f605e567a607` | DELL 24 Monitor -P2418HT (23,8") TACTILE | 37 |
| `/produit/f282d79a-09d2-4596-bfd9-595222549a62` | Asus ZenBook UX481F Duo 14" Core i7 1,8 GHz - HDD 1 To - 16 Go | 31 |
| `/produit/hp-monitor` | Écran HP Series 7 Pro 724pf | 28 |
| `/produit/probook` | HP ProBook 4 G1iR 14 | 28 |
| `/produit/zbook` | HP Zbook 8G1i | 14 |
