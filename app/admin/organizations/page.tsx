import { Skeleton } from "@/components/ui/skeleton";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
import { Suspense } from "react";
import { OrganizationFilters } from "./_components/organization-filters";
import { OrganizationsList } from "./_components/organizations-list";

const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
});

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrganizationsPage(props: PageProps) {
  await getRequiredAdmin();

  const params = await searchParamsCache.parse(props.searchParams);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Organization Management</LayoutTitle>
        <LayoutDescription>
          View and manage all organizations in the system
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>{/* Add actions here if needed */}</LayoutActions>

      <LayoutContent>
        <div className="space-y-4">
          <OrganizationFilters />

          <Suspense fallback={<OrganizationTableSkeleton />}>
            <OrganizationsList searchParams={params} />
          </Suspense>
        </div>
      </LayoutContent>
    </Layout>
  );
}

const OrganizationTableSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);
