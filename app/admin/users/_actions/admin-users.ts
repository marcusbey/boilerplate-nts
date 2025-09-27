import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const UserInclude = {} satisfies Prisma.UserInclude;

export type UserWithStats = Prisma.UserGetPayload<{
  include: typeof UserInclude;
}>;

type GetUsersOptions = {
  page: number;
  pageSize?: number;
  search?: string;
};

export const getUsersWithStats = async ({
  page,
  pageSize = 10,
  search,
}: GetUsersOptions): Promise<{
  users: UserWithStats[];
  total: number;
  totalPages: number;
}> => {
  // Build where clause
  const whereClause: Prisma.UserWhereInput = {};

  // Search filter
  if (search) {
    whereClause.email = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Get users with basic info
  const users = await prisma.user.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: UserInclude,
  });

  // Get total count
  const total = await prisma.user.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(total / pageSize);

  return {
    users,
    total,
    totalPages,
  };
};
