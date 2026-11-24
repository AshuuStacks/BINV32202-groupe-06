# Conversation de travail — semaine 5

Archive des échanges avec Codex autour des scénarios E2E, de Playwright Test et de
Playwright MCP. Les sorties longues des commandes sont résumées; les observations de
tests et de navigation rapportées pendant la séance sont conservées.

## Préparation des scénarios et tests E2E

**Utilisateur**

Commençons par les tests end2end, crée-moi le dossier pour commencer.

**Codex**

Après lecture de la fiche et des règles EF-30 documentées en semaine 4, j’ai créé
`e2e/recherche-offres/` et `scenarios.md` avec un scénario de recherche avec résultat
et un scénario sans résultat. Les deux utilisent le compte étudiant et les données
de démonstration.

**Utilisateur**

Génère les tests E2E; je vais les tester moi-même.

**Codex**

J’ai créé `e2e/recherche-offres/recherche-offres.spec.ts` avec les deux scénarios. Les
tests se connectent comme Lucas Dupont et vérifient le résultat unique ou le message
d’absence de résultat. Je ne les ai pas lancés à cette étape.

**Utilisateur**

Installe les dépendances Playwright et donne-moi les commandes de lancement avec ou
sans UI.

**Codex**

J’ai installé `@playwright/test` 1.65.1, téléchargé Chromium, créé `playwright.config.ts`
avec `e2e/` comme répertoire de tests et ajouté les sorties Playwright au `.gitignore`.
Commandes proposées depuis la racine : `npx playwright test` et
`npx playwright test --ui`. Le serveur backend et le frontend doivent tourner.

**Utilisateur**

Quelle commande permet d’enregistrer manuellement le parcours ?

**Codex**

La commande donnée est `npx playwright codegen http://localhost:5173/`. Elle ouvre un
navigateur et l’Inspector Playwright pour enregistrer des actions et copier le code.

**Utilisateur**

J’ai enregistré le parcours : ouverture de la page, clic sur Lucas Dupont, ouverture
des offres, saisie de `api rest` et observation de « API REST de facturation ».
Inspire-toi de cet enregistrement pour que les tests fonctionnent.

**Codex**

J’ai repris ce parcours dans les tests, supprimé le clic parasite sur le texte de
navigation combiné et renforcé l’assertion pour vérifier une seule ligne dans le
tableau.

**Utilisateur**

Le `page.goto("/")` est souligné et les deux tests échouent sur une URL invalide.

**Codex**

L’erreur venait du lancement depuis `e2e/`, où Playwright ne chargeait pas la
configuration racine et n’avait donc pas de `baseURL`. J’ai remplacé la navigation
relative par `page.goto("http://localhost:5173/")`. Les commandes possibles sont de
lancer depuis la racine avec `npx playwright test`, ou depuis `e2e/` avec
`npx playwright test --config=../playwright.config.ts`.

**Utilisateur**

Les deux cas fonctionnent maintenant. Je veux faire le MCP, mais je n’ai pas accès à
Copilot parce que mon compte est suspendu. Peut-on utiliser Playwright MCP ?

**Codex**

Oui. Playwright MCP est le serveur et peut être utilisé avec un autre client MCP.
Codex prend en charge MCP; la commande proposée pour enregistrer le serveur était
`codex mcp add playwright --url http://localhost:8931/mcp`.

**Utilisateur**

Le serveur affiche `Listening on http://localhost:8931` et propose l’URL
`http://localhost:8931/mcp`.

**Codex**

J’ai indiqué de laisser ce terminal ouvert et d’ajouter l’URL à la configuration MCP
de Codex.

**Utilisateur**

La commande `codex mcp add` répond `zsh: command not found: codex`.

**Codex**

La commande CLI n’est pas disponible dans le `PATH`. J’ai alors ajouté au projet
`.codex/config.toml` avec :

```toml
[mcp_servers.playwright]
url = "http://localhost:8931/mcp"
```

Il fallait ensuite recharger Codex et, si demandé, faire confiance au projet.

## Bilan et vérifications

**Utilisateur**

Le scénario 1 a réussi avec Codex et Playwright MCP. Connecté comme Lucas Dupont,
quatre offres publiées étaient visibles avant la recherche. Après la recherche
`api rest`, seule « API REST de facturation » (Orbis) restait affichée. Les outils
observés étaient `browser_navigate` et `browser_snapshot`. Aucun code applicatif ni
script n’a été modifié ou généré pendant l’exploration. Ajoute cela au bilan.

**Codex**

J’ai ajouté le résultat au bilan de semaine 5.

**Utilisateur**

Tout doit être dans le dossier semaine 5.

**Codex**

J’ai déplacé le bilan sous `docs/semaine-5/bilan.md` et regroupé les traces MCP dans
`docs/semaine-5/traces/`. Les scénarios et tests restent sous `e2e/`, à l’emplacement
requis par la fiche.

**Utilisateur**

Complète le bilan avec les scénarios, MCP, Playwright Test, `npm run check`, la
vérification d’un défaut temporaire et la comparaison. Simule le défaut, garde-le
dans les vérifications, mais ne l’applique pas au code final. Laisse les réponses
aux trois questions de comparaison vides.

**Codex**

J’ai exécuté les deux tests E2E deux fois de suite; chaque exécution a réussi avec
2 tests sur 2. Pour la vérification de régression, j’ai désactivé temporairement le
filtrage par titre dans le service backend. Le scénario 1 a échoué parce qu’il
affichait quatre résultats au lieu d’un. J’ai restauré le code et le scénario 1 a
réussi de nouveau. Une exécution E2E complète après restauration a aussi réussi.

`npm run check` a réussi après relance avec l’accès au port local nécessaire : lint,
TypeScript, 129 tests backend, 50 tests frontend et builds. Les trois réponses de
comparaison sont laissées vides dans le bilan.

**Utilisateur**

J’ai également exécuté le scénario 2 avec Playwright MCP : connecté comme Lucas
Dupont, j’ai recherché exactement `e2e-introuvable-8472`. Le snapshot affichait le
message « Aucune offre ne correspond à la recherche. » et aucune ligne d’offre.
Les outils MCP observés étaient `browser_navigate`, `browser_snapshot`,
`browser_click` et `browser_fill_form`. Aucun fichier n’a été modifié et aucun script
n’a été généré. Ajoute le résultat au bilan.

**Codex**

J’ai ajouté le résultat du scénario 2 et les outils observés à la section MCP du
bilan.
