import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";
import type { User } from "../models/user.ts";

const MAX_MESSAGE_LENGTH = 2000;

const requireStudent = (viewer: User): void => {
  if (!isStudent(viewer)) {
    throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut gérer ses candidatures");
  }
};

export const createApplicationsService = (repository: ApplicationsRepository) => ({
  listApplications: (viewer: User): Application[] => {
    requireStudent(viewer);
    return repository.findByStudent(viewer.id).map(toApplication);
  },

  apply: (viewer: User, offerId: number, message: string | null): Application => {
    requireStudent(viewer);
    const offerStatus = repository.findOfferStatus(offerId);
    if (offerStatus === undefined) {
      throw new HttpError(404, "NOT_FOUND", "Offre introuvable");
    }
    if (offerStatus !== "PUBLISHED") {
      throw new HttpError(409, "OFFER_NOT_PUBLISHED", "Cette offre n'est plus publiée");
    }
    if (message !== null && message.length > MAX_MESSAGE_LENGTH) {
      throw new HttpError(
        400,
        "INVALID_BODY",
        `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères`,
      );
    }
    const existingStatus = repository.findExistingStatus(offerId, viewer.id);
    if (existingStatus !== undefined && existingStatus !== "WITHDRAWN") {
      throw new HttpError(409, "ALREADY_APPLIED", "Vous avez déjà candidaté à cette offre");
    }

    const id = repository.create(offerId, viewer.id, message);
    const application = repository.findByIdForStudent(id, viewer.id);
    if (application === undefined) {
      throw new HttpError(500, "INTERNAL_ERROR", "La candidature créée est introuvable");
    }
    return toApplication(application);
  },

  withdraw: (viewer: User, id: number): void => {
    requireStudent(viewer);
    const application = repository.findByIdForStudent(id, viewer.id);
    if (application === undefined) {
      throw new HttpError(404, "NOT_FOUND", "Candidature introuvable");
    }
    if (application.status !== "IN_PROGRESS") {
      throw new HttpError(409, "APPLICATION_ALREADY_PROCESSED", "Cette candidature a déjà été traitée");
    }
    if (!repository.withdraw(id, viewer.id)) {
      throw new HttpError(409, "APPLICATION_ALREADY_PROCESSED", "Cette candidature a déjà été traitée");
    }
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
