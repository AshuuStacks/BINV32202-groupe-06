import { useState, type FormEvent } from "react";
import type { Offer } from "../models/offer.ts";
import type { Application } from "../models/application.ts";
import { OFFER_STATUS_LABELS, OFFER_STATUS_TONES, PERIOD_LABELS } from "../utils/labels.ts";
import StatusBadge from "./StatusBadge.tsx";

interface OfferTableProps {
  offers: Offer[];
  applications?: Application[];
  onApply?: (offerId: number, message: string) => Promise<boolean>;
}

const OfferTable = ({ offers, applications = [], onApply }: OfferTableProps) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Titre</th>
          <th scope="col">Entreprise</th>
          <th scope="col">Année</th>
          <th scope="col">Période</th>
          <th scope="col">Statut</th>
          {onApply && <th scope="col">Action</th>}
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id}>
            <td>{offer.title}</td>
            <td>{offer.companyShortName}</td>
            <td>{offer.academicYear}</td>
            <td>{PERIOD_LABELS[offer.period]}</td>
            <td>
              <StatusBadge
                label={OFFER_STATUS_LABELS[offer.status]}
                tone={OFFER_STATUS_TONES[offer.status]}
              />
            </td>
            {onApply && (
              <td>
                {applications.some(
                  (application) => application.offerId === offer.id && application.status !== "WITHDRAWN",
                ) ? (
                  <span>Candidature envoyée</span>
                ) : (
                  <OfferApplicationForm offerId={offer.id} onApply={onApply} />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface OfferApplicationFormProps {
  offerId: number;
  onApply: (offerId: number, message: string) => Promise<boolean>;
}

const OfferApplicationForm = ({ offerId, onApply }: OfferApplicationFormProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    if (await onApply(offerId, message)) setMessage("");
    setIsSending(false);
  };

  return (
    <form onSubmit={submit}>
      <label>
        <span className="sr-only">Message facultatif</span>
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message (facultatif)" />
      </label>
      <button type="submit" disabled={isSending}>
        Candidater
      </button>
    </form>
  );
};

export default OfferTable;
