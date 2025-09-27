"use client";

import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InlineTooltip } from "@/components/ui/tooltip";
import { LoadingButton } from "@/features/form/submit-button";
import { ImageFormItem } from "@/features/images/image-form-item";
import { authClient } from "@/lib/auth-client";
import { displayName } from "@/lib/format/display-name";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import type { User } from "better-auth";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ProfileFormType } from "./edit-profile.schema";
import { ProfileFormSchema } from "./edit-profile.schema";

type EditProfileFormProps = {
  defaultValues: User;
};

export const EditProfileCardForm = ({
  defaultValues,
}: EditProfileFormProps) => {
  const form = useZodForm({
    schema: ProfileFormSchema,
    defaultValues: defaultValues,
  });
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormType) => {
      return unwrapSafePromise(
        authClient.updateUser({
          name: values.name ?? "",
          image: values.image,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Profile updated");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.sendVerificationEmail({
          email: defaultValues.email,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Verification email sent");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <Form
        form={form}
        onSubmit={async (v) => updateProfileMutation.mutateAsync(v)}
        disabled={updateProfileMutation.isPending}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageFormItem
                className="size-16 rounded-full"
                onChange={(url) => form.setValue("image", url)}
                imageUrl={form.watch("image")}
              />

              <CardTitle>
                {displayName({
                  email: defaultValues.email,
                  name: form.watch("name"),
                })}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-4">
                <span>Email</span>
                {defaultValues.emailVerified ? (
                  <InlineTooltip title="Email verified. If you change your email, you will need to verify it again.">
                    <BadgeCheck size={16} />
                  </InlineTooltip>
                ) : (
                  <LoadingButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    data-testid="verify-email-button"
                    onClick={() => verifyEmailMutation.mutate()}
                    loading={verifyEmailMutation.isPending}
                  >
                    Verify email
                  </LoadingButton>
                )}
              </Label>
              <Typography>{defaultValues.email}</Typography>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link
              className={buttonVariants({ size: "sm", variant: "link" })}
              href="/account/change-email"
            >
              Change email
            </Link>
            <Link
              className={buttonVariants({ size: "sm", variant: "link" })}
              href="/account/change-password"
            >
              Change password
            </Link>
            <div className="flex-1"></div>
            <LoadingButton loading={updateProfileMutation.isPending}>
              Save
            </LoadingButton>
          </CardFooter>
        </Card>
      </Form>
    </>
  );
};
