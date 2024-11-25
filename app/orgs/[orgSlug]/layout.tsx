import { orgMetadata } from "@/lib/metadata";
import { getCurrentOrgCache } from "@/lib/react/cache";
import type { LayoutParams, PageParams } from "@/types/next";
import type { Metadata } from "next";
import { InjectCurrentOrgStore } from "./use-current-org";

export async function generateMetadata(
  props: PageParams<{ orgSlug: string }>,
): Promise<Metadata> {
  const params = await props.params;
  return orgMetadata(params.orgSlug);
}

export default async function RouteLayout(
  props: LayoutParams<{ orgSlug: string }>,
) {
  const org = await getCurrentOrgCache();

  return (
    <InjectCurrentOrgStore
      org={
        org?.org
          ? {
              id: org.org.id,
              slug: org.org.slug,
              name: org.org.name,
              image: org.org.image,
              plan: org.org.plan,
            }
          : undefined
      }
    >
      {props.children}
    </InjectCurrentOrgStore>
  );
}
