"use client";

import { Typography } from "@/components/nowts/typography";
import { useLocalStorage } from "react-use";
import { SignInWithEmailOTP } from "./_components/sign-in-otp-form";
import { SignInPasswordForm } from "./_components/sign-in-password-form";

export const SignInCredentialsAndMagicLinkForm = (props: {
  callbackUrl?: string;
}) => {
  const [isUsingCredentials, setIsUsingCredentials] = useLocalStorage(
    "sign-in-with-credentials",
    false,
  );

  if (!isUsingCredentials) {
    return (
      <div className="max-w-lg space-y-4">
        <SignInWithEmailOTP callbackUrl={props.callbackUrl} />
        <Typography variant="muted" className="text-xs">
          Prefer password sign in?{" "}
          <Typography
            variant="link"
            as="button"
            type="button"
            onClick={() => {
              setIsUsingCredentials(true);
            }}
          >
            Use password
          </Typography>
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <SignInPasswordForm callbackUrl={props.callbackUrl} />
      <Typography variant="muted" className="text-xs">
        Want faster sign in?{" "}
        <Typography
          variant="link"
          as="button"
          type="button"
          onClick={() => {
            setIsUsingCredentials(false);
          }}
        >
          Login with OTP code
        </Typography>
      </Typography>
    </div>
  );
};
