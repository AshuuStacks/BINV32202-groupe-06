import type { Offer, PeriodCode } from "../models/offer.ts";
import { API_URL, readJson } from "../utils/api.ts";
import { isOfferList } from "../utils/guards.ts";

export const getOffers = async (
  token: string,
  period: PeriodCode | "",
  titleQuery: string,
  signal?: AbortSignal,
): Promise<Offer[]> => {
  const params = new URLSearchParams();
  const normalizedTitleQuery = titleQuery.trim();
  if (normalizedTitleQuery !== "") params.set("q", normalizedTitleQuery);
  if (period !== "") params.set("period", period);
  const query = params.size === 0 ? "" : `?${params.toString()}`;
  const response = await fetch(`${API_URL}/offers${query}`, {
    headers: { Authorization: token },
    signal,
  });
  return readJson(response, isOfferList, "Chargement des offres impossible");
};
