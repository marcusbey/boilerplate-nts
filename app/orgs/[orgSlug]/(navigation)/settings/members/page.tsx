import { combineWithParentMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import type { PageParams } from "@/types/next";
import { OrgMembersForm } from "./org-members-form";

export const generateMetadata = combineWithParentMetadata({
  title: "Members",
  description: "Manage your organization members.",
});

export default async function RoutePage(props: PageParams) {
  const { org } = await getRequiredCurrentOrgCache(["ADMIN"]);

  const members = await getOrgsMembers(org.id);

  const invitations = await prisma.verificationToken.findMany({
    where: {
      identifier: {
        endsWith: `-invite-${org.id}`,
      },
      expires: {
        gt: new Date(),
      },
    },
    select: {
      data: true,
    },
  });

  const invitedEmail = invitations
    .map((i) => (i.data as { email?: string }).email)
    .filter(Boolean) as string[];

  return (
    <OrgMembersForm
      defaultValues={{
        members: members.map((m) => ({
          roles: m.roles,
          id: m.id,
          userId: m.userId,
        })),
      }}
      maxMembers={org.plan.maximumMembers}
      members={members.map((m) => ({ role: m.roles, ...m.user, id: m.id }))}
      invitedEmail={invitedEmail}
    />
  );
}
