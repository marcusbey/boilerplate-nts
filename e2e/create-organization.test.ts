import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { nanoid } from "nanoid";
import { createTestAccount } from "./utils/auth-test";

test.describe("Create Organization", () => {
  test("should create a new organization after account creation", async ({
    page,
  }) => {
    // Create and login with a test account
    await createTestAccount({
      page,
      callbackURL: "/orgs",
    });

    await page.waitForURL(/\/orgs\/[^/]+$/);

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    // Click on organization selector
    await page.getByTestId("org-selector").click();

    // Click on "Add a new organization" button
    await page.getByText("Add a new organization").click();

    // Fill organization form
    const orgName = `${faker.animal.bear()}-${nanoid(3)}`.toLowerCase();
    const expectedSlug = orgName.split(" ").join("-");

    await page.getByLabel(/organization name/i).fill(orgName);
    await page.getByLabel(/organization slug/i).fill(expectedSlug);

    // Submit form
    await page.getByRole("button", { name: /create organization/i }).click();

    await expect(page).toHaveURL(`/orgs/${expectedSlug}`);

    // Verify that the organization selector contains the organization name
    await expect(page.getByTestId("org-selector")).toContainText(orgName);
  });
});
