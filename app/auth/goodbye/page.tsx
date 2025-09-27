import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SiteConfig } from "@/site-config";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Account Deleted | ${SiteConfig.title}`,
  description:
    "Your account has been successfully deleted. Thank you for using our service.",
};

export default function GoodbyePage() {
  return (
    <Card className="mx-auto w-full max-w-md lg:max-w-lg lg:p-6">
      <CardHeader>
        <div className="flex justify-center">
          <Avatar className="size-16">
            <AvatarFallback>
              <CheckCircle />
            </AvatarFallback>
          </Avatar>
        </div>
        <CardHeader className="text-center">Account Deleted</CardHeader>

        <CardDescription className="text-center">
          Your account has been successfully deleted. We're sorry to see you go.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t pt-6">
        <div className="w-full space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            Your account and all associated data have been permanently removed
            from our system.
          </p>
          <p className="text-muted-foreground text-sm">
            If you change your mind, you're welcome to create a new account
            anytime.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signup">Create New Account</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
