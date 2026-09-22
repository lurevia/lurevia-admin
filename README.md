# Lurevia Admin

Back-office de la boutique Lurevia, construit avec [react-admin](https://marmelab.com/react-admin/). Dépôt séparé de la boutique (`lurevia.github.io`) — ils partagent la même API (`lurevia.api`).

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner VITE_API_URL si besoin
npm run dev             # http://localhost:5174
```

## Déploiement GitHub Pages

Le workflow `Deploy admin to GitHub Pages` publie automatiquement `dist/` après
chaque push sur `main` (ou manuellement depuis l'onglet Actions). Configurez
`VITE_API_URL` comme variable du dépôt avant le déploiement, et sélectionnez
**GitHub Actions** comme source de publication dans les paramètres Pages.
L'application est configurée pour l'URL du projet :
`https://lurevia.github.io/lurevia-admin/`.

## Côté API — à faire une fois

1. Depuis le backend unifié, appliquer les migrations Prisma versionnées :
   ```bash
   cd lurevia.api
   npm run prisma:migrate
   ```
2. Autoriser l'origine de l'admin dans le CORS de l'API — dans `lurevia.api/.env` :
   ```
   CORS_ORIGINS=http://localhost:5173,http://localhost:5174
   ```
3. Créer (ou promouvoir) un compte `role: ADMIN` en base — c'est le seul type de compte qui peut se connecter ici (le login refuse tout `role: CUSTOMER`).

## Ce que couvre cet espace admin

- **Tableau de bord** : chiffre d'affaires 30 jours, commandes en attente, clients, produits en stock faible, demandes de suppression en attente.
- **Produits / Catégories** : CRUD complet.
- **Commandes** : vue de toutes les commandes (tous clients confondus), détail et changement de statut.
- **Utilisateurs** : liste, recherche, changement de rôle (promouvoir/rétrograder un admin).
- **Avis** : modération (suppression d'un avis inapproprié).
- **Demandes de suppression de compte** : validation manuelle (approuver/rejeter avec note interne).
- **Notifications** : cloche dans la barre du haut, alimentée à chaque action cliente qui modifie le serveur (nouvelle commande, nouvel avis, nouveau feedback, nouvelle demande de suppression). Écriture immédiate côté API (pas de recalcul à la lecture), lecture paginée — pensé pour rester rapide même à fort volume.

## Limite connue

L'approbation d'une demande de suppression de compte ne supprime pas automatiquement le compte en base : le schéma protège l'historique de commandes (`Order.userId` est en `onDelete: Restrict`). L'approbation marque juste la demande comme traitée ; la suppression effective (ou l'anonymisation) du compte reste une action manuelle à faire séparément si le client a des commandes existantes.
