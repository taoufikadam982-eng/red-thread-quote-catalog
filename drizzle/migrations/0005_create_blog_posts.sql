CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Guides d''achat',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY blog_public_read ON public.blog_posts FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY blog_admin ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.blog_posts (title, slug, category, excerpt, content, published, created_at) VALUES
($t$PC portable professionnel ou workstation HP Z : choisir selon vos logiciels$t$, 'portable-ou-workstation-hp-z', $t$Guides d'achat$t$, $t$Mobilité, calcul, création : partez des usages réels de votre équipe.$t$,
$t$## Commencer par le métier, pas par la fiche technique
Bureautique, visioconférence et gestion ne sollicitent pas le matériel comme le rendu 3D ou la simulation. Listez les logiciels utilisés, leurs recommandations et le nombre d’applications ouvertes simultanément.

## Le portable professionnel pour la mobilité
Un portable professionnel convient aux collaborateurs qui alternent bureau et déplacements. Comparez le poids, la connectique, la capacité mémoire et les possibilités de raccordement à un écran. L’autonomie dépend de la configuration et de l’usage.

## Une workstation pour les charges exigeantes
Une station HP Z est à envisager pour la CAO, la modélisation et les applications de création. Vérifiez les certifications recommandées par l’éditeur du logiciel, le processeur, la mémoire et la carte graphique de la référence exacte.

## Préparer votre demande
Transmettez à SESA les logiciels, les quantités, le besoin de mobilité et le budget indicatif. La configuration et la garantie constructeur seront précisées sur le devis.$t$, true, now() - interval '2 days'),
($t$Un parc d’impression mieux dimensionné avec HP LaserJet$t$, 'parc-impression-hp-laserjet', 'Nouveautés Matériel', $t$Volumes, réseau et consommables : les points à comparer avant de renouveler vos imprimantes.$t$,
$t$## Mesurer le volume réel
Relevez les pages imprimées par mois et par service. Séparez les documents monochromes des impressions couleur, et identifiez les besoins de numérisation. Une seule imprimante ne répond pas nécessairement à tous les usages.

## Comparer le coût d’utilisation
Le prix d’achat ne suffit pas. Comparez le rendement des consommables de la référence exacte, le recto verso, les bacs papier et le volume mensuel recommandé par le fabricant.

## Préparer le raccordement au réseau
Vérifiez la compatibilité avec les postes et les fonctions réseau nécessaires. Pour les documents sensibles, étudiez les options de sécurité réellement proposées par le modèle et les procédures internes de votre organisation.

## Une sélection cohérente
Communiquez les volumes, le nombre d’utilisateurs et les équipements existants. SESA peut préparer une sélection LaserJet adaptée, avec disponibilité et consommables à confirmer.$t$, true, now() - interval '1 day'),
($t$Cahier des charges informatique : les éléments à préciser$t$, 'cahier-des-charges-informatique', 'Entreprises & Marchés', $t$Une expression de besoin claire facilite la comparaison des offres et la réception du matériel.$t$,
$t$## Décrire les usages et quantités
Précisez les catégories de matériel, les logiciels, les quantités par site et les périphériques nécessaires. Distinguez les exigences indispensables des options souhaitées.

## Rendre les critères vérifiables
Indiquez les caractéristiques minimales utiles, la connectique, les accessoires et les conditions de garantie attendues. Évitez les formulations ambiguës ; demandez une fiche technique correspondant à chaque référence proposée.

## Organiser la réponse et la réception
Définissez les documents demandés, l’échéance, le lieu de livraison ou de retrait et les critères de réception. Les exigences administratives doivent être vérifiées selon la procédure applicable et par les responsables compétents.

## Transmettre le dossier à SESA
Votre organisme, ICE, contact et liste des besoins permettent de préparer la consultation. Le formulaire Entreprises & Marchés centralise ces éléments ; les pièces complémentaires peuvent être adressées à sesa@menara.ma.$t$, true, now());