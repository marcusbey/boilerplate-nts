"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { z } from "zod";

export const uploadImageAction = authAction
  .schema(
    z.object({
      formData: z.instanceof(FormData),
    }),
  )
  .action(async ({ parsedInput: props }) => {
    // const formData = input.formData;
    // const file = formData.get("file");
    // TODO : Implement your file upload logic here

    return { url: "https://example.com/image.png" };
  });
