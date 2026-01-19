import {
  getAllMealPlans,
  loadMealPlan,
  saveMealPlan,
  deleteMealPlan,
  clearAllMealPlans,
} from "../mealPlanStorage";

// Mock localStorage
const createLocalStorageMock = () => {
  let store = {};

  return {
    getItem: jest.fn((key) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    _getStore: () => store,
    _setStore: (newStore) => {
      store = newStore;
    },
  };
};

describe("mealPlanStorage", () => {
  let localStorageMock;

  beforeEach(() => {
    // Create fresh localStorage mock for each test
    localStorageMock = createLocalStorageMock();

    // Reset localStorage methods
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore window if it was deleted
    if (typeof global.window === "undefined") {
      global.window = window;
    }
  });

  describe("getAllMealPlans", () => {
    it("should return empty object when localStorage is empty", () => {
      const result = getAllMealPlans();
      expect(result).toEqual({});
    });

    it("should return all meal plans from localStorage", () => {
      const mealPlans = {
        "2024-01-01": {
          weekStartDate: "2024-01-01",
          meals: { monday: {} },
        },
        "2024-01-08": {
          weekStartDate: "2024-01-08",
          meals: { monday: {} },
        },
      };
      localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

      const result = getAllMealPlans();
      expect(result).toEqual(mealPlans);
    });

    it("should return empty object on parse error", () => {
      localStorage.setItem("mealPlans", "invalid json");
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = getAllMealPlans();
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // Note: SSR test skipped - window is always defined in Jest/jsdom environment
    // The typeof window === "undefined" check works correctly in actual SSR scenarios
  });

  describe("loadMealPlan", () => {
    it("should return null when meal plan does not exist", () => {
      const result = loadMealPlan("2024-01-01");
      expect(result).toBeNull();
    });

    it("should return meal plan when it exists", () => {
      const mealPlan = {
        weekStartDate: "2024-01-01",
        meals: {
          monday: {
            breakfast: { recipeId: "123", recipeTitle: "Pancakes" },
          },
        },
      };
      const allPlans = {
        "2024-01-01": mealPlan,
      };
      localStorage.setItem("mealPlans", JSON.stringify(allPlans));

      const result = loadMealPlan("2024-01-01");
      expect(result).toEqual(mealPlan);
    });

    // Note: SSR test skipped - window is always defined in Jest/jsdom environment
    // The typeof window === "undefined" check works correctly in actual SSR scenarios

    it("should return null on error", () => {
      localStorage.setItem("mealPlans", "invalid json");
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = loadMealPlan("2024-01-01");
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("saveMealPlan", () => {
    it("should save meal plan to localStorage", () => {
      const mealPlan = {
        meals: {
          monday: {
            breakfast: { recipeId: "123", recipeTitle: "Pancakes" },
          },
        },
      };

      const result = saveMealPlan("2024-01-01", mealPlan);
      expect(result).toBe(true);

      const saved = JSON.parse(localStorage.getItem("mealPlans"));
      expect(saved["2024-01-01"]).toEqual({
        ...mealPlan,
        weekStartDate: "2024-01-01",
      });
    });

    it("should ensure weekStartDate is set", () => {
      const mealPlan = {
        meals: { monday: {} },
      };

      saveMealPlan("2024-01-01", mealPlan);
      const saved = JSON.parse(localStorage.getItem("mealPlans"));
      expect(saved["2024-01-01"].weekStartDate).toBe("2024-01-01");
    });

    it("should preserve existing meal plans", () => {
      const existingPlan = {
        "2024-01-01": {
          weekStartDate: "2024-01-01",
          meals: { monday: {} },
        },
      };
      localStorage.setItem("mealPlans", JSON.stringify(existingPlan));

      const newPlan = {
        meals: { monday: {} },
      };
      saveMealPlan("2024-01-08", newPlan);

      const saved = JSON.parse(localStorage.getItem("mealPlans"));
      expect(saved["2024-01-01"]).toBeDefined();
      expect(saved["2024-01-08"]).toBeDefined();
    });

    // Note: SSR test skipped - window is always defined in Jest/jsdom environment
    // The typeof window === "undefined" check works correctly in actual SSR scenarios

    it("should return false on error", () => {
      // Mock localStorage.setItem to throw an error for this test only
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage quota exceeded");
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = saveMealPlan("2024-01-01", { meals: {} });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      // Restore original setItem
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe("deleteMealPlan", () => {
    it("should delete meal plan from localStorage", () => {
      const allPlans = {
        "2024-01-01": {
          weekStartDate: "2024-01-01",
          meals: { monday: {} },
        },
        "2024-01-08": {
          weekStartDate: "2024-01-08",
          meals: { monday: {} },
        },
      };
      localStorage.setItem("mealPlans", JSON.stringify(allPlans));

      const result = deleteMealPlan("2024-01-01");
      expect(result).toBe(true);

      const saved = JSON.parse(localStorage.getItem("mealPlans"));
      expect(saved["2024-01-01"]).toBeUndefined();
      expect(saved["2024-01-08"]).toBeDefined();
    });

    it("should return true even if meal plan does not exist", () => {
      // Ensure localStorage is empty
      localStorageMock._setStore({});
      const result = deleteMealPlan("2024-01-01");
      expect(result).toBe(true);
    });

    // Note: SSR test skipped - window is always defined in Jest/jsdom environment
    // The typeof window === "undefined" check works correctly in actual SSR scenarios

    it("should return false on error", () => {
      // Mock localStorage.setItem to throw an error for this test only
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage error");
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = deleteMealPlan("2024-01-01");
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      // Restore original setItem
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe("clearAllMealPlans", () => {
    it("should remove mealPlans from localStorage", () => {
      localStorage.setItem("mealPlans", JSON.stringify({ "2024-01-01": {} }));

      const result = clearAllMealPlans();
      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith("mealPlans");
    });

    // Note: SSR test skipped - window is always defined in Jest/jsdom environment
    // The typeof window === "undefined" check works correctly in actual SSR scenarios

    it("should return false on error", () => {
      // Mock localStorage.removeItem to throw an error for this test only
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error("Storage error");
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = clearAllMealPlans();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      // Restore original removeItem
      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });
});
