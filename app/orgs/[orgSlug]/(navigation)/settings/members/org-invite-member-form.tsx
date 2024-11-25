"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { LoadingButton } from "@/features/form/submit-button";
import { useMutation } from "@tanstack/react-query";
import { Mail, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { inviteUserInOrganizationAction } from "../org.action";

const Schema = z.object({
  email: z.string().email(),
});

type SchemaType = z.infer<typeof Schema>;

export const OrganizationInviteMemberForm = () => {
  const [open, setOpen] = useState(false);
  const form = useZodForm({
    schema: Schema,
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: SchemaType) => {
      const result = await inviteUserInOrganizationAction(values);

      if (!result || result.serverError) {
        toast.error(result?.serverError ?? "Failed to invite user");
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
        <Button type="button" variant="outline">
          <Mail className="mr-2" size={16} />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={async (v) => mutation.mutateAsync(v)}
          className="flex w-full items-end gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="demo@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={mutation.isPending} type="submit">
            <Plus size={16} className="mr-2" />
            Invite
          </LoadingButton>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
