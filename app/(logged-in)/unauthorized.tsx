import { BaseNavigation } from "@/features/navigation/base-navigation";
import { Error401 } from "@/features/page/error-401";
import { Layout } from "@/features/page/layout";

export default async function RoutePage() {
  return (
    <BaseNavigation>
      <Layout>
        <Error401 />
      </Layout>
    </BaseNavigation>
  );
}
