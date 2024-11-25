import { ActionError } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const deleteOrganizationQuery = async (id: string) => {
  const org = await prisma.organization.findUnique({
    where: {
      id: id,
    },
  });

  if (!org) {
    throw new ActionError("Invalid organization");
  }

  if (!org.stripeCustomerId) {
    throw new ActionError("Invalid subscription");
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: org.stripeCustomerId,
  });

  for await (const subscription of subscriptions.data) {
    await stripe.subscriptions.cancel(subscription.id);
  }

  await prisma.organization.delete({
    where: {
      id: id,
    },
  });
};
