"use server";

import { action } from "@/lib/actions/safe-actions";
import { logger } from "@/lib/logger";
import { EmailActionSchema } from "./email.schema";

export const addEmailAction = action
  .inputSchema(EmailActionSchema)
  .action(async ({ parsedInput: { email } }) => {
    logger.info("Add email", { email });
    // Add the user in your mailing tools

    return {
      ok: true,
    };
  });
