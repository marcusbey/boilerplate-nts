import type { OrganizationMembershipRole, Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "../auth/helper";
import { prisma } from "../prisma";

const getOrgSlugFromUrl = async () => {
  const headerList = await headers();
  const xURL = headerList.get("x-url");

  if (!xURL) {
    return null;
  }

  // get the parameters after /orgs/ or /organizations/ and before a / or ? (if there are params)
  const match = xURL.match(/\/(?:orgs|organizations)\/([^/?]+)(?:[/?]|$)/);

  if (!match) {
    return null;
  }

  const organizationSlug = match[1];

  if (!organizationSlug) {
    return null;
  }

  return organizationSlug;
};

export const OrgSelectQuery = (userId: string) =>
  ({
    id: true,
    slug: true,
    name: true,
    plan: true,
    email: true,
    image: true,
    stripeCustomerId: true,
    members: {
      where: {
        userId: userId,
      },
      select: {
        roles: true,
      },
    },
  }) satisfies Prisma.OrganizationSelect;

export type CurrentOrgPayload = Prisma.OrganizationGetPayload<{
  select: ReturnType<typeof OrgSelectQuery>;
}>;

export const getCurrentOrg = async (roles?: OrganizationMembershipRole[]) => {
  const user = await auth();

  if (!user) {
    return null;
  }

  const organizationSlug = await getOrgSlugFromUrl();

  if (!organizationSlug) {
    return null;
  }

  const org = await prisma.organization.findFirst({
    where: {
      slug: organizationSlug,
      members: {
        some: {
          userId: user.id,
          roles: roles
            ? {
                hasSome: [...roles, "OWNER"],
              }
            : undefined,
        },
      },
    },
    select: OrgSelectQuery(user.id),
  });

  if (!org) {
    return null;
  }

  return {
    org,
    user,
    roles: org.members[0].roles,
  };
};

export const getRequiredCurrentOrg = async (
  roles?: OrganizationMembershipRole[],
) => {
  const result = await getCurrentOrg(roles);

  if (!result) {
    notFound();
  }

  return result;
};
