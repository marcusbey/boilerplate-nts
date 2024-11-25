"use client";

import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, useZodForm } from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { Progress } from "@/components/ui/progress";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { alertDialog } from "@/features/alert-dialog/alert-dialog-store";
import { FormUnsavedBar } from "@/features/form/form-unsaved-bar";
import { openGlobalDialog } from "@/features/global-dialog/global-dialog.store";
import { OrganizationMembershipRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrganizationMemberAction } from "../org.action";
import type { OrgMemberFormSchemaType } from "../org.schema";
import { OrgMemberFormSchema } from "../org.schema";
import { OrganizationInviteMemberForm } from "./org-invite-member-form";

type OrgMembersFormProps = {
  defaultValues: OrgMemberFormSchemaType;
  members: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  }[];
  invitedEmail: string[];
  maxMembers: number;
};

export const OrgMembersForm = ({
  defaultValues,
  members,
  invitedEmail,
  maxMembers,
}: OrgMembersFormProps) => {
  const form = useZodForm({
    schema: OrgMemberFormSchema,
    defaultValues,
  });
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: OrgMemberFormSchemaType) => {
      const result = await updateOrganizationMemberAction(values);

      if (!result || result.serverError) {
        toast.error(result?.serverError ?? "Failed to invite user");
        return;
      }

      router.refresh();
      form.reset(result.data as OrgMemberFormSchemaType);
    },
  });

  return (
    <FormUnsavedBar
      form={form}
      onSubmit={async (v) => mutation.mutateAsync(v)}
      className="flex w-full flex-col gap-6 lg:gap-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            People who have access to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {form.getValues("members").map((baseMember, index) => {
            const member = members.find((m) => m.id === baseMember.id);
            if (!member) {
              return null;
            }
            return (
              <div key={member.id}>
                <div className="my-2 flex flex-wrap items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{member.email.slice(0, 2)}</AvatarFallback>
                    {member.image ? <AvatarImage src={member.image} /> : null}
                  </Avatar>
                  <div>
                    <Typography variant="large">{member.name}</Typography>
                    <Typography variant="muted">{member.email}</Typography>
                  </div>
                  <div className="flex-1"></div>
                  {baseMember.roles.includes("OWNER") ? (
                    <InlineTooltip title="You can't change the role of an owner">
                      <Button type="button" variant="outline">
                        OWNER
                      </Button>
                    </InlineTooltip>
                  ) : (
                    <FormField
                      control={form.control}
                      name={`members.${index}.roles`}
                      render={({ field }) => (
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          loop
                          className="w-fit"
                        >
                          <MultiSelectorTrigger className="w-[200px] lg:w-[250px]">
                            <MultiSelectorInput
                              className="w-[50px]"
                              placeholder="roles"
                            />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {Object.keys(OrganizationMembershipRole).map(
                                (role) => {
                                  if (role === "OWNER") return null;
                                  return (
                                    <MultiSelectorItem key={role} value={role}>
                                      {role}
                                    </MultiSelectorItem>
                                  );
                                },
                              )}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      )}
                    />
                  )}

                  <Button
                    type="button"
                    disabled={baseMember.roles.includes("OWNER")}
                    variant="outline"
                    onClick={() => {
                      const newMembers = [...form.getValues("members")].filter(
                        (m) => m.id !== member.id,
                      );

                      form.setValue("members", newMembers, {
                        shouldDirty: true,
                      });
                    }}
                  >
                    <X size={16} />
                    <span className="sr-only">Remove member</span>
                  </Button>
                </div>
              </div>
            );
          })}
          {invitedEmail.length > 0 && (
            <div className="my-4 flex flex-col gap-4">
              <Typography variant="h3">Pending invitations</Typography>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {invitedEmail.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}
          {form.watch("members").length < maxMembers ? (
            <OrganizationInviteMemberForm />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const dialogId = alertDialog.add({
                  title: "Oh no ! You've reached the maximum number of members",
                  description: (
                    <>
                      <Typography>
                        You can't add more members to your organization. Please
                        upgrade your plan to add more members.
                      </Typography>
                      <Alert className="flex flex-col gap-2">
                        <Progress
                          value={
                            (form.getValues("members").length / maxMembers) *
                            100
                          }
                        />
                        <Typography variant="small">
                          You have {form.getValues("members").length} members
                          out of {maxMembers} members
                        </Typography>
                      </Alert>
                    </>
                  ),
                  action: (
                    <Button
                      onClick={() => {
                        openGlobalDialog("org-plan");
                        alertDialog.remove(dialogId);
                      }}
                    >
                      <Zap className="mr-2" size={16} />
                      Upgrade your plan
                    </Button>
                  ),
                });
              }}
            >
              <Zap className="mr-2" size={16} />
              Invite member
            </Button>
          )}
        </CardContent>
      </Card>
    </FormUnsavedBar>
  );
};
