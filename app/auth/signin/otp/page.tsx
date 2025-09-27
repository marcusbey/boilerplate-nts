import { Suspense } from "react";
import { SignInOtpPage } from "./sign-in-otp-page";

export default function OtpVerificationPage() {
  return (
    <Suspense>
      <SignInOtpPage />
    </Suspense>
  );
}
