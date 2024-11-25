"use client";

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
import { SubmitButton } from "@/features/form/submit-button";
import { toast } from "sonner";
import { editPasswordAction } from "./edit-profile.action";
import type { EditPasswordFormType } from "./edit-profile.schema";
import { EditPasswordFormSchema } from "./edit-profile.schema";

export const EditPasswordForm = () => {
  const form = useZodForm({
    schema: EditPasswordFormSchema,
  });

  const onSubmit = async (values: EditPasswordFormType) => {
    const result = await editPasswordAction(values);
    if (result?.serverError) {
      toast.error(result.serverError);
      return;
    }
    toast.success("Password updated");
  };

  return (
    <Form
      form={form}
      onSubmit={async (v) => onSubmit(v)}
      className="flex flex-col gap-4"
    >
      <FormField
        control={form.control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm new Password</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <SubmitButton className="w-fit self-end">Save</SubmitButton>
    </Form>
  );
};
