"use client";

import React, { useState, useMemo } from "react";
import IngredientItem from "./IngredientItem";
import { sortIngredients } from "@/utils/ingredientAggregator";

const ShoppingList = ({ shoppingList = [], isLoading, error, onRefresh }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  // Sort shopping list alphabetically
  const sortedShoppingList = useMemo(() => {
    return sortIngredients(shoppingList);
  }, [shoppingList]);

  const handleItemCheck = (ingredientKey, checked) => {
    const newCheckedItems = new Set(checkedItems);
    if (checked) {
      newCheckedItems.add(ingredientKey);
    } else {
      newCheckedItems.delete(ingredientKey);
    }
    setCheckedItems(newCheckedItems);
  };

  const clearCheckedItems = () => {
    setCheckedItems(new Set());
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating shopping list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p className="mb-4">Error generating shopping list: {error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (shoppingList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No ingredients to shop for</p>
          <p className="text-sm mb-4">
            Add some recipes to your meal plan to generate a shopping list.
          </p>
          {!process.env.NEXT_PUBLIC_STRAPI_ENDPOINT ||
          !process.env.NEXT_PUBLIC_STRAPI_TOKEN ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Shopping list generation requires Strapi
                API configuration.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const checkedCount = checkedItems.size;
  const totalCount = sortedShoppingList.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Shopping List ({totalCount} items)
            </h2>
            {checkedCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {checkedCount} of {totalCount} items checked
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {checkedCount > 0 && (
              <button
                onClick={clearCheckedItems}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Checked
              </button>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 text-sm bg-yellow-400 text-white hover:bg-yellow-500 rounded-lg transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="divide-y divide-gray-100">
        {sortedShoppingList.map((ingredient, index) => {
          const ingredientKey = `${ingredient.name}-${
            ingredient.unit || ""
          }-${index}`;
          return (
            <IngredientItem
              key={ingredientKey}
              ingredient={ingredient}
              isChecked={checkedItems.has(ingredientKey)}
              onCheck={(checked) => handleItemCheck(ingredientKey, checked)}
            />
          );
        })}
      </div>

      {/* Footer */}
      {checkedCount === totalCount && totalCount > 0 && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <div className="text-center text-green-700">
            <p className="font-medium">🎉 All items checked!</p>
            <p className="text-sm mt-1">Happy shopping!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
