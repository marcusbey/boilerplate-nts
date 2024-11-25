"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import { UserDropdown } from "./user-dropdown";

const useHref = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return "";
  }

  const href = window.location.href;

  return `${href}`;
};

export const SignInButton = (props: VariantProps<typeof buttonVariants>) => {
  const href = useHref();

  return (
    <Link
      className={buttonVariants({ size: "sm", variant: "outline", ...props })}
      href={`/auth/signin?callbackUrl=${href}`}
    >
      Sign in
    </Link>
  );
};

export const LoggedInButton = ({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) => {
  return (
    <UserDropdown>
      <button className="group size-9 rounded-full">
        <Avatar className="mr-2 size-full group-active:scale-95">
          <AvatarFallback className="bg-card">
            {user.email?.slice(0, 1).toUpperCase() ?? "U"}
          </AvatarFallback>
          {user.image && <AvatarImage src={user.image} />}
        </Avatar>
      </button>
    </UserDropdown>
  );
};
