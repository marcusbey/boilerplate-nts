import { orgMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrg } from "@/lib/organizations/get-org";
import type { Metadata } from "next";
import { InjectCurrentOrgStore } from "./use-current-org";

export async function generateMetadata(
  props: LayoutProps<"/orgs/[orgSlug]">,
): Promise<Metadata> {
  const params = await props.params;
  return orgMetadata(params.orgSlug);
}

export default async function RouteLayout(
  props: LayoutProps<"/orgs/[orgSlug]">,
) {
  // Organization validation is now handled by middleware for security
  // This ensures the user has access before reaching this layout
  const org = await getRequiredCurrentOrg();

  return (
    <InjectCurrentOrgStore
      org={{
        id: org.id,
        slug: org.slug,
        name: org.name,
        image: org.logo ?? null,
        subscription: org.subscription,
      }}
    >
      {props.children}
    </InjectCurrentOrgStore>
  );
}
