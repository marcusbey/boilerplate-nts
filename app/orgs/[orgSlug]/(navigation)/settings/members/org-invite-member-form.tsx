"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { RolesKeys } from "@/lib/auth/auth-permissions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  role: z.string().default("member"),
});

type SchemaType = z.infer<typeof Schema>;

export const OrganizationInviteMemberForm = () => {
  const [open, setOpen] = useState(false);
  const { data: activeOrg } = authClient.useActiveOrganization();

  const form = useZodForm({
    schema: Schema,
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: SchemaType) => {
      const result = await authClient.organization.inviteMember({
        email: values.email,
        role: values.role as AuthRole,
      });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Invitation sent");
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button type="button">Invite</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="p-6">
          <div className="mt-4 flex justify-center">
            <Avatar className="size-16">
              {activeOrg?.logo ? (
                <AvatarImage src={activeOrg.logo} alt={activeOrg.name} />
              ) : null}
              <AvatarFallback>
                {activeOrg?.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogTitle className="text-center">Invite Teammates</DialogTitle>

          <DialogDescription className="text-center">
            Invite members to collaborate in your organization
          </DialogDescription>
        </DialogHeader>

        <div className="border-t p-6">
          <Form
            form={form}
            onSubmit={async (v) => mutation.mutateAsync(v)}
            className="flex flex-col gap-8"
          >
            <div className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="colleague@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RolesKeys.filter((role) => role !== "owner").map(
                          (role) => (
                            <SelectItem key={role} value={role.toLowerCase()}>
                              {role.charAt(0).toUpperCase() +
                                role.slice(1).toLowerCase()}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <LoadingButton
              loading={mutation.isPending}
              type="submit"
              className="w-full"
            >
              Send invite
            </LoadingButton>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
