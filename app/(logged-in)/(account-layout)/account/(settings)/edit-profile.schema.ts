import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email(),
  image: z.string().nullable(),
});

export const EditPasswordFormSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;
export type EditPasswordFormType = z.infer<typeof EditPasswordFormSchema>;
