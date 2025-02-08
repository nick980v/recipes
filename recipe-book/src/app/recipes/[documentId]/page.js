import React from "react";
import axios from "axios";
import Image from "next/image";

const token =
  "e1b1838342b4b18e7b8e1a943b06b76abd24f993001c24dfddd5858dd44ef71d2bfb70dcb91957a87b9a270903aa2e1dd791c89b3a28977015564ad1a44a1bd2f7ef9611fb6563169eed9547083548b7722314432dfc25024b86e128610bd8844b9ee6a68c1944ea32134fa62fb2e8054c3853cfcbcc4104dfd879f9d2dcac79";

const fetchRecipe = async (documentId) => {
  const res = await axios.get(
    `http://localhost:1337/api/recipes/${documentId}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data.data;
};

const RecipeDetailPage = async ({ params }) => {
  const { documentId } = await params;
  const recipe = await fetchRecipe(documentId);
  console.log("recipe", recipe);
  if (!recipe) {
    return <div>Error: Recipe not found</div>;
  }

  const imageUrl = recipe.Image?.url
    ? `http://localhost:1337${recipe.Image.url}`
    : null;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Recipe Image */}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={recipe.Title}
            width={200} // Adjust width as desired
            height={100} // Adjust height as desired
            className="rounded-md object-cover w-40 mb-6 max-w-sm mx-auto"
          />
        )}

        {/* Recipe Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          {recipe.Title}
        </h1>

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            {recipe.Ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700 text-lg">
                {ingredient.children.map((child, childIndex) => (
                  <p key={childIndex} className="text-sm text-gray-600">
                    {child.value}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <p className="text-lg text-gray-700">{recipe.Instructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
