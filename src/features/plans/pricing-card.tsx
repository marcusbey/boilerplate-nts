"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { BuyButton } from "@/features/stripe/buy-button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import type { Plan } from "./plans";

export const PricingCard = (props: Plan) => {
  const params = useParams();

  const organizationSlug = params.orgSlug ? params.orgSlug : "";

  return (
    <Card
      className={cn(
        "border-[0.5px] h-fit lg:rounded-3xl rounded-3xl flex-1 p-6 ring-1 ring-gray-900/10 sm:p-8",
        {
          "relative bg-background shadow-2xl": props.isPopular,
          "bg-background/60 sm:mx-8 lg:mx-0": !props.isPopular,
        },
        props.className,
      )}
    >
      {props.isPopular ? (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center">
          <Badge className="-translate-y-1/2">Popular</Badge>
        </div>
      ) : null}
      <CardHeader className="flex flex-col items-start gap-6 lg:gap-8">
        <p className="gap-4 text-lg font-bold uppercase text-primary">
          {props.name}
        </p>
        <div className="flex items-end justify-center gap-2">
          <p className="text-5xl font-extrabold">${props.price}</p>
          <Typography>{props.currency || "USD"}</Typography>

          {props.barredPrice ? (
            <div className="relative self-start">
              <p className="text-lg font-bold">${props.barredPrice}</p>
              <div className="absolute top-1/2 h-0.5 w-full rotate-45 bg-red-500" />
            </div>
          ) : null}
        </div>
        <Typography variant="muted">{props.subtitle}</Typography>
        <Separator />
        <ul className="flex w-full flex-col gap-3 lg:gap-4">
          {props.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-1">
              <Check className="text-green-500" size={20} />
              <Typography variant="muted" className="flex-1">
                {" "}
                {feature}
              </Typography>
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <BuyButton
          orgSlug={String(organizationSlug)}
          variant={props.isPopular ? "default" : "outline"}
          priceId={props.priceId}
        >
          {props.cta}
        </BuyButton>
        <Typography variant="muted">{props.ctaSubtitle}</Typography>
      </CardFooter>
    </Card>
  );
};
