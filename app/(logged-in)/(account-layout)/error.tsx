"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@/features/auth/sign-in-button";
import { Page400 } from "@/features/page/page-400";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RouteError({ error }: ErrorParams) {
  const session = useSession();

  useEffect(() => {
    logger.error(error);
  }, [error]);

  if (session.status === "authenticated") {
    return <Page400 />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          You need to be authenticated to access this resource.
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <SignInButton variant="invert" size="lg" />
      </CardFooter>
    </Card>
  );
}
