import { AdminNavigation } from "./_navigation/admin-navigation";

export default async function AdminLayout(props: LayoutProps<"/admin">) {
  return <AdminNavigation>{props.children}</AdminNavigation>;
}
