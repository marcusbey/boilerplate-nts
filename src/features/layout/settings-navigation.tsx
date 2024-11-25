"use client";

import { useMatchingPathname } from "@/hooks/use-matching-pathname";
import { isInRoles } from "@/lib/organizations/is-in-roles";
import type { OrganizationMembershipRole } from "@prisma/client";
import { motion } from "framer-motion";
import Link from "next/link";

type SettingLink = {
  href: string;
  label: string;
  roles?: OrganizationMembershipRole[];
};

type SettingsNavigationProps = {
  links: SettingLink[];
  roles: OrganizationMembershipRole[];
};

export const SettingsNavigation = (props: SettingsNavigationProps) => {
  const matchingLink = useMatchingPathname(props.links.map((l) => l.href));

  return (
    <div
      className="top-4 flex items-start justify-start gap-2 max-md:w-full lg:sticky lg:flex-col lg:items-stretch"
      style={{ minWidth: 150 }}
    >
      {props.links.map((link) => {
        const isMatching = link.href === matchingLink;

        if (!isInRoles(props.roles, link.roles)) {
          return null;
        }

        return (
          <div key={link.href} className="relative h-10">
            {isMatching && (
              <motion.div
                // @ts-expect-error - TODO : Remove this when framer-motion fully supports react 19 (https://mlv.sh/fm-r19)
                className="absolute inset-0 rounded-md bg-accent/50"
                layoutId="settings-link-list"
              />
            )}
            <Link
              className="relative line-clamp-1 inline-flex h-10 w-full items-center justify-center rounded-md border border-transparent px-2.5 text-sm text-foreground transition-all duration-75 hover:border-accent/50 lg:text-left"
              href={link.href}
            >
              {link.label}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
