import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { auth } from "../auth";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};

export const getUser = async () => {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  return user;
};

export const getRequiredUser = async () => {
  const user = await getUser();

  if (!user) {
    unauthorized();
  }

  return user;
};

export const getRequiredAdmin = async () => {
  const user = await getRequiredUser();

  if (user.role !== "admin") {
    unauthorized();
  }

  return user;
};
