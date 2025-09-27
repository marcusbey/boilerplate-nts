import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredCurrentOrgCache } from "@/lib/react/cache";
import { CancelSubscriptionForm } from "./cancel-form";

export default async function CancelSubscriptionPage() {
  const org = await getRequiredCurrentOrgCache();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Cancel Subscription</LayoutTitle>
        <LayoutDescription>
          We're sorry to see you go. Please let us know why you're cancelling so
          we can improve our service.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <CancelSubscriptionForm orgId={org.id} orgSlug={org.slug} />
      </LayoutContent>
    </Layout>
  );
}
