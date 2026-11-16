# Matrice — guides, senseurs et bonnes pratiques Web 2

L'inventaire distingue les consignes qui guident le travail des contrôles qui produisent un résultat vérifiable. La comparaison Web 2 ci-dessous se limite aux séances 02 à 05 fournies ; elle ne prétend pas couvrir tout le programme.

## Identification et classification des guides et senseurs

| Catégorie | Mécanisme et emplacement | Consigne ou exemple concret | Vérification / constat |
|---|---|---|---|
| Guide inférentiel | `.github/copilot-instructions.md` | Séparer `controllers` → `services` → `repositories`; utiliser `HttpError` pour les erreurs prévues; transmettre le jeton brut dans `Authorization`, sans `Bearer`. | Fichier lu. Sa présence ne prouve pas qu'un assistant l'a consulté ni suivi. |
| Guide de projet | `docs/architecture.md`, `README.md`, `backend/API.md` | Architecture, installation, routes, commandes et responsabilités des couches. | Documents consultés; références de projet, pas senseurs. |
| Guide de contribution | `.github/pull_request_template.md` | Checklist de vérification, couverture des erreurs et droits, mise à jour de l'API et test navigateur. | Fichier lu; la checklist ne s'exécute pas automatiquement. |
| Guide computationnel | `package.json` | `npm run check` lance lint, typecheck, tests et builds. | Commande exécutée avec succès; détails dans le bilan. |
| Guide computationnel | `backend/.oxlintrc.json`, `frontend/.oxlintrc.json` | Règles Oxlint, dont `eqeqeq`, interdiction de `any`, règles React hooks. | Lint réussi dans les deux workspaces. |
| Guide computationnel | `backend/tsconfig.json`, `frontend/tsconfig.app.json` | Mode strict, `noUncheckedIndexedAccess`, `noUnusedLocals` et `noUnusedParameters`. | Typecheck réussi dans les deux workspaces. |
| Guide computationnel | `backend/vitest.config.ts`, `frontend/vite.config.ts` | Configuration Vitest backend et environnement `jsdom` frontend. | 122 tests backend et 48 tests frontend réussis. |
| Guide computationnel | `.npmrc` | `ignore-scripts=true` empêche npm d'exécuter les scripts d'installation des dépendances. | Configuration lue; effet non retesté pendant cette séance. |
| Senseur inférentiel | Aucun outil automatique de revue IA identifié dans les fichiers du dépôt. | Aucun rapport de revue IA automatique à relever. | La consigne Copilot est un guide, pas un senseur. |
| Senseur computationnel | Oxlint, TypeScript, Vitest et builds, via `npm run check` | Contrôles statiques, types, comportement testé et compilation. | Tous réussis. Le premier lancement a été bloqué par `listen EPERM`; le relancement autorisé a réussi. |

Il n'y a pas d'`AGENTS.md` séparé : le guide IA du dépôt est `.github/copilot-instructions.md`. Aucun générateur de code n'a été identifié dans les scripts du projet.

## Comparaison avec les bonnes pratiques des séances Web 2 fournies

| Attente de Web 2 (source) | Guide ou pratique dans le projet | Couverture | Écart ou suite proposée |
|---|---|---|---|
| API HTTP/REST, codes de statut adaptés et validation des données (`seance-02.pdf`, p. 2–7, 18). | `.github/copilot-instructions.md` et `docs/architecture.md` prescrivent validation HTTP et erreurs centralisées via `HttpError`. | Correspond. | Aucune modification de guide requise pour ce point. |
| Documenter les routes et tester l'API indépendamment du frontend avec REST Client (`seance-02.pdf`, p. 8–18). | Le guide Copilot et le template PR demandent de mettre à jour `backend/API.md`, les fichiers `backend/http/*.http` et les tests. | Partielle. | `backend/http/offers.http` contient des exemples `GET` et `POST /applications`, mais `backend/API.md` ne documente pas les candidatures et il manque un exemple `DELETE /applications/:id`. |
| Distinguer authentification et autorisation, vérifier les JWT et utiliser 401/403 (`seance-03.pdf`, p. 2–5, 7–14). | Les guides documentent la vérification serveur du jeton et des rôles; le projet relit les rôles en base. | Correspond; le projet adopte une vérification des rôles plus stricte que l'exemple de cours. | Les claims du jeton se limitent à `{ kind, id }`; les rôles sont relus en base plutôt que pris du JWT. |
| Utiliser une clé JWT secrète distincte par environnement et ne pas publier les secrets (`seance-03.pdf`, p. 9). | `npm run setup` crée une clé locale; `.gitignore` ignore `.env`; `backend/src/config.ts` impose une longueur minimale. | Partielle. | Les guides devraient préciser des secrets séparés par environnement et interdire la réutilisation de la clé locale en production. |
| Ne pas stocker de mot de passe en clair; utiliser un hash salé et asynchrone (`seance-04.pdf`, p. 2–8, 12–18). | Le mode démo n'utilise pas de mot de passe et est interdit en production par les consignes Copilot. | Non applicable au mode d'authentification actuel; garde de production partielle. | Si l'authentification par mot de passe est ajoutée, documenter le hash salé et ne jamais stocker le mot de passe en clair. |
| Éviter les injections XSS; ne pas insérer le contenu utilisateur avec `innerHTML` (`seance-05.pdf`, p. 10, 15). | Les valeurs sont rendues par JSX; aucune utilisation de `innerHTML` ou `dangerouslySetInnerHTML` n'a été trouvée dans `frontend/src`. | Pratique respectée dans le code examiné, mais non formulée dans les guides. | Ajouter une consigne explicite sur le rendu de texte et l'injection de HTML non fiable. |

La comparaison porte seulement sur les PDF fournis (`seance-02.pdf` à `seance-05.pdf`). TypeScript et React apparaissent dans d'autres séances de la liste générale du cours et ne sont donc pas présentés comme hors Web 2.

## Mécanismes du projet au-delà des séances fournies

| Mécanisme supplémentaire | Présence dans le projet | Différence par rapport aux supports consultés |
|---|---|---|
| Harnais agentique et guide Copilot | `.github/copilot-instructions.md` encadre le travail de l'assistant IA. | Les séances fournies ne présentent pas de consignes ni de harnais pour un agent IA. |
| Chaîne de vérifications automatisées | `npm run check` combine Oxlint, vérification TypeScript, Vitest et builds. | Les supports montrent des tests d'API avec REST Client, mais pas cette chaîne de contrôles automatisés intégrés. |
| Tests automatisés avec Vitest | Suites backend et frontend. | Ajoutent des tests exécutables en lot aux exemples REST Client des supports. |
| Senseur architectural proposé | Proposition `architecture:check` documentée dans le bilan. | Proposition propre au projet, non implémentée et non présentée dans les séances fournies. |

Cette dernière comparaison ne permet pas d'affirmer que ces mécanismes sont absents de l'ensemble du cours Web 2; elle constate seulement qu'ils ne figurent pas dans les séances 02–05 consultées.
