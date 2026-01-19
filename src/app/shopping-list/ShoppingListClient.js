"use client";

import React, { useState } from "react";
import { useShoppingList } from "@/hooks/useShoppingList";
import {
  getWeekStartDate,
  getPreviousWeek,
  getNextWeek,
  formatDateDisplay,
} from "@/utils/dateUtils";
import ShoppingList from "@/components/ShoppingList/ShoppingList";

const ShoppingListClient = () => {
  // Get the current week start date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return getWeekStartDate(new Date());
  });

  const { shoppingList, isLoading, error, refreshShoppingList } =
    useShoppingList(currentWeekStart);

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
            Shopping List for {getWeekDisplayRange()}
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

      {/* Shopping List */}
      <ShoppingList
        shoppingList={shoppingList}
        isLoading={isLoading}
        error={error}
        onRefresh={refreshShoppingList}
      />
    </div>
  );
};

export default ShoppingListClient;
