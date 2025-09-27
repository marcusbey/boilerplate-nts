"use client";

import { Loader } from "@/components/nowts/loader";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

export const UserDropdownLogout = () => {
  const logout = useMutation({
    mutationFn: async () => signOut(),
    onSuccess: () => {
      window.location.href = "/auth/signin";
    },
  });

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        logout.mutate();
      }}
    >
      {logout.isPending ? (
        <Loader className="mr-2 size-4" />
      ) : (
        <LogOut className="mr-2 size-4" />
      )}
      <span>Logout</span>
    </DropdownMenuItem>
  );
};
