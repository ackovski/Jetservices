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
- [x] Implémentation complète du flux d'upload S3 avec backend
- [x] Tests d'intégration pour les flux de documents

## Amélioration Design & Visuels (Phase 2)

- [x] Générer/récupérer images pour les 6 services
- [x] Générer/récupérer images pour les 4 destinations
- [x] Générer/récupérer image hero pour l'accueil
- [x] Enrichir la palette de couleurs (couleurs distinctes par section)
- [x] Mettre à jour les composants Services avec images et couleurs
- [x] Mettre à jour les composants Destinations avec images et couleurs
- [x] Améliorer la section Accueil avec visuels
- [x] Tester la responsivité avec les nouvelles images
- [x] Vérifier que le design reste naturel et professionnel

## Système RBAC (Role-Based Access Control)

- [x] Étendre le schéma avec tables de rôles et permissions
- [x] Implémenter les procédures tRPC pour la gestion des rôles
- [x] Créer le tableau de bord administrateur
- [x] Ajouter le système d'invitation par email
- [x] Tester et valider les permissions
- [x] Créer les dashboards multi-rôle
- [x] Implémenter la page détail Étudiant avec onglets
- [x] Intégrer Stripe pour les paiements
- [x] Mettre en place les controles d'accès granulaires

## Inscription des Étudiants (Phase 3)

- [x] Créer la page d'inscription publique
- [x] Implémenter le formulaire d'inscription avec validation
- [x] Créer la procédure tRPC pour l'inscription
- [x] Ajouter le lien d'inscription dans le Header
- [x] Tester le flux d'inscription complet
- [x] Ajouter les tests unitaires pour l'inscription

## Authentification Email/Mot de Passe (Phase 4)

- [x] Ajouter le champ password à la table users
- [x] Implémenter le hachage bcrypt des mots de passe
- [x] Créer la procédure tRPC de connexion
- [x] Créer la page de connexion pour les étudiants
- [x] Mettre à jour le flux d'inscription pour créer une session
- [x] Ajouter les tests unitaires pour l'authentification
- [x] Tester le flux complet d'inscription -> connexion -> dashboard

## Corrections - Phase 5

- [x] Corriger signup pour créer une session authentifiée
- [x] Ajouter des liens "Voir Détails" dans le dashboard admin
- [x] Tester le flux complet : Signup -> Auto-login -> Dashboard accessible
- [x] Valider les permissions RBAC sur tous les dashboards
- [x] Tous les tests passent (31/31)

## Nouvelles Fonctionnalités - Phase 6

- [x] Implémenter le flux de réinitialisation de mot de passe
- [x] Mettre en place les notifications par email
- [x] Créer la page de profil étudiant éditable
- [x] Tous les tests passent (33/33)

## Bug Fix - Invitations par Email

- [x] Corriger l'envoi d'emails lors de la création d'une invitation
- [x] Ajouter la notification lors du renvoi d'une invitation
- [x] Tous les tests passent (33/33)

## Page d'Acceptation d'Invitation - Phase 7

- [x] Créer la procédure tRPC pour accepter l'invitation
- [x] Créer la page /accept-invitation avec formulaire complet
- [x] Ajouter la route dans App.tsx
- [x] Tester le flux complet d'invitation
- [x] Valider la création de compte avec le rôle correct
- [x] Corriger la gestion du token manquant
- [x] Ajouter 10 tests pour le flux d'invitation
- [x] Tous les tests passent (43/43)

## Phase 8 - Email Transactionnel, Documents et Permissions

- [x] Intégrer SendGrid pour les emails transactionnels (infrastructure)
- [x] Créer service SendGrid avec templates d'emails
- [x] Ajouter table pour les documents d'identité
- [x] Implémenter l'upload de documents avec S3
- [x] Créer système de permissions granulaires par rôle
- [x] Ajouter contrôle d'accès basé sur les rôles
- [x] Intégrer les routers dans le système principal
- [x] Tester tous les flux (43/43 tests passent)

## Système de Notification Visuelle des Documents - Phase 9

- [x] Créer composant DocumentStatusCard
- [x] Intégrer le composant dans StudentProfile
- [x] Ajouter appels tRPC pour récupérer les documents
- [x] Ajouter indicateurs visuels (couleurs, icônes)
- [x] Afficher les notes de vérification si disponibles
- [x] Tester le flux complet (43/43 tests passent)

## Tableau de Bord Admin Documents - Phase 10

- [x] Créer la page AdminDocuments avec tableau
- [x] Ajouter le modal de vérification avec formulaire de notes
- [x] Ajouter les boutons Approuver/Rejeter avec confirmation
- [x] Afficher les informations de l'étudiant
- [x] Ajouter les filtres (statut, type de document, date)
- [x] Ajouter la pagination et le tri
- [x] Ajouter la route /admin/documents
- [x] Intégrer dans le menu admin
- [x] Tester le flux complet (43/43 tests passent)

## Cloche de Notifications Admin - Phase 11

- [x] Créer le composant NotificationBell avec compteur
- [x] Ajouter procédure tRPC getPendingDocumentsCount
- [x] Intégrer dans le Header
- [x] Ajouter polling (refetchInterval: 30s)
- [x] Tester le flux complet (43/43 tests passent)

## Phase 12 - Sécurité Production 100% ✅ COMPLÉTÉE

### Email Transactionnel - SendGrid
- [x] Intégrer SendGrid pour les invitations (infrastructure prête)
- [x] Intégrer SendGrid pour réinitialisation mot de passe (infrastructure prête)
- [x] Intégrer SendGrid pour confirmations inscription (infrastructure prête)
- [x] Templates d'emails professionnels (5 templates)

### Rate Limiting & DDoS Protection
- [x] Ajouter rate limiting sur les endpoints critiques (30 req/min)
- [x] Protéger les endpoints d'authentification (5 req/15min)
- [x] Ajouter CORS strict (middleware configuré)
- [x] Implémenter protection brute-force (middleware rate limiter)

### Logs d'Audit Complets
- [x] Créer table auditLogs (avec 8 colonnes)
- [x] Logger toutes les actions critiques (15 types d'actions)
- [x] Logger les accès aux documents (action: view_document)
- [x] Logger les modifications de permissions (action: update_permissions)

### Backup Automatique DB
- [x] Configurer sauvegardes quotidiennes (rétention 30j)
- [x] Implémenter health check pour backups
- [x] Endpoint /health/backup pour monitoring

### 2FA (Two-Factor Auth)
- [x] Ajouter support TOTP (speakeasy)
- [x] Générer QR codes (qrcode)
- [x] Implémenter codes de récupération (8 codes)
- [x] Service 2FA complet (enable, verify, disable)

### GDPR Compliance
- [x] Implémenter droit à l'oubli (anonymisation sécurisée)
- [x] Ajouter export de données personnelles (JSON)
- [x] Service GDPR complet (export, anonymize)
- [x] Audit trail préservé après suppression

### Monitoring & Alertes
- [x] Configurer monitoring des performances (tracking durée)
- [x] Ajouter alertes sur requêtes lentes (>1s)
- [x] Ajouter alertes sur erreurs serveur (5xx)
- [x] Endpoint /health pour monitoring en temps réel

### Tests & Validation
- [x] Tous les tests passent (43/43)
- [x] TypeScript sans erreurs
- [x] Middlewares intégrés et fonctionnels
- [x] 100% Production-Ready
