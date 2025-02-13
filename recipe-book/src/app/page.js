// src/app/recipes/page.js
import axios from "axios";
import RecipeCard from "@/components/RecipeCard";

const token = process.env.STRAPI_TOKEN;
const endpoint = process.env.STRAPI_ENDPOINT;

const fetchRecipes = async () => {
  // Fetch data from Strapi API
  const res = await axios.get(`${endpoint}?populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // console.log("RES DATA", res.data);
  return res.data.data;
};

const HomePage = async () => {
  const recipes = await fetchRecipes();
  // const recipes = await getRecipes(endpoint, token);

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
