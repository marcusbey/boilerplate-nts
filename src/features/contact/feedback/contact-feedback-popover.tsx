"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { InlineTooltip } from "@/components/ui/tooltip";
import { LoadingButton } from "@/features/form/submit-button";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Angry, Frown, Meh, SmilePlus } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { feedbackAction } from "./contact-feedback.action";
import type { ContactFeedbackSchemaType } from "./contact-feedback.schema";
import { ContactFeedbackSchema } from "./contact-feedback.schema";

type ContactFeedbackPopoverProps = PropsWithChildren;

export const ContactFeedbackPopover = (props: ContactFeedbackPopoverProps) => {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const email = session.data?.user ? session.data.user.email : "";
  const form = useZodForm({
    schema: ContactFeedbackSchema,
    defaultValues: {
      email: email,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ContactFeedbackSchemaType) => {
      return resolveActionResult(feedbackAction(values));
    },
    onSuccess: () => {
      toast.success("Your feedback has been sent! Thanks you.");
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast.error("An error occurred");
    },
  });

  const onSubmit = async (values: ContactFeedbackSchemaType) => {
    mutation.mutate(values);
  };

  return (
    <Popover open={open} onOpenChange={(v) => setOpen(v)}>
      <PopoverTrigger asChild>
        {props.children ?? <Button variant="outline">Feedback</Button>}
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Form
          form={form}
          onSubmit={async (v) => onSubmit(v)}
          className="flex flex-col gap-4"
        >
          <div className="p-2">
            {email ? null : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-accent bg-accent/50 flex w-full items-center justify-between border-t p-2">
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <ReviewInput
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                    value={field.value}
                  />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={mutation.isPending}
              type="submit"
              variant="outline"
            >
              Send
            </LoadingButton>
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

const ReviewInputItems = [
  {
    value: "1",
    icon: Angry,
    tooltip: "Extremely Dissatisfied",
  },
  {
    value: "2",
    icon: Frown,
    tooltip: "Somewhat Dissatisfied",
  },
  {
    value: "3",
    icon: Meh,
    tooltip: "Neutral",
  },
  {
    value: "4",
    icon: SmilePlus,
    tooltip: "Satisfied",
  },
];

const ReviewInput = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string;
}) => {
  return (
    <>
      {ReviewInputItems.map((item) => (
        <InlineTooltip key={item.value} title={item.tooltip}>
          <button
            type="button"
            onClick={() => {
              onChange(item.value);
            }}
            className={cn("transition hover:scale-110 hover:rotate-12", {
              "text-primary scale-110": value === item.value,
            })}
          >
            <item.icon size={24} />
          </button>
        </InlineTooltip>
      ))}
    </>
  );
};
