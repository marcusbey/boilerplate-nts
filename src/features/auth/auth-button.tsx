import { getUser } from "@/lib/auth/auth-user";
import { LoggedInButton, SignInButton } from "./sign-in-button";

export const AuthButton = async () => {
  const user = await getUser();

  if (user) {
    return <LoggedInButton user={user} />;
  }

  return <SignInButton />;
};
