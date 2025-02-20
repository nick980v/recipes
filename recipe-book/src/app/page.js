import RecipeCard from "@/components/RecipeCard";

const endpoint = process.env.STRAPI_ENDPOINT;

const fetchRecipes = async () => {
  // Fetch data from Strapi API
  const res = await fetch(`${endpoint}?populate=*`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    cache: "force-cache",
    next: { revalidate: false }, // Ensures Vercel caches it properly
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data = await res.json();
  return data.data;
};

const HomePage = async () => {
  const recipes = await fetchRecipes();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-8">Browse Recipes</h2>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} showTag={true} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
