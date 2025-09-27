import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { Building2, Home, MessageSquare, Users } from "lucide-react";

const ADMIN_PATH = `/admin`;

const ADMIN_LINKS: NavigationGroup[] = [
  {
    title: "Admin",
    links: [
      {
        href: ADMIN_PATH,
        Icon: Home,
        label: "Dashboard",
      },
      {
        href: `${ADMIN_PATH}/users`,
        Icon: Users,
        label: "Users",
      },
      {
        href: `${ADMIN_PATH}/organizations`,
        Icon: Building2,
        label: "Organizations",
      },
      {
        href: `${ADMIN_PATH}/feedback`,
        Icon: MessageSquare,
        label: "Feedback",
      },
    ],
  },
] satisfies NavigationGroup[];

export const getAdminNavigation = (): NavigationGroup[] => {
  return ADMIN_LINKS;
};
