
import { format } from "date-fns";

/**
 * Formats an ISO date string into a human-readable format using UTC.
 * Displays the UTC calendar date regardless of user timezone.
 */
export const formatDate = (date: string): string => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return format( new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), "MMM d, yyyy")
};
