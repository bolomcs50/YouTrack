import { TimePeriod } from "../gui/components/TransactionsContextProvider";
import { DEFAULT_CATEGORIES } from "./constants";
import { AreaId, CategoryId } from "./types";

/**
 * Returns all category ids associated with the given area id
 * @param areaId - The area id to get the categories for
 * @returns An array of all category ids associated with the given area id
 */
export const getAreaCategories = (areaId: AreaId) => {
  return Object.keys(DEFAULT_CATEGORIES).filter(
    (key) => DEFAULT_CATEGORIES[key as CategoryId].area === areaId,
  ) as CategoryId[];
};

/**
 * Returns all month years in the given time period, in chronological order
 * @param timePeriod - The time period to get the month years for
 * @returns An array of all month years in the given time period
 */
export const getAllMonthYears = (timePeriod: TimePeriod) => {
  const allMonthYears: string[] = [];
  let cursor = new Date(timePeriod.startDate);
  const end = new Date(timePeriod.endDate);
  while (cursor <= end) {
    allMonthYears.push(cursor.toLocaleString(undefined, { month: "short", year: "numeric" }));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return allMonthYears;
};
