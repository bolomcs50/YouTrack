import { describe, expect, it } from "vitest";
import { getAllMonthYears, getAreaCategories } from "./utils";
import { TimePeriod } from "../gui/components/TransactionsContextProvider";
import { AreaId, CategoryId } from "./types";

describe("getAllMonthYears", () => {
  it("returns every month from Jan 2025 to Jan 2026 inclusive", () => {
    const timePeriod: TimePeriod = {
      startDate: new Date(2025, 0, 1).getTime(),
      endDate: new Date(2026, 0, 1).getTime(),
    };

    const monthYears = getAllMonthYears(timePeriod);

    expect(monthYears).toEqual([
      "Jan 2025",
      "Feb 2025",
      "Mar 2025",
      "Apr 2025",
      "May 2025",
      "Jun 2025",
      "Jul 2025",
      "Aug 2025",
      "Sep 2025",
      "Oct 2025",
      "Nov 2025",
      "Dec 2025",
      "Jan 2026",
    ]);
  });

  it("returns a single month when start and end dates match", () => {
    const timePeriod: TimePeriod = {
      startDate: new Date(2025, 0, 1).getTime(),
      endDate: new Date(2025, 0, 1).getTime(),
    };

    const monthYears = getAllMonthYears(timePeriod);

    expect(monthYears).toEqual(["Jan 2025"]);
  });

  it("returns an empty array when end date is before start date", () => {
    const timePeriod: TimePeriod = {
      startDate: new Date(2025, 0, 2).getTime(),
      endDate: new Date(2025, 0, 1).getTime(),
    };

    const monthYears = getAllMonthYears(timePeriod);

    expect(monthYears).toEqual([]);
  });
});

describe("getAreaCategories", () => {
  it("returns the correct categories for the area", () => {
    const areaId = AreaId.HOUSING;
    const categories = getAreaCategories(areaId);
    expect(categories).toEqual([CategoryId.RENT, CategoryId.UTILITIES, CategoryId.HOUSE_INSURANCE]);
  });
});
