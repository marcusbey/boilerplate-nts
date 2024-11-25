import { sendEmail } from "@/lib/mail/sendEmail";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import SubscriptionDowngradeEmail from "@email/subscription-downgrade-email.email";
import SubscriptionFailedEmail from "@email/subscription-failed-email.email";
import SuccessUpgradeEmail from "@email/success-upgrade-email.email";
import type { Organization } from "@prisma/client";
import type Stripe from "stripe";

export const upgradeUserToPlan = async (orgId: string, plan: string) => {
  await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      planId: plan,
    },
  });
};

export const downgradeUserFromPlan = async (orgId: string) => {
  await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      planId: "FREE",
    },
  });
};

export const notifyUserOfPremiumUpgrade = async (user: Organization) => {
  await sendEmail({
    to: user.email,
    subject: `Success! You've Unlocked Full Access to Our Features`,
    react: SuccessUpgradeEmail(),
  });
};

export const notifyUserOfPremiumDowngrade = async (org: Organization) => {
  await sendEmail({
    to: org.email,
    subject: `Important Update: Changes to Your Account Status`,
    react: SubscriptionDowngradeEmail({
      url: `${getServerUrl()}/${org.slug}/settings/billing`,
    }),
  });
};

export const notifyUserOfPaymentFailure = async (org: Organization) => {
  await sendEmail({
    to: org.email,
    subject: `Action Needed: Update Your Payment to Continue Enjoying Our Services`,
    react: SubscriptionFailedEmail({
      url: `${getServerUrl()}/${org.slug}/settings/billing`,
    }),
  });
};

/**
 * This method return a valid plan id from the line items.
 *
 * ! You must add a plan_id to the product metadata.
 * Please follow the documentation.
 * @param lineItems Any line items from Stripe
 * @returns A valid plan id
 */
export const getPlanFromLineItem = async (
  lineItems?:
    | Stripe.LineItem[]
    | Stripe.InvoiceLineItem[]
    | Stripe.SubscriptionItem[],
): Promise<string> => {
  if (!lineItems) {
    return "FREE";
  }

  const productId = lineItems[0].price?.product;

  if (!productId) {
    return "FREE";
  }

  const product = await stripe.products.retrieve(productId as string);

  const planId = product.metadata.plan_id;

  if (!planId) {
    throw new Error(
      "Invalid plan : you must add a plan_id to the product metadata.",
    );
  }

  const plan = await prisma.organizationPlan.findFirst({
    where: {
      id: planId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!plan) {
    throw new Error(
      `Invalid plan : you add the plan_id ${planId} to the product but this plan doesn't exist.`,
    );
  }

  return plan.id;
};
