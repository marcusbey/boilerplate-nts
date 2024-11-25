import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { OrganizationDangerForm } from "./org-danger-form";
import { OrganizationDeleteDialog } from "./organization-delete-dialog";

export const generateMetadata = combineWithParentMetadata({
  title: "Danger",
  description: "Delete your organization.",
});

export default async function RoutePage(props: PageParams) {
  const { org, user } = await getRequiredCurrentOrgCache(["OWNER"]);

  const usersOrganizationsCount = await prisma.organizationMembership.count({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <OrganizationDangerForm defaultValues={org} />
      {usersOrganizationsCount <= 1 ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Delete the organization</CardTitle>
            <CardDescription>
              You can't delete this organization because you are the only
              member. If you want delete your organization, you need to delete
              your account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Link
              href="/account/danger"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Delete account
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Delete the organization</CardTitle>
            <CardDescription>
              By deleting your organization, you will lose all your data and
              your subscription will be cancelled.
            </CardDescription>
            <CardDescription>No refund will be provided.</CardDescription>
          </CardHeader>
          <CardFooter>
            <OrganizationDeleteDialog org={org} />
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
