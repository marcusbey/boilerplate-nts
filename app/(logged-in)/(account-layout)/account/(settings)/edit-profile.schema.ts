import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().nullable(),
  image: z.string().nullable(),
});

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;
