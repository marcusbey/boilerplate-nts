import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitButton } from "@/features/form/submit-button";
import { requiredAuth } from "@/lib/auth/helper";
import { combineWithParentMetadata } from "@/lib/metadata";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import {
  orgConfirmDeletionAction,
  verifyDeleteAccountToken,
} from "../delete-account.action";

export const generateMetadata = combineWithParentMetadata({
  title: "Confirm deletion",
  description: "One last step to delete your account.",
});

export default async function RoutePage(props: PageParams) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;
  const user = await requiredAuth();

  const invalidTokenCard = (
    <Card>
      <CardHeader>
        <CardTitle>Invalid token</CardTitle>
      </CardHeader>
      <CardFooter>
        <Link
          href="/account/danger"
          className={buttonVariants({ variant: "outline" })}
        >
          Retry
        </Link>
      </CardFooter>
    </Card>
  );

  try {
    if (typeof token !== "string") {
      return invalidTokenCard;
    }

    await verifyDeleteAccountToken(String(token), user.email);
  } catch {
    return invalidTokenCard;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Are you sure you want to delete your account ?</CardTitle>
        <CardDescription>
          By clicking on the button below, you confirm that you want to delete
          your account.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Link
          href="/organizations"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
        <form>
          <SubmitButton
            formAction={async () => {
              "use server";

              await orgConfirmDeletionAction({
                token: String(token),
              });
            }}
          >
            Delete account
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}
