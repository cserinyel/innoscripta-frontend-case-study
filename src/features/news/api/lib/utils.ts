import type { ApiError } from "./types";

/**
 * Generates a deterministic ID from a string input using a simple hash.
 * Used to create stable article IDs from URLs or titles.
 */
export const generateArticleId = (input: string): string => {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
};

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
};

/**
 * Returns the oldest (earliest) date string from an array of ISO date strings.
 * Returns null if the array is empty.
 */
export const getOldestDate = (dates: string[]): string | null => {
  if (dates.length === 0) return null;
  return dates.reduce((oldest, d) => (d < oldest ? d : oldest));
};

/**
 * Extracts a user-friendly error message from an unknown error.
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
