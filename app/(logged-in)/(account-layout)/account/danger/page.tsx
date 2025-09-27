"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Building2, UserX2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteProfilePage() {
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.deleteUser({
          callbackURL: "/goodbye",
        }),
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-destructive size-5" />
          <CardTitle className="text-xl font-semibold">
            Delete Account
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-base">
          This action will permanently delete your account and all associated
          data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <UserX2 className="text-muted-foreground mt-0.5 size-5" />
            <div className="space-y-1">
              <p className="leading-none font-medium">Personal Data</p>
              <p className="text-muted-foreground text-sm">
                All your personal information and settings will be permanently
                erased
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <Building2 className="text-muted-foreground mt-0.5 size-5" />
            <div className="space-y-1">
              <p className="leading-none font-medium">Organization Data</p>
              <p className="text-muted-foreground text-sm">
                If you&apos;re an organization owner, all organization data will
                be deleted and subscriptions cancelled
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <LoadingButton
          variant="destructive"
          size="lg"
          loading={deleteAccountMutation.isPending}
          onClick={() => {
            dialogManager.confirm({
              title: "Delete your account ?",
              description: "Are you sure you want to delete your profile?",
              confirmText: "Delete",
              action: {
                label: "Delete",
                onClick: async () => {
                  await deleteAccountMutation.mutateAsync();
                  toast.success("Your deletion has been asked.", {
                    description:
                      "Please check your email for further instructions.",
                  });
                },
              },
            });
          }}
        >
          Delete
        </LoadingButton>
      </CardFooter>
    </Card>
  );
}
