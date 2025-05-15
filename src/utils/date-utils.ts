
import { format, parse } from "date-fns";

/**
 * Formats a date string or Date object to the specified format
 */
export function formatDate(
  date: Date | string,
  formatStr: string = "MMM dd, yyyy"
): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

/**
 * Returns the day name (Monday, Tuesday, etc.) from a date
 */
export function getDayName(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "EEEE");
  } catch (error) {
    console.error("Error getting day name:", error);
    return "";
  }
}

/**
 * Returns a formatted time string (e.g., "10:00 AM")
 */
export function formatTime(
  timeStr: string,
  formatStr: string = "h:mm a"
): string {
  try {
    // Parse time string in format "HH:mm AM/PM"
    const parsedTime = parse(timeStr, "h:mm a", new Date());
    return format(parsedTime, formatStr);
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
}
