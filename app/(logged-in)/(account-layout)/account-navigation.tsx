import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import { getUsersOrgs } from "@/query/org/get-users-orgs.query";
import { CircleAlert } from "lucide-react";
import type { PropsWithChildren } from "react";
import { AccountSidebar } from "./account-sidebar";
import { VerifyEmailButton } from "./account/verify-email/verify-email-button";

export async function AccountNavigation({
  children,
  emailVerified,
}: PropsWithChildren<{ emailVerified?: boolean | null }>) {
  const userOrganizations = await getUsersOrgs();

  return (
    <SidebarProvider>
      <AccountSidebar userOrgs={userOrganizations} />
      <SidebarInset className="border border-accent">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout>
            <SidebarTrigger className="-ml-1" />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {!emailVerified ? (
            <Layout className="my-0 h-fit">
              <Alert>
                <CircleAlert size={16} />
                <AlertTitle>
                  Email not verified. Please verify your email.
                </AlertTitle>
                <VerifyEmailButton
                  variant="invert"
                  className="ml-auto flex h-6 w-fit items-center gap-1 rounded-md px-3 text-sm"
                />
              </Alert>
            </Layout>
          ) : null}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
