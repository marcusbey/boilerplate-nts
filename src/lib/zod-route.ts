import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthPermissionSchema, RolesKeys } from "./auth/auth-permissions";
import { getUser } from "./auth/auth-user";
import { ApplicationError } from "./errors/application-error";
import { ZodRouteError } from "./errors/zod-route-error";
import { logger } from "./logger";
import { getCurrentOrg } from "./organizations/get-org";

/**
 * Base route handler with automatic error handling and validation
 *
 * @example
 * ```ts
 * export const POST = route
 *   .params(z.object({ id: z.string() }))
 *   .body(z.object({ name: z.string() }))
 *   .handler(async (req, { params, body }) => {
 *     return { success: true };
 *   });
 * ```
 */
export const route = createZodRoute({
  handleServerError: (e: Error) => {
    if (e instanceof ZodRouteError) {
      logger.debug("[DEV] - ZodRouteError", e);
      return NextResponse.json(
        { message: e.message },
        {
          status: e.status,
        },
      );
    }

    if (e instanceof ApplicationError) {
      logger.debug("[DEV] - ApplicationError", e);
      return NextResponse.json({ message: e.message }, { status: 400 });
    }

    logger.info("Unknown Error", e);

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  },
});

/**
 * Route handler with authentication middleware
 * Ensures user is logged in before accessing the route
 */
export const authRoute = route.use(async ({ next }) => {
  const user = await getUser();

  if (!user) {
    throw new ZodRouteError("Session not found!", 401);
  }

  return next({
    ctx: { user },
  });
});

/**
 * Route handler with organization-based authorization
 * Validates user permissions within an organization context
 *
 * @example
 * ```ts
 * export const POST = orgRoute
 *   .metadata({ permissions: { users: ["create"] } })
 *   .handler(async (req, { ctx }) => {
 *     // ctx.organization is available
 *     return { success: true };
 *   });
 * ```
 */
export const orgRoute = route
  .defineMetadata(
    z.object({
      roles: z.array(z.enum(RolesKeys)).optional(),
      permissions: AuthPermissionSchema.optional(),
    }),
  )
  .use(async ({ next, metadata }) => {
    const organization = await getCurrentOrg(metadata);

    if (!organization) {
      throw new ZodRouteError(
        "You need to be part of an organization to access this resource.",
        401,
      );
    }

    return next({
      ctx: { organization },
    });
  });
