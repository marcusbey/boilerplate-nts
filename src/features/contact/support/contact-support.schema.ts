import { z } from "zod";

export const ContactSupportSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
});

export type ContactSupportSchemaType = z.infer<typeof ContactSupportSchema>;
