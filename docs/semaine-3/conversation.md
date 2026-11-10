# Conversation — semaine 3 du projet

> Synthèse chronologique de la séance, rédigée à partir de l’échange dans l’agent. Ce document n’est pas un export verbatim de l’interface.

## Objectif de la séance

Examiner le harnais agentique du projet, relier les tests aux exigences EF-32 et EF-33, améliorer quelques tests manquants et comparer les guides du dépôt aux séances Web 2 disponibles.

## Échange et travail réalisé

1. **Diagnostic du projet.** Le problème repéré dans `frontend/src/pages/OffersPage.tsx` était l'usage de `applicationsApi` sans déclaration. La page a été reliée au hook `useApplications`, puis le typecheck a réussi.

2. **Repérage des guides et senseurs.** Lecture de `.github/copilot-instructions.md`, `docs/architecture.md`, `README.md`, `backend/API.md`, des configurations et du modèle de pull request. Le dépôt possède bien un guide Copilot; aucun `AGENTS.md` séparé n’a été trouvé. Les tests, le lint, TypeScript et les builds ont été recensés comme senseurs computationnels.

3. **Analyse EF-32 / EF-33.** Comparaison du cahier des charges avec `backend/tests/applications.test.ts`, `frontend/tests/ApplicationsPage.test.tsx` et `frontend/tests/OffersPage.test.tsx`. L’analyse a relevé l’absence d’assertion explicite sur l’isolation des candidatures, l’absence du cas sans message et l’absence de test frontend de soumission.

4. **Amélioration des tests API.** Trois tests ont été ajoutés : liste limitée à l’étudiant connecté, création sans message et refus de retirer la candidature d’un autre étudiant. Le titre du test de liste a été corrigé pour ne plus annoncer quatre statuts alors qu’il n’en vérifie que deux.

5. **Vérification.** Le premier `npm run check` a été bloqué par une restriction du bac à sable sur le port local des tests (`listen EPERM`). Après autorisation de relancer la commande hors du bac à sable, lint, typecheck, 122 tests backend, 48 tests frontend et les deux builds ont réussi.

6. **Audit Web 2 et ajouts du projet.** Après réception de `seance-02.pdf` à `seance-05.pdf`, les séances ont été comparées aux guides et au code. Le dépôt couvre certaines pratiques, présente des écarts partiels et contient aussi des mécanismes non présentés dans ces quatre supports, notamment le guide Copilot/harness agentique et la chaîne Oxlint/TypeScript/Vitest/builds. Cette conclusion est limitée aux séances fournies : TypeScript et React figurent dans d'autres séances de la liste générale du cours. La séance 05 documente le risque XSS; aucun `innerHTML` ou `dangerouslySetInnerHTML` n’a été trouvé dans `frontend/src`.

7. **Livrables.** Le dossier `docs/semaine-3/` contient le bilan, cette synthèse et deux matrices séparées : guides/senseurs/bonnes pratiques Web 2 et tests/exigences.

## État à la fin de la séance

- Le bilan, les deux matrices et les changements de tests sont présents localement.
- `npm run check` a réussi après les changements de tests.
- La PR n'est pas encore créée : le PDF Moodle qui décrit les sections 2 à 5 n'est pas accessible sans connexion; il faut le joindre pour suivre précisément ces consignes.
- Les crédits IA des deux membres restent à renseigner avec leurs informations.
- Cette synthèse n’est pas un export verbatim de l’interface.



