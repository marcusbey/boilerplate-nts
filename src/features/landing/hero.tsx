import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { CircleSvg } from "@/components/svg/circle-svg";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "../../components/ui/typography";

export const Hero = () => {
  return (
    <div className="relative isolate flex flex-col">
      <GridBackground />
      <GradientBackground />
      <main className="relative py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography
              variant="h1"
              className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl lg:text-7xl"
            >
              Write the best content and Grow your{" "}
              <span className="relative inline-block">
                <span>business</span>
                <CircleSvg className="absolute inset-0 fill-primary" />
              </span>
            </Typography>
            <Typography
              variant="large"
              className="mt-8 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8"
            >
              Build for Thread, create, schedule and publish your content to
              your account with AI.
            </Typography>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ShimmerButton
                href="/signin"
                background="hsl(var(--primary))"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Get started
              </ShimmerButton>
              <Link
                href="#pricing"
                className={buttonVariants({ variant: "link" })}
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <Image
            alt="App screenshot"
            src="/images/screenshot.png"
            width={1280}
            height={720}
            className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
          />
        </div>
      </main>
    </div>
  );
};

const GridBackground = () => {
  return (
    <div className="absolute inset-0 bg-grid-white/20 bg-grid-16 [mask-image:linear-gradient(180deg,transparent,black,transparent)]"></div>
  );
};

const GradientBackground = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </>
  );
};
