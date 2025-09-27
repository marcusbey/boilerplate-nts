import { AutomaticPagination } from "@/components/nowts/automatic-pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganizationsWithStats } from "../_actions/admin-organizations";
import { OrganizationRow } from "./organization-row";

type OrganizationsListProps = {
  searchParams: {
    page: number;
    q: string;
  };
};

export const OrganizationsList = async ({
  searchParams,
}: OrganizationsListProps) => {
  const pageSize = 10;
  const currentPage = searchParams.page;

  const { organizations, totalPages } = await getOrganizationsWithStats({
    page: currentPage,
    pageSize,
    search: searchParams.q || undefined,
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <OrganizationRow key={org.id} organization={org} />
          ))}
        </TableBody>
      </Table>

      <AutomaticPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParam={searchParams.q || undefined}
      />
    </>
  );
};
