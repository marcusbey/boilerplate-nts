import { prisma } from "@/lib/prisma";

async function globalTeardown() {
  const count = await prisma.user.deleteMany({
    where: {
      email: {
        contains: "playwright-test-",
      },
    },
  });

  // eslint-disable-next-line no-console
  console.info(`Cleanup ${count} test users`);
}

export default globalTeardown;
