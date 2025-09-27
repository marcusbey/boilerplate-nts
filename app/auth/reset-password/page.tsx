import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { ResetPasswordPage } from "./reset-password-page";

export const metadata: Metadata = {
  title: `Reset Password | ${SiteConfig.title}`,
  description:
    "Enter your new password to complete the password reset process.",
};

export default async function RoutePage(
  props: PageProps<"/auth/reset-password">,
) {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string;

  return <ResetPasswordPage token={token} />;
}
