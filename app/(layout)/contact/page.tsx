import GridBackground from "@/components/nowts/grid-background";
import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSupportAction } from "@/features/contact/support/contact-support.action";
import { ContactSupportSchema } from "@/features/contact/support/contact-support.schema";
import { env } from "@/lib/env";
import { serverToast } from "@/lib/server-toast";
import { SiteConfig } from "@/site-config";
import { Building2, Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact ${SiteConfig.title}`,
  description:
    "Get in touch with the NOW.TS team. We're here to help with any questions about testimonial collection, platform features, or technical support.",
  keywords: ["contact", "support", "help", "testimonials", "questions"],
  openGraph: {
    title: `Contact ${SiteConfig.title}`,
    description:
      "Get in touch with the NOW.TS team. We're here to help with any questions about testimonial collection, platform features, or technical support.",
    url: `${SiteConfig.prodUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-background relative isolate min-h-screen">
      <GridBackground
        size={20}
        color="color-mix(in srgb, var(--border) 30%, transparent)"
      />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="bg-muted/10 relative flex items-center justify-end px-6 py-24 backdrop-blur-sm sm:py-32 lg:px-12">
          <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0 lg:max-w-lg">
            <Typography
              variant="h1"
              className="text-foreground text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
              Get in touch
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground mt-6 text-lg/8"
            >
              Have questions about NOW.TS? Need help with testimonial collection
              or want to share feedback? I'm here to help and always excited to
              hear from our community.
            </Typography>
            <dl className="text-muted-foreground mt-10 flex flex-col gap-4 text-base/7">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Location</span>
                  <Building2
                    aria-hidden="true"
                    className="text-muted-foreground h-6 w-6"
                  />
                </dt>
                <dd>{SiteConfig.company.address}</dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <Mail
                    aria-hidden="true"
                    className="text-muted-foreground h-6 w-6"
                  />
                </dt>
                <dd>
                  <a
                    href="mailto:melvyn@nowts.com"
                    className="hover:text-foreground transition-colors"
                  >
                    {env.NEXT_PUBLIC_EMAIL_CONTACT}
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Response time</span>
                  <MessageSquare
                    aria-hidden="true"
                    className="text-muted-foreground h-6 w-6"
                  />
                </dt>
                <dd>
                  Usually respond within 24 hours
                  <br />
                  Monday - Friday, 9 AM - 6 PM ICT
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <form
          action={async (formData) => {
            "use server";

            const firstname = formData.get("first-name");
            const lastname = formData.get("last-name");
            const email = formData.get("email");
            const subject = formData.get("subject");
            const message = formData.get("message");

            const result = ContactSupportSchema.safeParse({
              firstname,
              lastname,
              email,
              subject,
              message,
            });

            if (!result.success) {
              await serverToast("Invalid input", "error");
              return;
            }

            await contactSupportAction(result.data);

            await serverToast("Your message has been sent", "success");
          }}
          className="flex w-full items-center justify-start px-6 pt-24 pb-24 sm:pt-32 lg:px-12 lg:pt-24"
        >
          <div className="max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="first-name"
                  className="text-foreground block text-sm font-semibold"
                >
                  First name
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="first-name"
                    name="first-name"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="last-name"
                  className="text-foreground block text-sm font-semibold"
                >
                  Last name
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="last-name"
                    name="last-name"
                    type="text"
                    autoComplete="family-name"
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="email"
                  className="text-foreground block text-sm font-semibold"
                >
                  Email
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="subject"
                  className="text-foreground block text-sm font-semibold"
                >
                  Subject
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label
                  htmlFor="message"
                  className="text-foreground block text-sm font-semibold"
                >
                  Message
                </Label>
                <div className="mt-2.5">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                className="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold"
              >
                Send message
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
