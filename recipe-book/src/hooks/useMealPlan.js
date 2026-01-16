import { useState, useEffect, useCallback } from "react";
import {
  loadMealPlan,
  saveMealPlan,
  deleteMealPlan,
} from "@/utils/mealPlanStorage";

/**
 * Custom hook for managing meal plan state and synchronization with localStorage
 *
 * @param {string} weekStartDate - ISO date string for the week start (Monday)
 * @returns {Object} Hook interface with meal plan state and methods
 */
export const useMealPlan = (weekStartDate) => {
  const [mealPlan, setMealPlan] = useState(null);

  // Load meal plan when weekStartDate changes
  useEffect(() => {
    if (weekStartDate) {
      const loadedPlan = loadMealPlan(weekStartDate);
      setMealPlan(loadedPlan);
    }
  }, [weekStartDate]);

  /**
   * Add a recipe to a specific meal slot
   * @param {string} day - Day name key (e.g., "monday", "tuesday")
   * @param {string} mealType - Meal type (e.g., "breakfast", "lunch", "dinner", "snacks")
   * @param {Object|null} recipe - Recipe object with id/documentId and title properties, or null to remove
   */
  const addMeal = useCallback(
    (day, mealType, recipe) => {
      if (!weekStartDate) return;

      // Validate recipe object
      if (recipe && !recipe.documentId) {
        console.error("Invalid recipe object passed to addMeal:", recipe);
        return;
      }

      const newMealPlan = {
        weekStartDate,
        meals: {
          ...mealPlan?.meals,
          [day]: {
            ...mealPlan?.meals?.[day],
            [mealType]: recipe
              ? {
                  recipeId: recipe.documentId.toString(),
                  recipeTitle:
                    recipe.attributes?.Title ||
                    recipe.title ||
                    recipe.Title ||
                    "",
                }
              : null,
          },
        },
      };

      // Clean up null values and empty day objects
      Object.keys(newMealPlan.meals).forEach((dayKey) => {
        const dayMeals = newMealPlan.meals[dayKey];
        Object.keys(dayMeals).forEach((mealKey) => {
          if (dayMeals[mealKey] === null) {
            delete dayMeals[mealKey];
          }
        });
        if (Object.keys(dayMeals).length === 0) {
          delete newMealPlan.meals[dayKey];
        }
      });

      setMealPlan(newMealPlan);
      saveMealPlan(weekStartDate, newMealPlan);
    },
    [weekStartDate, mealPlan]
  );

  /**
   * Remove a recipe from a specific meal slot
   * @param {string} day - Day name key (e.g., "monday", "tuesday")
   * @param {string} mealType - Meal type (e.g., "breakfast", "lunch", "dinner", "snacks")
   */
  const removeMeal = useCallback(
    (day, mealType) => {
      if (!weekStartDate || !mealPlan?.meals?.[day]?.[mealType]) return;

      const newMealPlan = {
        ...mealPlan,
        meals: {
          ...mealPlan.meals,
          [day]: {
            ...mealPlan.meals[day],
          },
        },
      };

      // Remove the specific meal
      delete newMealPlan.meals[day][mealType];

      // Clean up empty day objects
      if (Object.keys(newMealPlan.meals[day]).length === 0) {
        delete newMealPlan.meals[day];
      }

      setMealPlan(newMealPlan);
      saveMealPlan(weekStartDate, newMealPlan);
    },
    [weekStartDate, mealPlan]
  );

  /**
   * Get the current week's meal plan
   * @returns {Object|null} The current meal plan object or null
   */
  const getWeekPlan = useCallback(() => {
    return mealPlan;
  }, [mealPlan]);

  /**
   * Clear all meals for the current week
   */
  const clearWeek = useCallback(() => {
    if (!weekStartDate) return;

    setMealPlan({ weekStartDate, meals: {} });
    deleteMealPlan(weekStartDate);
  }, [weekStartDate]);

  return {
    mealPlan,
    addMeal,
    removeMeal,
    getWeekPlan,
    clearWeek,
  };
};
