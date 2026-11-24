# Scénarios E2E — recherche d’offres

Les scénarios utilisent les données de démonstration chargées dans la base locale
avec `npm run db:init`. L’utilisateur commence déconnecté et choisit un profil
étudiant dans la connexion de démonstration. Un étudiant voit les offres publiées;
les offres soumises, en attente, attribuées ou archivées ne doivent pas apparaître
dans son catalogue. La recherche porte sur une expression continue du titre,
ignore la casse et les espaces en bordure.

| Numéro | État initial et données nécessaires | Actions dans l’interface | Résultat attendu |
|---|---|---|---|
| **Scénario 1 — Recherche avec résultat** | Base locale initialisée avec les données de démonstration. Utilisateur déconnecté, puis connecté comme étudiant (par exemple Lucas Dupont). L’offre publiée **« API REST de facturation »** est présente. | Ouvrir **Offres de stage**, saisir `api rest` dans **Rechercher par titre**. | Le catalogue affiche **« API REST de facturation »**. Les offres dont le titre ne contient pas cette expression ne sont pas affichées. Aucune offre non publiée n’est visible pour l’étudiant. |
| **Scénario 2 — Recherche sans résultat** | Même état initial et même profil étudiant que pour le scénario 1. La base de démonstration ne contient aucune offre dont le titre contient l’expression unique `e2e-introuvable-8472`. | Ouvrir **Offres de stage**, saisir `e2e-introuvable-8472` dans **Rechercher par titre**. | Aucune ligne d’offre n’est affichée et le message **« Aucune offre ne correspond à la recherche. »** apparaît. |

Les titres et règles de visibilité ci-dessus s’appuient sur les données de
démonstration et le comportement décrits dans `docs/semaine-4/bilan.md`.
