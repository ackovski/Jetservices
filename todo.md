# JET Services - TODO

## Pages Publiques

- [x] Page d'accueil (Hero, services clés, CTA)
- [x] Page "Nos Services" (6 services détaillés)
- [x] Page "Destinations" (France, Canada, Maroc, Tunisie)
- [x] Page "À Propos" (Mission, valeurs, équipe)
- [x] Page "Contact" (Formulaire sécurisé + coordonnées)

## Navigation & Layout

- [x] Header avec navigation responsive
- [x] Footer avec liens réseaux sociaux et mentions légales
- [x] Menu mobile adaptatif

## Espace Client (Authentification & Sécurité)

- [x] Page de connexion/inscription (via Manus OAuth)
- [x] Tableau de bord client
- [x] Suivi des dossiers par service (Campus France, Visa, Logement)
- [x] Gestion des documents (téléversement et consultation)
- [x] Contrôles d'accès et vérification de propriété
- [x] Stockage sécurisé des documents (infrastructure prête)

## Design & Styling

- [x] Palette de couleurs élégante et professionnelle
- [x] Typographie raffinée
- [x] Espacements généreux et mise en page irréprochable
- [x] Responsive design mobile-first

## Infrastructure & Tests

- [x] Configuration de la base de données (schémas)
- [x] Procédures tRPC pour les services
- [x] Contrôles de sécurité (vérification d'accès)
- [x] Tests unitaires (Vitest)
- [x] Validation des formulaires
- [x] Implémentation complète du flux d'upload S3 avec backend (server/routers/documents.ts)
- [x] Tests d'intégration pour les flux de documents


## Amélioration Design & Visuels (Phase 2)

- [x] Générer/récupérer images pour les 6 services
- [x] Générer/récupérer images pour les 4 destinations
- [x] Générer/récupérer image hero pour l'accueil
- [x] Enrichir la palette de couleurs (couleurs distinctes par section)
- [x] Mettre à jour les composants Services avec images et couleurs
- [x] Mettre à jour les composants Destinations avec images et couleurs
- [x] Améliorer la section Accueil avec visuels
- [x] Tester la responsivité avec les nouvelles images (16 tests passés)
- [x] Vérifier que le design reste naturel et professionnel


## Système RBAC (Role-Based Access Control)

- [ ] Étendre le schéma avec tables de rôles et permissions
- [ ] Implémenter les procédures tRPC pour la gestion des rôles
- [ ] Créer le tableau de bord administrateur
- [ ] Ajouter le système d'invitation par email
- [ ] Tester et valider les permissions
