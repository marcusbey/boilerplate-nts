import { Page404 } from "@/features/page/page-404";
import { AccountNavigation } from "../(logged-in)/(account-layout)/account-navigation";

export default function NotFoundPage() {
  return (
    <AccountNavigation>
      <Page404 />
    </AccountNavigation>
  );
}
