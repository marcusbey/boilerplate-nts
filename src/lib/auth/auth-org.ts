import { headers } from "next/headers";
import { auth } from "../auth";
import type { AuthPermission } from "./auth-permissions";

export const hasPermission = async (permission: AuthPermission) => {
  const result = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      permission,
    },
  });

  return result.success;
};
