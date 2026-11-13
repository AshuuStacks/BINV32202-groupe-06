# Conversation — Semaine 3 : Harnais agentique

> Historique reconstitué à partir des éléments de travail disponibles pour la séance. Les formulations des demandes sont reformulées et ne constituent pas une retranscription mot à mot des échanges avec Copilot.

---

## 1. Diagnostic initial du projet

**Utilisateur :**

Nous allons examiner le projet afin d'identifier les guides et les senseurs présents dans le dépôt. Il faut également vérifier les tests existants et leur correspondance avec les exigences EF-32 et EF-33.

**Copilot :**

Une première exploration du projet et de son architecture a été réalisée.

L'analyse a permis de repérer les principaux fichiers de documentation, les configurations techniques ainsi que les tests existants.

L'objectif était de comprendre l'organisation du projet avant d'identifier les mécanismes permettant de guider et de vérifier le travail des agents.

---

## 2. Identification des guides et des senseurs

**Utilisateur :**

Explore le dépôt pour identifier les différents guides et senseurs. Classe-les entre les mécanismes inférentiels et computationnels, en précisant leur rôle et les fichiers concernés.

**Copilot :**

Plusieurs fichiers et configurations ont été examinés :

- `.github/copilot-instructions.md`
- `docs/architecture.md`
- `README.md`
- `backend/API.md`
- `.github/pull_request_template.md`
- Les configurations Oxlint et TypeScript.
- Les configurations et scripts Vitest.
- Les commandes de build du projet.

L'analyse a permis d'identifier :

**Guides inférentiels :**

- `.github/copilot-instructions.md` : donne des consignes à Copilot concernant l'architecture, les conventions, les commandes et les règles du projet.
- `README.md` : présente le fonctionnement et les informations générales du projet.
- `docs/architecture.md` : décrit l'organisation architecturale.
- `backend/API.md` : documente les endpoints et leur utilisation.
- `.github/pull_request_template.md` : fournit une structure et des attentes pour les Pull Requests.

**Senseurs computationnels :**

- Oxlint : analyse statiquement le code.
- TypeScript : vérifie les types.
- Vitest : exécute les tests.
- Build frontend et backend : vérifie que les applications peuvent être compilées.

Aucun fichier `AGENTS.md` séparé ni outil de revue de code par IA configuré automatiquement n'a été identifié.

**Résultat :**

Les mécanismes ont été classés dans la matrice guides/senseurs, en distinguant les outils réellement présents et les contrôles effectivement exécutés.

---

## 3. Analyse de la couverture des tests — EF-32 et EF-33

**Utilisateur :**

Analyse les tests existants et compare-les aux exigences EF-32 et EF-33. Il faut identifier les cas couverts, partiellement couverts et absents, en se basant sur les assertions réelles des tests. Tu peux répondre vite merci.

**Copilot :**

L'analyse s'est concentrée sur les fichiers suivants :

- `backend/tests/applications.test.ts`
- `frontend/tests/ApplicationsPage.test.tsx`
- `frontend/tests/OffersPage.test.tsx`
- `docs/cdc_gesta_developpement.md`

Les exigences ont été séparées en plusieurs cas de vérification.

**EF-32 — Candidater et retirer une candidature :**

L'analyse a notamment porté sur :

- La création d'une candidature.
- Le refus d'une candidature lorsque l'offre n'est pas publiée.
- La possibilité de retirer sa propre candidature.
- L'impossibilité de retirer la candidature d'un autre étudiant.
- La création d'une candidature sans message.

**EF-33 — Consulter ses candidatures et leur statut :**

L'analyse a notamment porté sur :

- La consultation des candidatures de l'étudiant connecté.
- L'isolation des candidatures entre étudiants.
- La consultation du statut des candidatures.
- La vérification des différents statuts retournés par l'API.

Plusieurs limites ont été relevées :

- L'isolation des candidatures entre étudiants n'était pas explicitement vérifiée par une assertion dédiée.
- Le cas d'une candidature créée sans message n'était pas suffisamment testé.
- Le frontend ne disposait pas d'un test spécifique pour la soumission d'une candidature.
- Le test concernant les statuts annonçait une couverture des quatre statuts alors que ses assertions n'en vérifiaient que deux.

**Résultat :**

Une matrice de traçabilité a été construite afin de relier chaque cas aux tests correspondants et de préciser son niveau de couverture.

---

## 4. Amélioration des tests backend

**Utilisateur :**

Identifie les manques les plus importants et ajoute des tests pour améliorer la couverture des exigences EF-32 et EF-33 afin qu'elle puisse être traiter au plus vite merci.

**Copilot :**

Trois tests backend ont été ajoutés dans `backend/tests/applications.test.ts`.

**Premier test : isolation des candidatures**

Vérifier qu'un étudiant ne reçoit que ses propres candidatures lorsqu'il consulte sa liste.

Le test permet de détecter une éventuelle fuite de données entre utilisateurs.

**Deuxième test : candidature sans message**

Vérifier qu'un étudiant peut créer une candidature sans fournir de message et que la valeur enregistrée correspond à `null`.

**Troisième test : retrait d'une candidature appartenant à un autre étudiant**

Vérifier qu'un étudiant ne peut pas supprimer une candidature qui appartient à un autre utilisateur.

Le nom d'un test existant concernant les statuts a également été corrigé afin de correspondre exactement aux assertions réalisées.

Les tests frontend n'ont pas été étendus pour la soumission d'une candidature. Cette limite a été conservée dans le bilan.

---

## 5. Exécution des vérifications

**Utilisateur :**

Maintenant que t'a modifier tu peux faire une vérification si tout se passe bien avec un npm run check. 

**Copilot :**

La commande suivante a été exécutée :

```bash
npm run check
```

Lors du premier lancement, une erreur `listen EPERM` est apparue. Elle était liée à une restriction du bac à sable empêchant l'ouverture d'un port local par les tests.

Après autorisation de relancer la commande hors de cette restriction, les contrôles ont abouti.

**Résultats obtenus :**

| Contrôle | Résultat |
|---|---|
| Lint | Réussi |
| TypeScript | Réussi |
| Tests backend | 122 réussis |
| Tests frontend | 48 réussis |
| Build backend | Réussi |
| Build frontend | Réussi |

La validation complète a donc réussi après les modifications apportées aux tests.

---

## 6. Audit des guides par rapport aux bonnes pratiques Web 2

**Utilisateur :**

Compare maintenant tout ce que je t'ai fourni avec les séances de nos cours de web2 et compare avec le code qui a été fourni sur le projet pour voir si il y a des incohérences.

**Copilot :**

Les supports Web 2 disponibles ont été examinés, notamment :

- `seance-02.pdf`
- `seance-03.pdf`
- `seance-04.pdf`
- `seance-05.pdf`

L'analyse a porté sur les conventions et pratiques réellement documentées dans ces supports.

Plusieurs sujets ont été comparés aux instructions du projet :

- Architecture et organisation du code.
- Conventions de développement.
- Communication HTTP et API REST.
- Authentification et autorisation.
- Gestion des mots de passe.
- Sécurité et prévention des risques XSS.

L'analyse a notamment relevé que certaines consignes sont déjà présentes dans les guides, tandis que d'autres sont seulement partiellement documentées.

Concernant la sécurité XSS, la séance 05 documente ce risque. Une inspection du dossier `frontend/src` n'a pas identifié d'utilisation de `innerHTML` ou de `dangerouslySetInnerHTML`.

Il faut toutefois distinguer l'absence de ces pratiques dans le code inspecté de leur présence explicite dans les instructions données à Copilot.

L'audit a également permis d'identifier des mécanismes propres au projet, notamment le guide Copilot et la chaîne de vérification Oxlint, TypeScript, Vitest et builds.

**Résultat :**

Les correspondances, les écarts et les recommandations ont été intégrés dans la matrice guides/senseurs.

L'analyse reste limitée aux supports effectivement disponibles et consultés.

---

## 7. Proposition d'un senseur d'architecture

**Utilisateur :**

Réfléchis à un éventuel senseur d'architecture qui pourrait être utile pour notre projet. Il faut proposer une règle concrète et expliquer comment elle pourrait être vérifiée.

**Copilot :**

Une proposition de senseur a été identifiée : vérifier que les services backend ne dépendent pas directement d'Express.

L'objectif serait de conserver une séparation claire entre les différentes couches de l'application.

Le senseur pourrait :

- Analyser les imports des fichiers `backend/src/services/**/*.ts`.
- Détecter les imports directs provenant d'Express.
- Signaler les violations de la règle.
- Produire un rapport permettant aux développeurs de corriger les dépendances incorrectes.

Ce contrôle pourrait être exécuté pendant une commande de vérification ou intégré à la CI.

Certaines limites ont également été identifiées, notamment les faux positifs et le coût de maintenance.

Cette proposition reste théorique : le senseur n'a pas été implémenté.

---

## 8. Finalisation des livrables

**Utilisateur :**

Regroupe les résultats de l'analyse dans les documents demandés pour la semaine 3.

**Copilot :**

Les livrables ont été organisés dans le dossier `docs/semaine-3/`.

Les documents comprennent :

- `bilan.md` : synthèse générale du travail, des modifications, des vérifications et des limites.
- `matrice-guides-senseurs.md` : inventaire des guides et senseurs ainsi que leur comparaison avec les bonnes pratiques Web 2.
- `matrice-tests-exigences.md` : traçabilité entre les exigences EF-32 et EF-33 et les tests existants.
- `conversation.md` : historique du travail effectué pendant la séance.

---

## 9. État final du travail

À la fin de la séance :

- Les guides et senseurs ont été identifiés et classés.
- Les exigences EF-32 et EF-33 ont été analysées.
- Trois tests backend ont été ajoutés.
- Un nom de test existant a été corrigé.
- Les contrôles du projet ont été exécutés avec succès.
- L'audit des guides par rapport aux supports Web 2 a été réalisé.
- Une proposition facultative de senseur d'architecture a été formulée.
- Les deux matrices et le bilan ont été préparés.
- Les crédits IA des membres du groupe ont été renseignés dans le bilan.

Les éléments restant à compléter pour la remise sont la création de la Pull Request selon les consignes Moodle et la transmission du lien de la Pull Request pour l'évaluation.

---

**Remarque :** ce document présente une reconstitution structurée du déroulement de la séance à partir des traces et livrables disponibles. Les formulations ne sont pas des citations exactes de Copilot.