import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { ForgetPasswordPage } from "./forget-password-page";

export const metadata: Metadata = {
  title: `Forget Password | ${SiteConfig.title}`,
  description: "Reset your password by entering your email address.",
};

export default function ForgetPassword() {
  return <ForgetPasswordPage />;
}
