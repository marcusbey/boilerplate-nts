import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { combineWithParentMetadata } from "@/lib/metadata";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { OrganizationDangerForm } from "./org-danger-form";
import { OrganizationDeleteDialog } from "./organization-delete-dialog";

export const generateMetadata = combineWithParentMetadata({
  title: "Danger",
  description: "Delete your organization.",
});

export default async function RoutePage(
  props: PageProps<"/orgs/[orgSlug]/settings/danger">,
) {
  const org = await getRequiredCurrentOrgCache({
    permissions: {
      organization: ["delete"],
    },
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <OrganizationDangerForm defaultValues={org} />
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete the organization</CardTitle>
          <CardDescription>
            By deleting your organization, you will lose all your data and your
            subscription will be cancelled.
          </CardDescription>
          <CardDescription>No refund will be provided.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2 border-t">
          <OrganizationDeleteDialog org={org} />
        </CardFooter>
      </Card>
    </div>
  );
}
