"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentOrg } from "../../use-current-org";

export const ClientOrg = () => {
  const org = useCurrentOrg();

  if (!org) {
    return (
      <Card>
        <CardHeader>No org</CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{org.name}</CardTitle>
        <CardDescription>{org.slug}</CardDescription>
      </CardHeader>
    </Card>
  );
};
