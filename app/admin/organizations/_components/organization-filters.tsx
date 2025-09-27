"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function OrganizationFilters() {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, throttleMs: 500 }),
  );

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search organizations by name, slug, or email..."
          className="pl-8"
          value={search}
          onChange={(e) => void setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
