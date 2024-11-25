import { OrganizationMembershipRole, type User } from "@prisma/client";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { auth, AuthError } from "../auth/helper";
import { logger } from "../logger";
import { getRequiredCurrentOrg } from "../organizations/get-org";

export class ActionError extends Error {}

type handleServerError = (e: Error) => string;

const handleServerError: handleServerError = (e) => {
  if (e instanceof ActionError) {
    logger.info("[DEV] - Action Error", e.message);
    return e.message;
  }

  if (e instanceof AuthError) {
    logger.info("[DEV] - Auth Error", e.message);
    return e.message;
  }

  logger.info("[DEV] - Unknown Error", e);

  return "An unexpected error occurred.";
};

export const action = createSafeActionClient({
  handleServerError,
});

const getUser = async () => {
  const user = await auth();

  if (!user) {
    throw new ActionError("Session not found!");
  }

  if (!user.id || !user.email) {
    throw new ActionError("Session is not valid!");
  }

  return user as User;
};

export const authAction = createSafeActionClient({
  handleServerError,
}).use(async ({ next }) => {
  const user = await getUser();

  return next({
    ctx: {
      user: user as User,
    },
  });
});

export const orgAction = createSafeActionClient({
  handleServerError,
  defineMetadataSchema() {
    return z
      .object({
        roles: z.array(z.nativeEnum(OrganizationMembershipRole)),
      })
      .optional();
  },
}).use(async ({ next, metadata = { roles: [] } }) => {
  try {
    const org = await getRequiredCurrentOrg(metadata.roles);
    return next({
      ctx: org,
    });
  } catch {
    throw new ActionError(
      "You need to be part of an organization to access this resource.",
    );
  }
});
