"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { logger } from "@/lib/logger";
import { resend } from "@/lib/mail/resend";
import { prisma } from "@/lib/prisma";
import { env } from "process";
import { z } from "zod";

const ToggleSubscribedActionSchema = z.object({
  unsubscribed: z.boolean(),
});

export const toggleSubscribedAction = authAction
  .inputSchema(ToggleSubscribedActionSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    logger.debug("Toggle subscribed", { input, ctx });

    if (!env.RESEND_AUDIENCE_ID) {
      throw new ActionError("RESEND_AUDIENCE_ID is not set");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        resendContactId: true,
      },
    });

    if (!user?.resendContactId) {
      throw new ActionError("User has no resend contact id");
    }

    const updateContact = await resend.contacts.update({
      audienceId: env.RESEND_AUDIENCE_ID,
      id: user.resendContactId,
      unsubscribed: input.unsubscribed,
    });

    return {
      success: true,
      updateContact,
    };
  });
