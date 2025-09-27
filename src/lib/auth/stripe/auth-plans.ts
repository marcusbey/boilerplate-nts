import type { Subscription } from "@/generated/prisma";
import { logger } from "@/lib/logger";
import {
  Clock,
  FolderArchive,
  HardDrive,
  HeadphonesIcon,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const DEFAULT_LIMIT = {
  projects: 5,
  storage: 10,
  members: 3,
};

export type PlanLimit = typeof DEFAULT_LIMIT;

type HookCtx = {
  req: Request;
  organizationId: string;
  stripeCustomerId: string;
  subscriptionId: string;
};

export type AppAuthPlan = {
  priceId?: string | undefined;
  lookupKey?: string | undefined;
  annualDiscountPriceId?: string | undefined;
  annualDiscountLookupKey?: string | undefined;
  name: string;
  limits?: Record<string, number> | undefined;
  group?: string;
  freeTrial?: {
    days: number;
    onTrialStart?: (subscription: Subscription, ctx: HookCtx) => Promise<void>;
    onTrialEnd?: (
      data: {
        subscription: Subscription;
      },
      ctx: HookCtx,
    ) => Promise<void>;
    onTrialExpired?: (
      subscription: Subscription,
      ctx: HookCtx,
    ) => Promise<void>;
  };
  onSubscriptionCanceled?: (
    subscription: Subscription,
    ctx: HookCtx,
  ) => Promise<void>;
} & {
  description: string;
  isPopular?: boolean;
  price: number;
  yearlyPrice?: number;
  currency: string;
  isHidden?: boolean;
  limits: PlanLimit;
};

export const AUTH_PLANS: AppAuthPlan[] = [
  {
    name: "free",
    description:
      "Perfect for individuals and small projects with essential features",
    limits: DEFAULT_LIMIT,
    price: 0,
    currency: "USD",
    yearlyPrice: 0,
  },
  {
    name: "pro",
    isPopular: true,
    description: "Ideal for growing teams with advanced collaboration needs",
    priceId: process.env.STRIPE_PRO_PLAN_ID ?? "",
    annualDiscountPriceId: process.env.STRIPE_PRO_YEARLY_PLAN_ID ?? "",
    limits: {
      projects: 20,
      storage: 50,
      members: 10,
    },
    freeTrial: {
      days: 14,
      onTrialStart: async (subscription) => {
        // Send a welcome email to the user
        logger.debug(`Welcome email sent to ${subscription}`);
      },
      onTrialExpired: async (subscription) => {
        // Handle trial expiration
        logger.debug(`Trial expired for ${subscription}`);
      },
      onTrialEnd: async (subscription) => {
        // Handle trial end
        logger.debug(`Trial ended for ${subscription}`);
      },
    },

    price: 49,
    yearlyPrice: 400,
    currency: "USD",
  },
  {
    name: "ultra",
    isPopular: false,
    description:
      "Enterprise-grade solution for large teams with complex requirements",
    priceId: process.env.STRIPE_ULTRA_PLAN_ID ?? "",
    annualDiscountPriceId: process.env.STRIPE_ULTRA_YEARLY_PLAN_ID ?? "",
    limits: {
      projects: 100,
      storage: 1000,
      members: 100,
    },
    freeTrial: {
      days: 14,
    },
    price: 100,
    yearlyPrice: 1000,
    currency: "USD",
  },
];

// Limits transformation object
export const LIMITS_CONFIG: Record<
  keyof PlanLimit,
  {
    icon: React.ElementType;
    getLabel: (value: number) => string;
    description: string;
  }
> = {
  projects: {
    icon: FolderArchive,
    getLabel: (value: number) =>
      `${value} ${value === 1 ? "Project" : "Projects"}`,
    description: "Create and manage projects",
  },
  storage: {
    icon: HardDrive,
    getLabel: (value: number) => `${value} GB Storage`,
    description: "Cloud storage for your files",
  },
  members: {
    icon: Users,
    getLabel: (value: number) =>
      `${value} Team ${value === 1 ? "Member" : "Members"}`,
    description: "Invite team members to collaborate",
  },
};

// Additional features by plan
export const ADDITIONAL_FEATURES = {
  free: [
    {
      icon: Shield,
      label: "Basic Security",
      description: "Standard protection for your data",
    },
  ],
  pro: [
    {
      icon: Zap,
      label: "Priority Support",
      description: "Get help when you need it most",
    },
    {
      icon: HeadphonesIcon,
      label: "24/7 Customer Service",
      description: "Round-the-clock assistance",
    },
    {
      icon: Clock,
      label: "Advanced Analytics",
      description: "Detailed insights and reporting",
    },
  ],
  ultra: [
    {
      icon: Zap,
      label: "Priority Support",
      description: "Get help when you need it most",
    },
  ],
};

export const getPlanLimits = (plan = "free"): PlanLimit => {
  const planLimits = AUTH_PLANS.find((p) => p.name === plan)?.limits;

  return planLimits ?? DEFAULT_LIMIT;
};
