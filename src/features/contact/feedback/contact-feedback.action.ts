"use server";

import { action } from "@/lib/actions/safe-actions";
import { getUser } from "@/lib/auth/auth-user";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/mail/send-email";
import { prisma } from "@/lib/prisma";
import { ContactFeedbackSchema } from "./contact-feedback.schema";

export const feedbackAction = action
  .inputSchema(ContactFeedbackSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await getUser();

    const email = user?.email ?? data.email;

    const feedback = await prisma.feedback.create({
      data: {
        message: data.message,
        review: Number(data.review) || 0,
        userId: user?.id,
        email,
      },
    });

    await sendEmail({
      to: env.NEXT_PUBLIC_EMAIL_CONTACT,
      subject: `New feedback from ${email}`,
      text: `Review: ${feedback.review}\n\nMessage: ${feedback.message}`,
      replyTo: email,
    });

    return { message: "Your feedback has been sent to support." };
  });
