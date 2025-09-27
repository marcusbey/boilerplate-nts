import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { AuthPermissionSchema, RolesKeys } from "../auth/auth-permissions";
import { getRequiredUser } from "../auth/auth-user";
import { ActionError } from "../errors/action-error";
import { ApplicationError } from "../errors/application-error";
import { logger } from "../logger";
import { getRequiredCurrentOrg } from "../organizations/get-org";

/**
 * Base safe action client with error handling
 *
 * @description
 * The foundation client that provides:
 * - Comprehensive error handling and logging
 * - User-friendly error messages in production
 * - Full error details in development
 * - No authentication or authorization requirements
 *
 * Use this for public actions that don't require user authentication.
 *
 * @example
 * ```ts
 * export const subscribeNewsletter = action
 *   .inputSchema(z.object({
 *     email: z.string().email(),
 *     name: z.string().optional()
 *   }))
 *   .action(async ({ parsedInput: { email, name } }) => {
 *     await addToNewsletter(email, name);
 *     return { subscribed: true };
 *   });
 * ```
 */
export const action = createSafeActionClient({
  handleServerError,
});

/**
 * Authenticated safe action client
 *
 * @description
 * - Validates user session using getRequiredUser()
 * - Throws ActionError if no valid session found
 * - Provides authenticated user in context as ctx.user
 * - Ensures all actions require valid authentication
 *
 * Use this for actions that require a logged-in user but no specific permissions.
 *
 * @example
 * ```ts
 * export const updateProfile = authAction
 *   .inputSchema(z.object({
 *     name: z.string().min(1),
 *     bio: z.string().optional(),
 *   }))
 *   .action(async ({ parsedInput: { name, bio }, ctx: { user } }) => {
 *     // user is guaranteed to be authenticated
 *     await updateUserProfile(user.id, { name, bio });
 *     return { updated: true };
 *   });
 * ```
 */
export const authAction = createSafeActionClient({
  handleServerError,
}).use(async ({ next }) => {
  const user = await getRequiredUser();

  return next({
    ctx: {
      user: user,
    },
  });
});

/**
 * Organization-based safe action client with role and permission authorization
 *
 * @description
 * The most comprehensive client that provides:
 * - Role-based access control (RBAC) via metadata.roles
 * - Fine-grained permission checking via metadata.permissions
 * - Automatic organization membership validation
 * - Type-safe metadata schema for roles and permissions
 *
 * Use this for actions that require specific organizational roles or permissions.
 * The user must be part of an organization and have the required roles/permissions.
 *
 *
 * @example
 * ```ts
 * // Require specific permissions
 * export const inviteUser = orgAction
 *   .metadata({ permissions: { users: ["create", "invite"] } })
 *   .inputSchema(z.object({
 *     email: z.string().email(),
 *     role: z.enum(["member", "admin"])
 *   }))
 *   .action(async ({ parsedInput: { email, role }, ctx: { org } }) => {
 *     const invitation = await inviteUserToOrg(email, role, org.id);
 *     return { invitationId: invitation.id };
 *   });
 * ```
 *
 * @example
 * ```ts
 * // Combine roles and permissions
 * export const manageTeam = orgAction
 *   .metadata({
 *     roles: ["admin", "manager"],
 *     permissions: { teams: ["create", "update", "delete"] }
 *   })
 *   .inputSchema(z.object({
 *     action: z.enum(["create", "update", "delete"]),
 *     teamData: z.object({ name: z.string() }).optional()
 *   }))
 *   .action(async ({ parsedInput, ctx: { org } }) => {
 *     // User has admin/manager role AND team management permissions
 *     return await performTeamAction(parsedInput, org.id);
 *   });
 * ```
 */
export const orgAction = createSafeActionClient({
  handleServerError,
  defineMetadataSchema() {
    return z
      .object({
        roles: z.array(z.enum(RolesKeys)).optional(),
        permissions: AuthPermissionSchema.optional(),
      })
      .optional();
  },
}).use(async ({ next, metadata = {} }) => {
  try {
    const org = await getRequiredCurrentOrg(metadata);
    return next({
      ctx: { org },
    });
  } catch {
    throw new ActionError(
      "You need to be part of an organization to access this resource.",
    );
  }
});

function handleServerError(e: Error) {
  if (e instanceof ApplicationError) {
    logger.debug("[DEV] - Action Error", e.message);
    return e.message;
  }

  logger.info("Unknown Error", e);

  if (process.env.NODE_ENV === "development") {
    return e.message;
  }

  return "An unexpected error occurred.";
}
