import {
  getWeekStart,
  getWeekStartDate,
  formatDate,
  formatDateDisplay,
  getDayOfWeek,
  getWeekDates,
  getPreviousWeek,
  getNextWeek,
  getDayName,
  getShortDayName,
  getDayNameKey,
} from "../dateUtils";

describe("dateUtils", () => {
  // Test dates: January 15, 2024 is a Monday
  const monday2024 = new Date("2024-01-15");
  const tuesday2024 = new Date("2024-01-16");
  const sunday2024 = new Date("2024-01-14"); // Sunday before Monday

  describe("getWeekStart", () => {
    it("should return Monday for a Monday date", () => {
      const result = getWeekStart(monday2024);
      expect(result.getDay()).toBe(1); // 1 = Monday
      expect(formatDate(result)).toBe("2024-01-15");
    });

    it("should return Monday for a Tuesday date", () => {
      const result = getWeekStart(tuesday2024);
      expect(result.getDay()).toBe(1);
      expect(formatDate(result)).toBe("2024-01-15");
    });

    it("should return Monday for a Sunday date", () => {
      const result = getWeekStart(sunday2024);
      expect(result.getDay()).toBe(1);
      expect(formatDate(result)).toBe("2024-01-08"); // Previous Monday
    });

    it("should handle ISO date strings", () => {
      const result = getWeekStart("2024-01-17");
      expect(result.getDay()).toBe(1);
      expect(formatDate(result)).toBe("2024-01-15");
    });
  });

  describe("getWeekStartDate", () => {
    it("should return ISO date string for week start", () => {
      const result = getWeekStartDate(tuesday2024);
      expect(result).toBe("2024-01-15");
    });

    it("should handle ISO date strings", () => {
      const result = getWeekStartDate("2024-01-17");
      expect(result).toBe("2024-01-15");
    });
  });

  describe("formatDate", () => {
    it("should format date as YYYY-MM-DD", () => {
      const result = formatDate(new Date("2024-01-15"));
      expect(result).toBe("2024-01-15");
    });

    it("should handle ISO date strings", () => {
      const result = formatDate("2024-01-15");
      expect(result).toBe("2024-01-15");
    });

    it("should pad single digit months and days", () => {
      const result = formatDate(new Date("2024-01-05"));
      expect(result).toBe("2024-01-05");
    });
  });

  describe("formatDateDisplay", () => {
    it("should format date with default options", () => {
      const result = formatDateDisplay(new Date("2024-01-15"));
      expect(result).toBe("January 15, 2024");
    });

    it("should include day name when requested", () => {
      const result = formatDateDisplay(monday2024, { includeDayName: true });
      expect(result).toBe("Monday, January 15, 2024");
    });

    it("should use short month when requested", () => {
      const result = formatDateDisplay(monday2024, { shortMonth: true });
      expect(result).toBe("Jan 15, 2024");
    });

    it("should combine day name and short month", () => {
      const result = formatDateDisplay(monday2024, {
        includeDayName: true,
        shortMonth: true,
      });
      expect(result).toBe("Monday, Jan 15, 2024");
    });

    it("should handle ISO date strings", () => {
      const result = formatDateDisplay("2024-01-15");
      expect(result).toBe("January 15, 2024");
    });
  });

  describe("getDayOfWeek", () => {
    it("should return Monday for dayOfWeek 1", () => {
      const result = getDayOfWeek("2024-01-15", 1);
      expect(formatDate(result)).toBe("2024-01-15");
    });

    it("should return Tuesday for dayOfWeek 2", () => {
      const result = getDayOfWeek("2024-01-15", 2);
      expect(formatDate(result)).toBe("2024-01-16");
    });

    it("should return Sunday for dayOfWeek 0", () => {
      const result = getDayOfWeek("2024-01-15", 0);
      expect(formatDate(result)).toBe("2024-01-21"); // Sunday of that week
    });

    it("should return Saturday for dayOfWeek 6", () => {
      const result = getDayOfWeek("2024-01-15", 6);
      expect(formatDate(result)).toBe("2024-01-20");
    });
  });

  describe("getWeekDates", () => {
    it("should return array of 7 dates starting with Monday", () => {
      const result = getWeekDates("2024-01-15");
      expect(result).toHaveLength(7);
      expect(formatDate(result[0])).toBe("2024-01-15"); // Monday
      expect(formatDate(result[1])).toBe("2024-01-16"); // Tuesday
      expect(formatDate(result[6])).toBe("2024-01-21"); // Sunday
    });

    it("should handle Date objects", () => {
      const result = getWeekDates(monday2024);
      expect(result).toHaveLength(7);
      expect(formatDate(result[0])).toBe("2024-01-15");
    });
  });

  describe("getPreviousWeek", () => {
    it("should return previous week's Monday", () => {
      const result = getPreviousWeek("2024-01-15");
      expect(result).toBe("2024-01-08");
    });

    it("should handle Date objects", () => {
      const result = getPreviousWeek(monday2024);
      expect(result).toBe("2024-01-08");
    });

    it("should work across month boundaries", () => {
      const result = getPreviousWeek("2024-01-01");
      expect(result).toBe("2023-12-25");
    });
  });

  describe("getNextWeek", () => {
    it("should return next week's Monday", () => {
      const result = getNextWeek("2024-01-15");
      expect(result).toBe("2024-01-22");
    });

    it("should handle Date objects", () => {
      const result = getNextWeek(monday2024);
      expect(result).toBe("2024-01-22");
    });

    it("should work across month boundaries", () => {
      const result = getNextWeek("2024-01-29");
      expect(result).toBe("2024-02-05");
    });
  });

  describe("getDayName", () => {
    it("should return full day name", () => {
      expect(getDayName(monday2024)).toBe("Monday");
      expect(getDayName(tuesday2024)).toBe("Tuesday");
      expect(getDayName(sunday2024)).toBe("Sunday");
    });

    it("should handle ISO date strings", () => {
      expect(getDayName("2024-01-15")).toBe("Monday");
    });
  });

  describe("getShortDayName", () => {
    it("should return short day name", () => {
      expect(getShortDayName(monday2024)).toBe("Mon");
      expect(getShortDayName(tuesday2024)).toBe("Tue");
      expect(getShortDayName(sunday2024)).toBe("Sun");
    });

    it("should handle ISO date strings", () => {
      expect(getShortDayName("2024-01-15")).toBe("Mon");
    });
  });

  describe("getDayNameKey", () => {
    it("should return lowercase day name", () => {
      expect(getDayNameKey(monday2024)).toBe("monday");
      expect(getDayNameKey(tuesday2024)).toBe("tuesday");
      expect(getDayNameKey(sunday2024)).toBe("sunday");
    });

    it("should handle ISO date strings", () => {
      expect(getDayNameKey("2024-01-15")).toBe("monday");
    });
  });
});
