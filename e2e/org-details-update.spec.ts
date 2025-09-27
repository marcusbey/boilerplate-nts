import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("update organization name", async ({ page }) => {
  // 1. Create a test account (owner)
  await createTestAccount({
    page,
    callbackURL: "/orgs",
  });

  // Wait for navigation to complete - we should be redirected to the organization page
  await page.waitForURL(/\/orgs\/[^/]+$/);

  // Extract organization slug from URL
  const currentUrl = page.url();
  const orgSlug = currentUrl.split("/orgs/")[1].split("/")[0];

  // Store the original organization data for verification
  const originalOrg = await prisma.organization.findFirst({
    where: {
      slug: orgSlug,
    },
  });

  if (!originalOrg) {
    throw new Error("Organization not found");
  }

  // 2. Navigate to organization settings page
  await page.goto(`/orgs/${orgSlug}/settings`);

  // 4. Generate a new organization name
  const newOrgName = faker.company.name();

  // Find the input within that card and update it
  const nameInput = page.locator('input[name="name"]');

  // Verify the current value matches the original org name
  await expect(nameInput).toHaveValue(originalOrg.name);

  // Update the name
  await nameInput.clear();
  await nameInput.fill(newOrgName);

  // 6. Click the save button
  await page.getByRole("button", { name: "Save", exact: true }).first().click();

  // refresh
  await page.reload();

  await page.waitForLoadState("networkidle");

  const nameInput2 = page.locator('input[name="name"]');

  await expect(nameInput2).toHaveValue(newOrgName);

  const updatedOrg = await prisma.organization.findFirst({
    where: {
      slug: orgSlug,
    },
  });

  expect(updatedOrg?.name).toBe(newOrgName);
});
