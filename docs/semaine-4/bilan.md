# Bilan — semaine 4 : audit des tests, TDD et hooks

## Audit des tests EF-32 et EF-33

L'audit a été effectué en lecture des exigences dans `docs/cdc_gesta_developpement.md`,
des assertions API de `backend/tests/applications.test.ts` et des assertions UI de
`frontend/tests/ApplicationsPage.test.tsx`. Le skill Test Gap Audit a servi de méthode;
son script de cartographie est heuristique et chaque constat a été confirmé dans les
tests concernés.

| Constat vérifié | État | Preuve dans les tests |
|---|---|---|
| Création avec et sans message, offre non publiée refusée | Couvert | `backend/tests/applications.test.ts` |
| Retrait en cours, retrait après traitement refusé, autre étudiant protégé | Couvert | `backend/tests/applications.test.ts` |
| Liste limitée à l'étudiant connecté | Couvert pour les données de test | `backend/tests/applications.test.ts` |
| Quatre libellés de statut | Couvert dans l'interface; l'API ne vérifie que `IN_PROGRESS` et `WITHDRAWN` | `frontend/tests/ApplicationsPage.test.tsx`, `backend/tests/applications.test.ts` |
| État vide de la page des candidatures | Pas de test dédié identifié | `frontend/tests/ApplicationsPage.test.tsx` |
| Refus des profils non étudiants sur POST et DELETE | Seul GET a un cas direct; les trois routes appliquent le même contrôle d'accès | `backend/tests/applications.test.ts`, `backend/src/controllers/applications.controller.ts` |

## TDD — EF-30 recherche par titre

Les tests API ont été ajoutés et exécutés avant l'implémentation. Le premier passage a
confirmé le comportement manquant : 17 tests existants passaient et 5 cas de recherche
échouaient parce que `q` était ignoré. Après présentation de ces cas, l'utilisateur a
validé le lot avant la modification de l'application.

Un cas supplémentaire vérifie la casse des lettres accentuées sans retirer les accents.
Il a d'abord échoué avec `lower()` de SQLite, puis a passé après déplacement de la
comparaison de l'expression en minuscules dans le service.

## Recherche d'offres

EF-30 est partiellement implémentée dans ce projet : cette séance ajoute la recherche par
titre et le filtre par période. La recherche par entreprise ou localité et les filtres
par année académique, entreprise, localité ou statut restent hors du périmètre réalisé.

La route `GET /offers` accepte `q`, retire les espaces de bordure et cherche une expression
continue dans le titre, sans distinction de casse. Une recherche vide n'ajoute pas de
filtre. Le filtre est combiné à la période et aux règles de visibilité déjà présentes.
L'interface fournit un champ de recherche et un message d'absence de correspondance.
`backend/API.md` et `backend/http/offers.http` ont été mis à jour.

Cas API couverts : casse et espaces, phrase entière, aucun résultat, recherche vide,
combinaison avec la période, visibilité étudiant et casse des lettres accentuées.
L'interface vérifie la transmission conjointe de la recherche et de la période ainsi que
le message quand aucun titre ne correspond.

Résultats finaux : `backend/tests/offers.test.ts` — 23 tests réussis;
`frontend/tests/OffersPage.test.tsx` — 7 tests réussis. `npm run check` a réussi : lint,
TypeScript, 129 tests backend, 50 tests frontend et builds backend/frontend.

L'utilisateur a également vérifié manuellement la recherche dans le navigateur et confirmé
qu'elle fonctionne. L'agent n'a pas piloté cette vérification depuis sa session.

## Skills

Le skill Test Gap Audit a été installé depuis la copie disponible dans `.agents/skills/`
vers `.github/skills/test-gap-audit/`, avec son script de repérage et un contexte Gesta
pour EF-32/EF-33. Le skill Test-Driven Development de Superpowers est installé dans
`.github/skills/test-driven-development/`, avec la règle de validation humaine demandée,
sa référence `writing-good-tests.md` et sa licence MIT. La même règle a été ajoutée à
`.github/copilot-instructions.md`.

Source du skill TDD : `obra/superpowers`, branche `main`, fichiers
`skills/test-driven-development/SKILL.md` et `writing-good-tests.md`. Le texte adapté et
la licence sont conservés dans le dossier du skill.

## Tool Guardian

Configuration installée dans `.github/hooks/tool-guardian.json` : événement `preToolUse`,
commande `node .github/hooks/guard-tool.cjs`, délai de 10 secondes. Le script est celui
fourni dans `tool-guardian.zip`; il renvoie `permissionDecision: "deny"` pour l'événement
de suppression simulé et `{}` pour l'événement simulé `git status`.

`demo-protected.txt` existe toujours. Les événements simulés ont été envoyés directement
au script Node. Le hook n'a pas été observé en situation réelle dans Copilot : cet agent
Codex ne reçoit pas les événements `preToolUse` de Copilot. Aucun refus autonome de
l'agent n'est présenté comme preuve. Ce hook pédagogique ne constitue pas une protection
absolue.

## Qu'ai-je appris ?

- Un titre de test ne suffit pas à prouver un comportement : il faut examiner les
  assertions et les données réellement vérifiées.
- Le cycle TDD permet de constater d'abord le comportement absent, puis de vérifier que
  les mêmes cas passent après une implémentation minimale.
- La recherche doit rester combinée aux filtres et aux règles de visibilité existantes.
- Les hooks peuvent examiner un appel d'outil avant exécution, mais une simulation ne
  prouve pas l'intégration dans l'application Copilot.

## Qu'est-ce qui a bien fonctionné ?

- Les tests API ont démontré le défaut avant l'implémentation.
- Le contrôle des droits et de la période est resté appliqué pendant la recherche.
- Le contrôle complet `npm run check` a réussi.
- L'utilisateur a confirmé que la recherche fonctionne dans le navigateur.
- Les scénarios Tool Guardian simulés ont produit les décisions attendues.

## Qu'est-ce qui a moins bien fonctionné ?

- Les dépendances n'étaient pas disponibles au départ; `npm ci` a nécessité l'accès réseau.
- Le premier test backend dans le bac à sable a échoué sur `listen EPERM`; il a fallu
  autoriser l'accès au port local pour exécuter Supertest.
- Le navigateur n'était pas pilotable depuis la session Codex; le test manuel a ensuite
  été effectué et confirmé par l'utilisateur. Le déclenchement réel du hook Copilot n'a
  pas pu être observé depuis la session Codex.

## Crédits IA

- Ashutosh Man Shrestha : cette séance est documentée comme un travail avec Codex; le
  nombre de crédits consommés n'est pas fourni par le dépôt ni par le transcript et doit
  être renseigné depuis une source de mesure réelle. Sa part de contribution doit être
  confirmée par le groupe.


## Conversations

Les échanges de cette séance ont été menés avec Codex. Aucun échange Copilot n'est
revendiqué. Le texte conversationnel fourni par l'utilisateur est archivé dans
`docs/semaine-4/conversations/conversations.md` sans résumé ni réécriture. Le bloc de
données techniques de page navigateur et le contenu publicitaire accolés au transcript
dans le fichier source ne font pas partie de la conversation et n'ont pas été copiés.
L'acceptation des échanges Codex pour l'évaluation reste à confirmer avec l'enseignant.
