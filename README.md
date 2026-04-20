# SADA Ops Center

## Présentation
Le **SADA Ops Center** est une plateforme stratégique et intelligente de "planification, pilotage et d'optimisation opérationnel". Conçue pour une scalabilité massive, elle permet à la direction, aux managers centraux et aux agents terrain de gérer et monitorer plus de 10 000 PMEs réparties à travers différents pays en temps réel.

## Rôles et Autorisations
L'architecture de SADA s'articule autour de 4 profils utilisateurs distincts :
- **CEO (Directeur Général)** : Vision Macro, Tableaux de bord stratégiques de revenus, santé IA, alertes de criticité. Dispose d'un module Chatbot IA pour l'assistance à la décision.
- **Manager** : Planification, revue des KPI d'équipe, assignation dynamique de nouvelles PME aux agents terrain.
- **Agent Terrain (Sales)** : Gestion de l'onboarding, assignation, et interaction directe avec les PMEs (check-in géolocalisés, mise à jour des KYC, changements de statuts).
- **Agent Support** : Opère le SADA SOP (Standard Operating Procedure) Resolver. Résout les tickets via des processus scénarisés selon le type d'incident (Technologie, Financier, Juridique).

## Fonctionnalités Clés
- 📊 **Tableau de Bord KPI** : Vue dynamique par rôle des métriques de MRR, d'acquisition et de tickets P1.
- 🏢 **CRM Terrain SADA** : Fiches d'identité PME complètes affichant les documents KYC, les scores d'IA, et les timeline d'actions (appels, visites, onboarding).
- ⚙️ **Gestionnaire de SOP (Admin)** : Interface permettant à l'administration d'éditer ou de créer les processus standardisés (SOP) que le support utilise pour résoudre les problèmes clients.
- 🏆 **Leaderboards** : Classement en direct des performances des "Sales" (PME gérées/onboardées) et des agents "Support" (Tickets résolus).
- 🗺️ **Heatmap Interactive** : Module Leaflet de géolocalisation pour un pilotage visuel par statut / zone géographique.
- 🤖 **Assistant IA (Widget CEO)** : Widget de consultation rapide de modèle d'IA (simulé) avec interactions asynchrones et pop-ups autonomes.

## Stack Technique
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS (UI Premium, Variables CSS, Mode Sombre/Clair)
- **Composants et Icônes** : Lucide React (Icônes SVG vectorielles)
- **Visualisation de Données** : Recharts (Radar, Area, Bar, Pie charts) et React-Leaflet (Cartes géographiques analytiques)
- **Architecture de Données** : Mock local évolutif vers API REST / GraphQL.

## Déploiement Local

Pour exécuter ce projet en local :

1. Assurez-vous d'avoir \`Node.js\` d'installé.
2. Clonez ce dépôt.
3. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
4. Lancez le serveur de développement :
   \`\`\`bash
   npm run dev
   \`\`\`
5. Ouvrez [http://localhost:3000](http://localhost:3000) sur votre navigateur.

> Note technique : Le projet n'exécute pour l'instant qu'une base de données simulée. Les identifiants de connexion au lancement nécessitent simplement la sélection du profil (ex: "Connexion CEO").

---
**© 2026 SADA — Tous droits réservés.**
