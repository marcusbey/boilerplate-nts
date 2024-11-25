"use client";

import { LogoSvg } from "@/components/svg/logo-svg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { SignInProviders } from "../../../auth/signin/sign-in-providers";

export function SignInDialog() {
  const router = useRouter();
  const path = usePathname();

  return (
    <Dialog
      open={path.startsWith("/auth/signin")}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-card">
        <DialogHeader className="flex flex-col items-center justify-center gap-2">
          <LogoSvg />
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription className="sr-only">
            Please sign in to your account to continue.
          </DialogDescription>
        </DialogHeader>
        <SignInProviders />
      </DialogContent>
    </Dialog>
  );
}
