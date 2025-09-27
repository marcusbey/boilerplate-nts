import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import type { Page } from "@playwright/test";
import { retry } from "./retry";

export const getUserEmail = () =>
  `playwright-test-${faker.internet.email().toLowerCase()}`;

/**
 * Helper function to create a test account
 * @returns Object containing the test user's credentials
 */
export async function createTestAccount(options: {
  page: Page;
  callbackURL?: string;
  initialUserData?: { name: string; email: string; password: string };
  admin?: boolean;
}) {
  // Generate fake user data
  const userData = options.initialUserData ?? {
    name: faker.person.fullName(),
    email: getUserEmail(),
    password: faker.internet.password({ length: 12, memorable: true }),
  };

  // Navigate to signup page
  await options.page.goto(`/auth/signup?callbackUrl=${options.callbackURL}`);

  // Fill out the form
  await options.page.getByLabel("Name").fill(userData.name);
  await options.page.getByLabel("Email").fill(userData.email);
  await options.page.locator('input[name="password"]').fill(userData.password);
  await options.page
    .locator('input[name="verifyPassword"]')
    .fill(userData.password);

  // Submit the form
  await options.page.getByRole("button", { name: /sign up/i }).click();

  // Wait for navigation to complete - we should be redirected to the callback URL
  if (options.callbackURL) {
    await options.page.waitForLoadState("networkidle");
    // Extract pathname from callbackURL and match it regardless of domain
    const callbackPath = new URL(options.callbackURL, "http://localhost")
      .pathname;
    await options.page.waitForURL(
      new RegExp(
        `^[^/]*//[^/]*${callbackPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
      {
        timeout: 30000,
      },
    );
  }

  if (options.admin) {
    const user = await retry(
      async () =>
        prisma.user.findUniqueOrThrow({
          where: { email: userData.email },
        }),
      {
        maxAttempts: 5,
        delayMs: 1000,
        backoff: true,
      },
    );
    logger.info("Creating admin user", user);
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "admin" },
    });
    // await 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  return userData;
}

/**
 * Helper function to sign in with an existing account
 * @returns Object containing the user's credentials
 */
export async function signInAccount(options: {
  page: Page;
  userData: { email: string; password: string };
  callbackURL?: string;
}) {
  const { page, userData, callbackURL } = options;

  // Navigate to signin page
  await page.goto(
    `/auth/signin${callbackURL ? `?callbackUrl=${callbackURL}` : ""}`,
  );

  // Click on the "Use password" button
  await page.getByRole("button", { name: /use password/i }).click();

  // Fill out the form
  await page.getByLabel("Email").fill(userData.email);
  await page.locator('input[name="password"]').fill(userData.password);

  // Submit the form
  await page
    .getByRole("button", { name: /sign in/i })
    .first()
    .click();

  // Wait for navigation to complete if a callback URL is provided
  if (callbackURL) {
    try {
      // Extract pathname from callbackURL and match it regardless of domain
      const callbackPath = new URL(callbackURL, "http://localhost").pathname;
      await page.waitForURL(
        new RegExp(
          `^[^/]*//[^/]*${callbackPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        ),
        { timeout: 30000 },
      );
    } catch (error) {
      logger.error("Error waiting for navigation to complete", error);
    }
  }

  return userData;
}

/**
 * Helper function to sign out the current user
 * @param page - Playwright page object
 */
export async function signOutAccount(options: { page: Page }) {
  const { page } = options;

  // Navigate to account page
  await page.goto(`/account`);

  // Click the sign out button
  await page.getByRole("button", { name: /sign out/i }).click();

  await page.waitForURL(/\/auth\/signin/, { timeout: 10000 });
}
