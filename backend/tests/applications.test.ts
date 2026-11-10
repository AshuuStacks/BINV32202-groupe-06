import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

describe("applications étudiant", () => {
  it("liste les candidatures de l'étudiant avec leurs statuts", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.INES_HADDAD));

    expect(response.status).toBe(200);
    expect(response.body.map((application: { status: string }) => application.status)).toEqual([
      "IN_PROGRESS",
      "WITHDRAWN",
    ]);
  });

  it("ne retourne que les candidatures de l'étudiant connecté", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT));

    expect(response.status).toBe(200);
    expect(response.body.map((application: { offerId: number }) => application.offerId)).toEqual([
      OFFER.FLEET_APP,
    ]);
  });

  it("refuse l'accès aux profils non étudiants", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("ADMIN", 1));

    expect(response.status).toBe(403);
  });

  it("crée une candidature avec un message facultatif", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.IOANA_POPESCU))
      .send({ offerId: OFFER.INTERNAL_CHATBOT, message: "Votre sujet m'intéresse." });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      offerId: OFFER.INTERNAL_CHATBOT,
      message: "Votre sujet m'intéresse.",
      status: "IN_PROGRESS",
    });
  });

  it("crée une candidature sans message", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.IOANA_POPESCU))
      .send({ offerId: OFFER.INTERNAL_CHATBOT });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      offerId: OFFER.INTERNAL_CHATBOT,
      message: null,
      status: "IN_PROGRESS",
    });
  });

  it("refuse de candidater à une offre non publiée", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.IOANA_POPESCU))
      .send({ offerId: OFFER.E2E_TESTS });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("OFFER_NOT_PUBLISHED");
  });

  it("retire une candidature en cours puis autorise la ré-candidature", async () => {
    const withdraw = await request(app)
      .delete("/applications/1")
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT));
    expect(withdraw.status).toBe(204);

    const reapply = await request(app)
      .post("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT))
      .send({ offerId: OFFER.FLEET_APP });
    expect(reapply.status).toBe(201);
    expect(reapply.body.status).toBe("IN_PROGRESS");
  });

  it("interdit le retrait d'une candidature déjà traitée", async () => {
    const response = await request(app)
      .delete("/applications/3")
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("APPLICATION_ALREADY_PROCESSED");
  });

  it("n'autorise pas un étudiant à retirer la candidature d'un autre étudiant", async () => {
    const response = await request(app)
      .delete(`/applications/${APPLICATION.INES_FLEET_APP}`)
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT));

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
