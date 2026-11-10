# Bilan — semaine 3 du projet : harnais agentique

Les deux matrices demandées sont aussi disponibles séparément : [guides, senseurs et bonnes pratiques Web 2](matrice-guides-senseurs.md) et [traçabilité des tests par rapport aux exigences](matrice-tests-exigences.md).

## Guides et senseurs repérés

| Catégorie | Mécanisme et emplacement | Consigne ou exemple concret | Vérification pendant la séance |
|---|---|---|---|
| Guide inférentiel | `.github/copilot-instructions.md` | Demande de garder les couches backend séparées (`controllers` → `services` → `repositories`) ; les erreurs prévues passent par `HttpError` ; l'en-tête `Authorization` contient le jeton brut sans `Bearer`. | Fichier lu. Sa présence ne prouve pas qu'une autre IA l'a consulté ni suivi. |
| Guide de projet | `docs/architecture.md`, `README.md`, `backend/API.md` | Décrivent l'architecture MVVM/backend, l'installation, les routes et les commandes. Exemple : les services ne doivent pas dépendre d'Express (`docs/architecture.md`, section Backend). | Documents consultés ; ce sont des références de projet, pas des senseurs. |
| Guide de contribution | `.github/pull_request_template.md` | Checklist : exécuter `npm run check`, couvrir les erreurs et droits, mettre à jour l'API et tester dans le navigateur. | Fichier lu ; la checklist ne s'exécute pas automatiquement. |
| Guide computationnel | `package.json` | Le script `check` enchaîne lint, typecheck, tests et builds. | `npm run check` exécuté et réussi (détails ci-dessous). |
| Guide computationnel | `backend/.oxlintrc.json`, `frontend/.oxlintrc.json` | Règles concrètes : `eqeqeq`, interdiction de `any`; côté React, règles des hooks et dépendances des effets. | Lint exécuté et réussi sur les deux workspaces. |
| Guide computationnel | `backend/tsconfig.json`, `frontend/tsconfig.app.json` | TypeScript strict, `noUncheckedIndexedAccess`, `noUnusedLocals` et `noUnusedParameters`. | Typecheck exécuté et réussi sur les deux workspaces. |
| Guide computationnel | `backend/vitest.config.ts`, `frontend/vite.config.ts` | Définit l'initialisation des tests backend et l'environnement navigateur simulé `jsdom` côté frontend. | Les deux suites exécutées : 122 tests backend et 48 tests frontend réussis. |
| Guide computationnel | `.npmrc` | `ignore-scripts=true` empêche npm d'exécuter les scripts des dépendances à l'installation. | Configuration lue ; son effet n'a pas été retesté pendant cette séance. |
| Senseur inférentiel | Aucun outil de revue de code par IA configuré dans les fichiers du dépôt. | Pas de résultat de revue IA automatique à relever. | Non identifié ; la consigne Copilot reste un guide, pas un senseur. |
| Senseur computationnel | Oxlint, TypeScript, Vitest et builds, orchestrés par `npm run check` | Vérifient respectivement les règles statiques, les types, le comportement testé et la compilation. | Tous exécutés via `npm run check` : lint, typecheck, 122 tests backend, 48 tests frontend et builds réussis. Le premier lancement dans le bac à sable a été bloqué par `listen EPERM`; le relancement autorisé hors du bac à sable a réussi. |

Il n'y a pas de fichier `AGENTS.md` séparé : le guide IA présent dans votre dépôt est `.github/copilot-instructions.md` (première ligne de la matrice ci-dessus). Aucun générateur de code n'a été identifié dans les scripts du projet.

## Analyse des exigences EF-32 et EF-33

Le cahier des charges prévoit qu'un étudiant peut candidater à une offre publiée avec un message facultatif et retirer sa candidature tant qu'elle n'a pas été traitée (EF-32). Il peut consulter ses candidatures et voir l'un des quatre statuts « En cours », « Retenue », « Non retenue » ou « Retirée » (EF-33).

### Couverture des tests

| Exigence | Cas et résultat attendu | Test existant et assertions utiles | Couverture |
|---|---|---|---|
| EF-32 | Un étudiant candidate à une offre publiée avec un message ; la réponse contient l'offre, le message et `IN_PROGRESS`. | `backend/tests/applications.test.ts` — « crée une candidature avec un message facultatif » : statut 201 et `toMatchObject` sur `offerId`, `message`, `status`. | Couvert pour le cas avec message. |
| EF-32 | Un étudiant candidate sans message ; la candidature est créée avec un message nul. | `backend/tests/applications.test.ts` — « crée une candidature sans message » : statut 201 et `toMatchObject` sur `offerId`, `message: null`, `status`. | Couvert côté API ; pas de test du formulaire frontend. |
| EF-32 | Une offre qui n'est pas publiée refuse la candidature. | `backend/tests/applications.test.ts` — « refuse de candidater à une offre non publiée » : statut 409 et code `OFFER_NOT_PUBLISHED`. | Couvert. |
| EF-32 | Un utilisateur qui n'est pas étudiant ne peut pas gérer les candidatures. | `backend/tests/applications.test.ts` — « refuse l'accès aux profils non étudiants » : `GET /applications` avec un administrateur, statut 403. | Partiel : vérifie la lecture, mais pas `POST` et `DELETE`. |
| EF-32 | L'étudiant retire une candidature en cours ; elle peut ensuite candidater de nouveau à cette offre. | `backend/tests/applications.test.ts` — « retire une candidature en cours puis autorise la ré-candidature » : DELETE renvoie 204, POST renvoie 201 et `IN_PROGRESS`. | Couvert. |
| EF-32 | Le retrait d'une candidature déjà traitée est refusé. | `backend/tests/applications.test.ts` — « interdit le retrait d'une candidature déjà traitée » : statut 409 et code `APPLICATION_ALREADY_PROCESSED`. | Couvert. |
| EF-32 | Un étudiant ne peut pas retirer la candidature d'un autre étudiant. | `backend/tests/applications.test.ts` — « n'autorise pas un étudiant à retirer la candidature d'un autre étudiant » : vérifie le statut 404 et le code `NOT_FOUND`. | Couvert. |
| EF-33 | L'étudiant ne voit que ses propres candidatures. | `backend/tests/applications.test.ts` — « ne retourne que les candidatures de l'étudiant connecté » : vérifie le statut 200 et que Lucas reçoit seulement l'offre `FLEET_APP`, selon le jeu de données seed. | Couvert pour ce jeu de données. |
| EF-33 | Les quatre statuts sont retournés et affichés avec les bons libellés. | Backend : « liste les candidatures de l'étudiant avec leurs statuts » vérifie deux statuts seedés (`IN_PROGRESS`, `WITHDRAWN`). Frontend : `frontend/tests/ApplicationsPage.test.tsx` — « affiche les quatre statuts et permet le retrait d'une candidature en cours » vérifie les quatre libellés. | Partiel : les quatre libellés UI sont couverts ; aucune réponse API unique ne vérifie les quatre statuts. |
| EF-33 | Une liste vide donne un état vide compréhensible. | Aucun test dédié dans `frontend/tests/ApplicationsPage.test.tsx`. | Absent. |
| EF-32 | Le formulaire d'offre envoie l'identifiant et le message facultatif, puis actualise l'interface. | Aucun test de candidature dans `frontend/tests/OffersPage.test.tsx`. | Absent côté frontend. |
| EF-32 / EF-33 | Un autre profil tente de lire les candidatures. | `backend/tests/applications.test.ts` — « refuse l'accès aux profils non étudiants » : statut 403. | Couvert pour cette route et ce profil. |

Les tests associés couvrent aussi la ré-candidature après retrait, qui n'est pas explicitement détaillée dans EF-32, et le refus d'accès des profils non étudiants. Ces comportements sont rapportés séparément plutôt que rattachés à une exigence plus large.

### Conclusion

Les tests ajoutés couvrent l'isolation des candidatures entre étudiants et la création sans message. Le test backend de liste a été renommé pour ne plus prétendre couvrir les quatre statuts. Les tests n'exercent toujours pas le formulaire de candidature dans le navigateur, et l'API n'a pas de cas qui retourne les quatre statuts dans une seule liste.

## Modifications et vérification

- Dans `backend/tests/applications.test.ts`, ajout de tests vérifiant que Lucas ne reçoit que sa candidature, qu'Ioana peut candidater sans message (message nul), et que Lucas ne peut pas retirer la candidature d'Ines (404 `NOT_FOUND`).
- Renommage du test de liste pour refléter les deux statuts effectivement vérifiés.
- `npm run check` : réussi après autorisation d'exécuter les tests backend hors du bac à sable, qui bloquait leur port local (`listen EPERM`). Résultats : lint réussi ; typecheck réussi ; 122 tests backend réussis ; 48 tests frontend réussis ; builds backend et frontend réussis.
- Aucun test frontend de soumission n'a été ajouté ; cette limite reste à signaler.

## Audit des guides par rapport à Web 2

Les attentes ci-dessous sont tirées des PDF de cours fournis : `seance-02.pdf` à `seance-05.pdf`, du dépôt [BINV2150A-slides](https://github.com/e-vinci/BINV2150A-slides). Seules les parties pertinentes à l'architecture, aux API et à la sécurité ont été retenues.

| Attente de Web 2 (source) | Guide du projet et passage | Correspondance | Écart ou ajout proposé |
|---|---|---|---|
| Une API suit les conventions HTTP/REST, utilise les codes de statut adaptés et valide les données reçues (`seance-02.pdf`, p. 2–7 et p. 18). | `.github/copilot-instructions.md`, sections Architecture et Conventions : validation HTTP dans les contrôleurs, erreurs attendues via `HttpError`; `docs/architecture.md`, Backend : validation des paramètres et corps, erreur JSON centralisée. | Oui. | Aucune modification de guide nécessaire pour ce point. La couverture précise des tests est présentée dans la matrice EF-32/EF-33 ci-dessus. |
| Documenter les routes et tester les opérations de l'API indépendamment du frontend avec REST Client (`seance-02.pdf`, p. 8–18). | `.github/copilot-instructions.md`, lignes 75–77 : mettre à jour `backend/API.md` et les requêtes `backend/http/*.http`, puis couvrir les succès et erreurs. Le template de PR demande aussi documentation API et tests navigateur. | Partielle dans le dépôt. | `backend/http/offers.http` contient déjà des exemples `GET` et `POST /applications`, mais `backend/API.md` ne documente pas les routes candidatures et aucun exemple `DELETE /applications/:id` n'est présent. Ajouter ces contrats et exemples au prochain changement de cette API. |
| Distinguer authentification (identité) et autorisation (permissions), vérifier les JWT et renvoyer 401/403 selon le cas (`seance-03.pdf`, p. 2–5 et p. 7–14). | `.github/copilot-instructions.md`, Conventions : autorisation côté serveur et jeton brut dans `Authorization`; `docs/architecture.md`, Identification et droits : vérification du jeton, relecture du compte et rôles en base, puis 401/403. | Oui, avec une séparation plus stricte que l'exemple du cours. | Le projet met seulement `{ kind, id }` dans le JWT et relit les rôles en base à chaque requête, plutôt que de faire confiance aux permissions portées par le jeton. Cette décision est explicitée dans le guide d'architecture. |
| Garder une clé JWT secrète distincte par environnement et ne pas publier les fichiers de secrets (`seance-03.pdf`, p. 9). | `README.md` indique que `npm run setup` crée `backend/.env` et une clé aléatoire; `.gitignore` ignore `.env`; `backend/src/config.ts` refuse une clé JWT de moins de 32 caractères. | Partielle : le secret local est créé, ignoré par Git et contrôlé en longueur, mais les guides ne précisent pas qu'il faut une clé distincte par environnement. | Ajouter dans le guide de déploiement/Copilot de configurer des secrets séparés par environnement et de ne jamais réutiliser la clé locale en production. |
| Ne jamais enregistrer un mot de passe en clair; stocker un hash avec salt et employer un calcul asynchrone (`seance-04.pdf`, p. 2–8 et p. 12–18). | `README.md`, Mode démo, précise qu'il n'y a pas de mot de passe et que ce mode n'est pas une authentification; `.github/copilot-instructions.md` interdit d'activer le mode démo en production. | Non applicable à l'authentification actuellement implémentée; protection partielle par garde de production. | Ne pas ajouter bcrypt artificiellement au mode démo. Si une authentification par mot de passe est développée, ajouter au guide une règle explicite de hash salé (par ex. bcrypt), jamais de stockage en clair. |
| Éviter les injections XSS : ne pas insérer du contenu utilisateur avec `innerHTML`; privilégier du texte rendu sans interprétation HTML (`seance-05.pdf`, p. 10 et p. 15). | Les guides ne nomment pas explicitement XSS. L'interface React rend les champs avec des expressions JSX; aucune utilisation de `innerHTML` ou `dangerouslySetInnerHTML` n'a été trouvée dans `frontend/src`. | La pratique est respectée dans le code inspecté, mais pas formulée dans le guide. | Ajouter aux consignes frontend de ne pas injecter de HTML non fiable et de garder les valeurs utilisateur dans le rendu texte React. |

Les PDF fournis ne traitent pas explicitement l'accessibilité dans les séances 02–05; aucun constat d'alignement ou d'écart sur ce thème n'est donc avancé ici. L'audit porte sur les passages effectivement consultés, pas sur l'ensemble du programme.

### Mécanismes du projet qui dépassent les supports consultés

Les séances 02–05 fournies couvrent notamment les API REST, les JWT, le hachage des mots de passe et la manipulation du DOM en JavaScript. Le projet contient aussi des outils et consignes qui ne sont pas présentés dans ces supports. Cette comparaison porte sur ces quatre séances uniquement : elle ne permet pas d'affirmer que ces sujets sont absents de tout le cours Web 2.

| Élément du projet | Présence dans le projet | Par rapport aux séances 02–05 fournies |
|---|---|---|
| Harnais agentique et guide Copilot | `.github/copilot-instructions.md` donne des consignes à l'assistant IA ; le dépôt contient aussi un modèle de pull request et une commande de vérification. | Ces supports ne traitent pas de l'encadrement d'un agent IA ni de guides de consignes pour celui-ci. C'est un mécanisme supplémentaire propre au travail du projet. |
| Vérifications automatisées intégrées | `npm run check` orchestre Oxlint, le contrôle TypeScript, les suites Vitest et les builds. | Les séances demandent de tester les routes, notamment avec REST Client, mais ne présentent pas cette chaîne combinant lint, vérification de types, tests automatisés et compilation. |
| Tests automatisés avec Vitest | Les tests backend et frontend sont exécutés par Vitest. | Les exemples de tests d'API des supports utilisent REST Client ; Vitest ajoute des tests automatisés exécutables en lot au projet. |
| Contrôle architectural proposé | Le senseur `architecture:check` décrit ci-dessous vérifierait les imports interdits dans les services. | C'est une proposition pour le projet, pas un outil déjà installé ni un mécanisme présenté dans les séances fournies. |

TypeScript et React ne sont pas classés ici comme des notions hors Web 2 : ils apparaissent dans la liste générale des séances du cours (notamment les séances 01 et 07–15), même s'ils ne sont pas couverts par les PDF 02–05 utilisés pour cet audit.

## Proposition optionnelle : senseur d'architecture

Une règle utile à vérifier automatiquement serait que les services backend ne dépendent pas d'Express. Cette séparation est déjà écrite dans `.github/copilot-instructions.md` et `docs/architecture.md`.

- **Moment :** commande dédiée `npm run architecture:check`, appelée par `npm run check` et la CI.
- **Données examinées :** imports statiques de tous les fichiers `backend/src/services/**/*.ts`, analysés avec l'API AST de TypeScript déjà installée.
- **Résultat :** succès sans dépendance interdite, ou erreur listant le fichier et la ligne de chaque import d'`express` ou de types HTTP Express.
- **Violation exemple :** `import type { Request } from "express"` dans `backend/src/services/offers.service.ts`.
- **Limites et coûts :** un contrôle syntaxique léger reste à maintenir ; les imports construits dynamiquement peuvent lui échapper. La règle pourrait aussi refuser un import de type inoffensif, donc le périmètre doit être explicite. L'API AST évite les faux positifs d'une simple recherche de texte, au prix d'un script supplémentaire.

## Fichiers consultés

- `docs/cdc_gesta_developpement.md` — exigences EF-32 et EF-33.
- `.github/copilot-instructions.md`, `docs/architecture.md`, `README.md`, `backend/API.md` et `.github/pull_request_template.md` — consignes et guides du projet consultés.
- `package.json`, `backend/.oxlintrc.json`, `frontend/.oxlintrc.json`, configurations TypeScript/Vitest/Vite et `.npmrc` — outils et règles exécutables.
- `backend/tests/applications.test.ts` et `frontend/tests/ApplicationsPage.test.tsx` — tests de candidature.
- `frontend/tests/OffersPage.test.tsx` — tests de la page des offres.
- `backend/src/services/applications.service.ts` — règles métier appliquées côté serveur.
- `seance-02.pdf` à `seance-05.pdf` (dépôt BINV2150A-slides) — références de cours pour l'audit Web 2; reçues en pièces jointes, non copiées dans le dépôt du projet.
