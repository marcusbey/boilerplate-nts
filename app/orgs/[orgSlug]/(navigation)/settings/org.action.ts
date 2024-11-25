"use server";

import { ActionError, orgAction } from "@/lib/actions/safe-actions";
import { sendEmail } from "@/lib/mail/sendEmail";
import { prisma } from "@/lib/prisma";
import { getOrgsMembers } from "@/query/org/get-orgs-members";
import MarkdownEmail from "@email/markdown.email";
import OrganizationInvitationEmail from "@email/organization-invitation-email.email";
import { addHours } from "date-fns";
import { nanoid } from "nanoid";
import {} from "next/server";
import type { CreateEmailResponse } from "resend";
import { z } from "zod";
import {
  OrgDangerFormSchema,
  OrgDetailsFormSchema,
  OrgMemberFormSchema,
} from "./org.schema";

export const updateOrganizationMemberAction = orgAction
  .metadata({
    roles: ["OWNER"],
  })
  .schema(OrgMemberFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const members = input.members.filter((member) => member.id !== ctx.user.id);

    const currentMembers = await prisma.organizationMembership.findMany({
      where: {
        organizationId: ctx.org.id,
      },
      select: {
        id: true,
        roles: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    const membersToDelete = currentMembers.filter(
      (member) =>
        !members.some((m) => m.id === member.id) &&
        !member.roles.includes("OWNER"),
    );

    await prisma.organizationMembership.deleteMany({
      where: {
        organizationId: ctx.org.id,
        id: {
          in: membersToDelete.map((m) => m.id),
        },
      },
    });

    const promises: Promise<CreateEmailResponse>[] = [];

    for await (const member of membersToDelete) {
      promises.push(
        sendEmail({
          to: member.user.email,
          subject: `[${ctx.org.name}] You've been removed from the organization`,
          react: MarkdownEmail({
            preview: `You've been removed from the organization ${ctx.org.name}.`,
            markdown: `Hi,

You've been removed from the organization ${ctx.org.name}.

If you think it's a mistake, please contact organization's owner : ${ctx.org.email}

Best,
          `,
          }),
        }),
      );
    }

    const memberToUpdate = members.filter((member) => {
      const currentMember = currentMembers.find((m) => m.id === member.id);
      return currentMember && !currentMember.roles.includes("OWNER");
    });

    const updatedMembers = memberToUpdate.map(async (member) => {
      return prisma.organizationMembership.update({
        where: {
          organizationId: ctx.org.id,
          id: member.id,
        },
        data: {
          roles: member.roles,
        },
      });
    });
    await Promise.all(updatedMembers);

    return { members: await getOrgsMembers(ctx.org.id) };
  });

export const updateOrganizationDetailsAction = orgAction
  .schema(z.union([OrgDetailsFormSchema, OrgDangerFormSchema]))
  .metadata({
    roles: ["OWNER"],
  })
  .action(async ({ parsedInput, ctx }) => {
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: ctx.org.id,
      },
      data: parsedInput,
    });

    return updatedOrganization;
  });

export const inviteUserInOrganizationAction = orgAction
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .schema(
    z.object({
      email: z.string().email(),
    }),
  )
  .action(async ({ parsedInput: { email }, ctx }) => {
    if (
      await prisma.verificationToken.findFirst({
        where: {
          identifier: `${email}-invite-${ctx.org.id}`,
          expires: {
            gt: new Date(),
          },
        },
      })
    ) {
      throw new ActionError("User already invited");
    }

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: `${email}-invite-${ctx.org.id}`,
        expires: addHours(new Date(), 1),
        token: nanoid(32),
        data: {
          orgId: ctx.org.id,
          email,
        },
      },
    });

    await sendEmail({
      to: email,
      subject: `Invitation to join ${ctx.org.name}`,
      react: OrganizationInvitationEmail({
        token: verificationToken.token,
        orgSlug: ctx.org.slug,
        organizationName: ctx.org.name,
      }),
    });

    return { identifier: verificationToken.identifier };
  });
