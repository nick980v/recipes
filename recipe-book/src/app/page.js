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
