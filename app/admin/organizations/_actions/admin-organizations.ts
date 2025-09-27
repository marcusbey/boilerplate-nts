import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const OrganizationInclude = {} satisfies Prisma.OrganizationInclude;

export type OrganizationWithStats = Prisma.OrganizationGetPayload<{
  include: typeof OrganizationInclude;
}>;

type GetOrganizationsOptions = {
  page: number;
  pageSize?: number;
  search?: string;
};

export const getOrganizationsWithStats = async ({
  page,
  pageSize = 10,
  search,
}: GetOrganizationsOptions): Promise<{
  organizations: OrganizationWithStats[];
  total: number;
  totalPages: number;
}> => {
  const whereClause: Prisma.OrganizationWhereInput = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const organizations = await prisma.organization.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: OrganizationInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.organization.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(total / pageSize);

  return {
    organizations,
    total,
    totalPages,
  };
};
