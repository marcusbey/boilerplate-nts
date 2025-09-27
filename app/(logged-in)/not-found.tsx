import { BaseNavigation } from "@/features/navigation/base-navigation";
import { Page404 } from "@/features/page/page-404";

export default function NotFoundPage() {
  return (
    <BaseNavigation>
      <Page404 />
    </BaseNavigation>
  );
}
