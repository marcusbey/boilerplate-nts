/* eslint-disable @typescript-eslint/promise-function-async */
"use client";

import type { PlanLimit } from "@/lib/auth/stripe/auth-plans";
import { getPlanLimits } from "@/lib/auth/stripe/auth-plans";
import type { CurrentOrgPayload } from "@/lib/organizations/get-org";
import type { PropsWithChildren } from "react";
import { create } from "zustand";

type CurrentOrgStore = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  subscription: CurrentOrgPayload["subscription"] | null;
  limits: PlanLimit;
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
    org?: Omit<CurrentOrgStore, "limits">;
  }>,
) => {
  if (!props.org) return props.children;

  if (useCurrentOrg.getState()) return props.children;

  useCurrentOrg.setState({
    id: props.org.id,
    slug: props.org.slug,
    name: props.org.name,
    image: props.org.image,
    subscription: props.org.subscription,
    limits: getPlanLimits(props.org.subscription?.plan),
  });
  return props.children;
};
