"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { ActionError } from "@/lib/errors/action-error";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

export const upgradeOrgAction = orgAction
  .metadata({
    permissions: {
      subscription: ["manage"],
    },
  })
  .inputSchema(
    z.object({
      plan: z.string(),
      annual: z.boolean().default(false),
      successUrl: z.string(),
      cancelUrl: z.string(),
    }),
  )
  .action(
    async ({
      parsedInput: { plan, annual, successUrl, cancelUrl },
      ctx: { org },
    }) => {
      // Find the plan
      const authPlan = AUTH_PLANS.find((p) => p.name === plan);
      if (!authPlan) {
        throw new ActionError(`Plan "${plan}" not found`);
      }

      // Get the price ID based on annual or monthly
      const priceId = annual
        ? authPlan.annualDiscountPriceId
        : authPlan.priceId;
      if (!priceId) {
        throw new ActionError(`Price ID not found for plan "${plan}"`);
      }

      // Get or create Stripe customer
      const customerId = org.stripeCustomerId;

      if (!customerId) {
        throw new ActionError("No Stripe customer ID found");
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${getServerUrl()}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getServerUrl()}${cancelUrl}`,
        metadata: {
          organizationId: org.id,
          plan: plan,
        },
        subscription_data: {
          metadata: {
            organizationId: org.id,
            plan: plan,
          },
          trial_period_days: authPlan.freeTrial?.days,
        },
      });

      if (!session.url) {
        throw new ActionError("Failed to create checkout session");
      }

      return {
        url: session.url,
      };
    },
  );
