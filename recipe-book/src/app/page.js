// src/app/recipes/page.js
import axios from "axios";
import RecipeCard from "./components/RecipeCard";

const token =
  "e1b1838342b4b18e7b8e1a943b06b76abd24f993001c24dfddd5858dd44ef71d2bfb70dcb91957a87b9a270903aa2e1dd791c89b3a28977015564ad1a44a1bd2f7ef9611fb6563169eed9547083548b7722314432dfc25024b86e128610bd8844b9ee6a68c1944ea32134fa62fb2e8054c3853cfcbcc4104dfd879f9d2dcac79";

const fetchRecipes = async () => {
  // Fetch data from Strapi API
  const res = await axios.get("http://localhost:1337/api/recipes?populate=*", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("RES DATA", res.data);
  return res.data.data;
};

const HomePage = async () => {
  const recipes = await fetchRecipes();
  console.log("test", recipes);
  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-8">Browse Recipes</h2>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
