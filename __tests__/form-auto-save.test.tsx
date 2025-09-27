import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "../src/components/ui/form";
import { Input } from "../src/components/ui/input";
import {
  FormAutoSave,
  FormAutoSaveWatch,
} from "../src/features/form/form-auto-save";
import { FormAutoSaveStickyBar } from "../src/features/form/form-auto-save-sticky-bar";
import { setup } from "../test/setup";

// Mock react-dom's createPortal
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: vi.fn((children) => children),
  };
});

// Test schema
const testSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Please enter a valid email"),
});

// Auto-save form component for testing FormAutoSave functionality
const AutoSaveTestForm = ({
  onSubmit = vi.fn(),
  enableAutoSaveWatch = false,
  autoSaveMs = 100,
}) => {
  const form = useZodForm({
    schema: testSchema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <FormAutoSave form={form} onSubmit={onSubmit} autoSaveMs={autoSaveMs}>
      {enableAutoSaveWatch && (
        <FormAutoSaveWatch form={form} autoSaveMs={autoSaveMs} />
      )}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input data-testid="name-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input data-testid="email-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormAutoSaveStickyBar actionLabel="Save Changes" cancelLabel="Cancel" />
    </FormAutoSave>
  );
};

// Test suite for FormAutoSave components
describe("FormAutoSave", () => {
  it("should save the form when clicking the save button", async () => {
    const handleSubmit = vi.fn();
    const { user } = setup(<AutoSaveTestForm onSubmit={handleSubmit} />);

    // Type valid data in the form
    await user.type(screen.getByTestId("name-input"), "John Doe");
    await user.type(screen.getByTestId("email-input"), "john@example.com");

    // Click the save button in the sticky bar
    await user.click(screen.getByText("Save Changes"));

    // Verify form was submitted
    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledWith(
          { name: "John Doe", email: "john@example.com" },
          expect.anything(),
        );
      },
      { timeout: 200 },
    );
  });

  it("should reset form when clicking the cancel button", async () => {
    const { user } = setup(<AutoSaveTestForm />);

    // Type data in the form to make it dirty
    await user.type(screen.getByTestId("name-input"), "Test Name");

    // Verify sticky bar is visible
    expect(
      screen.getByText("Changes have been made. Save now!"),
    ).toBeInTheDocument();

    // Click the cancel button
    await user.click(screen.getByText("Cancel"));

    // Verify inputs are reset to default values
    await waitFor(
      () => {
        expect(screen.getByTestId("name-input")).toHaveValue("");
      },
      { timeout: 300 },
    );
  });

  it("should save the form when pressing CMD+S", async () => {
    const handleSubmit = vi.fn();
    const { user } = setup(<AutoSaveTestForm onSubmit={handleSubmit} />);

    // Type valid data in the form
    await user.type(screen.getByTestId("name-input"), "John Doe");
    await user.type(screen.getByTestId("email-input"), "john@example.com");

    // Focus the name input
    screen.getByTestId("name-input").focus();

    // Press CMD+S (or CTRL+S for non-Mac)
    await user.keyboard("{Meta>}s{/Meta}");

    // Verify form was submitted
    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledWith(
          { name: "John Doe", email: "john@example.com" },
          expect.anything(),
        );
      },
      { timeout: 200 },
    );
  });
});
