import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const setup = (
  jsx: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => {
  // Create a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Wrap component with QueryClientProvider
  const wrappedJsx = (
    <QueryClientProvider client={queryClient}>{jsx}</QueryClientProvider>
  );

  return {
    user: userEvent.setup(),
    ...render(wrappedJsx, options),
    queryClient, // Also expose the queryClient in case tests need to interact with it
  };
};
