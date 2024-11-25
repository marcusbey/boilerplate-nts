"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonLink } from "@/components/ui/sidebar-utils";
import { UserDropdown } from "@/features/auth/user-dropdown";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import type { OrganizationMembershipRole } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { PropsWithChildren} from "react";
import { useEffect, useState } from "react";
import { OrgCommand } from "./org-command";
import { getOrganizationNavigation } from "./org-navigation.links";
import { OrgsSelect } from "./orgs-select";
import { UpgradeCard } from "./upgrade-org-card";

export function OrgSidebar({
  slug,
  userOrgs,
  roles,
}: {
  slug: string;
  roles: OrganizationMembershipRole[] | undefined;
  userOrgs: {
    id: string;
    slug: string;
    name: string;
    image: string | null;
  }[];
}) {
  const links: NavigationGroup[] = getOrganizationNavigation(slug, roles);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2">
        <OrgsSelect orgs={userOrgs} currentOrgSlug={slug} />
        <OrgCommand />
      </SidebarHeader>
      <SidebarContent>
        {links.map((link) => (
          <ItemCollapsing
            defaultOpenStartPath={link.defaultOpenStartPath}
            key={link.title}
          >
            <SidebarGroup key={link.title}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {link.title}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {link.links.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButtonLink href={item.href}>
                          <item.Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButtonLink>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </ItemCollapsing>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <UpgradeCard />
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const UserButton = () => {
  const session = useSession();
  const data = session.data?.user;
  return (
    <UserDropdown>
      <Button variant="outline">
        <Avatar className="size-6">
          <AvatarFallback>{data?.name?.[0] ?? "-"}</AvatarFallback>
          {data?.image && <AvatarImage src={data.image} />}
        </Avatar>
        <span>{data?.name}</span>
      </Button>
    </UserDropdown>
  );
};

const ItemCollapsing = (
  props: PropsWithChildren<{ defaultOpenStartPath?: string }>,
) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isOpen = props.defaultOpenStartPath
    ? pathname.startsWith(props.defaultOpenStartPath)
    : true;

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);
  return (
    <Collapsible
      defaultOpen={isOpen}
      onOpenChange={setOpen}
      open={open}
      className="group/collapsible"
    >
      {props.children}
    </Collapsible>
  );
};
