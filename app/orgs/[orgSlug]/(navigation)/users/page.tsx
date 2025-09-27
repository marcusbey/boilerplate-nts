import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { hasPermission } from "@/lib/auth/auth-org";
import { combineWithParentMetadata } from "@/lib/metadata";
import { serverToast } from "@/lib/server-toast";
import { ClientOrg } from "./client-org";
import { DonutChart } from "./donuts-chart";
import { UsersChart } from "./users-chart";

export const generateMetadata = combineWithParentMetadata({
  title: "Users",
  description: "Manage leads",
});

export default async function RoutePage(
  props: PageProps<"/orgs/[orgSlug]/users">,
) {
  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Videos</LayoutTitle>
      </LayoutHeader>
      <LayoutActions className="flex gap-2">
        {(await hasPermission({ users: ["delete"] })) && (
          <Button variant="outline">Delete</Button>
        )}
        {(await hasPermission({ users: ["create"] })) && (
          <form>
            <Button
              formAction={async () => {
                "use server";

                await serverToast("Important information", "error");
              }}
              variant="default"
            >
              Create
            </Button>
          </form>
        )}
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <UsersChart />
          <ClientOrg />
        </div>
        <DonutChart />
      </LayoutContent>
    </Layout>
  );
}
