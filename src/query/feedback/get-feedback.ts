import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const feedbackInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      banned: true,
      createdAt: true,
    },
  },
} satisfies Prisma.FeedbackInclude;

type GetFeedbackOptions = {
  page: number;
  pageSize?: number;
  search?: string;
};

export const getFeedbackList = async ({
  page,
  pageSize = 10,
  search,
}: GetFeedbackOptions) => {
  const whereClause: Prisma.FeedbackWhereInput = {};

  if (search) {
    whereClause.OR = [
      {
        message: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  const feedback = await prisma.feedback.findMany({
    where: whereClause,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: feedbackInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.feedback.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(total / pageSize);

  return {
    feedback,
    total,
    totalPages,
  };
};

export const getFeedbackById = async (id: string) => {
  return prisma.feedback.findUnique({
    where: { id },
    include: feedbackInclude,
  });
};

type FeedbackList = Prisma.PromiseReturnType<typeof getFeedbackList>;

export type FeedbackWithUser = FeedbackList["feedback"][number];
