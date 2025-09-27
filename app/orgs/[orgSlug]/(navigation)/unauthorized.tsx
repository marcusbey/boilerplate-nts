import { Error401 } from "@/features/page/error-401";
import { Layout } from "@/features/page/layout";

export default async function RoutePage() {
  return (
    <Layout size="lg">
      <Error401 />
    </Layout>
  );
}
