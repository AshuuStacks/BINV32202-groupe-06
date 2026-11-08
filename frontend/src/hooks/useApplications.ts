import { useCallback, useEffect, useState } from "react";
import type { Application } from "../models/application.ts";
import {
  createApplication,
  getApplications,
  withdrawApplication,
} from "../services/applications.service.ts";
import { isUnauthorized } from "../utils/api.ts";

export const useApplications = (token: string, onUnauthorized: () => void, enabled = true) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    (signal?: AbortSignal) => {
      getApplications(token, signal)
        .then((data) => {
          if (!signal?.aborted) setApplications(data);
        })
        .catch((reason: unknown) => {
          if (signal?.aborted) return;
          if (isUnauthorized(reason)) onUnauthorized();
          else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
        })
        .finally(() => {
          if (!signal?.aborted) setIsLoading(false);
        });
    },
    [token, onUnauthorized],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [enabled, reload]);

  const apply = async (offerId: number, message: string): Promise<boolean> => {
    try {
      setError(null);
      const application = await createApplication(token, offerId, message);
      setApplications((current) => [application, ...current]);
      return true;
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) onUnauthorized();
      else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
      return false;
    }
  };

  const withdraw = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await withdrawApplication(token, id);
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status: "WITHDRAWN" } : application,
        ),
      );
      return true;
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) onUnauthorized();
      else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
      return false;
    }
  };

  return { applications, isLoading, error, apply, withdraw };
};
