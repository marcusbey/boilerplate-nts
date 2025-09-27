import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test.describe("admin", () => {
  test("verify admin dashboard work", async ({ page }) => {
    await createTestAccount({
      page,
      callbackURL: "/orgs",
      admin: true,
    });

    await page.goto("/admin");

    await expect(page.getByRole("link", { name: "Users" })).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Organizations" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Users" }).click();

    await expect(page).toHaveURL("/admin/users");

    await page.getByRole("link", { name: "Organizations" }).click();
    await expect(page).toHaveURL("/admin/organizations");
  });
});
