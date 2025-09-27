"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

/**
 * This component is used to automatically select the organization when the user is redirected to the organization page.
 * It is used to avoid the user to select the organization manually.
 * @param props.orgs - The list of organizations the user has access to
 * @returns null
 */
export const OrgAutoSelect = (props: { orgs: { slug: string }[] }) => {
  const params = useParams();

  const orgSlug = params.orgSlug as string;

  useQuery({
    queryKey: ["org-auto-select", orgSlug],
    queryFn: async () => {
      if (!orgSlug) {
        return null;
      }

      const org = props.orgs.find((org) => org.slug === orgSlug);

      if (!org) {
        return null;
      }

      const result = await authClient.organization.setActive({
        organizationSlug: org.slug,
      });

      if (result.error) {
        return;
      }

      window.location.reload();
    },
    enabled: !!orgSlug,
  });

  return null;
};
