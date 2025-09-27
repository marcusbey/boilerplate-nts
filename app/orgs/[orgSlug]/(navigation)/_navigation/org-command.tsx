"use client";

import {
  CmdOrOption,
  KeyboardShortcut,
} from "@/components/nowts/keyboard-shortcut";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getOrganizationNavigation } from "./org-navigation.links";
import { useHotkeys } from "react-hotkeys-hook";

export function OrgCommand(props: {
  roles: AuthRole[] | undefined;
  orgSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const orgSlug = typeof params.orgSlug === "string" ? params.orgSlug : "";

  const down = () => {
    setOpen((open) => !open);
  };

  useHotkeys("mod+k", down);

  const links = getOrganizationNavigation(props.orgSlug, props.roles);

  return (
    <>
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          type="search"
          placeholder="Search..."
          className="bg-background w-full appearance-none pl-8 shadow-none"
          onClick={() => {
            setOpen(true);
          }}
        />

        <div className="pointer-events-none absolute top-2.5 right-2.5 inline-flex h-5 items-center gap-1 select-none">
          <KeyboardShortcut eventKey="cmd">
            <CmdOrOption />
          </KeyboardShortcut>
          <KeyboardShortcut eventKey="k">K</KeyboardShortcut>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {links.map((link, index) => (
            <CommandGroup heading={link.title} key={index}>
              {link.links.map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => {
                    router.push(
                      link.href.replace(":organizationSlug", orgSlug),
                    );
                  }}
                >
                  <link.Icon className="mr-2 size-4" />
                  <span>{link.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
