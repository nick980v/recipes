import { renderHook, act } from '@testing-library/react';
import { useMealPlan } from '../useMealPlan';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useMealPlan', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should initialize with null meal plan when no data exists', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    expect(result.current.mealPlan).toBeNull();
  });

  it('should load existing meal plan from localStorage', () => {
    const mockMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' }
        }
      }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ '2024-01-01': mockMealPlan }));

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    expect(result.current.mealPlan).toEqual(mockMealPlan);
  });

  it('should add a meal and save to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({}));
    const mockRecipe = {
      id: 1,
      attributes: { Title: 'Pancakes' }
    };

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    act(() => {
      result.current.addMeal('monday', 'breakfast', mockRecipe);
    });

    const expectedMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          breakfast: { recipeId: '1', recipeTitle: 'Pancakes' }
        }
      }
    };

    expect(result.current.mealPlan).toEqual(expectedMealPlan);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'mealPlans',
      JSON.stringify({ '2024-01-01': expectedMealPlan })
    );
  });

  it('should remove a meal and update localStorage', () => {
    const initialMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' },
          lunch: { recipeId: '2', recipeTitle: 'Sandwich' }
        }
      }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ '2024-01-01': initialMealPlan }));

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    act(() => {
      result.current.removeMeal('monday', 'breakfast');
    });

    const expectedMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: {
          lunch: { recipeId: '2', recipeTitle: 'Sandwich' }
        }
      }
    };

    expect(result.current.mealPlan).toEqual(expectedMealPlan);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'mealPlans',
      JSON.stringify({ '2024-01-01': expectedMealPlan })
    );
  });

  it('should clear all meals for the week', () => {
    const initialMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: { breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' } },
        tuesday: { lunch: { recipeId: '2', recipeTitle: 'Sandwich' } }
      }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ '2024-01-01': initialMealPlan }));

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    act(() => {
      result.current.clearWeek();
    });

    const expectedMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {}
    };

    expect(result.current.mealPlan).toEqual(expectedMealPlan);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'mealPlans',
      JSON.stringify({ '2024-01-01': expectedMealPlan })
    );
  });

  it('should return current meal plan via getWeekPlan', () => {
    const mockMealPlan = {
      weekStartDate: '2024-01-01',
      meals: {
        monday: { breakfast: { recipeId: '1', recipeTitle: 'Oatmeal' } }
      }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ '2024-01-01': mockMealPlan }));

    const { result } = renderHook(() => useMealPlan('2024-01-01'));

    expect(result.current.getWeekPlan()).toEqual(mockMealPlan);
  });
});