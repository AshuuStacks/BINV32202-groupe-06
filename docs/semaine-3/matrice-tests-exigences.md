# Matrice — Vérification des exigences EF-32 et EF-33

Le cahier des charges prévoit qu'un étudiant puisse candidater à une offre publiée, éventuellement avec un message, puis retirer sa candidature tant qu'elle n'a pas été traitée (EF-32). Il doit également pouvoir consulter ses candidatures et leurs quatre statuts (EF-33).

| Exigence | Ce qui doit fonctionner | Test réalisé | Résultat |
|---|---|---|---|
| EF-32 | Candidater avec un message. | `applications.test.ts` : vérifie la création et le statut `IN_PROGRESS`. | Couvert |
| EF-32 | Candidater sans message. | Vérifie que la candidature est créée avec `message: null`. | Couvert côté API |
| EF-32 | Refuser une candidature à une offre non publiée. | Vérifie l'erreur `OFFER_NOT_PUBLISHED` (409). | Couvert |
| EF-32 | Empêcher les profils non étudiants de gérer les candidatures. | Vérifie qu'un administrateur reçoit une erreur 403 sur la consultation. | Partiel |
| EF-32 | Retirer une candidature en cours et pouvoir recandidater. | Vérifie le retrait (204), puis une nouvelle candidature (201). | Couvert |
| EF-32 | Empêcher le retrait d'une candidature déjà traitée. | Vérifie l'erreur `APPLICATION_ALREADY_PROCESSED` (409). | Couvert |
| EF-32 | Empêcher un étudiant de retirer la candidature d'un autre. | Vérifie l'erreur `NOT_FOUND` (404). | Couvert |
| EF-33 | Afficher uniquement les candidatures de l'étudiant connecté. | Vérifie que Lucas reçoit uniquement sa candidature. | Couvert |
| EF-33 | Afficher les quatre statuts avec les bons libellés. | Backend : deux statuts vérifiés. Frontend : les quatre libellés affichés sont testés. | Partiel |
| EF-33 | Afficher un message lorsque la liste est vide. | Aucun test dédié dans `ApplicationsPage.test.tsx`. | Non couvert |
| EF-32 | Tester l'envoi du formulaire de candidature. | Aucun test frontend de soumission dans `OffersPage.test.tsx`. | Non couvert |

### Conclusion

Les tests vérifient principalement le fonctionnement de l'API : création, retrait, droits d'accès et isolation des candidatures.

Trois améliorations restent possibles :
- Tester la soumission du formulaire côté frontend.
- Tester l'affichage d'une liste vide.
- Vérifier les quatre statuts dans une même réponse de l'API.