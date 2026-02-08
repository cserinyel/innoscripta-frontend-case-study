import { DateTime } from "luxon";

/**
 * Formats an ISO date string into a human-readable format.
 * Uses Luxon to parse in UTC and format without timezone-induced day shifts.
 */
export const formatDate = (isoDate: string): string => {
  const dt = DateTime.fromISO(isoDate, { zone: "utc" });
  return dt.isValid ? dt.toFormat("MMM d, yyyy") : isoDate;
};
