"use client";

import { logger } from "@/lib/logger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarMenuButtonProps } from "./sidebar";
import { SidebarMenuButton } from "./sidebar";

export const SidebarMenuButtonLink = ({
  href,
  children,
  ...props
}: SidebarMenuButtonProps & { href: string }) => {
  const pathname = usePathname();
  logger.debug({ pathname, href });
  return (
    <SidebarMenuButton {...props} asChild isActive={pathname === href}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  );
};
