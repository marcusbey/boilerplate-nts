/* eslint-disable @typescript-eslint/promise-function-async */
"use client";

import type { OrganizationPlan } from "@prisma/client";
import type { PropsWithChildren } from "react";
import { create } from "zustand";

type CurrentOrgStore = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  plan: OrganizationPlan;
};

/**
 * Get the current org id in **client component**
 *
 * Usage :
 *
 * ```tsx
 * "use client";
 *
 * export const ClientComponent = () => {
 *   const currentOrg = useCurrentOrg();
 *
 *   return (
 *     <div>
 *       <p>Current org id : {currentOrg.id}</p>
 *     </div>
 *   )
 * }
 */
export const useCurrentOrg = create<CurrentOrgStore | null>(() => null);

export const InjectCurrentOrgStore = (
  props: PropsWithChildren<{
    org?: CurrentOrgStore;
  }>,
) => {
  if (!props.org) return props.children;

  if (useCurrentOrg.getState()) return props.children;

  useCurrentOrg.setState({
    id: props.org.id,
    slug: props.org.slug,
    name: props.org.name,
    image: props.org.image,
    plan: props.org.plan,
  });
  return props.children;
};
