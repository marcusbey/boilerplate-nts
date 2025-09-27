import { authClient } from "@/lib/auth-client";
import "@testing-library/jest-dom/vitest";
import { screen, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpCredentialsForm } from "../app/auth/signup/sign-up-credentials-form";
import { setup } from "../test/setup";

describe("SignUpCredentialsForm", () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: {
        origin: "http://localhost:3000",
        href: "http://localhost:3000/auth/signup",
      },
      writable: true,
    });

    // Mock successful signup response
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { success: true },
      error: null,
    });

    // Reset searchParams to default (empty)
    vi.mocked(useSearchParams).mockReturnValue(createTestSearchParams());
  });

  it("should render all form fields", async () => {
    setup(<SignUpCredentialsForm />);

    // Check all fields are rendered
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verify password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("should show error when passwords don't match", async () => {
    const { user } = setup(<SignUpCredentialsForm />);

    // Fill the form with mismatched passwords
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/verify password/i), "password456");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/password does not match/i)).toBeInTheDocument();
    });

    // Should not call signup API
    expect(authClient.signUp.email).not.toHaveBeenCalled();
  });

  it("should submit form and redirect on successful signup", async () => {
    const { user } = setup(<SignUpCredentialsForm />);

    // Fill all fields correctly
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/verify password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        name: "John Doe",
        image: "",
      });
    });

    // Check if redirect happened
    expect(window.location.href).toBe("http://localhost:3000/orgs");
  });

  it("should use custom callback URL from searchParams", async () => {
    // Mock searchParams with custom callback
    vi.mocked(useSearchParams).mockReturnValue(
      createTestSearchParams({ callbackUrl: "/dashboard" }),
    );

    const { user } = setup(<SignUpCredentialsForm />);

    // Fill all fields correctly
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/verify password/i), "password123");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Wait for submission to complete
    await waitFor(() => {
      expect(authClient.signUp.email).toHaveBeenCalled();
    });

    // Check if redirected to custom URL
    expect(window.location.href).toBe("http://localhost:3000/orgs");
  });
});
