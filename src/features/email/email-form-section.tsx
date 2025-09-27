import { Typography } from "@/components/nowts/typography";
import { Card } from "@/components/ui/card";
import { SectionLayout } from "../landing/section-layout";
import { EmailForm } from "./email-form";

export const EmailFormSection = () => {
  return (
    <SectionLayout>
      <Card className="relative isolate overflow-hidden py-24 text-center shadow-2xl lg:rounded-3xl">
        <Typography
          as="h2"
          className="mx-auto max-w-3xl text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          Get notified when we're launching
        </Typography>
        <Typography className="mx-auto mt-6 max-w-lg text-center text-lg text-gray-300">
          Be the first to use Threader. Get early access, exclusive content and
          more.
        </Typography>
        <div className="mx-auto mt-10 w-full max-w-lg">
          <EmailForm
            submitButtonLabel="Notify me"
            successMessage="Thank you for joining the waiting list"
          />
        </div>
        <svg
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
        >
          <circle
            r={512}
            cx={512}
            cy={512}
            fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
      </Card>
    </SectionLayout>
  );
};
