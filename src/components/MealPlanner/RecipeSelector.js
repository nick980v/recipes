"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import RecipeCard from "@/components/RecipeCard";

const RecipeSelector = ({ recipes = [], isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const recipeListRef = useRef(null);

  const handleRecipeClick = useCallback(
    (recipe) => {
      if (onSelect) {
        onSelect(recipe);
      }
      onClose();
    },
    [onSelect, onClose]
  );

  // Prevent link navigation when clicking on recipe cards
  useEffect(() => {
    if (!isOpen || !recipeListRef.current) return;

    const handleLinkClick = (e) => {
      const link = e.target.closest("a");
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        // Find the recipe card parent and trigger selection
        const cardContainer = link.closest("[data-recipe-id]");
        if (cardContainer) {
          const recipeId = cardContainer.getAttribute("data-recipe-id");
          const recipe = recipes.find(
            (r) => (r.id || r.documentId)?.toString() === recipeId
          );
          if (recipe) {
            handleRecipeClick(recipe);
          }
        }
      }
    };

    const listElement = recipeListRef.current;
    listElement.addEventListener("click", handleLinkClick, true); // Use capture phase

    return () => {
      listElement.removeEventListener("click", handleLinkClick, true);
    };
  }, [isOpen, recipes, handleRecipeClick]);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipes;
    }

    const query = searchQuery.toLowerCase();
    return recipes.filter((recipe) => {
      const title = recipe.Title?.toLowerCase() || "";
      const instructions = recipe.Instructions?.toLowerCase() || "";
      const tags =
        recipe.recipe_tags?.map((tag) => tag.Tag?.toLowerCase()).join(" ") ||
        "";

      return (
        title.includes(query) ||
        instructions.includes(query) ||
        tags.includes(query)
      );
    });
  }, [recipes, searchQuery]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Select a Recipe</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition-colors text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search recipes by name, tags, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto p-4" ref={recipeListRef}>
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? `No recipes found matching "${searchQuery}"`
                : "No recipes available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id || recipe.documentId}
                  data-recipe-id={recipe.id || recipe.documentId}
                  onClick={(e) => {
                    // Prevent navigation from Link inside RecipeCard
                    e.preventDefault();
                    e.stopPropagation();
                    handleRecipeClick(recipe);
                  }}
                  className="cursor-pointer"
                >
                  <RecipeCard recipe={recipe} showTag={true} priority={false} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-600 text-center">
            {filteredRecipes.length} recipe
            {filteredRecipes.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSelector;
