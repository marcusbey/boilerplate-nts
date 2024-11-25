"use client";

import { isActionSuccessful } from "@/lib/actions/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ButtonProps } from "../../components/ui/button";
import { LoadingButton } from "../form/submit-button";
import { buyButtonAction } from "./buy-button.action";

type BuyButtonProps = {
  priceId: string;
  orgSlug: string;
} & ButtonProps;

/**
 * This is a button that will create a Stripe checkout session and redirect the user to the checkout page
 * To test the integration, you can use the component like this :
 *
 * ```tsx
 * <BuyButton priceId={env.NODE_ENV === "production" ? "real-price-id" : "dev-price-id"}>Buy now !</BuyButton>
 * ```
 *
 * @param props Button props and Stripe Price Id
 * @param props.priceId This is the Stripe price ID to use for the checkout session
 * @returns
 */
export const BuyButton = ({ priceId, orgSlug, ...props }: BuyButtonProps) => {
  const router = useRouter();
  const session = useSession();

  const mutation = useMutation({
    mutationFn: async () => {
      if (session.status !== "authenticated") {
        router.push("/auth/signin");
        toast.error("You must be authenticated to buy a plan");
        return;
      }

      const result = await buyButtonAction({
        priceId: priceId,
        orgSlug: orgSlug,
      });

      if (!isActionSuccessful(result)) {
        toast.error(result?.serverError ?? "Something went wrong");
        return;
      }

      router.push(result.data.url);
    },
  });

  return (
    <LoadingButton
      onClick={() => mutation.mutate()}
      {...props}
      loading={mutation.isPending}
      disabled={session.status === "loading"}
    />
  );
};
