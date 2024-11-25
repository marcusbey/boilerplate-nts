import type { Prisma } from "@prisma/client";
import type {
  DefaultArgs,
  DynamicQueryExtensionCb,
  InternalArgs,
} from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import { stripe } from "../stripe";

export const onOrganizationUpdate: DynamicQueryExtensionCb<
  Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
  "model",
  "Organization",
  "update"
> = async (...params) => {
  await syncOrganizationEmailWithStripe(...params);

  const [{ args, query }] = params;

  return query(args);
};

/**
 * When the organization change email, we need to update the Stripe customer email
 */
const syncOrganizationEmailWithStripe: DynamicQueryExtensionCb<
  Prisma.TypeMap<InternalArgs & DefaultArgs, Prisma.PrismaClientOptions>,
  "model",
  "Organization",
  "update"
> = async ({ args }) => {
  const email = args.data.email;
  const orgId = args.where.id;

  if (!email || typeof email !== "string") {
    return;
  }

  if (!orgId) {
    return;
  }

  const org = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!org?.stripeCustomerId) {
    return;
  }

  await stripe.customers.update(org.stripeCustomerId, {
    email: email,
  });
};
