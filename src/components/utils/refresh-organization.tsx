"use client";

import { useEffect } from "react";

// Make a full refresh
export const RefreshPageOrganization = () => {
  useEffect(() => {
    window.location.reload();
  }, []);

  return null;
};
