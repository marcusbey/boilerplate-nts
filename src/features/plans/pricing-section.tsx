"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { PricingCard } from "./pricing-card";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="from-background to-muted/20 w-full bg-gradient-to-b py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the perfect plan for your needs. Upgrade or downgrade at
              any time.
            </p>
          </div>

          <div className="bg-muted/50 mt-8 flex items-center space-x-4 rounded-full p-2">
            <span
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <div
              className={cn(
                "flex items-center rounded-full px-4 py-2 transition-all duration-200",
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              <span className="text-sm font-medium">Yearly</span>
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary ml-2"
              >
                Save 20%
              </Badge>
            </div>
          </div>
        </div>

        <div
          className="mt-16 grid gap-8 lg:gap-12"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {AUTH_PLANS.filter((p) => !p.isHidden).map((plan) => (
            <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include basic features like unlimited access and community
            support.
          </p>
          <p className="text-muted-foreground mt-2">
            Need a custom plan?{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
