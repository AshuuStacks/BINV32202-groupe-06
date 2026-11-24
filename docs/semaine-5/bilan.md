# Bilan — semaine 5 : MCP et tests end-to-end

## Scénarios

Les deux scénarios sont décrits dans [e2e/recherche-offres/scenarios.md](../../e2e/recherche-offres/scenarios.md).
Le scénario 1 est nominal : il vérifie qu’une expression présente dans le titre,
saisie avec une casse différente, réduit le catalogue à l’offre correspondante. Le
scénario 2 couvre le cas particulier sans résultat et vérifie le message d’état vide.
Ces cas contrôlent à la fois le filtrage utile et sa réponse quand aucune offre ne
correspond.

## MCP — scénario 1 : recherche avec résultat

Le scénario 1 a été exécuté avec succès dans Codex à l’aide du serveur Playwright
MCP. Après connexion comme étudiant avec Lucas Dupont, la page « Offres de stage »
affichait quatre offres publiées. La recherche `api rest` a réduit la liste à une
seule offre : « API REST de facturation » (Orbis). Les trois autres offres ont été
exclues. Le résultat correspond aux attentes du scénario.

Deux outils MCP observés pendant l’exécution :

- `browser_navigate` a ouvert l’application Gesta en local et a renvoyé l’URL et
  l’état de navigation de la page.
- `browser_snapshot` a renvoyé l’arbre d’accessibilité, notamment les titres,
  contrôles et offres affichés, permettant d’observer le résultat de la recherche.

Aucun code applicatif n’a été modifié et aucun script de test n’a été généré pendant
la vérification interactive. L’exercice a été réalisé avec Codex et Playwright MCP.
Les traces sauvegardées sont dans [traces/](traces/).

### Scénario 2 : recherche sans résultat

Le scénario 2 a aussi été exécuté avec succès dans Codex à l’aide de Playwright MCP.
Connecté comme étudiant avec Lucas Dupont, j’ai ouvert « Offres de stage » et saisi
exactement `e2e-introuvable-8472`. Le snapshot final montre le champ avec cette valeur
et le message « Aucune offre ne correspond à la recherche. »; aucune ligne d’offre
n’apparaît.

Outils observés : `browser_navigate` a ouvert l’application, `browser_snapshot` a
renvoyé l’état accessible des pages, `browser_click` a servi à sélectionner Lucas et
à ouvrir les offres, et `browser_fill_form` a saisi le texte de recherche. Aucun
fichier n’a été modifié et aucun script n’a été généré pendant cette vérification.
Les snapshots et journaux MCP correspondants sont conservés dans [traces/](traces/).

## Playwright Test

Fichiers créés :

- `e2e/recherche-offres/recherche-offres.spec.ts` contient les tests des scénarios 1
  et 2, avec le numéro du scénario dans chaque nom.
- `playwright.config.ts` configure Chromium, le répertoire `e2e/` et l’URL locale du
  frontend.
- `package.json` et `package-lock.json` déclarent `@playwright/test` comme dépendance
  de développement.

Le test du scénario 1 vérifie que la ligne « API REST de facturation » est visible et
qu’une seule ligne de résultat est affichée. Le test du scénario 2 vérifie le message
« Aucune offre ne correspond à la recherche. » et l’absence de tableau de résultats.

Deux exécutions successives de `npx playwright test` ont réussi : 2 tests sur 2 lors
de chaque exécution (1,1 s puis 862 ms). Après la vérification du défaut temporaire et
sa restauration, une nouvelle exécution complète a également réussi : 2 tests sur 2
(1,1 s).

`npm run check` a réussi : lint, vérification TypeScript, 129 tests backend, 50 tests
frontend et builds backend et frontend. La première tentative dans la sandbox était
bloquée par `listen EPERM` pendant l’ouverture d’un port local par les tests backend;
la relance avec l’accès local nécessaire a réussi.

## Vérification de la détection d’un défaut

Le filtrage par titre a été temporairement désactivé dans
`backend/src/services/offers.service.ts`, sans conserver cette modification. Le test
du scénario 1 a échoué sur son assertion de nombre de résultats : 4 lignes étaient
présentes au lieu d’une. Cela montre que l’assertion détecte bien la régression du
filtrage. Le code initial a ensuite été restauré; le scénario 1 a réussi à nouveau,
puis les deux tests E2E ont réussi ensemble. Aucun défaut temporaire ne reste dans
le code applicatif.

## Comparaison des approches

1. **Que permet Playwright MCP dans la conversation avec l’agent ? Quelle action précise avez-vous vu passer par un outil MCP ?**

   Réponse :

2. **Qu’apportent les scripts Playwright Test que le compte rendu d’un test par MCP n’apporte pas ?**

   Réponse :

3. **Dans quel cas préféreriez-vous une exploration interactive avec MCP ? Dans quel cas préféreriez-vous un test automatisé ?**

   Réponse :

## Conversations

Les échanges de cette séance avec Codex sont archivés dans
[conversations.md](conversations.md). Il s’agit d’une conversation avec Codex, pas
d’un export Copilot.
