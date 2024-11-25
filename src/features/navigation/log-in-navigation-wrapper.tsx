import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/helper";
import { getUsersOrgs } from "@/query/org/get-users-orgs.query";
import type { PropsWithChildren } from "react";
import { OrgsSelect } from "../../../app/orgs/[orgSlug]/(navigation)/_navigation/orgs-select";
import { UserDropdown } from "../auth/user-dropdown";
import { NavigationWrapper } from "./navigation-wrapper";

export default async function AuthNavigationWrapper(props: PropsWithChildren) {
  const user = await auth();

  if (!user) {
    return <NavigationWrapper>{props.children}</NavigationWrapper>;
  }

  const userOrgs = await getUsersOrgs();

  return (
    <NavigationWrapper
      logoChildren={
        <OrgsSelect orgs={userOrgs} currentOrgSlug="new">
          <span>Organization...</span>
        </OrgsSelect>
      }
      topBarCornerLeftChildren={
        <UserDropdown>
          <Button variant="ghost" className="size-10 rounded-full" size="sm">
            <Avatar className="size-8">
              <AvatarFallback>
                {user.email ? user.email.slice(0, 2) : "??"}
              </AvatarFallback>
              {user.image && <AvatarImage src={user.image} />}
            </Avatar>
          </Button>
        </UserDropdown>
      }
    >
      {props.children}
    </NavigationWrapper>
  );
}
