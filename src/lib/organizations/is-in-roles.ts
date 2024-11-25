import type { OrganizationMembershipRole } from "@prisma/client";

/**
 *
 * @param userRoles User's roles
 * @param rolesNeeded Roles to check
 * @returns a boolean indicating if the user has at least one role in rolesB
 */
export const isInRoles = (
  userRoles?: OrganizationMembershipRole[],
  rolesNeeded?: OrganizationMembershipRole[],
) => {
  if (!userRoles) return false;

  // Owner can access to everything
  if (userRoles.includes("OWNER")) return true;

  if (!rolesNeeded) return true;
  return rolesNeeded.every((role) => userRoles.includes(role));
};
