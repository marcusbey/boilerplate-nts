import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrganizationMembers } from "./_components/organization-members";
import { OrganizationPayments } from "./_components/organization-payments";
import { OrganizationSubscription } from "./_components/organization-subscription";

export default async function OrganizationDetailPage(
  props: PageProps<"/admin/organizations/[orgId]">,
) {
  await getRequiredAdmin();
  const params = await props.params;

  const organization = await prisma.organization.findUnique({
    where: {
      id: params.orgId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      subscription: true,
    },
  });

  if (!organization) {
    notFound();
  }

  return (
    <Layout size="lg">
      <LayoutHeader>
        <div className="flex items-center gap-2">
          <Link href="/admin/organizations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <LayoutTitle>{organization.name}</LayoutTitle>
        </div>
        <LayoutDescription>
          Manage {organization.name}'s members, payments, and subscription
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>
        {organization.stripeCustomerId && (
          <Button variant="outline" asChild>
            <a
              href={`https://dashboard.stripe.com/customers/${organization.stripeCustomerId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Stripe Customer
            </a>
          </Button>
        )}
      </LayoutActions>

      <LayoutContent>
        <div className="space-y-6">
          <OrganizationMembers members={organization.members} />
          <OrganizationPayments organizationId={organization.id} />
          <OrganizationSubscription
            organization={organization}
            subscription={organization.subscription}
          />
        </div>
      </LayoutContent>
    </Layout>
  );
}
