import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const getOrgsMembers = async (orgId: string) => {
  return prisma.member.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      user: {
        select: {
          image: true,
          id: true,
          name: true,
          email: true,
        },
      },
      id: true,
      role: true,
      userId: true,
    },
  });
};

export type OrgMembers = Prisma.PromiseReturnType<typeof getOrgsMembers>;
