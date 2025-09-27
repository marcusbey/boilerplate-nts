import { auth } from "@/lib/auth";
import { RESERVED_SLUGS } from "@/lib/organizations/reserved-slugs";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const handleRootRedirect = (request: NextRequest) => {
  if (!SiteConfig.features.enableLandingRedirection) return null;

  const session = getSessionCookie(request, {
    cookiePrefix: SiteConfig.appId,
  });

  if (!session) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/orgs";
  return NextResponse.redirect(url);
};

export const extractOrgSlug = (pathname: string) => {
  if (!pathname.startsWith("/orgs/")) return null;

  const slugStartIndex = "/orgs/".length;
  const slashIndex = pathname.indexOf("/", slugStartIndex);
  const slug =
    slashIndex === -1
      ? pathname.substring(slugStartIndex)
      : pathname.substring(slugStartIndex, slashIndex);

  const isValidSlug = slug && slug !== "" && pathname !== "/orgs";
  return isValidSlug ? slug : null;
};

export const validateSession = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: SiteConfig.appId,
  });

  if (!sessionCookie) return null;

  const [session, activeOrganisation] = await Promise.all([
    auth.api.getSession({ headers: request.headers }),
    auth.api.getFullOrganization({ headers: request.headers }),
  ]);

  if (!session?.session.userId) return null;

  return { session, activeOrganisation };
};

export const findUserOrganization = async (slug: string, userId: string) => {
  const org = await prisma.organization.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      members: {
        some: { userId },
      },
    },
    select: { id: true },
  });

  return org;
};

export const switchActiveOrganization = async (
  request: NextRequest,
  organizationId: string,
) => {
  await auth.api.setActiveOrganization({
    headers: request.headers,
    body: { organizationId },
  });

  return NextResponse.redirect(request.url);
};

export const redirectToOrgList = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/orgs";
  return NextResponse.redirect(url);
};

export const validateAdminAccess = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: SiteConfig.appId,
  });

  if (!sessionCookie) return null;

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return session.user;
};

export const redirectToRoot = (request: NextRequest) => {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
};

export const isAdminRoute = (pathname: string) => {
  return pathname.startsWith("/admin");
};

export const isReservedSlug = (slug: string) => {
  return RESERVED_SLUGS.includes(slug);
};
