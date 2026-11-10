import type { Db } from "../db/database.ts";
import type { ApplicationDbo } from "../models/application.ts";

interface StudentParams {
  studentId: number;
}

interface CreateParams {
  offerId: number;
  studentId: number;
  message: string | null;
}

interface ApplicationParams {
  id: number;
  studentId: number;
}

export const createApplicationsRepository = (db: Db) => {
  const findByStudent = db.prepare<StudentParams, ApplicationDbo>(`
    SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name,
           a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    WHERE a.student_id = @studentId
    ORDER BY a.applied_at DESC, a.id DESC
  `);

  const findByIdForStudent = db.prepare<ApplicationParams, ApplicationDbo>(`
    SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name,
           a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    WHERE a.id = @id AND a.student_id = @studentId
  `);

  const findOfferStatus = db.prepare<{ offerId: number }, { status: string }>(`
    SELECT status FROM offers WHERE id = @offerId
  `);

  const findExisting = db.prepare<{ offerId: number; studentId: number }, { status: string }>(`
    SELECT status
    FROM applications
    WHERE offer_id = @offerId AND student_id = @studentId
    ORDER BY id DESC
    LIMIT 1
  `);

  const insert = db.prepare<CreateParams>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
  `);

  const withdraw = db.prepare<ApplicationParams>(`
    UPDATE applications
    SET status = 'WITHDRAWN'
    WHERE id = @id AND student_id = @studentId AND status = 'IN_PROGRESS'
  `);

  return {
    findByStudent: (studentId: number): ApplicationDbo[] => findByStudent.all({ studentId }),
    findByIdForStudent: (id: number, studentId: number): ApplicationDbo | undefined =>
      findByIdForStudent.get({ id, studentId }),
    findOfferStatus: (offerId: number): string | undefined => findOfferStatus.get({ offerId })?.status,
    findExistingStatus: (offerId: number, studentId: number): string | undefined =>
      findExisting.get({ offerId, studentId })?.status,
    create: (offerId: number, studentId: number, message: string | null): number => {
      const result = insert.run({ offerId, studentId, message });
      return Number(result.lastInsertRowid);
    },
    withdraw: (id: number, studentId: number): boolean =>
      withdraw.run({ id, studentId }).changes === 1,
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
