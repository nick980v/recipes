import { renderHook, act, waitFor } from '@testing-library/react';
import { useShoppingList } from '../useShoppingList';

// Mock the useMealPlan hook
jest.mock('../useMealPlan', () => ({
  useMealPlan: jest.fn(),
}));

// Mock the ingredientAggregator
jest.mock('@/utils/ingredientAggregator', () => ({
  aggregateIngredients: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockUseMealPlan = require('../useMealPlan').useMealPlan;
const mockAggregateIngredients = require('@/utils/ingredientAggregator').aggregateIngredients;

describe('useShoppingList', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock environment variables
    process.env.NEXT_PUBLIC_STRAPI_ENDPOINT = 'https://api.example.com/recipes';
    process.env.NEXT_PUBLIC_STRAPI_TOKEN = 'test-token';

    // Default mock for useMealPlan
    mockUseMealPlan.mockReturnValue({
      mealPlan: null,
    });
  });

  it('should initialize with empty shopping list when no meal plan exists', () => {
    mockUseMealPlan.mockReturnValue({
      mealPlan: null,
    });

    const { result } = renderHook(() => useShoppingList('2024-01-01'));

    expect(result.current.shoppingList).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should generate shopping list from meal plan', async () => {
    const mockMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' },
          lunch: { recipeId: '2', recipeTitle: 'Sandwich' }
        }
      }
    };

    const mockRecipe1 = {
      data: {
        attributes: {
          Ingredients: [
            { name: 'oats', quantity: '1', unit: 'cup' },
            { name: 'milk', quantity: '1', unit: 'cup' }
          ]
        }
      }
    };

    const mockRecipe2 = {
      data: {
        attributes: {
          Ingredients: [
            { name: 'bread', quantity: '2', unit: 'slices' },
            { name: 'milk', quantity: '0.5', unit: 'cup' }
          ]
        }
      }
    };

    const mockAggregatedIngredients = [
      { name: 'oats', quantity: '1', unit: 'cup' },
      { name: 'bread', quantity: '2', unit: 'slices' },
      { name: 'milk', quantity: '1.5', unit: 'cups' }
    ];

    mockUseMealPlan.mockReturnValue({
      mealPlan: mockMealPlan,
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipe1)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipe2)
      });

    mockAggregateIngredients.mockReturnValue(mockAggregatedIngredients);

    const { result } = renderHook(() => useShoppingList('2024-01-01'));

    // Wait for the shopping list to be generated
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockAggregateIngredients).toHaveBeenCalledWith([
      { name: 'oats', quantity: '1', unit: 'cup' },
      { name: 'milk', quantity: '1', unit: 'cup' },
      { name: 'bread', quantity: '2', unit: 'slices' },
      { name: 'milk', quantity: '0.5', unit: 'cup' }
    ]);

    expect(result.current.shoppingList).toEqual(mockAggregatedIngredients);
  });

  it('should handle fetch errors gracefully', async () => {
    const mockMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' }
        }
      }
    };

    mockUseMealPlan.mockReturnValue({
      mealPlan: mockMealPlan,
    });

    global.fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useShoppingList('2024-01-01'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.shoppingList).toEqual([]);
  });

  it('should clear shopping list when meal plan becomes null', () => {
    mockUseMealPlan.mockReturnValue({
      mealPlan: {
        weekStartDate: '2024-01-01',
        meals: {
          monday: { breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' } }
        }
      }
    });

    const { result, rerender } = renderHook(() => useShoppingList('2024-01-01'));

    // Initially should have a meal plan
    expect(result.current.shoppingList).toEqual([]);

    // Change meal plan to null
    mockUseMealPlan.mockReturnValue({
      mealPlan: null,
    });

    rerender();

    expect(result.current.shoppingList).toEqual([]);
  });
});