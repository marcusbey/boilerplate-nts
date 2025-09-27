"use server";

import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const updateSubscriptionPlanSchema = z.object({
  organizationId: z.string(),
  planName: z.string(),
  isYearly: z.boolean().optional(),
});

const cancelSubscriptionSchema = z.object({
  organizationId: z.string(),
});

const reactivateSubscriptionSchema = z.object({
  organizationId: z.string(),
});

export async function updateSubscriptionPlanAction(
  data: z.infer<typeof updateSubscriptionPlanSchema>,
) {
  await getRequiredAdmin();

  const { organizationId, planName, isYearly } =
    updateSubscriptionPlanSchema.parse(data);

  const plan = AUTH_PLANS.find((p) => p.name === planName);
  if (!plan) {
    throw new Error("Invalid plan");
  }

  const subscription = await prisma.subscription.findFirst({
    where: { referenceId: organizationId },
  });

  if (!subscription) {
    if (planName === "free") {
      return;
    }
    throw new Error("No subscription found");
  }

  if (planName === "free") {
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: "free",
        status: "canceled",
        stripeSubscriptionId: null,
      },
    });
    return;
  }

  const priceId =
    isYearly && plan.annualDiscountPriceId
      ? plan.annualDiscountPriceId
      : plan.priceId;

  if (!priceId) {
    throw new Error(
      "Plan does not have a price ID for the selected billing frequency",
    );
  }

  if (!subscription.stripeSubscriptionId) {
    throw new Error("No Stripe subscription found");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId,
  );

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    items: [
      {
        id: stripeSubscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: "always_invoice",
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      plan: planName,
    },
  });
}

export async function cancelSubscriptionAction(
  data: z.infer<typeof cancelSubscriptionSchema>,
) {
  await getRequiredAdmin();

  const { organizationId } = cancelSubscriptionSchema.parse(data);

  const subscription = await prisma.subscription.findFirst({
    where: { referenceId: organizationId },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: true,
    },
  });
}

export async function reactivateSubscriptionAction(
  data: z.infer<typeof reactivateSubscriptionSchema>,
) {
  await getRequiredAdmin();

  const { organizationId } = reactivateSubscriptionSchema.parse(data);

  const subscription = await prisma.subscription.findFirst({
    where: { referenceId: organizationId },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No subscription found");
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: false,
    },
  });
}

export async function createSubscriptionAction(
  data: z.infer<typeof updateSubscriptionPlanSchema>,
) {
  await getRequiredAdmin();

  const { organizationId, planName, isYearly } =
    updateSubscriptionPlanSchema.parse(data);

  const plan = AUTH_PLANS.find((p) => p.name === planName);
  if (!plan || planName === "free") {
    throw new Error("Invalid plan for subscription creation");
  }

  const priceId =
    isYearly && plan.annualDiscountPriceId
      ? plan.annualDiscountPriceId
      : plan.priceId;

  if (!priceId) {
    throw new Error(
      "Plan does not have a price ID for the selected billing frequency",
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  if (organization.subscription) {
    throw new Error("Organization already has a subscription");
  }

  let stripeCustomerId = organization.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: organization.email ?? undefined,
      name: organization.name,
      metadata: {
        organizationId: organization.id,
      },
    });

    stripeCustomerId = customer.id;

    await prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId },
    });
  }

  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: priceId }],
    trial_period_days: plan.freeTrial?.days,
    metadata: {
      organizationId: organization.id,
    },
  });

  await prisma.subscription.create({
    data: {
      id: crypto.randomUUID(),
      plan: planName,
      referenceId: organizationId,
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      periodStart: new Date(
        stripeSubscription.items.data[0].current_period_start * 1000,
      ),
      periodEnd: new Date(
        stripeSubscription.items.data[0].current_period_end * 1000,
      ),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  });
}
