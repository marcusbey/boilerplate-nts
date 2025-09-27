"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { hasPermission } from "@/lib/auth/auth-org";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

export const openStripePortalAction = orgAction
  .metadata({
    permissions: {
      subscription: ["manage"],
    },
  })
  .action(async ({ ctx: { org } }) => {
    const stripeCustomerId = org.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new ActionError("No stripe customer id found");
    }

    if (!(await hasPermission({ subscription: ["manage"] }))) {
      throw new ActionError(
        "You do not have permission to manage subscriptions",
      );
    }

    const stripeBilling = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getServerUrl()}/orgs/${org.slug}/settings/billing`,
    });

    if (!stripeBilling.url) {
      throw new ActionError("Failed to create stripe billing portal session");
    }

    return {
      url: stripeBilling.url,
    };
  });

export const cancelOrgSubscriptionAction = orgAction
  .metadata({
    permissions: {
      subscription: ["manage"],
    },
  })
  .schema(
    z.object({
      returnUrl: z.string(),
    }),
  )
  .action(async ({ parsedInput: { returnUrl }, ctx: { org } }) => {
    if (!(await hasPermission({ subscription: ["manage"] }))) {
      throw new ActionError(
        "You do not have permission to manage subscriptions",
      );
    }

    const stripeCustomerId = org.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new ActionError("No stripe customer id found");
    }

    // Get the current subscription
    const subscription = await prisma.subscription.findFirst({
      where: { referenceId: org.id },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new ActionError("No active subscription found");
    }

    // Create billing portal session which allows the user to cancel
    const stripeBilling = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getServerUrl()}${returnUrl}`,
    });

    if (!stripeBilling.url) {
      throw new ActionError("Failed to create stripe billing portal session");
    }

    return {
      url: stripeBilling.url,
    };
  });
