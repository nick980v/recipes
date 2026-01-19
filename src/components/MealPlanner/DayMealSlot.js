"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RecipeSelector from "./RecipeSelector";

const DayMealSlot = ({
  day,
  mealType,
  assignedRecipe,
  recipes = [],
  onSelectRecipe,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleSlotClick = () => {
    setIsSelectorOpen(true);
  };

  const handleRecipeSelect = (recipe) => {
    if (onSelectRecipe) {
      onSelectRecipe(day, mealType, recipe);
    }
  };

  const handleRemoveRecipe = (e) => {
    e.stopPropagation();
    if (onSelectRecipe) {
      // Pass null to remove the recipe
      onSelectRecipe(day, mealType, null);
    }
  };

  return (
    <>
      <div
        className={`border border-gray-300 rounded-lg p-3 min-h-[120px] cursor-pointer transition-all hover:border-yellow-400 hover:shadow-md ${
          assignedRecipe ? "bg-gray-50" : "bg-white"
        }`}
        onClick={handleSlotClick}
      >
        {assignedRecipe ? (
          <div className="relative h-full">
            {/* Remove button */}
            <button
              onClick={handleRemoveRecipe}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors z-10"
              aria-label="Remove recipe"
            >
              ×
            </button>

            {/* Recipe Title */}
            <Link
              href={`/recipes/${assignedRecipe.recipeId}`}
              onClick={(e) => e.stopPropagation()}
              className="block"
            >
              <h4 className="text-sm font-semibold text-gray-800 mb-2 pr-6 line-clamp-2">
                {assignedRecipe.recipeTitle}
              </h4>
            </Link>

            {/* Recipe Image (if available) */}
            {assignedRecipe.imageUrl && (
              <Link
                href={`/recipes/${assignedRecipe.recipeId}`}
                onClick={(e) => e.stopPropagation()}
                className="block"
              >
                <div className="relative w-full h-20 rounded-md overflow-hidden">
                  <Image
                    src={assignedRecipe.imageUrl}
                    alt={assignedRecipe.recipeTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[80px] text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-1">+</div>
              <div className="text-xs">Add Recipe</div>
            </div>
          </div>
        )}
      </div>

      <RecipeSelector
        recipes={recipes}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleRecipeSelect}
      />
    </>
  );
};

export default DayMealSlot;
