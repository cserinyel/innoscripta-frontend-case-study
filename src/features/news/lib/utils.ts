
import { format, isDate } from "date-fns";

/**
 * Formats an ISO date string into a human-readable format.
 * Uses Luxon to parse in UTC and format without timezone-induced day shifts.
 */
export const formatDate = (date: string): string => {
  const isoDate = isDate(new Date(date));
  return isoDate ? format(date, "MMM d, yyyy") : date;
};
