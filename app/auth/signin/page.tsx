import { Typography } from "@/components/nowts/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SocialProviders } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInProviders } from "./sign-in-providers";

export const metadata: Metadata = {
  title: `Sign In | ${SiteConfig.title}`,
  description:
    "Sign in to your account to access testimonials and manage your projects.",
};

export default async function AuthSignInPage() {
  const user = await getUser();

  if (user) {
    redirect("/account");
  }

  const providers = Object.keys(SocialProviders ?? {});

  return (
    <Card className="mx-auto h-auto w-full max-w-md lg:max-w-lg lg:p-6">
      <CardHeader className="flex flex-col items-center justify-center gap-2">
        <div className="mx-auto mt-4 flex flex-row items-center gap-2">
          <Avatar className="size-8 rounded-md">
            <AvatarImage src={SiteConfig.appIcon} alt="app logo" />
            <AvatarFallback>
              {SiteConfig.title.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Typography variant="large">{SiteConfig.title}</Typography>
        </div>

        <CardDescription className="text-center">
          Please sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <SignInProviders providers={providers} />
      </CardContent>
    </Card>
  );
}
