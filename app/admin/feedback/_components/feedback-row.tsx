import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { InlineTooltip } from "@/components/ui/tooltip";
import type { FeedbackWithUser } from "@/query/feedback/get-feedback";
import {
  Angry,
  Eye,
  Frown,
  Meh,
  MoreHorizontal,
  SmilePlus,
} from "lucide-react";
import Link from "next/link";
import { UserTableCell } from "../../_components/user-table-cell";

const ReviewIcons = [
  {
    value: 1,
    icon: Angry,
    tooltip: "Extremely Dissatisfied",
  },
  {
    value: 2,
    icon: Frown,
    tooltip: "Somewhat Dissatisfied",
  },
  {
    value: 3,
    icon: Meh,
    tooltip: "Neutral",
  },
  {
    value: 4,
    icon: SmilePlus,
    tooltip: "Satisfied",
  },
];

type FeedbackRowProps = {
  feedback: FeedbackWithUser;
};

export const FeedbackRow = ({ feedback }: FeedbackRowProps) => {
  const reviewIcon = ReviewIcons.find((icon) => icon.value === feedback.review);

  const truncatedMessage =
    feedback.message.length > 200
      ? `${feedback.message.slice(0, 200)}...`
      : feedback.message;

  return (
    <TableRow key={feedback.id}>
      <TableCell>
        <UserTableCell
          user={feedback.user}
          fallbackEmail={feedback.email}
          href={`/admin/feedback/${feedback.id}`}
          size="sm"
        />
      </TableCell>
      <TableCell>
        {reviewIcon ? (
          <InlineTooltip title={reviewIcon.tooltip}>
            <div className="flex items-center">
              <reviewIcon.icon size={24} className="text-primary" />
            </div>
          </InlineTooltip>
        ) : (
          <Typography variant="muted">No rating</Typography>
        )}
      </TableCell>
      <TableCell>
        <div className="max-w-md">
          <Typography
            variant="muted"
            className="truncate"
            title={feedback.message}
          >
            {truncatedMessage}
          </Typography>
        </div>
      </TableCell>
      <TableCell>
        <Typography variant="muted">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/feedback/${feedback.id}`}>
                <Eye className="mr-2 size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
