import type { auth } from "../auth";

export type AuthOrganization = Awaited<
  ReturnType<typeof auth.api.listOrganizations>
>[number];
