"use client";

import { SignInProviders } from "../../../auth/signin/sign-in-providers";

export const SignInModal = (props: { providers: string[] }) => {
  return <SignInProviders providers={props.providers} />;
};
