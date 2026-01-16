import RecipeCard from "@/components/RecipeCard";
import { unstable_cache } from "next/cache";

const endpoint = process.env.STRAPI_ENDPOINT;

// Configure static generation and caching
export const revalidate = 86400; // Revalidate every 24 hours (86400 seconds)
export const dynamic = "force-static"; // Prefer static generation

const fetchRecipes = async () => {
  // Fetch data from Strapi API
  const res = await fetch(`${endpoint}?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache: "force-cache",
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();
  return data.data;
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

const HomePage = async () => {
  const recipes = await getCachedRecipes();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* Meal Planner CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-12 border border-blue-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Meals
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Organise your weekly meals with our interactive meal planner. Drag
            and drop recipes to plan breakfast, lunch, and dinner for each day.
          </p>
          <a
            href="/meal-planner"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Open Meal Planner
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-8">Browse Recipes</h2>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            showTag={true}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
