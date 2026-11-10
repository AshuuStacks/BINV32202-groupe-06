import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import { authorize } from "../middlewares/authorize.ts";
import type { ApplicationsService } from "../services/applications.service.ts";
import { canManageApplications } from "../services/permissions.ts";
import { HttpError } from "../utils/httpError.ts";

const parsePositiveInteger = (value: unknown, field: string): number => {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw new HttpError(400, "INVALID_BODY", `${field} doit être un entier positif`);
  }
  return Number(value);
};

const parseBody = (body: unknown): { offerId: number; message: string | null } => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(400, "INVALID_BODY", "Le corps de la requête est invalide");
  }
  const input = body as { offerId?: unknown; message?: unknown };
  const offerId = typeof input.offerId === "number" && Number.isInteger(input.offerId) && input.offerId > 0
    ? input.offerId
    : (() => {
        throw new HttpError(400, "INVALID_BODY", "offerId doit être un entier positif");
      })();
  if (input.message !== undefined && input.message !== null && typeof input.message !== "string") {
    throw new HttpError(400, "INVALID_BODY", "message doit être une chaîne de caractères");
  }
  const message = typeof input.message === "string" ? input.message.trim() : null;
  return { offerId, message: message === "" ? null : message };
};

export const createApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.get("/", authorize(canManageApplications), (req, res) => {
    res.json(service.listApplications(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/", authorize(canManageApplications), (req, res) => {
    const { offerId, message } = parseBody(req.body);
    res.status(201).json(toApplicationDto(service.apply(getCurrentUser(req), offerId, message)));
  });

  router.delete("/:id", authorize(canManageApplications), (req, res) => {
    service.withdraw(getCurrentUser(req), parsePositiveInteger(req.params.id, "id"));
    res.status(204).send();
  });

  return router;
};
