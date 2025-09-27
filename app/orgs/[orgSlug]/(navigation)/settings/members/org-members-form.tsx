"use client";

import { Loader } from "@/components/nowts/loader";
import { Typography } from "@/components/nowts/typography";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { InlineTooltip } from "@/components/ui/tooltip";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { openGlobalDialog } from "@/features/global-dialog/global-dialog.store";
import type { Invitation } from "@/generated/prisma";
import { authClient, useSession } from "@/lib/auth-client";
import type { AuthRole } from "@/lib/auth/auth-permissions";
import { RolesKeys } from "@/lib/auth/auth-permissions";
import { unwrapSafePromise } from "@/lib/promises";
import { cn } from "@/lib/utils";
import type { OrgMembers } from "@/query/org/get-orgs-members";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useMutation } from "@tanstack/react-query";
import { Copy, MoreVertical, Trash, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import { toast } from "sonner";
import { useCurrentOrg } from "../../../use-current-org";
import { OrganizationInviteMemberForm } from "./org-invite-member-form";

type OrgMembersFormProps = {
  members: OrgMembers;
  maxMembers: number;
  invitations: Invitation[];
};

export const OrgMembersForm = ({
  maxMembers,

  members,
  invitations,
}: OrgMembersFormProps) => {
  const router = useRouter();
  const session = useSession();
  const org = useCurrentOrg();
  const [optimisticMembers, updateOptimisticMembers] = useOptimistic(
    members,
    (state, update: { type: string; memberId: string; role?: string }) => {
      if (update.type === "DELETE") {
        return state.filter((member) => member.id !== update.memberId);
      } else if (update.type === "UPDATE_ROLE" && update.role) {
        return state.map((member) =>
          member.id === update.memberId
            ? { ...member, role: update.role ?? "member" }
            : member,
        );
      }
      return state;
    },
  );

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: AuthRole;
    }) => {
      // Using BetterAuth client to update member role
      return unwrapSafePromise(
        authClient.organization.updateMemberRole({
          memberId,
          role,
        }),
      );
    },
    onMutate: ({ memberId, role }) => {
      // Optimistically update the UI
      updateOptimisticMembers({ type: "UPDATE_ROLE", memberId, role });
    },
    onSuccess: () => {
      toast.success("Member role updated successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
      router.refresh(); // Refresh to get the actual state
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!org?.id) {
        throw new Error("Organization ID is required");
      }
      // Using BetterAuth client to remove member
      await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: org.id,
      });
      return memberId;
    },
    onMutate: (memberId) => {
      // Optimistically update the UI
      updateOptimisticMembers({ type: "DELETE", memberId });
    },
    onSuccess: () => {
      toast.success("Member removed successfully");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to remove member");
      router.refresh(); // Refresh to get the actual state
    },
  });

  const removeInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      await authClient.organization.cancelInvitation({
        invitationId,
      });
    },
    onSuccess: () => {
      toast.success("Invitation removed successfully");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to remove invitation");
      router.refresh(); // Refresh to get the actual state
    },
  });

  const handleRemoveMember = (memberId: string) => {
    dialogManager.confirm({
      title: "Remove member",
      description:
        "Are you sure you want to remove this member from the organization?",
      action: {
        label: "Remove",
        onClick: async () => {
          removeMemberMutation.mutate(memberId);
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center gap-4 space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Teammates that have access to this workspace.
          </CardDescription>
        </div>
        <div className="flex-1"></div>
        <div>
          {optimisticMembers.length < maxMembers ? (
            <OrganizationInviteMemberForm />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const dialogId = dialogManager.confirm({
                  title: "Oh no! You've reached the maximum number of members",
                  description: (
                    <>
                      <Typography>
                        You can't add more members to your organization. Please
                        upgrade your plan to add more members.
                      </Typography>
                      <Alert className="flex flex-col gap-2">
                        <Progress
                          value={(optimisticMembers.length / maxMembers) * 100}
                        />
                        <Typography variant="small">
                          You have {optimisticMembers.length} members out of{" "}
                          {maxMembers} members
                        </Typography>
                      </Alert>
                    </>
                  ),
                  action: {
                    label: "Upgrade your plan",
                    onClick: () => {
                      openGlobalDialog("org-plan");
                      dialogManager.close(dialogId);
                    },
                  },
                });
              }}
            >
              <Zap className="mr-2" size={16} />
              Invite
            </Button>
          )}
        </div>
      </CardHeader>
      <Tabs defaultValue="members" className="mt-4 gap-0">
        <TabsList className="flex gap-4 px-6">
          <TabsTrigger
            value="members"
            className="text-muted-foreground hover:bg-accent/50 data-[state=active]:border-foreground translate-y-px rounded-t-md border-b px-3 py-2 text-sm transition"
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value="invitations"
            className="text-muted-foreground hover:bg-accent/50 data-[state=active]:border-foreground translate-y-px rounded-t-md border-b px-3 py-2 text-sm transition"
          >
            Invitations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-0 border-t pt-4">
          <CardContent className="flex flex-col">
            {optimisticMembers.map((member) => {
              const isCurrentUser = member.user.id === session.data?.user.id;
              return (
                <div key={member.id}>
                  <div className="my-2 flex flex-wrap items-center gap-2">
                    <Avatar>
                      <AvatarFallback>
                        {member.user.email.slice(0, 2)}
                      </AvatarFallback>
                      {member.user.image ? (
                        <AvatarImage src={member.user.image} />
                      ) : null}
                    </Avatar>
                    <div>
                      <Typography className="text-sm font-medium">
                        {member.user.name}
                      </Typography>
                      <Typography variant="muted">
                        {member.user.email}
                      </Typography>
                    </div>
                    <div className="flex-1"></div>

                    {member.role.includes("owner") ? (
                      <InlineTooltip title="You can't change the role of an owner">
                        <Typography variant="muted">Owner</Typography>
                      </InlineTooltip>
                    ) : (
                      <Select
                        disabled={isCurrentUser}
                        defaultValue={member.role}
                        onValueChange={(value) => {
                          updateRoleMutation.mutate({
                            memberId: member.id,
                            role: value as AuthRole,
                          });
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {RolesKeys.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={async () =>
                            navigator.clipboard.writeText(member.id)
                          }
                        >
                          <Copy className="mr-2 size-4" />
                          Copy member ID
                        </DropdownMenuItem>
                        {isCurrentUser ||
                        member.role.includes("owner") ? null : (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={member.role.includes("OWNER")}
                            >
                              <Trash className="mr-2 size-4" />
                              Delete member
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </TabsContent>
        <TabsContent value="invitations" className="mt-0 border-t pt-4">
          <CardContent className="flex flex-col">
            {invitations.length === 0 ? (
              <Typography variant="muted">No invitations</Typography>
            ) : (
              <>
                {invitations.map((invitation) => {
                  if (invitation.status === "accepted") {
                    return null;
                  }
                  const isExpired = new Date(invitation.expiresAt) < new Date();
                  const isCanceled =
                    invitation.status === "canceled" || isExpired;
                  return (
                    <div key={invitation.id}>
                      <div className="my-2 flex flex-wrap items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {invitation.email.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2">
                          <Typography
                            className={cn("text-sm font-medium", {
                              "text-muted-foreground line-through": isCanceled,
                            })}
                          >
                            {invitation.email}
                          </Typography>

                          {isExpired ? (
                            <Badge variant="outline">Expired</Badge>
                          ) : (
                            <Badge variant="outline">{invitation.status}</Badge>
                          )}
                        </div>
                        <div className="flex-1"></div>
                        <Typography variant="muted">
                          {invitation.role}
                        </Typography>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={async () =>
                                navigator.clipboard.writeText(invitation.id)
                              }
                            >
                              <Copy className="mr-2 size-4" />
                              Copy invitation ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.preventDefault();
                                return removeInvitationMutation.mutate(
                                  invitation.id,
                                );
                              }}
                            >
                              {removeInvitationMutation.isPaused ? (
                                <Loader className="mr-2 size-4" />
                              ) : (
                                <Trash className="mr-2 size-4" />
                              )}
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
