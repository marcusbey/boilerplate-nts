export type Plan = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  barredPrice?: number;
  currency: string;
  features: string[];
  isPopular?: boolean;
  type?: "monthly" | "yearly" | "one-time";
  className?: string;
  priceId: string;
  cta: string;
  ctaSubtitle: string;
};

export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    subtitle: "Perfect for tiny creator",
    price: 0,
    currency: "USD",
    features: ["1 user"],
    isPopular: false,
    priceId: "",
    cta: "Start for free",
    ctaSubtitle: "No credit card required",
  },
  {
    id: "PRO",
    name: "Pro",
    subtitle: "Perfect for content creator",
    price: 49,
    currency: "USD",
    features: ["5 users"],
    isPopular: true,
    type: "monthly",
    // TODO : Change this to the actual price id
    priceId: "price_id_demo",
    cta: "Start now",
    ctaSubtitle: "Then $49/month",
  },
] satisfies Plan[];
