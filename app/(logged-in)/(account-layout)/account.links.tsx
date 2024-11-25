import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SiteConfig } from "@/site-config";
import { AlertCircle, CreditCard, Mail, User2 } from "lucide-react";

export const getAccountNavigation = (): NavigationGroup[] => {
  return ACCOUNT_LINKS;
};

const ACCOUNT_LINKS: NavigationGroup[] = [
  {
    title: "Your profile",
    links: [
      {
        href: "/account",
        Icon: User2,
        label: "Profile",
      },
      {
        href: "/account/email",
        Icon: Mail,
        label: "Mail",
      },
      {
        href: "/account/danger",
        Icon: AlertCircle,
        label: "Danger",
      },
      {
        href: "/account/billing",
        Icon: CreditCard,
        label: "Billing",
        hidden: !SiteConfig.features.enableSingleMemberOrg,
      },
    ],
  },
];
