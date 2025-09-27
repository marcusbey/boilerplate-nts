import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("sign up and verify account creation", async ({ page }) => {
  const userData = await createTestAccount({
    page,
    callbackURL: "/orgs",
  });

  await page.waitForURL(/\/orgs\/.*/);

  // Verify we're on an organization page
  const currentUrl = page.url();
  expect(currentUrl).toMatch(/\/orgs\/.*/);

  // Extract organization slug from URL
  const orgSlug = currentUrl.split("/orgs/")[1].split("/")[0];

  // Verify the user was created in the database
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
    include: {
      members: {
        include: {
          organization: true,
        },
      },
    },
  });

  // Verify user exists
  expect(user).not.toBeNull();
  expect(user?.name).toBe(userData.name);
  expect(user?.email).toBe(userData.email);
  expect(user?.emailVerified).toBe(false); // Email should not be verified yet

  // Verify user is part of an organization
  expect(user?.members.length).toBeGreaterThan(0);

  // Verify the organization slug matches the one in the URL
  const userOrg = user?.members[0].organization;
  expect(userOrg?.slug).toBe(orgSlug);

  // Clean up - delete the test user and organization
  // This is optional but helps keep the test database clean
  if (user) {
    // Delete the user (cascade should handle related records)
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
});
