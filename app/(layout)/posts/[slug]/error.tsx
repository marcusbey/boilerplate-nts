"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, LayoutHeader, LayoutTitle } from "@/features/page/layout";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Error with post.</LayoutTitle>
      </LayoutHeader>
      <Card>
        <CardHeader>
          <CardTitle>
            Sorry, the post you are looking for doesn't work as expected. Please
            try again later.
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button onClick={reset}>Try again</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
}
