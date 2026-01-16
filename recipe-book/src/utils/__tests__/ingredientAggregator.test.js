import {
  aggregateIngredients,
  formatIngredient,
  sortIngredients,
} from '../ingredientAggregator';

describe('ingredientAggregator', () => {
  describe('aggregateIngredients', () => {
    it('should return empty array for invalid input', () => {
      expect(aggregateIngredients(null)).toEqual([]);
      expect(aggregateIngredients(undefined)).toEqual([]);
      expect(aggregateIngredients('not an array')).toEqual([]);
      expect(aggregateIngredients([])).toEqual([]);
    });

    it('should aggregate ingredients with same name and unit', () => {
      const ingredients = [
        { quantity: 2, unit: 'cups', name: 'flour' },
        { quantity: 1, unit: 'cups', name: 'flour' },
        { quantity: 3, unit: 'cups', name: 'sugar' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(2);

      const flour = result.find(item => item.name === 'flour');
      const sugar = result.find(item => item.name === 'sugar');

      expect(flour.quantity).toBe(3);
      expect(flour.unit).toBe('cups');
      expect(flour.count).toBe(2);

      expect(sugar.quantity).toBe(3);
      expect(sugar.unit).toBe('cups');
      expect(sugar.count).toBe(1);
    });

    it('should keep separate entries for same name but different units', () => {
      const ingredients = [
        { quantity: 2, unit: 'cups', name: 'flour' },
        { quantity: 1, unit: 'lb', name: 'flour' },
        { quantity: 3, unit: 'cups', name: 'sugar' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(3);

      const flourCups = result.find(item => item.name === 'flour' && item.unit === 'cups');
      const flourLb = result.find(item => item.name === 'flour' && item.unit === 'lb');
      const sugar = result.find(item => item.name === 'sugar');

      expect(flourCups.quantity).toBe(2);
      expect(flourLb.quantity).toBe(1);
      expect(sugar.quantity).toBe(3);
    });

    it('should handle case-insensitive name matching', () => {
      const ingredients = [
        { quantity: 2, unit: 'cups', name: 'Flour' },
        { quantity: 1, unit: 'cups', name: 'flour' },
        { quantity: 3, unit: 'cups', name: 'FLOUR' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Flour'); // Should keep first encountered casing
      expect(result[0].quantity).toBe(6);
      expect(result[0].count).toBe(3);
    });

    it('should normalize units to lowercase', () => {
      const ingredients = [
        { quantity: 2, unit: 'CUPS', name: 'flour' },
        { quantity: 1, unit: 'cups', name: 'flour' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(3);
      expect(result[0].unit).toBe('CUPS'); // Should keep original casing
    });

    it('should handle ingredients without units', () => {
      const ingredients = [
        { quantity: 2, name: 'salt' },
        { quantity: 1, name: 'salt' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(3);
      expect(result[0].unit).toBe('');
      expect(result[0].count).toBe(2);
    });

    it('should skip ingredients with invalid quantities', () => {
      const ingredients = [
        { quantity: 2, unit: 'cups', name: 'flour' },
        { quantity: 0, unit: 'cups', name: 'sugar' },
        { quantity: -1, unit: 'cups', name: 'salt' },
        { quantity: 'invalid', unit: 'cups', name: 'pepper' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('flour');
      expect(result[0].quantity).toBe(2);
    });

    it('should skip ingredients without names', () => {
      const ingredients = [
        { quantity: 2, unit: 'cups', name: 'flour' },
        { quantity: 1, unit: 'cups' }, // No name
        { quantity: 3, unit: 'cups', name: '' }, // Empty name
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('flour');
      expect(result[0].quantity).toBe(2);
    });

    it('should handle decimal quantities', () => {
      const ingredients = [
        { quantity: 0.5, unit: 'cups', name: 'flour' },
        { quantity: 1.25, unit: 'cups', name: 'flour' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(1.75);
    });

    it('should handle whitespace in names and units', () => {
      const ingredients = [
        { quantity: 2, unit: ' cups ', name: ' flour ' },
        { quantity: 1, unit: 'cups', name: 'flour' },
      ];

      const result = aggregateIngredients(ingredients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(' flour '); // Keeps original whitespace
      expect(result[0].quantity).toBe(3);
    });
  });

  describe('formatIngredient', () => {
    it('should format ingredient correctly', () => {
      const ingredient = { quantity: 2, unit: 'cups', name: 'flour' };
      const result = formatIngredient(ingredient);
      expect(result).toBe('2 cups flour');
    });

    it('should handle ingredients without units', () => {
      const ingredient = { quantity: 2, name: 'salt' };
      const result = formatIngredient(ingredient);
      expect(result).toBe('2 salt');
    });

    it('should handle empty units', () => {
      const ingredient = { quantity: 2, unit: '', name: 'salt' };
      const result = formatIngredient(ingredient);
      expect(result).toBe('2 salt');
    });

    it('should return empty string for invalid input', () => {
      expect(formatIngredient(null)).toBe('');
      expect(formatIngredient(undefined)).toBe('');
      expect(formatIngredient({})).toBe('');
    });
  });

  describe('sortIngredients', () => {
    it('should sort ingredients alphabetically by name', () => {
      const ingredients = [
        { name: 'Zucchini' },
        { name: 'Apple' },
        { name: 'banana' },
      ];

      const result = sortIngredients(ingredients);

      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('banana');
      expect(result[2].name).toBe('Zucchini');
    });

    it('should handle case-insensitive sorting', () => {
      const ingredients = [
        { name: 'apple' },
        { name: 'Banana' },
        { name: 'cherry' },
      ];

      const result = sortIngredients(ingredients);

      expect(result[0].name).toBe('apple');
      expect(result[1].name).toBe('Banana');
      expect(result[2].name).toBe('cherry');
    });

    it('should handle empty or invalid input', () => {
      expect(sortIngredients(null)).toEqual([]);
      expect(sortIngredients(undefined)).toEqual([]);
      expect(sortIngredients('not an array')).toEqual([]);
      expect(sortIngredients([])).toEqual([]);
    });

    it('should handle ingredients without names', () => {
      const ingredients = [
        { name: 'Apple' },
        {},
        { name: 'Banana' },
      ];

      const result = sortIngredients(ingredients);

      expect(result[0].name).toBe('Apple');
      expect(result[1].name).toBe('Banana');
      expect(result[2].name).toBeUndefined();
    });
  });
});