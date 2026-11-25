import { expect, test, type Page } from "@playwright/test";

const connectAsStudent = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "Étudiants" }).waitFor();
  await page.getByRole("button", { name: "Lucas Dupont" }).click();
  await expect(page.getByRole("link", { name: "Offres" })).toBeVisible();
  await page.getByRole("link", { name: "Offres" }).click();
  await expect(page.getByRole("heading", { name: "Offres de stage" })).toBeVisible();
};

test("Scénario 1 : recherche par titre avec résultat", async ({ page }) => {
  await connectAsStudent(page);

  await page.getByRole("searchbox", { name: "Rechercher par titre" }).fill("api rest");

  const matchingOffer = page.getByRole("row", { name: /API REST de facturation/ });
  await expect(matchingOffer).toBeVisible();
  await expect(page.getByRole("table").locator("tbody tr")).toHaveCount(1);
});

test("Scénario 2 : recherche par titre sans résultat", async ({ page }) => {
  await connectAsStudent(page);

  await page
    .getByRole("searchbox", { name: "Rechercher par titre" })
    .fill("e2e-introuvable-8472");

  await expect(page.getByText("Aucune offre ne correspond à la recherche.")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
});
