"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ConfirmDeletePage({
  token,
  callbackUrl = "/auth/goodbye",
}: {
  token?: string;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDeleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Invalid token");
      }
      return unwrapSafePromise(
        authClient.deleteUser({
          token,
        }),
      );
    },
    onError: (error) => {
      setError(error.message);
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push(callbackUrl);
    },
  });

  const handleConfirmDelete = () => {
    setIsLoading(true);
    confirmDeleteMutation.mutate();
  };

  const handleCancel = () => {
    router.push("/account");
  };

  if (!token) {
    router.push("/account");
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center">
          <Avatar className="size-16">
            <AvatarFallback>
              <Trash2 />
            </AvatarFallback>
          </Avatar>
        </div>
        <CardHeader className="text-center">
          Confirm Account Deletion
        </CardHeader>

        <CardDescription className="text-center">
          Are you sure you want to delete your account? This action is permanent
          and cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t pt-6">
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="flex w-full gap-4">
          <LoadingButton
            loading={isLoading || confirmDeleteMutation.isPending}
            variant="destructive"
            onClick={handleConfirmDelete}
            className="flex-1"
          >
            Yes, Delete My Account
          </LoadingButton>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
