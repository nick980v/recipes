/**
 * Utility functions for managing meal plans in localStorage
 *
 * Meal plans are stored with the structure:
 * {
 *   "2024-01-01": {
 *     weekStartDate: "2024-01-01",
 *     meals: {
 *       "monday": {
 *         breakfast: { recipeId: "123", recipeTitle: "..." },
 *         lunch: { recipeId: "456", recipeTitle: "..." },
 *         dinner: { recipeId: "789", recipeTitle: "..." },
 *         snacks: { recipeId: "101", recipeTitle: "..." }
 *       },
 *       // ... tuesday through sunday
 *     }
 *   },
 *   "2024-01-08": { ... }
 * }
 */

const STORAGE_KEY = "mealPlans";

/**
 * Get all meal plans from localStorage
 * @returns {Object} Object with weekStartDate as keys and meal plan data as values
 */
export const getAllMealPlans = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading meal plans from localStorage:", error);
    return {};
  }
};

/**
 * Load a meal plan for a specific week
 * @param {string} weekStartDate - ISO date string (e.g., "2024-01-01")
 * @returns {Object|null} Meal plan object or null if not found
 */
export const loadMealPlan = (weekStartDate) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const allPlans = getAllMealPlans();
    return allPlans[weekStartDate] || null;
  } catch (error) {
    console.error("Error loading meal plan from localStorage:", error);
    return null;
  }
};

/**
 * Save a meal plan for a specific week
 * @param {string} weekStartDate - ISO date string (e.g., "2024-01-01")
 * @param {Object} mealPlan - Meal plan object with weekStartDate and meals
 * @returns {boolean} True if successful, false otherwise
 */
export const saveMealPlan = (weekStartDate, mealPlan) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const allPlans = getAllMealPlans();
    allPlans[weekStartDate] = {
      ...mealPlan,
      weekStartDate, // Ensure weekStartDate is set
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlans));
    return true;
  } catch (error) {
    console.error("Error saving meal plan to localStorage:", error);
    return false;
  }
};

/**
 * Delete a meal plan for a specific week
 * @param {string} weekStartDate - ISO date string (e.g., "2024-01-01")
 * @returns {boolean} True if successful, false otherwise
 */
export const deleteMealPlan = (weekStartDate) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const allPlans = getAllMealPlans();
    delete allPlans[weekStartDate];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPlans));
    return true;
  } catch (error) {
    console.error("Error deleting meal plan from localStorage:", error);
    return false;
  }
};

/**
 * Clear all meal plans from localStorage
 * @returns {boolean} True if successful, false otherwise
 */
export const clearAllMealPlans = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing meal plans from localStorage:", error);
    return false;
  }
};
