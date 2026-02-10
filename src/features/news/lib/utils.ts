
import { format, isDate } from "date-fns";

/**
 * Formats an ISO date string into a human-readable format.
 */
export const formatDate = (date: string): string => {
  const d = new Date(date);
  const isoDate = isDate(d);
  return isoDate ? format( new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())), "MMM d, yyyy") : date;
};
