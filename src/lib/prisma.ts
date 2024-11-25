import { PrismaClient } from "@prisma/client";
import { onOrganizationUpdate } from "./prisma/prisma.org.extends";
import { onUserUpdate } from "./prisma/prisma.user.extends";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      organization: {
        update: onOrganizationUpdate,
      },
      user: {
        update: onUserUpdate,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
