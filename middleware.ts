import {
  extractOrgSlug,
  findUserOrganization,
  handleRootRedirect,
  isAdminRoute,
  isReservedSlug,
  redirectToOrgList,
  redirectToRoot,
  switchActiveOrganization,
  validateAdminAccess,
  validateSession,
} from "@/lib/auth/middleware-utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return handleRootRedirect(request) ?? NextResponse.next();
  }

  if (isAdminRoute(pathname)) {
    const adminUser = await validateAdminAccess(request);
    if (!adminUser) {
      return redirectToRoot(request);
    }
    return NextResponse.next();
  }

  const slug = extractOrgSlug(pathname);
  if (!slug) return NextResponse.next();

  if (isReservedSlug(slug)) {
    return NextResponse.next();
  }

  const sessionData = await validateSession(request);
  if (!sessionData) return NextResponse.next();

  const { session, activeOrganisation } = sessionData;

  if (activeOrganisation?.slug === slug) {
    return NextResponse.next();
  }

  const org = await findUserOrganization(slug, session.session.userId);

  if (!org) {
    return redirectToOrgList(request);
  }

  return switchActiveOrganization(request, org.id);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "nodejs",
};
