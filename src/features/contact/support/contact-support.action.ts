"use server";

import { action } from "@/lib/actions/safe-actions";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/mail/sendEmail";
import { ContactSupportSchema } from "./contact-support.schema";

export const contactSupportAction = action
  .schema(ContactSupportSchema)
  .action(async ({ parsedInput: { email, subject, message } }) => {
    await sendEmail({
      to: env.NEXT_PUBLIC_EMAIL_CONTACT,
      subject: `Support needed from ${email} - ${subject}`,
      text: message,
      replyTo: email,
    });
    return { message: "Your message has been sent to support." };
  });
