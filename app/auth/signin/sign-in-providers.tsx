"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { MagicLinkForm } from "./magic-link-form";
import { ProviderButton } from "./provider-button";
import { SignInCredentialsAndMagicLinkForm } from "./sign-in-credentials-and-magic-link-form";

export const SignInProviders = () => {
  const { data: providers, isPending } = useQuery({
    queryFn: async () => fetch(`/api/auth/providers`).then(async (res) => res.json()),
    queryKey: ["providers"],
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-9" />
        <Divider>or</Divider>
        <Skeleton className="h-11" />
      </div>
    );
  }

  if (typeof providers !== "object") {
    return (
      <Alert>
        <AlertTriangle size={16} />
        <AlertTitle>
          The provider is not available. It's due to a misconfiguration in the
          <Typography variant="code">auth.ts</Typography> file.
        </AlertTitle>
        <AlertDescription>
          Please go to{" "}
          <Typography variant="link" as={Link} href="">
            the Now.TS documentation
          </Typography>{" "}
          to resolve the issue.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {providers.resend && !providers.credentials ? (
        <div className="flex flex-col gap-2 lg:gap-4">
          <Typography variant="small">Magic link ✨</Typography>
          <MagicLinkForm />
          <Divider>or</Divider>
        </div>
      ) : null}

      {providers.credentials ? (
        <>
          <SignInCredentialsAndMagicLinkForm />
          <Divider>or</Divider>
        </>
      ) : null}

      <div className="flex flex-col gap-2 lg:gap-4">
        {/* ℹ️ Add provider you want to support here */}
        {providers.github ? <ProviderButton providerId="github" /> : null}
        {providers.google ? <ProviderButton providerId="google" /> : null}
      </div>

      {providers.credentials ? (
        <Typography variant="small">
          You don't have an account?{" "}
          <Typography variant="link" as={Link} href="/auth/signup">
            Sign up
          </Typography>
        </Typography>
      ) : null}
    </div>
  );
};
