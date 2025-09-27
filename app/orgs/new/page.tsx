import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { AccountNavigation } from "../../(logged-in)/(account-layout)/account-navigation";
import { NewOrganizationForm } from "./new-org-form";

export default async function RoutePage() {
  await getRequiredUser();

  return (
    <AccountNavigation>
      <Layout>
        <LayoutHeader>
          <LayoutTitle>Create a new organization</LayoutTitle>
        </LayoutHeader>
        <LayoutContent>
          <NewOrganizationForm />
        </LayoutContent>
      </Layout>
    </AccountNavigation>
  );
}
