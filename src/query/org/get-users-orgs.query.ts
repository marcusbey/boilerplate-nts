import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUsersOrgs() {
  const userOrganizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  return userOrganizations;
}
