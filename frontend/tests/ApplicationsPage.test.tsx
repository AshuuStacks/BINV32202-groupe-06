import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { studentUser, stubFetch } from "./helpers/fetchMock.ts";

describe("ApplicationsPage", () => {
  it("affiche les quatre statuts et permet le retrait d'une candidature en cours", async () => {
    const applications = [
      {
        id: 1,
        offerId: 1,
        offerTitle: "Application React",
        companyShortName: "Lumen Digital",
        message: null,
        status: "IN_PROGRESS",
        appliedAt: "2026-10-02 18:10:00",
      },
      {
        id: 2,
        offerId: 2,
        offerTitle: "Portail client",
        companyShortName: "Orbis",
        message: null,
        status: "SELECTED",
        appliedAt: "2026-09-02 18:10:00",
      },
      {
        id: 3,
        offerId: 3,
        offerTitle: "API",
        companyShortName: "Orbis",
        message: null,
        status: "REJECTED",
        appliedAt: "2026-08-02 18:10:00",
      },
      {
        id: 4,
        offerId: 4,
        offerTitle: "Tests",
        companyShortName: "Orbis",
        message: null,
        status: "WITHDRAWN",
        appliedAt: "2026-07-02 18:10:00",
      },
    ];
    const fetchMock = stubFetch({
      "/api/applications": () => Response.json(applications),
    });

    render(
      <ApplicationsPage user={studentUser} token="jeton" onUnauthorized={vi.fn()} />,
    );

    expect(await screen.findByText("Application React")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Retenue")).toBeInTheDocument();
    expect(screen.getByText("Non retenue")).toBeInTheDocument();
    expect(screen.getByText("Retirée")).toBeInTheDocument();

    fetchMock.mockImplementation((input) =>
      String(input).startsWith("/api/applications/1")
        ? Promise.resolve(new Response(null, { status: 204 }))
        : Promise.resolve(Response.json(applications)),
    );
    screen.getByRole("button", { name: "Retirer" }).click();
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/applications/1",
        expect.objectContaining({ method: "DELETE" }),
      ),
    );
  });
});
