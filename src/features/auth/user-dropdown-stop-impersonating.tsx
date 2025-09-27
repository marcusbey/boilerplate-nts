"use client";

import { Loader } from "@/components/nowts/loader";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const UserDropdownStopImpersonating = () => {
  const router = useRouter();

  const stopImpersonating = useMutation({
    mutationFn: async () => {
      return authClient.admin.stopImpersonating();
    },
    onSuccess: () => {
      router.push("/admin");
    },
  });

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        stopImpersonating.mutate();
      }}
    >
      {stopImpersonating.isPending ? (
        <Loader className="mr-2 size-4" />
      ) : (
        <LogOut className="mr-2 size-4" />
      )}
      Stop Impersonating
    </DropdownMenuItem>
  );
};
