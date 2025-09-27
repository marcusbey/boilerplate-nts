"use client";

import { BaseNavigation } from "@/features/navigation/base-navigation";
import { Error400 } from "@/features/page/error-400";
import { Layout } from "@/features/page/layout";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { useEffect } from "react";

export default function RouteError({ error }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <BaseNavigation>
      <Layout size="lg">
        <Error400 />
      </Layout>
    </BaseNavigation>
  );
}
