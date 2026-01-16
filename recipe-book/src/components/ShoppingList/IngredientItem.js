"use client";

import React from "react";

const IngredientItem = ({ ingredient, isChecked, onCheck }) => {
  const handleCheckboxChange = (e) => {
    onCheck(e.target.checked);
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${isChecked ? 'bg-gray-50 opacity-75' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-5 h-5 text-yellow-400 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
        />

        {/* Ingredient Details */}
        <div className="flex-1">
          <div className={`text-gray-800 ${isChecked ? 'line-through text-gray-500' : ''}`}>
            <span className="font-medium">
              {ingredient.quantity && ingredient.unit
                ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                : ingredient.name
              }
            </span>
          </div>

          {/* Show original quantities if there were multiple entries aggregated */}
          {ingredient.originalEntries && ingredient.originalEntries.length > 1 && (
            <div className="text-xs text-gray-500 mt-1">
              Combined from: {ingredient.originalEntries.map(entry =>
                entry.quantity && entry.unit
                  ? `${entry.quantity} ${entry.unit}`
                  : entry.quantity || 'some'
              ).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;