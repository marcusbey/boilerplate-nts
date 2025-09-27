"use client";

import { Loader } from "@/components/nowts/loader";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { AuthProvider } from "../signin/last-used-provider.store";
import { useLastUsedProviderStore } from "../signin/last-used-provider.store";

export default function LastUsedProviderPage() {
  return (
    <div>
      <Card>
        <Loader />
      </Card>
      <Suspense>
        <LastUsedProvider />
      </Suspense>
    </div>
  );
}

const LastUsedProvider = () => {
  const { lastUsedProvider, setLastUsedProvider } = useLastUsedProviderStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("provider")) {
      setLastUsedProvider(searchParams.get("provider") as AuthProvider);
    }
    router.push(searchParams.get("callbackUrl") ?? "/account");
  }, [router, searchParams, setLastUsedProvider]);

  return <div>{lastUsedProvider}</div>;
};
