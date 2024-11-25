"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { alertDialog } from "@/features/alert-dialog/alert-dialog-store";
import { FormUnsavedBar } from "@/features/form/form-unsaved-bar";
import { isActionSuccessful } from "@/lib/actions/actions-utils";
import { formatId } from "@/lib/format/id";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrganizationDetailsAction } from "../org.action";
import type { OrgDangerFormSchemaType } from "../org.schema";
import { OrgDangerFormSchema } from "../org.schema";

type ProductFormProps = {
  defaultValues: OrgDangerFormSchemaType;
};

export const OrganizationDangerForm = ({ defaultValues }: ProductFormProps) => {
  const form = useZodForm({
    schema: OrgDangerFormSchema,
    defaultValues,
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: OrgDangerFormSchemaType) => {
      const result = await updateOrganizationDetailsAction(values);

      if (!isActionSuccessful(result)) {
        toast.error(result?.serverError ?? "Failed to invite user");
        return;
      }

      const newUrl = window.location.href.replace(
        `/orgs/${defaultValues.slug}/`,
        `/orgs/${result.data.slug}/`,
      );
      router.push(newUrl);
      form.reset(result.data as OrgDangerFormSchemaType);
    },
  });

  return (
    <FormUnsavedBar
      form={form}
      onSubmit={(v) => {
        alertDialog.add({
          title: "Are you sure ?",
          description:
            "You are about to change the unique identifier of your organization. All the previous URLs will be changed.",
          action: {
            label: "Yes, change the slug",
            onClick: () => {
              mutation.mutate(v);
            },
          },
        });
      }}
      className="flex w-full flex-col gap-6 lg:gap-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Slug</CardTitle>
          <CardDescription>
            Slug is the unique identifier of your organization. It's used in all
            the URLs, if you change it, all your URLs will be broken.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    onChange={(e) => {
                      const slug = formatId(e.target.value);
                      field.onChange(slug);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </FormUnsavedBar>
  );
};
