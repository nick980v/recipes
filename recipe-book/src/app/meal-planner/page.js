import React from "react";
import MealPlannerClient from "./MealPlannerClient";
import { unstable_cache } from "next/cache";

const endpoint = process.env.STRAPI_ENDPOINT;

// Configure static generation and caching
export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)
export const dynamic = "force-static"; // Prefer static generation

const fetchRecipes = async () => {
  // Check if environment variables are configured
  if (!endpoint || !process.env.STRAPI_TOKEN) {
    console.warn("Strapi environment variables not configured");
    return [];
  }

  try {
    // Fetch data from Strapi API
    const res = await fetch(`${endpoint}?populate=*`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      cache: "force-cache",
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch recipes: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// Cache the fetch function to reduce edge invocations
const getCachedRecipes = unstable_cache(
  async () => {
    return await fetchRecipes();
  },
  ["recipes-list"],
  {
    revalidate: 86400, // Cache for 24 hours
    tags: ["recipes"],
  }
);

const MealPlannerPage = async () => {
  const recipes = await getCachedRecipes();

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Meal Planner</h1>
      {!endpoint || !process.env.STRAPI_TOKEN ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Configuration Required
          </h2>
          <p className="text-yellow-700 mb-4">
            The meal planner requires Strapi API configuration to fetch recipes.
          </p>
          <p className="text-sm text-yellow-600">
            Please set the following environment variables:
          </p>
          <ul className="text-sm text-yellow-600 mt-2 list-disc list-inside">
            <li>
              <code>STRAPI_ENDPOINT</code> - Your Strapi API endpoint
            </li>
            <li>
              <code>STRAPI_TOKEN</code> - Your Strapi API token
            </li>
          </ul>
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            No Recipes Found
          </h2>
          <p className="text-blue-700">
            No recipes are available. Please add some recipes to your Strapi
            instance to use the meal planner.
          </p>
        </div>
      ) : (
        <MealPlannerClient recipes={recipes} />
      )}
    </div>
  );
};

export default MealPlannerPage;
