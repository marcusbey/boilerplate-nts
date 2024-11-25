import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useCurrentOrg } from "../../use-current-org";

export const UpgradeCard = () => {
  const org = useCurrentOrg();

  if (!org) return null;

  if (org.plan.id !== "FREE") return null;

  return (
    <Card x-chunk="dashboard-02-chunk-0">
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade to PRO</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our app.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Link
          href={`/orgs/${org.slug}/settings/billing`}
          className={buttonVariants({ className: "w-full" })}
        >
          Upgrade
        </Link>
      </CardContent>
    </Card>
  );
};
