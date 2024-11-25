import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * This function take a Stripe customer object and find the user in the database
 *
 * - If the user is found, it returns the user
 * - If the user is not found, it creates a new user and returns it
 *
 * @param stripeCustomer The customer object from Stripe
 * @returns a valid user from the database
 */
export const findOrganizationFromCustomer = async (
  stripeCustomer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) => {
  let stripeCustomerId: string;

  if (typeof stripeCustomer === "string") {
    stripeCustomerId = stripeCustomer;
  } else if (stripeCustomer) {
    stripeCustomerId = stripeCustomer.id;
  } else {
    throw new Error("Invalid customer");
  }

  try {
    const organization = await prisma.organization.findFirstOrThrow({
      where: {
        stripeCustomerId,
      },
    });
    return organization;
  } catch {
    // ignore
  }

  logger.warn("Invalid customer", { stripeCustomerId });
  logger.warn(
    "You must ask the user to create an account and an organization before using the app.",
  );
  throw new Error("Invalid customer");
};
