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

  if (org.subscription) return null;

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle>Upgrade to PRO</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our app.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
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
