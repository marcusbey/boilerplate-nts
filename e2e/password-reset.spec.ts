import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { createTestAccount, signInAccount } from "./utils/auth-test";

test("password reset flow", async ({ page }) => {
  // 1. Create a test account
  const userData = await createTestAccount({
    page,
    callbackURL: "/account",
  });

  // Wait to be on the account page
  // Wait 2 seconds to ensure everything is loaded

  await page.waitForURL(/\/account/, { timeout: 10000 });

  // 2. Sign out

  await page.getByRole("button", { name: /sign out/i }).click();
  await page.waitForURL(/\/auth\/signin/, { timeout: 10000 });

  // 3. Go to forget password page
  await page.goto(`${getServerUrl()}/auth/forget-password`);

  // 4. Submit the email for password reset
  await page.getByLabel("Email").fill(userData.email);
  await page.getByRole("button", { name: /send reset link/i }).click();

  // 5. Should be redirected to verify page
  await page.waitForURL(/\/auth\/verify/, { timeout: 10000 });

  const verification = await prisma.verification.findFirst({
    where: {
      identifier: {
        contains: "reset-password",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const token = verification?.identifier.replace("reset-password:", "");

  expect(token).not.toBeNull();

  // 7. Navigate to the reset password page with the token
  const resetToken = token;
  await page.goto(`${getServerUrl()}/auth/reset-password?token=${resetToken}`);

  // 8. Set a new password
  const newPassword = faker.internet.password({ length: 12, memorable: true });
  await page.locator('input[name="password"]').fill(newPassword);
  await page.pause();
  await page.getByRole("button", { name: /reset password/i }).click();

  await page.waitForURL(/\/auth\/signin/, { timeout: 10000 });

  await signInAccount({
    page,
    userData: {
      email: userData.email,
      password: newPassword,
    },
    callbackURL: "/orgs",
  });

  // Clean up - delete the test user
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (user) {
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
});
