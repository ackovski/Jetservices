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

- [x] Étendre le schéma avec tables de rôles et permissions (10 nouvelles tables)
- [x] Implémenter les procédures tRPC pour la gestion des rôles (4 routers)
- [x] Créer le tableau de bord administrateur (AdminDashboard, ConseillerDashboard, StudentDashboard)
- [x] Ajouter le système d'invitation par email (router invitations complet)
- [x] Tester et valider les permissions (16 tests passés)
- [x] Créer les dashboards multi-rôle (Admin, Conseiller, Étudiant)
- [x] Implémenter la page détail Étudiant avec onglets
- [x] Intégrer Stripe pour les paiements
- [x] Mettre en place les controles d'accès granulaires


## Inscription des Étudiants (Phase 3)

- [x] Créer la page d'inscription publique (/signup)
- [x] Implémenter le formulaire d'inscription avec validation
- [x] Créer la procédure tRPC pour l'inscription
- [x] Ajouter le lien d'inscription dans le Header
- [x] Tester le flux d'inscription complet
- [x] Ajouter les tests unitaires pour l'inscription (9 tests passés)


## Authentification Email/Mot de Passe (Phase 4)

- [x] Ajouter le champ `password` à la table `users`
- [x] Implémenter le hachage bcrypt des mots de passe
- [x] Créer la procédure tRPC de connexion (email/mot de passe)
- [x] Créer la page de connexion pour les étudiants (/login)
- [x] Mettre à jour le flux d'inscription pour créer une session
- [x] Ajouter les tests unitaires pour l'authentification (28 tests passés)
- [x] Tester le flux complet d'inscription -> connexion -> dashboard


## Corrections - Phase 5

- [x] Corriger signup pour créer une session authentifiée (setSessionCookie)
- [x] Ajouter des liens "Voir Détails" dans le dashboard admin pour chaque étudiant
- [x] Tester le flux complet : Signup -> Auto-login -> Dashboard accessible
- [x] Valider les permissions RBAC sur tous les dashboards
- [x] Tous les tests passent (31/31)


## Nouvelles Fonctionnalités - Phase 6

- [x] Implémenter le flux de réinitialisation de mot de passe
  - [x] Ajouter table `passwordResets` pour les tokens de réinitialisation
  - [x] Créer procédures tRPC `requestReset`, `verifyToken`, `resetPassword`
  - [x] Créer page `/forgot-password` pour demander la réinitialisation
  - [x] Créer page `/reset-password/:token` pour réinitialiser le mot de passe
  - [x] Ajouter lien "Mot de passe oublié" dans le formulaire de connexion
  - [x] Flux complet avec tokens de 24h et validation

- [x] Mettre en place les notifications par email
  - [x] Créer emailService.ts avec templates d'emails
  - [x] Envoyer email de confirmation après inscription
  - [x] Envoyer email de notification pour mises à jour de dossiers
  - [x] Intégration avec notifyOwner pour les notifications
  - [x] Support pour rendez-vous et messages

- [x] Créer la page de profil étudiant éditable
  - [x] Créer page `/student-profile` accessible depuis le dashboard
  - [x] Ajouter formulaire d'édition des informations personnelles
  - [x] Ajouter section pour les documents d'identité
  - [x] Ajouter section pour les préférences d'études
  - [x] Utiliser la procédure tRPC `clientProfile.updateProfile`
  - [x] Ajouter validation avec Zod
  - [x] Tous les tests passent (33/33)
