import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";
import { SiteConfig } from "@/site-config";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin path)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|admin).*)",
  ],
};

export async function middleware(req: NextRequest) {
  // Inject the current URL inside the request headers
  // Useful to get the parameters of the current request
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);

  // This settings is used to redirect the user to the organization page if he is logged in
  // The landing page is still accessible with the /home route
  if (
    req.nextUrl.pathname === "/" &&
    SiteConfig.features.enableLandingRedirection
  ) {
    const cookieList = await cookies();
    const authCookie = cookieList.get(AUTH_COOKIE_NAME);

    if (authCookie) {
      const url = new URL(req.url);
      url.pathname = "/orgs";
      return NextResponse.redirect(url.toString());
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
