import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { NextResponse } from "next/server";

/**
 * If a user arrive to `/orgs` we redirect them to the first organization they are part of.
 *
 * 💡 If you want to redirect user to organization page, redirect them to `/orgs`
 * 💡 If you want them to redirect to a specific organization, redirect them to `/orgs/orgSlug`
 */
export const GET = async () => {
  const user = await auth();

  if (!user) {
    return NextResponse.redirect(`${getServerUrl()}/auth/signin`);
  }

  const organization = await prisma.organization.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!organization) {
    return NextResponse.redirect(`${getServerUrl()}/orgs/new`);
  }

  return NextResponse.redirect(`${getServerUrl()}/orgs/${organization.slug}`);
};
