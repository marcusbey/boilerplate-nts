"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthProvider = "github" | "google";

type LastUsedProviderState = {
  lastUsedProvider: AuthProvider | null;
  setLastUsedProvider: (provider: AuthProvider) => void;
};

export const useLastUsedProviderStore = create<LastUsedProviderState>()(
  persist(
    (set) => ({
      lastUsedProvider: null,
      setLastUsedProvider: (provider: AuthProvider) =>
        set({ lastUsedProvider: provider }),
    }),
    {
      name: "last-used-provider",
    },
  ),
);
