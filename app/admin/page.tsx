import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";

export default async function AdminPage() {
  await getRequiredAdmin();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Admin Dashboard</LayoutTitle>
        <LayoutDescription>Manage users and organizations</LayoutDescription>
      </LayoutHeader>

      <LayoutContent></LayoutContent>
    </Layout>
  );
}
