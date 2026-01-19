"use client";

import React, { useState } from "react";
import WeekView from "@/components/MealPlanner/WeekView";
import { getWeekStartDate, getPreviousWeek, getNextWeek, formatDateDisplay } from "@/utils/dateUtils";
import { useMealPlan } from "@/hooks/useMealPlan";

const MealPlannerClient = ({ recipes }) => {
  // Get the current week start date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return getWeekStartDate(new Date());
  });

  // Use the meal plan hook
  const { mealPlan, addMeal, removeMeal } = useMealPlan(currentWeekStart);

  // Handle week navigation
  const goToPreviousWeek = () => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(getNextWeek(currentWeekStart));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStartDate(new Date()));
  };

  // Handle recipe selection
  const handleSelectRecipe = (day, mealType, recipe) => {
    if (recipe) {
      addMeal(day, mealType, recipe);
    } else {
      removeMeal(day, mealType);
    }
  };

  // Get week display date range
  const getWeekDisplayRange = () => {
    const startDate = new Date(currentWeekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Add 6 days to get Sunday

    const startFormatted = formatDateDisplay(startDate, { shortMonth: true });
    const endFormatted = formatDateDisplay(endDate, { shortMonth: true });

    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          ← Previous Week
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {getWeekDisplayRange()}
          </h2>
          <button
            onClick={goToCurrentWeek}
            className="text-sm text-gray-600 hover:text-gray-800 mt-1 underline"
          >
            Go to Current Week
          </button>
        </div>

        <button
          onClick={goToNextWeek}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Next Week →
        </button>
      </div>

      {/* Week View */}
      <WeekView
        weekStartDate={currentWeekStart}
        recipes={recipes}
        mealPlan={mealPlan}
        onSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
};

export default MealPlannerClient;