import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getPlanLimits } from "../auth/stripe/auth-plans";
import { logger } from "../logger";

export const getOrgActiveSubscription = async (organizationId: string) => {
  // Get subscription from database
  const subscription = await prisma.subscription.findFirst({
    where: {
      referenceId: organizationId,
      OR: [
        { status: "active" },
        { status: "trialing" },
        { status: "past_due" }, // Include past_due as it's still technically active
      ],
    },
  });

  if (!subscription?.stripeSubscriptionId) {
    return null;
  }

  try {
    // Verify subscription status with Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId,
    );

    // If Stripe says it's not active, update our database
    if (
      !["active", "trialing", "past_due"].includes(stripeSubscription.status)
    ) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: stripeSubscription.status,
          // If canceled, revert to free plan
          ...(stripeSubscription.status === "canceled" && { plan: "free" }),
        },
      });
      return null;
    }

    // Return subscription with updated Stripe data
    return {
      ...subscription,
      status: stripeSubscription.status,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      limits: getPlanLimits(subscription.plan),
    };
  } catch (error) {
    logger.error("Error fetching Stripe subscription:", error);
    // If Stripe fails, return database subscription
    return {
      ...subscription,
      status: subscription.status,
      cancelAtPeriodEnd: null,
      limits: getPlanLimits(subscription.plan),
    };
  }
};
