# Fiche produit PC professionnelle — Étape 1 (état des lieux) et suite

## Ce qui existe déjà
- La page produit a déjà deux colonnes : galerie jusqu'à 6 photos, badges, référence, 4 cartes "Configuration en bref", bloc prix/quantité, "Ajouter à ma liste de devis", "Demander un devis immédiat", WhatsApp, fiche technique groupée, 3 cartes d'aide à droite, FAQ, "Vous aimerez aussi".
- Le site fonctionne en devis uniquement : aucun paiement en ligne. Le bouton principal reste "Ajouter à ma liste de devis". Je n'ajoute pas de vrai panier.
- Les caractéristiques d'un produit sont stockées dans **un seul champ texte libre**. La fiche technique est devinée en découpant ce texte. Il n'y a ni introduction, ni points forts, ni groupes de caractéristiques gérés par l'admin.

## Ce qui manque
- Une introduction rédigée, des points forts, l'utilisation recommandée et des informations complémentaires par produit.
- Des groupes de caractéristiques structurés (titre de groupe, libellé, valeur), modifiables et réordonnables dans l'admin.

## Étape 2 — Modèle de page réutilisable
- Ajouter des champs optionnels au produit : introduction, points forts (liste), utilisation recommandée, informations complémentaires, fiche technique (groupes avec lignes). Rien d'existant n'est écrasé.
- Si la fiche structurée est vide, la page garde l'affichage actuel. Les 38 produits ne changent donc pas.
- Page : bloc "Présentation du produit", "Points forts", "Utilisation recommandée", puis la fiche technique avec en-têtes de groupe sombres et lignes alternées, lisible sur téléphone sans défilement horizontal. Les 4 cartes du haut (Processeur, RAM, Stockage, Écran) sont lues dans la fiche structurée en priorité.
- Le bouton "Obtenir un devis" de la colonne de droite et le WhatsApp ne changent pas.

## Étape 2 bis — Admin
- Dans le formulaire produit, ajouter un onglet "Fiche détaillée" :
  - introduction ;
  - points forts (ajouter ou supprimer) ;
  - groupes de caractéristiques (ajouter, renommer, monter ou descendre, supprimer) ;
  - lignes libellé/valeur (ajouter, supprimer, réordonner) ;
  - un lien "Voir la fiche" pour prévisualiser.
- L'enregistrement est réservé aux administrateurs, comme aujourd'hui.

## Étapes 3 et 4 — Produit pilote
- Un seul PC portable du catalogue, avec son vrai nom, sa référence, son prix, ses photos et sa disponibilité.
- Je remplis sa fiche uniquement à partir de la page officielle du fabricant pour cette référence exacte. Une donnée non trouvée est omise.
- Aucune autre fiche n'est réécrite avant votre validation.

## Étape 5 — Vérification
- PC et téléphone : galerie, liste de devis, devis immédiat, WhatsApp, modification dans l'admin, puis contrôle de la page publique. Des tests vérifient les règles : fiche vide = affichage actuel, lignes vides masquées.

## Détails techniques
- La migration ajoute des colonnes au produit : `intro`, `use_cases` et `extra_info` en texte, `highlights` en liste de texte, `spec_groups` en JSON (`[{title, rows:[{label, value}]}]`). Tout est optionnel et la sauvegarde par lot (`save_product_batch`) reste compatible.
- La validation passe par le schéma Zod du produit côté client et serveur. La lecture publique ajoute ces colonnes à la fonction de catalogue.
