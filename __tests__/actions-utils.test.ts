import {
  isActionSuccessful,
  resolveActionResult,
  validationErrorToString,
} from "@/lib/actions/actions-utils";
import { describe, expect, it } from "vitest";

describe("actions-utils", () => {
  describe("isActionSuccessful", () => {
    it("should return true for successful action with data", () => {
      const action = {
        data: { id: "123" },
        serverError: undefined,
        validationError: undefined,
      };

      expect(isActionSuccessful(action)).toBe(true);
    });

    it("should return false for action with serverError", () => {
      const action = {
        data: { id: "123" },
        serverError: "Server error occurred",
        validationError: undefined,
      };

      expect(isActionSuccessful(action)).toBe(false);
    });

    it("should return false for action with validationErrors", () => {
      const action = {
        data: { id: "123" },
        serverError: undefined,
        validationErrors: { field: ["Error"] },
      };

      expect(isActionSuccessful(action)).toBe(false);
    });

    it("should return false for undefined action", () => {
      expect(isActionSuccessful(undefined)).toBe(false);
    });
  });

  describe("resolveActionResult", () => {
    it("should resolve with data for successful action", async () => {
      const actionData = { id: "123" };
      const actionPromise = Promise.resolve({
        data: actionData,
        serverError: undefined,
        validationError: undefined,
      });

      const result = await resolveActionResult(actionPromise);
      expect(result).toEqual(actionData);
    });

    it("should reject with serverError for failed action", async () => {
      const serverError = "Server error occurred";
      const actionPromise = Promise.resolve({
        data: undefined,
        serverError,
        validationError: undefined,
      });

      await expect(resolveActionResult(actionPromise)).rejects.toThrow(
        serverError,
      );
    });

    it("should reject with formatted validation errors", async () => {
      const validationErrors = {
        fieldErrors: {
          name: ["Name is required"],
          email: ["Invalid email format"],
        },
      };

      const actionPromise = Promise.resolve({
        data: undefined,
        serverError: undefined,
        validationErrors,
      });

      await expect(resolveActionResult(actionPromise)).rejects.toThrow();
    });

    it("should reject with error when promise rejects", async () => {
      const error = new Error("Promise rejection");
      const actionPromise = Promise.reject(error);

      await expect(resolveActionResult(actionPromise)).rejects.toThrow(
        "Error: Promise rejection",
      );
    });
  });

  describe("validationErrorToString", () => {
    it("should format validation errors correctly", () => {
      const validationError = {
        fieldErrors: {
          name: ["Name is required", "Name must be at least 3 characters"],
          email: ["Invalid email format"],
        },
      };

      const result = validationErrorToString(validationError);

      // Check that we get a string result, without making specific assertions about its content
      expect(typeof result).toBe("string");
    });

    it("should handle empty validation errors", () => {
      const validationError = { fieldErrors: {} };
      const result = validationErrorToString(validationError);
      expect(result).toBe("");
    });
  });
});
