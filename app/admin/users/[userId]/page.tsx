import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserActions } from "./_components/user-actions";
import { UserProviders } from "./_components/user-providers";
import { UserSessions } from "./_components/user-sessions";
import { UserDetailsCard } from "../../_components/user-details-card";

export default async function RoutePage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  await getRequiredAdmin();

  const userData = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      members: {
        include: {
          organization: {
            include: {
              subscription: true,
            },
          },
        },
      },
      accounts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!userData) {
    notFound();
  }

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>User Details</LayoutTitle>
        <LayoutDescription>
          View and manage user information and organization memberships
        </LayoutDescription>
      </LayoutHeader>
      <LayoutActions>
        <UserActions user={userData} />
      </LayoutActions>

      <LayoutContent className="flex flex-col gap-4">
        <UserDetailsCard user={userData} />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>
                  Organizations this user belongs to
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {userData.members.length === 0 ? (
              <div className="text-muted-foreground py-4 text-center">
                No organizations found
              </div>
            ) : (
              <div className="space-y-3">
                {userData.members.map((memberRole) => (
                  <div
                    key={memberRole.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={memberRole.organization.logo ?? undefined}
                          alt={memberRole.organization.name}
                        />
                        <AvatarFallback className="text-sm">
                          {memberRole.organization.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/admin/organizations/${memberRole.organization.id}`}
                        className="flex-1"
                      >
                        <div className="space-y-1 transition-opacity hover:opacity-80">
                          <div className="font-medium">
                            {memberRole.organization.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {memberRole.organization.email}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Role: {memberRole.role}
                          </div>
                          {memberRole.organization.subscription && (
                            <div className="mt-1">
                              <Badge
                                variant={
                                  memberRole.organization.subscription
                                    .status === "active"
                                    ? "default"
                                    : memberRole.organization.subscription
                                          .status === "canceled"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {memberRole.organization.subscription.plan}
                                {memberRole.organization.subscription.status &&
                                  ` (${memberRole.organization.subscription.status})`}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/admin/organizations/${memberRole.organization.id}`}
                      >
                        <ExternalLink className="size-4" />
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <UserSessions userId={userData.id} />
        <UserProviders accounts={userData.accounts} />
      </LayoutContent>
    </Layout>
  );
}
