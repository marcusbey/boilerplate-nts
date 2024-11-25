import type { PageParams } from "@/types/next";
import { SignInDialog } from "./sign-in-dialog";

export default async function RoutePage(props: PageParams) {
  return <SignInDialog />;
}
