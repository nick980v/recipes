import { useState, useEffect, useCallback } from "react";
import { useMealPlan } from "./useMealPlan";
import { aggregateIngredients } from "@/utils/ingredientAggregator";

/**
 * Custom hook for generating and managing shopping lists from meal plans
 * @param {string} weekStartDate - ISO date string for the week start (Monday)
 * @returns {Object} Hook interface with shopping list state and methods
 */
export const useShoppingList = (weekStartDate) => {
  const { mealPlan } = useMealPlan(weekStartDate);
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch full recipe data including ingredients
   * @param {string} recipeId - Recipe ID to fetch
   * @returns {Promise<Object|null>} Recipe data or null if failed
   */
  const fetchRecipeData = useCallback(async (recipeId) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);

      if (!res.ok) {
        console.error(
          `Failed to fetch recipe ${recipeId}:`,
          res.status,
          res.statusText
        );
        return null;
      }
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching recipe ${recipeId}:`, error);
      return null;
    }
  }, []);

  /**
   * Generate shopping list from current meal plan
   */
  const generateShoppingList = useCallback(async () => {
    if (!mealPlan || !mealPlan.meals) {
      setShoppingList([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Count occurrences of each recipe ID in the meal plan
      const recipeCounts = {};

      Object.values(mealPlan.meals).forEach((dayMeals) => {
        Object.values(dayMeals).forEach((meal) => {
          if (meal && meal.recipeId) {
            recipeCounts[meal.recipeId] =
              (recipeCounts[meal.recipeId] || 0) + 1;
          }
        });
      });

      const recipeIds = Object.keys(recipeCounts);

      // Fetch all recipe data
      const recipePromises = Array.from(recipeIds).map(fetchRecipeData);
      const recipes = await Promise.all(recipePromises);

      // Filter out null results and extract ingredients, multiplying by recipe count
      const allIngredients = [];
      recipes.forEach((recipe, index) => {
        if (!recipe) return;

        // Check both 'ingredient' and 'Ingredients' fields
        const ingredients = recipe?.ingredient || recipe?.Ingredients || [];
        if (ingredients.length > 0) {
          // Find the recipe ID in our counts (recipes array order matches recipeIds order)
          const recipeId = recipeIds[index];
          const count = recipeCounts[recipeId];

          // Add ingredients multiplied by the count
          for (let i = 0; i < count; i++) {
            allIngredients.push(...ingredients);
          }
        }
      });

      // Aggregate ingredients
      const aggregatedList = aggregateIngredients(allIngredients);

      setShoppingList(aggregatedList);
    } catch (err) {
      console.error("Error generating shopping list:", err);
      setError(err.message);
      setShoppingList([]);
    } finally {
      setIsLoading(false);
    }
  }, [mealPlan, fetchRecipeData]);

  /**
   * Refresh the shopping list (useful after meal plan changes)
   */
  const refreshShoppingList = useCallback(() => {
    generateShoppingList();
  }, [generateShoppingList]);

  /**
   * Clear the shopping list
   */
  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  // Auto-generate shopping list when meal plan changes
  useEffect(() => {
    if (mealPlan) {
      generateShoppingList();
    } else {
      setShoppingList([]);
    }
  }, [mealPlan, generateShoppingList]);

  return {
    shoppingList,
    isLoading,
    error,
    refreshShoppingList,
    clearShoppingList,
  };
};
