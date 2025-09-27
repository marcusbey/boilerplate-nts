import type { User } from "better-auth";
import { env } from "../env";
import { resend } from "../mail/resend";
import { prisma } from "../prisma";

export const setupResendCustomer = async (user: User) => {
  if (!user.email) {
    return;
  }

  if (!env.RESEND_AUDIENCE_ID) {
    return;
  }

  const contact = await resend.contacts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    email: user.email,
    firstName: user.name || "",
    unsubscribed: false,
  });

  if (!contact.data) return;

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resendContactId: contact.data.id,
    },
  });

  return contact.data.id;
};
