import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { auth, SocialProviders } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignInProviders } from "../../../auth/signin/sign-in-providers";

export default async function RoutePage(
  props: PageProps<"/orgs/accept-invitation/[id]">,
) {
  const params = await props.params;
  const user = await getUser();

  const invitation = await prisma.invitation.findUnique({
    where: {
      id: params.id,
    },
    include: {
      organization: {
        select: {
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  return (
    <Layout>
      <LayoutHeader className="flex flex-col items-center gap-4">
        <div className="mt-4 flex justify-center">
          <Avatar className="size-16">
            {invitation?.organization.logo ? (
              <AvatarImage
                src={invitation.organization.logo}
                alt={invitation.organization.name}
              />
            ) : null}
            <AvatarFallback>
              {invitation?.organization.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <LayoutTitle className="text-center">
          Invitation to join {invitation?.organization.name}
        </LayoutTitle>

        <LayoutDescription className="text-center">
          Invite members to collaborate in your organization
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        {user ? (
          <form className="mx-auto w-fit">
            <Button
              formAction={async () => {
                "use server";

                await auth.api.acceptInvitation({
                  body: {
                    invitationId: params.id,
                  },
                  headers: await headers(),
                });

                redirect(`/orgs/${invitation?.organization.slug}`);
              }}
            >
              Accept Invitation
            </Button>
          </form>
        ) : (
          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <CardTitle>Sign in to accept invitation</CardTitle>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <SignInProviders
                callbackUrl={`/orgs/accept-invitation/${params.id}`}
                providers={Object.keys(SocialProviders ?? {})}
              />
            </CardContent>
          </Card>
        )}
      </LayoutContent>
    </Layout>
  );
}
