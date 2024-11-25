import type {
  NavigationGroup,
  NavigationLink,
} from "@/features/navigation/navigation.type";
import { isInRoles } from "@/lib/organizations/is-in-roles";
import { SiteConfig } from "@/site-config";
import type { OrganizationMembershipRole } from "@prisma/client";
import {
  CreditCard,
  Home,
  Settings,
  TriangleAlert,
  User,
  User2,
} from "lucide-react";

const replaceSlug = (href: string, slug: string) => {
  return href.replace(":organizationSlug", slug);
};

export const getOrganizationNavigation = (
  slug: string,
  userRoles: OrganizationMembershipRole[] | undefined,
): NavigationGroup[] => {
  return ORGANIZATION_LINKS.map((group: NavigationGroup) => {
    return {
      ...group,
      defaultOpenStartPath: group.defaultOpenStartPath
        ? replaceSlug(group.defaultOpenStartPath, slug)
        : undefined,
      links: group.links
        .filter((link: NavigationLink) =>
          link.roles ? isInRoles(userRoles, link.roles) : true,
        )
        .map((link: NavigationLink) => {
          return {
            ...link,
            href: replaceSlug(link.href, slug),
          };
        }),
    };
  });
};

const ORGANIZATION_PATH = `/orgs/:organizationSlug`;

export const ORGANIZATION_LINKS: NavigationGroup[] = [
  {
    title: "Menu",
    links: [
      {
        href: ORGANIZATION_PATH,
        Icon: Home,
        label: "Dashboard",
      },
      {
        href: `${ORGANIZATION_PATH}/users`,
        Icon: User,
        label: "Users",
      },
    ],
  },
  SiteConfig.features.enableSingleMemberOrg
    ? {
        title: "Settings",
        links: [
          {
            href: `/account`,
            Icon: Settings,
            label: "Account",
          },
        ],
      }
    : {
        title: "Organization",
        defaultOpenStartPath: `${ORGANIZATION_PATH}/settings`,
        links: [
          {
            href: `${ORGANIZATION_PATH}/settings`,
            Icon: Settings,
            label: "Settings",
          },
          {
            href: `${ORGANIZATION_PATH}/settings/members`,
            Icon: User2,
            label: "Members",
            roles: ["ADMIN"],
          },
          {
            href: `${ORGANIZATION_PATH}/settings/billing`,
            label: "Billing",
            roles: ["ADMIN"],
            Icon: CreditCard,
          },
          {
            href: `${ORGANIZATION_PATH}/settings/danger`,
            label: "Danger Zone",
            roles: ["OWNER"],
            Icon: TriangleAlert,
          },
        ],
      },
] satisfies NavigationGroup[];
