/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { OrganizationWithStats } from "../_actions/admin-organizations";

type OrganizationRowProps = {
  organization: OrganizationWithStats;
};

export const OrganizationRow = ({ organization }: OrganizationRowProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage
              src={organization.logo || undefined}
              alt={organization.name || ""}
            />
            <AvatarFallback className="text-sm">
              {getInitials(organization.name || "O")}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/admin/organizations/${organization.id}`}
            className="flex-1"
          >
            <div className="space-y-1 transition-opacity hover:opacity-80">
              <div className="font-medium">{organization.name}</div>
              <div className="text-muted-foreground text-sm">
                {organization.email}
              </div>
            </div>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground text-sm">{organization.slug}</div>
      </TableCell>
      <TableCell>
        <div className="text-muted-foreground text-sm">
          {new Date(organization.createdAt).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/organizations/${organization.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
