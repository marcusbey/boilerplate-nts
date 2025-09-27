"use client";

import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization, Subscription } from "@/generated/prisma";
import { AUTH_PLANS } from "@/lib/auth/stripe/auth-plans";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  cancelSubscriptionAction,
  createSubscriptionAction,
  reactivateSubscriptionAction,
  updateSubscriptionPlanAction,
} from "../_actions/subscription-admin.actions";

type OrganizationWithSubscription = Organization & {
  subscription: Subscription | null;
};

export function OrganizationSubscription({
  organization,
  subscription,
}: {
  organization: OrganizationWithSubscription;
  subscription: Subscription | null;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the correct default value for the select, including yearly suffix if applicable
  const getDefaultPlanKey = () => {
    if (!subscription?.plan) return "free";

    // Check if this is a yearly subscription by looking at the actual plan data
    const currentPlan = AUTH_PLANS.find(
      (plan) => plan.name === subscription.plan,
    );

    // If the subscription has yearly pricing and the period is yearly (12 months), append -yearly
    if (
      currentPlan?.yearlyPrice &&
      subscription.periodEnd &&
      subscription.periodStart
    ) {
      const periodStart = new Date(subscription.periodStart);
      const periodEnd = new Date(subscription.periodEnd);
      const monthsDiff =
        (periodEnd.getFullYear() - periodStart.getFullYear()) * 12 +
        (periodEnd.getMonth() - periodStart.getMonth());

      if (monthsDiff >= 11) {
        // Allow for some variance, yearly should be ~12 months
        return `${subscription.plan}-yearly`;
      }
    }

    return subscription.plan;
  };

  const [selectedPlanKey, setSelectedPlanKey] = useState(getDefaultPlanKey());

  const currentPlan = AUTH_PLANS.find(
    (plan) => plan.name === subscription?.plan,
  );
  const isActive = ["active", "trialing", "past_due"].includes(
    subscription?.status ?? "",
  );

  const handlePlanUpdate = async () => {
    const isYearly = selectedPlanKey.endsWith("-yearly");
    const planName = selectedPlanKey.replace("-yearly", "");

    // Allow updates even if same plan (to change billing frequency)
    if (selectedPlanKey === (subscription?.plan ?? "free")) return;

    setIsUpdating(true);
    try {
      if (!subscription && planName !== "free") {
        await createSubscriptionAction({
          organizationId: organization.id,
          planName,
          isYearly,
        });
      } else if (subscription) {
        await updateSubscriptionPlanAction({
          organizationId: organization.id,
          planName,
          isYearly,
        });
      }
      window.location.reload();
    } catch (error) {
      logger.error("Failed to update plan:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsUpdating(true);
    try {
      await cancelSubscriptionAction({
        organizationId: organization.id,
      });
      window.location.reload();
    } catch (error) {
      logger.error("Failed to cancel subscription:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    setIsUpdating(true);
    try {
      await reactivateSubscriptionAction({
        organizationId: organization.id,
      });
      window.location.reload();
    } catch (error) {
      logger.error("Failed to reactivate subscription:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "past_due":
        return "destructive";
      case "canceled":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Subscription Status */}
        <div className="space-y-3">
          <Typography variant="h3">Current Subscription</Typography>
          <div className="flex items-center gap-4">
            <Typography variant="large">
              {currentPlan?.name ?? "Free"} Plan
            </Typography>
            {subscription?.status && (
              <Badge variant={getStatusBadgeVariant(subscription.status)}>
                {subscription.status}
              </Badge>
            )}
          </div>

          {subscription?.periodEnd && (
            <Typography variant="muted">
              {subscription.cancelAtPeriodEnd ? "Cancels on" : "Renews on"}{" "}
              {format(subscription.periodEnd, "MMM dd, yyyy")}
            </Typography>
          )}

          {subscription?.stripeCustomerId && (
            <Typography variant="muted">
              Customer ID: {subscription.stripeCustomerId}
            </Typography>
          )}

          {subscription?.stripeSubscriptionId && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Stripe Subscription
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Plan Management */}
        <div className="space-y-3">
          <Typography variant="h3">Change Plan</Typography>
          <div className="flex items-center gap-3">
            <Select value={selectedPlanKey} onValueChange={setSelectedPlanKey}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {AUTH_PLANS.map((plan) => [
                  <SelectItem key={plan.name} value={plan.name}>
                    <span className="font-medium capitalize">
                      {plan.name} - ${plan.price}/month
                    </span>
                  </SelectItem>,
                  plan.yearlyPrice && (
                    <SelectItem
                      key={`${plan.name}-yearly`}
                      value={`${plan.name}-yearly`}
                    >
                      <span className="font-medium capitalize">
                        {plan.name} (Yearly) - ${plan.yearlyPrice}/year
                      </span>
                    </SelectItem>
                  ),
                ])
                  .flat()
                  .filter(Boolean)}
              </SelectContent>
            </Select>
            <Button onClick={handlePlanUpdate} disabled={isUpdating} size="sm">
              {isUpdating
                ? "Updating..."
                : !subscription && selectedPlanKey !== "free"
                  ? "Create"
                  : "Update"}
            </Button>
          </div>
        </div>

        {/* Subscription Actions */}
        {subscription && isActive && (
          <div className="space-y-3">
            <Typography variant="h3">Subscription Actions</Typography>
            <div className="flex items-center gap-3">
              {subscription.cancelAtPeriodEnd ? (
                <Button
                  onClick={handleReactivateSubscription}
                  disabled={isUpdating}
                  size="sm"
                  variant="outline"
                >
                  {isUpdating ? "Processing..." : "Reactivate"}
                </Button>
              ) : (
                <Button
                  onClick={handleCancelSubscription}
                  disabled={isUpdating}
                  size="sm"
                  variant="outline"
                >
                  {isUpdating ? "Processing..." : "Cancel at Period End"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
