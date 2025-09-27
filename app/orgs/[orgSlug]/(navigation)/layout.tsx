import { OrgNavigation } from "./_navigation/org-navigation";

export default async function RouteLayout(
  props: LayoutProps<"/orgs/[orgSlug]">,
) {
  return <OrgNavigation>{props.children}</OrgNavigation>;
}
