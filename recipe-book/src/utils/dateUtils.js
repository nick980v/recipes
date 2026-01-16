/**
 * Utility functions for date calculations and formatting
 * Used for meal planner week navigation and date display
 */

import { startOfWeek, format, addWeeks, addDays, parseISO } from "date-fns";

/**
 * Parse a date (handles both Date objects and ISO strings)
 * @param {Date|string} date - Date object or ISO date string
 * @returns {Date} Date object
 */
const parseDate = (date) => {
  if (date instanceof Date) return date;
  if (typeof date === "string") return parseISO(date);
  return new Date(date);
};

/**
 * Calculate the start of the week (Monday) for a given date
 * @param {Date|string} date - Date object or ISO date string
 * @returns {Date} Date object representing Monday of that week
 */
export const getWeekStart = (date) => {
  return startOfWeek(parseDate(date), { weekStartsOn: 1 }); // 1 = Monday
};

/**
 * Get the week start date as an ISO date string (YYYY-MM-DD)
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} ISO date string (YYYY-MM-DD) for Monday of that week
 */
export const getWeekStartDate = (date) => {
  return format(getWeekStart(date), "yyyy-MM-dd");
};

/**
 * Format a date as an ISO date string (YYYY-MM-DD)
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export const formatDate = (date) => {
  return format(parseDate(date), "yyyy-MM-dd");
};

/**
 * Format a date for display (e.g., "Jan 1, 2024" or "Monday, January 1")
 * @param {Date|string} date - Date object or ISO date string
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeDayName - Include day name (e.g., "Monday")
 * @param {boolean} options.shortMonth - Use short month names (e.g., "Jan" instead of "January")
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (date, options = {}) => {
  const { includeDayName = false, shortMonth = false } = options;
  const d = parseDate(date);

  if (includeDayName && shortMonth) {
    return format(d, "EEEE, MMM d, yyyy"); // "Monday, Jan 1, 2024"
  } else if (includeDayName) {
    return format(d, "EEEE, MMMM d, yyyy"); // "Monday, January 1, 2024"
  } else if (shortMonth) {
    return format(d, "MMM d, yyyy"); // "Jan 1, 2024"
  } else {
    return format(d, "MMMM d, yyyy"); // "January 1, 2024"
  }
};

/**
 * Get the date for a specific day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param {Date|string} weekStartDate - Monday of the week (ISO date string or Date)
 * @param {number} dayOfWeek - Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @returns {Date} Date object for that day
 */
export const getDayOfWeek = (weekStartDate, dayOfWeek) => {
  const monday = getWeekStart(weekStartDate);
  // dayOfWeek: 0=Sun, 1=Mon, ..., 6=Sat
  // We want: 1=Mon, 2=Tue, ..., 7=Sun
  const daysToAdd = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return addDays(monday, daysToAdd);
};

/**
 * Get all dates for a week starting from Monday
 * @param {Date|string} weekStartDate - Monday of the week (ISO date string or Date)
 * @returns {Array<Date>} Array of 7 Date objects, starting with Monday
 */
export const getWeekDates = (weekStartDate) => {
  const monday = getWeekStart(weekStartDate);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
};

/**
 * Get the previous week's start date
 * @param {Date|string} weekStartDate - Current week start date (ISO date string or Date)
 * @returns {string} ISO date string (YYYY-MM-DD) for previous week's Monday
 */
export const getPreviousWeek = (weekStartDate) => {
  const monday = getWeekStart(weekStartDate);
  return formatDate(addWeeks(monday, -1));
};

/**
 * Get the next week's start date
 * @param {Date|string} weekStartDate - Current week start date (ISO date string or Date)
 * @returns {string} ISO date string (YYYY-MM-DD) for next week's Monday
 */
export const getNextWeek = (weekStartDate) => {
  const monday = getWeekStart(weekStartDate);
  return formatDate(addWeeks(monday, 1));
};

/**
 * Get day name for a date (e.g., "Monday", "Tuesday")
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Day name
 */
export const getDayName = (date) => {
  return format(parseDate(date), "EEEE");
};

/**
 * Get short day name for a date (e.g., "Mon", "Tue")
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Short day name
 */
export const getShortDayName = (date) => {
  return format(parseDate(date), "EEE");
};

/**
 * Get the day name key for meal plan structure (e.g., "monday", "tuesday")
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Lowercase day name (e.g., "monday", "tuesday")
 */
export const getDayNameKey = (date) => {
  return getDayName(date).toLowerCase();
};
