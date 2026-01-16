"use client";

import React from "react";
import DayMealSlot from "./DayMealSlot";
import {
  getWeekDates,
  getDayNameKey,
  formatDateDisplay,
} from "@/utils/dateUtils";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];
const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeekView = ({
  weekStartDate,
  recipes = [],
  mealPlan = null,
  onSelectRecipe,
}) => {
  // Get all dates for the week (Monday through Sunday)
  const weekDates = getWeekDates(weekStartDate);

  // Get assigned recipe for a specific day and meal type
  const getAssignedRecipe = (dayNameKey, mealType) => {
    if (!mealPlan || !mealPlan.meals || !mealPlan.meals[dayNameKey]) {
      return null;
    }
    return mealPlan.meals[dayNameKey][mealType] || null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header row with meal types */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="font-semibold text-gray-700"></div>
          {MEAL_TYPES.map((mealType) => (
            <div
              key={mealType}
              className="font-semibold text-gray-700 text-center capitalize"
            >
              {mealType}
            </div>
          ))}
        </div>

        {/* Rows for each day */}
        {weekDates.map((date, index) => {
          const dayNameKey = getDayNameKey(date);
          const dayName = DAY_NAMES[index];
          const dateDisplay = formatDateDisplay(date, { shortMonth: true });

          return (
            <div key={dayNameKey} className="grid grid-cols-8 gap-2 mb-2">
              {/* Day header column */}
              <div className="font-semibold text-gray-800 p-2 bg-gray-50 rounded-lg">
                <div className="text-sm">{dayName}</div>
                <div className="text-xs text-gray-600">{dateDisplay}</div>
              </div>

              {/* Meal slots for this day */}
              {MEAL_TYPES.map((mealType) => {
                const assignedRecipe = getAssignedRecipe(dayNameKey, mealType);

                return (
                  <DayMealSlot
                    key={`${dayNameKey}-${mealType}`}
                    day={dayNameKey}
                    mealType={mealType}
                    assignedRecipe={assignedRecipe}
                    recipes={recipes}
                    onSelectRecipe={onSelectRecipe}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
