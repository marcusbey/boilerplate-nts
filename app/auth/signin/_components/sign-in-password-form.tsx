"use client";

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
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

const LoginCredentialsFormScheme = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type LoginCredentialsFormType = z.infer<typeof LoginCredentialsFormScheme>;

export const SignInPasswordForm = (props: {
  callbackUrl?: string;
  email?: string;
}) => {
  const form = useZodForm({
    schema: LoginCredentialsFormScheme,
    defaultValues: {
      email: props.email ?? "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (values: LoginCredentialsFormType) => {
      return unwrapSafePromise(
        authClient.signIn.email({
          email: values.email,
          password: values.password,
          rememberMe: true,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      const callbackUrl = getCallbackUrl(props.callbackUrl ?? "/orgs");
      window.location.href = callbackUrl;
    },
  });

  function onSubmit(values: LoginCredentialsFormType) {
    signInMutation.mutate(values);
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-lg space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john@doe.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="flex-1">
            <div className="flex items-center justify-between">
              <FormLabel>Password</FormLabel>
              <Link href="/auth/forget-password" className="text-sm underline">
                Forgot password ?
              </Link>
            </div>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LoadingButton
        loading={signInMutation.isPending}
        type="submit"
        className="ring-offset-card w-full ring-offset-2"
      >
        Sign in
      </LoadingButton>
    </Form>
  );
};
