"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  Trash2,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";

type UserSessionsProps = {
  userId: string;
};

export function UserSessions({ userId }: UserSessionsProps) {
  const queryClient = useQueryClient();

  // Fetch user sessions using useQuery
  const {
    data: sessionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-sessions", userId],
    queryFn: async () => {
      return unwrapSafePromise(
        authClient.admin.listUserSessions({
          userId,
        }),
      );
    },
  });

  const sessions = sessionsData?.sessions ?? [];

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionToken: string) => {
      return unwrapSafePromise(
        authClient.admin.revokeUserSession({
          sessionToken: sessionToken,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Session revoked successfully");
      void queryClient.invalidateQueries({
        queryKey: ["user-sessions", userId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to revoke session: ${error.message}`);
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.admin.revokeUserSessions({
          userId,
        }),
      );
    },
    onSuccess: () => {
      toast.success("All sessions revoked successfully");
      void queryClient.invalidateQueries({
        queryKey: ["user-sessions", userId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to revoke all sessions: ${error.message}`);
    },
  });

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return <Monitor className="size-4" />;

    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return <Smartphone className="size-4" />;
    }
    if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="size-4" />;
    }
    return <Monitor className="size-4" />;
  };

  const formatUserAgent = (userAgent?: string | null) => {
    if (!userAgent) return "Unknown device";

    // Extract browser and OS info
    const ua = userAgent;
    let browser = "Unknown";
    let os = "Unknown";

    // Detect browser
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    // Detect OS
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    return `${browser} on ${os}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              View and manage user sessions for debugging
            </CardDescription>
          </div>
          {sessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => revokeAllSessionsMutation.mutate()}
              disabled={revokeAllSessionsMutation.isPending}
            >
              <TrashIcon className="mr-2 size-4" />
              Revoke All Sessions
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2">Loading sessions...</span>
          </div>
        ) : error ? (
          <div className="text-destructive py-4 text-center">
            Failed to load sessions: {error.message}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center">
            No active sessions found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(session.userAgent)}
                        <div>
                          <div className="font-medium">
                            {formatUserAgent(session.userAgent)}
                          </div>
                          {session.userAgent && (
                            <div className="text-muted-foreground max-w-[200px] truncate text-xs">
                              {session.userAgent}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">
                        {session.ipAddress ?? "Unknown"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            new Date(session.expiresAt) > new Date()
                              ? "default"
                              : "destructive"
                          }
                        >
                          {new Date(session.expiresAt) > new Date()
                            ? "Active"
                            : "Expired"}
                        </Badge>
                        {(
                          session as unknown as {
                            impersonatedBy: string | null;
                          }
                        ).impersonatedBy && (
                          <Badge variant="outline">Impersonated</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(session.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(session.expiresAt).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(session.expiresAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          revokeSessionMutation.mutate(session.token)
                        }
                        disabled={revokeSessionMutation.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
