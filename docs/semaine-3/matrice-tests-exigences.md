# Matrice — traçabilité des tests par rapport aux exigences EF-32 et EF-33

Le cahier des charges prévoit qu'un étudiant peut candidater à une offre publiée avec un message facultatif et retirer sa candidature tant qu'elle n'a pas été traitée (EF-32). Il peut consulter ses candidatures et voir l'un des quatre statuts « En cours », « Retenue », « Non retenue » ou « Retirée » (EF-33).

| Exigence | Cas et résultat attendu | Test et assertions utiles | Couverture |
|---|---|---|---|
| EF-32 | Candidater à une offre publiée avec un message; réponse avec offre, message et `IN_PROGRESS`. | `backend/tests/applications.test.ts` — « crée une candidature avec un message facultatif » : statut 201 et `toMatchObject` sur `offerId`, `message`, `status`. | Couvert pour le cas avec message. |
| EF-32 | Candidater sans message; candidature créée avec un message nul. | `backend/tests/applications.test.ts` — « crée une candidature sans message » : statut 201 et `toMatchObject` sur `offerId`, `message: null`, `status`. | Couvert côté API; formulaire frontend non testé. |
| EF-32 | Refuser une candidature à une offre non publiée. | `backend/tests/applications.test.ts` — « refuse de candidater à une offre non publiée » : statut 409 et `OFFER_NOT_PUBLISHED`. | Couvert. |
| EF-32 | Refuser la gestion des candidatures aux profils qui ne sont pas étudiants. | `backend/tests/applications.test.ts` — « refuse l'accès aux profils non étudiants » : `GET /applications` avec un administrateur, statut 403. | Partiel : lecture vérifiée, pas `POST` ni `DELETE`. |
| EF-32 | Retirer une candidature en cours puis autoriser une nouvelle candidature à la même offre. | `backend/tests/applications.test.ts` — « retire une candidature en cours puis autorise la ré-candidature » : DELETE 204, POST 201 et `IN_PROGRESS`. | Couvert. |
| EF-32 | Refuser le retrait d'une candidature déjà traitée. | `backend/tests/applications.test.ts` — « interdit le retrait d'une candidature déjà traitée » : statut 409 et `APPLICATION_ALREADY_PROCESSED`. | Couvert. |
| EF-32 | Empêcher un étudiant de retirer la candidature d'un autre étudiant. | `backend/tests/applications.test.ts` — « n'autorise pas un étudiant à retirer la candidature d'un autre étudiant » : statut 404 et `NOT_FOUND`. | Couvert. |
| EF-33 | L'étudiant ne voit que ses propres candidatures. | `backend/tests/applications.test.ts` — « ne retourne que les candidatures de l'étudiant connecté » : statut 200 et seule l'offre `FLEET_APP` pour Lucas avec les données seedées. | Couvert pour ce jeu de données. |
| EF-33 | Retourner et afficher les quatre statuts avec les bons libellés. | Backend — le test de liste vérifie `IN_PROGRESS` et `WITHDRAWN`. Frontend — `frontend/tests/ApplicationsPage.test.tsx`, « affiche les quatre statuts… », vérifie les quatre libellés. | Partiel : libellés UI couverts; aucune réponse API unique ne vérifie les quatre statuts. |
| EF-33 | Afficher un état vide compréhensible quand la liste ne contient aucune candidature. | Aucun test dédié dans `frontend/tests/ApplicationsPage.test.tsx`. | Absent. |
| EF-32 | Le formulaire envoie l'identifiant et le message facultatif, puis actualise l'interface. | Aucun test de candidature dans `frontend/tests/OffersPage.test.tsx`. | Absent côté frontend. |
| EF-32 / EF-33 | Refuser à un autre profil la lecture des candidatures. | `backend/tests/applications.test.ts` — « refuse l'accès aux profils non étudiants » : statut 403. | Couvert pour cette route et ce profil. |

Les tests couvrent aussi la ré-candidature après retrait, non explicitement détaillée dans EF-32, et le refus des profils non étudiants. Ces comportements sont rapportés séparément.

## Conclusion

Les tests ajoutés vérifient l'isolation des candidatures entre étudiants, la création sans message et le refus de retirer la candidature d'un autre étudiant. Il manque toujours un test frontend de soumission, un test de l'état vide et un cas API unique retournant les quatre statuts.
