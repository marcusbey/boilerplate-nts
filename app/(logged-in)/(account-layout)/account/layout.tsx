import { SubmitButton } from "@/features/form/submit-button";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RouteLayout(props: LayoutProps<"/account">) {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Settings</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <form>
          <SubmitButton
            formAction={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/auth/signin");
            }}
          >
            Sign out
          </SubmitButton>
        </form>
      </LayoutActions>
      <LayoutContent>{props.children}</LayoutContent>
    </Layout>
  );
}
