/**
 * Aggregates ingredients by name, combining quantities when units match
 * @param {Array} ingredients - Array of ingredient objects with quantity, unit, and name properties
 * @returns {Array} - Aggregated ingredients array
 */
export function aggregateIngredients(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) {
    return [];
  }

  const aggregated = {};

  // Group ingredients by normalized name and unit
  ingredients.forEach((ingredient) => {
    if (!ingredient || !ingredient.name) {
      return; // Skip invalid ingredients
    }

    const normalizedName = ingredient.name.toLowerCase().trim();
    const unit = (ingredient.unit || "").toLowerCase().trim();
    const quantity = parseFloat(ingredient.quantity) || 0;

    if (quantity <= 0) {
      return; // Skip ingredients with invalid quantities
    }

    // Create a key combining name and unit
    const key = `${normalizedName}::${unit}`;

    if (!aggregated[key]) {
      aggregated[key] = {
        name: ingredient.name, // Keep original casing
        unit: ingredient.unit || "",
        quantity: 0,
        count: 0, // Track how many times this ingredient appears
      };
    }

    aggregated[key].quantity += quantity;
    aggregated[key].count += 1;
  });

  // Convert back to array format
  return Object.values(aggregated);
}

/**
 * Formats an ingredient for display
 * @param {Object} ingredient - Ingredient object with quantity, unit, and name
 * @returns {string} - Formatted ingredient string
 */
export function formatIngredient(ingredient) {
  if (!ingredient) return "";

  const quantity = ingredient.quantity;
  const unit = ingredient.unit || "";
  const name = ingredient.name || "";

  return `${quantity} ${unit} ${name}`.trim();
}

/**
 * Sorts ingredients alphabetically by name
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {Array} - Sorted ingredients array
 */
export function sortIngredients(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) {
    return [];
  }

  return [...ingredients].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
