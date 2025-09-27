import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
export const maxDuration = 300;

// Utility function to get plan from subscription metadata
const getPlanFromSubscription = (subscription: Stripe.Subscription) => {
  const planName = subscription.metadata.plan;
  if (!planName) return null;

  return AUTH_PLANS.find((p) => p.name === planName);
};

export const POST = async (req: NextRequest) => {
  const headerList = await headers();
  const body = await req.text();

  const stripeSignature = headerList.get("stripe-signature");

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature ?? "",
      env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err: unknown) {
    logger.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid Stripe webhook signature", details: err },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await checkoutSessionCompleted(event.data.object, req);
        break;
      case "customer.subscription.updated":
        await customerSubscriptionUpdated(event.data.object, req);
        break;
      case "customer.subscription.deleted":
        await customerSubscriptionDeleted(event.data.object, req);
        break;
      default:
        logger.error(`Unhandled event type: ${event.type}`);
        break;
    }
  } catch (error) {
    logger.error(`Error handling webhook event ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed", eventType: event.type },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
};

const checkoutSessionCompleted = async (
  sessionData: Stripe.Checkout.Session,
  req: NextRequest,
) => {
  const session = sessionData;

  if (!session.customer || !session.subscription) {
    logger.warn("Missing customer or subscription in checkout session");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer.id;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;

  // Find organization by Stripe customer ID
  const organization = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!organization) {
    logger.error(`Organization not found for customer ID: ${customerId}`);
    return;
  }

  // Get the subscription from Stripe to get the price details
  const stripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;

  if (!priceId) {
    logger.error(`No price ID found for subscription: ${subscriptionId}`);
    return;
  }

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(stripeSubscription);
  if (!plan) {
    logger.error(`Plan not found in subscription metadata: ${subscriptionId}`);
    return;
  }

  // Create or update subscription
  const existingSubscription = await prisma.subscription.findFirst({
    where: { referenceId: organization.id },
  });

  let dbSubscription;
  if (existingSubscription) {
    dbSubscription = await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        plan: plan.name,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: stripeSubscription.status,
        periodStart: new Date(
          stripeSubscription.items.data[0].current_period_start * 1000,
        ),
        periodEnd: new Date(
          stripeSubscription.items.data[0].current_period_end * 1000,
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        seats: stripeSubscription.items.data[0]?.quantity ?? 1,
      },
    });
  } else {
    dbSubscription = await prisma.subscription.create({
      data: {
        id: `sub_${Date.now()}`,
        plan: plan.name,
        referenceId: organization.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        status: stripeSubscription.status,
        periodStart: new Date(
          stripeSubscription.items.data[0].current_period_start * 1000,
        ),
        periodEnd: new Date(
          stripeSubscription.items.data[0].current_period_end * 1000,
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        seats: stripeSubscription.items.data[0]?.quantity ?? 1,
      },
    });
  }

  // Call onTrialStart if this is a trial subscription
  if (
    stripeSubscription.status === "trialing" &&
    plan.freeTrial?.onTrialStart
  ) {
    await plan.freeTrial.onTrialStart(dbSubscription, {
      req,
      organizationId: organization.id,
      stripeCustomerId: customerId,
      subscriptionId: subscriptionId,
    });
  }

  logger.info(
    `Subscription created/updated for organization: ${organization.id}, plan: ${plan.name}`,
  );
};

const customerSubscriptionUpdated = async (
  subscriptionData: Stripe.Subscription,
  req: NextRequest,
) => {
  const subscription = subscriptionData;

  logger.info("Processing customer.subscription.updated:", subscription.id);

  // Find the subscription in our database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(subscription);
  const planName = plan?.name ?? dbSubscription.plan; // Keep current plan as fallback

  // Update subscription details
  const updatedSubscription = await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan: planName,
      status: subscription.status,
      periodStart: new Date(
        subscription.items.data[0].current_period_start * 1000,
      ),
      periodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      seats: subscription.items.data[0]?.quantity ?? dbSubscription.seats ?? 1,
    },
  });

  // Handle trial transitions
  if (plan?.freeTrial) {
    // Trial ended and became active
    if (
      subscription.status === "active" &&
      dbSubscription.status === "trialing" &&
      plan.freeTrial.onTrialEnd
    ) {
      await plan.freeTrial.onTrialEnd(
        { subscription: updatedSubscription },
        {
          req,
          organizationId: updatedSubscription.referenceId,
          stripeCustomerId: subscription.customer as string,
          subscriptionId: subscription.id,
        },
      );
    }

    // Trial expired
    if (
      subscription.status === "incomplete_expired" &&
      dbSubscription.status === "trialing" &&
      plan.freeTrial.onTrialExpired
    ) {
      await plan.freeTrial.onTrialExpired(updatedSubscription, {
        req,
        organizationId: updatedSubscription.referenceId,
        stripeCustomerId: subscription.customer as string,
        subscriptionId: subscription.id,
      });
    }
  }

  logger.info(
    `Subscription updated: ${subscription.id}, status: ${subscription.status}, plan: ${planName}`,
  );
};

const customerSubscriptionDeleted = async (
  subscriptionData: Stripe.Subscription,
  req: NextRequest,
) => {
  const subscription = subscriptionData;

  logger.info("Processing customer.subscription.deleted:", subscription.id);

  // Find and update the subscription status
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!dbSubscription) {
    logger.error(`Subscription not found in database: ${subscription.id}`);
    return;
  }

  // Get plan from subscription metadata
  const plan = getPlanFromSubscription(subscription);

  // Update subscription to canceled/free plan
  const updatedSubscription = await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      plan: "free",
      status: "canceled",
      cancelAtPeriodEnd: false,
      periodEnd: new Date(), // Set to current time since it's canceled
    },
  });

  // Call onSubscriptionCanceled if available
  if (plan?.onSubscriptionCanceled) {
    await plan.onSubscriptionCanceled(updatedSubscription, {
      req,
      organizationId: updatedSubscription.referenceId,
      stripeCustomerId: subscription.customer as string,
      subscriptionId: subscription.id,
    });
  }

  logger.info(
    `Subscription canceled and reverted to free plan: ${subscription.id}`,
  );
};
