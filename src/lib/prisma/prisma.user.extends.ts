import { SiteConfig } from "@/site-config";
import type { Prisma } from "@prisma/client";
import type {
  DefaultArgs,
  DynamicQueryExtensionCb,
  InternalArgs,
} from "@prisma/client/runtime/library";
import { env } from "process";
import { setupResendCustomer } from "../auth/auth-config-setup";
import { resend } from "../mail/resend";
import { prisma } from "../prisma";

export const onUserUpdate: DynamicQueryExtensionCb<
  Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
  "model",
  "User",
  "update"
> = async (...params) => {
  if (SiteConfig.features.enableSingleMemberOrg) {
    await syncWithOrganizations(...params);
  }
  await syncWithResendContact(...params);

  const [{ args, query }] = params;
  return query(args);
};

/**
 * When the user change email, we need to update the Resend contact.
 */
const syncWithResendContact: DynamicQueryExtensionCb<
  Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
  "model",
  "User",
  "update"
> = async ({ args }) => {
  const userId = args.where.id;

  if (!userId) {
    return;
  }

  if (!args.data.email) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      resendContactId: true,
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });

  if (!user?.resendContactId) {
    return;
  }

  if (!env.RESEND_AUDIENCE_ID) {
    return;
  }

  await resend.contacts.remove({
    audienceId: env.RESEND_AUDIENCE_ID,
    id: user.resendContactId,
  });

  const newResendContactId = await setupResendCustomer(user);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      resendContactId: newResendContactId,
    },
  });
};

/**
 * If "one-organization" model is enable, we synchronies every user settings with the organization.
 */
const syncWithOrganizations: DynamicQueryExtensionCb<
  Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
  "model",
  "User",
  "update"
> = async ({ args }) => {
  const userId = args.where.id;

  if (!userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      organizations: {
        where: {
          roles: {
            hasSome: ["OWNER"],
          },
        },
        select: {
          organization: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const firstOrg = user?.organizations[0].organization;

  if (!firstOrg?.id) {
    return;
  }

  const emailUpdate = args.data.email ? String(args.data.email) : undefined;
  const nameUpdate = args.data.name
    ? `${String(args.data.name)}'s org`
    : undefined;
  const imageUpdate = args.data.image ? String(args.data.image) : undefined;

  await prisma.organization.update({
    where: {
      id: firstOrg.id,
    },
    data: {
      email: emailUpdate,
      name: nameUpdate,
      image: imageUpdate,
    },
  });

  return;
};
