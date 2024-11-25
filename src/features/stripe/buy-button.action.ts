"use server";

import { ActionError, action } from "@/lib/actions/safe-actions";
import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { z } from "zod";
import { createSearchParamsMessageUrl } from "../searchparams-message/createSearchParamsMessageUrl";

const BuyButtonSchema = z.object({
  priceId: z.string(),
  orgSlug: z.string(),
});

export const buyButtonAction = action
  .schema(BuyButtonSchema)
  .action(async ({ parsedInput: { priceId, orgSlug } }) => {
    const user = await auth();

    if (!user) {
      throw new ActionError("You must be authenticated to buy a plan");
    }

    const org = await prisma.organization.findFirst({
      where: {
        slug: orgSlug,
        members: {
          some: {
            userId: user.id,
            roles: {
              hasSome: ["OWNER"],
            },
          },
        },
      },
    });

    const stripeCustomerId = org?.stripeCustomerId ?? undefined;

    if (!stripeCustomerId) {
      throw new ActionError(
        "You must be part of an organization to buy a plan",
      );
    }

    const price = await stripe.prices.retrieve(priceId);

    const priceType = price.type;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: priceType === "one_time" ? "payment" : "subscription",
      payment_method_types: ["card", "link"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: createSearchParamsMessageUrl(
        `${getServerUrl()}/orgs/${orgSlug}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
        {
          type: "success",
          message: "Your payment has been successful",
        },
      ),
      cancel_url: createSearchParamsMessageUrl(
        `${getServerUrl()}/orgs/${orgSlug}/settings/billing`,
        {
          type: "error",
          message: "Your payment has been cancelled",
        },
      ),
    });

    if (!session.url) {
      throw new ActionError("Something went wrong while creating the session.");
    }

    return { url: session.url };
  });
