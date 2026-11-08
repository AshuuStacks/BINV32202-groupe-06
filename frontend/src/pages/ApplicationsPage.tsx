import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import { useApplications } from "../hooks/useApplications.ts";
import type { User } from "../models/user.ts";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONES } from "../utils/labels.ts";

interface ApplicationsPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const ApplicationsPage = ({ token, onUnauthorized }: ApplicationsPageProps) => {
  const { applications, isLoading, error, withdraw } = useApplications(token, onUnauthorized);

  if (error) return <ErrorState message={error} />;
  if (isLoading) return <LoadingState />;
  if (applications.length === 0) return <EmptyState message="Aucune candidature à afficher." />;

  return (
    <section>
      <h1>Mes candidatures</h1>
      <p>{applications.length} candidature{applications.length > 1 ? "s" : ""}</p>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Offre</th>
              <th>Entreprise</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.offerTitle}</td>
                <td>{application.companyShortName}</td>
                <td>
                  <StatusBadge
                    label={APPLICATION_STATUS_LABELS[application.status]}
                    tone={APPLICATION_STATUS_TONES[application.status]}
                  />
                </td>
                <td>
                  {application.status === "IN_PROGRESS" && (
                    <button type="button" onClick={() => void withdraw(application.id)}>
                      Retirer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ApplicationsPage;
