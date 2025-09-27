"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { fileAdapter } from "@/lib/files/placeholder-adapter";
import { z } from "zod";

export const uploadImageAction = orgAction
  .metadata({})
  .inputSchema(
    z.object({
      formData: z.instanceof(FormData),
    }),
  )
  .action(async ({ parsedInput: { formData } }) => {
    const files = formData.get("files") as File | File[];

    let file: File;

    if (Array.isArray(files)) {
      file = files[0];
    } else {
      file = files;
    }

    if (!(file instanceof File)) {
      throw new ActionError("Invalid file (not a file)");
    }

    // If file is not an image throw an error
    if (!file.type.startsWith("image/")) {
      throw new ActionError("Invalid file (only images are allowed)");
    }

    // If file is too large throw an error (max 2mb)
    if (file.size > 2 * 1024 * 1024) {
      throw new ActionError("File too large (max 2mb)");
    }

    const response = await fileAdapter.uploadFile({
      file,
      path: "images",
    });

    if (response.error) {
      throw new ActionError(response.error.message);
    }

    return response.data.url;
  });
