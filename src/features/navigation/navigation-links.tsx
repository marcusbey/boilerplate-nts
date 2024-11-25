"use client";

import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationGroup, NavigationLink } from "./navigation.type";

const useCurrentPath = (links: NavigationLink[]) => {
  const currentPath = usePathname().split("/").filter(Boolean);

  const linkMatchCounts = links.map((link) => {
    return {
      url: link.href,
      matchCount: link.href
        .split("/")
        .filter(Boolean)
        .filter((segment, index) => segment === currentPath[index]).length,
    };
  });

  const mostMatchingLink = linkMatchCounts.reduce(
    (maxMatchLink, currentLink) =>
      currentLink.matchCount > maxMatchLink.matchCount
        ? currentLink
        : maxMatchLink,
    { url: "", matchCount: 0 },
  );

  return mostMatchingLink.url || links[0].href;
};

const MotionLink = motion.create(Link);

export const NavigationLinks = ({
  navigation,
}: {
  navigation: NavigationGroup[];
}) => {
  const links: NavigationLink[] = navigation
    .flatMap((group: NavigationGroup) => group.links)
    .filter((l) => !l.hidden);

  const currentPath = useCurrentPath(links);

  return (
    <LayoutGroup>
      <nav className="mt-4 grid items-start px-2 text-sm font-medium lg:px-4">
        {navigation.map(
          (group: NavigationGroup, groupIndex: number) =>
            group.links.length > 0 && (
              <div
                className="mb-6 flex flex-col gap-2 px-1"
                key={group.title + groupIndex}
              >
                <div className="group ml-2 flex items-center justify-between">
                  <Typography className="text-muted-foreground" variant="small">
                    {group.title}
                  </Typography>
                </div>
                {group.links.map((link: NavigationLink, index: number) => (
                  <MotionLink
                    key={index}
                    href={link.href}
                    className={cn(
                      `flex items-center transition gap-3 rounded-lg px-3 py-2 relative`,
                      "hover:bg-accent/20",
                      {
                        "text-muted-foreground hover:text-foreground":
                          currentPath !== link.href,
                      },
                    )}
                  >
                    {currentPath === link.href && (
                      <motion.div
                        layoutId={"motion-link"}
                        // @ts-expect-error - TODO : Remove this when framer-motion fully supports react 19 (https://mlv.sh/fm-r19)
                        className="absolute inset-0 rounded-lg bg-accent"
                      ></motion.div>
                    )}
                    <div className="relative flex w-full items-center gap-x-1.5 text-left">
                      <link.Icon className="size-4" />
                      {link.label}
                    </div>
                  </MotionLink>
                ))}
              </div>
            ),
        )}
      </nav>
    </LayoutGroup>
  );
};
