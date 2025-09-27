import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { route } from "@/lib/zod-route";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      orgId: z.string(),
    }),
  )
  .handler(async (req, { params }) => {
    await getRequiredAdmin();

    const organization = await prisma.organization.findUnique({
      where: { id: params.orgId },
      select: { stripeCustomerId: true },
    });

    if (!organization?.stripeCustomerId) {
      return { payments: [] };
    }

    const invoices = await stripe.invoices.list({
      customer: organization.stripeCustomerId,
      limit: 50,
    });

    const payments = invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status ?? "unknown",
      created: invoice.created,
      description: `Invoice for ${invoice.description ?? "subscription"}`,
      invoice: {
        invoice_pdf: invoice.invoice_pdf,
      },
    }));

    return { payments };
  });
