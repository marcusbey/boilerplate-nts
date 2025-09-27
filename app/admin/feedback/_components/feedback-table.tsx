import { AutomaticPagination } from "@/components/nowts/automatic-pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFeedbackList } from "@/query/feedback/get-feedback";
import { FeedbackRow } from "./feedback-row";

type FeedbackTableProps = {
  searchParams: {
    page: number;
    search: string;
  };
};

export const FeedbackTable = async ({ searchParams }: FeedbackTableProps) => {
  const pageSize = 10;
  const currentPage = searchParams.page;

  const result = await getFeedbackList({
    page: currentPage,
    pageSize,
    search: searchParams.search || undefined,
  });

  const { feedback, totalPages } = result;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => (
            <FeedbackRow key={item.id} feedback={item} />
          ))}
        </TableBody>
      </Table>

      <AutomaticPagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParam={searchParams.search}
        paramName="page"
      />
    </>
  );
};
