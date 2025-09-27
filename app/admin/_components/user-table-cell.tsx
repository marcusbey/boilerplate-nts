import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type User = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: Date | boolean | null;
  banned?: boolean | null;
};

type UserTableCellProps = {
  user: User | null;
  fallbackEmail?: string | null;
  href: string;
  size?: "sm" | "md";
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const UserTableCell = ({
  user,
  fallbackEmail,
  href,
  size = "md",
}: UserTableCellProps) => {
  const displayName = user?.name ?? "Anonymous";
  const displayEmail = user?.email ?? fallbackEmail ?? "No email";
  const avatarSize = size === "sm" ? "size-8" : "size-10";

  return (
    <div className="flex items-center gap-3">
      <Avatar className={avatarSize}>
        <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? ""} />
        <AvatarFallback className="text-sm">
          {user?.name
            ? getInitials(user.name)
            : ((user?.email ?? fallbackEmail)?.[0]?.toUpperCase() ?? "U")}
        </AvatarFallback>
      </Avatar>
      <Link href={href} className="flex-1">
        <div className="space-y-1 transition-opacity hover:opacity-80">
          <div className="font-medium">{displayName}</div>
          <div className="text-muted-foreground text-sm">{displayEmail}</div>
          {user && (
            <div className="mt-1 flex items-center gap-1">
              {!user.emailVerified && (
                <Badge variant="outline" className="text-xs">
                  Unverified
                </Badge>
              )}
              {user.banned && (
                <Badge variant="destructive" className="text-xs">
                  Banned
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
