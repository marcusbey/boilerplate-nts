"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQueryStates } from "nuqs";
import { adminSearchParams } from "../_actions/search-params";

export const AdminFilters = () => {
  const [filters, setFilters] = useQueryStates(adminSearchParams, {
    shallow: false,
    throttleMs: 1000,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search users by email..."
          value={filters.search}
          onChange={(e) => {
            void setFilters({
              search: e.target.value,
              page: 1, // Reset page when searching
            });
          }}
          className="pl-10"
        />
      </div>
    </div>
  );
};
